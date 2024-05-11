import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CheckboxSelectionCallbackParams,
  ColDef, FirstDataRenderedEvent, GridApi,
  GridOptions,
  HeaderCheckboxSelectionCallbackParams, IRowNode, IsRowSelectable, ITextFilterParams, RowHeightParams, SideBarDef
} from 'ag-grid-community'; // Column Definitions Interface
import 'ag-grid-community/styles/ag-theme-alpine.min.css';
import {
  GridReadyEvent,
  IDateFilterParams,
  INumberFilterParams,
  ISetFilter,
} from 'ag-grid-community';
import {TasksPerQuarter} from "../../modules/bau/dashboard/models/bau-dashboard";
import {LoadingComponent} from "./loading/loading.component";
import {TranslateService} from "@ngx-translate/core";

export interface TableData {
  rows: any[] | any,
  columns: ColDef[],
  options: GridOptions | any,
  defaultColDef?: ColDef | any
}

@Component({
  selector: 'app-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss']
})
export class AgTableComponent implements OnInit {
  language: string = this.translate.currentLang;
  @Input() data: TableData
  @Input() context: any
  @Input() search: boolean = false
  isRowSelectable: any
  rtl = false
  public loadingOverlayComponent: any = LoadingComponent;
  public loadingOverlayComponentParams: any = {
    loadingMessage: 'One moment please...',
  };
  private gridApi!: GridApi;
  rowData: any;
  public defaultColDef: ColDef;
  @Output() paginate = new EventEmitter();
  @Output() onSelectionChange = new EventEmitter();
  @Output() globalSearch = new EventEmitter();
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        toolPanelParams: {
          suppressExpandAll: true,
          suppressFilterSearch: true,
        },
      },
    ],
    defaultToolPanel: 'filters',
  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[];

  themeClass =
    "ag-theme-balham";
  gridOptions: GridOptions;

  constructor(private translate: TranslateService, private cdRef: ChangeDetectorRef) {
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
    });

  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  OnPaginateChange(event) {
    this.paginate.emit(event.api)
  }

  onFilterTextBoxChanged(event) {
    this.globalSearch.emit(event)
  }

  onselectChanged(event) {
    //use event.api.getSelectedRows() to get row values
    this.onSelectionChange.emit(event)
  }

  onFirstDataRendered(params: FirstDataRenderedEvent<any>) {
    const nodesToSelect: IRowNode[] = [];
    params.api.forEachNode((node: IRowNode, index) => {
      if (node.data.successful == true) {
        nodesToSelect.push(node);
      }
    });
    params.api.setNodesSelected({nodes: nodesToSelect, newValue: true});

  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.rowData = this.data.rows
    this.colDefs = this.data.columns
    this.gridOptions = this.data.options;
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
      this.rtl = this.language == 'ar';
      window.location.reload()
    });
    this.defaultColDef = this.data.defaultColDef ? this.data.defaultColDef : {}
    this.rowData.forEach(function (dataItem: any, index: number) {
      dataItem.rowHeight = 80;
    });

  }

  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params.data.rowHeight;
  }

}
