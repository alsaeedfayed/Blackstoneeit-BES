import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { KpisPerformanceStatusComponent } from '../components/kpis-performance-status/kpis-performance-status.component';
import { CommitteeDashboardComponent } from '../pages/committee-dashboard/committee-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DestroyChartGuard implements CanDeactivate<CommitteeDashboardComponent> {
  canDeactivate(
    component: CommitteeDashboardComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //  console.log(component)

    return component.destChart ? true : false;
  }

}
