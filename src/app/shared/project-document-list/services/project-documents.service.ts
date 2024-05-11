import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class ProjectDocumentsService {

  constructor(private http: HttpHandlerService, private httpClient: HttpClient, private userService: UserService) { }


  getAllDocuments(projectId, tag) {
    return this.http.get(`/Eppm/api/Project/Attachment/GetAll/${projectId}`, { tag })
  }

  addDocument(document) {
    return this.http.post(`/Eppm/api/Project/Attachment/Add`, document)
  }

  onUploadAttachment(file) {
    const headerDict = {
      "Authorization": 'Bearer ' + this.userService.getToken().token,
      'License-Key': licenceKey.valid
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const formData = new FormData();
    formData.append("file", file, file.name);

    return this.httpClient.post(environment.serverUrl + "/FileService/api/Attachment/Upload", formData, requestOptions)
  }



}
