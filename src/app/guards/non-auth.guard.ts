import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {AppPages} from '../config/app.pages';


@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {
  constructor(private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (AuthService.isLoggedIn()) {
      // if (AuthService.getUser().role === UserRole.CLERK) {
      //   this.router.navigate(['/orders']);
      // } else {
      //   this.router.navigate(['/dashboard']);
      // }
      this.router.navigate([AppPages.dashboard]);
      return false;
    }

    // Cleared Auth Items
    AuthService.clearUserData();

    return true;
  }
}
