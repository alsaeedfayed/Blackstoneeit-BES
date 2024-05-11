import { BadgeCountService } from './../../../Pages/meeting-form/badge-count.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IAttendee, IDiscussionItem } from '../../../Pages/meeting-details/iMeetingDetails.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-discussion-items-modal',
  templateUrl: './discussion-items-modal.component.html',
  styleUrls: ['./discussion-items-modal.component.scss']
})

export class DiscussionItemsModalComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  isBtnLoading: boolean = false;
  language: string = this.translateService.currentLang;
  users: any[] = [];
  editedItem: IDiscussionItem;
  @Input() createdMeetingId: string;
  isEditMode: boolean = false;
  attendeesList: IAttendee[];
  filteredUsers: any[] = [];
  attachments: any[] = [];
  isExternal : boolean = false;
  public prevUploadedFiles: { fileName: string; extension: string }[] = [];

  @Input() public set Item(editedItem: IDiscussionItem) {
    this.editedItem = editedItem;
    if (!!this.editedItem) {
      this.setItemVals()
    }
  };

  @Input() public set attendees(attendees: IAttendee[]){
    this.attendeesList = attendees;
    this.getUsers();
  }
  @Output() save: EventEmitter<IDiscussionItem> = new EventEmitter();
  @Output() update: EventEmitter<IDiscussionItem> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private badgeCounterService:BadgeCountService,
    private _http: HttpClient,private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // this.getUsers();
    this.handleLangChange();
    this.modelService.closeModel$.subscribe((data) => {
      this.form.reset();
    });
  }

  private getUsers() {
    const body = {
      pageIndex: 1,
      pageSize: 2000,
    };
    this.httpHandlerService.get(Config.UserManagement.GetAll, body)
      .subscribe((res) => {
        this.users = res.data;
        this.filteredUsers = this.attendeesList;
        this.filteredUsers.forEach(user => {
          user.isExternal = user.userInfo.id ? false : true;
          user.id = user.userInfo.id??user.userInfo.email;
        })
        this.listenForAttenddeschange();
      });
  }

  private listenForAttenddeschange(){
    this.badgeCounterService.attendeesList$.pipe().subscribe((attendees)=>{
      if(attendees && attendees !== null){
        this.filteredUsers = this.attendeesList;
        this.filteredUsers.forEach(user => {
          user.isExternal = user.userInfo.id ? false : true;
          user.id = user.userInfo.id??user.userInfo.email;
        })
      }
    })
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      title: this.fb.control('', Validators.required),
      presenter: this.fb.control('', Validators.required),
      duration: this.fb.control('', Validators.required),
      notes: this.fb.control(''),
      attachments: this.attachments
    });
  }

  private setItemVals() {
    this.isEditMode = true;
    const body = {
      title: this.editedItem.title,
      presenter: this.editedItem.presenter,
      duration: this.editedItem.duration,
      notes: this.editedItem.notes
    }
    this.prevUploadedFiles = this.editedItem?.attachments
    this.form.patchValue(body)
  }

  public uploadFile(evt: any) {
    this.isBtnLoading = true;
    const formDate = new FormData();
    formDate.append('File', evt[evt.length-1].file);
    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key' :licenceKey.valid
        }),
      }).subscribe((res: any) => {
        this.isBtnLoading = false;
        this.attachments.push({
          extension: res.extension,
          fileName: res.fileName,
          uploadedFileName: res.uploadedFileName
        });
      });
  }

  public deleteAttachment(i) {
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }
  
  addDiscussionItems() {
    if (this.form.invalid) return;
    this.isBtnLoading = true;
    if (this.isEditMode) this.updateDiscussionItem()
    else {
      const data = this.form.value;
      data.presenter = data.presenter.toString();
      const body = {
        meetingId: this.createdMeetingId,
        ...data,
        attachments: this.attachments,
        isExternal : this.filteredUsers.find(user => user.id == data.presenter || user.email == data.presenter)?.isExternal
      };
      this.httpHandlerService
        .post(Config.meetings.discussionItems.create, body)
        .pipe(finalize(() => (this.isBtnLoading = false)))
        .subscribe((res) => {
          this.closePopup();
          this.form.reset();
          this.save.emit({ ...body, presenterInfo: res.presenterInfo, id: res.id });
        });
    }
  }

  private updateDiscussionItem(){
    const data = this.form.value;
    data.presenter = data.presenter.toString();

    const body = {
      meetingId: this.createdMeetingId,
      id: this.editedItem.id,
      ...data,
      attachments: this.prevUploadedFiles?.length> 0 ? [...this.attachments, ...this.prevUploadedFiles]: [...this.attachments],
      isExternal : this.filteredUsers.find(user => user.id == data.presenter || user.email == data.presenter)?.isExternal
    };
    this.httpHandlerService
      .put(Config.meetings.discussionItems.update, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        this.closePopup();
        this.form.reset();
        this.update.emit({ ...body, presenterInfo: res.presenterInfo });
      });
  }

  closePopup() {
    this.modelService.close();
    this.form.reset();
  }

}
