import { finalize } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Observation } from '../../models/Observation';
import { Config } from 'src/app/core/config/api.config';
import {Subject } from 'rxjs';

@Component({
  selector: 'app-new-observation-model',
  templateUrl: './new-observation-model.component.html',
  styleUrls: ['./new-observation-model.component.scss']
})
export class NewObservationModelComponent implements OnInit {

  private endSub$ = new Subject();

  @Input() language: string = ''

  @Input() evaluationId: number = 0;

  @Output() onAdd = new EventEmitter();

  isUpdating: boolean = false;
  isBtnLoading: boolean = false;

  observation: Observation = {} as Observation;
  observationTypes: any[] = [];
  // loading data vars
  dataLoading: boolean = true;
  lookupsLoading: boolean = true;

  form: FormGroup = new FormGroup({});

  saveBtnLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modelService: ModelService,
    private router: Router,
    private httpSer: HttpHandlerService,
  ) {

  }

  ngOnInit(): void {
    this.initFormControls();

    this.getSharedLockups();
  }

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      titleAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      type: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  // load lookups data
  private getSharedLockups() {
    let observationType = 'ObservationType'
    const body = { ServiceName: 'committee' };
    this.httpSer.get(`${Config.Lookups.GetByLookupType}/${observationType}`, body)
      .pipe(finalize(() => (this.lookupsLoading = false)))
      .subscribe((res) => {
        this.observationTypes = res;
      });
  }

  save() {
    this.isBtnLoading = true;

    let observation = {
      auditId: this.evaluationId,
      ...this.form.value,
    };

    if (this.isUpdating) {
      // this.updateObservation(observation);
    } else {
      this.saveObservation(observation);
    }
  }
  // add new observation
  saveObservation(observation: Observation) {

    this.httpSer.post(Config.CommitteeObservations.Create, observation)
      .pipe(
        finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesEvaluations.newObservationModel.successAddedMsg'));
          this.form.reset();
          this.closePopup();
          this.onAdd.emit();

        }
      })
  }

  closePopup() {
    this.form.reset();
    this.modelService.close();
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
}
