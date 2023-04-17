import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';
import {DeliveryPersonService} from '../../../services/delivery-person.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonListResolver implements Resolve<boolean> {
  constructor(private service: DeliveryPersonService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return this.service.getDeliveryPersons(query).pipe(
      map(res => { return (res as ResponseData).data })
    )
  }
}
