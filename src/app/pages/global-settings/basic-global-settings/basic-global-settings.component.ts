import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalSetting} from '../../../models/global-setting.model';
import {GlobalSettingService} from '../../../services/global-setting.service';
import {CustomFormValidators} from '../../../utils/form-validators';
import Swal from 'sweetalert2';
import {AppConfig} from '../../../config/app.config';
import {Toast} from '../../../utils/toast';

@Component({
  selector: 'app-basic-global-settings',
  templateUrl: './basic-global-settings.component.html',
  styleUrls: ['./basic-global-settings.component.scss']
})
export class BasicGlobalSettingsComponent {
  globalSetting: GlobalSetting;

  form: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private service: GlobalSettingService,
              private spinner: NgxSpinnerService, private fb: FormBuilder) {

    this.globalSetting = this.route.snapshot.data['globalSetting'];

    /* Form Builder */
    this.form = this.fb.group({
      customer_support: this.fb.group({
        email_address: [null, [Validators.required, Validators.email]],
        phone_number: [null, [Validators.required, CustomFormValidators.mobilePhone]],
        whatsapp_number: [null, [Validators.required, CustomFormValidators.mobilePhone]]
      }),
      business_information: this.fb.group({
        business_name: [null, [Validators.required]],
        business_address: [null, [Validators.required]],
        business_drug_license: [null, [Validators.required]]
      }),
      business_policies: this.fb.group({
        tnc: [null, [Validators.required, CustomFormValidators.url]],
        privacy: [null, [Validators.required, CustomFormValidators.url]],
        refund: [null, [Validators.required, CustomFormValidators.url]]
      })
    })
  }

  ngOnInit() {}

  onSaveSettings() {
    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return ;
    }

    const formData: GlobalSetting = this.form.value;
    console.log("formData", formData)

    this.spinner.show("saveDialogSpinner");
    this.service.updateGlobalSettings(this.form.value).subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Settings saved successfully",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
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
}
