import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Service } from 'src/app/core/models/service';
import { Permissions } from 'src/app/core/services/permissions';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-box-services',
  templateUrl: './box-services.component.html',
  styleUrls: ['./box-services.component.scss'],
})

export class BoxServicesComponent implements OnInit, OnChanges {
  @Input() service: Service;
  @Output() favourite: EventEmitter<Service> = new EventEmitter();
  // @Output() onRating: EventEmitter<any> = new EventEmitter();
  showModle: boolean = false;
  loading: boolean = false;
  id = Math.random();
  permissionsServiceCatalogEnum = Permissions.ServiceDesk.serviceCatalog;
  get msgText() {
    if (this.service.favourite) {
      // return `${this.translate.instant('serviceCatalog.removeFavoriteConfirmationMsg')} ${this.service.title} ${this.translate.instant('serviceCatalog.service')}`;
      return `${this.translate.instant('serviceCatalog.removeFavoriteConfirmationMsg')} ${this.lang === 'en'? this.service.title : this.service.titleAr}`;
    }
    // return `${this.translate.instant('serviceCatalog.favoriteConfirmationMsg')} ${this.service.title} ${this.translate.instant('serviceCatalog.service')}`;
    return `${this.translate.instant('serviceCatalog.favoriteConfirmationMsg')} ${this.lang === 'en'? this.service.title : this.service.titleAr}`;
  }
  queryParams;
  lang: string = this.translate.currentLang;

  constructor(private modelService: ModelService, private translate:TranslateService) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  ngOnChanges() {
    if(this.service?.id) {
      this.queryParams = {
        serviceId: this.service.id,
        title: `${this.translate.instant('serviceCatalog.startService')} ${this.service.title}`
      }
    }
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  toggleFavourite() {
    this.modelService.close();
    this.favourite.emit(this.service);
  }

  // setRating(rating: number) {
  //   let obj = {
  //     rating: rating,
  //     service: this.service
  //   }
  //   this.onRating.emit(obj);
  // }

  openModel() {
    this.modelService.open('confrontation-msg' + this.id);
  }

  public get Count() {
    return Math.round(this.service.count);
  }

  startService() {
    this.showModle = true;
    this.modelService.open('start-service' + this.id);
  }

  closeService() {
    this.showModle = false;
    this.modelService.close();
  }
}
