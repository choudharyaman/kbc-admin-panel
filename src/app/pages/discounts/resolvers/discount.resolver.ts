import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';
import {DiscountService} from '../../../services/discount.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountListResolver implements Resolve<boolean> {
  constructor(private service: DiscountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return this.service.getDiscounts(query).pipe(
      map(res => { return (res as ResponseData).data })
    )
  }
}
