import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import {AppConfig} from '../../../config/app.config';
import {ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';
import {Discount, DiscountType} from '../../../models/discount.model';
import {DiscountService} from '../../../services/discount.service';

@Component({
  selector: 'app-edit-discount-dialog',
  templateUrl: './edit-discount-dialog.component.html',
  styleUrls: ['./edit-discount-dialog.component.scss']
})
export class EditDiscountDialogComponent {
  discount: Discount;
  discountTypes = [DiscountType.RELATIVE, DiscountType.ABSOLUTE];
  isDiscountActive: boolean = false;

  isEdit: boolean = false;
  dialogTitle: string = 'New Discount';

  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<EditDiscountDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private discountService: DiscountService, private spinner: NgxSpinnerService, private snackBar: MatSnackBar,
              private fb: FormBuilder) {

    this.isEdit = this.dialogData.edit;
    this.discount = this.dialogData.discount;

    // Form Builder
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, Validators.minLength(5)],
      discount_type: [null, [Validators.required]],
      discount_amount: [null, [Validators.required, Validators.min(.1)]],
      is_active: [null, [Validators.required]]
    })

    if (this.isEdit) {
      this.dialogTitle = `Edit Discount: <span class="text-primary">${this.discount?.title}</span>`;
      this.form.patchValue(this.discount);
      this.isDiscountActive = this.discount.is_active;
    } else {
      this.dialogTitle = "New Discount";
      this.isDiscountActive = false;
    }
  }

  ngOnInit() {}

  onSaveDiscount() {
    this.form.controls["is_active"].setValue(this.isDiscountActive);

    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    const formData: Discount = this.form.value;

    let api;
    if (this.dialogData.edit) {
      formData.id = this.discount.id;
      api= this.discountService.updateDiscount(formData);
    } else {
      api = this.discountService.createDiscount(formData);
    }

    this.spinner.show("saveDialogSpinner");
    api.subscribe(res => {
        this.spinner.hide("saveDialogSpinner");
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Discount saved successfully",
          timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
          showConfirmButton: false,
          showCloseButton: true
        })
        this.dialogRef.close({
          discount: (res as ResponseData).data
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
