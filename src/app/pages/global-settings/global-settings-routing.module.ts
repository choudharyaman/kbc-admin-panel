import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GlobalSettingsResolver} from './resolvers/global-settings.resolver';
import {BasicGlobalSettingsComponent} from './basic-global-settings/basic-global-settings.component';

const routes: Routes = [
  {
    path: '',
    component: BasicGlobalSettingsComponent,
    resolve: {
      globalSetting: GlobalSettingsResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalSettingsRoutingModule { }
