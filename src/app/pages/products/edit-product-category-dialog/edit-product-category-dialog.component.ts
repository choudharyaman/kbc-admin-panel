import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductCategory} from '../../../models/product.model';
import {ProductService} from '../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FileUploadService} from '../../../services/file-upload.service';
import {HttpErrorHandlerService} from '../../../services/http-error-handler.service';
import {AppConfig} from '../../../config/app.config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';

@Component({
  selector: 'app-edit-product-category-dialog',
  templateUrl: './edit-product-category-dialog.component.html',
  styleUrls: ['./edit-product-category-dialog.component.scss']
})
export class EditProductCategoryDialogComponent {
  isEdit: boolean = false;
  dialogTitle: string = "New Category";

  category: ProductCategory;
  availableCategories: ProductCategory[];

  form: FormGroup;

  categoryImgFilePath = "assets/images/icon-category-default.png";

  fileUploadTracker = {
    showProgress: false,
    progress: 0
  };
  imageUploadConfigs = AppConfig.PRODUCT_IMAGE;

  constructor(public dialogRef: MatDialogRef<EditProductCategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private productService: ProductService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private fb: FormBuilder,
              private fileUploadService: FileUploadService, private httpErrorHandler: HttpErrorHandlerService) {

    this.isEdit = this.dialogData.edit;
    this.category = this.dialogData.category;
    this.availableCategories = this.dialogData.availableCategories;

    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      parent_category: [null],
      thumbnail: [null],
      is_active: [true, [Validators.required]]
    });

    if (this.isEdit) {
      this.category = this.dialogData.category;
      this.dialogTitle = "Edit Category: " + `<span class='mat-text-primary'>&nbsp;${this.category.name}</span>`;
      this.form.patchValue({
        name: this.category.name,
        parent_category: this.category.parent_category?.id,
        thumbnail: this.category.thumbnail ? this.category.thumbnail : null,
        is_active: this.category.is_active
      });

      if (this.category.thumbnail_absolute_url) {
        this.categoryImgFilePath = this.category.thumbnail_absolute_url;
      }

      console.log("this.category", this.category);
      console.log("this.form.value", this.form.value);

    } else {
      this.dialogTitle = "New Category";
    }
  }

  ngOnInit() {
    this.dialogRef.updateSize("600px")
  }

  onSaveCategory() {
    const formData: ProductCategory = this.form.value;
    console.log("formData", formData);

    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    if (!this.form.dirty) {
      this.snackBar.open(
        "Nothing to Save!",
        "Okay",
        {
          duration: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS
        }
      );
      return;
    }

    let api;

    if(this.isEdit) {
      formData.id = this.category.id;
      api = this.productService.updateProductCategory(formData)
    } else {
      api = this.productService.createProductCategory(formData)
    }

    this.spinner.show("saveDialogSpinner");
    api.subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Product Category saved successfully",
        timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
      });

      this.dialogRef.close({
        productCategory: (res as ResponseData).data
      });
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

  uploadFile(file: File | any) {
    if (file.size > this.imageUploadConfigs.MAX_SIZE_B) {
      Swal.fire({
        icon: "error",
        html: `Maximum allowed size for logo: <b>${this.imageUploadConfigs.MAX_SIZE_MB} MB</b>`
      })
    } else {
      this.spinner.show("uploadingSpinner");
      this.fileUploadTracker.showProgress = true;
      this.fileUploadTracker.progress = 0;

      this.fileUploadService.uploadCategoryImage(file).subscribe(res => {

        console.log('res', res);

        const response = res as { status: string, message: number | any };
        if (response.status === 'progress') {
          this.fileUploadTracker.progress = response.message as number;
        } else if (response.status === 'complete') {
          this.spinner.hide("uploadingSpinner");

          this.categoryImgFilePath = response.message.data.file_absolute_path;
          this.form.controls['thumbnail'].patchValue(response.message.data.file_id);
          this.form.controls['thumbnail'].markAsDirty();
          Toast.fire({
            icon: "success",
            title: "Image Uploaded Successfully"
          });
        }
      },
      error => {
        this.spinner.hide("uploadingSpinner");
        this.httpErrorHandler.handleError(error).bind(this);
        this.fileUploadTracker.showProgress = false;
        this.fileUploadTracker.progress = 0;
      });
    }
  }

  onCloseDialog() {
    this.dialogRef.close()
  }
}
