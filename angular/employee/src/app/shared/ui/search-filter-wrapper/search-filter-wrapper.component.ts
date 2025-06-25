import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ActionButtons } from '../../data-access/action-buttons.model';

@Component({
  selector: 'app-search-filter-wrapper',
  imports: [
    AccordionModule,
    ReactiveFormsModule,
    IconButtonComponent
  ],
  templateUrl: './search-filter-wrapper.component.html',
  styleUrl: './search-filter-wrapper.component.scss',
})
export class SearchFilterWrapperComponent {
  @Input() formGroup!: FormGroup;

  @Output() clear = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  onClear() {
    this.clear.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  actionButtons: ActionButtons<void>[] = [
    {
      icon: 'pi pi-trash',
      action: () => this.onClear(),
      severity: 'danger',
      tooltip: 'Clear Filters'
    },
    {
      icon: 'pi pi-refresh',
      action: () => this.onRefresh(),
      severity: 'success',
      tooltip: 'Refresh List'
    }
  ]
}
