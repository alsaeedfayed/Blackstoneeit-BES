import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { PerformanceDashboardComponent } from './pages/performance-dashboard/performance-dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
// import { OverallSummaryComponent } from './components/overall-summary/overall-summary.component';
// import { GroupPerformanceComponent } from './components/group-performance/group-performance.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: PerformanceDashboardComponent,
      data: { title: 'Performance Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      // children: [
      //  // { path: '', redirectTo: 'main-dashboard/:selectedScoreCardId', pathMatch: 'full' },
      //   {
      //     path: '', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard/:selectedScoreCardId', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard/:selectedScoreCardId/:selectedGroupId', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   // {
      //   //   path: 'overall-summary', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'overall-summary/:selectedScoreCardId', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'overall-summary/:selectedScoreCardId/:selectedGroupId', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance/:selectedScoreCardId', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance/:selectedScoreCardId/:selectedGroupId', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // }
      // ]
    },
    {
      path: 'performance-dashboard',
      component: PerformanceDashboardComponent,
      data: { title: 'Performance Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      // children: [
      //  // { path: '', redirectTo: 'main-dashboard/:selectedScoreCardId', pathMatch: 'full' },
      //   {
      //     path: '', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard/:selectedScoreCardId', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path: 'main-dashboard/:selectedScoreCardId/:selectedGroupId', component: MainDashboardComponent,
      //     data: { title: 'Main Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   // {
      //   //   path: 'overall-summary', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'overall-summary/:selectedScoreCardId', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'overall-summary/:selectedScoreCardId/:selectedGroupId', component: OverallSummaryComponent,
      //   //   data: { title: 'Overall Summary', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance/:selectedScoreCardId', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // },
      //   // {
      //   //   path: 'group-performance/:selectedScoreCardId/:selectedGroupId', component: GroupPerformanceComponent,
      //   //   data: { title: 'Group Performance', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   // }
      // ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PerformanceDashboardRoutingModule {}
