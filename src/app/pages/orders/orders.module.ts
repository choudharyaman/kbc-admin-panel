import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListOrdersComponent } from './list-orders/list-orders.component';


@NgModule({
  declarations: [
    ListOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
