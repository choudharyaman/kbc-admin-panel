import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { ListCustomersComponent } from './list-customers/list-customers.component';
import {SharedModule} from '../../shared/shared.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';


@NgModule({
  declarations: [
    ListCustomersComponent,
    CustomerDetailComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ]
})
export class CustomersModule { }
