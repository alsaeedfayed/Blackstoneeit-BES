import { BadgeCountService } from './../../Pages/meeting-form/badge-count.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Component, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { componentModes } from '../../Enums/enums';
import { IAttendee } from '../../Pages/meeting-details/iMeetingDetails.interface';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})

export class AttendeesListComponent implements  OnDestroy {

  // PROPs
  private endsub$ = new Subject()
  public componentMode: componentModes;
  public language = this.translateService.currentLang;
  public attendeesList: IAttendee[] = [];
  public isSign = true;
  public isShowForm: boolean = false;
  public items: Array<IAttendee> = new Array<IAttendee>();
  public editedAttendee: IAttendee | null = null;
  public attendeeIdToDelete:string;
  public confirmMsg:string;
  public meetingId: number;
  public isEdit:boolean = false;
  @Output() refreshAttendees:EventEmitter<any> = new EventEmitter<any>();

  // INPUTS & OUTPUTS
  @Input() public set Items(items: Array<IAttendee>) {
    this.items = items;
  }
  @Input() public set ComponentMode(mode: componentModes) {
    this.componentMode = mode;
  }
  @Input() AttendeesPoitions:any[]=[];
  @Input() createdMeetingId: string;
  @Input() canAdd: boolean = false;
  editLabel = this.translateService.instant('shared.edit');
  deleteLabel = this.translateService.instant('shared.delete');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];

  constructor(private activeRouted: ActivatedRoute, private modalService: ModelService, private translateService: TranslateService, private confirmationPopupService: ConfirmModalService, private httpService: HttpHandlerService, private toastSer:ToastrService,private badgeCountService:BadgeCountService) {
    this.handleLangChange();
    this.checkReset();
    this.getMeetingId();
  }

  private getMeetingId() {
    this.activeRouted.params.pipe(take(1)).subscribe((params: Params) => {
      this.meetingId = +params['id'];
    })  
  }

  private handleLangChange() {
    this.translateService.onLangChange.pipe(takeUntil(this.endsub$)).subscribe((language) => {
      this.language = this.translateService.currentLang;
      this.editLabel = this.translateService.instant('shared.edit');
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash',
        },
      ];
    });
  }

  private checkReset(){
    this.modalService.closeModel$.pipe(takeUntil(this.endsub$)).subscribe(res=>{
      this.isShowForm = false
    })
  }

  openAttendeesModal() {
    this.editedAttendee = null;
    this.isShowForm = true;
    this.isEdit = false;
    this.modalService.open('add-attendee');
  }

  closeAttendeesModal() {
    this.editedAttendee = null;
    this.isShowForm = false;
    this.isEdit = false;
    this.modalService.close();
  }

  public addAttendee(attendee: IAttendee) {
    this.badgeCountService.changeAttendeesCount(this.badgeCountService.attndeesCount + 1);
    // this.items.push(attendee);
    this.getAllAttendees();
    this.badgeCountService.chnageAttenddesList(this.items);
  }

  private getAllAttendees() {
    this.httpService.get(`${Config.meetings.attendees.getAttendees}/${this.meetingId}`).pipe(takeUntil(this.endsub$)).subscribe((res)=>{
      if(res){
        this.items = res;
        this.refreshAttendees.emit(this.items);
      }
    })
  }

  public editAttendeeHanlder(attendee: IAttendee) {
    let attendeeIndex = this.items.findIndex((attendeeItem) => attendeeItem.id === attendee.id);
    this.items[attendeeIndex] = {
      ...this.items[attendeeIndex],
      ...attendee
    }
    this.getAllAttendees();
  }

  public deleteAttendee(attendee: IAttendee) {
    this.attendeeIdToDelete = attendee.id;
    this.confirmMsg = `${this.translateService.instant("Meetings.deleteAttendeeMsg")} "${attendee?.userInfo?.fullName}"?`
    this.confirmationPopupService.open()
  }

  public onDeleteAttendeeConfirmed(){
    this.httpService.delete(`${Config.meetings.attendees.delete}/${this.attendeeIdToDelete}`).pipe(takeUntil(this.endsub$)).subscribe((res)=>{
      if(res){
        this.toastSer.success(this.translateService.instant("Meetings.attendeeDeletedMsg"));
        this.badgeCountService.changeAttendeesCount(this.badgeCountService.attndeesCount - 1);
        this.items = this.items.filter((attendee)=>attendee.id !== this.attendeeIdToDelete);
        this.badgeCountService.chnageAttenddesList(this.items);
        this.refreshAttendees.emit(this.items);
      }
    })
  }
  public openEditPopup(attendee: IAttendee) {
    this.isShowForm = true;
    this.editedAttendee = attendee;
    this.isEdit = true;
    this.modalService.open('add-attendee');
  }

  // Getters & Setters
  public get attendanceRate(): number {
    let attendedPerons = this.items.filter((attendee) => attendee.attended);
    return (attendedPerons.length / this.items.length) * 100;
  }

  public get isAddMode(): boolean {
    return this.componentMode === componentModes.addMode;
  }
  public get isEditMode(): boolean {
    return this.componentMode === componentModes.editMode;
  }
  public get isViewMode(): boolean {
    return this.componentMode === componentModes.viewMode;
  }

  public getPosition(poistionCode:string){
    let selectedPosition = this.AttendeesPoitions?.find((position)=> position.code === poistionCode);
    if (selectedPosition){
      return this.language === "en" ? selectedPosition.nameEn : selectedPosition.nameAr;
    }
    return null;
  }



  ngOnDestroy(): void {
    this.endsub$.next(null)
    this.endsub$.complete()
  }

  public refreshData() {

  }

  onOptionSelect(e, item) {
    if (e === this.editLabel) {
      this.openEditPopup(item);
    } else if (e === this.deleteLabel) {
      this.deleteAttendee(item);
    }
  }

}

