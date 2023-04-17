import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {ResponseData} from '../models/paginator.model';
import {GlobalSetting} from '../models/global-setting.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getGlobalSettings() {
    return this.http.get<ResponseData>(Endpoints.GLOBAL_SETTINGS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateGlobalSettings(setting: GlobalSetting) {
    return this.http.patch(Endpoints.GLOBAL_SETTINGS, setting).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
