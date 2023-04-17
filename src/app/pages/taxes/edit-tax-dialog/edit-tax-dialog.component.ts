import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaxService} from '../../../services/tax.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Tax} from '../../../models/tax.model';
import Swal from 'sweetalert2';
import {AppConfig} from '../../../config/app.config';
import {ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';

@Component({
  selector: 'app-edit-tax-dialog',
  templateUrl: './edit-tax-dialog.component.html',
  styleUrls: ['./edit-tax-dialog.component.scss']
})
export class EditTaxDialogComponent {
  tax: Tax;
  isTaxActive: boolean = false;

  isEdit: boolean = false;
  dialogTitle: string = 'New Tax';

  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<EditTaxDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private taxService: TaxService, private spinner: NgxSpinnerService, private snackBar: MatSnackBar,
              private fb: FormBuilder) {

    this.isEdit = this.dialogData.edit;
    this.tax = this.dialogData.tax;

    // Form Builder
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, Validators.minLength(3)],
      tax: [null, [Validators.required, Validators.min(.1)]],
      is_active: [null, [Validators.required]]
    });

    if (this.isEdit) {
      this.dialogTitle = `Edit Tax: <span class="text-primary">${this.tax?.title}</span>`;
      this.form.patchValue(this.tax);
      this.isTaxActive = this.tax.is_active;
    } else {
      this.dialogTitle = "New Tax";
      this.isTaxActive = false;
    }
  }

  ngOnInit() {}

  onSaveTax() {
    this.form.controls["is_active"].setValue(this.isTaxActive);

    console.log('this.isTaxActive', this.isTaxActive);
    console.log('this.form', this.form);

    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    const formData: Tax = this.form.value;

    let api;
    if (this.dialogData.edit) {
      formData.id = this.tax.id;
      api= this.taxService.updateTax(formData);
    } else {
      api = this.taxService.createTax(formData);
    }

    this.spinner.show("saveDialogSpinner");
    api.subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Tax saved successfully",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
      })
      this.dialogRef.close({
        tax: (res as ResponseData).data
      })
    },
    error => {
      this.spinner.hide("saveDialogSpinner");
      if (error.status == 400) {
        Object.keys(error.error).forEach(f => {
          this.form.controls[f].setErrors({
            serverError: error.error[f]
          })
        });
      } else {
        Toast.fire({
          icon: 'error',
          text: 'Error while saving object.'
        })
      }
    })
  }

  onCloseDialog() {
    this.dialogRef.close("User Closed")
  }
}
