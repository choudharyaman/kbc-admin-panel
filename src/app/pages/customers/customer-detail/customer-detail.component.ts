import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {PaginatorMeta, ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';
import {User} from '../../../models/user.model';
import {AppConfig} from '../../../config/app.config';
import {Customer} from '../../../models/customer.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../services/customer.service';
import {MatDialog} from '@angular/material/dialog';
import {
  ListUserActivitiesDialogComponent
} from '../../../shared/components/users/list-user-activities-dialog/list-user-activities-dialog.component';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent {
  customerId: string;
  customer: Customer;
  orders: PaginatorMeta;

  constructor(private route: ActivatedRoute, private router: Router, private customerService: CustomerService,
              public dialog: MatDialog, private userService: UserService) {
    this.customerId = this.route.snapshot.params['customerId'];
    this.customer = this.route.snapshot.data['customer'];
    this.orders = this.route.snapshot.data['orders'];

    console.log('this.customerId', this.customerId);
    console.log('this.customer', this.customer);
    console.log('this.orders', this.orders);
  }

  ngOnInit(): void {
  }

  /* Block or Unblock User */
  onBlockUser(doBlock: boolean, user: User): void {
    console.log(doBlock);
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
              // Reload Customer
              this.fetchCustomer();
            },
            err => {
              Toast.fire({
                icon: 'error',
                text: `Error while blocking User: ${err.message}`,
              });
            }
          );
        } else {
          // user.is_blocked = !user.is_active;
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
              // Reload Customer
              this.fetchCustomer();
            },
            err => {
              Toast.fire({
                icon: 'error',
                text: `Error while unblocking User: ${err.message}`,
              });
            }
          );
        } else {
          // user.is_blocked = !user.is_active;
        }
      });
    }
  }

  /* Open User Activities */
  onOpenUserActivities(): void {
    const dialogRef = this.dialog.open(ListUserActivitiesDialogComponent, {
      width: '100px',
      disableClose: true,
      data: {user: this.customer.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('User Activities Dialog Closed');
    });
  }

  /* fetch Customer */
  fetchCustomer() {
    this.customerService.getCustomer(this.customer.id).subscribe(
      res => {
        this.customer = (res as ResponseData).data;
      }
    )
  }
}
