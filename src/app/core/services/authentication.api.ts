import { Injectable } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpHandlerService) {}

  login(body) {
    return this.http.post("/Identity/api/Identity/Login", body)
  }


  loginWithAzure() {
    return this.http.get("/Identity/api/MicrosoftLogin/Authorize")
  }

  authenticateWithAzure(code) {
    return this.http.get("/Identity/api/MicrosoftLogin/Token", { code })
  }

}
