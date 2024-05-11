import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class unAuthenticationGuard implements CanActivate {
  constructor(private router: Router,
    private userService: UserService,private title:Title) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): boolean {
    // check authorization
    if (this.userService.isAuthenticated()) {
      this.title.setTitle("service-catalog")
      this.router.navigateByUrl('/service-catalog');
      return false;
    }
    return true;
  }


}
