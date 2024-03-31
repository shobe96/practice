import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MenubarModule,
    TableModule,
    SplitButtonModule,
    ButtonModule,
    SpeedDialModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    AccordionModule
  ],
  exports: [
    MenubarModule,
    TableModule,
    SplitButtonModule,
    ButtonModule,
    SpeedDialModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    AccordionModule
  ]
})
export class PrimeNgModule { }
