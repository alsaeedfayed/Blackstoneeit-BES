import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { GoalItemModel } from "./goalItem.model";
import { IGoalItem } from './interfaces';
import { PlanningService } from '../../Page/planning.service';

@Component({
  selector: 'goal-item',
  templateUrl: './goalItem.component.html',
  styleUrls: ['./goalItem.component.scss'],
  providers: [GoalItemModel]
})

export class GoalItemComponent implements OnDestroy {
  public isHovered = false;
  public isExpanded = false;
  expandedArray: any[];
  //======================Inputs=================
  @Input() public set Item(data: IGoalItem) {
    this.model.data = data;
  }
  @Input() public set parentItem(data: IGoalItem) {
    this.model.parentData = data;
  }

  @Input() public set expandedArr(data: string[]) {
    this.expandedArray = data;
  }

  //===================Outputs===================
  @Output() public onAddChild: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onEditChild: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onDeleteChild: EventEmitter<IGoalItem> = new EventEmitter<IGoalItem>();
  @Output() public onChnageCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();

  //================ Constructor=================
  constructor(public model: GoalItemModel,private planningSer:PlanningService) {
    this.model.onAddChild.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.onAddChild.emit(data));
    this.model.onEditChild.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.onEditChild.emit(data));
    this.model.onDeleteChild.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.onDeleteChild.emit(data));
    this.checkExpanded()
  }
  checkExpanded() {
    this.planningSer.expandSub$.pipe(takeUntil(this.model.endSub$)).subscribe((val)=>{
      if(val){
        this.isExpanded = true;
      } else {
        this.isExpanded = false;
      }
      this.onChnageCollapse.emit(this.isExpanded)
    })
  }

  public get Expanded(){
    return this.expandedArray.includes(this.model.data.id)
  }

  ngOnDestroy(): void {
    this.model.endsubs()
  }

  ChangeCollpase(){
    this.isExpanded = !this.isExpanded;
    this.onChnageCollapse.emit(this.isExpanded)
  }

}
