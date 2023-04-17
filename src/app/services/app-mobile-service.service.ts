import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {ResponseData} from '../models/paginator.model';
import {AppAlertMessage, MobileAppBanner, MobileAppBannerMediaFile} from '../models/mobile-app.model';

@Injectable({
  providedIn: 'root'
})
export class AppMobileServiceService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getAppBanners() {
    return this.http.get<ResponseData>(Endpoints.MOBILE_APP_BANNERS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createAppBanner(appBanner: MobileAppBanner) {
    return this.http.post<ResponseData>(Endpoints.MOBILE_APP_BANNERS, appBanner).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateAppBanner(appBanner: MobileAppBanner) {
    return this.http.patch<ResponseData>(`${Endpoints.MOBILE_APP_BANNERS}/${appBanner.id}`, appBanner).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteAppBanner(appBanner: MobileAppBanner) {
    return this.http.delete(`${Endpoints.MOBILE_APP_BANNERS}/${appBanner.id}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAppBannerMediaFiles() {
    return this.http.get<ResponseData>(Endpoints.MOBILE_APP_BANNER_FILES).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteAppBannerMediaFiles(bannerFile: MobileAppBannerMediaFile) {
    return this.http.delete(`${Endpoints.MOBILE_APP_BANNER_FILES}/${bannerFile.id}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAppAlertMessages() {
    return this.http.get<ResponseData>(Endpoints.MOBILE_APP_ALERT_MESSAGE).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateAppAlertMessages(appAlertMessage: AppAlertMessage) {
    return this.http.patch<ResponseData>(Endpoints.MOBILE_APP_ALERT_MESSAGE, appAlertMessage).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
