import {TextWidgetComponent} from './components/text-widget/text-widget.component';
import {ConfirmationPopupComponent} from './components/confirmation-popup/confirmation-popup.component';
import {NgxPermissionsModule} from './../core/modules/permissions/index';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {StateComponent} from './state/state.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import {EmptyStateComponent} from './empty-state/empty-state.component';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {ToastComponent} from './toast/toast.component';
import {ToastrModule} from 'ngx-toastr';
import {SkeletonLoaderComponent} from './skeleton-loader/skeleton-loader.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {TranslateModule} from '@ngx-translate/core';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {FilterComponent} from './filter/filter.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import {TimelineComponent} from './timeline/timeline.component';
import {InitialsPipe} from './pipes/initials-pipe/initials.pipe';
import {SearchPipe} from './pipes/search.pipe';
import {LoadingModalComponent} from './loading-modal/loading-modal.component';
import {HighlightPipe} from './pipes/highlight.pipe';
import {ThousandSeparatorPipe} from './pipes/thousand-separator-pipe/thousand-separator.pipe';
import {MobileFormatterPipe} from './pipes/mobile-formatter-pipe/mobile-formatter.pipe';
import {StatesFilterComponent} from './states-filter/states-filter.component';
import {StepperComponent} from './stepper/stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {
  CustomRadioButtonsControlComponent
} from './custom-radio-buttons-control/custom-radio-buttons-control.component';
import {PopupComponent} from './popup/popup.component';
import {RouterModule} from '@angular/router';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {NgxPopper} from 'angular-popper';

import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {FilterDropdownComponent} from './filter-dropdown/filter-dropdown.component';
import {CustomCheckboxesControlComponent} from './custom-checkboxes-control/custom-checkboxes-control.component';
import {CdkTreeModule} from '@angular/cdk/tree';
import {TreeModule} from '@circlon/angular-tree-component';
import {DashboardSummaryCardComponent} from './dashboard-summary-card/dashboard-summary-card.component';
import {ProjectDocumentListComponent} from './project-document-list/project-document-list.component';
import {
  ProjectDocumentModalComponent
} from './project-document-list/components/project-document-modal/project-document-modal.component';
import {ProjectCommentsListComponent} from './project-comments-list/project-comments-list.component';
import {DateAgoPipe} from './pipes/date-ago/date-ago.pipe';
import {RiskRatingComponent} from './risk-rating/risk-rating.component';
import {CustomRangeControlComponent} from './custom-range-control/custom-range-control.component';
import {StatsBarComponent} from './stats-bar/stats-bar.component';
import {PriorityComponent} from './priority/priority.component';
import {HorizontalStepperComponent} from './HorizontalStepper/horizontalStepper.component';
import {HorizontalStepComponent} from './HorizontalStep/horizontalStep.component';
import {HorizontalStepsComponent} from './HorizontalSteps/horizontalSteps.component';
import {SearchComponent} from './components/search/search.component';
import {VatPipe} from './pipes/vat-pipe/vat.pipe';
import {FiledComponent} from './components/filed/filed.component';
import {TextareaFiledComponent} from './components/textarea-filed/textarea-filed.component';
import {SwitchComponent} from './components/switch/switch.component';
import {ValidationComponent} from './components/validation/validation.component';
import {GetControlPipe} from './pipes/get-control.pipe';
import {NoDataComponent} from './components/no-data/no-data.component';
import {HeaderPageComponent} from './components/header-page/header-page.component';
import {ViewModesComponent} from './components/view-modes/view-modes.component';
import {RadioGroupModule} from './components/radio-group/radio-group.module';
import {SelectComponent} from './components/select/select.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModelComponent} from './components/model/model.component';
import {BadgeComponent} from './components/badge/badge.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
import {BarRatingModule} from 'ngx-bar-rating';
import {
  DescriptionInputWithAttachmentsComponent
} from './components/description-input-with-attachments/description-input-with-attachments.component';
import {AnalyticsWidgetComponent} from './components/analytics-widget/analytics-widget.component';
import {AnalyticsWidgetsComponent} from './components/analytics-widgets/analytics-widgets.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {DateRangeComponent} from './components/date-range/date-range.component';
import {customStepperComponent} from './components/stepper/stepper.component';
import {SelectTreeComponent} from './components/select-tree/select-tree.component';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {InitialsComponent} from './components/initials/initials.component';
import {PersonItemComponent} from './PersonItem/personItem.component';
import {SegmentHorizontalModule} from './components/segment-horizontal/segment-horizontal.module';
import {WorkflowStatesComponent} from './components/workflow-states/workflow-states.component';
import {ImageService} from './PersonItem/image.service';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzTimePickerModule} from 'ng-zorro-antd/time-picker';
import {DateComponent} from './components/date-picker/date-picker.component';
import {NZ_DATE_LOCALE} from 'ng-zorro-antd/i18n';
import {enUS} from 'date-fns/locale';
import {ManagerApprovalTasksComponent} from './components/manager-approval-tasks/manager-approval-tasks.component';
import {TabsModule} from './components/tabs/tabs.module';
import {CheckboxGroupModule} from './components/checkbox-group/checkbox-group.module';
import {AttachmentsFilesComponent} from './components/attachments-files/attachments-files.component';

