import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryPersonsRoutingModule } from './delivery-persons-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListDeliveryPersonsComponent } from './list-delivery-persons/list-delivery-persons.component';
import { EditDeliveryPersonDialogComponent } from './edit-delivery-person-dialog/edit-delivery-person-dialog.component';

@NgModule({
  declarations: [
    ListDeliveryPersonsComponent,
    EditDeliveryPersonDialogComponent
  ],
  imports: [
    CommonModule,
    DeliveryPersonsRoutingModule,
    SharedModule
  ]
})
export class DeliveryPersonsModule { }
