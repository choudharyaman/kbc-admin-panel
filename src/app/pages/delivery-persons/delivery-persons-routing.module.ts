import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListDeliveryPersonsComponent} from './list-delivery-persons/list-delivery-persons.component';
import {DeliveryPersonListResolver} from './resolvers/delivery-person.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListDeliveryPersonsComponent,
    resolve: {
      deliveryPersons: DeliveryPersonListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryPersonsRoutingModule { }
