import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {HttpErrorHandlerService} from '../../../services/http-error-handler.service';
import {AuthService} from '../../../services/auth.service';
import {AppPages} from '../../../config/app.pages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;
  form: FormGroup;

  redirectUrl: string = AppPages.dashboard;

  constructor(private route: ActivatedRoute, private router: Router,
              private httpErrorHandler: HttpErrorHandlerService, private spinner: NgxSpinnerService,
              private authService: AuthService) {

    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    this.form.reset();
  }

  ngOnInit(): void {
    // redirectUrl
    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || AppPages.dashboard;
  }

  onLogin(): void {
    const creds = this.form.value;
    this.spinner.show('loginSpinner');
    this.authService.login(creds.username, creds.password).subscribe(
      async res => {
        await this.spinner.hide('loginSpinner');
        if (this.redirectUrl) {
          await this.router.navigate([this.redirectUrl], {relativeTo: this.route});
        } else {
          await this.router.navigate([AppPages.dashboard], {relativeTo: this.route});

          // if (AuthService.getUser().role === UserRole.CLERK) {
          //   this.router.navigate(['/coupons'], {relativeTo: this.route});
          // } else {
          //   this.router.navigate(['/dashboard'], {relativeTo: this.route});
          // }
        }
      },
      error => {
        this.spinner.hide('loginSpinner');
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect Credentials',
            text: 'Incorrect username or password'
          });
        } else if (error.status === 400) {
          // Setting Server Side Error
          Object.keys(error.error).forEach(f => {
            console.log(this.form.get(f));
            (this.form.get(f) as FormControl).setErrors({serverError: error.error[f]});
          });
        } else {
          this.httpErrorHandler.handleError(error);
        }
      }
    );
  }

  async onForgotPassword() {
    await this.router.navigate([AppPages.forgotPassword], {relativeTo: this.route});
  }
}
