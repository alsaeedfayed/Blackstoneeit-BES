import { ModelService } from './../../../../shared/components/model/model.service';
import { Constant } from 'src/app/core/config/constant';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { PopupService } from '../../../../shared/popup/popup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { IScorecard } from '../../interfaces/mange-scorecards.interface';

@Injectable()
export class scorecardModalModel {
  public endSub$ = new Subject();

  public isSubmitted: boolean = false;
  public isBtnLoading: boolean = false;
  public currentYear = new Date().getFullYear();
  public form: FormGroup;
  public newScorecardAdded = new EventEmitter();
  public scorecardEdited = new EventEmitter();
  scorecard: IScorecard;
  //constructor
  constructor(
    private fb: FormBuilder,
    private popupSer: PopupService,
    private modelSer: ModelService,
    private _http: HttpHandlerService,
    private toastSer: ToastrService,
    private translateSer: TranslateService
  ) {
    this.initForm();
    this.handelOldValue();
    this.checkReset();
  }

  //methods
  private initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, EnglishLettersAndNumbersOnly(), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      titleAr: ['', [Validators.required, ArabicLettersAndNumbersOnly()]],
      description: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      excecutionYear: [
        '',
        [Validators.required, Validators.min(this.currentYear)],
      ],
      // current: [false, Validators.required],
    });
  }

  handelOldValue() {
    this.popupSer.data
      .pipe(takeUntil(this.endSub$))
      .subscribe((scorecard: IScorecard) => {
        if (scorecard && scorecard.edit) {
          this.scorecard = scorecard;
          const data = {
            title: this.scorecard.title,
            titleAr: this.scorecard.titleAr,
            description: this.scorecard.description,
            excecutionYear: this.scorecard.excecutionYear,
            current: this.scorecard.current,
          };
          this.form.patchValue(data);
        }
      });
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      if (res) {
        this.isSubmitted = false;
        this.scorecard = null;
        this.form.reset();
      }
    });
  }

  public onPopupCancel() {
    if (this.scorecard) this.popupSer.close();
    else this.modelSer.close()
  }

  public submit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isBtnLoading = true;
    if (!!this.scorecard) {
      this.updateScorecard();
      return;
    }
    this._http
      .post(Config.scorecard.create, { ...this.form.value, current: false })
      .pipe(
        finalize(() => (this.isBtnLoading = false)),
        takeUntil(this.endSub$)
      )
      .subscribe((res) => {
        this.isSubmitted = false;
        this.form.reset();
        this.modelSer.close();
        this.toastSer.success(
          this.translateSer.currentLang == 'en'
            ? `Scorecard '${res.title}' Added Suceesfully`
            : `تمت إضافة ${res.title} بنجاح`
        );
        this.newScorecardAdded.emit();
      });
  }

  private updateScorecard() {
    this._http
      .put(Config.MangeScorecards.updatescorecard, {
        ...this.form.value,
        id: this.scorecard.id,
      })
      .pipe(
        finalize(() => (this.isBtnLoading = false)),
        takeUntil(this.endSub$)
      )
      .subscribe((res) => {
        // debugger
        this.scorecardEdited.emit({
          ...this.form.value,
          id: this.scorecard.id,
        });
        this.form.reset();
        this.popupSer.close();
        this.toastSer.success(
          this.translateSer.currentLang == 'en'
            ? `Scorecard '${res.title}' Updated Suceesfully`
            : `تم تعديل ${res.title} بنجاح`
        );
      });
  }

  // end subscribtions
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
