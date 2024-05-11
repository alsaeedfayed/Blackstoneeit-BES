import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-evaluation-main-page',
  templateUrl: './evaluation-main-page.component.html',
  styleUrls: ['./evaluation-main-page.component.scss']
})
export class EvaluationMainPageComponent extends ComponentBase implements OnInit {
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {}
}
