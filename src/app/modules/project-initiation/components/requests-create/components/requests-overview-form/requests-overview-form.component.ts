import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { LookupService } from 'src/app/core/services/lookup.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';
import { UserService } from 'src/app/core/services/user.service';
import { RequestsCreateService } from '../../services/requests.service';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requests-overview-form',
  templateUrl: './requests-overview-form.component.html',
  styleUrls: ['./requests-overview-form.component.scss']
})
export class RequestsOverviewFormComponent implements OnInit {
  overviewFrom: FormGroup;
  @Input() readOnly: boolean
  @Input() isFormSubmitted: boolean
  @Input() data: any
  @Input() projectTypes: any
  @Input() projectPriorities: any
  @Input() projectCategories: any
  @Input() projectOrigins: any
  @Input() criterias: any
  @Input() lang: string
  @Output() setPriority: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateData: EventEmitter<any> = new EventEmitter();

  searching: boolean;
  canSetPriotity: any;
  constructor(private fb: FormBuilder,
    private translationService: TranslateConfigService,
    private requestsCreateService: RequestsCreateService,
    private userService: UserService,
    private router: Router,
    private http: HttpHandlerService,
    private toastr: ToastrService,
    private lookupService: LookupService) { }

  ngOnInit() {
    this.initOverviewForm()
    this.canSetPriotity = this.userService.getCurrentUserClaims().includes(4000)
  }

  initOverviewForm() {
    this.overviewFrom = this.fb.group({
      projectName: [null, Validators.required],
      projectType: [[], Validators.required],
      projectDescription: [null, Validators.required],
      projectCategory: [[], Validators.required],
      projectScope: [null, Validators.required],
      projectOutOfScope: [null, Validators.required],
      projectOutcomes: [null, Validators.required],
      projectExpectedBenefits: [null, Validators.required],
      projectOrigin: [[], Validators.required],
      projectIdea: [null],
    })

    this.overviewFrom.statusChanges.subscribe(status => {
      this.requestsCreateService.saveStepperState("overviewForm", status === "VALID" ? true : false)
    })
  }

  get getOverviewForm() {
    return this.overviewFrom.controls
  }

  get isIdea() {
    return this.overviewFrom.get('projectOrigin').value.find(e=>e.code=='Idea');
  }

  formatter = (x: any) => this.lang === 'en' ? x.title : x.title;
  searchIdeas: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.requestsCreateService.searchApprovedIdeas({
          "keyword": term,
          "sortBy": null,
          "page": 1,
          "pageSize": 1000
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )


    onTypeChange(e) {
      let innovativeProjectType;
      if(Array.isArray(e)){
        innovativeProjectType = e.find(type=>type.code === 'Innovative Project');
      }else if(e){
        innovativeProjectType = (e.code === 'Innovative Project');
      }
      
      if(innovativeProjectType) {
        this.overviewFrom.controls.projectIdea.setValidators([Validators.required]);
        this.overviewFrom.controls.projectIdea.updateValueAndValidity();
      } else {
        this.overviewFrom.controls.projectIdea.setValidators([]);
        this.overviewFrom.controls.projectIdea.setValue(null);
      }
    }

  onOriginChange(e) {
    let innovativeProjectOrigin;
    if(Array.isArray(e)){
      innovativeProjectOrigin = e.find(origin=>origin.code === 'Idea');
    }else if(e){
      innovativeProjectOrigin = (e.code === 'Innovative Idea');
    }

    if (innovativeProjectOrigin) {
      this.overviewFrom.controls.projectIdea.setValidators([Validators.required])
      this.overviewFrom.controls.projectIdea.updateValueAndValidity()
    } else {
      this.overviewFrom.controls.projectIdea.setValidators([])
      this.overviewFrom.controls.projectIdea.setValue(null)
    }
  }

  onSetPriority() {
    this.setPriority.emit()
  }


  cloneRequest(){
  this.onUpdateData.emit();
  }

}
