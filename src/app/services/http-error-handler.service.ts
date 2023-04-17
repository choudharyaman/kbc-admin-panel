import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Toast} from '../utils/toast';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {
  constructor(private router: Router) {
  }

  public handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `<span class="text-danger">Error: ${error.error.message}</span>`,
        showConfirmButton: false,
        timer: 6 * 1000
      });
    } else {
      if (error.status === 401) {
        // Swal.fire({
        //   title: '<span class="text-danger">Unauthorized Access</span>',
        //   text: 'Please login to access this account',
        //   icon: 'error',
        //   confirmButtonColor: '#673ab7',
        //   confirmButtonText: 'Login Again'
        // }).then( val => {
        //   localStorage.clear();
        //   // this.router.navigate(['/auth/login']);
        //   window.location.href = '/auth/login';
        // });
      } else if (error.status === 400) {
        if (error.error.hasOwnProperty('errors') && error.error.errors.hasOwnProperty('non_field_errors')) {
          const nonFieldError = error.error.errors['non_field_errors']
          const errorMsg = nonFieldError.join(',');
          console.log('nonFieldError', nonFieldError);
          Swal.fire({
            icon: 'error',
            title: '<span class="text-danger">Form Errors</span>',
            text: errorMsg,
            position: 'center',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Okay'
          });
          return throwError({status: error.status, error: []});
        } else {
          Toast.fire({
            icon: 'error',
            text: 'Please check for invalid form entries'
          });
          return throwError({status: error.status, error: error.error.errors});
        }
      } else if (error.status === 403) {
        Swal.fire({
          title: '<span class="text-danger">Access Denied</span>',
          text: 'You are not allowed to access this resource',
          icon: 'error',
          position: 'top-end',
          showConfirmButton: false,
          timer: 6 * 1000
        });
      } else if (error.status === 404) {
        Swal.fire({
          title: '<span class="text-danger">Not Found</span>',
          html: error.error.message,
          icon: 'error',
          position: 'top-end',
          showConfirmButton: false,
          timer: 6 * 1000
        });
      } else if (error.status === 500) {
        Toast.fire({
          icon: 'error',
          title: 'Something went wrong at Server. Please try later.',
        });
      } else if (error.status === 0) {
        Toast.fire({
          icon: 'error',
          title: `<span class="text-danger">Unable to reach server. Please check Internet and try again</span>`,
        });
      } else {
          Swal.fire({
            title: '<span class="text-danger">Unknown Error</span>',
            html: `Error: ${error.statusText} (Code: ${error.status})`,
            icon: 'error',
            position: 'top-end',
            showConfirmButton: false,
            timer: 6 * 1000
          });
      }
    }
    // Return an observable with a user-facing error message.
    // return throwError(
    //   'Something bad happened; please try again later.');
  }
}
