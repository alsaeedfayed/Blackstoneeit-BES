import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { Config } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ApplicationLiscenceService {
    
    constructor(private httpService: HttpHandlerService) {}

    checkLicenseStatus() {
        return this.httpService.get(Config.License.CheckLicense);
    }

}
