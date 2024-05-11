import { TranslateService } from '@ngx-translate/core';
import { LevelMode } from './../../../Planning/enum/enums';
import { Config } from 'src/app/core/config/api.config';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy, Input} from '@angular/core';
import { IGroupIdentity } from '../../interfaces/interfaces';

@Component({
  selector: 'sector-department-function',
  templateUrl: './sector-department-function.component.html',
  styleUrls: ['./sector-department-function.component.scss'],
})
export class SectorDepartmentFunctionComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public language = this.translateService.currentLang;
  public loading: boolean = false;
  // Localstorage Keys
  public selectedSectorKey = 'selectedSector';
  public selectedDeptKey = 'selectedDept';
  public selectedFuncKey = 'selectedfunc';
  // All Groups
  public faltenedGroups: IGroupIdentity[] = [];
  // L0,L1 Groups
  public sectors: IGroupIdentity[] = [];
  // L2 Groups
  public departments: IGroupIdentity[] = [];
  // L3 Groups
  public functions: IGroupIdentity[] = [];
  // Selected
  public selectedSector: IGroupIdentity | null = null;
  public selectedDepartment: IGroupIdentity | null = null;
  public selectedFunction: IGroupIdentity | null = null;
  public selectedGroup: IGroupIdentity | null = null;
  // INPUTS & OUTPUTS
  @Output() onSelect: EventEmitter<IGroupIdentity> = new EventEmitter();
  @Input() allowLabel: boolean = true;
  private sessionGroupKey = "Performance-Dashboard-Group";
  private sessionSubmissionGroupKey = "Submission-Group";

  constructor(
    private httpService: HttpHandlerService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.handleLangChange();
    this.getAllGroups();
  }

  private handleLangChange() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateService.currentLang;
      });
  }

  // Get Groups
  private getAllGroups() {
    this.loading = true;
    this.httpService
      .get(Config.Performance.getMyHirechy)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loading = false))
      )
      .subscribe((groups: IGroupIdentity[]) => {
        this.flatengroups(groups);
        this.sectors = this.faltenedGroups.filter(
          (group) =>
            group.level === LevelMode.L1
        );

        // deafult first item for sector (Esraa)
        if (this.sectors?.length > 0) {
          // debugger
          if(window.location.href.includes('performance-dashboard')) {
            if(!localStorage.getItem(this.sessionGroupKey) || localStorage.getItem(this.sessionGroupKey) == 'undefined') {
              let selectedSectorItem = this.sectors[0];
              if (selectedSectorItem) {
                this.selectedSector = selectedSectorItem;
                this.sectorSelectedHandler(this.selectedSector)
                localStorage.setItem(this.sessionGroupKey, (this.selectedSector.id).toString());
              }
            }
          }
          else if(window.location.href.includes('score-submission')) {
            if(!localStorage.getItem(this.sessionSubmissionGroupKey) || localStorage.getItem(this.sessionSubmissionGroupKey) == 'undefined') {
              let selectedSectorItem = this.sectors[0];
              if (selectedSectorItem) {
                this.selectedSector = selectedSectorItem;
                this.sectorSelectedHandler(this.selectedSector)
                localStorage.setItem(this.sessionSubmissionGroupKey, (this.selectedSector.id).toString());
              }
            }
          }
        }

        if (localStorage.getItem(this.selectedSectorKey)) {
          this.setOldVals()
        }
        this.emitGroupId();
      });
  }
  public sectorSelectedHandler(sector: IGroupIdentity) {
    // Reset department and function
    this.resetDepartments();
    this.resetFunctions();
    if (sector !== undefined) this.emitGroupId();
    if (sector) {
      localStorage.setItem(this.selectedSectorKey, JSON.stringify(sector.id))
      this.departments = sector.children.filter(
        (group) => group.level === LevelMode.L2
      );
      // deafult first item for department (Esraa)
      // if (this.departments?.length > 0) {
      //   if(window.location.href.includes('performance-dashboard')) {
      //     if(!localStorage.getItem(this.sessionGroupKey) || localStorage.getItem(this.sessionGroupKey) == 'undefined') {
      //       let selectedDepartmentItem = this.departments[0];
      //       if (selectedDepartmentItem) {
      //         this.selectedDepartment = selectedDepartmentItem;
      //         this.departmentSelectedHandler(this.selectedDepartment)
      //         localStorage.setItem(this.sessionGroupKey, (this.selectedDepartment.id).toString());
      //       }
      //     }
      //   }
      // }
    } else {
      localStorage.removeItem(this.selectedSectorKey)
    }
  }

  public departmentSelectedHandler(department: IGroupIdentity) {
    // Reset function
    this.resetFunctions();
    if (department !== undefined) this.emitGroupId();
    if (department) {
      localStorage.setItem(this.selectedDeptKey, JSON.stringify(department.id))
      this.functions = department.children.filter(
        (group) => group.level === LevelMode.L3
      );
      // deafult first item for function (Esraa)
      // if (this.functions?.length > 0) {
      //   if(window.location.href.includes('performance-dashboard')) {
      //     if(!localStorage.getItem(this.sessionGroupKey) || localStorage.getItem(this.sessionGroupKey) == 'undefined') {
      //       let selectedFunctionItem = this.functions[0];
      //       if (selectedFunctionItem) {
      //         this.selectedFunction= selectedFunctionItem;
      //         this.functionSelectedHandler(this.selectedFunction)
      //         localStorage.setItem(this.sessionGroupKey, (this.selectedFunction.id).toString());
      //       }
      //     }
      //   }
      // }
    }
    else {
      localStorage.removeItem(this.selectedDeptKey)
    }
  }

  public functionSelectedHandler(functions: IGroupIdentity) {
    if (functions !== undefined) this.emitGroupId();
    if(functions){
      localStorage.setItem(this.selectedFuncKey, JSON.stringify(functions.id))
    } else {
      localStorage.removeItem(this.selectedFuncKey)
    }
  }

  // Utilities
  private flatengroups(groups: IGroupIdentity[]) {
    groups.forEach((group: IGroupIdentity) => {
      this.faltenedGroups.push(group);
      if (group.children && group.children.length > 0) {
        this.flatengroups(group.children);
      }
    });
  }

  private resetDepartments() {
    this.selectedDepartment = null;
    this.departments = [];
    localStorage.removeItem(this.selectedDeptKey)
  }

  private resetFunctions() {
    this.selectedFunction = null;
    this.functions = [];
    localStorage.removeItem(this.selectedFuncKey);
  }



  private emitGroupId() {
    let group =
      this.selectedFunction ??
      this.selectedDepartment ??
      this.selectedSector ??
      null;

    this.selectedGroup = group;
    this.onSelect.emit(group);
  }

  private setOldVals() {
    const selectedSectorId = localStorage.getItem(this.selectedSectorKey);
    const selectedDeptId = localStorage.getItem(this.selectedDeptKey);
    const selectedFuncId = localStorage.getItem(this.selectedFuncKey);

    if (selectedSectorId) {
      let selectedSectorItem = this.sectors.find((sector) => sector.id === +selectedSectorId);
      if (selectedSectorItem) {
        this.selectedSector = selectedSectorItem;
        this.sectorSelectedHandler(this.selectedSector)
      }
    }
    if (selectedDeptId) {
      let selectedDeptItem = this.departments.find((dept) => dept.id === +selectedDeptId);
      if (selectedDeptItem) {
        this.selectedDepartment = selectedDeptItem;
        this.departmentSelectedHandler(this.selectedDepartment)
      }
    }

    if (selectedFuncId) {
      let selectedFuncItem = this.functions.find((func) => func.id === +selectedFuncId);
      if (selectedFuncItem) {
        this.selectedFunction = selectedFuncItem;
        this.functionSelectedHandler(this.selectedFunction)
      }
    }
  }

  public resetAll() {
    this.selectedSector = null;
    this.selectedDepartment = null;
    this.selectedFunction = null;
  }

  public compareWith(a: IGroupIdentity, b: IGroupIdentity) {
    return a.id === b.id;
  }

  public get showL0Badge(): boolean {
    return !this.selectedGroup || (this.selectedGroup && this.selectedGroup.level === LevelMode.L0)
  }

  // Unsubscribe
  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
