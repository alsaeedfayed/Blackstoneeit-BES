import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constant } from '../config/constant';
import { LangConfig } from '../config/lang.config';
import { BrowserDbService } from './browser-db.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  private langSelected$: BehaviorSubject<string>;
  langChangeObserver: Observable<string>;
  constructor(private browserDbService: BrowserDbService) {
    this.langSelected$ = new BehaviorSubject('ar');
    this.langChangeObserver = this.langSelected$.asObservable();
    this.setLanguage();
  }

  getSystemLang(): any {
    const local = this.browserDbService.getItem(Constant.locale);
    if (local) return local;
    else return LangConfig.AR;
  }

  setLanguage(lang?: string) {
    this.browserDbService.setItem(
      Constant.locale,
      lang || this.getSystemLang()
    );
    this.langSelected$.next(lang || this.getSystemLang());

    this.getSystemLang() == LangConfig.AR
      ? this.chengeDir('rtl')
      : this.chengeDir('ltr');
  }

  chengeDir(custemDir: string) {
    document.documentElement.setAttribute('dir', custemDir);
  }
}
