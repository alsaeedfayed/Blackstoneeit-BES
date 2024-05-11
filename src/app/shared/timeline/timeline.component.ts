import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';
declare var $: any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges {
  @Input() events: any
  @Input() mode: string
  lang: any;
  currentEventAttachments = [];
  currentEventComments
  @Output() expandCommentAndAttachments = new EventEmitter();
  currentStateEvent: any;

  constructor(private translationService: TranslationService,) { }

  ngOnInit() {
    this.lang = this.translationService.language
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.events){      
      this.currentStateEvent = this.events.find(item => item.status == 'Pending') ? this.events.find(item => item.status == 'Pending') : this.events[this.events.length - 1]
    }
  }

  getCurrentEventAttachmentsAndComments(attachments, comments){  
    this.currentEventComments = comments  
    this.currentEventAttachments = attachments
    this.expandCommentAndAttachments.emit({ attachments, comments })
  }


}
