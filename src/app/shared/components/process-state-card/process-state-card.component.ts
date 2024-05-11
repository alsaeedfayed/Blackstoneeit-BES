import { Component, Input, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-process-state-card',
  templateUrl: './process-state-card.component.html',
  styleUrls: ['./process-state-card.component.scss']
})
export class ProcessStateCardComponent implements OnInit {
  @Input() data;
  @Input() id;
  lang: string;
  constructor(private translationService: TranslationService) { }

  ngOnInit() {
    this.lang = this.translationService.language
  }

}
