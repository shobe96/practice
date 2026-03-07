import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { Employee } from '../../data-access/employee.model';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { EmployeeListFacadeService } from '../../data-access/employee-list.facade.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { ConfirmationService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    Button,
    TableModule,
    Paginator,
    DatePipe,
    ProgressSpinner,
    IconButtonComponent,
    SearchFilterWrapperComponent,
    TranslatePipe,
  ],
})
export class EmployeeListComponent {
  private readonly _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  addNewLabel = computed(() => {
    this.currentLang();
    return this._translateService.instant('EMPLOYEES.LIST.ADD');
  });

  nameSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('EMPLOYEES.LIST.FILTERS.NAME');
  });

  surnameSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('EMPLOYEES.LIST.FILTERS.SURNAME');
  });

  emailSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('EMPLOYEES.LIST.FILTERS.EMAIL');
  });

  employeeId: number | null = 0;
  readonly actionButtons = computed((): ActionButtons<Employee>[] => {
    const feature = this.currentLang() === 'en' ? 'Employee' : 'Zapsolenog';

    return [
      {
        icon: 'pi pi-eye',
        action: (emp: Employee) => this.goToDetails(emp),
        severity: 'success',
        // Translate the tooltips
        tooltip: this._translateService.instant('TABLE.ACTIONS.VIEW', {
          feature: feature,
        }),
      },
      {
        icon: 'pi pi-pencil',
        action: (emp: Employee) => this.goToEdit(emp, false),
        severity: 'warn',
        tooltip: this._translateService.instant('TABLE.ACTIONS.EDIT', {
          feature: feature,
        }),
      },
      {
        icon: 'pi pi-trash',
        action: (emp: Employee) => this.showDeleteDialog(emp.id),
        severity: 'danger',
        tooltip: this._translateService.instant('TABLE.ACTIONS.DELETE', {
          feature: feature,
        }),
      },
    ];
  });

  private readonly _employeeListFacade = inject(EmployeeListFacadeService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _dialogService = inject(DialogService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  employeeFormGroup = this._formBuilder.group({
    name: [''],
    surname: [''],
    email: [''],
  });

  private readonly _queryParamsSignal = toSignal(
    this._activatedRoute.queryParams,
    {
      initialValue: {},
    }
  );

  private readonly _employeeFormSignal = toSignal(
    this.employeeFormGroup.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ),
    { initialValue: this.employeeFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    size: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._employeeListFacade.viewModel$, {
    initialValue: {
      data: [],
      page: this._defaultPage,
      rowsPerPage: [],
      loading: false,
    },
  });

  constructor() {
    effect(() => {
      const params = this._queryParamsSignal();
      this._employeeListFacade.search(params);
    });

    effect(() => {
      const value = this._employeeFormSignal();
      const { name, surname, email } = value;
      if (name || surname || email) {
        this._router.navigate([], {
          queryParams: { name, surname, email },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  addNew(): void {
    this.goToEdit(null, false);
  }

  clear(): void {
    this._clearSearchFields();
    this._employeeListFacade.clear();
  }

  goToDetails(employee: Employee): void {
    this.goToEdit(employee, true);
  }

  goToEdit(employee: Employee | null, disable: boolean): void {
    const newLabel = this.currentLang() === 'en' ? 'Employee' : 'novog Zaposlenog';
    const title = employee
      ? `${this._translateService.instant('HOME.PANEL.GENERAL.EMPLOYEE')} ${
          employee.id
        }`
      : this._translateService.instant('FORM.TITLE', { feature: newLabel });
    const dialogRef = this._dialogService.open(EmployeeEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        employee: employee,
        disable: disable,
      },
      baseZIndex: 10000,
      maximizable: true,
    });

    dialogRef?.onClose.subscribe((value: boolean) => {
      if (value) {
        this.refresh();
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this._employeeListFacade.onPageChange(event);
  }

  refresh(): void {
    this._employeeListFacade.retrieve();
  }

  showDeleteDialog(id: number | undefined): void {
    if (id) {
      const feature = this.currentLang() === 'en' ? 'employee' : 'zaposlenog';
      this._confirmationService.confirm({
        message: this._translateService.instant('CONFITMATION.MESSAGE', {
          feature: feature,
          id: id,
        }),
        header: this._translateService.instant('CONFITMATION.TITLE'),
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: this._translateService.instant('CONFITMATION.CANCEL'),
          severity: 'danger',
        },
        acceptButtonProps: {
          label: this._translateService.instant('CONFITMATION.ACCEPT'),
        },
        accept: () => {
          this._employeeListFacade.delete(id);
        },
      });
    }
  }

  private _clearSearchFields(): void {
    this.employeeFormGroup.controls['name'].setValue('');
    this.employeeFormGroup.controls['surname'].setValue('');
    this.employeeFormGroup.controls['email'].setValue('');
    this._router.navigate([], {
      queryParams: { name: '', surname: '', email: '' },
      queryParamsHandling: 'merge',
    });
  }
}
