import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {catchError} from 'rxjs/operators';
import {Endpoints} from '../config/endpoints';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {DeliveryPerson} from '../models/delivery-agent.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getDeliveryPersons(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.DELIVERY_PERSONS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAllActiveDeliveryPerson() {
    let qParam = new HttpParams();
    qParam = qParam.set("is_active", "true");

    return this.http.get<ResponseData>(Endpoints.DELIVERY_PERSONS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getDeliveryPerson(deliveryPersonId: string) {
    return this.http.get<ResponseData>(`${Endpoints.DELIVERY_PERSONS}/${deliveryPersonId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createDeliveryPerson(deliveryPerson: DeliveryPerson) {
    return this.http.post<ResponseData>(Endpoints.DELIVERY_PERSONS, deliveryPerson).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateDeliveryPerson(deliveryPerson: DeliveryPerson) {
    return this.http.patch<ResponseData>(`${Endpoints.DELIVERY_PERSONS}/${deliveryPerson.id}`, deliveryPerson).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteDeliveryPerson(deliveryPerson: DeliveryPerson) {
    return this.http.request("delete", `${Endpoints.DELIVERY_PERSONS}/${deliveryPerson.id}`, {
      body: {
        first_name: deliveryPerson.first_name
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

}
