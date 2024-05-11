import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MyAttService {

  constructor(private _http: HttpClient, private http: HttpHandlerService) { }

  uploadFilesToServer(files : any[]) : Observable<any> | Observable<any>[] {
    const uploadedFiles = files.map(file => file.file);
    const obs$ : Observable<any>[] = uploadedFiles.map((file) => {
      const formData = new FormData();
      formData.append('File' , file);
      console.log('form data' , formData)
      return this._http.post(
        Config.apiUrl + Config.fileService.upload,
        formData
        // {
        //   headers: new HttpHeaders({
        //     Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
        //     'License-Key' :licenceKey.valid
        //   }),
        // }
      );
    })

    return files && files.length > 0 ? obs$ : of(null);

  }

}
