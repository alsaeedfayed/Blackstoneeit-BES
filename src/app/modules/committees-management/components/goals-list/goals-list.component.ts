import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';

@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.scss']
})
export class GoalsListComponent implements OnInit {

  @Input() list: StrategyMappingKPI [] = [];
  @Input() language: string = '';
  @Input() hasTitle: boolean = false;
  @Output() onDelete= new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
  deleteGoal(id:number){
    this.onDelete.emit(id);
  }
}
