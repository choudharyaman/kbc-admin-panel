import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListProductsComponent} from './list-products/list-products.component';
import {
  ActiveDiscountsResolver, ActiveProductCategoriesResolver,
  ActiveTaxesResolver,
  ProductCategoryListResolver, ProductCategoryResolver, ProductListByCategoryResolver,
  ProductListResolver,
  ProductMetricsResolver,
  ProductResolver
} from './resolvers/product.resolver';
import {ListProductCategoriesComponent} from './list-product-categories/list-product-categories.component';
import {EditProductComponent} from './edit-product/edit-product.component';
import {ProductCategoryDetailComponent} from './product-category-detail/product-category-detail.component';

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
  },
  {
    path: 'categories/:productCategoryId',
    component: ProductCategoryDetailComponent,
    resolve: {
      productCategory: ProductCategoryResolver,
      productCategories: ProductCategoryListResolver,
      products: ProductListByCategoryResolver
    }
  },
  {
    path: ':productId/edit',
    component: EditProductComponent,
    data: {
      isEdit: true,
    },
    resolve: {
      product: ProductResolver,
      allActiveProductCategories: ActiveProductCategoriesResolver,
      allActiveDiscounts: ActiveDiscountsResolver,
      allActiveTaxes: ActiveTaxesResolver
    }
  },
  {
    path: 'new',
    component: EditProductComponent,
    data: {
      isEdit: false,
    },
    resolve: {
      product: ProductResolver,
      allActiveProductCategories: ActiveProductCategoriesResolver,
      allActiveDiscounts: ActiveDiscountsResolver,
      allActiveTaxes: ActiveTaxesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
