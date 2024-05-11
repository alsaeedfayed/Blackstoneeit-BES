import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'discussed-items-tab',
  templateUrl: './discussed-items-tab.component.html',
  styleUrls: ['./discussed-items-tab.component.scss']
})
export class DiscussedItemsTabComponent implements OnInit {

  @Input() meetingId: number;
  @Input() attendees: any[] = [];
  @Input() isUpdating: boolean = true;
  @Output() count = new EventEmitter<number>();
  list = [];
  // discussed item model properties
  discussedItem: any;
  isDiscussedItemModelOpened = false;

  constructor(
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
  ) { }

  ngOnInit(): void {
    this.getMeetingDiscussionItems();
  }

  // open create/edit discussed item model
  openCreateDiscussedItemModel(item?: any) {
    this.discussedItem = item;
    this.isDiscussedItemModelOpened = true;
    this.modelService.open('create-discussed-item');
  }

  // close create/edit discussed item model
  closeCreateDiscussedItemModel() {
    this.discussedItem = null;
    this.isDiscussedItemModelOpened = false;
    this.modelService.close();
  }

  // get Meeting DiscussionItems
  getMeetingDiscussionItems() {
    this.httpSer.get(`${Config.DiscussionItem.GetMeeting}/${this.meetingId}`)
      .pipe(finalize(() => { }))
      .subscribe((res) => {
        if (res) {
          this.list = res.data;
          this.count.emit(res.count);
          this.list = this.list.map(obj => ({ ...obj, ...{ showMore: false } }));
        }
      })
  }

}
