import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class GetDecisionTextService {

  constructor(
    private userService: UserService,
    private httpSer: HttpHandlerService,
    private translate: TranslateService
  ) { }
  private text: string = '';

  // getDecisionText(instanceId: number): Observable<any> {
    
  //   return this.httpSer.get(`${Config.CommitteesManagement.GetDecisionText}/${instanceId}`)

  // }
  getDecisionText(instanceId: number): Promise<any> {
    let data = {
      headers: {
        Authorization: 'Bearer ' + this.userService.getAccessTokenId(),
        'Content-Type': 'text/plain',
        'License-Key': licenceKey.valid,
        'Accept-Language': this.translate.currentLang
      },
      method: 'GET',

    }
    return fetch(`${environment.serverUrl}${Config.CommitteesManagement.GetDecisionText}/${instanceId}`, data)
  }
  setText(text: string) {
    this.text = text;
  }
  getText(): string {
    return this.text;
  }
}
