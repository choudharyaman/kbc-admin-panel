import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {FormControl} from '@angular/forms';
import {Product, ProductCategory} from '../../../models/product.model';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {AppConfig} from '../../../config/app.config';
import Swal from 'sweetalert2';
import {Toast} from '../../../utils/toast';
import {AppPages} from '../../../config/app.pages';
import {
  EditProductCategoryDialogComponent
} from '../edit-product-category-dialog/edit-product-category-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-product-category-detail',
  templateUrl: './product-category-detail.component.html',
  styleUrls: ['./product-category-detail.component.scss']
})
export class ProductCategoryDetailComponent {
  appConfig = AppConfig;
  appPages = AppPages;

  productCategory: ProductCategory;
  productCategories: ProductCategory[];

  filteredProducts: Product[] | undefined;

  tableDataSource: MatTableDataSource<Product[]> | [] = [];
  tableColumns = ["position", "name", "product_type", "manufacturer", "mrp", "package_size", "is_active", "action"];
  tablePaginatorParams: PaginatorMeta;
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();
  @ViewChild(MatSort) tableSort: MatSort | null = null;

  searchProductInputField: FormControl = new FormControl();

  productCategoryThumbnail = "assets/images/icon-category-default.png";

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService,
              private spinner: NgxSpinnerService, private dialogBox: MatDialog) {

    this.productCategory = this.route.snapshot.data['productCategory'];
    this.productCategories = this.route.snapshot.data['productCategories'];

    this.tablePaginatorParams = this.route.snapshot.data['products'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.tableSort;

    if (this.productCategory.thumbnail_absolute_url) {
      this.productCategoryThumbnail = this.productCategory.thumbnail_absolute_url;
    }
  }

  ngOnInit() {
    this.tableSearchInputEl.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe(changedValue => {
        this.onSearchTable(changedValue);
      });

    this.searchProductInputField.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe((changedValue) => {
        this.filteredProducts = [];
        const searchTerm: string = (changedValue || '').trim().toLowerCase();
        if (searchTerm) {
          const queryParams: QueryParamsMeta = {
            page_size: 50,
            search: searchTerm
          };
          this.productService.searchActiveProducts(queryParams).subscribe(
            res => {
              this.filteredProducts = (res as ResponseData).data.results;
              // const relatedProductIds = this.relatedProducts.map(rp => rp.id);
              // this.filteredProducts = this.filteredProducts?.filter(fp => !relatedProductIds.includes(fp.id));
              // console.log("relatedProductIds", relatedProductIds);
              console.log("this.filteredProducts", this.filteredProducts);
            }
          );
        }
      });
  }

  onAddNewProduct(product: Product) {
    this.searchProductInputField.patchValue(null);

    Swal.fire({
      title: "Add Product",
      icon: "question",
      html: `Add product <code>${product.name}</code> to category <code>${this.productCategory.name}</code>?`,
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: AppConfig.COLORS.PRIMARY
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.addProductToCategory(this.productCategory, product).subscribe(
        res => {
          this.fetchProducts(this.getQueryParams());
          Toast.fire({
            icon: "success",
            text: "Product added to category successfully"
          })
        },
        error => {
          Toast.fire({
            icon: "error",
            html: 'Error while adding product to category'
          })
        });
      }
    });
  }

  onRemoveProduct(product: Product) {
    Swal.fire({
      title: "Remove Product",
      icon: "question",
      html: `Remove product <code>${product.name}</code> from category <code>${this.productCategory.name}</code>?`,
      showCancelButton: true,
      confirmButtonText: "Delete!",
      confirmButtonColor: AppConfig.COLORS.DANGER
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.removeProductFromCategory(this.productCategory, product).subscribe(
        res => {
          this.fetchProducts(this.getQueryParams());
          Toast.fire({
            icon: "success",
            text: "Product removed from the category successfully"
          })
        },
        error => {
          Swal.fire({
            icon: "error",
            html: 'Error while removing product from category'
          })
        })
      }
    });
  }

  onEditCategory() {
    const availableCategories$ = this.productCategories.filter(cat => cat.parent_category == null && cat.id !== this.productCategory.id);
    this.dialogBox.open(EditProductCategoryDialogComponent, {
      width: "600px",
      disableClose: true,
      data: {
        edit: true,
        category: this.productCategory,
        availableCategories: availableCategories$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.fetchProductCategory();
        location.reload();
      }
    })
  }

  onDeleteCategory() {
    Swal.fire({
      title: `Delete Category - ${this.productCategory.name}?`,
      icon: "question",
      html: `To confirm this action, please type <b><code>${this.productCategory.name}</code></b>`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: inputValue => {
        if (inputValue !== '' && inputValue === this.productCategory.name) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct category name");
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");
        this.productService.deleteProductCategory(this.productCategory).subscribe(e => {
          this.spinner.hide("deletingSpinner");

          Toast.fire({
            icon: "success",
            text: "Product category deleted: " + this.productCategory.name,
          });

          history.back();
        },
        error => {
          this.spinner.hide("deletingSpinner");
          console.log('err', error);
          if (error.status === 400) {
            Toast.fire({
              icon: "warning",
              text: "Cannot delete this record because it is referenced by other records",
              position: "center"
            });
          } else {
            Toast.fire({
              icon: "error",
              text: "Error while deleting record: Code - " + error.message,
            })
          }
        });
      }
    })
  }

  onSearchTable(searchTerm: string): void {
    searchTerm = searchTerm?.trim()?.toLowerCase() ?? null;
    console.log('searchTerm', searchTerm);
    if (this.tableSearchTerm === searchTerm) {
      return;
    }
    this.tableSearchTerm = searchTerm;

    const query = this.getQueryParams();

    // get products
    this.fetchProducts(query);
  }

  onChangeTablePage($event: any): void {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    // get products
    this.fetchProducts(query);
  }

  getQueryParams() {
    const query: QueryParamsMeta = {};

    if (this.tableSearchTerm) {
      query.search = this.tableSearchTerm
    }
    // page
    query.page = 1;
    query.page_size = this.appConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return query;
  }


  fetchProducts(query: QueryParamsMeta): void {
    this.productService.getProductsByCategory(this.productCategory.id, query).subscribe(
      res => {
        this.tablePaginatorParams = ((res as ResponseData).data as PaginatorMeta);
        this.tablePaginatorParams.current_page --;

        this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
        this.tableDataSource.sort = this.tableSort;
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error occurred while fetching products'
        });
      }
    );
  }

  fetchProductCategory() {
    this.spinner.show('loadingSpinner');
    this.productService.getProductCategory(this.productCategory.id).subscribe(res => {
      this.spinner.hide('loadingSpinner');
      this.productCategory = (res as ResponseData).data
    },
    error => {
      this.spinner.hide('loadingSpinner');
      Toast.fire({
        icon: 'error',
        text: 'Error while fetching object'
      })
    });
  }
}
