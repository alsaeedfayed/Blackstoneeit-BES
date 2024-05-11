// cell renderer component
import {Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'ag-user-widget',
  template: `
    <person-item
      *ngIf="params.data"
      [requesterItem]="this.params.data"
      [noCursor]="true"
    ></person-item>`
})
export class AgUserWidgetComponent implements OnInit, ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.params.data
  }

  ngOnInit() {
  }

  refresh(ICellRendererParams) {
    // Let AG Grid take care of refreshing by recreating our cell renderer.
    return false;
  }
}
