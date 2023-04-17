import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalSettingsRoutingModule } from './global-settings-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { BasicGlobalSettingsComponent } from './basic-global-settings/basic-global-settings.component';


@NgModule({
  declarations: [
    BasicGlobalSettingsComponent
  ],
  imports: [
    CommonModule,
    GlobalSettingsRoutingModule,
    SharedModule
  ]
})
export class GlobalSettingsModule { }
