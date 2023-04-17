import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeliveryPersonService} from '../../../services/delivery-person.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorHandlerService} from '../../../services/http-error-handler.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {AppConfig} from '../../../config/app.config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeliveryPerson} from '../../../models/delivery-agent.model';
import Swal from 'sweetalert2';
import {ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';
import {CustomFormValidators} from '../../../utils/form-validators';

@Component({
  selector: 'app-edit-delivery-person-dialog',
  templateUrl: './edit-delivery-person-dialog.component.html',
  styleUrls: ['./edit-delivery-person-dialog.component.scss']
})
export class EditDeliveryPersonDialogComponent {

  isEdit: boolean = false;
  deliveryPerson: DeliveryPerson;
  dialogTitle: string = 'New Deliver Person';

  profileAvatarImgFilePath = "assets/images/icon-profile-avatar-default.png";
  fileUploadTracker = {
    showProgress: false,
    progress: 0
  };
  imageUploadConfigs = AppConfig.PROFILE_AVATAR_IMAGE;

  form: FormGroup;
  phoneDialCodes = AppConfig.PHONE_DIAL_CODES;

  constructor(public dialogRef: MatDialogRef<EditDeliveryPersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private service: DeliveryPersonService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private fb: FormBuilder,
              private httpErrorHandler: HttpErrorHandlerService, private fileUploadService: FileUploadService) {

    this.isEdit = this.dialogData.edit;
    this.deliveryPerson = this.dialogData.deliveryPerson;

    /* Form */
    this.form = this.fb.group({
      delivery_person_code: [null, [Validators.required, Validators.minLength(2)]],
      first_name: [null, [Validators.required, Validators.minLength(2)]],
      last_name: [null],
      profile_photo: [null],
      phone_country_code: [null, [Validators.required, Validators.maxLength(3)]],
      phone_number: [null, [Validators.required, CustomFormValidators.mobilePhone]],
      email: [null, [Validators.required, Validators.email]],
      is_active: [true, [Validators.required]]
    });

    if (this.isEdit) {
      this.dialogTitle = "Edit Deliver Person: " +
        `<span class='mat-text-primary'>&nbsp;${this.deliveryPerson.first_name}&nbsp;${this.deliveryPerson.last_name}</span>`;
      this.form.patchValue(this.deliveryPerson);
      if (this.deliveryPerson.avatar_absolute_url) {
        this.profileAvatarImgFilePath = this.deliveryPerson.avatar_absolute_url;
      }
    } else {
      this.dialogTitle = "New Delivery Person";
    }
  }

  ngOnInit() {
    this.dialogRef.updateSize("700px")
  }

  onSaveDeliveryPerson() {
    const formData: DeliveryPerson = this.form.value;

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

    if (this.isEdit) {
      formData.id = this.deliveryPerson.id;
      api = this.service.updateDeliveryPerson(formData);
    } else {
      api = this.service.createDeliveryPerson(formData);
    }
    this.spinner.show("saveDialogSpinner");
    api.subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Delivery Person detail saved successfully",
        timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
      });

      this.dialogRef.close({
        deliveryPerson: (res as ResponseData).data
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

      this.fileUploadService.uploadProfileAvatar(file).subscribe(res => {

          console.log('res', res);

          const response = res as { status: string, message: number | any };
          if (response.status === 'progress') {
            this.fileUploadTracker.progress = response.message as number;
          } else if (response.status === 'complete') {
            this.spinner.hide("uploadingSpinner");

            this.profileAvatarImgFilePath = response.message.data.file_absolute_path;
            this.form.controls['profile_photo'].patchValue(response.message.data.file_relative_path);
            this.form.controls['profile_photo'].markAsDirty();
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
    this.dialogRef.close("User Closed")
  }
}
