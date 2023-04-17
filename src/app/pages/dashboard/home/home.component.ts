import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  DashboardCustomerMetricsResolver,
  DashboardOrderMetricsResolver,
  DashboardProductMetricsResolver
} from '../resolvers/dashboard.resolver';
import {OrderMetrics} from '../../../models/order.model';
import {CustomerMetrics} from '../../../models/customer.model';
import {ProductMetrics} from '../../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  orderMetrics: OrderMetrics;
  customerMetrics: CustomerMetrics;
  productMetrics: ProductMetrics;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.orderMetrics = this.route.snapshot.data['orderMetrics'];
    this.customerMetrics = this.route.snapshot.data['customerMetrics'];
    this.productMetrics = this.route.snapshot.data['productMetrics'];
  }
}
