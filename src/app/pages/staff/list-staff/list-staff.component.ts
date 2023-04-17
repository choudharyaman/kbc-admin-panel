import {Component, OnInit, ViewChild} from '@angular/core';
import {AppConfig} from "../../../config/app.config";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../../models/customer.model";
import {PaginatorMeta, QueryParamsMeta, ResponseData} from "../../../models/paginator.model";
import {FormControl} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Toast} from "../../../utils/toast";
import {StaffService} from "../../../services/staff.service";
import Swal from "sweetalert2";
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {EditStaffComponent} from "../edit-staff/edit-staff.component";
import {Staff} from "../../../models/staff.model";
import {
  ChangeUserPasswordDialogComponent
} from "../../../shared/components/users/change-user-password-dialog/change-user-password-dialog.component";
import {
  ListUserActivitiesDialogComponent
} from "../../../shared/components/users/list-user-activities-dialog/list-user-activities-dialog.component";

@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.scss']
})
export class ListStaffComponent implements OnInit {

  appConfig = AppConfig;

  // Customer DataTable
  tableDataSource: MatTableDataSource<Staff[]> | [] = [];
  tableColumns = ['position', 'role', 'employee_code', 'name', 'mobile_number', 'email', 'created_at',
    'is_blocked', 'action'];
  tablePaginatorParams: PaginatorMeta;

  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  @ViewChild(MatPaginator) tablePaginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private staffService: StaffService,
              private userService: UserService, public dialog: MatDialog) {
    this.tablePaginatorParams = this.route.snapshot.data['staff'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.sort;

    console.log('this.tablePaginatorParams', this.tablePaginatorParams.results)
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

  /* Edit Staff */
  onEditStaff(staff$: Staff): void {
    const dialogRef = this.dialog.open(EditStaffComponent, {
      width: '500px',
      disableClose: true,
      data: {edit: true, staff: staff$}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const query: QueryParamsMeta = {};
        query.page = 1;
        query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;
        this.fetchStaffMembers(query);
      }
    });
  }

  /* Add New Staff */
  onNewStaffUser(): void {
    const dialogRef = this.dialog.open(EditStaffComponent, {
      width: '500px',
      disableClose: true,
      data: {edit: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const query: QueryParamsMeta = {};
        query.page = 1;
        query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;
        this.fetchStaffMembers(query);
      }
    });
  }

  /* On Delete Staff */
  onDeleteStaff(staff$: Staff): void {
    Swal.fire({
      title: `Delete Staff Member: ${staff$.first_name} (${staff$.employee_code})?`,
      icon: 'question',
      html: `To confirm this action, please type <code>${staff$.first_name}</code>`,
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: (inputValue) => {
        if (inputValue === '' || inputValue !== staff$.first_name) {
          Swal.showValidationMessage(
            `Please type correct first name of staff member`
          );
        } else {
          return inputValue;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffService.deleteStaffMember(staff$.id, result.value).subscribe(
          res => {
            Toast.fire({
              icon: 'success',
              text: `Staff Deleted: ${staff$.first_name} (${staff$.employee_code})`
            });

            const query: QueryParamsMeta = {};
            query.page = 1;
            query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;
            this.fetchStaffMembers(query);
          },
          err => {
            console.log(err);
            Toast.fire({
              icon: 'error',
              text: `Error while deleting staff: Code - ${err.status}`,
            });
          }
        );
      }
    });
  }

  /* Change Password */
  onChangePassword(staff$: Staff): void {
    const dialogRef = this.dialog.open(ChangeUserPasswordDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {user: staff$.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Password Change Dialog Closed');
    });
  }

  /* Block or Unblock User */
  onBlockUser(doBlock: boolean, user: User): void {
    console.log('user', user);
    console.log('doBlock', doBlock);
    if (doBlock) {
      // Blocking User:
      Swal.fire({
        icon: 'question',
        title: `Block User: ${user.username}`,
        text: 'Enter the reason to block',
        input: "textarea",
        inputAutoTrim: true,
        inputPlaceholder: 'Blocking Reason',
        inputAttributes: {
          rows: '2',
          required: 'required',
          maxlength: "95",
          autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Block User!',
        confirmButtonColor: AppConfig.COLORS.DANGER,

        preConfirm: inputValue => {
          if (inputValue !== "" && inputValue !== null) {
            return inputValue;
          } else {
            Swal.showValidationMessage("Please enter reason to block this user.");
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          user.is_active = false;
          user.blocked_remark = result.value;
          const userData = {id: user.id, is_active: user.is_active, blocked_remark: user.blocked_remark};
          this.userService.updateUser(userData as User).subscribe(
            res => {
              Toast.fire({
                icon: 'success',
                text: `User Blocked: ${user.username}`
              });
            },
            err => {
              Toast.fire({
                icon: 'error',
                text: `Error while blocking User: ${err.message}`,
              });
            }
          );
        } else {
          user.is_blocked = !user.is_active;
        }
      });
    } else {
      // Unblocking User
      Swal.fire({
        icon: 'question',
        title: `Unblock User: ${user.username}`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Unblock User!',
        confirmButtonColor: AppConfig.COLORS.PRIMARY,
      }).then((result) => {
        if (result.isConfirmed) {
          user.is_active = true;
          user.blocked_remark = '';
          const userData = {id: user.id, is_active: user.is_active, blocked_remark: user.blocked_remark};
          this.userService.updateUser(userData as User).subscribe(
            res => {
              Toast.fire({
                icon: 'success',
                text: `User Unblocked: ${user.username}`,
              });
            },
            err => {
              Toast.fire({
                icon: 'error',
                text: `Error while unblocking User: ${err.message}`,
              });
            }
          );
        } else {
          user.is_blocked = !user.is_active;
        }
      });
    }
  }

  /* Open User Activities */
  onOpenActivities(staff$: Staff): void {
    const dialogRef = this.dialog.open(ListUserActivitiesDialogComponent, {
      width: '100px',
      disableClose: true,
      data: {user: staff$.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('User Activities Dialog Closed');
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
    this.fetchStaffMembers(query);
  }

  onChangeTablePage($event: any): void {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    // get orders
    this.fetchStaffMembers(query);
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

  fetchStaffMembers(query: QueryParamsMeta): void {
    this.staffService.getStaffList(query).subscribe(
      res => {
        this.tablePaginatorParams = ((res as ResponseData).data as PaginatorMeta);
        this.tablePaginatorParams.current_page = this.tablePaginatorParams.current_page - 1;

        this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
        this.tableDataSource.sort = this.sort;
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error occurred while fetching staff'
        });
      }
    );
  }

}
