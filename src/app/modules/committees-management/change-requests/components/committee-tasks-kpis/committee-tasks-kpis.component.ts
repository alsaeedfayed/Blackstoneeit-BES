import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeasurementTypeService } from '../../../requests/services/measurementType/measurement-type.service';
import { MeasurementRecurrenceService } from '../../../requests/services/measurementRecurrence/measurement-recurrence.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'committee-tasks-kpis',
  templateUrl: './committee-tasks-kpis.component.html',
  styleUrls: ['./committee-tasks-kpis.component.scss']
})
export class CommitteeTasksKpisComponent implements OnInit {

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

  @Input() mainTasks: any;
  @Input() language: any;
  @Input() kpisCount: number;
  @Input() goaltreeData: any;
  @Input() showKPIDetails: boolean = false;
  @Input() hideDisplayDetails: boolean;

  @Output() toggleNested = new EventEmitter();
  @Output() openTasksM = new EventEmitter();
  @Output() openKpisM = new EventEmitter();
  importedGoalsWithKPIs: StrategyMappingKPI[] = [];
  isImportedGoalsWithKPIsLoading: boolean = true;
  constructor(private measurementTypeService: MeasurementTypeService,
    private measurmentRecurrenceService: MeasurementRecurrenceService,
    private httpSer: HttpHandlerService,) { }

  ngOnInit(): void {

    this.measurementTypes = this.measurementTypeService.getMeasures();
    // get request id
    this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();
  }


  toggleNestedList() {
    this.otherKPIs.open = !this.otherKPIs.open;
  }

  openKpisModal(e) {
    this.openKpisM.emit(e);
  }
  openTasksModal(e) {
    this.openTasksM.emit(e)
  }
}
