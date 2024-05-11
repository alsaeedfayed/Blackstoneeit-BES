import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-request-status-timeline',
  templateUrl: './request-status-timeline.component.html',
  styleUrls: ['./request-status-timeline.component.scss'],
})
export class RequestStatusTimelineComponent implements OnInit, OnChanges {
  @Input() items;
  lang: string;
  @Output() itemClick: EventEmitter<any> = new EventEmitter();

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.lang = this.translationService.language;
  }

  ngOnChanges(): void {
    if (this.items?.length > 0) {
      this.items.map((item) => {
        let matches: RegExpMatchArray = [];
        if (item.assignedTo.fullName)
          matches =
            item.assignedTo.fullName.match(/\b(\w)/g) ||
            item.assignedTo.fullName.match(/./u);

        if (matches) {
          item.assignedTo.Name = matches.join('').slice(0, 2);
        } else {
          item.assignedTo.Name = null;
        }
      });
    }
  }

  onItemClick(e) {
    this.itemClick.emit(e);
  }
}
