import { Component, Input, OnInit } from '@angular/core';
import { BauDashboardStatisticsModel } from '../../models/bau-dashboard';

@Component({
  selector: 'app-bau-dashboard-statistics',
  templateUrl: './bau-dashboard-statistics.component.html',
  styleUrls: ['./bau-dashboard-statistics.component.scss']
})
export class BauDashboardStatisticsComponent implements OnInit {

  //TODO VARIABLES
  @Input() language: string

  @Input() mainTasks: BauDashboardStatisticsModel;

  @Input() totalTasks: BauDashboardStatisticsModel

  @Input() overallProgress: BauDashboardStatisticsModel
  constructor() { }

  ngOnInit(): void {
  }

}
