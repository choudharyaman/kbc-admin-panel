import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {NonAuthGuard} from './guards/non-auth.guard';
import {AuthGuard} from './guards/auth.guard';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'courier-agents',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/courier-agents/courier-agents.module').then(m => m.CourierAgentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery-persons',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/delivery-persons/delivery-persons.module').then(m => m.DeliveryPersonsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'discounts',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/discounts/discounts.module').then(m => m.DiscountsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'taxes',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/taxes/taxes.module').then(m => m.TaxesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mobile-apps',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/mobile-apps/mobile-apps.module').then(m => m.MobileAppsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'global-settings',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/global-settings/global-settings.module').then(m => m.GlobalSettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'staff',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/staff/staff.module').then(m => m.StaffModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: AdminLayoutComponent,
    loadChildren: () => import('./pages/my-profile/my-profile.module').then(m => m.MyProfileModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
