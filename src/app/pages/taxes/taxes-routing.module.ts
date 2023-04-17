import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListTaxesComponent} from './list-taxes/list-taxes.component';
import {TaxListResolver} from './resolvers/tax.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListTaxesComponent,
    resolve: {
      taxes: TaxListResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }
