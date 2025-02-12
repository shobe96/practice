import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeListFacadeService } from '../../../services/employee/employee-list.facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  employeeFormGroup!: FormGroup;
  employeeSearch: Employee = {};
  employeeId: number | null = 0;

  employeeListFacade: EmployeeListFacadeService = inject(EmployeeListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  constructor() {
    super();
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
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.employeeListFacade.clear();
  }

  delete(): void {
    this.employeeListFacade.delete(this.employeeId);
  }

  goToDetails(employee: Employee): void {
    this.employeeListFacade.setDialogParams(employee, `Employee ${employee.id}`, true, false, true);
  }

  goToEdit(employee: Employee | null): void {
    const title = employee ? `Employee ${employee.id}` : 'Add new Employee';
    this.employeeListFacade.setDialogParams(employee, title, true, false, false);
  }

  handleCancel(event: any): void {
    this.employeeListFacade.setDialogParams(null, '', event.visible, false, false);
    if (event.save) {
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.employeeListFacade.onPageChange(event);
  }

  refresh(): void {
    this.employeeListFacade.retrieve();
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.employeeId = id ?? 0;
    this.employeeListFacade.setDialogParams(null, 'Warning', false, visible, false);
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
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
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
}
