import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion'; 3
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [
    MenubarModule,
    TableModule,
    SplitButtonModule,
    ButtonModule,
    SpeedDialModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    AccordionModule,
    TooltipModule,
    MultiSelectModule,
    ToastModule
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
    AccordionModule,
    TooltipModule,
    MultiSelectModule,
    ToastModule
  ]
})
export class PrimeNgModule { }
