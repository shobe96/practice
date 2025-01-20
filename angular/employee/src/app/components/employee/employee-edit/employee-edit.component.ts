import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department/department.service';
import { DepartmentSearchResult } from '../../../models/department-search-result.model';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';
import { Skill } from '../../../models/skill.model';
import { SkillService } from '../../../services/skill/skill.service';
import { SkillSearchResult } from '../../../models/skill-search-result.model';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  standalone: false
})
export class EmployeeEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {

  @Input() public id: number | null = null;
  @Input() public disable: boolean = false;
  @Output() public cancelEmiitter: EventEmitter<any> = new EventEmitter();
  public employee: Employee = {};
  public employeeFormGroup!: FormGroup;
  public departments: Department[] = [];
  public skills: Skill[] = [];

  private employeeService: EmployeeService = inject(EmployeeService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private departmentService: DepartmentService = inject(DepartmentService);
  private messageService: MessageService = inject(MessageService);
  private skillService: SkillService = inject(SkillService);

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  ngOnInit(): void {
    this.departmentService.getAllDepartments(true).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => { }
    });

    this.skillService.getAllSkills(true).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
      },
      error: (err: any) => {
        !err.status ? fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService) : fireToast('error', 'Error', `${err.message}`, this.messageService);
      },
      complete: () => { }
    });

    this.buildForm();
  }

  private buildForm() {
    this.employeeFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      department: [{}],
      selectedSkills: [[]]
    });
  }

  private initFormFields() {
    if (this.id) {
      const employeeObserver: any = {
        next: (value: Employee) => {
          this.employee = value;
          this.setValuesToFields(value);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      };
      this.employeeService.getEmployee(this.id).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(employeeObserver);
    } else {
      this.setValuesToFields({});
    }

    this.disable ? this.disableFields() : this.enableFields();
  }

  public cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  public submit() {
    this.employee.name = this.employeeFormGroup.controls['name'].value;
    this.employee.surname = this.employeeFormGroup.controls['surname'].value;
    this.employee.email = this.employeeFormGroup.controls['email'].value;
    this.employee.department = this.employeeFormGroup.controls['department'].value;
    this.employee.skills = this.employeeFormGroup.controls['selectedSkills'].value;
    const employeeObserver: any = {
      next: (value: Employee) => {
        !this.id ? fireToast("success", "Success", `Employee ${value.name} ${value.surname} has been created`, this.messageService) : fireToast("success", "Success", `Employee ${value.name} ${value.surname} has been updated`, this.messageService);
        this.cancel(true);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    !this.id ? this.employeeService.save(this.employee).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(employeeObserver) : this.employeeService.update(this.employee).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(employeeObserver);
  }

  private setValuesToFields(value: Employee) {
    const name = value.name ?? '';
    const surname = value.surname ?? ''
    const email = value.email ?? '';
    const department = value.department ?? {};
    const selectedSkills = value.skills ?? [];
    if (this.employeeFormGroup) {
      this.employeeFormGroup.controls['name'].setValue(name);
      this.employeeFormGroup.controls['surname'].setValue(surname);
      this.employeeFormGroup.controls['email'].setValue(email);
      this.employeeFormGroup.controls['department'].setValue(department);
      this.employeeFormGroup.controls['selectedSkills'].setValue(selectedSkills);
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
}
