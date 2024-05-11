import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { IHistory } from '../history-list/iHistory.interface';

@Component({
  selector: 'app-history-list-item',
  templateUrl: './history-list-item.component.html',
  styleUrls: ['./history-list-item.component.scss'],
})
export class HistoryListItemComponent implements OnInit, OnChanges {
  @Input() data: IHistory;
  personInfo: IPerson;
  isShowAttachments: boolean;
  className: string;

  constructor(private translateService:TranslateService) {}

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (this.data.time) {
      this.personInfo = {
        name: this.data.assignedTo.fullName,
        image: this.data.assignedTo.profileImage,
        backgroundColor: '#0075FF',
        isActive: true,
        position: this.data.assignedTo.roles.join(', '),
      };
      this.className = this.getClassName();
    }
  }

  getClassName(): string {
    if (this.data.state.toLowerCase() === 'approve') {
      return this.translateService.instant('requests.active');
    } else if (this.data.state.toLowerCase() === 'reject') {
      return this.translateService.instant('requests.rejected');
    } else if (this.data.state.toLowerCase() === 'close') {
      return this.translateService.instant('requests.closed');
    } else if (this.data.state.toLowerCase() === 'return to requester') {
      return this.translateService.instant('requests.cancelled');
    } else {
      return this.translateService.instant('requests.new');
    }
  }

  showAttachments() {
    this.isShowAttachments = true;
  }
}
