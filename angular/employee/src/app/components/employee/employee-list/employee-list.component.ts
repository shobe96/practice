import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { PageEvent } from '../../../models/page-event.model';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';
import { CrudOperations } from '../../../shared/crud-operations';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { EmployeeListFacadeService } from '../../../services/employee/employee-list.facade.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: false
})
export class EmployeeListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  private messageService: MessageService = inject(MessageService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  public employeeFormGroup!: FormGroup;
  public employeeSearch: Employee = {};
  public employeeId: number | null = 0;
  public employees: Employee[] = [];
  public visible: boolean = false;
  public editVisible: boolean = false;
  public modalTitle: string = '';
  public disable: boolean = false;
  public employeeResponse$!: Observable<EmployeeSearchResult>;
  public employeeListFacade: EmployeeListFacadeService = inject(EmployeeListFacadeService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.employeeListFacade.getAll(false);
    this.subsribeToFormGroup();
  }

  private buildForm() {
    this.employeeFormGroup = this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
    });
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  public addNew(): void {
    this.goToEdit(null);
  }

  public clear(): void {
    this.clearSearchFields();
    this.employeeListFacade.clear();
  }

  public delete(): void {
    this.employeeListFacade.delete(this.employeeId, this.employeeSearch);
  }

  public goToDetails(employee: Employee): void {
    this.employeeListFacade.setDialogParams(employee, `Employee ${employee.id}`, true, false, true);
  }

  public goToEdit(employee: Employee | null): void {
    const title = employee ? `Employee ${employee.id}` : 'Add new Employee';
    this.employeeListFacade.setDialogParams(employee, title, true, false, false);
  }

  public handleCancel(event: any): void {
    if (event.save) {
      this.employeeListFacade.setDialogParams(null, '', event.visible, false, false);
      this.refresh();
    }
  }

  public onPageChange(event: PaginatorState): void {
    this.employeeListFacade.onPageChange(this.employeeSearch, event);
  }

  public refresh(): void {
    this.employeeListFacade.retrieve(this.employeeSearch);
  }

  public showDeleteDialog(visible: boolean, id?: number): void {
    this.employeeId = id ?? 0;
    this.employeeListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private subsribeToFormGroup() {
    this.employeeFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((value: Employee) => {
        if (value.name || value.surname || value.email) {
          this.employeeSearch = value;
          this.employeeListFacade.search(value);
        }
      });
  }

  private clearSearchFields() {
    this.employeeFormGroup.controls['name'].setValue('');
    this.employeeFormGroup.controls['surname'].setValue('');
    this.employeeFormGroup.controls['email'].setValue('');
    this.employeeSearch = {};
  }
}
