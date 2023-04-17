import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {ResponseData} from '../../../models/paginator.model';
import {GlobalSettingService} from '../../../services/global-setting.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsResolver implements Resolve<boolean> {
  constructor(private service: GlobalSettingService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getGlobalSettings().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}
