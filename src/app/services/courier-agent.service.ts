import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {catchError} from 'rxjs/operators';
import {Endpoints} from '../config/endpoints';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {CourierAgent} from '../models/delivery-agent.model';

@Injectable({
  providedIn: 'root'
})
export class CourierAgentService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getCourierAgents(query: QueryParamsMeta) {
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

    return this.http.get<ResponseData>(Endpoints.COURIER_AGENTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAllActiveCourierAgents() {
    let qParam = new HttpParams();
    qParam = qParam.set("is_active", "true");

    this.http.get<ResponseData>(Endpoints.COURIER_AGENTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getCourierAgent(agentId: string) {
    return this.http.get<ResponseData>(`${Endpoints.COURIER_AGENTS}/${agentId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createCourierAgent(agent: CourierAgent) {
    return this.http.post<ResponseData>(Endpoints.COURIER_AGENTS, agent).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateCourierAgent(agent: CourierAgent) {
    return this.http.patch(`${Endpoints.COURIER_AGENTS}/${agent.id}`, agent).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteCourierAgent(agent: CourierAgent) {
    return this.http.request("delete", `${Endpoints.COURIER_AGENTS}/${agent.id}`, {
      body: {
        courier_agent_name: agent.courier_agent_name
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

}
