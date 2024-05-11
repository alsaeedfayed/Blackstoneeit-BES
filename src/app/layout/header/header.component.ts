import { take, takeUntil, finalize } from 'rxjs/operators';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { BrowserDbService } from 'src/app/core/services/browser-db.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/shared/interfaces/iUser.interface';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { Constant } from '../../core/config/constant';
import { INotification } from '../Interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: IUser;
  personItem: IPerson;
  loading: boolean;
  profileForm: FormGroup;
  selectedImg: any;
  userData: any;
  isBtnLoading: boolean;
  lang: string;
  // Notification Props
  public isNotificationLoading: boolean = false;
  public showNotificationMenu: boolean = false;
  public notificationsCount: number;
  public notificationsList: INotification[] = [];

  // Hide Notification Memu in case clicked outside it
  @HostListener('document:click', ['$event']) onclick(evt: any) {
    if (!this.eRef.nativeElement.contains(evt.target)) {
      this.showNotificationMenu = false;
    }
  }
  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private router: Router,
    private httpHandlerService: HttpHandlerService,
    private translateService: TranslateConfigService,
    private db: BrowserDbService,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.userData = this.userService.getCurrentUserData();
    this.getProfile();
    // this.getNotificationsCount();
    // this.routingHandler();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getProfile() {
    const userId = this.userService.getCurrentUserId();
    this.httpHandlerService
      .get(Config.Profile.getProfile + '?userId=' + userId)
      .subscribe((res) => {
        this.user = res;
        //console.log("this.user ", this.user)
        this.personItem = {
          id: this.user.id,
          name: this.user.fullName,
          image: this.user.profilePicture,
          backgroundColor: '#0075ff',
          isActive: this.user.active,
          position: this.user.position,
        };
      });
  }

  changeLang(language: any) {
    this.translateService.setLanguage(language);
  }

  logout() {
    this.userService.clear();
    this.router.navigateByUrl('/login');
  }

  getCurrentUserData() {
    return this.userService.getCurrentUserData();
  }

  displaySettings() {
    return this.userService.isUserAllowedTo('ManageSettings');
  }

  switchLanguage() {
    //To be removed
    //location.reload()
    const lang = this.db.getItem(Constant.locale);
    this.translateService.setLanguage(lang == 'ar' ? 'en' : 'ar');
  }

  onShowNotification() {
    this.showNotificationMenu = !this.showNotificationMenu;
    if (this.showNotificationMenu) {
      this.getNotifications();
    }
  }
  //  Notifiacations
  private routingHandler() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.getNotificationsCount();
      }
    });
  }

  private getNotificationsCount() {
    this.httpHandlerService
      .get(`${Config.Notification.GetCount}?UserId=${this.userService.getCurrentUserId()}`)
      .pipe(take(1))
      .subscribe((res) => {
        this.notificationsCount = res;
      });
  }

  private getNotifications() {
    this.isNotificationLoading = true;
    this.httpHandlerService
      .get(`${Config.Notification.GetNotifications}?UserId=${this.userService.getCurrentUserId()}`)
      .pipe(
        take(1),
        finalize(() => (this.isNotificationLoading = false))
      )
      .subscribe((res) => {
        this.notificationsList = res;
      });
  }

  public notifcationReadedHandler(notification: INotification) {
    const reqBody = {
      id: notification.id,
      userId: this.userService.getCurrentUserId(),
      isRead: true
    }
    this.httpHandlerService
      .put(`${Config.Notification.ReadNotification}`,reqBody)
      .subscribe((res) => {
        if (res){
          // Reduce notification count by one and remove from notification array
          this.notificationsCount--;
          setTimeout(() => {
            this.notificationsList = this.notificationsList.filter((notificationItem) => notificationItem.id != notification.id)
          }, 300);
        }
      });
  }
}
