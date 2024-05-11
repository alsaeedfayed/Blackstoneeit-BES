import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateService } from '@ngx-translate/core';

import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-e-services',
  templateUrl: './e-services.component.html',
  styleUrls: ['./e-services.component.scss'],
})
export class EServicesComponent extends ComponentBase implements OnInit {
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {}
}
