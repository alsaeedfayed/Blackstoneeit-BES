import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { IGroupIdentity } from './../../../group-identity/interfaces/interfaces';
import { takeUntil, finalize } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { informativeFilterGoals } from '../../Interfaces/interfaces';
import { Subject } from 'rxjs';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { licenceKey } from 'src/license/license';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'performance-reports-header',
  templateUrl: './performance-reports-header.component.html',
  styleUrls: ['./performance-reports-header.component.scss'],
})
export class PerformanceReportsHeaderComponent implements OnDestroy {
  private endSub$ = new Subject();
  public isDownloading: boolean = false;
  public language = this.translateService.currentLang;
  public selectedGroup: number;
  public selectLevel: LevelMode = LevelMode.L0;
  public selectedGoal: any;
  public filteredGoals: informativeFilterGoals[] = [];
  public slectedScorecardId: number;
  public selectedPeriodId: number;
  // Inputs & Outputs

  @Input() public set SelectedScorecardId(id: number) {
    this.slectedScorecardId = id;
  }
  @Input() public set SelectedPeriodId(periodId: number) {
    this.selectedPeriodId = periodId;
  }

  @Output() changeGroup: EventEmitter<any> = new EventEmitter();
  @Output() changeGoal: EventEmitter<any> = new EventEmitter();
  @Output() doneData: EventEmitter<any> = new EventEmitter();


  constructor(
    private translateService: TranslateService,
    private httpHandlerService: HttpHandlerService,
    private userSer: UserService,
    private exportFilesService: ExportFilesService
  ) {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.pipe().subscribe(() => {
      this.language = this.translateService.currentLang;
    });
  }


  getMyGoals() {
    this.selectedGoal = null;
    this.httpHandlerService
      .get(
        `${Config.Performance.GetInformativeGoals}/${this.slectedScorecardId
        }?groupId=${this.selectedGroup ?? ''}`
      )
      .pipe(takeUntil(this.endSub$))
      .subscribe((goals) => {
        this.filteredGoals = goals;
        this.handleTreeValue();
      });
  }
  private handleTreeValue() {
    const dig = (items, path = '0', level = 3): NzTreeNodeOptions[] => {
      const list = [];
      if (items?.length > 0) {
        for (let i = 0; i < items.length; i += 1) {
          const key = `${path}-${i}`;
          const treeNode: NzTreeNodeOptions = {
            title: this.language === 'en' ? items[i]?.title : items[i]?.titleAr,
            key: items[i]?.id,
            expanded: false,
            children: items[i].children,
            isLeaf: items[i].children.length > 0 ? false : true,
          };

          if (level > 0) {
            treeNode.children = dig(treeNode.children, key, level - 1);
          } else {
            treeNode.isLeaf = true;
          }
          list.push(treeNode);
        }
      }
      return list;
    };
    this.filteredGoals = dig(this.filteredGoals);
  }

  public groupSelectedHandler(group: IGroupIdentity) {
    this.selectedGoal = null;
    this.selectedGroup = group ? group.id : null;
    this.selectLevel = group ? group.level : LevelMode.L0;
    const selectedGroup = group ? group.id : null;
    this.changeGroup.emit(selectedGroup);
    this.getMyGoals();
    this.doneData.emit();
  }

  public chaneGoalHandler(Goal: number) {
    this.changeGoal.emit(Goal);
  }

  public exportDataHandler() {
    if (this.isDownloading) return;
    this.isDownloading = true;

    let url = `${Config.Performance.Export}?ScorecardId=${this.slectedScorecardId
      }&Level=${this.selectLevel ?? ''}&GroupId=${this.selectedGroup ? this.selectedGroup : ''
      }&ParentGroupId=${this.selectedGoal ?? ''}&PeriodId=${this.selectedPeriodId ?? ''
      }`
    this.exportFilesService.exportData("GET", url, 'Goals.xlsx').finally(() => {
      this.isDownloading = false;
    })
  }

  get isShowExport(): boolean {

    return (
      (this.selectLevel && this.selectLevel == LevelMode.L0) ||
      (this.selectLevel && !!this.selectedGroup)
    );
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
