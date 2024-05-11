import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let lang = localStorage.getItem('locale')?.slice(1, 3) || "en"
    request = request.clone({
      headers: request.headers.set('Accept-Language', `${lang || 'en'}`)
    })
    return next.handle(request);
  }
}
