import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpErrorHandlerService} from "./http-error-handler.service";
import {User} from "../models/user.model";
import {Endpoints} from "../config/endpoints";
import {catchError} from "rxjs";
import {ResponseData} from "../models/paginator.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  updateUser(user: User) {
    return this.http.patch<ResponseData>(`${Endpoints.USERS}/${user.id}`, user).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getUserActivities(userId: string, page = 1, pageSize = 50) {
    let qParams = new HttpParams();
    if (page) {
      qParams = qParams.set('page', page);
      qParams = qParams.set('page_size', pageSize);
    }
    return this.http.get<ResponseData>(Endpoints.USER_ACTIVITIES.replace(":userId", userId),
      {params: qParams}
    ).pipe(catchError(this.httpErrorHandler.handleError).bind(this))
  }

  getLoginActivities(userId: string, page = 1, pageSize = 50) {
    let qParams = new HttpParams();
    if (page) {
      qParams = qParams.set('page', page);
      qParams = qParams.set('page_size', pageSize);
    }
    return this.http.get<ResponseData>(Endpoints.USER_LOGIN_ACTIVITIES.replace(":userId", userId),
      {params: qParams}
    ).pipe(catchError(this.httpErrorHandler.handleError).bind(this))
  }
}
