import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';

@Component({
  selector: 'app-committee-strategic-goals',
  templateUrl: './committee-strategic-goals.component.html',
  styleUrls: ['./committee-strategic-goals.component.scss']
})
export class CommitteeStrategicGoalsComponent implements OnInit {

  formGoals: StrategyMappingKPI[][] = [];
  form: FormGroup;

  selectedGoalsIds: number[] = []
  // loading vars
  isGoalsLoading: boolean = false;
  isDeleting: boolean = false;
  @Input() language: string = ''
  _mappedGoals: any = [];
  @Input()
  public set mappedGoals(v: string) {
    if (this.isGoalsLoading && !this.isDeleting) {
      this.toastr.success(this.translate.instant('shared.goalAdded'));
    }
    else if (this.isGoalsLoading && this.isDeleting) {
      this.toastr.success(this.translate.instant('shared.goalDeleted'));
    }
    this.isGoalsLoading = false;
    this.isDeleting = false;
    this._mappedGoals = v;
    this.selectedGoalsIds = [];
    // get goals ids 
    this._mappedGoals.forEach(node => {
      this.geTreeIds(node);
    });
  }
  @Input()
  public set strategicGoals(strategicGoals: StrategyMappingKPI[]) {
    this.formGoals[0] = strategicGoals;
  }

  @Output() onGoalsChanged = new EventEmitter<number[]>();
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {

    // initialize new committee form controls
    this.initStrategicGoalsFormControls();
  }
  geTreeIds(node) {
    this.selectedGoalsIds.push(node.id);
    if (node.children) {
      node.children.forEach(child => {
        this.geTreeIds(child);
      });
    }
  }
  // initialize new committee form controls
  initStrategicGoalsFormControls() {
    this.form = this.fb.group({
      goals: this.fb.array([
        new FormControl(null),
      ])
    });
  }

  get goals() {
    return this.form.get('goals') as FormArray;
  }


  addGoal(parentGoal: StrategyMappingKPI, parentLevel) {
    // if select a goal
    if (parentGoal) {
      if (parentGoal.children.length == 0) return;

      // delete previous goals under the current level
      while (this.goals.length > parentLevel + 1) {
        this.goals?.removeAt(parentLevel + 1);
      }
      // set new goals under the current level from the current parent 
      this.formGoals[parentLevel + 1] = parentGoal?.children;

      // add new form control for the new level
      const goal = new FormControl(null);
      this.goals.push(goal);

    } else {
      // delete previous goals under the current level
      while (this.goals.length > parentLevel + 1) {
        this.goals?.removeAt(parentLevel + 1);
      }

    }
  }
  addNewGoal() {
    // check if there are no selected goals
    if (this.goals.value.every(element => element === null)) return;
   
    // add  the selected goals to the list
    let newGoals = this.goals.value.filter(g => g != null);
    if(this.selectedGoalsIds.includes(newGoals[newGoals.length - 1].id)){
      this.toastr.error(this.translate.instant('shared.alreadyAdded'));
      return;
    }
    this.isGoalsLoading = true;
    newGoals.forEach(element => {
      if (!this.selectedGoalsIds.includes(element.id))
        this.selectedGoalsIds.push(element.id);
    });
    this.onGoalsChanged.emit(this.selectedGoalsIds);

    // reset the form
    let firstLevel = 0;
    while (this.goals.length > firstLevel + 1) {
      this.goals?.removeAt(firstLevel + 1);
    }
    this.goals.at(firstLevel).setValue(null);

  }

  deleteGoal(goal) {
    this.isGoalsLoading = true;
    this.isDeleting = true;
    this.removeIdAndChildren(goal);
    this.onGoalsChanged.emit(this.selectedGoalsIds);

  }

  removeIdAndChildren(goal: any): void {
    const indexToRemove = this.selectedGoalsIds.indexOf(goal.id);
    if (indexToRemove !== -1) {
      this.selectedGoalsIds.splice(indexToRemove, 1);
    }
    if (goal.children?.length > 0) {
      goal.children.forEach((child) => {
        this.removeIdAndChildren(child);
      })
    }
  }

}
