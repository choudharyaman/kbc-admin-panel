import {Component, Input, ViewChild} from '@angular/core';
import {Order, OrderStatus} from '../../../models/order.model';
import {AppConfig} from '../../../config/app.config';
import {AppPages} from '../../../config/app.pages';
import {MatTableDataSource} from '@angular/material/table';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../services/order.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Toast} from '../../../utils/toast';
import {Customer} from '../../../models/customer.model';

@Component({
  selector: 'app-list-customer-orders',
  templateUrl: './list-customer-orders.component.html',
  styleUrls: ['./list-customer-orders.component.scss']
})
export class ListCustomerOrdersComponent {

  appConfig = AppConfig;
  appPages = AppPages;
  orderStatuses = OrderStatus;

  // Order DataTable
  tableDataSource: MatTableDataSource<Order[]> | [] = [];
  tableColumns = ['position', 'order_number', 'has_prescription_slip', 'order_item_count', 'net_amount', 'status',
    'is_paid', 'created_at'];
  tablePaginatorParams: PaginatorMeta | undefined;
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort | null = null;

  @Input() orders: PaginatorMeta | undefined;
  @Input() customer: Customer | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private service: OrderService) {
  }

  ngOnInit(): void {
    this.tablePaginatorParams = this.orders as PaginatorMeta;
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.sort;
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

    if (this.tableSearchTerm) {
      query.search = this.tableSearchTerm
    }
    // page
    query.page = 1;
    query.page_size = this.appConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return query;
  }

  fetchOrders(query: QueryParamsMeta): void {
    this.service.getOrdersByCustomer((this.customer as Customer).id, query).subscribe(
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
