import {Component, Inject, OnInit} from '@angular/core';
import {Toast} from "../../../../utils/toast";
import {User, UserActivities, UserLoginActivities, UserLoginStatus} from "../../../../models/user.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PaginatorMeta, ResponseData} from "../../../../models/paginator.model";
import {UserService} from '../../../../services/user.service';
import {Customer} from '../../../../models/customer.model';

@Component({
  selector: 'app-list-user-activities-dialog',
  templateUrl: './list-user-activities-dialog.component.html',
  styleUrls: ['./list-user-activities-dialog.component.scss']
})
export class ListUserActivitiesDialogComponent implements OnInit {
  loadingLA = true;
  loadingUA = true;
  progressSpinner = true;

  enableLA = true;
  enableUA = false;

  user: User;
  loginActivities: UserLoginActivities[] | [] = [];
  userActivities: UserActivities[] | [] = [];

  // @ts-ignore
  laPaginator: PaginatorMeta;
  // @ts-ignore
  uaPaginator: PaginatorMeta;

  loginStatuses = UserLoginStatus;
  defaultPageSize = 50;
  constructor(
    public dialogRef: MatDialogRef<ListUserActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService
  ) {
    this.user = data.user;
    console.log('this.user', this.user);
    this.fetchLoginActivities(1, this.defaultPageSize);
    this.fetchUserActivities(1, this.defaultPageSize);
  }

  showActivities(): void {
    if (!this.loadingLA && !this.loadingUA) {
      this.progressSpinner = false;
      this.dialogRef.updateSize('800px');
    }
  }

  ngOnInit(): void {
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  fetchLoginActivities(page: number, pageSize: number): void {
    this.userService.getLoginActivities(this.user.id, page, pageSize).subscribe(
      res => {
        this.laPaginator = (res as ResponseData).data;
        if (this.loginActivities?.length > 0) {
          // @ts-ignore
          this.loginActivities.push(...this.laPaginator.results);
        } else {
          this.loginActivities = this.laPaginator?.results as UserLoginActivities[];
        }
        this.loadingLA = false;
        this.showActivities();
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error while fetching login activities. Contact Dev Team.'
        });
        this.dialogRef.close();
      }
    );
  }
  fetchUserActivities(page: number, pageSize: number): void {
    this.userService.getUserActivities(this.user.id, page, pageSize).subscribe(
      res => {
        this.uaPaginator = (res as ResponseData).data;
        if (this.userActivities?.length > 0) {
          // @ts-ignore
          this.userActivities.push(...this.uaPaginator.results);
        } else {
          this.userActivities = this.uaPaginator?.results as UserActivities[];
        }
        this.loadingUA = false;
        this.showActivities();
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error while fetching user activities. Contact Dev Team.'
        });
        this.dialogRef.close();
      }
    );
  }

}
