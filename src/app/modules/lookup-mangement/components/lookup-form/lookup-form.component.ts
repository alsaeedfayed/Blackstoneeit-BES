import { ILookupItem } from './../../interfaces/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { PopupService } from 'src/app/shared/popup/popup.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Subject } from 'rxjs';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';

@Component({
  selector: 'app-lookup-form',
  templateUrl: './lookup-form.component.html',
  styleUrls: ['./lookup-form.component.scss'],
})
export class LookupFormComponent implements OnInit, OnDestroy {
  private endSub$ = new Subject();
  public isBtnLoading: boolean = false;
  public isEditMode: boolean = false;
  public form: FormGroup;
  public loading: boolean = false;
  public isSubmitted: boolean = false;
  public lookupToBeEdited: ILookupItem = null;

  @Input() selectedLookupTypeId: number = null;
  @Input() LookupTypes: { code: string; id: number }[] = [];

  @Output() lookupAddedHandler = new EventEmitter();
  @Output() lookupEditedHandler = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private popupSer: PopupService,
    private toastSer: ToastrService,
    private translateSer: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.form = this.fb.group({
      nameEn: this.fb.control('', [Validators.required, EnglishLettersAndNumbersWithComma()]),
      nameAr: this.fb.control('', [Validators.required, ArabicLettersAndNumbersOnly()]),
      code: this.fb.control('', [Validators.required]),
    });
  }

  private checkEditMode() {
    this.popupSer.data$
      .pipe(takeUntil(this.endSub$))
      .subscribe((lookup: ILookupItem) => {
        if (lookup && lookup.id) {
          this.lookupToBeEdited = lookup;
          this.isEditMode = true;
          const body = {
            nameAr: lookup.nameAr,
            nameEn: lookup.nameEn,
            code: lookup.code,
          };
          this.form.patchValue(body);
        }
      });
  }

  closePopup() {
    this.popupSer.close();
  }

  addLookup() {
    this.isSubmitted = true;
   // console.log(this.form)
    if (this.form.invalid) return;
    this.isBtnLoading = true;
    if (this.isEditMode) return this.updateLookup();
    const body = {
      ...this.form.value,
      lookupTypeId: this.selectedLookupTypeId,
      key: this.form.controls['nameEn'].value,
      target: this.LookupTypes.find(
        (category) => category.id === this.selectedLookupTypeId
      )?.code,
    };
    this.httpHandlerService
      .post(Config.Lookups.createlookup, body)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe((res) => {
        this.toastSer.success(
          this.translateSer.instant('lookups.lookupAddedSuccessfully')
        );
        this.lookupAddedHandler.emit({ ...res, status: true });
        this.popupSer.close();
      });
  }

  updateLookup() {
    const body = {
      ...this.form.value,
      id: this.lookupToBeEdited.id,
      lookupTypeId: this.selectedLookupTypeId,
      key: this.form.controls['nameEn'].value,
      status: this.lookupToBeEdited.status,
      target: this.LookupTypes.find(
        (category) => category.id === this.selectedLookupTypeId
      )?.code,
    };
    this.httpHandlerService
      .put(Config.Lookups.updateLookup, body)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe((res) => {
        this.toastSer.success(this.translateSer.instant("lookups.updatedSuccessfully"));
        this.lookupEditedHandler.emit({ ...body, updatedDate: res.updatedDate });
        this.popupSer.close();
      });
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
