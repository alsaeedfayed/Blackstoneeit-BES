import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { CategoriesSLA } from '../../models/dashboard.model';
import { Subject } from 'rxjs'
@Component({
  selector: 'app-services-dashboard-sla',
  templateUrl: './services-dashboard-sla.component.html',
  styleUrls: ['./services-dashboard-sla.component.scss'],
})
export class ServicesDashboardSlaComponent implements OnInit {
  //TODO VARIABLE
  private endSub$ = new Subject()
  @Input('data') data: CategoriesSLA[]
  lang: string = this.translateService.currentLang
  constructor(
    private translateService: TranslateService,
    private servicesDashboard: ServicesDashboardService,
  ) {}

  ngOnInit(): void {
    this.lang = 'en'
    this.handleLangChange()
  }
  handleLangChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.lang = this.translateService.currentLang
    })
  }
}
