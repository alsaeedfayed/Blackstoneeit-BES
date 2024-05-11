import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpHandlerService) { }

  getSettings(page: number, pageSize: number, keyword: string = '', sortBy: string) {
    return this.http.post('/Settings/Search', { page, pageSize, keyword, sortBy });
  }

  editSetting(setting) {
    return this.http.put('/Settings/Edit', setting);
  }
  getFinancialAccountById(id) {
    return this.http.get(`/Financial/Account/Get/${id}`)
  }
  getFinancialAccounts(searchModel) {
    return this.http.post('Financial/Account/Search', { type: "child account", searchModel })
  }
  searchFinancial(searchModel) {
    if (searchModel.keyword === '') {
      return of([]);
    }
    return this.http.post('/Financial/Account/Search', { type: "child account", searchModel }).pipe(
      map(response => response.data)
    );
  }

}
