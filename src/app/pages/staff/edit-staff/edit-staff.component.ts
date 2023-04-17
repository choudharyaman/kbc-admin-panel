import {Component, Inject, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {UserRole} from "../../../models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StaffService} from "../../../services/staff.service";
import {ResponseData} from "../../../models/paginator.model";
import {Staff} from "../../../models/staff.model";
import {AppConfig} from "../../../config/app.config";
import {CustomFormValidators} from '../../../utils/form-validators';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent implements OnInit {

  dialogTitle: string;
  staff: Staff | null = null;

  userRoles = UserRole;
  dialCodes = AppConfig.PHONE_DIAL_CODES;

  form: FormGroup;
  hidePassword = true;
  constructor(public dialogRef: MatDialogRef<EditStaffComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private staffService: StaffService, private userService: UserService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar) {

    this.form = new FormGroup({
      employee_code: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.maxLength(25)]),
      email: new FormControl(null, [Validators.required, Validators.email]),

      phone_country_code: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required, CustomFormValidators.mobilePhone])
    });
    if (!this.data.edit) {
      this.form.addControl(
        'username',
        new FormControl(null, [Validators.required, Validators.email])
      );
      this.form.addControl(
        'password',
        new FormControl(null, [Validators.required])
      );
    }

    // Resetting Everything
    this.form.reset();
    this.spinner.hide('userSpinner');

    if (data.edit) {
      this.staff = data.staff as Staff;
      this.dialogTitle = `Edit User: <small>${this.staff.email}</small>`;
      this.form.patchValue(this.staff);
    } else {
      this.dialogTitle = `New Staff`;
    }
  }

  onSave(): void {
    console.log('this.form.value', this.form.value);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        html: 'Please <b>fill user detail</b> correctly'
      });
      return;
    }
    if (!this.form.dirty) {
      this.snackBar.open('Nothing to Save!', 'Okay', {
        duration: 3000,
      });
      return;
    }
    const staffData = this.form.value;
    let api;
    if (this.data.edit) {
      staffData.id = this.staff?.id;
      api = this.staffService.updateStaffMember(staffData);
    } else {
      api = this.staffService.createStaffMember(staffData);
    }

    this.spinner.show('userSpinner');
    api.subscribe(
      res => {
        this.spinner.hide('userSpinner');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          text: this.data.edit ? `Staff Updated: ${staffData.email}` : `Staff Added: ${staffData.email}`,
          timer: 5 * 1000,
          showConfirmButton: false
        });
        this.dialogRef.close({staff_: (res as ResponseData).data});
      },
      error => {
        this.spinner.hide('userSpinner');
        if (error.status === 400) {
          // Setting Server Side Error
          console.log('error.error', error.error);
          Object.keys(error.error).forEach(f => {
            // console.log(this.form.get(f));
            // this.form.get(f).setErrors({serverError: error.error[f]});
            console.log('f', f);
            console.log('this.form.controls[f]', this.form.controls[f]);
            this.form.controls[f].setErrors({serverError: error.error[f]})
          });
        }
      },
    );
  }

  ngOnInit(): void {
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
