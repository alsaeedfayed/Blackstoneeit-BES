import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-change-request-page',
  templateUrl: './change-request-page.component.html',
  styleUrls: ['./change-request-page.component.scss']
})
export class ChangeRequestPageComponent extends ComponentBase implements OnInit {

  constructor(translateService: TranslateConfigService,
    translate: TranslateService) {
    super(translateService, translate);
  }

  ngOnInit(): void {
  }

}
