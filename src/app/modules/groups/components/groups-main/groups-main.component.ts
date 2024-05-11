import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { GroupsService } from '../../services/groups.service';
import { Level } from './enums';

@Component({
  selector: 'app-groups-main',
  templateUrl: './groups-main.component.html',
  styleUrls: ['./groups-main.component.scss'],
})
export class GroupsMainComponent
  extends ComponentBase
  implements OnInit, OnDestroy
{
  lang: string = this.translate.currentLang;
  query: string;
  groups: any = [];
  loading: boolean;
  groupsTotal: number = 0;

  keyword: string = null;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30
  };

  isGroupModelOpened: boolean = false;
  groupModelTitle: string;

  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');

  private subscriptions = new Subscription();
  groupToDelete: any;

  levels: any = [
    {
      value: Level.L0,
      label: 'L0',
      labelAr: 'L0',
    },
    {
      value: Level.L1,
      label: 'L1',
      labelAr: 'L1',
    },
    {
      value: Level.L2,
      label: 'L2',
      labelAr: 'L2',
    },
    {
      value: Level.L3,
      label: 'L3',
      labelAr: 'L3',
    },
  ];

  tree;
  isListView: boolean = true;

  constructor(
    private popupService: PopupService,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,
    private groupsService: GroupsService,
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
    this.handleLangChange();
    this.getAllGroups();
    this.getGroups();
    this.groupsService.onSelectOption.pipe(skip(1)).subscribe((data) => {
      if (data?.e && data?.group) {
        const selectedGroup = this.groups.find((g) => g.id == data.group.id);
        this.onOptionSelect(data.e, selectedGroup);
      }
    });
  }

  refreshPage() {
    this.getAllGroups();
    this.getGroups();
  }

  onSearch(keyword: string) {
    this.keyword = keyword.toLowerCase();
    this.paginationModel.pageIndex = 1;

    this.getAllGroups();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.editLabel = this.translate.instant('shared.edit');
      this.deleteLabel = this.translate.instant('shared.delete');
      if (this.groups.length) {
        this.groups.map((group) => {
          group.options = [
            {
              item: this.editLabel,
              disabled: false,
              textColor: '',
              icon: 'bx bxs-edit',
            },
            {
              item: this.deleteLabel,
              disabled: group.hasChildren,
              textColor: '',
              icon: 'bx bx-trash',
            },
          ];
        });
      }
    });
  }

  changeViewMode(mode){
    this.isListView = mode === 'list' ? true : false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPaginate(e) {
    this.paginationModel.pageIndex = e;

    this.getAllGroups();
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  getAllGroups() {
    this.loading = true;

    const query = {
      ...this.paginationModel,
      keyword: this.keyword,
    };

    this.subscriptions.add(
      this.groupsService.getAllGroups(query).subscribe((res) => {
        this.loading = false;

        this.groupsTotal = res?.count;
        this.groups = res?.data;

        this.groups.map((group) => {
          group.Level = this.levels.find((level) => group.level === level.value);
          group.options = [
            {
              item: this.editLabel,
              disabled: false,
              textColor: '',
              icon: 'bx bxs-edit',
            },
            {
              item: this.deleteLabel,
              disabled: group.hasChildren,
              textColor: '',
              icon: 'bx bx-trash',
            },
          ];
        });
      })
    );
  }

  onCreateGroup() {
    this.isGroupModelOpened = true;
    this.popupService.open('groups');
    this.groupModelTitle = this.translate.instant('groups.createGroup');
    this.groupsService.savePopupConfig({
      title: this.translate.instant('groups.createGroup'),
    });
  }

  onOptionSelect(e, group) {
    if (e === this.editLabel) {
      this.isGroupModelOpened = true;
      this.popupService.open('groups');
      this.groupModelTitle = this.translate.instant('groups.editGroup');
      this.groupsService.savePopupConfig({
        title: this.translate.instant('groups.editGroup'),
      });
      this.groupsService.saveSelectedGroup(group);
    }

    if (e === this.deleteLabel) {
      this.groupToDelete = group;
      this.confirmationPopupService.open();
    }
  }

  // close create/edit group model
  closeGroupModel() {
    this.isGroupModelOpened = false;
    this.popupService.close();
    this.groupsService.saveSelectedGroup(null);
  }

  onDeleteGroupConfirmed() {
    this.groupsService.onDeleteGroup(this.groupToDelete?.id).subscribe(
      (res) => {
        this.ngOnInit();
        this.toastr.success(
          this.translate.instant('groups.groupWasSuccessfullyDeleted')
        );
        this.groupToDelete = null;
      },
      (err) => {
        this.toastr.error(err.message);
      }
    );
  }

  getGroups() {
    this.tree = null;
    this.loading = true;
    this.subscriptions.add(
      this.groupsService.getGroups().subscribe((res) => {
        this.loading = false;
        const groups = res;
        this.tree = [...groups];
        // this.tree = [
        //   {
        //     name: 'Groups',
        //     arabicName: 'مجموعات',
        //     children: [...groups],
        //   },
        // ];
      })
    );
  }

  getItems(node) {
    const options = [
      {
        item: this.editLabel,
        disabled: false,
        textColor: '',
        icon: 'bx bxs-edit',
      },
      {
        item: this.deleteLabel,
        disabled: node.children?.length,
        textColor: '',
        icon: 'bx bx-trash',
      },
    ];
    return options;
  }
}
