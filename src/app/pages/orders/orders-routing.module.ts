import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListOrdersComponent} from './list-orders/list-orders.component';
import {OrderListByStatusResolver, OrderListResolver, OrderMetricsResolver} from './resolvers/order.resolver';
import {OrderStatus} from '../../models/order.model';
import {AppPages} from '../../config/app.pages';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListOrdersComponent,
    data: {
      orderStatuses: null,
      pageTitle: 'All Orders'
    },
    resolve: {
      orders: OrderListResolver,
      orderMetrics: OrderMetricsResolver
    }
  },
  {
    path: 'new',
    component: ListOrdersComponent,
    data: {
      orderStatuses: [OrderStatus.PLACED],
      pageTitle: 'New Orders'
    },
    resolve: {
      orders: OrderListByStatusResolver,
      orderMetrics: OrderMetricsResolver
    }
  },
  {
    path: 'confirmed',
    component: ListOrdersComponent,
    data: {
      orderStatuses: [OrderStatus.CONFIRMED],
      pageTitle: 'Confirmed Orders'
    },
    resolve: {
      orders: OrderListByStatusResolver,
      orderMetrics: OrderMetricsResolver
    }
  },
  {
    path: 'in-transit',
    component: ListOrdersComponent,
    data: {
      orderStatuses: [OrderStatus.IN_TRANSIT],
      pageTitle: 'In-Transit Orders'
    },
    resolve: {
      orders: OrderListByStatusResolver,
      orderMetrics: OrderMetricsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
