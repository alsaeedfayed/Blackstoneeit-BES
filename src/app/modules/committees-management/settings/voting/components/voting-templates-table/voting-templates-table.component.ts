import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { VotingTemplatesSortBy, VotingTemplatesSortDirections } from 'src/app/modules/committees-management/enums/enums';
import { Permissions } from 'src/app/core/services/permissions';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';

@Component({
  selector: 'voting-templates-table',
  templateUrl: './voting-templates-table.component.html',
  styleUrls: ['./voting-templates-table.component.scss']
})
export class VotingTemplatesTableComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  sortKey = VotingTemplatesSortBy;
  public sortedCol: VotingTemplatesSortBy | null = null;
  public sortDirection: VotingTemplatesSortDirections = VotingTemplatesSortDirections.Asc;

  @Input() public set SortedCol(val: VotingTemplatesSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: VotingTemplatesSortDirections | null) {
    this.sortDirection = val;
  }
  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();
  @Output() itemUpdatedHandler = new EventEmitter();
  @Output() itemDeletedHandler = new EventEmitter();

  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');

  updateVotingTemplatePermission = this.getPermission(Permissions.Committees.Settings.Voting.update);
  deleteVotingTemplatePermission = this.getPermission(Permissions.Committees.Settings.Voting.delete);

  getPermission(permission) {
    return !!this.permissionsService.getPermission(permission);
  }
  constructor(
    private translate: TranslateService,
    private modelService: ModelService,
    private permissionsService: NgxPermissionsService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // sort voting templates items by column
  sort(col: VotingTemplatesSortBy) {

    if (this.sortedCol === col) {
      if (this.sortDirection === VotingTemplatesSortDirections.Asc) {
        this.sortDirection = VotingTemplatesSortDirections.Desc;
      } else {
        this.sortDirection = VotingTemplatesSortDirections.Asc;
      }
    } else {
      this.sortDirection = VotingTemplatesSortDirections.Asc
    }

    this.sortedCol = col;
    this.sortFilter.emit({
      sortDirection: this.sortDirection,
      sortKey: this.sortedCol,
    });
  }

  public get ascMode(): boolean {
    return this.sortDirection === VotingTemplatesSortDirections.Asc;
  }

  public get descMode(): boolean {
    return this.sortDirection === VotingTemplatesSortDirections.Desc;
  }

  // get actions options
  getItems(item): any[] {
    const options = [];
    this.editLabel = this.translate.instant('shared.edit');
    this.deleteLabel = this.translate.instant('shared.delete');

    // check if user has the permission for this actions
    this.updateVotingTemplatePermission && options.push({
      item: this.editLabel,
      icon: 'bx bx-edit',
    });
    this.deleteVotingTemplatePermission && options.push({
      item: this.deleteLabel,
      icon: 'bx bx-trash',
    });

    return options;
  }

  // on select action option
  onOptionSelect(e, item) {
    if (e === this.editLabel) {
      this.openEditPopup(item);

    } else if (e === this.deleteLabel) {
      this.itemDeletedHandler.emit(item);
    }
  }

  // open edit voting template modal
  openEditPopup(voting) {
    voting.edit = true;
    this.modelService.open('edit-voting' + voting.id);
  }

  // update voting template
  updateVotingTemplate(event) {
    const index = this.list.findIndex(voting => voting.id == event.id);
    this.list[index] = event;
    this.itemUpdatedHandler.emit(event);
  }

  onCloseChanged(event) {
    this.itemUpdatedHandler.emit(event);
  }
}
