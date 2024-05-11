import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BauDashBoardSectorPerformance } from '../../models/bau-dashboard';

@Component({
  selector: 'app-bau-dashboard-sector-performance',
  templateUrl: './bau-dashboard-sector-performance.component.html',
  styleUrls: ['./bau-dashboard-sector-performance.component.scss']
})
export class BauDashboardSectorPerformanceComponent implements OnInit {

  //TODO VARIABLES
  @Input() language : string;
  @Input() sectorPerformanceData : BauDashBoardSectorPerformance[]

  @Output() isTasksSectorPerformance : EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }


  //TODO METHODS
  onSwitchChange(event){
    this.isTasksSectorPerformance.emit(event)
  }
}
