import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'app-projects-cost',
  templateUrl: './projects-cost.component.html',
  styleUrls: ['./projects-cost.component.scss']
})
export class ProjectsCostComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isPmo
  @Input() isPm
  @Input() lang: string
  isFilterDisplayed: boolean
  lineChart: any;
  @ViewChild('myChart') myChart: any
  canvas: any;
  ctx: any;
  @Input() projectData
  costStats: any;
  invoicesList: any
  searchModel = {
    keyword: null,
    sortBy: null,
    page: 1,
    pageSize: 6
  }
  filterModel = {
    "milestonId": null,
    "isPaid": null
  }
  invoicesTotal: any;
  updateLabel: string = this.translateService.instant('shared.update');
  deleteLabel: string = this.translateService.instant('shared.delete');
  invoiceOptions: any = [
    {
      item: this.updateLabel
    },
    {
      item: this.deleteLabel
    },
  ]
  sortItems: any = [
    {
      name: 'Newest',
      nameAr: 'الأحدث',
      isDefault: true
    },
    {
      name: 'Oldest',
      nameAr: 'الأقدم',
      isDefault: false
    },
    {
      name: 'Last updated',
      nameAr: 'آخر تحديث',
      isDefault: false
    },
  ]
  invoiceStatusList = [
    {
      name: "Paid",
      nameAr: "مدفوع",
      code: "paid",
      isDefault: false
    },
    {
      name: "Unpaid",
      nameAr: "غير مدفوع",
      code: "unpaid",
      isDefault: false
    },
  ];

  chartData: any = {
    labels: null,
    datasets: null,
  };

  constructor(private projectsService: ProjectsService,
    private translateService: TranslateService,
    private attachmentService: AtachmentService,
    private confirmationPopupService: ConfirmModalService,
    private popupService: PopupService) {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.projectData) {
      this.getCostStats(this.projectData?.id)
      this.getInvoicesList(this.searchModel, this.searchModel, this.projectData?.id)
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.myChart.nativeElement
    this.ctx = this.canvas.getContext('2d')
    this.lineChart = new Chart(this.ctx, {
      data: this.chartData,
      type: 'line',
      options: {
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          y: {
            min: 0,
          },
          x: {
            type: 'time',
            time: {
              parser: 'MMM/YYYY',
              unit: 'month',
            }
          }
        }
      },
    });
  }

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.invoiceOptions = [
        {
          item: this.updateLabel,
          icon: 'bx bxs-edit'
        },
        {
          item: this.deleteLabel,
          icon: 'bx bx-trash'

        },
      ]
    });
  }

  getCostStats(id) {
    this.projectsService.saveLoadingModalState(true)
    this.projectsService.getCostStats(id).subscribe(res => {
      this.costStats = res
      this.initializeChart(res.cashBalance)
    })
  }



  initializeChart(data) {
    this.lineChart.data.datasets.length = 0;
    //call update method
    this.lineChart.update();
    let totalActualAmount = 0
    let totalPlannedAmount = 0
    let actual = data.actual.sort(function (a, b) { return a.date - b.date }).map((item, index) => {
      totalActualAmount = totalActualAmount + item.amount
      return { x: moment(item.date).format("MMM/YY"), y: totalActualAmount }
    });
    let planned = data.planned.sort(function (a, b) { return a.date - b.date }).map((item) => {
      totalPlannedAmount = totalPlannedAmount + item.amount
      return { x: moment(item.date).format("MMM/YY"), y: totalPlannedAmount }
    })

    this.chartData.datasets = [
      {
        label: 'Planned',
        data: planned,
        backgroundColor: '#0062FF',
        borderColor: 'lightblue',
        fill: false,
        lineTension: 0,
        radius: 5,
      },
      {
        label: 'Actual',
        data: actual,
        backgroundColor: '#00DB99',
        borderColor: 'lightgreen',
        fill: false,
        lineTension: 0,
        radius: 5,
      },
    ]
    this.lineChart.update();

  }

  getInvoicesList(searchModel, filterModel, id) {
    this.projectsService.getInvoices(searchModel, filterModel, id).subscribe(res => {
      this.invoicesList = res.data
      this.invoicesTotal = res.total
      this.projectsService.saveLoadingModalState(false)
    })
  }

  onCreateInvoice() {
    this.popupService.open("project")
    this.projectsService.savepopupConfig({
      mode: "invoice",
      title: { en: "Create Invoice", ar: "إنشاء فاتورة" },
      invoices: this.invoicesList
    })
  }

  onSearch(keyword: string) {
    this.searchModel.keyword = keyword.toLowerCase();
    this.searchModel.page = 1;

    this.getInvoicesList(this.searchModel, this.filterModel, this.projectData?.id);
  }

  onPaginate(e) {
    this.searchModel.page = e
    this.getInvoicesList(this.searchModel, this.filterModel, this.projectData?.id)
  }

  onOptionSelect(e, selectedInvoice) {
    if (e === this.deleteLabel) {
      this.confirmationPopupService.open()
      this.projectsService.saveConfirmationPopupConfig({
        text: this.translateService.instant('projects.deleteInvoiceMsg'),
        btnText: this.deleteLabel,
        mode: "invoice",
        invoiceToUpdate: selectedInvoice
      })
    }
    if (e === this.updateLabel) {
      this.popupService.open("project")
      this.projectsService.savepopupConfig({
        mode: "invoice",
        title: { en: "Update Invoice", ar: "تعديل فاتورة" },
        invoices: this.invoicesList,
        invoiceToUpdate: selectedInvoice
      })
    }
  }


  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

  onSort(e) {
    this.searchModel.page = 1;
    this.searchModel.sortBy = e?.name;
    this.invoicesList = []
    this.invoicesTotal = 0
    this.getInvoicesList(this.searchModel, this.filterModel, this.projectData?.id)
  }

  onStatusSelect(e) {
    this.searchModel.page = 1;
    this.filterModel.isPaid = e?.name && (e?.name === 'Paid' ? true : false);
    this.invoicesList = []
    this.invoicesTotal = 0
    this.getInvoicesList(this.searchModel, this.filterModel, this.projectData?.id)
  }
}
