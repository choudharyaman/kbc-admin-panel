import {Component, ViewChild} from '@angular/core';
import {AppConfig} from '../../../config/app.config';
import {MatTableDataSource} from '@angular/material/table';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../services/customer.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Toast} from '../../../utils/toast';
import {Customer, CustomerMetrics} from '../../../models/customer.model';
import {AppPages} from '../../../config/app.pages';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent {
  metrics: CustomerMetrics;

  appConfig = AppConfig;
  appPages = AppPages;

  // Customer DataTable
  tableDataSource: MatTableDataSource<Customer[]> | [] = [];
  tableColumns = ['position', 'first_name', 'gender', 'phone_number', 'email', 'is_registered', 'created_at'];
  tablePaginatorParams: PaginatorMeta;

  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatPaginator) tablePaginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // @ViewChild('tableSearchInputEl') tableSearchInputEl: ElementRef | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private customerService: CustomerService) {
    this.metrics = this.route.snapshot.data['metrics'];

    this.tablePaginatorParams = this.route.snapshot.data['customers'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.sort;
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

    // get customers
    this.fetchCustomers(query);
  }

  onChangeTablePage($event: any): void {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    // get customers
    this.fetchCustomers(query);
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

  fetchCustomers(query: QueryParamsMeta): void {
    this.customerService.getCustomers(query).subscribe(
      res => {
        this.tablePaginatorParams = ((res as ResponseData).data as PaginatorMeta);
        this.tablePaginatorParams.current_page = this.tablePaginatorParams.current_page - 1;

        this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
        this.tableDataSource.sort = this.sort;
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error occurred while fetching customers'
        });
      }
    );
  }
}
