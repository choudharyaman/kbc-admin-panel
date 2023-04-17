import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorHandlerService} from '../../../services/http-error-handler.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {AppConfig} from '../../../config/app.config';
import {CourierAgent} from '../../../models/delivery-agent.model';
import {CustomFormValidators} from '../../../utils/form-validators';
import Swal from 'sweetalert2';
import {Toast} from '../../../utils/toast';
import {CourierAgentService} from '../../../services/courier-agent.service';
import {ResponseData} from '../../../models/paginator.model';

@Component({
  selector: 'app-edit-courier-agent-dialog',
  templateUrl: './edit-courier-agent-dialog.component.html',
  styleUrls: ['./edit-courier-agent-dialog.component.scss']
})
export class EditCourierAgentDialogComponent {

  isEdit: boolean = false;
  dialogTitle: string = 'New Courier Agent';

  courierAgent: CourierAgent;

  imageUploadConfigs = AppConfig.PROFILE_AVATAR_IMAGE;
  logoImgFilePath = "assets/images/icon-company-logo-default.png";
  fileUploadTracker = {
    showProgress: false,
    progress: 0
  }

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditCourierAgentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private service: CourierAgentService,
              private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private fb: FormBuilder,
              private httpErrorHandler: HttpErrorHandlerService, private fileUploadService: FileUploadService) {

    this.isEdit = this.dialogData.edit;
    this.courierAgent = this.dialogData.courierAgent;

    /* Form */
    this.form = this.fb.group({
      courier_agent_name: [null, [Validators.required, Validators.minLength(2)]],
      courier_agent_logo: [null],
      courier_agent_website: [null, [Validators.required, CustomFormValidators.url]],
      courier_agent_tracking_url: [null, [CustomFormValidators.url]],
      is_active: [true, [Validators.required]]
    });

    if (this.isEdit) {
      this.dialogTitle = `Edit Courier Agent: <span class="mat-text-primary">&nbsp;${this.courierAgent.courier_agent_name}</span>`;
      this.form.patchValue(this.courierAgent);
      if (this.courierAgent.logo_absolute_url) {
        this.logoImgFilePath = this.courierAgent.logo_absolute_url;
      }
    } else {
      this.dialogTitle = "New Courier Agent";
    }
  }

  ngOnInit() {
    this.dialogRef.updateSize("600px")
  }

  onSaveCourierAgent() {
    const formData: CourierAgent = this.form.value;

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
      formData.id = this.courierAgent.id;
      api = this.service.updateCourierAgent(formData);
    } else {
      api = this.service.createCourierAgent(formData);
    }
    this.spinner.show("saveDialogSpinner");

    api.subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Courier Agent detail saved successfully",
        timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
      });

      this.dialogRef.close({
        courierAgent: (res as ResponseData).data
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
    });
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

            this.logoImgFilePath = response.message.data.file_absolute_path;
            this.form.controls['courier_agent_logo'].patchValue(response.message.data.file_relative_path);
            this.form.controls['courier_agent_logo'].markAsDirty();
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
