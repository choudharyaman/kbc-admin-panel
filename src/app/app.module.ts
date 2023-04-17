import {DEFAULT_CURRENCY_CODE, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {PanelMenuModule} from 'primeng/panelmenu';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {SharedModule} from './shared/shared.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './services/auth.interceptor.service';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // third-party
    NgxSpinnerModule,
    LoadingBarRouterModule,
    PanelMenuModule,

    SharedModule,
  ],
  providers: [
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
        appearance: 'outline'
      }
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
