import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { followUpSortBy, followUpSortDirections } from '../../Enums/enums';
import { FollowUpResponseMode, FollowupStatusMode } from './enums';

@Component({
  selector: 'followup-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class FollowUpTableComponent implements OnInit {
  @ViewChild('dropdown') dropdown: ElementRef;

  list = [];
  @Input() set List(list) {
    this.list = list;
    
    this.list.forEach(item => {
      if(item) {
        item.options = [
          {
            item: this.viewDetailsLabel,
            icon: 'bx bx-show',
            },
            {
              item: this.cloneLabel,
              icon: 'bx bxs-copy-alt',
            }
        ]
        if (item?.canEdit) {
          item?.options.push({
            item: this.editLabel,
            icon: 'bx bx-edit',
          })
        }
        if (item?.canTransfer) {
          item?.options.push({
            item: this.transferLabel,
            icon: 'bx bx-transfer',
          })
        }
        // if(item?.typeCode != "InternalType"){
          // options.push(
          //   {
          //   item: this.cloneLabel,
          //   icon: 'bx bxs-copy-alt',
          // })
        // }
        if(item?.canUpdateProgress){
          item?.options.push({
            item: this.updateLabel,
            icon: 'bx bx-edit',
          })
        }
        if (item?.canClose) {
          item?.options.push({
            item: this.closeLabel,
            icon: 'bx bx-block',
          })
        }
        if (item?.canReopen) {
          item?.options.push({
            item: this.reOpenLabel,
            icon: 'bx bx-revision',
          })
        }
      }
    })
  }
  @Input() types = [];
  @Input() totalCount: number = 0;
  selectedItemId: any;
  @Input() public set SortedCol(val: followUpSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: followUpSortDirections | null) {
    this.sortDirection = val;
  }
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  @Output() itemUpdatedHandler = new EventEmitter();
  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();
  lang: string = this.translate.currentLang;
  followUpStatusMode = FollowupStatusMode;
  followUpResponseMode = FollowUpResponseMode;
  public sortedCol: followUpSortBy | null = null;
  public sortDirection: followUpSortDirections = followUpSortDirections.asc;
  isOpened: boolean = false;

  viewDetailsLabel = 'followUp.viewDetails';
  editLabel = 'shared.edit';
  cloneLabel = 'shared.clone';
  transferLabel = 'shared.transfer';
  updateLabel = 'followUp.updateProgress';
  closeLabel = 'followUp.closeTask';
  reOpenLabel = 'followUp.reopenTask';

  progressFormat = (percent: number): string => `${percent}%`;

  isUpdateProgressClicked: boolean = false;
  isCloneClicked: boolean = false;
  isTransferClicked: boolean = false;
  isCloseClicked: boolean = false;
  isReOpenClicked: boolean = false;
  isEditClicked: boolean = false;
  isViewDetailsClicked: boolean = false;

  constructor(private modelService: ModelService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.hadlePopupReset();
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  // getItems(item) {
  //   const options = []
  //   if (item?.canEdit) {
  //     options.push({
  //       item: this.editLabel,
  //       icon: 'bx bx-edit',
  //     })
  //   }
  //   if (item?.canTransfer) {
  //     options.push({
  //       item: this.transferLabel,
  //       icon: 'bx bx-transfer',
  //     })
  //   }
  //   // if(item?.typeCode != "InternalType"){
  //     // options.push(
  //     //   {
  //     //   item: this.cloneLabel,
  //     //   icon: 'bx bxs-copy-alt',
  //     // })
  //   // }
  //   if(item?.canUpdateProgress){
  //     options.push({
  //       item: this.updateLabel,
  //       icon: 'bx bx-edit',
  //     })
  //   }
  //   if (item?.canClose) {
  //     options.push({
  //       item: this.closeLabel,
  //       icon: 'bx bx-block',
  //     })
  //   }
  //   if (item?.canReopen) {
  //     options.push({
  //       item: this.reOpenLabel,
  //       icon: 'bx bx-revision',
  //     })
  //   }
  //   return options;
  // }

  private hadlePopupReset() {
    this.modelService.closeModel$.subscribe(() => {
      this.isUpdateProgressClicked = false;
      this.isCloneClicked = false;
      this.isTransferClicked = false;
      this.isCloseClicked = false;
      this.isReOpenClicked = false;
      this.isEditClicked = false;
      this.isViewDetailsClicked = false;
      this.list.forEach((item) => {
        item.show = false;
        item.editShow = false;
      })
    })
  }

  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  sort(col: followUpSortBy) {
    if (this.sortedCol === col) {
      if (this.sortDirection === followUpSortDirections.asc) this.sortDirection = followUpSortDirections.desc
      else this.sortDirection = followUpSortDirections.asc
    } else {
      this.sortDirection = followUpSortDirections.asc
    }
    this.sortedCol = col;
    this.sortFilter.emit({ SortDirection: this.sortDirection, SortBy: this.sortedCol });
  }

  onOptionSelect(e, item) {
    this.selectedItemId = item.id;
    setTimeout(() => {
      if (e === this.viewDetailsLabel) {
        this.openUpdatePopup(item.id);
        item.show = true;
        this.isViewDetailsClicked = true;
      }
      if (e === this.cloneLabel) {
        this.openClonePopup(item);
        item.show = true;
        this.isCloneClicked = true;
      }
      if (e === this.transferLabel) {
        this.openTransferPopup(item);
        item.show = true;
        this.isTransferClicked = true;
      }
      if (e === this.updateLabel) {
        this.openUpdateProgressPopup(item);
        item.show = true;
        this.isUpdateProgressClicked = true;
      }
      if (e === this.closeLabel) {
        this.openClosePopup(item);
        item.show = true;
        this.isCloseClicked = true;
      }
      if (e === this.reOpenLabel) {
        this.openReOpenPopup(item);
        item.show = true;
        this.isReOpenClicked = true;
      }
      if (e === this.editLabel) {
        this.openEditPopup(item.id);
        item.editShow = true;
        this.isEditClicked = true;
      }
    }, 100);

  }

  openUpdatePopup(id) {
    this.modelService.open('update-follow-item' + id);
  }

  closeUpdatePopup(item) {
    item.show = false;
    this.isViewDetailsClicked = false;
    this.modelService.close();
  }

  openClosePopup(item){
    item.isCloseTask = true;
    item.isReopenTask = false;
    item.isUpdateProgress = false;
    this.modelService.open('actions-follow-item' + item.id);
  }

  openReOpenPopup(item) {
    item.isReopenTask = true;
    item.isCloseTask = false;
    item.isUpdateProgress = false;
    this.modelService.open('actions-follow-item' + item.id);
  }

  openUpdateProgressPopup(item) {
    item.isUpdateProgress = true;
    item.isCloseTask = false;
    item.isReopenTask = false;
    this.modelService.open('actions-follow-item' + item.id);
  }

  closeActionsPopup(item) {
    item.isUpdateProgress = false;
    this.isUpdateProgressClicked = false;

    item.isCloseTask = false;
    this.isCloseClicked = false;

    item.isReopenTask = false;
    this.isReOpenClicked = false;

    this.modelService.close();
  }

  openEditPopup(id) {
    this.modelService.open('follow-up-item' + id);
  }

  openClonePopup(item) {
    item.editShow = true;
    item.cloned = true;
    this.modelService.open('follow-up-item' + item.id);
  }

  closeEditClonePopup(item) {
    item.editShow = false;
    this.isEditClicked = false;

    item.cloned = false;
    this.isCloneClicked = false;

    this.modelService.close();
  }

  openTransferPopup(item){
    item.show = true;
    this.modelService.open('follow-up-item-transfer' + item.id);
  }

  closeTransferPopup(item) {
    item.show = false;
    this.isTransferClicked = false;
    this.modelService.close();
  }

  itemTransferHandler(){
    this.itemUpdatedHandler.emit();
  }

  public get ascMode(): boolean {
    return this.sortDirection === followUpSortDirections.asc
  }

  public get DescMode(): boolean {
    return this.sortDirection === followUpSortDirections.desc
  }
}
