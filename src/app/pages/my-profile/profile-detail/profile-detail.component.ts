import { Component, OnInit } from '@angular/core';
import {Profile} from "../../../models/profile.model";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserActivities, UserLoginActivities, UserLoginStatus} from "../../../models/user.model";
import {PaginatorMeta, ResponseData} from "../../../models/paginator.model";
import {Toast} from "../../../utils/toast";
import {ChangePasswordDialogComponent} from "../change-password-dialog/change-password-dialog.component";

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  profile: Profile;

  enableLA = true;
  enableUA = false;

  loginActivities: UserLoginActivities[] | [] = [];
  userActivities: UserActivities[] | [] = [];
  laPaginator: PaginatorMeta;
  uaPaginator: PaginatorMeta;

  loginStatuses = UserLoginStatus;
  defaultPageSize = 50;

  constructor(private authService: AuthService, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar, private spinner: NgxSpinnerService) {
    this.profile =  this.route.snapshot.data['profile'];

    this.laPaginator = this.route.snapshot.data['loginActivities'];
    this.loginActivities = this.laPaginator.results;

    this.uaPaginator = this.route.snapshot.data['userActivities'];
    this.userActivities = this.uaPaginator.results;
  }

  ngOnInit(): void {
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  fetchLoginActivities(page: number, pageSize: number): void {
    this.authService.getLoginActivities(page, pageSize).subscribe(
      res => {
        this.laPaginator = (res as ResponseData).data;
        if (this.loginActivities?.length > 0) {
          // @ts-ignore
          this.loginActivities.push(...this.laPaginator.results);
        } else {
          this.loginActivities = this.laPaginator?.results as UserLoginActivities[];
        }
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error while fetching login activities. Contact Dev Team.'
        });
      }
    );
  }

  fetchUserActivities(page: number, pageSize: number): void {
    this.authService.getUserActivities(page, pageSize).subscribe(
      res => {
        this.uaPaginator = (res as ResponseData).data;
        if (this.userActivities?.length > 0) {
          // @ts-ignore
          this.userActivities.push(...this.uaPaginator.results);
        } else {
          this.userActivities = this.uaPaginator?.results as UserActivities[];
        }
      },
      error => {
        Toast.fire({
          icon: 'error',
          text: 'Error while fetching user activities. Contact Dev Team.'
        });
      }
    );
  }
}
