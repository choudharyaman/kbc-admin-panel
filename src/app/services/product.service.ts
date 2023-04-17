import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpErrorHandlerService} from './http-error-handler.service';
import {Endpoints} from '../config/endpoints';
import {catchError} from 'rxjs/operators';
import {QueryParamsMeta, ResponseData} from '../models/paginator.model';
import {Product, ProductCategory} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandlerService) { }

  getProductMetrics() {
    return this.http.get<ResponseData>(Endpoints.PRODUCT_METRICS).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getProducts(query: QueryParamsMeta) {
    let qParam = new HttpParams();

    if (query.filters) {
      query.filters.forEach(filter => {
        qParam = qParam.set(filter.name, filter.value);
      });
    }
    if (query.order_by) {
      qParam = qParam.set('ordering', query.order_by.join(','));
    }
    if (query.page) {
      qParam = qParam.set('page', query.page);
    }
    if (query.page_size) {
      qParam = qParam.set('page_size', query.page_size);
    }
    if (query.search) {
      qParam = qParam.set('search', query.search);
    }

    return this.http.get(Endpoints.PRODUCTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getProductsByCategory(categoryId: string, query: QueryParamsMeta) {
    let qParam = new HttpParams();

    qParam = qParam.set("categories", categoryId);

    if (query.filters) {
      query.filters.forEach(filter => {
        qParam = qParam.set(filter.name, filter.value);
      });
    }
    if (query.order_by) {
      qParam = qParam.set('ordering', query.order_by.join(','));
    }
    if (query.page) {
      qParam = qParam.set('page', query.page);
    }
    if (query.page_size) {
      qParam = qParam.set('page_size', query.page_size);
    }
    if (query.search) {
      qParam = qParam.set('search', query.search);
    }

    this.http.get(Endpoints.PRODUCTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  searchActiveProducts(query: QueryParamsMeta) {
    let qParam = new HttpParams();

    qParam = qParam.set('is_active', 'true');

    if (query.filters) {
      query.filters.forEach(filter => {
        qParam = qParam.set(filter.name, filter.value);
      });
    }
    if (query.order_by) {
      qParam = qParam.set('ordering', query.order_by.join(','));
    }
    if (query.page) {
      qParam = qParam.set('page', query.page);
    }
    if (query.page_size) {
      qParam = qParam.set('page_size', query.page_size);
    }
    if (query.search) {
      qParam = qParam.set('search', query.search);
    }

    this.http.get(Endpoints.PRODUCTS, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getProduct(productId: string) {
    return this.http.get<ResponseData>(`${Endpoints.PRODUCTS}/${productId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createProduct(product: Product) {
    return this.http.post<ResponseData>(Endpoints.PRODUCTS, product).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateProduct(product: Product) {
    return this.http.patch<ResponseData>(`${Endpoints.PRODUCTS}/${product.id}`, product).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getProductCategory(productCategoryId: string) {
    return this.http.get<ResponseData>(`${Endpoints.PRODUCT_CATEGORIES}/${productCategoryId}`).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getProductCategories() {
    return this.http.get<ResponseData>(Endpoints.PRODUCT_CATEGORIES).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  getAllActiveProductCategories() {
    let qParam = new HttpParams();
    qParam = qParam.set("is_active", "true");

    return this.http.get<ResponseData>(Endpoints.PRODUCT_CATEGORIES, {
      params: qParam
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  createProductCategory(category: ProductCategory) {
    return this.http.post<ResponseData>(Endpoints.PRODUCT_CATEGORIES, category).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  updateProductCategory(category: ProductCategory) {
    return this.http.patch<ResponseData>(`${Endpoints.PRODUCT_CATEGORIES}/${category.id}`, category).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteProduct(product: Product) {
    return this.http.request("delete", `${Endpoints.PRODUCTS}/${product.id}`, {
      body: {
        name: product.name
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  deleteProductCategory(category: ProductCategory) {
    return this.http.request("delete", `${Endpoints.PRODUCT_CATEGORIES}/${category.id}`, {
      body: {
        name: category.name
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  addProductToCategory(category: ProductCategory, product: Product) {
    return this.http.post<ResponseData>(
      Endpoints.CATEGORY_LINKED_PRODUCTS.replace(":productCategoryId", category.id), {
        product_id: product.id
      }).pipe(
        catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }

  removeProductFromCategory(category: ProductCategory, product: Product) {
    return this.http.request("delete",
      Endpoints.CATEGORY_LINKED_PRODUCTS.replace(":productCategoryId", category.id), {
      body: {
        product_id: product.id
      }
    }).pipe(
      catchError(this.httpErrorHandler.handleError).bind(this)
    )
  }
}
