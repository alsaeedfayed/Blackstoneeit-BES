import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, Event, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { SidebarService } from './sidebar-service/sidebar.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { toggle } from 'slide-element';
import { CollapseService } from './sidebar-service/collapse.service';

declare let $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  private endSub$ = new Subject();

  lang: string;

  @Output() collapsed = new EventEmitter<boolean>();
  public isCollapsed = true;
  categories;
  selectedCategory;
  filteredMenuItems;
  sidebarPreference: string;
  displaySettings: any;

  // menu counts
  sidebarCounts: any;
  requestsCount = 0;
  followupsCount = 0;
  projectsCount = 0;
  approvedProjectsCount = 0;
  closureRequestsCount = 0;
  changeRequestsCount = 0;
  minutesOfMeetingsCount = 0;
  agentQueueCount = 0;
  scoreCardsCount = 0;
  performanceChangeRequestsCount = 0;

  // close sidebar menu in case clicked outside it
  @HostListener('document:click', ['$event']) onclick(evt: any) {
    if (!this.eRef.nativeElement.contains(evt.target)) {
      this.closeSidebarMenu();
    }
  }

  constructor(
    private userSer: UserService,
    private router: Router,
    private sidebarSer: SidebarService,
    private translateSer: TranslateService,
    private titleSer: Title,
    private httpSer: HttpHandlerService,
    private eRef: ElementRef,
    private collapseService: CollapseService
  ) {

    // scroll active link into view
    this.scrollActiveLinkIntoView();
    this.closeSidebarMenu();
  }

  ngOnInit() {

    // handles language change event
    this.handleLangChange();

    // this.jqueryHandlers();

    this.categories = this.sidebarSer.buildMenu();
    this.displaySettings = this.userSer.isUserAllowedTo('ManageSettings');

    // initialize the sidebar menu
    this.initSidebarMenu();

    // get sidebar menu counts
    this.getCounts();
  }

  // handles language change event
  handleLangChange() {
    this.lang = this.translateSer.currentLang;

    this.translateSer.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translateSer.currentLang;

        // initialize the sidebar menu
        this.initSidebarMenu();
      });
  }

  // scroll active link into view
  scrollActiveLinkIntoView() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const activeCategory = document.querySelector('.sideMenu__categories__item.active');
          activeCategory && activeCategory.scrollIntoView();

          const activeLink = document.querySelector('.sideMenu__menus__link.active');
          activeLink && activeLink.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  }

  getCounts(){
    const RequestsCount = this.httpSer.get(Config.requests.GetCount);
    const ProjectsCount = this.httpSer.get(Config.Projects.GetCount);
    const FollowUpCount = this.httpSer.get(Config.FollowUp.GetCount);
    const ApprovedProjectsCount = this.httpSer.get(Config.Projects.GetApprovedCount);
    const ClosureRequestsCount = this.httpSer.get(Config.Projects.GetClosureRequestsCount);
    const ChangeRequestsCount = this.httpSer.get(Config.Projects.GetChangeRequestsCount);
    const AgentQueueCount = this.httpSer.get(Config.AgentQueue.GetCount); 
    const ScoreCardsCount = this.httpSer.get(Config.scorecard.GetCount); 
    const PerformanceChangeRequestsCount = this.httpSer.get(Config.chnageRequest.GetCount); 
    const MinutesOfMeetingsCount = this.httpSer.get(Config.meetings.GetCount); 
    
    forkJoin({ RequestsCount, ProjectsCount, FollowUpCount, ApprovedProjectsCount, ClosureRequestsCount, ChangeRequestsCount ,
      AgentQueueCount, ScoreCardsCount, PerformanceChangeRequestsCount, MinutesOfMeetingsCount
    })
      .pipe()
      .subscribe((res: any) => {
        this.projectsCount = res.ProjectsCount.count;
        this.requestsCount = res.RequestsCount;
        this.followupsCount = res.FollowUpCount;
        this.approvedProjectsCount = res.ApprovedProjectsCount.count;
        this.closureRequestsCount = res.ClosureRequestsCount.count;
        this.changeRequestsCount = res.ChangeRequestsCount.count;
        this.agentQueueCount = res.AgentQueueCount;
        this.scoreCardsCount = res.ScoreCardsCount;
        this.performanceChangeRequestsCount = res.PerformanceChangeRequestsCount;
        this.minutesOfMeetingsCount = res.MinutesOfMeetingsCount;

        this.sidebarCounts = {
          "Followup" : this.followupsCount,
          "My Requests" : this.requestsCount,
          "Requests" : this.projectsCount,
          "Projects" : this.approvedProjectsCount,
          "Closure Requests" : this.closureRequestsCount,
          "change requests" : this.changeRequestsCount,
          "Agent Queue" : this.agentQueueCount,
          "Scorecards": this.scoreCardsCount,
          "Change Requests": this.performanceChangeRequestsCount,
          "Minutes of Meetings" : this.minutesOfMeetingsCount
        }
      });
  }

  // initialize the sidebar menu
  initSidebarMenu() {
    const menus = this.sidebarSer.menuItems.reduce((acc, category) => acc.concat(category.children), []);
    const submenus = menus.reduce((acc, category) => acc.concat(category.children), []);
    const menuItems = [...menus, ...submenus].reverse();
    const currentItem = menuItems.find((item) =>
      item.routerLink && window.location.pathname.includes(item.routerLink)
    );
    const currentCategory = this.sidebarSer.menuItems.find((category) =>
      category.children.some((item) => item?.id === currentItem?.id)
    );

    // set browser title
    this.setBrowserTitle(currentItem);

    // select current category and open its menus
    this.selectCategory(currentCategory);
  }

  // set browser title
  setBrowserTitle(menuItem) {
    menuItem?.routerLink && this.titleSer.setTitle(menuItem?.name[this.lang]);
  }

  // select a category and open its menus
  selectCategory(category) {
    this.selectedCategory = this.filteredMenuItems = category;
  }

  trackByFn(item: any): number {
    return item.id;
  }

  // search for menu items
  searchMenuItems(text: string) {
    const searchValue = text.trim();
    const filterItems = (category, searchValue) => {
      if (searchValue === '') { return category; }

      const filteredCategory = { ...category };
      const filteredChildren = filteredCategory.children?.reduce((acc, child) => {
        const childName = child.name?.[this.lang]?.toLowerCase();
        const nestedMatches = filterItems(child, searchValue);

        if (childName && childName.includes(searchValue.toLowerCase())) {
          acc.push(child);
        } else if (nestedMatches.children?.length > 0) {
          acc.push({ ...child, children: nestedMatches.children });
        }

        return acc;
      }, []);

      filteredCategory.children = filteredChildren;
      return filteredCategory;
    };

    this.filteredMenuItems = filterItems(this.selectedCategory, searchValue);
  }

  // open sidebar menu
  openSidebarMenu() {
    this.isCollapsed = false;
    this.collapsed.emit(this.isCollapsed);
    this.collapseService.setCollapseValue(this.isCollapsed)
  }

  // close sidebar menu
  closeSidebarMenu() {
    this.isCollapsed = true;
    this.collapsed.emit(this.isCollapsed);
    this.collapseService.setCollapseValue(this.isCollapsed)
  }

  // toggle sidebar menu
  toggleSidebarMenu() {
    this.isCollapsed ? this.openSidebarMenu() : this.closeSidebarMenu();
  }

  // toggle sidebar submenu
  toggleSidebarSubMenu(e) {
    const menuItem = e.target.closest('.sideMenu__menus__item');
    const subMenu = menuItem.querySelector('.sideMenu__subMenuWrapper');

    if (subMenu) {
      menuItem.classList.toggle('is-open');

      toggle(subMenu);
    }
  }

  // --------------------------------------------------------
  // old code, not used anymore
  // --------------------------------------------------------
  jqueryHandlers() {
    // Burger Menu JS
    $('.burger-menu').on('click', function () {
      $(this).toggleClass('active');
      $('.main-content').toggleClass('hide-sidemenu-area');
      $('.sidemenu-area').toggleClass('toggle-sidemenu-area');
      $('.top-navbar').toggleClass('toggle-navbar-area');
      localStorage.setItem(
        'sidebarPreference',
        JSON.stringify($('.sidemenu-area').hasClass('toggle-sidemenu-area'))
      );
    });
    $('.responsive-burger-menu').on('click', function () {
      $('.responsive-burger-menu').toggleClass('active');
      $('.sidemenu-area').toggleClass('active-sidemenu-area');
    });
  }
}
