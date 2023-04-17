import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {OrderService} from '../../../services/order.service';
import {AppConfig} from '../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class OrderMetricsResolver implements Resolve<boolean> {

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
export class OrderListResolver implements Resolve<boolean> {

  constructor(private service: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const query : QueryParamsMeta = {
      page: 1, page_size: AppConfig.PAGINATION.DEFAULT_PAGE_SIZE,
    };

    return this.service.getOrders(query).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderListByStatusResolver implements Resolve<boolean> {

  constructor(private service: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const selectedOrderStatuses = route.data['orderStatuses'] as string;
    const query : QueryParamsMeta = {
      filters: [{name: 'status__in', value: [selectedOrderStatuses].join(",")}],
      page: 1,
      page_size: AppConfig.PAGINATION.DEFAULT_PAGE_SIZE,
    };

    return this.service.getOrders(query).pipe(
      map(res => {return (res as ResponseData).data})
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true);
  }
}
