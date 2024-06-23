import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TableHoverDirective,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ],
  exports: [
    TableHoverDirective,
    PrimeNgModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
