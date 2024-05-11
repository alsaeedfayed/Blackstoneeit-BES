import { Component, Input, OnInit } from '@angular/core';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';

@Component({
  selector: 'app-strategy-mapping-list',
  templateUrl: './strategy-mapping-list.component.html',
  styleUrls: ['./strategy-mapping-list.component.scss']
})
export class StrategyMappingListComponent implements OnInit {

  @Input() list: StrategyMappingKPI[] = [];
  @Input() language: string = '';
  @Input() hasTitle: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
