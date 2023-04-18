import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {OrderService} from '../../../services/order.service';
import {AppConfig} from '../../../config/app.config';
import {CourierAgentService} from '../../../services/courier-agent.service';
import {DeliveryPersonService} from '../../../services/delivery-person.service';
import {TaxService} from '../../../services/tax.service';
import {DiscountService} from '../../../services/discount.service';

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

  constructor(private service: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const orderId = route.paramMap.get('orderId') as string;

    return this.service.getOrder(orderId).pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveCourierAgentsResolver implements Resolve<any> {

  constructor(private service: CourierAgentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getAllActiveCourierAgents();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActiveDeliveryPersonsResolver implements Resolve<any> {

  constructor(private service: DeliveryPersonService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getAllActiveDeliveryPerson();
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
