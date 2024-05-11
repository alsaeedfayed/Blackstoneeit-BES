// cell renderer component
import {Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ag-user-widget',
  template: `<span
          class="hoverableLink"
          (click)="invokeParentMethod()"
  >
              <ng-container *ngIf="usersGroups?.length == 1">
                {{ language == 'ar' ? usersGroups[0]['arabicName'] : usersGroups[0]['name'] }}
              </ng-container>
              <ng-container>
                {{ usersGroups?.length }} {{ 'users.groups' | translate }}
              </ng-container>
            </span>`
})
export class AgGroupLinkComponent implements OnInit, ICellRendererAngularComp {
  constructor(private translate: TranslateService,) {
  }

  params!: ICellRendererParams;
  usersGroups: any;
  language: string = this.translate.currentLang;

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.usersGroups = this.params.data.usersGroups
  }

  ngOnInit() {
  }

  public invokeParentMethod() {
    this.params?.context?.componentParent.onViewGroupsAndRoles(
      this.params.data
    );
  }

  refresh(ICellRendererParams) {
    // Let AG Grid take care of refreshing by recreating our cell renderer.
    return false;
  }
}
