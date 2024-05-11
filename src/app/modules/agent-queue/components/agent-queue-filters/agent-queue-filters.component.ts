import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { AgentQueueStatusMode } from '../agent-queue-table/enums';
import { Lookup } from 'src/app/core/models/lookup';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { StructureLookups } from 'src/app/utils/loockups.utils';

@Component({
  selector: 'agent-queue-filters',
  templateUrl: './agent-queue-filters.component.html',
  styleUrls: ['./agent-queue-filters.component.scss'],
})

export class AgentQueueFiltersComponent implements OnInit , OnChanges {

  @Input() isDownloading:boolean = false;
  @Input() totalItems:number = 0;
  @Input() filters:any = {
    assignedToMe: 0,
    HasSlaOn : 0,
  };
  @Output() onStatesFilter = new EventEmitter();
  @Output() onCategoriesFilter = new EventEmitter();
  @Output() onAssignedToMeFilter = new EventEmitter();
  @Output() onSLAFilter = new EventEmitter();
  @Output() onHandleAdvancedFilter = new EventEmitter();
  @Output() exportDataEvent = new EventEmitter();

  // requesters: any[] = [];
  assignees: any[] = [];
  states: any[] = [];
  // services: Service[] = [];
  categories: Lookup[] = [];
  language: string = this.translate.currentLang;
  agentQueueStatusMode = AgentQueueStatusMode;
  loading: boolean = false;
  selectedState  = {id : null};
  selectedCategory = {id : null};

  constructor(private translate: TranslateService, private httpHandlerService: HttpHandlerService) {}

  ngOnInit(): void {
    this.getLookUps();
    this.loadStates();
    this.handleLangChange();
  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters(){
    if(this.filters){
      const findState = this.states.filter(state => {
        return state?.key == this.filters?.status;
      })[0];
      if(findState && this.filters?.status){
        this.selectedState = findState;
      }
      const findCategory = this.categories.filter(category => {
        return category?.id == this.filters?.categoryId;
      })[0];
      if(findCategory && this.filters?.categoryId)
        this.selectedCategory = findCategory;
      // if (typeof this.filters.assignedToMe != "boolean") {
      //   this.filters.assignedToMe = (this.filters.assignedToMe == "true");
      // }
      // if (typeof this.filters.HasSlaOn != "boolean") {
      //   this.filters.HasSlaOn = (this.filters.HasSlaOn == "true");
      // }
    }
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.loadStates();
    });
  }

  handleCategoryFilter(categoryId: number) {
    this.onCategoriesFilter.emit(categoryId);
  }

  handleStatusesFilter(status: AgentQueueStatusMode) {
    this.onStatesFilter.emit(status);
  }

  // Load States
  public loadStates() {
    let temp = new Array<Lookup>();

    // let newLabel = this.translate.instant('shared.new');
    let inProgress = this.translate.instant('shared.open');
    let closed = this.translate.instant('shared.closed');

    // temp.push(new Lookup(AgentQueueStatusMode.New, newLabel));
    temp.push(new Lookup(AgentQueueStatusMode.Inprogress, inProgress));
    temp.push(new Lookup(AgentQueueStatusMode.Closed, closed));

    this.states = temp;
    return this.states;
  }

  //get lookups for dropdowns
  public getLookUps() {
    this.loading = true;

    // const requesterModel = {
    //   pageIndex: 1,
    //   pageSize: 100,
    // };
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    // const requesters = this.httpHandlerService.get(
    //   Config.UserManagement.GetAll,
    //   requesterModel
    // );
    // const assignees = this.httpHandlerService.get(Config.Lookups.lookupAgent);
    // const services = this.httpHandlerService.get(Config.Service.getService);
    const categories = this.httpHandlerService.get(
      Config.Lookups.lookupService,
      queryServiceDesk
    );
    this.states = this.loadStates();
    // assignees
    forkJoin({  categories })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        // this.requesters = res.requesters;
        // this.assignees = res.assignees;
        // this.services = res.services;
        this.categories = StructureLookups(res.categories).Category;
        this.setFilters();
      });
  }

  // onFilter() {
  //   this.popupService.open('agent-filter');
  // }

  // onHandleFilter(data: any) {
  //   this.onHandleAdvancedFilter.emit(data);
  // }

  onAssignedToMeChange(e) {
    this.filters.assignedToMe = !this.filters.assignedToMe;
    this.onAssignedToMeFilter.emit(e);
  }

  onSLAChange(e) {
    this.filters.HasSlaOn = !this.filters.HasSlaOn;
    this.onSLAFilter.emit(e);
  }
}
