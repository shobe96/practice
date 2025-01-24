import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { EmployeeEditFacadeService } from '../../../services/employee/employee-edit.facade.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {

  @Input() employee: Employee | null = {};
  @Input() disable: boolean = false;
  @Output() cancelEmiitter: EventEmitter<any> = new EventEmitter();
  employeeFormGroup!: FormGroup;
  employeeEditFacade: EmployeeEditFacadeService = inject(EmployeeEditFacadeService);

  private formBuilder: FormBuilder = inject(FormBuilder);

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  ngOnInit(): void {
    this.employeeEditFacade.loadSelectOptions();
    this.buildForm();
  }

  private buildForm() {
    this.employeeFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      department: [{}],
      skills: [[]]
    });
  }

  private initFormFields() {
    this.setValuesToFields();
    this.disable ? this.disableFields() : this.enableFields();
  }

  cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  submit() {
    this.employee = this.getFormValues();
    this.employeeEditFacade.submit(this.employee)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((value: Employee) => {
        if (Object.keys(value)) {
          this.cancel(true);
        }
      });
  }

  private setValuesToFields() {
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

  private disableFields(): void {
    if (this.employeeFormGroup) {
      this.employeeFormGroup.controls['name'].disable();
      this.employeeFormGroup.controls['surname'].disable();
      this.employeeFormGroup.controls['email'].disable();
    }
  }
  private enableFields(): void {
    if (this.employeeFormGroup) {
      this.employeeFormGroup.controls['name'].enable();
      this.employeeFormGroup.controls['surname'].enable();
      this.employeeFormGroup.controls['email'].enable();
    }
  }

  private getFormValues(): Employee {
    const employee: Employee = { ...this.employee };
    for (const field in this.employeeFormGroup.controls) {
      employee[field] = this.employeeFormGroup.controls[field].value;
    }
    return employee;
  }
}
