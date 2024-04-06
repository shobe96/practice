import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    TableHoverDirective
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    TableHoverDirective,
    PrimeNgModule,
    CommonModule
  ]
})
export class SharedModule { }
