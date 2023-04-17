import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListProductsComponent} from './list-products/list-products.component';
import {ProductCategoryListResolver, ProductListResolver, ProductMetricsResolver} from './resolvers/product.resolver';
import {ListProductCategoriesComponent} from './list-product-categories/list-product-categories.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListProductsComponent,
    resolve: {
      productMetrics: ProductMetricsResolver,
      products: ProductListResolver
    }
  },
  {
    path: 'categories',
    component: ListProductCategoriesComponent,
    resolve: {
      productCategories: ProductCategoryListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
