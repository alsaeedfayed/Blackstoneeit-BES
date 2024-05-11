import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  merge,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { CapitalLetterOnly } from 'src/app/core/helpers/capital-letter-only.validator';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { GroupsService } from '../../services/groups.service';
import { Level } from '../groups-main/enums';

@Component({
  selector: 'app-groups-modal',
  templateUrl: './groups-modal.component.html',
  styleUrls: ['./groups-modal.component.scss'],
})
export class GroupsModalComponent implements OnInit, OnDestroy {
  lang: string = this.translate.currentLang;
  levels: any = [
    {
      value: Level.L0,
      label: 'L0',
      labelAr: 'L0',
    },
    {
      value: Level.L1,
      label: 'L1',
      labelAr: 'L1',
    },
    {
      value: Level.L2,
      label: 'L2',
      labelAr: 'L2',
    },
    {
      value: Level.L3,
      label: 'L3',
      labelAr: 'L3',
    },
  ];
  @Input() groups;
  groupForm: FormGroup;
  popupConfig;
  isBtnLoading: boolean;
  isFormSubmitted: boolean;
  private subscriptions = new Subscription();
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private groupsService: GroupsService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.handleLangChange();
    this.subscriptions.add(
      this.groupsService.popupConfig.subscribe((res) => {
        this.popupConfig = res;
      })
    );
    this.subscriptions.add(
      this.groupsService.selectedGroup.subscribe((selectedGroup) => {
        if (selectedGroup) {
          this.initGroupForm(selectedGroup);
          this.groups = this.groups.filter(
            (group) => group.id != group?.parentId
          );
        } else {
          this.initGroupForm();
        }
      })
    );
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initGroupForm(group?) {
    this.groupForm = this.fb.group({
      id: group ? group.id : null,
      name: [
        group ? group.name : null,
        [Validators.required, EnglishLettersAndNumbersOnly()],
      ],
      arabicName: [
        group ? group.arabicName : null,
        [Validators.required, ArabicLettersAndNumbersOnly()],
      ],
      code: [
        group ? group.code : null,
        [
          Validators.required,
          EnglishLettersAndNumbersOnly(),
          CapitalLetterOnly(),
          Validators.maxLength(3),
        ],
      ],
      parentGroupId: [group ? group.parent : null],
      level: [group ? group.level : null, Validators.required],
    });
  }

  get getGroupForm() {
    return this.groupForm.controls;
  }

  onCancelPopup() {
    this.popupService.close();
    this.groupForm.reset();
  }

  onRegisterGroup() {
    this.isFormSubmitted = true;
    if (this.groupForm.valid) {
      this.isBtnLoading = true;
      if (this.groupForm.value?.id) {
        this.groupsService
          .updateGroup({
            ...this.groupForm.value,
            parentGroupId: this.groupForm.value?.parentGroupId?.id
              ? this.groupForm.value?.parentGroupId?.id
              : 0,
            level: parseInt(this.groupForm.value.level),
          })
          .subscribe(
            (res) => {
              this.isFormSubmitted = false;
              this.resetState(
                this.translate.instant('groups.groupWasSuccessfullyUpdated')
              );
            },
            (err) => {
              this.toastr.error(err.message);
            }
          );
      } else {
        this.groupsService
          .createGroup({
            ...this.groupForm.value,
            parentGroupId: this.groupForm.value?.parentGroupId?.id
              ? this.groupForm.value?.parentGroupId?.id
              : 0,
            level: parseInt(this.groupForm.value.level),
          })
          .subscribe(
            (res) => {
              this.isFormSubmitted = false;
              this.resetState(
                this.translate.instant('groups.groupWasSuccessfullyCreated')
              );
            },
            (err) => {
              this.toastr.error(err.message);
            }
          );
      }
    }
  }
  formatter = (result: any) =>
    this.lang === 'en' ? result.name : result.arabicName;
  searchGroups: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance?.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term: any) =>
        (term === ''
          ? this.groups
          : this.groups.filter(
              (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  resetState(message) {
    this.toastr.success(message);
    this.popupService.close();
    this.refreshParentComponent.emit();
    this.groupForm.reset();
    this.isBtnLoading = false;
  }
}
