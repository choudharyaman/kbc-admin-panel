import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountsRoutingModule } from './discounts-routing.module';
import { EditDiscountDialogComponent } from './edit-discount-dialog/edit-discount-dialog.component';
import { ListDiscountsComponent } from './list-discounts/list-discounts.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    EditDiscountDialogComponent,
    ListDiscountsComponent
  ],
  imports: [
    CommonModule,
    DiscountsRoutingModule,
    SharedModule
  ]
})
export class DiscountsModule { }
