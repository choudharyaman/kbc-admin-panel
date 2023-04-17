import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListStaffComponent} from './list-staff/list-staff.component';
import {StaffListResolver} from './resolvers/staff.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  },
  {
    path: 'all',
    component: ListStaffComponent,
    resolve: {
      staff: StaffListResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
