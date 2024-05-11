import { Component, Input, OnInit } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-committee-decision-info',
  templateUrl: './committee-decision-info.component.html',
  styleUrls: ['./committee-decision-info.component.scss']
})
export class CommitteeDecisionInfoComponent implements OnInit {

  @Input() language: string;
  @Input() decisionNumber: string;
  @Input() decisionText: string;
  @Input() url: string;
  @Input() fileName: string;

  gettingPreview: boolean = false;

  // description see more  vars
  descTextInitialLimit = 1350;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  constructor(
    private exportFilesService: ExportFilesService
  ) { }

  ngOnInit(): void {

  }

  // get decision preview
  public exportDataAsPDF() {
    if (this.gettingPreview) return;
    this.gettingPreview = true;

    this.exportFilesService.exportData("POST", this.url, this.fileName).finally(() => {
      this.gettingPreview = false;
    })
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }
}