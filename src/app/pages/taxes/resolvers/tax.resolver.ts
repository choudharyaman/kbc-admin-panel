import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {TaxService} from '../../../services/tax.service';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class TaxListResolver implements Resolve<boolean> {
  constructor(private service: TaxService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return this.service.getTaxes(query).pipe(
      map(res => { return (res as ResponseData).data })
    )
  }
}
