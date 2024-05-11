import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KpiService } from '../../services/KpiServie/kpi.service';
import { KPI } from '../../models/KPI';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { MeasurementRecurrenceService } from '../../services/measurementRecurrence/measurement-recurrence.service';
import { MeasurementRecurrences } from '../../models/MeasurementRecurrences';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { MeasurementTypeService } from '../../services/measurementType/measurement-type.service';
import { MeasurementType } from '../../models/MeasurementType';
import { CommitteeBasicInfoService } from '../../../services/committee-basic-info/committee-basic-info.service';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'app-committee-kpis-rows',
  templateUrl: './committee-kpis-rows.component.html',
  styleUrls: ['./committee-kpis-rows.component.scss']
})
export class CommitteeKpisRowsComponent extends ComponentBase implements OnInit {

  isOldView: boolean = false;
  KPIs: KPI[] = null;
  totalWeight: number = 0;
  otherKPIs = {
    title: { en: "Other KPIs", ar: "المؤشرات الاخرى" },
    mainColor: "#000000",
    kpiColor: "#ff1a8c",
    open: false
  }
  getTotalWeight() {
    this.totalWeight = 0;
    this.KPIs.forEach(kpi => {
      this.totalWeight += +kpi.weight;
    })
  }
  measurementRecurrences: MeasurementRecurrences[] = [];
  measurementTypes: MeasurementType[] = [];
  @Input() language: string = '';
  @Input() importedGoals: StrategyMappingKPI[] = [];
  @Input() selectedKPIsIds: number[] = [];
  @Input() isRequired: boolean = false;
  @Input() isEditAble: boolean = true;
  @Input() showDetails: boolean = false;
  @Output() onAdd = new EventEmitter();

  //KPI model vars
  isKPIModelOpened: boolean = false;
  isDetailsModalOpened: boolean = false;
  selectedKPI: KPI = null
  deletedName: string = null;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private kpiService: KpiService,
    private modelService: ModelService,
    private measurementRecurrenceService: MeasurementRecurrenceService,
    private toastr: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private measurementTypeService: MeasurementTypeService,
    private httpSer: HttpHandlerService,
    private committeeBasicInfoService: CommitteeBasicInfoService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.KPIs = this.kpiService.getKPIs();
    this.measurementRecurrences = this.measurementRecurrenceService.getMeasures();
    this.measurementTypes = this.measurementTypeService.getMeasures();
    this.getTotalWeight()
  }
  toggleNestedList(flag = null) {
    if (flag == null)
      this.otherKPIs.open = !this.otherKPIs.open;
    else
      this.otherKPIs.open = flag;
  }

  // open new KPI model
  openNewKPIModel(item: any = null) {
    this.selectedKPI = item;
    this.isKPIModelOpened = true;
    this.modelService.open('kpi-modal');
  }

  // close new KPI model
  closeNewKPIModel() {
    this.onAdd.emit(this.KPIs?.length > 0);
    this.isKPIModelOpened = false;
    this.isDetailsModalOpened = false;
    this.selectedKPI = null;
    this.modelService.close();

    this.getTotalWeight();
    
  }

  // delete KPI
  deleteKpi(name: string) {
    this.deletedName = name;
    this.confirmationPopupService.open('delete-kpi');
  }

  deleteKpiConfirmed() {
    this.confirmationPopupService.close('delete-kpi');
    if (this.kpiService.deleteKPIByName(this.deletedName)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.kPIRows.successDeleteMsg'));
      this.onAdd.emit();
      this.getTotalWeight();
    }
    else
      this.toastr.error(this.translate.instant('shared.noData'));
  }
  openDetailsModel(kpi) {
    console.log(kpi);
    this.isDetailsModalOpened = true;
    this.selectedKPI = kpi;
    this.modelService.open('kpi-modal');
  }
}
