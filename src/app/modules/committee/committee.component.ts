import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { HttpHandlerService } from './../../core/services/http-handler.service';
import { Committee } from './../../core/models/committee';
import { RequestsCreateService } from '../project-initiation/components/requests-create/services/requests.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.scss']
})

export class CommitteeComponent extends ComponentBase implements OnInit {

  isShowForm : boolean = false;
  loading: boolean = true;
  allowAdd: boolean = false;
  committeeToAddType: string = "Committee";
  lang: string;
  list: Committee[] = [];
  language: string = this.translate.currentLang;
  totalCount: number = 0;
  isShowCreateButton: boolean = true
  
  search: string = '';

  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  constructor(translateService: TranslateConfigService, translate: TranslateService, private modelService: ModelService,
    private httpHandlerService: HttpHandlerService, private requestsService: RequestsCreateService, private fb : FormBuilder, private toastr: ToastrService) {
    super(translateService, translate)
  }
  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.getAllCommittes();
    
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      //this.getAllCommittes();
    });
  }

  refreshData(resetPagination: boolean = false) {
    if (resetPagination) {
      this.paginationModel.pageIndex = 1;
    }
    this.getAllCommittes();
  }

  handlePaginationchange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;
    this.getAllCommittes();
  }

  // open create committee model
  openPopup() {
    this.isShowForm = true;
    this.modelService.open('committee-item-add');
  }

  // close create committee model
  closeCommitteeModel() {
    this.isShowForm = false;
    this.modelService.close();
  }

  handleSearchValueFilter(search: string) {
    this.search = search;
    this.getAllCommittes();
  }

  private getAllCommittes() {
    this.loading = true;
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      searchKey: this.search
    };

    this.httpHandlerService
      .get(Config.Committees.GetAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.list = res.data;
          this.totalCount = res.count;
        }
      });
  }

  submitted(){
    this.refreshData();
  }
}
