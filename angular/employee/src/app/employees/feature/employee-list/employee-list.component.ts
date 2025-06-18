import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Employee } from '../../data-access/employee.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
    SearchFilterWrapperComponent
  ]
})
export class EmployeeListComponent {

  employeeSearch: Employee = {};
  employeeId: number | null = 0;
  actionButtons: ActionButtons<Employee>[] = [
    {
      icon: 'pi pi-eye',
      action: (emp: Employee) => this.goToDetails(emp),
      severity: 'success',
      tooltip: 'View Employee'
    },
    {
      icon: 'pi pi-pencil',
      action: (emp: Employee) => this.goToEdit(emp, false),
      severity: 'warn',
      tooltip: 'Edit Employee'
    },
    {
      icon: 'pi pi-trash',
      action: (emp: Employee) => this.showDeleteDialog(emp.id),
      severity: 'danger',
      tooltip: 'Delete Employee'
    }
  ];

  private readonly _employeeListFacade = inject(EmployeeListFacadeService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _dialogService = inject(DialogService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  employeeFormGroup = this._buildForm();

  private readonly _queryParamsSignal = toSignal(this._activatedRoute.queryParams, {
    initialValue: {}
  });

  private readonly _employeeFormSignal = toSignal(
    this.employeeFormGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()),
    { initialValue: this.employeeFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }

  viewModel = toSignal(this._employeeListFacade.viewModel$, {
    initialValue: {
      employees: [],
      page: this._defaultPage,
      rowsPerPage: [],
      loading: false
    }
  });

  constructor() {

    this._buildForm();
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

  ngOnInit(): void {
    this._employeeListFacade.retrieve();
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
    const title = employee ? `Employee ${employee.id}` : 'Add new Employee';
    this._dialogService.open(EmployeeEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        employee: employee,
        disable: disable
      },
      baseZIndex: 10000,
      maximizable: true
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
      this._confirmationService.confirm({
        message: `Are you sure you want to delete employee with id: ${id}`,
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'danger'
        },
        acceptButtonProps: {
          label: 'Delete',
        },
        accept: () => {
          this._employeeListFacade.delete(id);
        },
      });
    }
  }

  private _buildForm() {
    return this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
    });
  }

  private _clearSearchFields() {
    this.employeeFormGroup.controls['name'].setValue('');
    this.employeeFormGroup.controls['surname'].setValue('');
    this.employeeFormGroup.controls['email'].setValue('');
    this._router.navigate([], { queryParams: { name: '', surname: '', email: '' }, queryParamsHandling: 'merge' })
  }
}
