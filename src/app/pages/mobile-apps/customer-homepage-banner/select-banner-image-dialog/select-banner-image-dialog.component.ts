import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MobileAppService} from "../../../../services/mobile-app.service";
import {HttpErrorHandlerService} from "../../../../services/http-error-handler.service";
import {AppConfig} from "../../../../config/app.config";
import {MobileAppBannerMediaFile} from "../../../../models/mobile-app.model";
import Swal from "sweetalert2";
import {Toast} from "../../../../utils/toast";
import {ResponseData} from "../../../../models/paginator.model";

@Component({
  selector: 'app-select-banner-image-dialog',
  templateUrl: './select-banner-image-dialog.component.html',
  styleUrls: ['./select-banner-image-dialog.component.scss']
})
export class SelectBannerImageDialogComponent implements OnInit {
  bannerFilesLoadingSpinner = false;
  bannerFiles: MobileAppBannerMediaFile[] | any[] = [];

  selectedBannerFile: MobileAppBannerMediaFile | undefined;

  imageUploadConfigs = AppConfig.MOBILE_APPS.BANNER.IMAGE;
  fileUploadTracker: {
    showProgress: boolean;
    progress: number;
  };
  activeTab: number = 1;

  constructor(public dialogRef: MatDialogRef<SelectBannerImageDialogComponent>, private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private spinner: NgxSpinnerService,
              private snackBar: MatSnackBar, private mobileAppService: MobileAppService,
              private httpErrorHandler: HttpErrorHandlerService) {

    this.fileUploadTracker = {showProgress: false, progress: 0};
  }

  ngOnInit(): void {
    this.clearBannerSelection();
    this.fetchBannerFiles();
  }

  //@tss-ignore
  uploadFile(bannerFile: File | any) {
    if (bannerFile.size > this.imageUploadConfigs.MAX_SIZE_B) {
      Swal.fire({
        icon: "error",
        html: `Maximum allowed size for Banner Image: <b>${this.imageUploadConfigs.MAX_SIZE_MB} MB</b>`
      })
    } else {
      this.spinner.show("uploadingSpinner");
      this.fileUploadTracker.showProgress = true;
      this.fileUploadTracker.progress = 0;
      this.mobileAppService.createAppBannerMediaFiles(bannerFile).subscribe(res => {
        console.log('res', res);

        const response = res as { status: string, message: number | any };
        if (response.status === "progress") {
          this.fileUploadTracker.progress = response.message as number;
        } else if (response.status === "complete") {
          this.spinner.hide("uploadingSpinner");

          this.fileUploadTracker.showProgress = false;

          this.selectedBannerFile = response.message.data;
          this.bannerFiles.unshift(this.selectedBannerFile as MobileAppBannerMediaFile);

          this.switchTab("library");

          Toast.fire({
            icon: "success",
            title: "Image Uploaded Successfully"
          });
        }
      },
      error => {
        this.spinner.hide("uploadingSpinner");
        this.fileUploadTracker.showProgress = false;
        this.fileUploadTracker.progress = 0;
      });
    }
  }

  onSelectBanner() {
    this.dialogRef.close(this.selectedBannerFile)
  }

  onBannerChecked(bannerFile: MobileAppBannerMediaFile) {
    this.selectedBannerFile = bannerFile
  }

  onDeleteBanner(bannerFile: MobileAppBannerMediaFile | any) {
    Swal.fire({
      icon: "question",
      title: "Confirm delete Banner File?",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete!",
      confirmButtonColor: AppConfig.COLORS.DANGER
    }).then(result => {
      if (result) {
        this.onDeleteBannerConfirm(bannerFile)
      }
    })
  }

  onDeleteBannerConfirm(bannerFile: MobileAppBannerMediaFile) {
    console.log('bannerFile', bannerFile);
    this.mobileAppService.deleteAppBannerMediaFiles(bannerFile.id).subscribe(
      res => {
        this.removeBannerFromMediaList(this.selectedBannerFile as MobileAppBannerMediaFile);
        this.clearBannerSelection();
      },
      err => {
        if (err.status === 400) {
          Swal.fire({
            icon: "error",
            title: '<span class="text-danger">Can\'t Delete</span>',
            text: "Cannot delete this image as it used actively in Mobile App Banner",
            showConfirmButton: !0
          })
        } else {
          Toast.fire({
            icon: 'error',
            text: 'Error while deleting Banner File'
          })
        }
      }
    );
  }

  fetchBannerFiles() {
    this.bannerFilesLoadingSpinner = true;
    this.mobileAppService.getAppBannerMediaFiles().subscribe(res => {
      this.bannerFiles = (res as ResponseData).data;
      this.bannerFilesLoadingSpinner = false;
      this.dialogRef.updateSize("75%");
      setTimeout(() => {
        if (this.bannerFiles.length === 0) {
          this.switchTab("upload");
        }
      }, 500);
    })
  }

  switchTab(tabName: string) {
    this.activeTab = "upload" === tabName ? 0 : 1
  }

  clearBannerSelection() {
    this.selectedBannerFile = JSON.parse(JSON.stringify({
      file_id: null,
      file_absolute_path: null
    }));
  }

  removeBannerFromMediaList(bannerFile: MobileAppBannerMediaFile) {
    this.bannerFiles = this.bannerFiles.filter(f => f.file_id !== bannerFile.file_id)
  }

  onDragOver($event: any) {
    $event.preventDefault();
  }

  onDropSuccess($event: any) {
    $event.preventDefault();
    console.log($event.dataTransfer.files);
    this.uploadFile($event.dataTransfer.files[0]);
  }

  onCloseDialog() {
    this.dialogRef.close(null)
  }
}
