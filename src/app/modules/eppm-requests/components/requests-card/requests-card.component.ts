import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-requests-card',
  templateUrl: './requests-card.component.html',
  styleUrls: ['./requests-card.component.scss']
})
export class RequestsCardComponent implements OnInit {
  @Input() data;
  @Input() index;
  @Input() lang: string;
  cardActions: any = [
    {
      item: 'Delete',
      disabled: false,
      textColor: '',
      icon: ''
    },
    {
      item: 'Update',
      disabled: false,
      textColor: '',
      icon: ''
    }
  ]
  @Output() dropdownSelect: EventEmitter<any> = new EventEmitter()
  constructor(private translationService: TranslateConfigService,
  ) { }

  ngOnInit() {
  }

  onDropdownSelect(e) {
    this.dropdownSelect.emit(e)
  }

  randomNo(i) {
    return i % 5;
  }
}
