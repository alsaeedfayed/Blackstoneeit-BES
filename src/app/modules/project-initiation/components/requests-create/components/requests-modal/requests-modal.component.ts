import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { PrioritySettingComponent } from './components/priority-setting/priority-setting.component';
import { WorkflowActionsConfirmationComponent } from './components/workflow-actions-confirmation/workflow-actions-confirmation.component';

@Component({
  selector: 'app-requests-modal',
  templateUrl: './requests-modal.component.html',
  styleUrls: ['./requests-modal.component.scss']
})
export class RequestsModalComponent implements OnInit, OnChanges {
  @Input() popupConfig;
  @Input() isFormSubmitted;
  @Input() requestData;
  @Input() isTranslationRequired;
  @Input() lang: string;
  @Output() actionConfirmed: EventEmitter<any> = new EventEmitter();
  @Output() getTranslatedFieldsValues: EventEmitter<any> = new EventEmitter();
  @Output() getPriorityValues: EventEmitter<any> = new EventEmitter();

  @ViewChild(PrioritySettingComponent) prioritySettingComponent;
  @ViewChild(WorkflowActionsConfirmationComponent) workflowActionsConfirmationComponent;
  constructor(private popupService: PopupService,
    private translationService: TranslateConfigService,
    private toastr: ToastrService,
    private fb: FormBuilder) { }


  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }

  onPopupClose() {
    this.popupService.close()
  }



  onActionConfirmed(e) {
    this.isFormSubmitted = true

    if (this.workflowActionsConfirmationComponent.confirmationForm.valid) {
      this.actionConfirmed.emit({
        optionId: this.popupConfig.action.id,
        comments: this.workflowActionsConfirmationComponent.confirmationForm.controls.comment.value,
        attachments: this.workflowActionsConfirmationComponent.selectedFiles,
        stateId: this.workflowActionsConfirmationComponent.step.value,
        assignees: this.workflowActionsConfirmationComponent.selectedAssignees,
        type: this.popupConfig.action.type,
      })
      this.workflowActionsConfirmationComponent.confirmationForm.reset()
      this.workflowActionsConfirmationComponent.selectedFiles = []
      this.isFormSubmitted = false
    }

  }


  onSubmitPriority() {
    const priority = {
      "projectId": this.requestData.id,
      "isRegulatoryRequirement": this.prioritySettingComponent.overridingCriteriaControl.value === 'Regulatory Requirement' ? true : false,
      "isDubaiPlan": this.prioritySettingComponent.overridingCriteriaControl.value === 'Leadership Directive/Dubai Plan 2030' ? true : false,
      "criteriaScores": this.prioritySettingComponent.selectedCriteriasScores
    }
    this.getPriorityValues.emit(priority)
    this.prioritySettingComponent.strategicFitScore = 0
    this.prioritySettingComponent.feasibilityScore = 0
    this.prioritySettingComponent.selectedCriteriasScores = []
  }
}
