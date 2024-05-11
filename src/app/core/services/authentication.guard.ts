import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router,
    private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // check authorization
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Handle when route claims is empty
    const allowedClaims = route.data.allowedClaims;
    if (!allowedClaims || allowedClaims.length == 0)
      return true;

    // Handle when user claims is empty
    const userClaims = this.userService.getCurrentUserClaims();
    if (!userClaims || userClaims.length == 0) {
      this.router.navigate(['/oops/not-authorized']);
      return false;
    }

    // Finally check if claim is allowed
    let claimFound = allowedClaims.some((claim: any) => {
      return userClaims.findIndex((uclaim: any) => uclaim == claim) >= 0;
    })

    if (!claimFound)
      this.router.navigate(['/oops/not-authorized']);

    return claimFound;
  }


}
