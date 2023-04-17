import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable } from 'rxjs';
import {ResponseData} from "../../../models/paginator.model";
import {MobileAppService} from '../../../services/mobile-app.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerAlertMessageResolver implements Resolve<boolean> {
  constructor(private service: MobileAppService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getCustomerAppAlertMessages().pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}
