import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {CustomerService} from "../../../services/customer.service";
import {QueryParamsMeta, ResponseData} from "../../../models/paginator.model";
import {AppConfig} from "../../../config/app.config";

@Injectable({
  providedIn: 'root'
})
export class CustomerMetricsResolver implements Resolve<boolean> {

  constructor(private service: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getCustomerMetrics().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class CustomerListResolver implements Resolve<boolean> {

  constructor(private service: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return this.service.getCustomers(query).pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<boolean> {

  constructor(private service: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const customerId = route.paramMap.get('customerId') as string;
    return this.service.getCustomer(customerId).pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerOrderListResolver implements Resolve<boolean> {
//
//   constructor(private service: OrderService) {
//   }
//
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     const customerId = route.paramMap.get('customerId') as string;
//
//     const query: QueryParamsMeta = {};
//     query.filters = [{name: 'customer', value: customerId}];
//     query.page = 1;
//     query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;
//
//     return this.service.getOrders(query).pipe(
//       map(res => { return (res as ResponseData).data })
//     );
//   }
// }
