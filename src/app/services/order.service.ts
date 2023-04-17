import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {AppConfig} from '../config/app.config';
import {catchError} from 'rxjs/operators';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {Order, OrderDeliveryAgent, OrderItem} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getOrderMetrics() {
    return this.http.get<ResponseData>(Endpoints.ORDER_METRICS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getOrders(query: QueryParamsMeta) {
    let qParam = new HttpParams();
    if (query.filters) {
      query.filters.forEach(filter => {
        qParam = qParam.set(filter.name, filter.value);
      });
    }
    if (query.order_by) {
      qParam = qParam.set('ordering', query.order_by.join(','));
    }
    if (query.page) {
      qParam = qParam.set('page', query.page);
    }
    if (query.page_size) {
      qParam = qParam.set('page_size', query.page_size);
    }
    if (query.search) {
      qParam = qParam.set('search', query.search);
    }

    return this.http.get<ResponseData>(Endpoints.ORDERS, { params: qParam}).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getOrdersByCustomer(customerId: string, query: QueryParamsMeta) {
    let qParam = new HttpParams();
    if (query.filters) {
      query.filters.forEach(filter => {
        qParam = qParam.set(filter.name, filter.value);
      });
    }
    if (query.order_by) {
      qParam = qParam.set('ordering', query.order_by.join(','));
    }
    if (query.page) {
      qParam = qParam.set('page', query.page);
    }
    if (query.page_size) {
      qParam = qParam.set('page_size', query.page_size);
    }
    if (query.search) {
      qParam = qParam.set('search', query.search);
    }

    this.http.get(Endpoints.CUSTOMER_ORDERS.replace(":customerId", customerId), {params: qParam }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getOrder(orderId: string) {
    return this.http.get<ResponseData>(`${Endpoints.ORDERS}/${orderId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateOrder(order: Order) {
    return this.http.patch<ResponseData>(`${Endpoints.ORDERS}/${order.id}`, order).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateOrderItems(order: Order, orderItems: OrderItem[]) {
    return this.http.patch<ResponseData>(Endpoints.ORDER_ITEMS.replace(":orderId", order.id), orderItems).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createOrderDelivery(order: Order, orderDeliveryAgent: OrderDeliveryAgent) {
    return this.http.post<ResponseData>(Endpoints.ORDER_DELIVERIES.replace(":orderId", order.id), orderDeliveryAgent)
      .pipe(catchError(this.httpErrorHandler.handleError).bind(this))
  }

  updateOrderDelivery(order: Order, orderDeliveryAgent: OrderDeliveryAgent) {
    return this.http.patch(`${Endpoints.ORDER_DELIVERIES.replace(":orderId", order.id)}/${orderDeliveryAgent.id}`,
      orderDeliveryAgent).pipe(
        catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
