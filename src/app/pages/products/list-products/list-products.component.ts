import {Component, ViewChild} from '@angular/core';
import {AppConfig} from '../../../config/app.config';
import {AppPages} from '../../../config/app.pages';
import {MatTableDataSource} from '@angular/material/table';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Toast} from '../../../utils/toast';
import {ProductService} from '../../../services/product.service';
import {Product, ProductMetrics} from '../../../models/product.model';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent {
  pageTitle: string = 'All Products';

  appConfig = AppConfig;
  appPages = AppPages;

  productMetrics: ProductMetrics;

  // Product DataTable
  tableDataSource: MatTableDataSource<Product[]> | [] = [];
  tableColumns = ['position', 'name', 'product_type', 'manufacturer', 'mrp', 'package_size', 'tax', 'discount',
    'is_active', 'created_at'];
  tablePaginatorParams: PaginatorMeta;
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) tableSort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private service: ProductService) {
    this.productMetrics = this.route.snapshot.data['productMetrics'];

    this.tablePaginatorParams = this.route.snapshot.data['products'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.tableSort;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.tableSearchInputEl.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe(changedValue => {
        this.onSearchTable(changedValue);
      });
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
    this.service.getProducts(query).subscribe(
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
}
