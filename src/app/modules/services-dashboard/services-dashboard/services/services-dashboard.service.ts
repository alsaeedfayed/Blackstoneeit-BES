import { Injectable } from '@angular/core'
import { HttpHandlerService } from 'src/app/core/services/http-handler.service'
import { Config } from 'src/app/core/config/api.config'
import { BehaviorSubject, Subject } from 'rxjs'
import { HttpParams } from '@angular/common/http'
@Injectable({
  providedIn: 'root',
})
export class ServicesDashboardService {
  pieChartData: Subject<any> = new Subject()
  pieChartFollowUpData: Subject<any> = new Subject()
  langSub: BehaviorSubject<any> = new BehaviorSubject({ lang: 'en' })

  constructor(private http: HttpHandlerService) {}

  getServicesRequests() {
    return this.http.get(Config.servicesDashboard.GetRequestsStatics)
  }

  getServicesClosureRate() {
    return this.http.get(Config.servicesDashboard.GetClosureRate)
  }

  getServicesCategoriesSLA() {
    return this.http.get(Config.servicesDashboard.GetCategoriesSLA)
  }

  getRequestsUpTrackingData() {
    return this.http.get(Config.servicesDashboard.GetRequestsTrackingCharts)
  }

  //TODO FOLLOW UP
  getFollowUpPerQuarterData() {
    return this.http.get(Config.servicesDashboard.GetFolloUpPerQuartar)
  }

  getFollowUpMeetingsPerQuarter() {
    return this.http.get(Config.servicesDashboard.GetMeetingsPerQuartar)
  }

  getFollowUpTrackingUpCharts() {
    return this.http.get(Config.servicesDashboard.GetFollowUpTrackingChart)
  }

  getFollowUpItems() {
    return this.http.get(Config.servicesDashboard.GetFollowUpItems)
  }

  getFollowUpClosureRate() {
    return this.http.get(Config.servicesDashboard.GetFollowUpClosureRate)
  }

  getFollowUpTopLoadedEmployees() {
    return this.http.get(Config.servicesDashboard.GetFollowUpLoadedEmp)
  }

  getFollowUpMeetingsStatus() {
    return this.http.get(Config.servicesDashboard.GetFollowUpMeetingsStatus)
  }

  //Filters
  getCategories(requestsQuery) {
    return this.http.get(Config.Lookups.lookupService, requestsQuery)
  }
}
