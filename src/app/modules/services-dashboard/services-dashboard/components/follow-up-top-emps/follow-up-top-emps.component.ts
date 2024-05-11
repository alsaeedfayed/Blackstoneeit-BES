import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { TopLoadedUsers } from '../../models/dashboard.model'

@Component({
  selector: 'app-follow-up-top-emps',
  templateUrl: './follow-up-top-emps.component.html',
  styleUrls: ['./follow-up-top-emps.component.scss'],
})
export class FollowUpTopEmpsComponent implements OnInit {
  //TODO VARIABLE
  topLoadedEmps: TopLoadedUsers[]
  lang: string = this.translateService.currentLang;

  @Input('data') set daata(data: any) {
    this.topLoadedEmps = data
    console.log('topddd' , this.topLoadedEmps)
  }
  constructor(
    private translateService: TranslateService,
    private serviesDashboard: ServicesDashboardService,
  ) {}

  ngOnInit(): void {
    //this.getTopLoadedEmpsData()
  }

  //TODO ACTIONS
  // getTopLoadedEmpsData() {
  //   this.serviesDashboard
  //     .getFollowUpTopLoadedEmployees()
  //     .subscribe((res: TopLoadedUsers[]) => {
  //       this.topLoadedEmps = res
  //     })
  // }
}
