import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';
import {ChangePasswordDialogComponent} from './change-password-dialog/change-password-dialog.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    ProfileDetailComponent,
    ChangePasswordDialogComponent
  ],
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    SharedModule
  ]
})
export class MyProfileModule { }
