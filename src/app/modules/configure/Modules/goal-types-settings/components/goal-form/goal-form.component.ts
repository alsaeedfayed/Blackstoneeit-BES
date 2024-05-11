import { IGoalTypeSettings } from './../../Interfaces/interfaces';
import { PopupService } from './../../../../../../shared/popup/popup.service';
import { ToastrService } from 'ngx-toastr';
import { OnDestroy, Output, EventEmitter } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from './../../../../../../shared/components/model/model.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-goal',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.scss'],
})
export class GoalFormComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public isSubmitted: boolean = false;
  public isBtnLoading: boolean = false;
  public isEditMode: boolean = false;
  private goalTypeIdToBeEdited: number;
  public GoalForm: FormGroup;
  public categories: { name: string; id: number }[];
  public suggestedColors: string[] = [
    '#28C66F',
    '#FFAB00',
    '#EC5453',
    '#6259CE',
    '#C5C5C5',
  ];
  // INPUTS & OUTPUTS
  @Output() typeCreatedEvent = new EventEmitter();
  @Output() typeEditedEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private translateSer: TranslateService,
    private ModalSer: ModelService,
    private popupSer: PopupService,
    private httpHandlerService: HttpHandlerService,
    private toastSer: ToastrService
  ) {
    this.initForm();
    this.checkEditMode();
  }

  ngOnInit(): void {
    this.getCategories();
    this.handleLangChange();
  }

  getCategories() {
    this.categories = [
      {
        id: 1,
        name: this.translateSer.instant(
          'configuration.goalTypesObj.Informational'
        ),
      },
      {
        id: 2,
        name: this.translateSer.instant('configuration.goalTypesObj.Measurable'),
      },
    ];
  }

  private handleLangChange() {
    this.translateSer.onLangChange.subscribe((language) => {
      this.getCategories();
    });
  }

  private initForm() {
    this.GoalForm = this.fb.group({
      name: ['', [Validators.required, EnglishLettersAndNumbersWithComma(), Validators.maxLength(15),]],
      arabicName: ['', [Validators.required, ArabicLettersAndNumbersOnly(), Validators.maxLength(15)]],
      description: ['', Validators.maxLength(120)],
      category: [1, Validators.required],
      color: ['', Validators.required],
    });
  }

  private checkEditMode() {
    this.popupSer.data$
      .pipe(takeUntil(this.endSub$))
      .subscribe((goalType: IGoalTypeSettings) => {
        if (goalType) {
          this.isEditMode = true;
          this.goalTypeIdToBeEdited = goalType.id;
          const data = {
            name: goalType.name,
            arabicName: goalType.arabicName,
            description: goalType.description,
            category: goalType.category,
            color: goalType.color,
          };
          if (!this.suggestedColors.includes(goalType.color)) {
            this.suggestedColors.pop();
            this.suggestedColors.push(goalType.color);
          }
          this.GoalForm.patchValue(data);
        }
      });
  }

  onPopupCancel() {
    // Used In case Of Edit Mode as used popup for edit and modal for create
    if (this.isEditMode) this.popupSer.close();
    else this.ModalSer.close();
  }

  submit() {
    this.isSubmitted = true;
    if (this.GoalForm.invalid) return;
    this.isBtnLoading = true;
    if (this.isEditMode){
      this.updateGoalType();
      return;
    }
    this.httpHandlerService
      .post(Config.GoalTypes.create, this.GoalForm.value)
      .pipe(
        finalize(() => (this.isBtnLoading = false)),
        takeUntil(this.endSub$)
      )
      .subscribe(() => {
        this.toastSer.success(
          this.translateSer.instant('configuration.goalTypesObj.successCreated')
        );
        this.typeCreatedEvent.emit();
        this.ModalSer.close();
      });
  }

  private updateGoalType() {
    const editedGoal = {
      ...this.GoalForm.value,
      id: this.goalTypeIdToBeEdited,
    }
    this.httpHandlerService
      .put(Config.GoalTypes.update, editedGoal)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe(() => {
        this.toastSer.success(
          this.translateSer.instant('configuration.goalTypesObj.successEdited')
        );
        this.typeEditedEvent.emit(editedGoal);
        this.popupSer.close();
      });
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
