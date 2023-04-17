import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {catchError, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  uploadCategoryImage(file: File) {
    const url = Endpoints.UPLOAD_PRODUCT_IMAGES;
    const formData = new FormData();
    formData.append("purpose", "category");
    formData.append("file", file);
    return this.uploadFile(url, formData);
  }

  uploadProfileAvatar(file: File) {
    const url = Endpoints.UPLOAD_PROFILE_AVATARS;
    const formData = new FormData();
    formData.append("file", file);
    return this.uploadFile(url, formData);
  }

  uploadMobileAppBanner(file: File) {
    const url = Endpoints.UPLOAD_MOBILE_APP_BANNER;
    const formData = new FormData();
    formData.append("file", file);
    return this.uploadFile(url, formData);
  }

  uploadFile(url: string, formData: FormData) {
    return this.http.post(url, formData, {
      reportProgress: true,
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
    );
  }
}
