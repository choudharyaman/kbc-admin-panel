import Swal from 'sweetalert2';
import {AppConfig} from "../config/app.config";

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  showCloseButton: true,
  timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});
