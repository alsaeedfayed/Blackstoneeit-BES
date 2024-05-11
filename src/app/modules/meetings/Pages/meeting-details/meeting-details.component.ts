import { finalize, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IOption } from 'src/app/core/models/form-builder.interfaces';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { IMeetingDetails } from './iMeetingDetails.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { MeetingStatus } from '../../Enums/enums';
import { licenceKey } from 'src/license/license';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.scss']
})
export class MeetingDetailsComponent implements OnDestroy, OnInit {
  // Props
  /********* Private PROPS */
  private endSub$ = new Subject()
  /********* public PROPS */
  public isLoading: boolean = false;

  public steps: any[] = [];
  public status: any;
  public options: IOption[] = [];
  public data: IMeetingDetails = {} as IMeetingDetails;
  public lang: string = this.translate.currentLang;
  public isPopupOpen: boolean = false;
  public isDownloading: boolean = false;
  selectedOpt: any;
  public taskId: string;
  public instanceId: number;
  public meetingId: string;
  public confirmMsg: string;
  meetingStatus = MeetingStatus;

  constructor(private confirmationPopupService: ConfirmModalService,
    private toastSer: ToastrService, private translateService: TranslateService,
    private router: Router, private userSer: UserService, private modalService: ModelService,
    private translate: TranslateService, private activeRouted: ActivatedRoute,
    private httpService: HttpHandlerService,
    private exportFilesService: ExportFilesService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.loadData();
    });
  }

  private loadData() {
    this.activeRouted.params.pipe(take(1)).subscribe((params: Params) => {
      this.meetingId = params['id'];
      this.getActions(this.meetingId);
      this.getStatus(this.meetingId);
      this.getDetails(this.meetingId);
    });
  }

  private getDetails(id) {
    this.isLoading = true;
    this.httpService.get(`${Config.meetings.getAll}/${id}`).pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.isLoading = false;
      this.data = res;
    });
  }

  private getActions(id) {
    this.isLoading = true;
    this.httpService.get(`${Config.meetings.getMyActions}/${id}`).pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.isLoading = false;
      this.options = res?.options;
      this.taskId = res?.taskId;
    });
  }

  private getStatus(id) {
    this.isLoading = true;
    this.httpService.get(`${Config.meetings.getStatus}/${id}`).pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.isLoading = false;
      this.steps = res?.instance?.states;
      this.instanceId = res?.instance?.instanceId;
    });
  }

  openActionModel(option) {
    this.isPopupOpen = true;
    this.selectedOpt = option;
    this.modalService.open('Meetings-action-model' + option?.id);
  }

  public navigateToEdit(id) {
    this.router.navigate([`/meetings/meeting-form/${id}`]);
  }

  public deleteMeeting(data) {
    this.confirmMsg = `${this.translateService.instant(
      'Meetings.deleteMeeting'
    )} "${data.title}"?`;
    this.confirmationPopupService.open('delete-meeting');
  }

  public onDeleteMeetingConfirmed(data) {
    this.confirmationPopupService.close('delete-meeting');
    this.httpService
      .delete(`${Config.meetings.delete}/${data.id}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.toastSer.success(this.translateService.instant('Meetings.deleteSuccessMsg'));
          this.router.navigate([`/meetings`]);
        }
      });
  }

  actionTakenHandler() {
    this.isLoading = true;
    setTimeout(() => {
      this.loadData();
    }, 3000);
  }

  public exportDataAsPDF() {
    if (this.isDownloading) return;
    this.isDownloading = true;

    let url = `${Config.meetings.exportPDF}?Id=${this.meetingId}`;
    this.exportFilesService.exportData("GET", url, 'MOM Details.pdf').finally(() => {
      this.isDownloading = false;
    })
  }

  ngOnDestroy(): void {
    this.endSub$.next(null)
    this.endSub$.complete()
  }

}
