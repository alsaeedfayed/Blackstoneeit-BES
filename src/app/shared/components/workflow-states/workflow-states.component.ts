import { take } from 'rxjs/operators';
import { ImageService } from './../../PersonItem/image.service';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from '../../popup/popup.service';
import ar from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'app-workflow-states',
  templateUrl: './workflow-states.component.html',
  styleUrls: ['./workflow-states.component.scss']
})

export class WorkflowStatesComponent implements OnInit {
  @Input() showTasks: boolean = true;
  tasks: any;
  lang: string = this.translateService.currentLang;
  @Input() steps: any = []
  @Input() emptyMsg: string = "shared.noContent";
  @Input() modalID: any = "workflow-popup";
  reviewHistory: any;

  constructor(public translateService: TranslateService, private popupService: PopupService, private attachmentService: AtachmentService, private imageService:ImageService) {
    registerLocaleData(ar); // for date pipe
  }

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }


  public setImage(name: string) {
    return this.imageService
      .setFileURL(name)
      .pipe(take(1))
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date)
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  onItemClick(e) {
    if (e.tasks && e.tasks.length !== 0) {
      this.tasks = e.tasks
      this.popupService.open(this.modalID)
      // this.popupService.open('workflow-popup')
    }
    this.reviewHistory = []
    if (e.reviewHistory && e.reviewHistory.length !== 0) {
      this.reviewHistory = e.reviewHistory
    }
  }


  onClosePopup() {
    this.popupService.close()
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0]?.fileUrl, "_blank");
    })
  }

}
