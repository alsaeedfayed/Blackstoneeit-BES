import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
  ViewChild,
  ElementRef, AfterViewInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {finalize, skip, take} from 'rxjs/operators';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {DashboardService} from '../../services/dashboard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {DetailsListComponent} from '../details-list/details-list.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NgxCaptureService} from 'ngx-capture';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent
  extends ComponentBase
  implements OnInit, AfterContentChecked, AfterViewInit {
  @ViewChild('details_list') detailsListComponent: DetailsListComponent;
  @ViewChild('exported_data') exportedData: ElementRef<HTMLElement>;
  @ViewChild('page_filters') pageFilters: ElementRef<HTMLElement>;

  isFilterDisplayed;
  searchModel: any = {
    keyword: '',
    sortBy: '',
    page: 1,
    pageSize: 1000,
  };

  data = {
    managerId: null,
    categoryId: null,
    originId: null,
    types: null,
    sectorId: null,
    departmentId: null,
    priorityLevel: null,
    fromDate: null,
    toDate: null,
    fromBudget: null,
    toBudget: null,
    year: new Date().getFullYear(),
  };

  isLoading: boolean;
  isExporting: boolean;
  sectorsItems: any;
  departmentsItems: any;
  areasItems: any;
  projectsData;
  filterLength = 0
  isFilterModelOpened: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService,
    private cdref: ChangeDetectorRef,
    private captureService: NgxCaptureService
  ) {
    super(translateService, translate);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((data) => {
      this.data.managerId = data.managerId;
      this.data.categoryId = data.categoryId;
      this.data.originId = data.originId;
      this.data.types =
        data.types && data.types != 'undefined'
          ? Array.isArray(data.types)
            ? data.types
            : [data.types]
          : null;
      this.data.sectorId = data.sectorId;
      this.data.departmentId = data.departmentId;
      this.data.priorityLevel = data.priorityLevel;
      this.data.fromDate = data.fromDate;
      this.data.toDate = data.toDate;
      this.data.fromBudget = data.fromBudget;
      this.data.toBudget = data.toBudget;
      this.data.year = data.year;
      this.getProjectsStatistics();
      this.handelFilter();
      this.filterLength = this.countKeysExcept(this.data ,  ['sectorId', 'departmentId'])
      console.log(this.filterLength)

    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  countKeysExcept(obj, excludedKeys, condition = (value) => value !== null && value !== undefined) {
    let count = 0;

    for (const [key, value] of Object.entries(obj)) {
      if (!excludedKeys.includes(key) && condition(value)) {
        count++;
      }
    }

    return count;
  }

  getQueryParams() {
    return {
      managerId: this.data.managerId,
      categoryId: this.data.categoryId,
      originId: this.data.originId,
      types: this.data.types,
      sectorId: this.data.sectorId,
      departmentId: this.data.departmentId,
      priorityLevel: this.data.priorityLevel,
      fromDate: this.data.fromDate,
      toDate: this.data.toDate,
      fromBudget: this.data.fromBudget,
      toBudget: this.data.toBudget,
      year: this.data.year,
    };
  }

  handelFilter() {
    this.dashboardService.advancedFilterData.pipe(skip(1)).subscribe((data) => {
      this.data = {
        managerId: data.managerId,
        categoryId: data.categoryId,
        originId: data.originId,
        types: data.types,
        sectorId: this.data.sectorId,
        departmentId: this.data.departmentId,
        year: this.data.year,
        priorityLevel: data.priorityLevel,
        fromDate: data.fromDate,
        toDate: data.toDate,
        fromBudget: data.fromBudget,
        toBudget: data.toBudget,
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
      // this.getProjectsStatistics();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.data.sectorId = id;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
      // this.getProjectsStatistics();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.data.departmentId = id;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
      // this.getProjectsStatistics();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.data.year = year;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
      // this.getProjectsStatistics();
    });
  }

  openFilterModel() {
    this.isFilterModelOpened = true;
    this.popupService.open('dashboard-filter');
  }

  closeFilterModel() {
    this.isFilterModelOpened = false;
    this.popupService.close();
  }

  getProjectsStatistics() {
    this.isLoading = true;
    this.dashboardService
      .getProjectsStatistics(this.data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (!this.projectsData) {
          this.projectsData = res;
        }
      });
  }

  // load all details data
  loadAllDetails() {
    this.isExporting = true;
    this.pageFilters.nativeElement.setAttribute('hidden', '');

    this.detailsListComponent.getDetails(true);
  }

  // export page
  exportPage() {

    // image solution
    const downloadImageFromBase64 = (base64Data, fileName) => {
      const link = document.createElement('a');

      link.href = base64Data;
      link.download = fileName;

      link.click();
    };

    html2canvas(this.exportedData.nativeElement, {scale: 2}).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      downloadImageFromBase64(imgData, 'EPPM-Dashboard');

      this.pageFilters.nativeElement.removeAttribute('hidden');
      this.isExporting = false;
    });

    // pdf solution 1
    // html2canvas(this.exportedData.nativeElement,{scale: 5}).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'mm', 'a4');
    //   const width = pdf.internal.pageSize.getWidth();
    //   const height = pdf.internal.pageSize.getHeight();

    //   pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    //   pdf.save('EPPM-Dashboard.pdf');

    //   this.pageFilters.nativeElement.removeAttribute('hidden');
    //   this.isExporting = false;
    // });

    // pdf solution 2
    // this.captureService
    //   .getImage(this.exportedData.nativeElement, true)
    //   .pipe(
    //     take(1),
    //     finalize(() => (this.isExporting = false))
    //   )
    //   .subscribe((image) => {

    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const width = pdf.internal.pageSize.getWidth();
    //     const height = pdf.internal.pageSize.getHeight();

    //     pdf.addImage(image, 'PNG', 0, 0, width, height);
    //     pdf.save('EPPM-Dashboard.pdf');

    //     this.pageFilters.nativeElement.removeAttribute('hidden');
    //   });
  }
}
