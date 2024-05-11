import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ConfigureComponent } from './pages/configure/configure.component';
import { ConfigTableComponent } from './components/table/config-table.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ConfigureComponent,
      data: { title: 'Configuration', displaySidebar: true },

      children: [
        { path: '', redirectTo: 'manage-scorecards', pathMatch: 'full' },
        {
          path: '',
          component: ConfigTableComponent,
          data: { title: 'Configuration Goal Type', displaySidebar: true }, // This is the page title showing in the tab (in browser)
        },
        {
          path: 'goal-type',
          loadChildren: () =>
            import('./Modules/goal-types-settings/goal-types-settings.module').then(
              (m) => m.GoalTypesSettingsModule
            ),
          data: { title: 'Configuration Goal Type', displaySidebar: true }, // This is the page title showing in the tab (in browser)
        },
        {
          path: 'window-config',
          component: ConfigTableComponent,
          data: { title: 'Configuration Window Config', displaySidebar: true }, // This is the page title showing in the tab (in browser)
        },
        {
          path: 'manage-scorecards',
          loadChildren: () =>
            import('../mange-scorecards/mange-scorecards.module').then(
              (m) => m.MangeScorecardsModule
            ),
          data: { title: 'Manage Scorecards', displaySidebar: true }, // This is the page title showing in the tab (in browser)
        },
      ],

      // children:[
      //   { path: '', redirectTo: 'goal-type', pathMatch: 'full' },
      //   {
      //     path:'' ,component:GoalTypeComponent,
      //     data: { title: 'Configuration Goal Type', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path:'goal-type' ,component:GoalTypeComponent,
      //     data: { title: 'Configuration Goal Type', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   },
      //   {
      //     path:'window-config' ,component:ConfigTableComponent,
      //     data: { title: 'Configuration Window Config', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      //   }
      // ]
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigureRoutingModule { }
