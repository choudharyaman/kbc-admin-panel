import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomerHomepageBannerComponent} from './customer-homepage-banner/customer-homepage-banner.component';
import {
  ActiveProductCategoryListResolver,
  CustomerHomepageBannerListResolver
} from './resolvers/customer-homepage.resolver';
import {CustomerAlertMessageComponent} from './customer-alert-message/customer-alert-message.component';
import {CustomerAlertMessageResolver} from './resolvers/alert-message.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer-banners'
  },
  {
    path: 'customer-banners',
    component: CustomerHomepageBannerComponent,
    resolve: {
      banners: CustomerHomepageBannerListResolver,
      activeProductCategories: ActiveProductCategoryListResolver
    }
  },
  {
    path: 'customer-alert-message',
    component: CustomerAlertMessageComponent,
    resolve: {
      alertMessages: CustomerAlertMessageResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileAppsRoutingModule { }
