import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MobileAppService} from "../../../services/mobile-app.service";
import {AppConfig} from "../../../config/app.config";
import {MobileAppBanner} from "../../../models/mobile-app.model";
import {ProductCategory} from "../../../models/product.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectBannerImageDialogComponent} from "./select-banner-image-dialog/select-banner-image-dialog.component";
import {CustomFormValidators} from "../../../utils/form-validators";
import Swal from "sweetalert2";
import {Toast} from "../../../utils/toast";
import {ResponseData} from "../../../models/paginator.model";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-customer-homepage-banner',
  templateUrl: './customer-homepage-banner.component.html',
  styleUrls: ['./customer-homepage-banner.component.scss']
})
export class CustomerHomepageBannerComponent implements OnInit {
  banners: MobileAppBanner[];
  activeProductCategories: ProductCategory[];

  pageTitle = "Mobile App Banners";

  defaultBannerImage = "assets/images/mobile-apps-banner-default.jpg";
  defaultVendorThumbnail = "assets/images/icon-company-logo-default.png";
  defaultCategoryThumbnail = "assets/images/icon-category-default.png";
  bannerTargetLinkTypes = AppConfig.MOBILE_APPS.BANNER.TARGET_LINK_TYPES;
  maxAllowedBanners = AppConfig.MOBILE_APPS.BANNER.MAX_ALLOWED;

  bannerMetrics: {
    total: number;
    active: number;
    urlBased: number;
    categoryBased: number;
  }

  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private dialogBox: MatDialog,
              private mobileAppService: MobileAppService, private spinner: NgxSpinnerService,
              private fb: FormBuilder) {

    this.banners = this.route.snapshot.data['banners'];
    this.activeProductCategories = this.route.snapshot.data['activeProductCategories'];

    this.bannerMetrics = {
      total: 0,
      active: 0,
      urlBased: 0,
      categoryBased: 0
    };

    /* generate form */
    this.form = this.fb.group({
      banners: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.resetPage();
  }

  onSaveBanner(index: number, bannerForm: any) {
    console.log('bannerForm', bannerForm);
    if (bannerForm.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    const banner: MobileAppBanner = bannerForm.value;
    let api;
    if (banner.id == null) {
      api = this.mobileAppService.createAppBanner(banner);
    } else {
      api = this.mobileAppService.updateAppBanner(banner);
    }

    this.spinner.show('savingSpinner');
    api.subscribe(res => {
        this.spinner.hide('savingSpinner');
        this.banners[index] = (res as ResponseData).data;
        this.resetPage();
        Toast.fire({
          icon: "success",
          text: "Banner saved successfully",
        });
        console.log("this.banners", this.banners)
      },
      error => {
        this.spinner.hide('savingSpinner');
        Toast.fire({
          icon: 'error',
          text: 'Error while saving Homepage Banner'
        })
      });
  }

  onRemoveBanner(index: number, banner: MobileAppBanner) {
    if (banner.id) {
      Swal.fire({
        icon: "question",
        title: "Confirm delete banner?",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete!",
        confirmButtonColor: AppConfig.COLORS.DANGER
      }).then(result => {
        if (result.isConfirmed) {
          this.mobileAppService.deleteAppBanner(banner.id).subscribe(res => {
              this.banners.splice(index, 1);
              this.resetPage();
              Swal.fire({
                icon: 'success',
                text: "Banner deleted successfully",
              });
              console.log("this.banners", this.banners);
            },
            error => {
              Toast.fire({
                icon: 'error',
                text: 'Error while removing Homepage Banner'
              })
            });
        }
      });
    } else {
      this.resetPage();
    }
  }

  onSelectBanner(index: number) {
    this.dialogBox.open(SelectBannerImageDialogComponent, {
      disableClose: true,
      data: {}
    }).afterClosed().subscribe(result => {
      // console.log("result", result)
      // console.log("this.getBannerForms().controls[index]", this.getBannerForms().controls[index]);
      if (result) {
        this.getBannerForms().controls[index].patchValue({
          banner: result.file_id,
          banner_absolute_path: result.file_absolute_path
        })
      }
    })
  }

  resetPage() {
    this.getBannerForms().reset();
    this.getBannerForms().controls = [];

    if (this.banners.length > 0) {
      this.banners.forEach(b => this.onAddNewBanner(b));
    } else {
      this.onAddNewBanner();
    }
    this.bannerMetrics.total = this.banners.length;
    this.bannerMetrics.active = this.banners.filter(b => b.is_active).length;
    this.bannerMetrics.categoryBased = this.banners.filter(b => b.target_link_type === this.bannerTargetLinkTypes[1]).length;
    this.bannerMetrics.urlBased = this.banners.filter(b => b.target_link_type === this.bannerTargetLinkTypes[2]).length;

    // console.log("this.form", this.form)
    // console.log("this.bannerMetrics", this.bannerMetrics)
  }

  onAddNewBanner(mobileAppBanner: MobileAppBanner | null = null) {
    // Generate Form
    const bannerForm: FormGroup = this.fb.group({
      id: [null],
      banner: [null, [Validators.required]],
      banner_absolute_path: [null],
      sequence: [this.banners.length + 1],
      target_link_type: [null],
      target_link: [null],
      is_active: [true, [Validators.required]]
    });
    // Set Linktype field validators
    bannerForm.controls['target_link_type'].valueChanges.subscribe(selectedLinkType => {
      bannerForm.controls['target_link'].patchValue(null);
      if (selectedLinkType == this.bannerTargetLinkTypes[1] || selectedLinkType == this.bannerTargetLinkTypes[2]) {
        bannerForm.controls['target_link'].setValidators([Validators.required]);
      } else if (selectedLinkType == this.bannerTargetLinkTypes[2]) {
        bannerForm.controls['target_link'].setValidators([Validators.required, CustomFormValidators.url])
      } else {
        bannerForm.controls['target_link'].clearValidators();
      }
    })
    // Set Default Image
    bannerForm.patchValue({banner_absolute_path: this.defaultBannerImage});
    // Patch Form
    if (mobileAppBanner) {
      bannerForm.patchValue(mobileAppBanner);
    }
    // Add to Banners Form
    this.getBannerForms().push(bannerForm)
    console.log('this.form.value', this.form.value);
  }

  getBannerForms(): FormArray {
    return this.form.controls['banners'] as FormArray;
  }

  getBannerForm(index: number): FormGroup {
    return this.getBannerForms().at(index) as FormGroup;
  }
}
