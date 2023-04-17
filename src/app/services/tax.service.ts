import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {Tax} from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getTaxes(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.TAXES, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getActiveTaxes() {
    let qParam = new HttpParams();
    qParam = qParam.set("is_active", "true");

    this.http.get<ResponseData>(Endpoints.TAXES, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createTax(tax: Tax) {
    return this.http.post<ResponseData>(Endpoints.TAXES, tax).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateTax(tax: Tax) {
    return this.http.patch<ResponseData>(`${Endpoints.TAXES}/${tax.id}`, tax).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteTax(tax: Tax) {
    return this.http.request("delete", `${Endpoints.TAXES}/${tax.id}`, {
      body: {
        title: tax.title
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
