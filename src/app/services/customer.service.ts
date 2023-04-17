import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  public getCustomerMetrics() {
    return this.http.get<ResponseData>(Endpoints.CUSTOMER_METRICS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  public getCustomers(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.CUSTOMERS, {
      params: qParam
    }).pipe(catchError(this.httpErrorHandler.handleError).bind(this))
  }

  public getCustomer(customerId: string) {
    return this.http.get<ResponseData>(`${Endpoints.CUSTOMERS}/${customerId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
