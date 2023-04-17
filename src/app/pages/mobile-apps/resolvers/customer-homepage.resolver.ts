import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {MobileAppService} from "../../../services/mobile-app.service";
import {ResponseData} from "../../../models/paginator.model";
import {ProductService} from '../../../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerHomepageBannerListResolver implements Resolve<boolean> {
  constructor(private service: MobileAppService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getAppBanners().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveProductCategoryListResolver implements Resolve<boolean> {
  constructor(private service: ProductService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getAllActiveProductCategories().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}
