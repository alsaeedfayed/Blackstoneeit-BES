import { switchMap } from 'rxjs/operators';
/* tslint:disable */
import { Injectable, Inject, Optional, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ErrorHandler } from './error.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { licenceKey } from 'src/license/license';
// Making Sure EventSource Type is available to avoid compilation issues.
declare var EventSource: any;

@Injectable()
export abstract class BaseService {
  protected path: string;
  protected model: any;
  progress$ = new BehaviorSubject(0);
  lang: string;

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(UserService) protected userService: UserService,
    @Inject(Router) protected router: Router,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler,
    private toastr: ToastrService, private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('locale')?.slice(1, 3) || "en";
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  /**
   * @method request
   * @param {string}  method      Request method (GET, POST, PUT)
   * @param {string}  url         Request url (my-host/my-url/:id)
   * @param {any}     routeParams Values of url parameters
   * @param {any}     urlParams   Parameters for building url (filter and other)
   * @param {any}     postBody    Request postBody
   * @return {Observable<any>}
   * @description
   * This is a core method, every HTTP Call will be done from here, every API Service will
   * extend this class and use this method to get RESTful communication.
   **/
  public request(
    method: string,
    url: string,
    routeParams: any = {},
    urlParams: any = {},
    postBody: any = {},
    customHeaders: any = {}
  ): Observable<any> {
    // // Path Params
    // // Transpile route variables to the actual request Values
    // Object.keys(routeParams).forEach((key: string) => {
    //   url = url.replace(new RegExp(":" + key + "(\/|$)", "g"), routeParams[key] + "$1")
    // });

    // Headers
    let headers: HttpHeaders = new HttpHeaders();

    // Authenticate request
    if (!customHeaders.Authorization) headers = this.authenticate(url, headers);

    // Add Language Header to the request
    headers = this.lang === 'en'? headers.append('Accept-Language', 'en') : headers.append('Accept-Language', 'ar');

    Object.keys(customHeaders).forEach((header: string) => {
      if (customHeaders[header] !== 'attachment')
        headers = headers.append(header, customHeaders[header]);
    });
    if (
      !customHeaders['content-type'] &&
      customHeaders['content-type'] !== 'attachment'
    ) {
      headers = headers.append('Content-type', 'application/json');
      headers = headers.append('Accept', 'text/plain');
    }

    // License Header to the request
    if (!customHeaders.License) headers = headers.append('License-Key', licenceKey.valid)

    // Body
    let body: any;
    body = postBody;

    // URL Params
    let httpParams = new HttpParams();
    if (urlParams)
      Object.keys(urlParams).forEach((paramKey) => {
        let paramValue = urlParams[paramKey];
        if (paramValue != null && paramValue != undefined) {
          paramValue =
            typeof paramValue === 'object'
              ? JSON.stringify(paramValue)
              : paramValue;
          httpParams = httpParams.append(paramKey, paramValue);
        }
      });

    // Send Request

    let request = new HttpRequest(method, url, body, {
      headers: headers,
      responseType:
        customHeaders['content-type'] === 'attachment' ? 'blob' : 'json',
      params: httpParams,
      withCredentials: false,
    });

    return this.http.request(request).pipe(
      tap((e) => {
        const progress = this.getEventMessage(e);
        this.progress$.next(progress);
       // console.log('e ', e)
      }),
      filter((event) => event instanceof HttpResponse),
      map((res: HttpResponse<any>) => res.body),
      catchError((e) => {
        if (e.status) {
          if(e.status == 401) {
            return this.userService.getRefreshToken().pipe(switchMap(
              (res:any)=>{
                if(res){
                  this.userService.token.token = res.accessToken;
                  localStorage.setItem("$EPPM$token", res.accessToken);
                  return this.request(method, url, routeParams, urlParams, postBody, customHeaders)
                }
                return of(null);
              }
            ), tap( {
              error: (err: any) => {
                if(err.status == 400) {
                  this.userService.clear();
                  this.router.navigate(['/login']);
                }
              }
            } ));
          }
          if(e.status == 400) {
            // this.userService.clear();
            // this.router.navigate(['/login']);
            if(this.lang == 'en')
              this.toastr.error('Unknown Error');
            else
            this.toastr.error("خطا غير معروف");
          }
          if(e.status == 422) {
            if (
              e.error.ValidationResult &&
              Array.isArray(e.error.ValidationResult) &&
              e.error.ValidationResult[0] &&
              e.error.ValidationResult[0]?.Error
            )
              this.toastr.error(e.error.ValidationResult[0]?.Error);
            else this.toastr.error(e.error.Message);
          }
          if(e.status == 402) {
            this.router.navigate(['/oops/block-license'])
          }
          else
            if (e && e.error && e.error.Message)
              this.toastr.error(e.error.Message);
        }
        return throwError(e.error || 'Server error');
      })
    );

  }

  private getEventMessage(event: HttpEvent<any>) {
    if (event.type === HttpEventType.UploadProgress)
      return Math.round((100 * event.loaded) / event.total);

    return 0;
  }

  /**
   * @method authenticate
   * @author Jonathan Casarrubias <t: johncasarrubias, gh: mean-expert-official>
   * @license MIT
   * @param {string} url Server URL
   * @param {Headers} headers HTTP Headers
   * @return {void}
   * @description
   * This method will try to authenticate using either an access_token or basic http auth
   */
  public authenticate<T>(url: string, headers: HttpHeaders): HttpHeaders {
    if (this.userService.getAccessTokenId()) {
      headers = headers.append(
        'Authorization',
        `Bearer ${this.userService.getAccessTokenId()}`
      );
    }

    return headers;
  }
}
