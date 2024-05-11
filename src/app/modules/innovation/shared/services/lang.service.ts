import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LangService {
  language: string;

  constructor(private translate: TranslateService) {
    // Initialize the language variable with the current language
    this.language = this.translate.currentLang;

    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
    });
  }

  get Language() {
    return this.language;
  }
}
