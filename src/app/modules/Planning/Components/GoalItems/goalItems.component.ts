import { GoalChangeStatus } from './../../enum/enums';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { listViewMode } from './../../../../shared/components/view-modes/viewMode.enum';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { IGoalItem } from '../GoalItem/interfaces';
import { GoalItemsModel } from './goalItems.model';
import { PlanningService } from '../../Page/planning.service';

@Component({
  selector: 'goal-items',
  templateUrl: './goalItems.component.html',
  styleUrls: ['./goalItems.component.scss'],
  providers: [GoalItemsModel],
})
export class GoalItemsComponent implements OnInit, OnDestroy {
  @Input() ShowAction: boolean = false;
  @Input() public set viewMode(viewMode: listViewMode) {
    this.model.viewMode = viewMode;
  }
  @Input() public set goalItems(goalItems: Array<IGoalItem>) {
    this.model.goalItems = goalItems;
    if (goalItems && goalItems.length > 0) {
      this.model.setGoalListItems(goalItems);
    }
  }

  @Input() public set flatenedGoalItems(goalItems: Array<IGoalItem>) {
    this.model.flatenedGoalItems = goalItems;
  }

  @Input() public set expandedChildrenItems(expandedChildren: string[]) {
    this.expandedChildren = expandedChildren;
  }

  public expandedChildren: string[] = [];
  public GoalActions = [
    // {
    //   item: this.translateService.instant('shared.add'),
    //   disabled: false,
    //   textColor: '',
    //   icon: '',
    // },
    {
      item: this.translateService.instant('shared.edit'),
      disabled: false,
      textColor: '',
      icon: '',
    },
    {
      item: this.translateService.instant('shared.delete'),
      disabled: false,
      textColor: '',
      icon: '',
    },
  ];
  public GoalActionsNoAdd = [
    {
      item: this.translateService.instant('shared.edit'),
      disabled: false,
      textColor: '',
      icon: '',
    },
    {
      item: this.translateService.instant('shared.delete'),
      disabled: false,
      textColor: '',
      icon: '',
    },
  ];
  // @Input() public set goalListItems(goalItems: Array<IGoalItem>) {
  //   this.model.goalListItems = goalItems;
  // }

  @Output() addChildEvent = new EventEmitter();
  @Output() editChildEvent = new EventEmitter();
  @Output() deleteChildEvent = new EventEmitter();
  @Output() setExpandedChildrenEvent = new EventEmitter();
  @Output() editActionTriggered = new EventEmitter();
  // @Output() addActionTriggerer = new EventEmitter();
  @Output() deleteActionTriggerer = new EventEmitter();
  @Output() undoActionTriggerer = new EventEmitter();

  //================ Constructor=================
  constructor(
    public model: GoalItemsModel,
    private planningSer: PlanningService,
    private translateService: TranslateService
  ) {
    this.model.deleteChildEvent
      .pipe(takeUntil(this.model.endSub$))
      .subscribe((data) => this.deleteChildEvent.emit(data));
    this.translateService.onLangChange
      .pipe(takeUntil(this.model.endSub$))
      .subscribe(() => {
        this.GoalActions = [
          // {
          //   item: this.translateService.instant('shared.add'),
          //   disabled: false,
          //   textColor: '',
          //   icon: '',
          // },
          {
            item: this.translateService.instant('shared.edit'),
            disabled: false,
            textColor: '',
            icon: '',
          },
          {
            item: this.translateService.instant('shared.delete'),
            disabled: false,
            textColor: '',
            icon: '',
          },
        ];
        this.GoalActionsNoAdd = [
          {
            item: this.translateService.instant('shared.edit'),
            disabled: false,
            textColor: '',
            icon: '',
          },
          {
            item: this.translateService.instant('shared.delete'),
            disabled: false,
            textColor: '',
            icon: '',
          },
        ];
      });
  }

  ngOnInit(): void {}

  public getIsExpanded(id: string): boolean {
    return this.expandedChildren.includes(id);
  }

  updateExpanedArray(isAdd: boolean, parentId: string) {
    if (isAdd) {
      this.expandedChildren.push(parentId);
    } else {
      this.expandedChildren = this.expandedChildren.filter(
        (id) => id != parentId
      );
    }
    this.setExpandedChildrenEvent.emit(this.expandedChildren);
  }

  ngOnDestroy(): void {
    this.model.endsubs();
  }

  onActionDropDownSelect(select: string, goal: IGoalItem) {
    if (select) {
      // if (select.toLocaleLowerCase().includes('add') || select.toLocaleLowerCase().includes('ضافة'))
      //   this.addActionTriggerer.emit(goal);
      //else
      if (
        select.toLocaleLowerCase().includes('edit') ||
        select.toLocaleLowerCase().includes('تعديل')
      )
        this.editActionTriggered.emit(goal);
      else if (
        select.toLocaleLowerCase().includes('delete') ||
        select.toLocaleLowerCase().includes('حذف')
      )
        this.deleteActionTriggerer.emit(goal);
    }
    return;
  }

  getChangeStatus(goalStatus: GoalChangeStatus) {
    if (goalStatus == GoalChangeStatus.addedGoal) {
      return {
        label: this.translateService.instant('Planning.AddedGoal'),
        icon: 'bx-plus',
      };
    } else if (goalStatus == GoalChangeStatus.editedGoal) {
      return {
        label: this.translateService.instant('Planning.EditedGoal'),
        icon: 'bxs-edit',
      };
    } else {
      return {
        label: this.translateService.instant('Planning.RemovedGoal'),
        icon: 'bxs-trash-alt',
      };
    }
  }

  isRemovedGoal(goalStatus: GoalChangeStatus) {
    return goalStatus === GoalChangeStatus.removedGoal;
  }

  public UndoActionHandler(goal: any) {
    this.undoActionTriggerer.emit(goal);
  }

}
