import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss'],
})
export class HistoryModalComponent implements OnInit {
  @Input() data;

  constructor(
    private popupService: PopupService,
    private attachmentService: AtachmentService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  // Get File URL
  getFileURL(fileName: string) {
    this.attachmentService.getAttachmentURLs(fileName).subscribe({
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

  // Popup Close
  onClose() {
    this.popupService.close();
  }
}
