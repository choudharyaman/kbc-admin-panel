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
import {TaxService} from '../../../services/tax.service';
import {DiscountService} from '../../../services/discount.service';

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

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const productCategoryId = route.paramMap.get('productCategoryId') as string;

    return this.service.getProductCategory(productCategoryId).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductListByCategoryResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const productCategoryId = route.paramMap.get('productCategoryId') as string;

    const query : QueryParamsMeta = {
      page: 1, page_size: AppConfig.PAGINATION.DEFAULT_PAGE_SIZE,
    };

    return this.service.getProductsByCategory(productCategoryId, query).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const productId = route.paramMap.get('productId') as string;

    return this.service.getProduct(productId).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveProductCategoriesResolver implements Resolve<any> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getAllActiveProductCategories().pipe(
      map(res => {return (res as ResponseData).data})
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveTaxesResolver implements Resolve<any> {

  constructor(private service: TaxService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getActiveTaxes();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveDiscountsResolver implements Resolve<any> {

  constructor(private service: DiscountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getActiveDiscounts();
  }
}
