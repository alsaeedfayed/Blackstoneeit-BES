import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Tab } from 'src/app/design-system/components/tabs-menu/tab';
import { RoutesVariables } from '../../../routes';
import { Location } from '@angular/common';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { NgxCaptureService } from 'ngx-capture';

@Component({
  selector: 'app-committee-details',
  templateUrl: './committee-details.component.html',
  styleUrls: ['./committee-details.component.scss']
})
export class CommitteeDetailsComponent implements OnInit, OnChanges {

  private endSub$ = new Subject();

  backToUrl = `${RoutesVariables.Root}/list`;
  language: string = this.translate.currentLang;
  loading: boolean = true;
  loadingCRPermission : boolean = true
  committeeId: string = '';
  committeeDetails: any;
  committeeChildComponent: any;
  titleBtn: string = ''

  // CR
  isAllowedCR : boolean = false

  tabs: Tab[] = [
    {
      icon: 'bx bx-bar-chart-square',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      route: 'dashboard',
    },
    {
      icon: 'bx bx-video',
      label: 'Meetings',
      labelAr: 'الاجتماعات',
      route: 'meetings',
    },
    {
      icon: 'bx bx-task',
      label: 'Tasks',
      labelAr: 'المهام',
      route: 'tasks',
    },
    {
      icon: 'bx bx-list-ul',
      label: 'Decisions',
      labelAr: 'القرارات',
      route: 'decisions',
    },
    {
      icon: 'bx bx-group',
      label: 'Work Groups',
      labelAr: 'مجموعات العمل',
      route: 'work-groups',
    },
    {
      icon: 'bx bx-extension bx-flip-horizontal',
      label: 'KPIs',
      labelAr: 'المؤشرات',
      route: 'KPIs',
    },
    {
      icon: 'bx bx-star',
      label: 'Evaluations',
      labelAr: 'التقييمات',
      route: 'evaluations',
    },
    {
      icon: 'bx bx-detail',
      label: 'About',
      labelAr: 'حول',
      route: 'about',
    },
  ];

  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modelService: ModelService,
    private captureService: NgxCaptureService,

  ) {
  }

  // ngDoCheck(): void {
  //   if (this.location.path() === "/committees-management/committee-details/101/about") {
  //     this.language === "en" ? this.titleBtn = "Send Change Request" : this.titleBtn = "إرسال طلب تغيير"
  //   }
  //   else {
  //     this.titleBtn = ''
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    // get committee id



    this.committeeId = this.route.snapshot.paramMap.get('id');
    if (isNaN(+this.committeeId)) this.goToNotFound();
    else {
      // handles language change event
      this.handleLangChange();

      // get committee details
      this.getCommitteeDetails();
    }

    // allowed to CR ?
    this.isAllowedToCR()
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
        this.isAllowedToCR()
      });
  }

  // get committee details
  getCommitteeDetails() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.committeeId}`)
      .pipe(finalize(() => { this.loading = false }))
      .subscribe((res) => {
        if (res) {
          this.committeeChildComponent.committeeDetails = this.committeeDetails = res;
        }
      });
  }

  // pass data to child components on outlet loaded
  onOutletLoaded(component) {
    if (!this.committeeChildComponent) {
      this.committeeChildComponent = component;
    } else {
      component.committeeDetails = this.committeeDetails;
    }
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }


  openModal() {
    this.modelService.open('create-change-request');

  }

  // check CR Permission
  isAllowedToCR() : void {
    this.httpSer
    .get(`${Config.CommitteesManagement.AllowedToCR}/${this.committeeId}`)
    .pipe(finalize(() => { this.loadingCRPermission = false }))
    .subscribe((res : boolean) => {
      this.isAllowedCR = res
    });


  }





  capture(e) {
   // e.stopPropagation();
   // console.log(e)
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    //const dimensions = document.getBoundingClientRect();

    var width = document.body.clientWidth ;
    this.captureService
      .getImage(document.body, false, {

        x: this.language === 'en' ?  120 : -100,
        y: this.language === 'en' ?  230 : '',
        width: width,
        height: height,
        useCORS: true,
      })
      .pipe(
        tap(img => {
          // console.log(img);
        })
      )
      .subscribe(res => {
       // let screenShot = this.DataURIToBlob(res);
        // console.log(res)
        let a = document.createElement("a"); //Create <a>
        a.href = `${res}`; //Image Base64  here
        a.download = "committee dashboard.png"; //File name Here
        document.body.appendChild(a);
        a.click(); //Downloaded file
        document.body.removeChild(a);
      });
  }


}
