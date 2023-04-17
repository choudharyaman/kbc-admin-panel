import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import {EditStaffComponent} from './edit-staff/edit-staff.component';
import {ListStaffComponent} from './list-staff/list-staff.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [EditStaffComponent, ListStaffComponent],
  imports: [
    CommonModule,
    StaffRoutingModule,
    SharedModule
  ]
})
export class StaffModule { }
