import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from './layout-routing.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  @ViewChild('sidebar') SidebarComponent: SidebarComponent;
  isSidebarCollapsed = true;

  path = window.location.pathname;
  displaySidebar: boolean;

  constructor(
    public layoutService: Layout,
    activatedRoute: ActivatedRoute,
    router: Router
  ) {
    router.events.subscribe((val) => {
      this.displaySidebar = activatedRoute.snapshot.firstChild.data.displaySidebar;
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.SidebarComponent && (this.isSidebarCollapsed = this.SidebarComponent.isCollapsed);
  }

  onSidebarCollapse(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
