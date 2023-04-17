import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {
  DashboardCustomerMetricsResolver,
  DashboardOrderMetricsResolver,
  DashboardProductMetricsResolver
} from './resolvers/dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      orderMetrics: DashboardOrderMetricsResolver,
      customerMetrics: DashboardCustomerMetricsResolver,
      productMetrics: DashboardProductMetricsResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
