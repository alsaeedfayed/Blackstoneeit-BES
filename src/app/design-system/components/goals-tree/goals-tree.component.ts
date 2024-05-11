import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StrategicGoalsService } from '../../services/strategic-goals/strategic-goals.service';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';

@Component({
  selector: 'app-goals-tree',
  templateUrl: './goals-tree.component.html',
  styleUrls: ['./goals-tree.component.scss']
})
export class GoalsTreeComponent implements OnInit {


  public lang: string = this.translate.currentLang;
  public _data: Array<any> = new Array<any>();
  public children: Array<any> = new Array<any>();
  public allowExpandAll: boolean = true;

  selectedGoalsIds: number[] = []
  selectedGoals: any[] = [];
  totalWeight: number = 0;
  @Input() otherWeight: number = 0;
  @Output() ontoggleExpandAll = new EventEmitter<boolean>();
  @Output() onDelete = new EventEmitter<StrategyMappingKPI>();
  @Input() showColumns: boolean = false;
  @Input() isEditAble: boolean = true;
  @Input() canDeleteNotMeasurableGoals: boolean = false;

  @Input() set data(_data: Array<any>) {
    this._data = _data;
    this.children = this._data?.filter(goal => goal?.children);
    if (this.isEditAble) {
      this.selectedGoalsIds = this.strategicGoalsService.selectedGoalsIds;
      if (this.selectedGoalsIds.length > 0) {
        // reset selected KPIs
        this.selectedGoals = [];
        // check selected KPIs
        this._data?.forEach(goal => {
          this.updateCheckedNodes(goal);
        })
      }
      this.totalWeight = 0;
      this._data?.forEach(goal => {
        this.getTotalWeight(goal);
      })

    } else {
      this.toggleViewGoals(true);
      this._data?.forEach(goal => {
        this.getSelectedTotalWeight(goal);
      })
    }
  }

  @Input() set _selectedGoalsIds(v: Array<number>) {
    this.selectedGoalsIds = this.strategicGoalsService.selectedGoalsIds;
    this.selectedGoals = [];

    this._data?.forEach(goal => {
      this.updateCheckedNodes(goal);
    })
  }

  constructor(
    private translate: TranslateService,
    private strategicGoalsService: StrategicGoalsService
  ) {
  }
  measurementMethods: any = [];
  ngOnInit(): void {
    this.handleLangChange()
    // this.measurementMethods = this.strategicGoalsService.measurementMethods;
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  toggleNestedList(goal) {
    goal.open = !goal.open;
  }

  getLabel(label) {
    return this.translate.instant('shared.' + label)
  }

  toggleViewGoals(flag: boolean) {
    this._data?.forEach(goal => {
      goal.open = flag;
      this.checkChildren(goal, flag);
    })
    this.allowExpandAll = !this.allowExpandAll;
    this.ontoggleExpandAll.emit(flag);
  }

  checkChildren(goal: any, flag: boolean) {
    for (let index = 0; index < goal?.children?.length; index++) {
      goal.children[index].open = flag;
      this.checkChildren(goal.children[index], flag);
    }
    //return;
  }

  goalChecked(goal) {
    if (goal.isChecked) {
      this.selectedGoals.push(goal);
      this.totalWeight += goal.internalWeight;
    } else {
      let index = this.selectedGoals.findIndex(g => g.id == goal.id);
      if (index > -1) {
        this.selectedGoals.splice(index, 1);
        this.totalWeight -= goal.internalWeight;
      }
    }
    this.strategicGoalsService.selectedGoalsIds = this.selectedGoals.map(g => g.id);

    // to inform any listener that the selected goals have changed
    this.strategicGoalsService.changeHappened$.next('');
  }
  checkedFlag: boolean = false;


  updateCheckedNodes(node: any) {
    if (this.selectedGoalsIds.includes(node.id)) {
      node.isChecked = true;
      this.selectedGoals.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        this.updateCheckedNodes(child);
      }
    }
    // check if onr of children in any level is checked then expand the node
    this.isChildChecked(node) && (node.open = true);
    // reset Check flag
    this.checkedFlag = false;
  }

  isChildChecked(node: any): boolean {
    if (node.children) {
      for (const child of node.children) {
        if (child.isChecked) this.checkedFlag = true;
        this.isChildChecked(child);
      }
    }
    return this.checkedFlag;
  }

  deleteGoal(goal) {
    this.onDelete.emit(goal);
  }

  getTotalWeight(node: any) {
    if (node.isChecked) {
      this.totalWeight += node.internalWeight;
    }
    if (node.children) {
      for (const child of node.children) {
        this.getTotalWeight(child);
      }
    }
  }
  getSelectedTotalWeight(node: any) {
    if (node.goalTypeId == 4) {
      this.totalWeight += node.internalWeight;
    }
    if (node.children) {
      for (const child of node.children) {
        this.getSelectedTotalWeight(child);
      }
    }
  }
}