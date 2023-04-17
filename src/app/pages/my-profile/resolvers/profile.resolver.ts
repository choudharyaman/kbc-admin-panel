import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {AuthService} from "../../../services/auth.service";
import {ResponseData} from "../../../models/paginator.model";

@Injectable({
  providedIn: 'root'
})
export class AuthUserProfileResolver implements Resolve<boolean> {
  constructor(private service: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.service.getProfile().pipe(
      map(res => {
        return (res as ResponseData).data;
      })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthUserActivityResolver implements Resolve<boolean> {
  constructor(private service: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.service.getUserActivities(1, 50).pipe(
      map(res => {
        return (res as ResponseData).data;
      })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthUserLoginActivityResolver implements Resolve<boolean> {
  constructor(private service: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.service.getLoginActivities(1, 50).pipe(
      map(res => {
        return (res as ResponseData).data;
      })
    );
  }
}
