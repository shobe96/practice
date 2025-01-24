import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeListFacadeService } from '../../../services/employee/employee-list.facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  employeeFormGroup!: FormGroup;
  employeeSearch: Employee = {};
  employeeId: number | null = 0;
  employeeListFacade: EmployeeListFacadeService = inject(EmployeeListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.employeeListFacade.getAll(false);
    this._subsribeToFormGroup();
  }

  private _buildForm() {
    this.employeeFormGroup = this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
    });
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.employeeListFacade.clear();
  }

  delete(): void {
    this.employeeListFacade.delete(this.employeeId, this.employeeSearch);
  }

  goToDetails(employee: Employee): void {
    this.employeeListFacade.setDialogParams(employee, `Employee ${employee.id}`, true, false, true);
  }

  goToEdit(employee: Employee | null): void {
    const title = employee ? `Employee ${employee.id}` : 'Add new Employee';
    this.employeeListFacade.setDialogParams(employee, title, true, false, false);
  }

  handleCancel(event: any): void {
    if (event.save) {
      this.employeeListFacade.setDialogParams(null, '', event.visible, false, false);
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.employeeListFacade.onPageChange(this.employeeSearch, event);
  }

  refresh(): void {
    this.employeeListFacade.retrieve(this.employeeSearch);
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.employeeId = id ?? 0;
    this.employeeListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subsribeToFormGroup() {
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

  private _clearSearchFields() {
    this.employeeFormGroup.controls['name'].setValue('');
    this.employeeFormGroup.controls['surname'].setValue('');
    this.employeeFormGroup.controls['email'].setValue('');
    this.employeeSearch = {};
  }
}
