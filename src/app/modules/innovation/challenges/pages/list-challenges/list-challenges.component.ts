import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ComponentBase} from "src/app/core/helpers/component-base.directive";
import {HttpHandlerService} from "src/app/core/services/http-handler.service";
import {TranslateConfigService} from "src/app/core/services/translate-config.service";
import {Config} from "../../../../../core/config/api.config";
import {finalize} from "rxjs/operators";
import {Analytics} from "../../models/analytics";
import {PaginationInstance} from "ngx-pagination";
import {HttpParams} from "@angular/common/http";
import {TableData} from "../../../../../shared/ag-grid-table/ag-table.component";
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ITextFilterParams
} from "ag-grid-community";

@Component({
  selector: 'app-list-challenges',
  templateUrl: './list-challenges.component.html',
  styleUrls: ['./list-challenges.component.scss']
})
export class ListChallengesComponent extends ComponentBase implements OnInit {
  checkboxSelection: any;
  headerCheckboxSelection: any;
  data: TableData
  analytics: Analytics = {resolvedChallenges: 0, newChallenges: 0, totalChallenges: 0, totalIdeas: 0};
  language: string = this.translate.currentLang;
  emptyFilter = false;
  filterData = {}
  challenges: any[];
  queryParams = new HttpParams()
  usersList: any = []
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };
  loading: boolean = true;
  paginationModel: any = {
    pageIndex: 1,
  };

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
  ) {
    super(translateService, translate);
    this.checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
      // we put checkbox on the name if we are not doing grouping
      return 0;
    };
    var headerCheckboxSelection = function (
      params: HeaderCheckboxSelectionCallbackParams
    ) {
      // we put checkbox on the name if we are not doing grouping
      return 0;
    };
    this.data =  {
      options: {
        rowCount: 10,
        alwaysMultiSort: true,
        pagination: true,
        paginationPageSize: 10,
        embedFullWidthRows: true,
        paginationAutoPageSize: true,
        rowSelection: 'multiple',
        rowDeselection: true,
        suppressRowClickSelection: true,
        checkboxSelection: true,
        rowMultiSelectWithClick:true
      },
      columns: [
        {field: "mission", filter: true, floatingFilter: true, checkboxSelection: true , headerCheckboxSelection: true},
        {field: "company", filter: true, floatingFilter: true},
        {field: "location"},
        {field: "date"},
        {field: "price"},
        {field: "successful"},
        {field: "rocket"},
        {field: "rocket"}
      ],
      rows: [
        {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: false
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: false
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        }, {
          mission: "Voyager",
          company: "NASA",
          location: "Cape Canaveral",
          date: "1977-09-05",
          rocket: "Titan-Centaur ",
          price: 86580000,
          successful: true
        },
        {
          mission: "Apollo 13",
          company: "NASA",
          location: "Kennedy Space Center",
          date: "1970-04-11",
          rocket: "Saturn V",
          price: 3750000,
          successful: false
        },
        {
          mission: "Falcon 9",
          company: "SpaceX",
          location: "Cape Canaveral",
          date: "2015-12-22",
          rocket: "Falcon 9",
          price: 9750000,
          successful: true
        }
      ]
    }
  }

  ngOnInit(): void {
    this.getAllChallenges()
    this.getAllAnalytics()
  }
  navigateToAdd() {
    this.router.navigate(['innovation/challenges/add'])
  }

  paginateChallenges(e) {
    this.paginationModel.pageIndex = e
    this.config.currentPage = e
    this.getAllChallenges();
  }

  getAllChallenges() {
    console.log(this.queryParams)
    this.loading = true
    this.httpSer
      .post(`${Config.Innovation.challenge.list}`, {PageIndex: this.paginationModel.pageIndex, ...this.filterData})
      .pipe(
        finalize(() => {
          this.loading = false
        })
      )
      .subscribe(res => {
        if (res) {
          this.challenges = res.data;
          this.config.totalItems = res.count
          console.log(this.challenges)
        }
      });
  }

  getAllAnalytics() {
    this.httpSer
      .get(`${Config.Innovation.challenge.analytics}`)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res) {
          this.analytics = res
        }
      });
  }


  filter() {
    this.loading = true
    this.getAllChallenges()
  }

  search(text) {
    this.loading = true
    if (text.trim !== '') {
      this.filterData['Keyword'] = text
      this.getAllChallenges()
    }
  }

  setFilterValues(e) {
    console.log(e)
    this.filterData = e;
  }

  clearFilter() {
    this.emptyFilter = true;
    setTimeout(e => {
      this.getAllChallenges()
    }, 1000)

  }

}
