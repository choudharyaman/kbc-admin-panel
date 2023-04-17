import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ListProductCategoriesComponent } from './list-product-categories/list-product-categories.component';
import { EditProductCategoryDialogComponent } from './edit-product-category-dialog/edit-product-category-dialog.component';


@NgModule({
  declarations: [
    ListProductsComponent,
    ListProductCategoriesComponent,
    EditProductCategoryDialogComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
