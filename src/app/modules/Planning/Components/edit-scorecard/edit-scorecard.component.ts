import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { editScorecardModel } from './edit-scorecard.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Level } from 'src/app/modules/groups/components/groups-main/enums';

@Component({
  selector: 'app-edit-scorecard',
  templateUrl: './edit-scorecard.component.html',
  styleUrls: ['./edit-scorecard.component.scss'],
  providers: [editScorecardModel],
})
export class EditScorecardComponent
  extends ComponentBase
  implements OnInit, OnDestroy
{
  public isEditGoal: boolean = false;
  public showAddModel: boolean = false;
  public showEditModel: boolean = false;
  public levels: { id: number; label: String; labelAr: string }[] = [
    {
      id: Level.L0,
      label: 'L0',
      labelAr: 'L0',
    },
    {
      id: Level.L1,
      label: 'L1',
      labelAr: 'L1',
    },
    {
      id: Level.L2,
      label: 'L2',
      labelAr: 'L2',
    },
    {
      id: Level.L3,
      label: 'L3',
      labelAr: 'L3',
    },
  ];

  // tranlsations instants
  editGoalTitle = this.translate.instant('Planning.editGoal');
  addGoalTitle = this.translate.instant('Planning.addGoal');
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    public model: editScorecardModel
  ) {
    super(translateService, translate);
    this.model.lang = this.translate.currentLang;
    this.translate.onLangChange
      .pipe(takeUntil(this.model.endSub$))
      .subscribe(() => {
        this.model.lang = this.translate.currentLang;
      });
  }

  ngOnInit(): void {
    this.handleLangChange();
  }

  ngOnDestroy(): void {
    this.model.endSubs();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe(() => {
      this.model.relatedChangeRequests = [...this.model.relatedChangeRequests];
      this.model.sectionLabel = this.translate.instant('Planning.section');
      this.model.sectorsLabel = this.translate.instant('Planning.sectors');
      this.model.sectionsLabel = this.translate.instant('Planning.sections');
      this.model.departmentsLabel = this.translate.instant('Planning.departments');
      this.editGoalTitle = this.translate.instant('Planning.editGoal');
      this.addGoalTitle = this.translate.instant('Planning.addGoal');
      this.model.filteredGroups = [...this.model.filteredGroups]
    });
  }

  closeEditGoalModel() {
    this.model.showEditModel = false;
  }

  closeAddGoalModel() {
    this.model.showAddModel = false;
  }

}
