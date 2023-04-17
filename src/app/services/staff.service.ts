import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {Staff} from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getStaffList(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.STAFF, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getStaffMember(staffId: string) {
    return this.http.get<ResponseData>(`${Endpoints.STAFF}/${staffId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createStaffMember(staff: Staff) {
    return this.http.post<ResponseData>(Endpoints.STAFF, staff).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateStaffMember(staff: Staff) {
    return this.http.patch<ResponseData>(`${Endpoints.STAFF}/${staff.id}`, staff).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteStaffMember(staffId: string, staffFirstName: string) {
    return this.http.request("delete", `${Endpoints.STAFF}/${staffId}`, {
      body: {
        first_name: staffFirstName
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
