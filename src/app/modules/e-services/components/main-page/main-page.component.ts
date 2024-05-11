import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Config } from 'src/app/core/config/api.config';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';
import { Permissions } from 'src/app/core/services/permissions';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  isLoading: boolean = false;
  services: any = [];
  servicesFilter: any = [];
  totalItems: number = 0;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 10,
  };

  query = {
    pageIndex: 1,
    pageSize: 1000,
    sortDirection: null,
    sortKey: null,
    searchKey: '',
  };

  language = this.translate.currentLang;
  isExporting: boolean = false;
  isShowCreateButton: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.create
  );

  constructor(
    private httpHandlerService: HttpHandlerService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getServicesData();
  }


  handleSortFilter(filter: any) {
    this.query.sortKey = filter.sortKey ;
    this.query.sortDirection = filter.sortDirection;
    this.getServicesData();
  }

  getServicesData() {
    this.isLoading = true;

    this.httpHandlerService
      .get(Config.EService.getAllEService, this.query)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.services = res.data;
        this.servicesFilter = res.data;
        this.totalItems = res.count;
      });
  }

  handleSearchValueFilter(searchValue: string): any {
    this.query.searchKey = searchValue;
    this.getServicesData();
  }

  openCreateEService() {
    this.router.navigate(['e-services/requests/create-e-service']);
  }



  exportDataAsExcel() {
    if (this.isLoading) return;
    this.isExporting = true;

    let url = `${environment.serverUrl}${Config.EService.exportEServices}`;

    if (this.query.sortDirection === null) {
      delete this.query.sortDirection;
    }

    if (this.query.sortKey === null) {
      delete this.query.sortKey;
    }

    fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.userService.getAccessTokenId(),
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
        'License-Key': licenceKey.valid,
      },
      method: 'POST',
      body: JSON.stringify(this.query),
    })
      .then((resp) => resp.blob())
      .then((blob) => {
        this.isExporting = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = `Customer Services ${this.getCurrentDateTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format

    const formattedDateTime = `${year}/${month}/${day}  ${hours}:${minutes} ${amOrPm}`;
    return formattedDateTime;
  }
}
