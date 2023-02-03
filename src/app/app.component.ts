import { Component } from '@angular/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kbc-admin-panel';

  constructor() {
    console.log('env: ', environment.production);
    console.log('env: ', environment.envName);
    console.log('env: ', environment.apiBaseUrl);
  }
}
