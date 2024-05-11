import { Component, Input, OnInit } from '@angular/core';
import { BauDashboardStatisticsModel } from '../../dashboard/models/bau-dashboard';

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  styleUrls: ['./statistic-card.component.scss']
})
export class StatisticCardComponent implements OnInit {

  //TODO VARIABLES
  @Input() language : string
  @Input() title : string;
  @Input() statistics : BauDashboardStatisticsModel
  @Input() iconsClass : string;
  @Input() statusText : string
  @Input() isChart : boolean = false
  @Input() statusColor : string
  constructor() { }

  ngOnInit(): void {
  }

}
