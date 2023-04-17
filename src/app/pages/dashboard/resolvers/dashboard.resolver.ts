import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {CustomerService} from '../../../services/customer.service';
import {ResponseData} from '../../../models/paginator.model';
import {OrderService} from '../../../services/order.service';
import {ProductService} from '../../../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardOrderMetricsResolver implements Resolve<boolean> {

  constructor(private service: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getOrderMetrics().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardCustomerMetricsResolver implements Resolve<boolean> {

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
export class DashboardProductMetricsResolver implements Resolve<boolean> {

  constructor(private service: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getProductMetrics().pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}
