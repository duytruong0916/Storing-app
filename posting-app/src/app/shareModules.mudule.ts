import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatBadgeModule, MatIconModule, MatMenuModule, MatDividerModule, MatToolbarModule,
  MatSidenavModule, MatFormFieldModule, MatSelectModule, MatListModule, MatExpansionModule, MatDialogModule, MatCardModule, MatInputModule,
  MatProgressSpinnerModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
const MaterialsModules = [MatButtonModule, MatCheckboxModule, MatBadgeModule, MatCardModule, MatIconModule, MatMenuModule,
  MatDividerModule, MatToolbarModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatListModule, MatExpansionModule,
  MatDialogModule, MatInputModule, MatProgressSpinnerModule];

@NgModule({
  imports: [MaterialsModules],
  exports: [MaterialsModules, ReactiveFormsModule, CommonModule]
})
export class SharedModule { }
