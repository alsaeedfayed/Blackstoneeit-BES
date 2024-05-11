import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProcessService } from '../../processes-service/process.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-main',
  templateUrl: './process-main.component.html',
  styleUrls: ['./process-main.component.scss']
})
export class ProcessMainComponent extends ComponentBase implements OnInit {
  processes;
  pageSize: number = 6
  page: number = 1
  totalProcesses;
  paginatedProcessesTotal;
  hasNext;
  loading;
  isPaginationLoading;
  languageState: string;
  sidepanelTitle;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private processesService: ProcessService,
    private router: Router,
    private toastr: ToastrService
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
    this.getProcesses('', '', this.page, this.pageSize)
  }

  getProcesses(keyword, sortBy, page, pageSize, fetchAction?) {
    if (fetchAction == 'fetchMore') {
      this.isPaginationLoading = true
    }
    this.processesService.getProcesses({ keyword, sortBy, page, pageSize })
      .subscribe(res => {
        this.loading = true;
        if (fetchAction == 'fetchMore') {
          this.processes = [...this.processes, ...res.data]
          this.isPaginationLoading = false
        } else {
          this.processes = res.data
        }
        this.totalProcesses = res.total
        this.calculatePaginatedItems()
      }, err => {
        this.isPaginationLoading = false
        this.toastr.error(err.message)
      });
  }

  calculatePaginatedItems() {
    return this.totalProcesses - this.processes.length
  }

  goToAddProcess() {
    this.router.navigateByUrl(`/process/new`);
  }

  refreshList() {
    this.getProcesses('', '', this.page, this.pageSize)
  }

  seeMore() {
    this.getProcesses('', '', ++this.page, this.pageSize, 'fetchMore')
  }

  search(e) {
      this.getProcesses(e.trim(), '', 1, this.pageSize)
  }

}
