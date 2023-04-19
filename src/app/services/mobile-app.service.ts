import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {HttpErrorHandlerService} from "./http-error-handler.service";
import {Endpoints} from "../config/endpoints";
import {catchError, map} from "rxjs";
import {AppCustomerAlertMessage, MobileAppBanner} from '../models/mobile-app.model';

@Injectable({
  providedIn: 'root'
})
export class MobileAppService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }

  getAppBanners() {
    return this.http.get(Endpoints.MOBILE_APP_BANNERS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createAppBanner(appBanner: MobileAppBanner) {
    return this.http.post(Endpoints.MOBILE_APP_BANNERS, appBanner).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateAppBanner(appBanner: MobileAppBanner) {
    return this.http.patch(`${Endpoints.MOBILE_APP_BANNERS}/${appBanner.id}`, appBanner).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteAppBanner(appBannerId: string) {
    return this.http.delete(`${Endpoints.MOBILE_APP_BANNERS}/${appBannerId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAppBannerMediaFiles() {
    return this.http.get(Endpoints.MOBILE_APP_BANNER_FILES).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createAppBannerMediaFiles(file: File) {
    const imgData = new FormData;
    imgData.append("file", file);

    return this.http.post(Endpoints.UPLOAD_MOBILE_APP_BANNER, imgData, {
      reportProgress: !0,
      observe: "events"
    }).pipe(
      // map((res: HttpEvent<any>) => {
      map((res: any) => {
        switch (res.type) {
          case HttpEventType.UploadProgress:
            return {
              status: "progress", message: Math.round(100 * res.loaded / res.total)
            };
          case HttpEventType.Response:
            return {
              status: "complete", message: res.body
            };
          default:
            return "Unhandled event: " + res.type
        }
      }),
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteAppBannerMediaFiles(mediaFileId: string) {
    return this.http.delete(`${Endpoints.MOBILE_APP_BANNER_FILES}/${mediaFileId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getCustomerAppAlertMessages() {
    return this.http.get(Endpoints.MOBILE_APP_CUSTOMER_ALERT_MESSAGE).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateCustomerAppAlertMessages(alert: AppCustomerAlertMessage) {
    return this.http.patch(Endpoints.MOBILE_APP_CUSTOMER_ALERT_MESSAGE, alert).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

}
