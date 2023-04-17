import {Component, Inject, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Toast} from "../../../../utils/toast";
import {ResponseData} from "../../../../models/paginator.model";
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-change-user-password-dialog',
  templateUrl: './change-user-password-dialog.component.html',
  styleUrls: ['./change-user-password-dialog.component.scss']
})
export class ChangeUserPasswordDialogComponent implements OnInit {

  hidePassword = false;
  user: User;
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<ChangeUserPasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private service: UserService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar) {
    this.user = data.user;
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    this.form.reset();
    this.spinner.hide('userSpinner');
  }


  ngOnInit(): void {
  }

  onChangePassword(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        html: 'Please <b>fill password</b> correctly'
      });
      return;
    }
    if (!this.form.dirty) {
      this.snackBar.open('Nothing to Save!', 'Okay', {
        duration: 3000,
      });
      return;
    }

    const userData = this.form.value;
    userData.id = this.user.id;

    this.spinner.show('userSpinner');

    this.service.updateUser(userData).subscribe(
      res => {
        this.spinner.hide('userSpinner');
        Toast.fire({
          icon: 'success',
          text: `Password Changed: ${this.user.username}`,
          showCloseButton: true,
        });
        this.dialogRef.close({user: (res as ResponseData).data});
      },
      error => {
        this.spinner.hide('userSpinner');
        if (error.status === 400) {
          // Setting Server Side Error
          Object.keys(error.error).forEach(f => {
            this.form.controls[f].setErrors({serverError: error.error[f]});
          });
        }
      },
    );
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

}
