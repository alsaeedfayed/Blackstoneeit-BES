import { OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { componentModes } from '../../Enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IActionItem } from '../../Pages/meeting-details/iMeetingDetails.interface';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { Config } from 'src/app/core/config/api.config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BadgeCountService } from '../../Pages/meeting-form/badge-count.service';
import { FollowUpResponseMode, FollowupStatusMode } from 'src/app/modules/follow-up/components/table/enums';

@Component({
  selector: 'action-item-list',
  templateUrl: './action-item-list.component.html',
  styleUrls: ['./action-item-list.component.scss']
})

export class ActionItemListComponent implements OnDestroy {
  private endsub$ = new Subject();
  private ItemIdToDelete: string;
  public isShowForm: boolean = false;
  public componentMode: componentModes;
  public items: Array<IActionItem> = new Array<IActionItem>();
  public taskTypes: Array<any> = new Array<any>();
  public confirmMsg: string;
  public editedItem: IActionItem;
  followUpStatusMode = FollowupStatusMode;
  followUpResponseMode = FollowUpResponseMode;
  progressFormat = (percent: number): string => `${percent}%`;

  // INPUTS & OUTPUTS
  @Input() public set Items(items: Array<IActionItem>) {
    this.items = items;
  }

  @Input() actionItemsCompletionRate = 0;

  @Input() public set TaskTypes(types: Array<any>) {
    this.taskTypes = types;
  }
  @Input() public set ComponentMode(mode: componentModes) {
    this.componentMode = mode;
  }
  @Input() createdMeetingId: string;
  @Input() canAdd: boolean = false;

  viewDetailsLabel = this.translateService.instant('shared.viewDetails');
  editLabel = this.translateService.instant('shared.edit');
  cloneLabel = this.translateService.instant('shared.clone');
  deleteLabel = this.translateService.instant('shared.delete');
  options = [
    {
      item: this.viewDetailsLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-show',
    },
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.cloneLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-copy-alt',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];

  actionOptions = [
    {
      item: this.viewDetailsLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-show',
    }
  ];

  constructor(
    private modalService: ModelService,
    private translateService: TranslateService,
    private confirmationPopupService: ConfirmModalService,
    private httpService: HttpHandlerService,
    private toastSer: ToastrService,
    private badgeCountService: BadgeCountService,
  ) {
    this.handleLangChange()
    this.checkReset()
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.editLabel = this.translateService.instant('shared.edit');
      this.cloneLabel = this.translateService.instant('shared.clone');
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.cloneLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-copy-alt',
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash',
        },
      ];
    });
  }

  private checkReset() {
    this.modalService.closeModel$.pipe(takeUntil(this.endsub$)).subscribe(res => {
      this.isShowForm = false
    })
  }

  openAddItemsModal() {
    this.editedItem = null;
    this.isShowForm = true;
    this.modalService.open('add-action-items');
  }

  closeItemModal() {
    this.editedItem = null;
    this.isShowForm = false;
    this.modalService.close();
  }

  public addActionItem(item: IActionItem) {
    this.badgeCountService.changeActionItemsCount(this.badgeCountService.actionItemsCount + 1)
    this.items.push(item);
  }

  public openEditPopup(item: IActionItem) {
    this.isShowForm = true;
    this.editedItem = item;
   // debugger
    this.modalService.open('add-action-items');
  }

  public viewItem(item: IActionItem) {
    this.isShowForm = true;
    this.editedItem = item;
    this.modalService.open('update-item-progress');
  }

  public deleteItem(item: IActionItem) {
    this.ItemIdToDelete = item.id;
    this.confirmMsg = `${this.translateService.instant("Meetings.deleteItemMsg")} "${item.action}"?`
    this.confirmationPopupService.open('confirm-action-delete')
  }

  public onDeleteItemConfirmed() {
    this.confirmationPopupService.close('confirm-action-delete')
    this.httpService.delete(`${Config.meetings.actionItems.delete}/${this.ItemIdToDelete}`).pipe(takeUntil(this.endsub$)).subscribe((res) => {
      if (res) {
        this.toastSer.success(this.translateService.instant("Meetings.itemDeletedMsg"));
        this.badgeCountService.changeActionItemsCount(this.badgeCountService.actionItemsCount - 1)
        this.items = this.items.filter((item) => item.id !== this.ItemIdToDelete);
      }
    })
  }

  public editedItemHandler(item: IActionItem) {
    let itemIndex = this.items.findIndex((actionItem) => actionItem.id === item.id);
    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...item
    }
  }

  // Getters & Setters
  public get isAddMode(): boolean {
    return this.componentMode === componentModes.addMode;
  }
  public get isEditMode(): boolean {
    return this.componentMode === componentModes.editMode;
  }
  public get isViewMode(): boolean {
    return this.componentMode === componentModes.viewMode;
  }

  public getTaskType(typeCode:string){
    let selectedType = this.taskTypes.find((type) => type.code === typeCode);
    if(selectedType){
      return this.translateService.currentLang === "en" ? selectedType.nameEn : selectedType.nameAr
    }
    return  null;
  }

  // Unsbscribe
  ngOnDestroy(): void {
    this.endsub$.next(null);
    this.endsub$.complete();
  }

  onOptionSelect(e, item: IActionItem) {
    if (e === this.editLabel) {
      this.openEditPopup(item);
    } else if (e === this.cloneLabel) {
      item.isCloneClicked = true;
      this.openEditPopup(item);
    } else if (e === this.deleteLabel) {
      this.deleteItem(item);
    } else if (e === this.viewDetailsLabel) {
      this.viewItem(item);
    }
  }
}
