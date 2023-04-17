import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';
import {CourierAgentService} from '../../../services/courier-agent.service';

@Injectable({
  providedIn: 'root'
})
export class CourierAgentListResolver implements Resolve<boolean> {
  constructor(private service: CourierAgentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return this.service.getCourierAgents(query).pipe(
      map(res => { return (res as ResponseData).data })
    )
  }
}