import {OnlyNumberDirective} from './directives/number-only.directive';
import {OneTimeDirective} from './directives/one-time-bind.directive';
import {DateRangePickerComponent} from './components/date-range-picker/date-range-picker.component';
import {NoDataCustomComponent} from './components/no-data-custom/no-data-custom.component';
import {ColorPickerComponent} from './components/color-picker/color-picker.component';
import {NotificationItemComponent} from './components/notification-item/notification-item.component';
import {TimePickerComponent} from './components/time-picker/time-picker.component';
import {LocalizeDatePipe} from './pipes/localize-date.pipe';
import {SeeMoreComponent} from './components/see-more/see-more.component';
import {ThousandSuffPipe} from './pipes/thousand-suff.pipe';
import {InputTextTranslationDirective} from './directives/input-text-translation.directive';
import {TableItemIndexPipe} from './pipes/table-item-index/table-item-index.pipe';
import {UTCToLocalDatePipe} from './pipes/UTCToLocalDate/utcto-local-date.pipe';
import {TruncatePipe} from './pipes/truncate/truncate.pipe';
import {EnumKeyByValuePipe} from './pipes/enum-key-by-value/enum-key-by-value.pipe';
import {CustomSelectTreeComponent} from './components/custom-select-tree/custom-select-tree.component';
import {TeamSearchComponent} from './components/team-search/team-search.component';
import {DownloadTemplateComponent} from './components/download-template/download-template.component';
import {CustomTabsComponent} from './components/custom-tabs/custom-tabs.component';
import {MentionDivComponent} from './components/mentions/mention-div/mention-div.component';
import {MentionBoxComponent} from './components/mentions/mention-box/mention-box.component';
import {SidePanelComponent} from './components/side-panel/side-panel.component';
import {ProcessCardComponent} from './components/process-card/process-card.component';
import {ProcessStateCardComponent} from './components/process-state-card/process-state-card.component';
import {ButtonSelectComponent} from './components/button-select/button-select.component';
import {SelectStatesComponent} from './components/select-states/select-states.component';
import {ButtonsSelectComponent} from './components/buttons-select/buttons-select.component';
import {CopyToClipboardDirective} from './directives/copy-to-clipboard.directive';
import {NumberRangePickerComponent} from './components/number-range-picker/number-range-picker.component';
import {StrategicKPIsComponent} from './components/strategic-kpis/strategic-kpis.component';
import {AttachmentsZoneComponent} from './components/attachments-zone/attachments-zone.component';
import {ExportDropdownComponent} from './export-dropdown/export-dropdown.component';
import {SuccessStateComponent} from './success-state/success-state.component';
import {RatingChartComponent} from './rating-chart/rating-chart.component';
import {FormBuilderBaseComponent} from './components/form-builder/form-builder-base/form-builder-base.component';
import {ControlDynamicTableComponent} from './components/control-dynamic-table/control-dynamic-table.component';
import {JsonParsePipe} from './pipes/JSON-parse.pipe';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ProgressbarComponent} from './components/progressbar/progressbar.component';
import {GetIconPipe} from './pipes/get icon/get-icon.pipe';
import {GuageDrawerComponent} from './components/guage-drawer/guage-drawer.component';
import {NgxGaugeModule} from 'ngx-gauge';
import {WorkloadComponent} from './components/workload/workload.component';
import {ButtonComponent} from './components/button/button.component';
import {AnalysisBorderWidgetComponent} from './components/analysis-border-widget/analysis-border-widget.component';
import {AgTableComponent} from "./ag-grid-table/ag-table.component";
import {AgGridModule} from "ag-grid-angular";
import {LoadingComponent} from './ag-grid-table/loading/loading.component';

