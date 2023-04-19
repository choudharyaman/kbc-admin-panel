import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {
  ListUserActivitiesDialogComponent
} from './components/users/list-user-activities-dialog/list-user-activities-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {
  ChangeUserPasswordDialogComponent
} from './components/users/change-user-password-dialog/change-user-password-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    ListUserActivitiesDialogComponent,
    ChangeUserPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Material Components
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatTabsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    MatAutocompleteModule,


    NgxSpinnerModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,

    // Material Components
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatTabsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    MatAutocompleteModule,


    NgxSpinnerModule
  ]
})
export class SharedModule { }
