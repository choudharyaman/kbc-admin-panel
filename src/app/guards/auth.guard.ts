import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {AppPages} from '../config/app.pages';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!AuthService.isLoggedIn()) {
      // Cleared Auth Items
      AuthService.clearUserData();

      // not logged in so redirect to login page with the return url
      this.router.navigate([AppPages.login], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
