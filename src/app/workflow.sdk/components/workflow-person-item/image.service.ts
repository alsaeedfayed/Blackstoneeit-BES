import { Injectable } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable()
export class ImageService {
  constructor(private http: HttpHandlerService) {}

  // Set File Url
  public setFileURL(fileName: string) {
    return this.http.post(Config.fileService.getFilesUrls, [fileName]);
  }
}
