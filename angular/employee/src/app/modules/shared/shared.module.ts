import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  PrimeNgModule,
  CommonModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [
    TableHoverDirective,
  ],
  imports: [
    MODULES
  ],
  exports: [
    TableHoverDirective,
    MODULES
  ]
})
export class SharedModule { }
