import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAppsRoutingModule } from './mobile-apps-routing.module';
import {CustomerHomepageBannerComponent} from './customer-homepage-banner/customer-homepage-banner.component';
import {SharedModule} from '../../shared/shared.module';
import {
  SelectBannerImageDialogComponent
} from './customer-homepage-banner/select-banner-image-dialog/select-banner-image-dialog.component';
import {CustomerAlertMessageComponent} from './customer-alert-message/customer-alert-message.component';
import { CustomerAppGlobalSettingsComponent } from './customer-app-global-settings/customer-app-global-settings.component';


@NgModule({
  declarations: [
    CustomerHomepageBannerComponent,
    SelectBannerImageDialogComponent,
    CustomerAlertMessageComponent,
    CustomerAppGlobalSettingsComponent
  ],
  imports: [
    CommonModule,
    MobileAppsRoutingModule,
    SharedModule
  ]
})
export class MobileAppsModule { }
