import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ProcessService } from '../../processes-service/process.service';
import { SidePanelService } from 'src/app/shared/components/side-panel/side-panel.service';

@Component({
  selector: 'app-state-transitions',
  templateUrl: './state-transitions.component.html',
  styleUrls: ['./state-transitions.component.scss']
})
export class StateTransitionsComponent implements OnInit {

  @Input() processId: number = 0;
  @Input() language: string = "";
  @Input() stateData: any;

  @Output() stateAdded = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() onChangeHandler = new EventEmitter();
  @Output() onProcessReload = new EventEmitter();
  @Output() onAddNewTrans = new EventEmitter();


  noDataMsg: string = this.translate.instant('stateTransitions.form.noDataMsg')
  form: FormGroup = new FormGroup({});
  deleteConfirmMsg: string = `${this.translate.instant('stateTransitions.confirmModal.confirmDeleteTransitionMsg')}`;
  deleteLabel = this.translate.instant('stateTransitions.confirmModal.deleteTransition')

  cardActions: any = [
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash-alt'
    },
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    // private httpSer: HttpHandlerService,
    private http: HttpHandlerService,
    private toastr: ToastrService,
    private modelService: ModelService,
    public processesService: ProcessService,
    private confirmationPopupService: ConfirmModalService,
  ) {

  }
  ngOnInit(): void {
    // initialize form 
    this.initFormControls();    
  }
  // initialize form 
  initFormControls() {
    this.form = this.fb.group({
    });
  }

  closePopup() {
    this.modelService.close();
  }

  // transition setting dropdown logic
  onOptionClick(e, user) {  
    this.modelService.close();
    this.close.emit();
    this.openDeletePopup()
  }

  openDeletePopup() {
    this.deleteConfirmMsg = `${this.translate.instant('stateTransitions.confirmModal.confirmDeleteTransitionMsg')}`;
    this.modelService.open('delete-state');
  }

// In ModelComponent
delete() {
let path = Config.transition.delete;
this.modelService.close();
this.http.delete(path).subscribe((res) => {
  if (res) {
    this.toastr.success(this.translate.instant('stateTransitions.confirmModal.transitionDeleteSuccess'));
    this.reset();
  }
});
}

private reset() {
// Reset logic if needed
this.onChangeHandler.emit();
}

// Handle transition deletion
onTransitionOptionsSelect(e, transition) {
  this.modelService.close();
  this.processesService.setPopupConfig({
    text: this.translate.instant('stateTransitions.confirmModal.confirmDeleteTransitionMsg'),
    confirmationBtnText: 'Confirm',
    data: {transition},      
    onConfirmEvent: () =>{ 
      this.processesService.deleteTransition(transition.id).subscribe(res =>{
        this.confirmationPopupService.close('process')
        this.toastr.success(`${this.translate.instant('stateTransitions.confirmModal.transitionDeleteSuccess')}`)
        this.onProcessReload.emit()
      }, err =>{
        this.confirmationPopupService.close('process')
      })
    }
  })
  this.confirmationPopupService.open('process')
}

addNewTrans(){
  this.onAddNewTrans.emit()
}
}
