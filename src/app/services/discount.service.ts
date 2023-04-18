import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {catchError} from 'rxjs/operators';
import {Discount} from '../models/discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getDiscounts(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.DISCOUNTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getActiveDiscounts() {
    let qParam = new HttpParams();
    qParam = qParam.set("is_active", "true");

    return this.http.get<ResponseData>(Endpoints.DISCOUNTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createDiscount(discount: Discount) {
    return this.http.post<ResponseData>(Endpoints.DISCOUNTS, discount).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateDiscount(discount: Discount) {
    return this.http.patch<ResponseData>(`${Endpoints.DISCOUNTS}/${discount.id}`, discount).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteDiscount(discount: Discount) {
    return this.http.request("delete", `${Endpoints.DISCOUNTS}/${discount.id}`, {
      body: {
        title: discount.title
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
