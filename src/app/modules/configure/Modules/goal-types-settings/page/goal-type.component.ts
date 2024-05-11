import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from './../../../../../core/services/http-handler.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { finalize, takeUntil } from 'rxjs/operators';
import {  IGoalTypeSettings } from '../Interfaces/interfaces';
import { Subject } from 'rxjs';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-goal-type',
  templateUrl: './goal-type.component.html',
  styleUrls: ['./goal-type.component.scss'],
})
export class GoalTypeComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public isShowCreateTypePopup: boolean = false;
  public language = this.translateSer.currentLang;
  public loading: boolean = false;
  public GoalTypes: IGoalTypeSettings[] = [];
  public FilteredGoalTypes: IGoalTypeSettings[] = [];
  public categories:{label:string,id:number}[]=[
    { id: 1, label: this.translateSer.instant("configuration.goalTypesObj.Informational")},
    { id: 2, label: this.translateSer.instant("configuration.goalTypesObj.Measurable") }
  ]
  private searchKeyword: string = "";
  private filteredCategory:number | null = null;
  // CONSTRUCTOR
  constructor(
    private httpHandlerService: HttpHandlerService,
    private translateSer: TranslateService,
    private modelService: ModelService,
    private toastSer:ToastrService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.getAllGoalTypes();
  }

  private handleLangChange() {
    this.translateSer.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateSer.currentLang;
        this.categories = [
          { id: 1, label: this.translateSer.instant("configuration.goalTypesObj.Informational") },
          { id: 2, label: this.translateSer.instant("configuration.goalTypesObj.Measurable") }
        ]
      });
  }

  public openPopup() {
    this.isShowCreateTypePopup = true;
    this.modelService.open('create-goal');
  }

  public closePopup() {
    this.isShowCreateTypePopup = false;
    this.modelService.close();
  }

  public handleSearchValueFilter(keyword: string): void {
    this.searchKeyword = keyword;
    this.hndleFilter()
  }

  public handlecateoriesFilter(category:any){
    category ? this.filteredCategory = category.id : this.filteredCategory = null;
    this.hndleFilter()
  }

  public hndleFilter(){
    this.FilteredGoalTypes = this.GoalTypes.filter(
      (type) =>
        type.name.toLocaleLowerCase().includes(this.searchKeyword.toLocaleLowerCase()) ||
        type.arabicName
          .toLocaleLowerCase()
          .includes(this.searchKeyword.toLocaleLowerCase())
    );
    if(this.filteredCategory){
      this.FilteredGoalTypes = this.FilteredGoalTypes.filter((goalType)=>goalType.category == this.filteredCategory);
    }
  }

  getAllGoalTypes() {
    this.loading = true;
    this.httpHandlerService
      .get(Config.Configuration.GetAllGoal)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.GoalTypes = res;
        this.FilteredGoalTypes = this.GoalTypes;
      });
  }

  public deleteTypeHandler(goalTypeId:string){
    this.httpHandlerService.delete(`${Config.GoalTypes.delete}/${goalTypeId}`).pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.toastSer.success(this.translateSer.instant("configuration.goalTypesObj.successDeleted"));
      this.FilteredGoalTypes = this.FilteredGoalTypes.filter((type)=>type.id != +goalTypeId)
      this.GoalTypes = this.GoalTypes.filter((type)=>type.id != +goalTypeId)
    })
  }

  public editTypeHandler(editedGoal:IGoalTypeSettings){
    let typeIndexInGeneralTypes = this.GoalTypes.findIndex((type)=>type.id == editedGoal.id)
    if (typeIndexInGeneralTypes > -1){
      this.GoalTypes[typeIndexInGeneralTypes] = {
        ...this.GoalTypes[typeIndexInGeneralTypes],
        ...editedGoal
      }
    }
    let typeIndexInFilteredTypes = this.FilteredGoalTypes.findIndex((type) => type.id == editedGoal.id)
    if (typeIndexInFilteredTypes > -1) {
      this.GoalTypes[typeIndexInFilteredTypes] = {
        ...this.GoalTypes[typeIndexInFilteredTypes],
        ...editedGoal
      }
    }
  }

  // ON DESTROY
  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
