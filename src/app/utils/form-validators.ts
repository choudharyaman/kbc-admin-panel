import {AbstractControl, FormControl} from '@angular/forms';

export class CustomFormValidators {
  static digits(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value === null || control.value.length === 0) {
      return null;
    }
    if (!control.value.toString().match(/^\d+$/)) {
      return { 'digits': true };
    }
    return null;
  }
  static mobilePhone(control: FormControl): {[s: string]: boolean} | null {
    if (control.value === null || control.value.toString().length === 0) {
      return null;
    }
    if (control.value.toString().match(/^\d{9,12}$/)) {
      return null;
    } else {
      return {'mobilephone': true};
    }
  }
  static url(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value === null || control.value.length === 0) {
      return null;
    }
    const reg = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    if (!control.value.match(reg)) {
      return { 'url': true };
    }
    return null;
  }

  static valueMatchValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { mismatch: 'Value does not match' };
      return null;
    };
  }
}
