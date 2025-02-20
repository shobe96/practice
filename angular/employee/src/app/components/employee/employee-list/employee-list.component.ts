import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { EmployeeListFacadeService } from '../../../services/employee/employee-list.facade.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, ReactiveFormsModule, InputText, Button, Tooltip, NgIf, TableModule, PrimeTemplate, Paginator, AsyncPipe, DatePipe]
})
export class EmployeeListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  employeeFormGroup!: FormGroup;
  employeeSearch: Employee = {};
  employeeId: number | null = 0;

  employeeListFacade: EmployeeListFacadeService = inject(EmployeeListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _dialogService: DialogService = inject(DialogService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    super();
    this._subscribeToRoute();
  }

  ngOnInit(): void {
    this._buildForm();
    this.employeeListFacade.retrieve();
    this._subscribeToFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  addNew(): void {
    this.goToEdit(null, false);
  }

  clear(): void {
    this._clearSearchFields();
    this.employeeListFacade.clear();
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
    this.employeeListFacade.onPageChange(event);
  }

  refresh(): void {
    this.employeeListFacade.retrieve();
  }

  showDeleteDialog(id: number): void {
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
        this.employeeListFacade.delete(id);
      },
    });
  }

  private _buildForm() {
    this.employeeFormGroup = this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
    });
  }

  private _subscribeToFormGroup() {
    this.employeeFormGroup
      .valueChanges
      .pipe(
        takeUntil(this.componentIsDestroyed$),
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe((value: Employee) => {
        if (value.name || value.surname || value.email) {
          this._router.navigate([], { queryParams: { name: value.name, surname: value.surname, email: value.email }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.employeeFormGroup.controls['name'].setValue('');
    this.employeeFormGroup.controls['surname'].setValue('');
    this.employeeFormGroup.controls['email'].setValue('');
    this._router.navigate([], { queryParams: { name: '', surname: '', email: '' }, queryParamsHandling: 'merge' })
  }

  private _subscribeToRoute() {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe(
        (params: Employee) => {
          this.employeeListFacade.search(params);
        });
  }
}
