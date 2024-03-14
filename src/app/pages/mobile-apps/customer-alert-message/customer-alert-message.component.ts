import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {MobileAppService} from "../../../services/mobile-app.service";
import {AppConfig} from "../../../config/app.config";
import Swal from "sweetalert2";
import {Toast} from "../../../utils/toast";
import {MobileAppAlertMessage} from '../../../models/mobile-app.model';

@Component({
  selector: 'app-customer-alert-message',
  templateUrl: './customer-alert-message.component.html',
  styleUrls: ['./customer-alert-message.component.scss']
})
export class CustomerAlertMessageComponent implements OnInit {
  alertMessages: MobileAppAlertMessage;
  alertIconTypes = AppConfig.MOBILE_APP_ALERT_MESSAGE.ICON_TYPE;
  alertDisplayType = AppConfig.MOBILE_APP_ALERT_MESSAGE.DISPLAY_TYPE;
  form: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private service: MobileAppService,
              private spinner: NgxSpinnerService, private dialogBox: MatDialog, private fb: FormBuilder) {

    this.alertMessages = this.route.snapshot.data['alertMessages'];

    /* Generate Form */
    this.form = this.fb.group({
      android_alert_message: this.fb.group({
        title: [null, [Validators.maxLength(20)]],
        content: [null, [Validators.maxLength(250)]],
        icon: [this.alertIconTypes[0]],
        display_type: [this.alertDisplayType[0]],
        is_active: [false]
      }),
      ios_alert_message: this.fb.group({
        title: [null, [Validators.maxLength(20)]],
        content: [null, [Validators.maxLength(250)]],
        icon: [this.alertIconTypes[0]],
        display_type: [this.alertDisplayType[0]],
        is_active: [false]
      })
    });

    console.log('this.form.controls', this.form.controls);

    /* patch form */
    this.form.patchValue(this.alertMessages);
  }

  ngOnInit(): void {
  }

  onSaveAlertMessage() {
    console.log('this.form.value', this.form.value);

    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    this.spinner.show("saveDialogSpinner");
    this.service.updateCustomerAppAlertMessages(this.form.value).subscribe(t => {
      this.spinner.hide("saveDialogSpinner");
      Toast.fire({
        icon: "success",
        text: "Alert message saved successfully",
      })
    },
    err => {
      this.spinner.hide("saveDialogSpinner");
      if (err.status === 400) {
        Object.keys(err.error).forEach(f => {
          console.log(this.form.controls[f]);
          this.form.controls[f].setErrors({ serverError: err.error[f] });
        })
      }
    })
  }

  onCopyFromAndroidAlert() {
    this.form.patchValue({
      customer_ios_alert_message: this.form.controls['customer_android_alert_message'].value
    });
  }
}
