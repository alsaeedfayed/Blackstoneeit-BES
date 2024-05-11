import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ComponentBase } from 'src/app/core/helpers/component-base.directive'
import { TranslateConfigService } from 'src/app/core/services/translate-config.service'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-servicedashboard',
  templateUrl: './servicedashboard.component.html',
  styleUrls: ['./servicedashboard.component.scss'],
})
export class ServicedashboardComponent extends ComponentBase implements OnInit {
  //TODO VARIABLES
  showServicesAndRequests: boolean = true
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
  ) {
    super(translateService, translate)
  }

  ngOnInit(): void {}

  //TODO Actions
  handleFilter(filterData: any) {
    console.log(filterData)
  }
}
