import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxesRoutingModule } from './taxes-routing.module';
import { ListTaxesComponent } from './list-taxes/list-taxes.component';
import { EditTaxDialogComponent } from './edit-tax-dialog/edit-tax-dialog.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    ListTaxesComponent,
    EditTaxDialogComponent
  ],
  imports: [
    CommonModule,
    TaxesRoutingModule,
    SharedModule
  ]
})
export class TaxesModule { }
