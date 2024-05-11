import { LevelMode } from './../../../../../Planning/enum/enums';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { IchangeReauestDetails } from 'src/app/modules/PerformanceChangeRequests/interfaces/request.interface';
import { RequestStatus } from 'src/app/modules/requests/components/request-details-data/enum';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { ChangeRequestStatus } from './enum';

@Component({
  selector: 'cr-details-data',
  templateUrl: './cr-details-data.component.html',
  styleUrls: ['./cr-details-data.component.scss'],
})
export class CrDetailsDataComponent implements OnInit {
  @Input() data: IchangeReauestDetails;
  personInfo: IPerson;
  controlTypeMode: any = ControlTypeMode;
  lang: string = this.translateService.currentLang;

  servicesStatusEnum = ChangeRequestStatus;

  constructor(
    private attachmentSrv: AtachmentService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      this.lang = this.translateService.currentLang;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['data']) {
    //   this.data = changes['data'].currentValue;
    //   this.personInfo = {
    //     id: this.data?.requestInformation.userData.userId,
    //     name: this.data?.requestInformation.userData.fullName,
    //     image: this.data?.requestInformation.userData.fileUrls
    //       ? this.data?.requestInformation?.userData?.profileImage
    //       : '',
    //     backgroundColor: '#0075FF',
    //     isActive: true,
    //     position: this.data?.requestInformation.userData.roles.join(', '),
    //   };
    // }
  }

  get RequestTypeText() {
    if (+this.data.type == 1) {
      return this.translateService.instant("cr.addGoal");
    } else if (+this.data.type == 2) {
      return this.translateService.instant("cr.editGoal");
    } else if (+this.data.status == 3) {
      return this.translateService.instant("cr.removeKBI");
    } else {
      return '';
    }
  }

  get StatusRequestTxt() {
    return this.data && this.data.status
      ? ChangeRequestStatus[this.data.status].toLocaleLowerCase()
      : null;
  }

  get LevelText() {
    return this.translateService.instant(
      'Planning.' + LevelMode[this.data.level]
    );
  }

  getFileURL(fileName: string) {
    this.attachmentSrv.getAttachmentURLs(fileName).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          window.open(res[0].fileUrl);
        }
      },
      error: (err) => {
        this.toastr.error(
          this.translateService.instant('shared.somethingWentWrong')
        );
      },
    });
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
