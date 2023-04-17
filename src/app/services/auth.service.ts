
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Endpoints} from '../config/endpoints';
import {catchError, map} from 'rxjs/operators';
import { AppConfig } from '../config/app.config';
import {HttpErrorHandlerService} from "./http-error-handler.service";
import {ResponseData} from "../models/paginator.model";
import {Profile} from "../models/profile.model";
import {Toast} from "../utils/toast";
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  static getUser(): Profile | any {
    const profile = JSON.parse(localStorage.getItem(AppConfig.AUTH.USER_KEY) as string);
    if (profile === undefined || profile === null) {
      Toast.fire({
        icon: 'error',
        text: 'Auth storage is cleared, Please re-login to access Panel'
      });
      return null;
    } else {
      return profile;
    }
  }

  static setUser(profile: Profile): void {
    localStorage.setItem(AppConfig.AUTH.USER_KEY, JSON.stringify(profile));
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(AppConfig.AUTH.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(AppConfig.AUTH.REFRESH_TOKEN_KEY);
  }

  static isLoggedIn(): boolean {
    return !!AuthService.getAccessToken();
  }

  static clearUserData() {
    // Cleared Auth Items
    console.log('Cleared User Data from Local Storage');
    localStorage.clear();
  }

  public login(username$: string, password$: string) {
    return this.http.post<ResponseData>(Endpoints.AUTH_LOGIN, {username: username$, password: password$}).pipe(
      map(res => {
        this.setToken(AppConfig.AUTH.ACCESS_TOKEN_KEY, res.data.access_token);
        this.setToken(AppConfig.AUTH.REFRESH_TOKEN_KEY, res.data.refresh_token);
        AuthService.setUser(res.data.user_profile);
        return res;
      })
    );
  }

  public refreshToken(): any {
    return this.http.post<any>(Endpoints.AUTH_REFRESH_TOKEN, {refresh_token: AuthService.getRefreshToken()}).pipe(
      map(res => {
        this.setToken(AppConfig.AUTH.ACCESS_TOKEN_KEY, res.data.access_token);
        return res;
      })
    );
  }

  public logout(): any {
    const payload = {
      refresh_token: AuthService.getRefreshToken()
    };

    // Cleared Auth Items
    AuthService.clearUserData();

    this.http.post<any>(Endpoints.AUTH_LOGOUT, payload).pipe(
      catchError(this.httpErrorHandler.handleError),
      map(res => {
        return res;
      })
    ).subscribe();
  }

  public getProfile(): any {
    return this.http.get<any>(Endpoints.AUTH_PROFILE).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  public updateProfile(user: User): any {
    return this.http.patch<any>(Endpoints.AUTH_PROFILE, user).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  public changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<ResponseData>(Endpoints.AUTH_CHANGE_PASSWORD,
      {current_password: currentPassword, new_password: newPassword}).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  // Unsecured API
  public resetPasswordSendOTP(username: string) {
    return this.http.post<ResponseData>(Endpoints.AUTH_RESET_PASSWORD, {username: username}).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  // Unsecured API
  public resetPasswordSetPassword(payload: {username: string, otp_id: string, otp: string, new_password: string}) {
    return this.http.post<ResponseData>(Endpoints.AUTH_RESET_PASSWORD_SET_PASSWORD, payload).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  public getLoginActivities(page: number = 1, pageSize: number = 50) {
    let qParams = new HttpParams();
    if (page) {
      qParams = qParams.set('page', page);
      qParams = qParams.set('page_size', pageSize);
    }
    return this.http.get<ResponseData>(Endpoints.AUTH_LOGIN_ACTIVITIES, {params: qParams}).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  public getUserActivities(page: number = 1, pageSize: number = 50) {
    let qParams = new HttpParams();
    if (page) {
      qParams = qParams.set('page', page);
      qParams = qParams.set('page_size', pageSize);
    }
    return this.http.get<ResponseData>(Endpoints.AUTH_USER_ACTIVITIES, {params: qParams}).pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  private setToken(tokenName: string, token: string): void {
    if ([AppConfig.AUTH.ACCESS_TOKEN_KEY, AppConfig.AUTH.REFRESH_TOKEN_KEY].indexOf(tokenName) > -1) {
      localStorage.setItem(tokenName, token);
    } else {
      throw Error(`Invalid token name: ${tokenName}`);
    }
  }

  private getToken(tokenName: string): string | null {
    if ([AppConfig.AUTH.ACCESS_TOKEN_KEY, AppConfig.AUTH.REFRESH_TOKEN_KEY].indexOf(tokenName) > -1) {
      return localStorage.getItem(tokenName);
    } else {
      throw Error(`Invalid token name: ${tokenName}`);
    }
  }
}
