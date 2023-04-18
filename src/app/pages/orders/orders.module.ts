import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { EditOrderDialogComponent } from './edit-order-dialog/edit-order-dialog.component';
import { DeliveryAgentAssignDialogComponent } from './delivery-agent-assign-dialog/delivery-agent-assign-dialog.component';


@NgModule({
  declarations: [
    ListOrdersComponent,
    OrderDetailComponent,
    EditOrderDialogComponent,
    DeliveryAgentAssignDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
