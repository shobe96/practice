import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ActionButtons } from '../../data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-filter-wrapper',
  imports: [
    AccordionModule,
    ReactiveFormsModule,
    IconButtonComponent,
    TranslatePipe
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

  private readonly _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  readonly actionButtons = computed((): ActionButtons<void>[] => {
    this.currentLang();
    return [
    {
      icon: 'pi pi-trash',
      action: () => this.onClear(),
      severity: 'danger',
      tooltip: this._translateService.instant("FILTERS.CLEAR")
    },
    {
      icon: 'pi pi-refresh',
      action: () => this.onRefresh(),
      severity: 'success',
      tooltip: this._translateService.instant("FILTERS.REFRESH")
    }
  ]
  });
}
