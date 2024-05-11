import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { Config } from 'src/app/core/config/api.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-state-model',
  templateUrl: './new-state-model.component.html',
  styleUrls: ['./new-state-model.component.scss']
})
export class NewStateModelComponent implements OnInit {

  @Input() processId: number = 0;
  @Input() language: string = "";
  @Input() externalStates: string[] = [];
  @Input() hasSLA: boolean = false;
  @Input() processHasInitial: boolean = false;

  @Output() stateAdded = new EventEmitter();


  isUpdating: boolean = false;

  isBtnLoading: boolean = false;
  form: FormGroup = new FormGroup({});

  isInitial: boolean = false;
  isFinal: boolean = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private modelService: ModelService,
  ) {

  }
  ngOnInit(): void {
    // initialize form controls
    this.initFormControls();
    // this.manageConditionalControls();      
  }
  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      title: [null, [Validators.required, EnglishLettersAndNumbersWithComma()]],
      arabicTitle: [null, [Validators.required, ArabicLettersAndNumbersOnly()]],
      mappedStatusCode: [null, Validators.required],
      stateOrder: [2, Validators.required],
      isSLAOn: [false],
      isDefaultFlow: [false]
    });
  }

  get stateOrder() { return this.form.get('stateOrder') as FormControl; }
  get isSLAOn() { return this.form.get('isSLAOn') as FormControl; }
  get defaulFlow() { return this.form.get('isDefaultFlow') as FormControl}

  manageConditionalControls() {
    if (this.hasSLA)
      this.form.addControl('isSLAOn', new FormControl(null, Validators.required));
    else
      this.hasController('isSLAOn') && this.form.removeControl('isSLAOn');
  }
  // check control exists
  hasController(controllerName: string): boolean {
    return this.form.contains(controllerName);
  }
  enabledChange(e) {
    this.isSLAOn.setValue(e);
  }
  enabledChangeDefaultFlow(e){
    this.defaulFlow.setValue(e);
  }
  SelectStateOrder() {
    this.isInitial = this.stateOrder.value == 1;
    this.isFinal = this.stateOrder.value == 3;
  }
  //save
  save() {
    this.isBtnLoading = true;
    const body = {
      ...this.form.value,
      processId: this.processId,
      isInitial: this.isInitial,
      isFinal: this.isFinal,
    };
    delete body.stateOrder;
    if (this.isUpdating) {
      // this.updateState(body);
    } else {
      this.addNewState(body);
    }
  }

  //add new State
  addNewState(body: any) {
    this.httpSer.post(Config.States.Add, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('newState.successAddedMsg'));
          this.stateAdded.emit();
          this.form.reset();
          this.closePopup();
        }
      });
  }
  closePopup() {
    this.modelService.close();
  }
}
