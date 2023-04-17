import {Component, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {Tax} from '../../../models/tax.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TaxService} from '../../../services/tax.service';
import {AppConfig} from '../../../config/app.config';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {Toast} from '../../../utils/toast';
import {EditTaxDialogComponent} from '../edit-tax-dialog/edit-tax-dialog.component';

@Component({
  selector: 'app-list-taxes',
  templateUrl: './list-taxes.component.html',
  styleUrls: ['./list-taxes.component.scss']
})
export class ListTaxesComponent {
  appConfig = AppConfig;

  tableDataSource: MatTableDataSource<Tax[]> | [] = [];
  tableColumns = ["position", "title", "description", "tax", "is_active", "created_at", "action"]
  tablePaginatorParams: PaginatorMeta;
  tablePageSizeOptions = AppConfig.PAGINATION.PAGE_SIZE_OPTIONS
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) tableSort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService,
              private dialogBox: MatDialog, private taxService: TaxService) {

    this.tablePaginatorParams = this.route.snapshot.data['taxes'];
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

  onAddTax() {
    this.dialogBox.open(EditTaxDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: false
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchTaxes(this.getQueryParams());
      }
    })
  }

  onEditTax(tax$: Tax) {
    this.dialogBox.open(EditTaxDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: true,
        tax: tax$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchTaxes(this.getQueryParams());
      }
    })
  }

  onDeleteTax(tax: Tax) {
    Swal.fire({
      title: `Delete tax record: ${tax.title}?`,
      icon: "question",
      html: `To confirm this action, please type <b><code>${tax.title}</code></b>`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: inputValue => {
        if (inputValue !== "" && inputValue === tax.title) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct tax title")
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");
      }
      this.taxService.deleteTax(tax).subscribe(res => {
        this.spinner.hide("deletingSpinner");
        Swal.fire({
          icon: "success",
          text: "Tax record deleted: " + tax.title,
        });
        // reload taxes
        this.fetchTaxes(this.getQueryParams());
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

    this.fetchTaxes(query);
  }

  onTablePageChange($event: any) {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    this.fetchTaxes(query);
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

  fetchTaxes(query: QueryParamsMeta) {
    this.taxService.getTaxes(query).subscribe(res => {
      this.tablePaginatorParams = (res as ResponseData).data;
      this.tablePaginatorParams.current_page --;

      this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
      this.tableDataSource.sort = this.tableSort;
    }, t => {
      Swal.fire({
        icon: "error",
        html: '<div class="text-danger">Error while fetching data</div>',
        position: "top-end",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS
      })
    })
  }
}
