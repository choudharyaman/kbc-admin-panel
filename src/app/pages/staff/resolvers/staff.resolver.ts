import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {StaffService} from "../../../services/staff.service";
import {QueryParamsMeta, ResponseData} from "../../../models/paginator.model";
import {AppConfig} from "../../../config/app.config";

@Injectable({
  providedIn: 'root'
})
export class StaffListResolver implements Resolve<boolean> {
  constructor(private service: StaffService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const query: QueryParamsMeta = {};
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;
    return this.service.getStaffList(query).pipe(
      map(res => { return (res as ResponseData).data })
    );
  }
}
