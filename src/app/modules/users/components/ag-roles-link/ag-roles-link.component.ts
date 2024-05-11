// cell renderer component
import {Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ag-roles-link',
  template: `
      <td class="user-roles">
            <span
                    *ngIf="item?.usersRoles?.length"
                    class="hoverableLink"
                    (click)="invokeParentMethod()"
            >
              <ng-container *ngIf="item?.usersRoles?.length == 1">
                {{ language == 'ar' ? item?.usersRoles[0]['arabicName'] : item?.usersRoles[0]['name'] }}
              </ng-container>
              <ng-container *ngIf="item?.usersRoles?.length > 1">
                {{ item?.usersRoles?.length }} {{ 'users.roles' | translate }}
              </ng-container>
            </span>
          <span class="rectangle-badge badge-muted" *ngIf="!item?.usersRoles?.length">
              {{ 'shared.N/A' | translate }}
            </span>
      </td>`
})
export class AgRolesLinkComponent implements OnInit, ICellRendererAngularComp {
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
    this.params.context.componentParent.onViewGroupsAndRoles(
      this.params.data
    );
  }

  refresh(ICellRendererParams) {
    // Let AG Grid take care of refreshing by recreating our cell renderer.
    return false;
  }
}
