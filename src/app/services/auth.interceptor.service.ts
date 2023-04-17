import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { AuthService } from './auth.service';
import {Endpoints} from '../config/endpoints';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Toast} from '../utils/toast';
import {AppConfig} from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  excludedApis = [Endpoints.AUTH_LOGIN, Endpoints.AUTH_RESET_PASSWORD, Endpoints.AUTH_RESET_PASSWORD_SET_PASSWORD,
    Endpoints.AUTH_REFRESH_TOKEN, Endpoints.AUTH_LOGOUT];

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.excludedApis.indexOf(request.url) === -1) {
      if (AuthService.isLoggedIn()) {
        request = this.addToken(request);
        return next.handle(request).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.on401RefreshAccess(request, next);
            } else {
              return throwError(error);
            }
          })
        );
      } else {
        Toast.fire({
          icon: 'error',
          text: 'Auth storage cleared. Please contact Dev Team'
        });
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }
    }
    // for unsecured api's
    return next.handle(request);
  }

  private on401RefreshAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        catchError(error => {
          this.isRefreshing = false;
          Swal.fire({
            title: '<span class="text-danger">Unauthorized Access</span>',
            text: 'Please login to access this account',
            icon: 'error',
            confirmButtonColor: AppConfig.COLORS.PRIMARY,
            confirmButtonText: 'Login Again'
          }).then( val => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          });
          return throwError(null);
        }),
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.data.access_token);
          return next.handle(this.addToken(request));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          console.log('token', token);
          return next.handle(this.addToken(request));
        }));
    }
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        // 'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `JWT ${AuthService.getAccessToken()}`,
      },
    });
  }
}