const components = [
  AgTableComponent,
  LoadingComponent,
  SearchComponent,
  FiledComponent,
  TextareaFiledComponent,
  SwitchComponent,
  ValidationComponent,
  NoDataComponent,
  HeaderPageComponent,
  SelectComponent,
  ModelComponent,
  ConfirmationPopupComponent,
  PopupComponent,
  BadgeComponent,
  DescriptionInputWithAttachmentsComponent,
  AnalyticsWidgetComponent,
  AnalyticsWidgetsComponent,
  DateRangeComponent,
  customStepperComponent,
  DateRangeComponent,
  SelectTreeComponent,
  PersonItemComponent,
  WorkflowStatesComponent,
  CustomSelectTreeComponent,
  DateComponent,
  ManagerApprovalTasksComponent,
  AttachmentsFilesComponent,
  DateRangePickerComponent,
  TextWidgetComponent,
  NoDataCustomComponent,
  TeamSearchComponent,
  DownloadTemplateComponent,
  CustomTabsComponent,
  MentionDivComponent,
  MentionBoxComponent,
  ButtonSelectComponent,
  SelectStatesComponent,
  ButtonsSelectComponent,
  StrategicKPIsComponent,
  AttachmentsZoneComponent,
  ExportDropdownComponent,
  SuccessStateComponent,
  RatingChartComponent,
  ControlDynamicTableComponent,
  FormBuilderBaseComponent,
  ProgressbarComponent,
  GuageDrawerComponent,
  WorkloadComponent,
  ButtonComponent,
  AnalysisBorderWidgetComponent
];

const pipes = [
  SearchPipe,
  VatPipe,
  HighlightPipe,
  InitialsPipe,
  ThousandSeparatorPipe,
  MobileFormatterPipe,
  DateAgoPipe,
  GetControlPipe,
  ThousandSuffPipe,
  TableItemIndexPipe,
  UTCToLocalDatePipe,
  TruncatePipe,
  EnumKeyByValuePipe,
  JsonParsePipe,
  GetIconPipe,
];

const directives = [
  OnlyNumberDirective,
  InputTextTranslationDirective,
  OneTimeDirective,
  CopyToClipboardDirective,
]

