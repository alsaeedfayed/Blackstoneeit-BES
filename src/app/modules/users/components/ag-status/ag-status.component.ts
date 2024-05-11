// cell renderer component
import {Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ag-roles-link',
  template: `
      <div class="user-status">
          <app-switch
                  [disabled]="true"
                  [(ngModel)]="item.active"
                  (click)="invokeParentMethod()"
          ></app-switch>
      </div>`
})
export class AgStatusComponent implements OnInit, ICellRendererAngularComp {
  constructor(private translate: TranslateService,) {
  }

  params!: ICellRendererParams;
  item: any;
  language: string = this.translate.currentLang;

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.item = this.params.data
  }

  ngOnInit() {
  }

  public invokeParentMethod() {
    this.params.context.componentParent.confirmToggleActiveState(
      this.params.data
    );
  }

  refresh(ICellRendererParams) {
    // Let AG Grid take care of refreshing by recreating our cell renderer.
    return false;
  }
}
