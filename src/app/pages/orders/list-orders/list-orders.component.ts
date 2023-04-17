import {Component, ViewChild} from '@angular/core';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {MatTableDataSource} from '@angular/material/table';
import {Toast} from '../../../utils/toast';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {AppConfig} from '../../../config/app.config';
import {MatSort} from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {Order, OrderMetrics, OrderStatus} from '../../../models/order.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../services/order.service';
import {AppPages} from '../../../config/app.pages';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent {
  pageTitle: string = 'Orders';
  selectedOrderStatuses: string[] | [] = [];

  orderMetrics: OrderMetrics | undefined;

  appConfig = AppConfig;
  appPages = AppPages;
  orderStatuses = OrderStatus;

  // Order DataTable
  tableDataSource: MatTableDataSource<Order[]> | [] = [];
  tableColumns = ['position', 'order_number', 'has_prescription_slip', 'order_item_count', 'net_amount', 'status',
    'is_paid', 'paid_at', 'created_at'];
  tablePaginatorParams: PaginatorMeta | undefined;
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private service: OrderService) {
    this.route.data.subscribe(data => {
      this.pageTitle = data['pageTitle'];
      this.selectedOrderStatuses = data['orderStatuses'];

      this.orderMetrics = data['orderMetrics'];

      // Set DataTable
      this.tablePaginatorParams = data['orders'] as PaginatorMeta;
      this.tablePaginatorParams.current_page --;

      this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
      this.tableDataSource.sort = this.sort;

      // console.log('this.tablePaginatorParams', this.tablePaginatorParams);
      // console.log('this.tableDataSource', this.tableDataSource);
    })
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

    // get orders
    this.fetchOrders(query);
  }

  onChangeTablePage($event: any): void {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    // get orders
    this.fetchOrders(query);
  }

  getQueryParams() {
    const query: QueryParamsMeta = {};
    if (this.selectedOrderStatuses) {
      query.filters = [
        {name: 'status__in', value: [this.selectedOrderStatuses].join(',')}
      ]
    }
    if (this.tableSearchTerm) {
      query.search = this.tableSearchTerm
    }
    // page
    query.page = 1;
    query.page_size = this.appConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return query;
  }

  fetchOrders(query: QueryParamsMeta): void {
    this.service.getOrders(query).subscribe(
      res => {
        this.tablePaginatorParams = ((res as ResponseData).data as PaginatorMeta);
        this.tablePaginatorParams.current_page = this.tablePaginatorParams.current_page - 1;

        this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
        this.tableDataSource.sort = this.sort;
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error occurred while fetching orders'
        });
      }
    );
  }
}
