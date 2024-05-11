import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { Committee } from 'src/app/core/models/committee';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'committee-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class CommitteeTableComponent implements OnInit {
  @ViewChild('dropdown') dropdown: ElementRef;

  @Input() list: Committee[] = [];
  @Input() totalCount: number = 0;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  @Output() onChangeHandler = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();
  isShowForm:boolean = false;
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  lang: string = this.translate.currentLang;

  isOpened: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  showActivate: boolean = false;
  showDectivate: boolean = false;
  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');
  activateLabel = this.translate.instant('committee.activate');
  deactivateLabel = this.translate.instant('committee.deactivate');

  activateConfirmMsg: string;
  deactivateConfirmMsg: string;
  deleteConfirmMsg: string;

  id: number;

  constructor(
    private modelService: ModelService,
    private http: HttpHandlerService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.handleLangChange();

    this.hadlePopupReset();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.editLabel = this.translate.instant('shared.edit');
      this.deleteLabel = this.translate.instant('shared.delete');
      this.activateLabel = this.translate.instant('committee.activate');
      this.deactivateLabel = this.translate.instant('committee.deactivate');
    });
  }

  private hadlePopupReset() {
    this.modelService.closeModel$.subscribe(() => {
      this.list.forEach((item) => {
        // item.show = false;
        // item.editShow = false;
      })
    })
  }

  private reset() {
    this.id = 0;
    this.onChangeHandler.emit();
  }

  onOptionSelect(e, item: Committee) {
    if (e === this.editLabel) {
      this.id = item.id;
      this.openEditPopup(item.id);
      this.showEdit = true;
    }
    else if (e === this.deleteLabel) {
      this.openDeletePopup(item);
    }
    else if (e === this.activateLabel) {
      this.openActivatePopup(item);
      this.showActivate = true;
    }
    else if (e === this.deactivateLabel) {
      this.openDeactivatePopup(item);
    }
  }

  openUpdatePopup(id) {
    this.modelService.open('update-follow-item' + id);
  }

  public openDeactivatePopup(committee: Committee) {
    this.id = committee.id;
    this.deactivateConfirmMsg = `${this.translate.instant(
      'committee.deactivateMsg'
    )}`;
    this.modelService.open('deactivate-committee');
  }

  public openActivatePopup(committee: Committee) {
    this.id = committee.id;
    this.activateConfirmMsg = `${this.translate.instant(
      'committee.activateMsg'
    )}`;
    this.modelService.open('activate-committee');
  }

  public openDeletePopup(committee: Committee) {
    this.id = committee.id;
    this.deleteConfirmMsg = `${this.translate.instant(
      'committee.deleteMsg'
    )}`;
    this.modelService.open('delete-committee');
  }

  public activate() {
    let path = Config.Committees.Activate.replace("{id}", this.id.toString()).replace("{status}", "false");
    this.modelService.close();
    this.http
      .put(path)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committee.activateSuccessMsg'));
          this.reset();
        }
      });
  }

  public deactivate() {
    let path = Config.Committees.Activate.replace("{id}", this.id.toString()).replace("{status}", "true");
    this.modelService.close();
    this.http
      .put(path)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committee.deactivateSuccessMsg'));
          this.reset();
        }
      });
  }

  public delete() {
    let path = Config.Committees.Delete.replace("{id}", this.id.toString());
    this.modelService.close();
    this.http
      .delete(path)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committee.deleteSuccessMsg'));
          this.reset();
        }
      });
  }

  // open update committee model
  openEditPopup(id) {
    this.id = id;
    this.isShowForm = true;
    this.modelService.open('committee-item');
  }

  // close update committee model
  closeCommitteeModel() {
    this.id = 0;
    this.isShowForm = false;
    this.modelService.close();
  }

  getItems(item: Committee): any[] {
    const options = [];
    options.push({
      item: this.editLabel,
      icon: 'bx bx-edit',
    })
    options.push({
      item: this.deleteLabel,
      icon: 'bx bx-trash-alt',
    })
    if (item.isInactive) {
      options.push({
        item: this.activateLabel,
        icon: 'bx bx-user-plus',
      })
    }
    else {
      options.push({
        item: this.deactivateLabel,
        icon: 'bx bx-user-x',
      })
    }

    return options;
  }

  submitted() {
    this.onChangeHandler.emit();
  }
}
