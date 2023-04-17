import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {ProductService} from '../../../services/product.service';
import {AppConfig} from '../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ProductMetricsResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getProductMetrics().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductListResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const query : QueryParamsMeta = {
      page: 1, page_size: AppConfig.PAGINATION.DEFAULT_PAGE_SIZE,
    };

    return this.service.getProducts(query).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryListResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getProductCategories().pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}
