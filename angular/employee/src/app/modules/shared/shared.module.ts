import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

const MODULES = [
  CommonModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [
    MODULES
  ],
  exports: [
    MODULES
  ],
  providers: [MessageService]
})
export class SharedModule { }
