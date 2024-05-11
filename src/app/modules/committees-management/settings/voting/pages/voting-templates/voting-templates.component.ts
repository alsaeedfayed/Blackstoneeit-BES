import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { VotingTemplatesSortBy, VotingTemplatesSortDirections } from 'src/app/modules/committees-management/enums/enums';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IVotingTemplate } from 'src/app/modules/committees-management/settings/voting/models/votingTemplate/IVotingTemplate';
import { Permissions } from 'src/app/core/services/permissions';

@Component({
  selector: 'app-voting-templates',
  templateUrl: './voting-templates.component.html',
  styleUrls: ['./voting-templates.component.scss']
})
export class VotingTemplatesComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

  // filtration properties
  searchValue: string = '';
  filterData: any = {};

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // all items list
  list: [] = [];

  // create permission
  createVotingTemplatePermission =  Permissions.Committees.Settings.Voting.create;

  public votingIdToDelete: number;
  public confirmMsg: string;

  public sortedCol: VotingTemplatesSortBy | null = null;
  public sortDirection: VotingTemplatesSortDirections = VotingTemplatesSortDirections.Asc;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private confirmationPopupService: ConfirmModalService,
    private toastSer: ToastrService,
    private modelService: ModelService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch all voting templates
    this.getAllVotingTemplates();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // get search String from search input
  onSearch(searchString: string) {
    let searchFlag: boolean = false;

    if (searchString.trim() != '') {
      this.filterData = {
        ...this.filterData,
        "searchKey": searchString
      }
      searchFlag = true;
    } else {
      delete this.filterData.searchKey;
      searchFlag = true;
    }

    if (searchFlag) {
      this.paginationModel.pageIndex = 1;
      this.getAllVotingTemplates();
      searchFlag = false;
    }
  }

  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.sortKey;
      this.sortDirection = filter.sortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter
    };

    // fetch all voting templates
    this.getAllVotingTemplates();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all voting templates
    this.getAllVotingTemplates();
  }

  // refresh beacons data and optionally reset search/pagination
  refreshData(resetSearch: boolean = false, resetPagination: boolean = false) {
    if (resetSearch) {
      this.searchValue = '';
    }

    if (resetPagination) {
      this.paginationModel.pageIndex = 1;
    }

    // fetch all voting templates
    this.getAllVotingTemplates();
  }

  // fetch all voting templates
  private getAllVotingTemplates() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch voting templates
    this.httpSer
      .get(Config.VotingTemplate.Get, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res?.data;
        }
      });
  }

  // go to add voting template page
  goToAddVotingTemplate() {
    this.modelService.open('add-voting');
  }

  // delete voting template
  public deleteVotingTemplate(voting: IVotingTemplate) {
    this.votingIdToDelete = voting.id;
    this.confirmMsg = `${this.translate.instant('committeeVotingTemplates.deleteVoting')} ${this.translate.currentLang == 'ar' ? `(${voting.nameAr}) ؟` : `(${voting.name}) ?`}`;
    this.confirmationPopupService.open('delete-voting');
  }
  onCloseChanged(event) {
    this.modelService.close();
    this.getAllVotingTemplates();
  }

  // confirm on delete voting template
  public onDeleteVotingTemplateConfirmed() {
    this.confirmationPopupService.close('delete-voting');
    this.httpSer
      .delete(`${Config.VotingTemplate.Delete}/${this.votingIdToDelete}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.toastSer.success(this.translate.instant('committeeVotingTemplates.deleteSuccessMsg'));
          this.getAllVotingTemplates();
        }
      });
  }
}
