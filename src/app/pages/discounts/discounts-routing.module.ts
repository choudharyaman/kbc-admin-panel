import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListDiscountsComponent} from './list-discounts/list-discounts.component';
import {DiscountListResolver} from './resolvers/discount.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListDiscountsComponent,
    resolve: {
      discounts: DiscountListResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule { }
