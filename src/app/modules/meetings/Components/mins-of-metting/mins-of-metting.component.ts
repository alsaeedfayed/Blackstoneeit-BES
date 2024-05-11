import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {HttpHandlerService} from './../../../../core/services/http-handler.service';
import {componentModes} from './../../Enums/enums';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Component, OnInit, Input, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Config} from 'src/app/core/config/api.config';
import {takeUntil, finalize} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IMinOfMeeting} from '../../Pages/meeting-details/iMeetingDetails.interface';
import {StructureLookups} from 'src/app/utils/loockups.utils';

@Component({
  selector: 'mins-of-metting',
  templateUrl: './mins-of-metting.component.html',
  styleUrls: ['./mins-of-metting.component.scss'],
})

export class MinsOfMettingComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public language = this.translateServie.currentLang;
  public users: any[] = [];
  public commiteeNames: any[] = [];
  public attendeesPoitions: any[] = [];
  public componentMode: componentModes;
  public isSubmitted: boolean = false;
  public form: FormGroup;
  public data = {} as any;

  // INPUTS & OUTPUTS
  @Input()
  public set Data(data: any) {
    this.data = data;
    //console.log(data)
    if (data) {
      setTimeout(() => {
        this.setOldVals(data);
      }, 1000)

    }
  }

  @Input()
  public set ComponentMode(mode: componentModes) {
    this.componentMode = mode;
  }

  @Input()
  public set AttendeesPoitions(positions: any[]) {
    this.attendeesPoitions = positions;
  }

  @Output() meetingCreatedSucessfully = new EventEmitter();
  @Output() meetingRequestCreation = new EventEmitter();
  @Output() meetingUpdatedSucessfully = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toatSer: ToastrService,
    private translateServie: TranslateService
  ) {
    this.getUsers();
    //this.getCommiteeNamesLookup();
    this.getAllComiitees()
    this.handleLangchange();
  }

  ngOnInit(): void {

    // initialize meeting form controls
    this.initForm();
  }

  private getAllComiitees() {
    this.httpSer.get(Config.Committees.GetAllActive).subscribe(res => {
      this.commiteeNames = res;
    })
  }

  private getUsers() {
    const body = {
      pageIndex: 1,
      pageSize: 2000,
    };
    this.httpSer
      .get(Config.UserManagement.GetAll, body)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  private getCommiteeNamesLookup() {
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    this.httpSer
      .get(Config.Lookups.lookupService, queryServiceDesk)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.commiteeNames = StructureLookups(res).CommiteeName;
      });
  }

  private handleLangchange() {
    this.translateServie.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateServie.currentLang;
      });
  }

  private initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      date: [null, Validators.required],
      timeFrom: [null, Validators.required],
      timeTo: [null, Validators.required],
      commiteeId: [''],
      location: ['', [Validators.required]],
      chairperson: [null, [Validators.required]],
      initiator: [null, [Validators.required]],
    });
  }

  private setOldVals(data: IMinOfMeeting) {
    if (data) {
      const dataBody = {
        title: data.title,
        date: data.date,
        commiteeId: data.commiteeId,
        timeFrom: this.convertUTCDateToLocalDate(data.timeFrom),
        timeTo: this.convertUTCDateToLocalDate(data.timeTo),
        location: data.location,
        chairperson: data.chairpersonInfo?.id,
        initiator: data.initiatorInfo?.id,
      };
      this.form?.patchValue(dataBody);
    }
  }

  public get isInvalidTimeRange(): boolean {
    const timeFromControl = this.form.controls.timeFrom;
    const timeToControl = this.form.controls.timeTo;

    if (
      (timeFromControl.dirty && timeToControl.dirty) &&
      timeFromControl.value &&
      timeToControl.value &&
      timeFromControl.value > timeToControl.value
    ) {
      timeToControl.setErrors({'invalidTimeRange': true});
      return true;
    } else {
      timeToControl.setErrors(null);
      return false;
    }
  }

  public get isDateInPast(): boolean {
    const dateControl = this.form.controls.date;
    const timeFromControl = this.form.controls.timeFrom;

    const currentDate = new Date();
    const meetingTime = new Date(
      new Date(dateControl?.value).getFullYear(),
      new Date(dateControl?.value).getMonth(),
      new Date(dateControl?.value).getDate(),
      new Date(timeFromControl.value).getHours(),
      new Date(timeFromControl.value).getMinutes()
    );

    if (
      timeFromControl.dirty &&
      timeFromControl.value &&
      meetingTime < currentDate
    ) {
      timeFromControl.setErrors({'pastDate': true});
      return true;
    } else {
      timeFromControl.setErrors(null);
      return false;
    }
  }

  public saveMeeting() {
    if (this.form.invalid) return;
    if (this.form.value['timeFrom'] > this.form.value['timeTo']) {
      // this.toatSer.error(this.translateServie.instant("Meetings.invalidTimeIntervalMsg"));
      this.meetingRequestCreation.emit();
      return;
    }

    // let committe = this.commiteeNames.find( (commitee) => commitee.code === this.form.controls['commiteeName'].value)
    let committe = this.commiteeNames.find((commitee) => commitee.id === this.form.controls['commiteeId'].value)

    let body = {
      ...this.form.value,
      // commiteeNameAr: committe ? committe.nameAr: null,
      // commiteeNameEn: committe ? committe.name: null,

      // commiteeNameEn: committe ? committe.nameEn: null,
      chairpersonPositionCode: this.attendeesPoitions.find((position) => position.key === "Chairperson")?.code ?? "",
      initiatorPositionCode: this.attendeesPoitions.find((position) => position.key === "Initator")?.code ?? "",
      initiatorPositionEn: "Meeting Initiator",
      initiatorPositionAr: 'منسق/مقرر الاجتماع',
      chairpersonPositionEn: "Meeting Chairperson",
      chairpersonPositionAr: "رئيس الاجتماع"
    }
    this.httpSer
      .post(Config.meetings.save, body)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => this.meetingRequestCreation.emit())
      )
      .subscribe((meetingId: string) => {
        this.toatSer.success(
          this.translateServie.instant('Meetings.draftCreated')
        );
        this.meetingCreatedSucessfully.emit(meetingId);
      });
  }

  public updateMeeting(meetingId: string) {
    if (this.form.invalid) return;
    if (this.form.value['timeFrom'] > this.form.value['timeTo']) {
      // this.toatSer.error(this.translateServie.instant("Meetings.invalidTimeIntervalMsg"));
      this.meetingRequestCreation.emit();
      return;
    }
    let committe = this.commiteeNames.find((commitee) => commitee.id === this.form.controls['commiteeId'].value)
    // let committe = this.commiteeNames.find( (commitee) => commitee.code === this.form.controls['commiteeName'].value)
    let body = {
      ...this.form.value,
      // commiteeNameAr: committe ? committe.nameAr: null,
      // commiteeNameEn: committe ? committe.name: null,

      // commiteeNameEn: committe ? committe.nameEn: null,
      id: meetingId,
      chairpersonPositionCode: this.attendeesPoitions?.find((position) => position.key === "Chairperson")?.code ?? "",
      initiatorPositionCode: this.attendeesPoitions?.find((position) => position.key === "Initator")?.code ?? "",
      initiatorPositionEn: "Meeting Initiator",
      initiatorPositionAr: 'منسق/مقرر الاجتماع',
      chairpersonPositionEn: "Meeting Chairperson",
      chairpersonPositionAr: "رئيس الاجتماع"
    }
    this.httpSer
      .post(Config.meetings.save, body)
      .pipe(takeUntil(this.endSub$), finalize(() => this.meetingRequestCreation.emit()))
      .subscribe((res) => {
        this.toatSer.success(
          this.translateServie.instant('Meetings.updatedSucessfully')
        );
        this.meetingUpdatedSucessfully.emit();
      });
  }

  // Getters & Setters
  public get isAddMode(): boolean {
    return this.componentMode === componentModes.addMode;
  }

  public get isEditMode(): boolean {
    return this.componentMode === componentModes.editMode;
  }

  public get isViewMode(): boolean {
    return this.componentMode === componentModes.viewMode;
  }

  public get CommitteName(): string {
    if (this.data && this.data.commiteeId) {
      let committe = this.commiteeNames.find((commitee) => commitee.id === this.data.commiteeId)
      // let committe = this.commiteeNames.find((commitee) => commitee.code === this.data.commiteeName)
      if (committe) {
        return this.translateServie.currentLang === "en" ? committe.name : committe.nameAr
        // return this.translateServie.currentLang === "en" ? committe.nameEn : committe.nameAr
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
}