const modules = [
  NzDatePickerModule,
  NzTimePickerModule,
  RadioGroupModule,
  BarRatingModule,
  NgSelectModule,
  NzTreeSelectModule,
  SegmentHorizontalModule,
  NgxPermissionsModule,
  RouterModule,
  TreeModule,
  CdkTreeModule,
  ToastrModule,
  CdkStepperModule,
  NgCircleProgressModule,
  NgbModule,
  NgxPaginationModule,
  ReactiveFormsModule,
  NgxSkeletonLoaderModule,
  NgMultiSelectDropDownModule,
  NgxMaskModule,
  FormsModule,
  TranslateModule,
  TabsModule,
  CheckboxGroupModule,
  NgCircleProgressModule,
  AngularEditorModule,
  NgxPopper,
  NgxGaugeModule,
  AgGridModule
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives,
    InitialsComponent,
    StatesFilterComponent,
    TimelineComponent,
    StateComponent,
    EmptyStateComponent,
    ConfirmModalComponent,
    ToastComponent,
    SkeletonLoaderComponent,
    DatepickerComponent,
    FilterComponent,
    DropdownComponent,
    LoadingModalComponent,
    HighlightPipe,
    ThousandSeparatorPipe,
    MobileFormatterPipe,
    StepperComponent,
    CustomRadioButtonsControlComponent,
    ProgressBarComponent,
    FilterDropdownComponent,
    CustomCheckboxesControlComponent,
    DashboardSummaryCardComponent,
    ProjectDocumentListComponent,
    ProjectDocumentModalComponent,
    ProjectCommentsListComponent,
    DateAgoPipe,
    RiskRatingComponent,
    CustomRangeControlComponent,
    StatsBarComponent,
    PriorityComponent,
    HorizontalStepperComponent,
    HorizontalStepComponent,
    HorizontalStepsComponent,
    FiledComponent,
    TextareaFiledComponent,
    SwitchComponent,
    ValidationComponent,
    GetControlPipe,
    NoDataComponent,
    HeaderPageComponent,
    ViewModesComponent,
    DateRangeComponent,
    DateRangePickerComponent,
    ColorPickerComponent,
    NotificationItemComponent,
    TimePickerComponent,
    LocalizeDatePipe,
    SeeMoreComponent,
    SidePanelComponent,
    ProcessCardComponent,
    ProcessStateCardComponent,
    NumberRangePickerComponent,


  ],
  imports: [
    ...modules,
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
    }),
    NgxMaskModule.forRoot({
      showMaskTyped: true,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgCircleProgressModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    NgxPermissionsModule.forChild(),
    AngularEditorModule
  ],
  exports: [
    ...components,
    ...pipes,
    ...directives,
    ...modules,
    InitialsComponent,
    ProjectCommentsListComponent,
    ProjectDocumentModalComponent,
    ProjectDocumentListComponent,
    DashboardSummaryCardComponent,
    CustomCheckboxesControlComponent,
    FilterDropdownComponent,
    ProgressBarComponent,
    CustomRadioButtonsControlComponent,
    HighlightPipe,
    StateComponent,
    EmptyStateComponent,
    ConfirmModalComponent,
    ToastComponent,
    SkeletonLoaderComponent,
    DatepickerComponent,
    FilterComponent,
    DropdownComponent,
    TimelineComponent,
    LoadingModalComponent,
    ThousandSeparatorPipe,
    MobileFormatterPipe,
    StatesFilterComponent,
    StepperComponent,
    DateAgoPipe,
    RiskRatingComponent,
    CustomRangeControlComponent,
    StatsBarComponent,
    PriorityComponent,
    HorizontalStepperComponent,
    HorizontalStepComponent,
    HorizontalStepsComponent,
    FiledComponent,
    TextareaFiledComponent,
    SwitchComponent,
    ValidationComponent,
    GetControlPipe,
    NoDataComponent,
    HeaderPageComponent,
    ViewModesComponent,
    DescriptionInputWithAttachmentsComponent,
    ColorPickerComponent,
    NotificationItemComponent,
    TimePickerComponent,
    LocalizeDatePipe,
    SeeMoreComponent,
    SidePanelComponent,
    ProcessCardComponent,
    ProcessStateCardComponent,
  ],
  providers: [
    DatePipe,
    ImageService,
    {provide: NZ_DATE_LOCALE, useValue: enUS},
  ],
})
export class SharedModule {
}
