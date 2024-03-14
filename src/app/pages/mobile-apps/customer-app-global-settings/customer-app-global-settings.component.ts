import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppConfig} from '../../../config/app.config';
import {Toast} from '../../../utils/toast';
import {MobileAppService} from '../../../services/mobile-app.service';
import {MobileAppGlobalSettings} from '../../../models/mobile-app.model';

@Component({
  selector: 'app-customer-app-global-settings',
  templateUrl: './customer-app-global-settings.component.html',
  styleUrls: ['./customer-app-global-settings.component.scss']
})
export class CustomerAppGlobalSettingsComponent implements OnInit{

  appSettings: MobileAppGlobalSettings;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router,
              private spinner: NgxSpinnerService, private fb: FormBuilder,
              private service: MobileAppService) {
    this.form = this.fb.group({
      android_version: this.fb.group({
        min: [null, [Validators.required]],
        latest: [null, [Validators.required]]
      }),
      ios_version: this.fb.group({
        min: [null, [Validators.required]],
        latest: [null, [Validators.required]]
      }),
      product: this.fb.group({
        show_price: [false, [Validators.required]],
        show_image: [false, [Validators.required]]
      })
    });

    this.appSettings = this.route.snapshot.data['appSettings'];
    this.form.patchValue(this.appSettings);
  }

  ngOnInit() {
  }

  async onSaveSettings() {
    if (this.form.invalid) {
      console.log('this.form', this.form);
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return ;
    }

    console.log('this.form', this.form.value);

    await this.spinner.show('savingSpinner');
    this.service.updateCustomerAppGlobalSettings(this.form.value).subscribe(res => {
        this.spinner.hide("savingSpinner");
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
        this.spinner.hide("savingSpinner");
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
}
