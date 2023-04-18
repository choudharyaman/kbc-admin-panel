import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCustomersComponent} from './list-customers/list-customers.component';
import {
  CustomerListResolver,
  CustomerMetricsResolver,
  CustomerOrderListResolver,
  CustomerResolver
} from './resolvers/customer.resolver';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListCustomersComponent,
    resolve: {
      metrics: CustomerMetricsResolver,
      customers: CustomerListResolver
    }
  },
  {
    path: ':customerId',
    component: CustomerDetailComponent,
    resolve: {
      customer: CustomerResolver,
      orders: CustomerOrderListResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
