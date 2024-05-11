import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusesService } from '../../../requests/services/statuses/statuses.service';
import { MembersTypesService } from '../../../requests/services/members-types/members-types.service';
import { MeasurementTypeService } from '../../../requests/services/measurementType/measurement-type.service';
import { MeasurementRecurrenceService } from '../../../requests/services/measurementRecurrence/measurement-recurrence.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'committee-info-panel',
  templateUrl: './committee-info-panel.component.html',
  styleUrls: ['./committee-info-panel.component.scss']
})
export class CommitteeInfoPanelComponent implements OnInit {

  status: any[] = [];
  memberTypes: any[] = [];
  measurementTypes: any[] = [];
  MeasurementRecurrences: any[] = [];

  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];
  otherKPIs = {
    title: { en: "Other KPIs", ar: "المؤشرات الاخرى" },
    mainColor: "#000000",
    kpiColor: "#ff1a8c",
    open: false
  }

  descTextInitialLimit = 80;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  @Input() committeeInfo: any;
  @Input() language: 'en' | 'ar';
  @Input() strategicGoals: any[];
  @Input() members: any[];
  @Input() kpis: any[];
  @Input() mainTasks: any[];
  @Input() allMemberTypes: any[];
  @Input() tags: string[];
  @Input() strategicKpis: any;
  @Input() goaltreeData: any;
  @Input() importedKPIsCount: number;

  @Output() openTaskModal = new EventEmitter();
  @Output() openKpiModal = new EventEmitter();

  constructor(private statuses: StatusesService, private memberTypesService: MembersTypesService,
    private measurementTypeService: MeasurementTypeService,
    private measurmentRecurrenceService: MeasurementRecurrenceService,
    private modelService: ModelService,
    ) { }

  ngOnInit(): void {
    this.status = this.statuses.getStatuses();
        //get all member types
        this.memberTypes = this.memberTypesService.getMembersTypes();
        this.measurementTypes = this.measurementTypeService.getMeasures();
        // get request id
        this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();
  }

    // toggle more text in description
    toggleMoreText() {
      this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

      this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
    }


  toggleNestedList() {
    this.otherKPIs.open = !this.otherKPIs.open;
  }

  tasksDetailsData: any
  openTasksModal(item: any) {
    this.tasksDetailsData = item
    this.modelService.open('Main-Tasks-Details')
  }

  closePopup() {
    this.tasksDetailsData = null;
    //this.kpisDetailsData = null;
  }

  // openTasksModal(item) {
  // //  console.log(item)
  //   this.openTaskModal.emit(item)
  // }
  openKpisModal(kpi){
    this.openKpiModal.emit(kpi)
  }

}
