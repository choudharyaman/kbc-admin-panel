import {Component, ViewChild} from '@angular/core';
import {AppConfig} from '../../../config/app.config';
import {MatTableDataSource} from '@angular/material/table';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import Swal from 'sweetalert2';
import {Toast} from '../../../utils/toast';
import {Discount, DiscountType} from '../../../models/discount.model';
import {DiscountService} from '../../../services/discount.service';
import {EditDiscountDialogComponent} from '../edit-discount-dialog/edit-discount-dialog.component';

@Component({
  selector: 'app-list-discounts',
  templateUrl: './list-discounts.component.html',
  styleUrls: ['./list-discounts.component.scss']
})
export class ListDiscountsComponent {
  appConfig = AppConfig;
  discountTypes = DiscountType;

  tableDataSource: MatTableDataSource<Discount[]> | [] = [];
  tableColumns = ["position", "title", "description", "discount_amount", "is_active", "created_at", "action"]
  tablePaginatorParams: PaginatorMeta;
  tablePageSizeOptions = AppConfig.PAGINATION.PAGE_SIZE_OPTIONS
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) tableSort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService,
              private dialogBox: MatDialog, private discountService: DiscountService) {

    this.tablePaginatorParams = this.route.snapshot.data['discounts'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.tableSort;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.tableSearchInputEl.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe(changedValue => {
        this.onSearchTable(changedValue);
      });
  }

  onAddDiscount() {
    this.dialogBox.open(EditDiscountDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: false
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchDiscounts(this.getQueryParams());
      }
    })
  }

  onEditDiscount(discount$: Discount) {
    this.dialogBox.open(EditDiscountDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: true,
        discount: discount$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchDiscounts(this.getQueryParams());
      }
    })
  }

  onDeleteDiscount(discount$: Discount) {
    Swal.fire({
      title: `Delete discount record: ${discount$.title}?`,
      icon: "question",
      html: `To confirm this action, please type <b><code>${discount$.title}</code></b>`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: inputValue => {
        if (inputValue !== "" && inputValue === discount$.title) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct discount title")
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");
        this.discountService.deleteDiscount(discount$).subscribe(res => {
          this.spinner.hide("deletingSpinner");
          Swal.fire({
            icon: "success",
            text: "Discount deleted: " + discount$.title,
          });
          // reload discounts
          this.fetchDiscounts(this.getQueryParams());
        }, error => {
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
        })
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

    this.fetchDiscounts(query);
  }

  onTablePageChange($event: any) {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    this.fetchDiscounts(query);
  }

  getQueryParams() {
    const query: QueryParamsMeta = {};

    if (this.tableSearchTerm) {
      query.search = this.tableSearchTerm
    }

    // page
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return query;
  }

  fetchDiscounts(query: QueryParamsMeta) {
    this.discountService.getDiscounts(query).subscribe(res => {
      this.tablePaginatorParams = (res as ResponseData).data;
      this.tablePaginatorParams.current_page --;

      this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
      this.tableDataSource.sort = this.tableSort;
    },
    error => {
      Swal.fire({
        icon: "error",
        html: '<div class="text-danger">Error while fetching data</div>',
        position: "top-end",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS
      })
    });
  }
}
