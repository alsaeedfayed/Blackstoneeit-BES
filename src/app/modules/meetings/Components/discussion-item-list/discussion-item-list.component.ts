import { EventEmitter, OnChanges, OnDestroy, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { componentModes } from '../../Enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IAttendee, IDiscussionItem } from '../../Pages/meeting-details/iMeetingDetails.interface';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { Config } from 'src/app/core/config/api.config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BadgeCountService } from '../../Pages/meeting-form/badge-count.service';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { emit } from 'process';

@Component({
  selector: 'discussion-item-list',
  templateUrl: './discussion-item-list.component.html',
  styleUrls: ['./discussion-item-list.component.scss']
})

export class DiscussionItemListComponent implements OnDestroy, OnChanges {
  private endsub$ = new Subject()
  public isShowForm: boolean = false;
  public componentMode: componentModes;
  public items: Array<IDiscussionItem> = new Array<IDiscussionItem>();
  ItemIdToDelete: string;
  confirmMsg: string;
  editedItem: IDiscussionItem;
  attendeesList: IAttendee[];

  // INPUTS & OUTPUTS
  @Input() public set Items(items: Array<IDiscussionItem>) {
    this.items = items;
  }
  @Input() public set ComponentMode(mode: componentModes) {
    this.componentMode = mode;
  }
  @Input() createdMeetingId: string;
  @Input() canAdd:boolean = false;
  @Input() public set attendees(attendees: IAttendee[]) {
    this.attendeesList = attendees;
  }
  @Output() refresh: EventEmitter<IDiscussionItem> = new EventEmitter();
  editLabel = this.translateService.instant('shared.edit');
  deleteLabel = this.translateService.instant('shared.delete');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];

  constructor(private modalService: ModelService, private translateService: TranslateService, private confirmationPopupService: ConfirmModalService, private httpService: HttpHandlerService, private toastSer: ToastrService, private badgeCountService: BadgeCountService, private attachmentSrv: AtachmentService) {
    this.checkReset()
    this.handleLangChange()
  }

  ngOnChanges(){
    // console.log("ngOnChanges",this.attendees,this.attendeesList);
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.editLabel = this.translateService.instant('shared.edit');
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
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

  public opendiscussionItemsModal() {
    this.editedItem = null;
    this.isShowForm = true;
    this.modalService.open('add-discussion-items');
  }

  closeDiscussionItemsModal() {
    this.editedItem = null;
    this.isShowForm = false;
    this.modalService.close();
  }

  public onActionDropDownSelect(action: any) { }

  public addDiscussionItem(item: IDiscussionItem) {
    //this.refresh.emit();
    this.badgeCountService.changeDiscussionItemsCount(this.badgeCountService.discussionItemsCount + 1)
    this.items.push(item);
  }

  public openEditPopup(item: IDiscussionItem) {
    this.isShowForm = true;
    this.editedItem = item;
    this.modalService.open('add-discussion-items');
  }

  public editedItemHandler(item: IDiscussionItem) {
    this.refresh.emit();
    // let itemIndex = this.items.findIndex((actionItem) => actionItem.id === item.id);
    // this.items[itemIndex] = {
    //   ...this.items[itemIndex],
    //   ...item
    // }
  }

  public deleteItem(item: IDiscussionItem) {
    this.ItemIdToDelete = item.id;
    this.confirmMsg = `${this.translateService.instant("Meetings.deleteItemMsg")} "${item.title}"?`
    this.confirmationPopupService.open('confirm-discussion-delete')
  }

  public onDeleteItemConfirmed() {
    this.confirmationPopupService.close('confirm-discussion-delete')
    this.httpService.delete(`${Config.meetings.discussionItems.delete}/${this.ItemIdToDelete}`).pipe(takeUntil(this.endsub$)).subscribe((res) => {
      if (res) {
        this.toastSer.success(this.translateService.instant("Meetings.itemDeletedMsg"));
        this.badgeCountService.changeDiscussionItemsCount(this.badgeCountService.discussionItemsCount - 1)
        this.items = this.items.filter((item) => item.id !== this.ItemIdToDelete);
      }
    })
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

  getFileURL(fileName: string) {
    this.attachmentSrv.getAttachmentURLs(fileName).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          window.open(res[0].fileUrl)
        }
      },
      error: (err) => {
        this.toastSer.error(this.translateService.instant("shared.somethingWentWrong"));
      }
    })
  }

  // Unsubscribe
  ngOnDestroy(): void {
    this.endsub$.next(null);
    this.endsub$.complete()
  }

  onOptionSelect(e, item) {
    if (e === this.editLabel) {
      this.openEditPopup(item);
    } else if (e === this.deleteLabel) {
      this.deleteItem(item);
    }
  }
}
