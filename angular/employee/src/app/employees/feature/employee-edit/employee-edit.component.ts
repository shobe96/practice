import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Employee } from '../../data-access/employee.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeEditFacadeService } from '../../data-access/employee-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    MultiSelect,
    Button,
    ProgressSpinner,
    ValidationMessagesComponent
  ],
  providers: [EmployeeEditFacadeService]
})
export class EmployeeEditComponent implements OnInit {

  employeeFormGroup!: FormGroup;

  @Input() employee: Employee = {};
  @Input() disable = false;

  employeeEditFacade = inject(EmployeeEditFacadeService);
  viewModel = toSignal(this.employeeEditFacade.viewModel$, {
    initialValue: {
      skills: [],
      departments: [],
      loading: false
    }
  });
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    this.employeeEditFacade.loadSelectOptions();
    this._buildForm();
    this._initFormFields();
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    this.employee = this._getFormValues();
    this.employeeEditFacade.submit(this.employee).subscribe(res => {
      if (res) {
        this._dialogRef.close(true);
      }
    });
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
    this._setFormDisabledState();
  }

  private _setValuesToFields(): void {
    if (!this.employee) return;
    this.employeeFormGroup.patchValue({
      name: this.employee.name ?? '',
      surname: this.employee.surname ?? '',
      email: this.employee.email ?? '',
      department: this.employee.department ?? {},
      skills: this.employee.skills ?? []
    })
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

  isInvalid(controlName: string): boolean {
    const control = this.employeeFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }

  private _setFormDisabledState(): void {
    const controls = ['name', 'surname', 'email', 'department', 'skills'];
    controls.forEach(control =>
      this.employeeFormGroup.controls[control][this.disable ? 'disable' : 'enable']()
    );
  }
}
