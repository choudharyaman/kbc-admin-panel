import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DeliveryAgentAssignDialogComponent } from './delivery-agent-assign-dialog/delivery-agent-assign-dialog.component';
import { EditOrderItemsDialogComponent } from './edit-order-items-dialog/edit-order-items-dialog.component';


@NgModule({
  declarations: [
    ListOrdersComponent,
    OrderDetailComponent,
    DeliveryAgentAssignDialogComponent,
    EditOrderItemsDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
