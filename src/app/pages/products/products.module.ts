import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ListProductCategoriesComponent } from './list-product-categories/list-product-categories.component';
import { EditProductCategoryDialogComponent } from './edit-product-category-dialog/edit-product-category-dialog.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { ProductCategoryDetailComponent } from './product-category-detail/product-category-detail.component';
import { ProductImageUploadDialogComponent } from './edit-product/product-image-upload-dialog/product-image-upload-dialog.component';


@NgModule({
  declarations: [
    ListProductsComponent,
    ListProductCategoriesComponent,
    EditProductCategoryDialogComponent,
    EditProductComponent,
    ProductCategoryDetailComponent,
    ProductImageUploadDialogComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    AngularEditorModule
  ]
})
export class ProductsModule { }
