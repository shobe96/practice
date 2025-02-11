import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

const MODULES = [
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
  ],
  providers: [MessageService]
})
export class SharedModule { }
