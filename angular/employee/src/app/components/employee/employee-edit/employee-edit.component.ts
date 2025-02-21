import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { EmployeeEditFacadeService } from '../../../services/employee/employee-edit.facade.service';
import { takeUntil } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomMessageService } from '../../../services/custom-message.service';
import { InputText } from 'primeng/inputtext';
import { NgIf, AsyncPipe } from '@angular/common';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, NgIf, Select, MultiSelect, Button, AsyncPipe]
})
export class EmployeeEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  employeeFormGroup!: FormGroup;

  @Input() employee: Employee | null = {};
  @Input() disable = false;

  employeeEditFacade: EmployeeEditFacadeService = inject(EmployeeEditFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  ngOnInit(): void {
    this.employeeEditFacade.loadSelectOptions();
    this._buildForm();
    this._initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    const employeeObserver = {
      next: (value: Employee) => {
        if (Object.keys(value)) {
          this.cancel();
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this.employee = this._getFormValues();
    this.employeeEditFacade.submit(this.employee)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe(employeeObserver);
  }

  private _buildForm() {
    this.employeeFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      department: [{}],
      skills: [[]]
    });
  }

  private _initFormFields() {
    this._setValuesToFields();
    if (this.disable) this._disableFields();
    else this._enableFields();
  }

  private _setValuesToFields() {
    if (this.employee) {
      const name = this.employee.name ?? '';
      const surname = this.employee.surname ?? ''
      const email = this.employee.email ?? '';
      const department = this.employee.department ?? {};
      const skills = this.employee.skills ?? [];
      if (this.employeeFormGroup) {
        this.employeeFormGroup.controls['name'].setValue(name);
        this.employeeFormGroup.controls['surname'].setValue(surname);
        this.employeeFormGroup.controls['email'].setValue(email);
        this.employeeFormGroup.controls['department'].setValue(department);
        this.employeeFormGroup.controls['skills'].setValue(skills);
      }
    }
  }

  private _disableFields(): void {
    if (this.employeeFormGroup) {
      this.employeeFormGroup.controls['name'].disable();
      this.employeeFormGroup.controls['surname'].disable();
      this.employeeFormGroup.controls['email'].disable();
    }
  }
  private _enableFields(): void {
    if (this.employeeFormGroup) {
      this.employeeFormGroup.controls['name'].enable();
      this.employeeFormGroup.controls['surname'].enable();
      this.employeeFormGroup.controls['email'].enable();
    }
  }

  private _getFormValues(): Employee {
    const employee: Employee = { ...this.employee };
    for (const field in this.employeeFormGroup.controls) {
      employee[field] = this.employeeFormGroup.controls[field].value;
    }
    return employee;
  }
}
