import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { SidebarService } from 'src/app/layout/sidebar/sidebar-service/sidebar.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent extends ComponentBase implements OnInit {
  constructor(
    private sidebarService: SidebarService,
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
  }

  ngOnInit() {}

  goBack() {
    this.sidebarService.navigateToFirstMenu();
  }
}
