import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-requests-milestone-card',
  templateUrl: './requests-milestone-card.component.html',
  styleUrls: ['./requests-milestone-card.component.scss']
})
export class RequestsMilestoneCardComponent implements OnInit {
  @Input() data
  @Input() deliverables
  @Input() readonly
  @Input() mode: string
  @Input() lang: string

  cardProgress: number
  cardActions: any = [
    {
      item: 'shared.update',
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit'
    },
    {
      item: 'shared.delete',
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash'
    }
  ]
  @Output() select: EventEmitter<any> = new EventEmitter();
  constructor(private translationService: TranslateConfigService) { }

  ngOnInit() {
  }

  onDropDownSelect(event) {
    this.select.emit(event)
  }

}
