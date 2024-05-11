import { Component, OnInit, Input } from '@angular/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.scss']
})
export class HistoryTimelineComponent implements OnInit {

  @Input() lang: string;
  @Input() title: string;
  @Input() items: any = [];

  constructor(
    private attachmentService: AtachmentService,
  ) { }

  ngOnInit(): void {
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0]?.fileUrl, "_blank");
    });
  }

}
