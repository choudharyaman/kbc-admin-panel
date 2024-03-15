import {Component, Inject} from '@angular/core';
import Swal from 'sweetalert2';
import {Product, ProductImage, ProductImageFor, ProductImageRole} from '../../../../models/product.model';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppConfig} from '../../../../config/app.config';
import {FileUploadService} from '../../../../services/file-upload.service';
import {Toast} from '../../../../utils/toast';

@Component({
  selector: 'app-product-image-upload-dialog',
  templateUrl: './product-image-upload-dialog.component.html',
  styleUrls: ['./product-image-upload-dialog.component.scss']
})
export class ProductImageUploadDialogComponent {
  dialogTitle: string;

  product: Product;
  imageRole: ProductImageRole;

  imagePreview: string;
  defaultImage = "assets/images/default-product-img.png";

  fileUploadTracker = {showProgress: false, progress: 0};
  isImageUploaded = false;

  imageUploadConfigs = AppConfig.PRODUCT_IMAGE;

  constructor(public dialogRef: MatDialogRef<ProductImageUploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private fb: FormBuilder,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar,
              private service: FileUploadService) {

    /* fetch dialog data */
    this.product = this.dialogData.product;
    this.dialogTitle = this.dialogData.dialogTitle;
    this.imagePreview = this.dialogData.imagePreview || this.defaultImage;
    this.imageRole = this.dialogData.imageRole;
  }

  ngOnInit(): void {
  }

  uploadFile(file: any) {
    if (file.size > this.imageUploadConfigs.MAX_SIZE_B) {
      Swal.fire({
        icon: "error",
        html: `Maximum allowed size for image: <b>${this.imageUploadConfigs.MAX_SIZE_MB} MB</b>`
      });
      return;
    }

    this.spinner.show("uploadingSpinner");
    this.isImageUploaded = false;
    this.fileUploadTracker.showProgress = true;
    this.fileUploadTracker.progress = 0;

    this.service.uploadProductImage(this.product.id, file, this.imageRole).subscribe(
      res => {
        console.log('res', res);
        const response = res as {status: string, message: number | any};
        if (response.status === "progress") {
          this.fileUploadTracker.progress = response.message as number;
        } else if (response.status === "complete") {
          this.spinner.hide("uploadingSpinner");

          this.fileUploadTracker.showProgress = false;
          this.isImageUploaded = true;

          this.imagePreview = response.message.data.file_absolute_path;

          const productImg: ProductImage = {
            id: response.message.data.file_absolute_path,
            image_for: ProductImageFor.PRODUCT,
            image_role: this.imageRole,
            file_relative_path: response.message.data.file_relative_path,
            file_absolute_path: response.message.data.file_absolute_path
          }

          Toast.fire({
            icon: "success",
            title: "Image Uploaded Successfully"
          });

          this.dialogRef.close({action: 'image-uploaded', productImage: productImg});
        }
      },
      error => {
        this.spinner.hide("uploadingSpinner");
        this.fileUploadTracker.showProgress = false;
        this.fileUploadTracker.progress = 0;
      }
    );
  }

  onCloseDialog() {
    this.dialogRef.close({action: 'user-closed'});
  }
}
