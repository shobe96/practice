import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

const MODULES = [
  CommonModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: [
    MODULES,
    ButtonModule
  ],
  exports: [
    MODULES
  ],
  providers: [MessageService, DialogService, ConfirmationService],
})
export class SharedModule { }
