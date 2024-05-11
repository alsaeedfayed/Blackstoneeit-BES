import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { RegexConfig } from 'src/app/core/config/regex.configs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { AttendeeType } from '../../../Pages/meeting-details/enums';
import { IAttendee } from '../../../Pages/meeting-details/iMeetingDetails.interface';
import { ITab } from 'src/app/shared/components/tabs/ITab.interfcae';

@Component({
  selector: 'app-attendees-modal',
  templateUrl: './attendees-modal.component.html',
  styleUrls: ['./attendees-modal.component.scss']
})

export class AttendeesModalComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public loading: boolean = false;
  public isBtnLoading: boolean = false;
  public language: string = this.translateService.currentLang;
  public users: any[] = [];
  public isEditMode: boolean = false;
  public attendee: IAttendee;
  public attendeesPoitions:any[]=[];
  lookupsMeetingRoleType: any[] = [];
  public attendeesType = [];
  public memberToAddType : string = "teamMember";
  public selectedUsers = [];

  public tabs: ITab[] = [
    {
      tabIndex: 1,
      tabTitle: this.translateService.instant('Meetings.individualInvitee'),
      disbaled: false,
    },
    {
      tabIndex: 2,
      tabTitle: this.translateService.instant('Meetings.bulkInvitee'),
      disbaled: false
    }
  ];

  // INPUTS & OUTPUTS
  @Output() save: EventEmitter<IAttendee> = new EventEmitter();
  @Output() update: EventEmitter<IAttendee> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() createdMeetingId: string;
  @Input() isEdit: boolean = false;
  @Input() attendees : Array<IAttendee> = new Array<IAttendee>();
  @Input() public set AttendeesPoitions(poistions:any[]){
    if(poistions){
      this.attendeesPoitions = poistions.filter((poition) => poition.key !== "Chairperson" && poition.key !== "Initator");
    }
  }
  @Input() public set Attendee(editedAttendee: IAttendee) {
    this.attendee = editedAttendee;
    if (!!this.attendee) {
      this.setAttendeeVals()
    }
  };
  @Output() onSelectRoleTypes = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private translateService: TranslateService,
  ) {
    this.initForm();
    // this.loadRoleTypes();
  }

  ngOnInit(): void {
    this.loadAttendeesType();
    this.getUsers();
    this.handleLangChange();
    this.modelService.closeModel$.subscribe((data) => {
      this.form.reset();
      this.form.controls['attended'].setValue(false)
      this.form.controls['requestToSign'].setValue(false)
    });
  }

  public checkRequiredFeilds() {
    if (this.InternalType) {
      this.form.controls['userId'].addValidators(Validators.required);
      this.form.controls['externalAttendeeName'].removeValidators(Validators.required);
      this.form.controls['externalAttendeeName'].setValue(null)
      this.form.controls['externalAttendeeEmail'].removeValidators(Validators.required);
      this.form.controls['externalAttendeeEmail'].setValue(null)
    }
    else if(this.ExternalType) {
      this.form.controls['externalAttendeeName'].addValidators(Validators.required);
      this.form.controls['externalAttendeeEmail'].addValidators(Validators.required);
      this.form.controls['userId'].removeValidators(Validators.required);
      this.form.controls['userId'].setValue(null);
    }
    this.form.controls['userId'].updateValueAndValidity();
    this.form.controls['externalAttendeeName'].updateValueAndValidity();
    this.form.controls['externalAttendeeEmail'].updateValueAndValidity();
  }

  // Load AttendeesType
  public loadAttendeesType() {
    // let temp = new Array<Lookup>();

    // temp.push(new Lookup(AttendeeType.Internal, this.translateService.instant('Meetings.internal')));
    // temp.push(new Lookup(AttendeeType.External, this.translateService.instant('Meetings.external')));

    // this.attendeesType = temp;

    this.attendeesType.push(
      {
        key: AttendeeType.Internal,
        value: this.translateService.instant('Meetings.internal')
      }
    )
    this.attendeesType.push(
      {
        key: AttendeeType.External,
        value: this.translateService.instant('Meetings.external')
      }
    )

    //return this.attendeesType;
  }

  public handleAttendeeTypes(type: AttendeeType) {
    if(type && type['key'])
    this.form.controls['attendeeType'].setValue(type['key']);
    //this.form.controls['attendeeType'].setValue(type);
    this.checkRequiredFeilds();
  }

  //search on users
  searchUsers(value: string) {
    if(value)
      this.getUsers(value?.trim());
  }

  private getUsers(value = '') {
   // this.loading = true;
    const body = {
      pageIndex: 1,
      pageSize: 30,
      fullName: value
    };
    this.httpHandlerService.get(Config.UserManagement.GetAll, body)
      .subscribe((res) => {
        if(res) {
          this.users = res?.data;
          if(!this.isEdit){
            this.users?.forEach(user => {
              user.checked = false;
              user.attended = false;
              user.role = "Member";
            });
            this.attendees?.forEach(attendee => {
              const user = this.users?.filter(user => { return user.id == attendee.userId })[0];
              if(user){
                user.disabled = true;
                user.checked = true;
                user.attended = attendee.attended;
                user.role = attendee.position;
              }
            });
            this.users = this.users?.sort((a,b) => b.checked - a.checked);
          }
         // this.loading = false;
        }
      });
  }

  private setAttendeeVals() {
    this.isEditMode = true;
    const body = {
      userId: this.attendee.userId,
      position: this.attendee.position,
      notes: this.attendee.notes,
      attended: this.attendee.attended,
      requestToSign: this.attendee.requestToSign,
      externalAttendeeName: this.attendee.externalAttendeeName,
      externalAttendeeEmail: this.attendee.externalAttendeeEmail,
      attendeeType: +this.attendee.attendeeType
    }
    this.form.patchValue(body);
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
     // this.loadRoleTypes();
    });
  }

  public get InternalType() {
    return ((this.form.controls['attendeeType'].value)) == AttendeeType.Internal;
  }

  public get ExternalType() {
    return ((this.form.controls['attendeeType'].value)) == AttendeeType.External;
  }

  private initForm(): void {
    this.form = this.fb.group({
      //userId: this.fb.control('', Validators.required),
      userId: this.fb.control(null),
      position: this.fb.control(null, Validators.required),
      notes: this.fb.control(null, Validators.maxLength(500)),
      attended: [false],
      requestToSign: [false],
      externalAttendeeName: this.fb.control(null),
      externalAttendeeEmail: this.fb.control(null, Validators.pattern(RegexConfig.emailRegExp)),
      attendeeType: this.fb.control(null, Validators.required),
      inviteType : this.fb.control(1, Validators.required)
    });
    this.form.get('inviteType').valueChanges.subscribe(val => {
      if(val == 2){
        this.form.get('attendeeType').setValue(1);
      }
    })
  }

  // loadRoleTypes() {
  //   const queryServiceDesk = {
  //     ServiceName: 'ServiceDesk',
  //   };
  //   this.httpHandlerService.get(Config.Lookups.lookupService, queryServiceDesk).subscribe(res => {
  //     this.lookupsMeetingRoleType = StructureLookups(res).MeetingRoleType;
  //     this.onSelectRoleTypes.emit(this.lookupsMeetingRoleType);
  //   })
  // }

  setSelectedUser(data:any){
    this.selectedUsers = data;
  }

  addAttendee() {
    if (this.form.invalid && this.form.get('inviteType').value == 1) return;
    this.isBtnLoading = true;
    if (this.isEditMode) this.updateAttendee()
    else {
      if(this.form.get('inviteType').value == 1){
        let positionName = this.attendeesPoitions?.find( (position) => position.code === this.form.controls['position'].value);
        let filteredUser = this.users.find(user => user.id == this.form.value.userId);
        const body = {
          // ...this.form.value,
          // meetingId: this.createdMeetingId, attendeeType: 1, requestToSign: true,
          meetingId: this.createdMeetingId,
          requestToSign: true,
          notes : this.form.value.notes,
          users : [
            {
              attendeeType: +(this.form.controls['attendeeType'].value),
              positionEn: positionName ? positionName.nameEn: null,
              positionAr: positionName ? positionName.nameAr: null,
              externalAttendeeName: this.form.value?.externalAttendeeName??null,
              externalAttendeeEmail: this.form.value?.externalAttendeeEmail??null,
              userId: this.form.value.userId,
              userInfo: this.form.controls['attendeeType'].value == AttendeeType.Internal ? {
                  "email":filteredUser.email,
                  "userName": filteredUser.firstName,
                  "roles": filteredUser.usersRoles.map(role => {role.id}),
                  "fileName": filteredUser?.fileName,
                  "id": filteredUser.id,
                  "fullName": filteredUser.fullName,
                  "position": filteredUser.position,
                } : null
              ,
              attended: this.form.value.attended,
              position: this.form.value.position,
            }
          ]
        }
        this.httpHandlerService
          .post(Config.meetings.attendees.create, body)
          .pipe(finalize(() => (this.isBtnLoading = false)))
          .subscribe((res) => {
            this.closePopup();
            this.form.reset();
            this.save.emit({
              id: this.attendee?.id,
              meetingId: +body.meetingId,
              userId: body.users[0].userId,
              position: body.users[0].position,
              notes:body?.notes,
              userInfo: body.users[0].userInfo,
              attended: body.users[0].attended,
              requestToSign: body.requestToSign,
              attendeeType: body.users[0].attendeeType,
              externalAttendeeName: body.users[0]?.externalAttendeeName,
              externalAttendeeEmail: body.users[0]?.externalAttendeeEmail
             });
          });
      }else{
        let users = JSON.parse(JSON.stringify(this.selectedUsers));
        for(let i=0;i<this.attendees.length;i++){
          for(let j=0;j<users.length;j++){
            if(users[j].id == this.attendees[i].userId){
              users.splice(j, 1);
            }
          }
        }
        const body = {
          MeetingId : this.createdMeetingId, attendeeType: +(this.form.controls['attendeeType'].value),
          notes: this.form.get('notes').value,
          users: users.map(user => {
            return {
              "attended" : user.attended,
              "attendeeType" : AttendeeType.Internal,
              "positionAr" : this.AttendeesPoitions?.find( (position) => position.code === user.role).nameAr,
              "positionEn" : this.AttendeesPoitions?.find( (position) => position.code === user.role).nameEn,
              "userId" : user.id,
              "position" : user.role,
              "userInfo" : {
                "email":user.email,
                "userName": user.firstName,
                "roles": user.usersRoles.map(role => {role.id}),
                "fileName": user?.fileName,
                "id": user.id,
                "fullName": user.fullName,
                "position": user.position,
              }
            }
          })
        }

        this.httpHandlerService
          .post(Config.meetings.attendees.create, body)
          .pipe(finalize(() => (this.isBtnLoading = false)))
          .subscribe((res) => {
            this.closePopup();
            this.form.reset();
            this.save.emit();
          });
      }
    }
  }

  updateAttendee() {
    let positionName = this.attendeesPoitions?.find( (position) => position.code === this.form.controls['position'].value)
    const body = {
      //...this.form.value, meetingId: this.createdMeetingId, attendeeType: 1, id: this.attendee.id, requestToSign: true,
      ...this.form.value, meetingId: this.createdMeetingId, attendeeType: +(this.form.controls['attendeeType'].value), id: this.attendee.id, requestToSign: true,
      positionEn: positionName ? positionName.nameEn: null,
      positionAr: positionName ? positionName.nameAr: null
    }
   // debugger
    this.httpHandlerService
      .put(Config.meetings.attendees.update, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        this.closePopup();
        this.form.reset();
        this.update.emit({ ...body, userInfo: res.userInfo });
      });
  }

  closePopup() {
    this.modelService.close();
    this.form.reset();
  }

}
