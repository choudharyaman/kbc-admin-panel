import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {DeliveryPersonService} from '../../../services/delivery-person.service';
import {MatTableDataSource} from '@angular/material/table';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {DeliveryPerson} from '../../../models/delivery-agent.model';
import Swal from 'sweetalert2';
import {EditDeliveryPersonDialogComponent} from '../edit-delivery-person-dialog/edit-delivery-person-dialog.component';
import {Toast} from '../../../utils/toast';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-list-delivery-persons',
  templateUrl: './list-delivery-persons.component.html',
  styleUrls: ['./list-delivery-persons.component.scss']
})
export class ListDeliveryPersonsComponent {
  appConfig = AppConfig;

  tableDataSource: MatTableDataSource<DeliveryPerson[]> | [] = [];
  tableColumns = ["position", "profile_avatar", "delivery_person_code", "full_name", "phone_number", "email",
    "is_active", "created_at", "action"]
  tablePaginatorParams: PaginatorMeta;
  tablePageSizeOptions = AppConfig.PAGINATION.PAGE_SIZE_OPTIONS
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatSort) tableSort: MatSort | null = null;

  defaultProfileAvatar = "assets/images/icon-profile-avatar-default.png";

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService,
              private dialogBox: MatDialog, private service: DeliveryPersonService) {

    this.tablePaginatorParams = this.route.snapshot.data['deliveryPersons'];
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

  onAddDeliveryPerson() {
    this.dialogBox.open(EditDeliveryPersonDialogComponent, {
      width: "500px",
      disableClose: true,
      data: {
        edit: false
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchDeliveryPersons(this.getQueryParams());
      }
    })
  }

  onEditDeliveryPerson(deliveryPerson$: DeliveryPerson) {
    this.dialogBox.open(EditDeliveryPersonDialogComponent, {
      width: "500px",
      disableClose: true,
      data: {
        edit: true,
        deliveryPerson: deliveryPerson$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchDeliveryPersons(this.getQueryParams());
      }
    })
  }

  onDeleteDeliveryPerson(deliveryPerson$: DeliveryPerson) {
    Swal.fire({
      icon: "question",
      title: `Confirm delete delivery person: ${deliveryPerson$.first_name} (${deliveryPerson$.phone_number})?`,
      html: `Enter <code>${deliveryPerson$.first_name}</code> to delete`,
      input: "text",
      inputPlaceholder: "Delivery Person First Name",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete!",
      confirmButtonColor: AppConfig.COLORS.DANGER,
      inputAttributes: {
        autocapitalize: "off",
        required: "required"
      },
      preConfirm: inputValue => {
        if (inputValue !== "" && inputValue === deliveryPerson$.first_name) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct first name");
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");
        this.service.deleteDeliveryPerson(deliveryPerson$).subscribe(res => {
          this.spinner.hide("deletingSpinner");
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: `Delivery person: ${deliveryPerson$.first_name} (${deliveryPerson$.phone_number}) deleted`,
            timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS
          });
          this.fetchDeliveryPersons(this.getQueryParams());
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

    this.fetchDeliveryPersons(query);
  }

  onTablePageChange($event: any) {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    this.fetchDeliveryPersons(query);
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

  fetchDeliveryPersons(query: QueryParamsMeta) {
    this.service.getDeliveryPersons(query).subscribe(res => {
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
    })
  }
}
