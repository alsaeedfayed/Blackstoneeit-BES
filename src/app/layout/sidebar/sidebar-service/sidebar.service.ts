import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Permissions } from "src/app/core/services/permissions";
import { UserService } from "src/app/core/services/user.service";
import { ISidebarMenu } from "../interfaces/iSidebarMenu";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  menuItems: ISidebarMenu[];
  constructor(private userSer: UserService, private router: Router) { }

  buildMenu() {
    this.menuItems = [
      {
        id: 1,
        index: 1,
        name: {
          en: "Performance",
          ar: "الأداء",
        },
        icon: "bx bx-bar-chart",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 11,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "لوحة الأداء",
            },
            icon: "bx bx-line-chart",
            routerLink: "/performance-dashboard",
            claims: [Permissions.Performance.Dashboard.View],
            visible: true,
            hasCounter: false,
            children: [
              // {
              //   id: 111,
              //   index: 1,
              //   name: {
              //     en: "Link item 1",
              //     ar: "رابط اختبار 1",
              //   },
              //   routerLink: "/test1",
              //   claims: ['ManageAll'],
              //   visible: true,
              // },
              // {
              //   id: 112,
              //   index: 2,
              //   name: {
              //     en: "Link item 2",
              //     ar: "رابط اختبار 2",
              //   },
              //   routerLink: "/test2",
              //   claims: ['ManageAll'],
              //   visible: true,
              // },
              // {
              //   id: 113,
              //   index: 3,
              //   name: {
              //     en: "Link item 3",
              //     ar: "رابط اختبار 3",
              //   },
              //   routerLink: "/test3",
              //   claims: ['ManageAll'],
              //   visible: true,
              // },
            ],
          },
          {
            id: 12,
            index: 2,
            name: {
              en: "Scorecards",
              ar: "قائمة المؤشرات",
            },
            icon: "bx bx-notepad",
            routerLink: "/planning",
            claims: [
              Permissions.Performance.Scorecard.Create,
              Permissions.Performance.Scorecard.GetById,
              Permissions.Performance.Scorecard.MyActions,
              Permissions.Performance.Scorecard.Status,
              Permissions.Performance.Scorecard.Submit,
              Permissions.Performance.Scorecard.Update,
              Permissions.Performance.Goal.Add,
              Permissions.Performance.Goal.Edit,
              Permissions.Performance.Goal.Delete,
            ],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 13,
            index: 3,
            name: {
              en: "Change Requests",
              ar: "طلبات التغيير",
            },
            icon: "bx bx-slider",
            routerLink: "/performance-change-requests",
            claims: [
              Permissions.Performance.Scorecard.Create,
              Permissions.Performance.Scorecard.GetById,
              Permissions.Performance.Scorecard.MyActions,
              Permissions.Performance.Scorecard.Status,
              Permissions.Performance.Scorecard.Submit,
              Permissions.Performance.Scorecard.Update,
              Permissions.Performance.Goal.Add,
              Permissions.Performance.Goal.Edit,
              Permissions.Performance.Goal.Delete,
            ],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 14,
            index: 4,
            name: {
              en: "Submit Results",
              ar: "إدخال النتائج",
            },
            icon: "bx bx-line-chart",
            routerLink: "/score-submission",
            claims: [Permissions.Performance.Scorecard_Submission.View],
            visible: true,
            hasCounter: false,
            children: [],
          },
          // {
          //   id: 15,
          //   index: 5,
          //   name: {
          //     en: "Performance Reports",
          //     ar: "تقارير التخطيط",
          //   },
          //   icon: "bx bxs-report",
          //   routerLink: "/performance-reports",
          //   claims: [Permissions.Performance.Scorecard_Reports.View],
          //   visible: true,
          //   hasCounter: false,
          //   children: [],
          // },
          {
            id: 16,
            index: 6,
            name: {
              en: "Settings",
              ar: "الاعدادات",
            },
            icon: "bx bx-cog",
            routerLink: "/configuration",
            claims: [Permissions.Performance.Scorecard_Settings.View],
            visible: true,
            hasCounter: false,
            children: [],
          },
        ],
      },
      {
        id: 2,
        index: 2,
        name: {
          en: "Services",
          ar: "الخدمات",
        },
        icon: "isax isax-status-up",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 22,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "احصائيات الخدمات",
            },
            icon: "bx bx-line-chart",
            routerLink: "/servicesdashboard",
            claims: [Permissions.ServiceDesk.serviceDashboard.view],
            visible: true,
            hasCounter: false,
            children: [],
          },

          {
            id: 21,
            index: 1,
            name: {
              en: "Service Catalog",
              ar: "قائمة الخدمات",
            },
            icon: "bx bx-book",
            routerLink: "/service-catalog",
            claims: [Permissions.ServiceDesk.serviceCatalog.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          // {
          //   id: 22,
          //   index: 2,
          //   name: {
          //     en: "Form Builder",
          //     ar: "بناء النماذج",
          //   },
          //   icon: "bx bx-book",
          //   routerLink: "/entity-designer",
          //   claims: [Permissions.ServiceDesk.serviceCatalog.view],
          //   visible: true,
          //   hasCounter: false,
          //   children: [],
          // },
          {
            id: 23,
            index: 3,
            name: {
              en: "Manage Services",
              ar: "إدارة الخدمات",
            },
            icon: "bx bx-cog",
            routerLink: "/manage-services",
            claims: [Permissions.ServiceDesk.manageService.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 23,
            index: 9,
            name: {
              en: "Customers Services",
              ar: "خدمات المتعاملين",
            },
            icon: "bx bxs-user-detail",
            routerLink: "/e-services",
            claims: [Permissions.ServiceDesk.EService.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          // {
          //   id: 5,
          //   order: 15,
          //   categoryTitle: {
          //     en: 'Process Automation',
          //     ar: 'أتمتة العمليات',
          //   },
          //   en: 'Dashboard',
          //   ar: 'احصائيات الخدمات',
          //   icon: 'bx bx-line-chart',
          //   routerLink: '/servicesdashboard',
          //   claims: [Permissions.ServiceDesk.serviceDashboard.view],
          //   hasCounter: false,
          // },
          {
            id: 24,
            index: 4,
            name: {
              en: "My Requests",
              ar: "طلباتي",
            },
            icon: "bx bx-edit",
            routerLink: "/requests",
            claims: [Permissions.ServiceDesk.myRequests.view],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 25,
            index: 5,
            name: {
              en: "Manage Forms",
              ar: "إدارة النماذج",
            },
            icon: "bx bx-note",
            routerLink: "/manage-forms",
            claims: [Permissions.ServiceDesk.manageForms.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 26,
            index: 6,
            name: {
              en: "Agent Queue",
              ar: "قائمة الطلبات",
            },
            icon: "bx bx-list-ul",
            routerLink: "/agent-queue",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 27,
            index: 7,
            name: {
              en: "Minutes of Meetings",
              ar: "محاضر الاجتماعات",
            },
            icon: "bx bx-time",
            routerLink: "/meetings",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 28,
            index: 8,
            name: {
              en: "Followup",
              ar: "المتابعات",
            },
            icon: "bx bx-list-ul",
            routerLink: "/follow-up",
            claims: [Permissions.ServiceDesk.serviceCatalog.view],
            visible: true,
            hasCounter: true,
            children: [],
          },
        ],
      },
      {
        id: 3,
        index: 3,
        name: {
          en: "Projects",
          ar: "المشاريع",
        },
        icon: "bx bx-cog",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 31,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "الإحصائيات",
            },
            icon: "bx bx-line-chart",
            routerLink: "/dashboard",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 32,
            index: 2,
            name: {
              en: "Requests",
              ar: "طلبات المشاريع",
            },
            icon: "bx bx-folder-open",
            routerLink: "/eppm-requests",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 33,
            index: 3,
            name: {
              en: "Projects",
              ar: "المشاريع المعتمدة",
            },
            icon: "bx bx-grid-alt",
            routerLink: "/projects",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 34,
            index: 4,
            name: {
              en: "Change Requests",
              ar: "طلبات التغيير",
            },
            icon: "bx bx-slider",
            routerLink: "/change-requests",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
          {
            id: 35,
            index: 5,
            name: {
              en: "Closure Requests",
              ar: "طلبات الإغلاق",
            },
            icon: "bx bx-window-close",
            routerLink: "/closure-requests",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: true,
            children: [],
          },
        ],
      },
      // {
      //   id: 4,
      //   index: 4,
      //   name: {
      //     en: "Work Flow",
      //     ar: "تدفق العمل",
      //   },
      //   icon: "isax isax-share",
      //   claims: ["ManageAll"],
      //   visible: true,
      //   children: [
      //     {
      //       id: 41,
      //       index: 1,
      //       name: {
      //         en: "Delegations",
      //         ar: "التفويضات",
      //       },
      //       icon: "bx bx-user",
      //       routerLink: "/delegations",
      //       claims: [Permissions.WorkFlow.ManageDelegations],
      //       visible: true,
      //       hasCounter: false,
      //       children: [],
      //     },
      //     {
      //       id: 41,
      //       index: 1,
      //       name: {
      //         en: "Process",
      //         ar: "التفويضات",
      //       },
      //       icon: "bx bx-user",
      //       routerLink: "/process",
      //       claims: [Permissions.WorkFlow.ManageProcess],
      //       visible: true,
      //       hasCounter: false,
      //       children: [],
      //     },
      //   ],
      // },
      {
        id: 5,
        index: 5,
        name: {
          en: "Admin",
          ar: "الادارة",
        },
        icon: "bx bx-user",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 51,
            index: 1,
            name: {
              en: "Users",
              ar: "المستخدمون",
            },
            icon: "bx bx-user",
            routerLink: "/users",
            claims: [Permissions.UserManagement.Users.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 52,
            index: 2,
            name: {
              en: "Roles",
              ar: "الأدوار",
            },
            icon: "bx bx-check-shield",
            routerLink: "/roles",
            claims: [Permissions.UserManagement.Roles.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 53,
            index: 3,
            name: {
              en: "Committees",
              ar: "اللجان",
            },
            icon: "bx bx-group",
            routerLink: "/committees",
            claims: [Permissions.UserManagement.Committees.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 54,
            index: 4,
            name: {
              en: "Groups",
              ar: "المجموعات",
            },
            icon: "bx bx-group",
            routerLink: "/groups",
            claims: [Permissions.UserManagement.Groups.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 55,
            index: 5,
            name: {
              en: "Delegations",
              ar: "التفويضات",
            },
            icon: "bx bx-user",
            routerLink: "/delegations",
            claims: [Permissions.WorkFlow.ManageDelegations],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 56,
            index: 6,
            name: {
              en: "Process",
              ar: "المخططات",
            },
            icon: "bx bx-user",
            routerLink: "/process",
            claims: [Permissions.WorkFlow.ManageProcess],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 57,
            index: 7,
            name: {
              en: "Lookup Management",
              ar: "إدارة القيم",
            },
            icon: "bx bxs-notepad",
            routerLink: "/lookups",
            claims: [Permissions.UserManagement.Groups.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
        ],
      },
      // {
      //   id: 6,
      //   index: 6,
      //   name: {
      //     en: "CMS",
      //     ar: "المحتوي",
      //   },
      //   icon: "bx bx-slider",
      //   claims: ["ManageAll"],
      //   visible: true,
      //   children: [
      //     {
      //       id: 61,
      //       index: 1,
      //       name: {
      //         en: "Lookup Management",
      //         ar: "إدارة القيم",
      //       },
      //       icon: "bx bxs-notepad",
      //       routerLink: "/lookups",
      //       claims: [Permissions.UserManagement.Groups.view],
      //       visible: true,
      //       hasCounter: false,
      //       children: [],
      //     },
      //   ],
      // },
      {
        id: 7,
        index: 7,
        name: {
          en: "Committees",
          ar: "اللجان",
        },
        icon: "bx bx-group",
        claims: ["ManageAll"],
        visible: true,
        children: [
          //dashboard
          {
            id: 74,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "الإحصائيات",
            },
            icon: "bx bx-line-chart",
            routerLink: "/committees-management/dashboard",
            claims: [Permissions.Committees.PerformanceDashboard.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          //requests
          {
            id: 71,
            index: 2,
            name: {
              en: "Requests",
              ar: "الطلبات",
            },
            icon: "bx bx-edit",
            routerLink: "/committees-management/requests",
            claims: [Permissions.Committees.Requests.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          //committe list
          {
            id: 72,
            index: 3,
            name: {
              en: "Committees List",
              ar: "قائمة اللجان",
            },
            icon: "bx bx-list-ul",
            routerLink: "/committees-management/list",
            claims: [Permissions.Committees.CommitteesList.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          //modigy request
          {
            id: 74,
            index: 4,
            name: {
              en: "Modify Requests",
              ar: "طلبات التغيير",
            },
            icon: "bx bxs-edit",
            routerLink: "/committees-management/modify-requests",
            claims: [Permissions.Committees.ModifyRequest.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
          //evaluation
          {
            id: 74,
            index: 4,
            name: {
              en: "Evaluation",
              ar: " التقييم",
            },
            icon: "bx bx-star",
            routerLink: "/committees-management/evaluation",
            claims: [Permissions.Committees.Evaluations.view],
            visible: true,
            hasCounter: false,
            children: [],
          },

          //setting
          {
            id: 73,
            index: 5,
            name: {
              en: "Settings",
              ar: "الاعدادات",
            },
            icon: "bx bx-cog",
            routerLink: "",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [
              // {
              //   id: 731,
              //   index: 1,
              //   name: {
              //     en: "Voting Template",
              //     ar: "قالب التصويت",
              //   },
              //   routerLink: "/committees-management/settings/voting-templates",
              //   claims: [Permissions.Committees.Settings.Voting.view],
              //   visible: true,
              // },

              {
                id: 732,
                index: 2,
                name: {
                  en: "Weight Settings",
                  ar: "إعدادات الوزن",
                },
                routerLink: "/committees-management/settings/weight-settings",
                claims: [Permissions.Committees.Settings.WeightSettings.view],
                visible: true,
              },

            ],
          },
        ]
      },
      {
        id: 9,
        index: 9,
        name: {
          en: "BAU",
          ar: "الأحداث",
        },
        icon: "isax isax-status-up",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 77,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "الإحصائيات",
            },
            icon: "isax isax-document",
            routerLink: "/bau/dashboard",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 78,
            index: 2,
            name: {
              en: "Tasks Management",
              ar: "إداره المهام",
            },
            icon: "isax isax-status-up",
            routerLink: "/bau/taskboard",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 79,
            index: 3,
            name: {
              en: "Unit Roles and Responsibilities",
              ar: "أدوار ومسؤوليات الوحدة",
            },
            icon: "isax isax-row-vertical",
            routerLink: "/bau/roles",
            claims: [Permissions.BAU.Roles.view],
            visible: true,
            hasCounter: false,
            children: [],
          },
        ],
      },
      // {
      //   id: 8,
      //   index: 8,
      //   name: {
      //     en: "Events",
      //     ar: "الأحداث",
      //   },
      //   icon: "bx bxs-calendar-event",
      //   claims: ["ManageAll"],
      //   visible: true,
      //   children: [
      //     {
      //       id: 71,
      //       index: 1,
      //       name: {
      //         en: "Events List",
      //         ar: "قائمة الأحداث",
      //       },
      //       icon: "bx bx-list-ul",
      //       routerLink: "/events",
      //       claims: ["ManageAll"],
      //       visible: true,
      //       hasCounter: false,
      //       children: [],
      //     },
      //   ],
      // },
      {
        id: 10,
        index: 9,
        name: {
          en: "Innovation",
          ar: "الإبتكار",
        },
        icon: "isax isax-cup",
        claims: ["ManageAll"],
        visible: true,
        children: [
          {
            id: 78,
            index: 1,
            name: {
              en: "Dashboard",
              ar: "الإحصائيات",
            },
            icon: "bx bx-line-chart",
            routerLink: "/innovation/dashboard",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [],
          },
          {
            id: 79,
            index: 2,
            name: {
              en: "Challenges",
              ar: "التحديات",
            },
            icon: "bx bx-line-chart",
            routerLink: "/innovation/challenges/list",
            claims: ["ManageAll"],
            visible: true,
            hasCounter: false,
            children: [],
          },
        ],
      },
    ];

    let menus;

    // Get Users Claims
    let claims = this.userSer.getCurrentUserClaims();
    if (claims) {
      // console.log(claims)
      // Update once backend returns claims
      claims.push("ManageAll");
      if (!claims) {
        return;
      }

      // Filter Menu Items allowed for user
      menus = this.menuItems
        .filter((item: any) => {
          // Filter based on claims and visibility
          return (
            item.claims.some((claim: any) => claims.includes(claim)) &&
            item.visible
          );
        }).sort((a, b) => a.index - b.index);
      // console.log(menus)
      // Filter and sort children items
      menus.forEach((menu: any) => {
        menu.children = menu.children
          .filter((child: any) => {
            // Filter based on claims and visibility
            return (
              child.claims.some((claim: any) => claims.includes(claim)) &&
              child.visible
            );
          })
          .sort((a: any, b: any) => a.index - b.index);

        // Filter and sort grandchildren items
        menu.children.forEach((child: any) => {
          child.children = child.children
            .filter((grandchild: any) => {
              // Filter based on claims and visibility
              return (
                grandchild.claims.some((claim: any) => claims.includes(claim)) &&
                grandchild.visible
              );
            })
            .sort((a: any, b: any) => a.index - b.index);
        });
      });
      // console.log(menus)
      return menus;
    }

  }

  navigateToFirstMenu() {
    const menu = this.buildMenu();

    if (menu) {
      const firstCategory = menu[0];
      const firstMenu = firstCategory?.children[0];

      this.router.navigateByUrl(firstMenu.routerLink);
    } else {
      this.router.navigateByUrl("/login");
    }
  }
}
