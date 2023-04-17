import {Component, Inject, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomFormValidators} from "../../../utils/form-validators";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  form: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private service: AuthService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar) {
    this.form = new FormGroup({
      current_password:
        new FormControl(null, [Validators.required, Validators.minLength(8)]),
      new_password:
        new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirm_password:
        new FormControl(null, [Validators.required])
    });

    this.form.controls['confirm_password'].addValidators(
      CustomFormValidators.valueMatchValidator(
        this.form.controls['new_password'], this.form.controls['confirm_password']
      )
    );
  }

  ngOnInit(): void {
  }

  onChangePassword(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        html: 'Please <b>fill passwords</b> correctly'
      });
      return;
    }
    if (!this.form.dirty) {
      this.snackBar.open('Nothing to Save!', 'Okay', {
        duration: 3000,
      });
      return;
    }

    const passwords = this.form.value;
    this.spinner.show('userSpinner');
    this.service.changePassword(passwords.current_password, passwords.new_password).subscribe(
      res => {
        this.spinner.hide('userSpinner');
        Swal.fire({
          icon: 'success',
          text: `Your Password Changed Successfully`,
        });
        this.dialogRef.close({success: true});
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
