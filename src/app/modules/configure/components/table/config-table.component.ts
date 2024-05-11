import { HttpHandlerService } from '../../../../core/services/http-handler.service';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Configuration } from 'src/app/core/models/Configuration';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { SharedDateServiceService } from '../shared-date-service.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'config-table',
  templateUrl: './config-table.component.html',
  styleUrls: ['./config-table.component.scss'],
})

export class ConfigTableComponent implements OnInit {

  filteredConfigures: Configuration[] = [];
  @Input() configure: Configuration[] = [];
  @Input() paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() pagination: EventEmitter<any> = new EventEmitter();
  selectedConfigure: any;
  language: string = this.translate.currentLang;
  loading: boolean = false;
  isActive: boolean = true;
  id;
  isOpenModal: boolean = false;
  isShown: boolean = false;
  openConfirmMsg: string;
  periodIndex: number;

  searchKey: string = "";
  totalItems: any;
  isShowForm: boolean = false;

  editLabel = this.translate.instant('shared.edit');
  openLable = this.translate.instant('shared.openPeriod');

  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.openLable,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-key',
    }
  ];

  constructor(
    private httpHandlerService: HttpHandlerService,
    private modalService: ModelService,
    private toastr: ToastrService,
    private translate: TranslateService) {
    this.modalService.closeModel$.subscribe(res => {
      this.isOpenModal = false
    })
  }

  ngOnInit(): void {
    this.getConfigurationData();
    // this.configure=JSON.parse(localStorage.getItem('config'));
    // console.log(this.configure )
    // this.configure=JSON.parse(localStorage.getItem('configData'));
    // console.log(this.configure,"tems")
    // this.Data.Date=JSON.parse(localStorage.getItem('configData'))
    this.handleLangChange();
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.getConfigurationData();
      this.editLabel = this.translate.instant('shared.edit');
      this.openLable = this.translate.instant('shared.openPeriod');
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.openLable,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-key',
        }
      ];
    });
  }

  handleSearchValueFilter(keyword: string): void {
    this.searchKey = keyword;
    this.paginationModle.pageIndex = 1;
    this.filteredConfigures = this.configure.filter(
      (item) =>
        item.month
          .toLocaleLowerCase()
          .includes(keyword.toLocaleLowerCase()) ||
        item.monthAr
          .toLocaleLowerCase()
          .includes(keyword.toLocaleLowerCase())
    );
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;
  }


  ngAfterViewChecked() {
    //your code to update the model
    // this.cdr.detectChanges();

  }

  httpOptions(GetAll: string, httpOptions: any) {
    throw new Error('Method not implemented.');
  }

  getConfigurationData() {
    this.loading = true;

    const query = {
      ...this.paginationModle,
    };

    this.httpHandlerService
      .get(Config.Configuration.GetAll)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.configure = res;
        this.filteredConfigures = res;
        //localStorage.setItem('config ',JSON.stringify(res));
      });
  }

  openPopup(configure) {
    this.isOpenModal = true;
    this.selectedConfigure = { ...configure };
    this.modalService.open('edit-config' + configure.id);
  }

  closePopup() {
    this.isOpenModal = false;
    this.selectedConfigure = null;
    this.modalService.close();
  }

  update(event) {
    let index = this.configure.findIndex(
      (configure) => configure.id == event.id
    );
    this.configure[index] = event;
  }

  calculateEndDate(item: any) {
    let currentYear = new Date().getFullYear();
    let startDate = new Date(currentYear, item.number - 1, item.startDay);

    let result = new Date(currentYear, item.number - 1, (startDate.getDate() + parseInt(item.duration)));
    return result;
  }

  onOptionSelect(e, configure) {
    if (e === this.editLabel) {
      this.openPopup(configure);
    }
    if (e === this.openLable) {
      this.openPeriodPopup(configure);
    }
  }

  openPeriodPopup(configure: any) {
    // this.popupService.open('new-scorecard' + scorecard.id,scorecard);
    this.periodIndex = configure.number;
    this.openConfirmMsg = `${this.translate.instant(
      'configuration.openPeriodMsg'
    )}`;

    this.modalService.open('open-period');
  }

  public openPeriod() {
    let path = Config.Performance.OpenPeriod.replace("{index}", this.periodIndex.toString());
    this.modalService.close();
    this.httpHandlerService
      .put(path)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('configuration.openPeriodSucessMessage'));
          this.reset();
        }
      });
  }

  private reset() {
    this.periodIndex = 0;
    // this.onChangeHandler.emit();
  }
}
