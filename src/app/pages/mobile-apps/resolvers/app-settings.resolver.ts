import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {MobileAppService} from "../../../services/mobile-app.service";
import {ResponseData} from "../../../models/paginator.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerAppGlobalSettingsResolver implements Resolve<boolean> {
  constructor(private service: MobileAppService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getCustomerAppGlobalSettings().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}
