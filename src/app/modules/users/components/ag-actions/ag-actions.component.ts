// cell renderer component
import {Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ag-roles-link',
  template: `
      <div class="user-actions">
          <app-dropdown
                  [items]="cardActions"
                  (select)="invokeParentMethod($event, item)"
          ></app-dropdown>
      </div>`
})
export class AgActionsComponent implements OnInit, ICellRendererAngularComp {
  constructor(private translate: TranslateService,) {
  }
  updateLabel = this.translate.instant('shared.update');
  setRolesLabel = this.translate.instant('users.setRoles');
  cardActions: any = [
    {
      item: this.updateLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-edit'
    },
    {
      item: this.setRolesLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-check-shield'
    },
  ];
  params!: ICellRendererParams;
  item: any;
  language: string = this.translate.currentLang;

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.item = this.params.data
  }

  ngOnInit() {
  }

  public invokeParentMethod(e , user) {
    this.params.context.componentParent.onOptionClick(
      e , user
    );
  }

  refresh(ICellRendererParams) {
    // Let AG Grid take care of refreshing by recreating our cell renderer.
    return false;
  }
}
