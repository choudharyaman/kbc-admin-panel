import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthUserActivityResolver,
  AuthUserLoginActivityResolver,
  AuthUserProfileResolver
} from './resolvers/profile.resolver';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileDetailComponent,
    data: {
    },
    resolve: {
      profile: AuthUserProfileResolver,
      loginActivities: AuthUserLoginActivityResolver,
      userActivities: AuthUserActivityResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
