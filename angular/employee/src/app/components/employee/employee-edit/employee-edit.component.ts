import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() id: number | null = null;
  @Output() cancelEmiitter: EventEmitter<boolean> = new EventEmitter();
  private routeSubscription$!: Subscription;
  private employeeSubscription$!: Subscription;
  private departmentSubscription$!: Subscription
  public employee: Employee = new Employee();
  public employeeFormGroup!: FormGroup;
  public departments: Department[] = [];
  public skills: Skill[] = [];

  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private departmentService: DepartmentService = inject(DepartmentService);
  private messageService: MessageService = inject(MessageService);
  private skillService: SkillService = inject(SkillService);

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription$) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.employeeSubscription$) {
      this.employeeSubscription$.unsubscribe();
    }

    if (this.departmentSubscription$) {
      this.departmentSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.departmentSubscription$ = this.departmentService.getAllDepartments(true).subscribe({
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => { }
    });

    this.skillService.getAllSkills(true).subscribe({
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
          this.employeeFormGroup.controls['name'].setValue(value.name);
          this.employeeFormGroup.controls['surname'].setValue(value.surname);
          this.employeeFormGroup.controls['email'].setValue(value.email);
          this.employeeFormGroup.controls['department'].setValue(value.department);
          this.employeeFormGroup.controls['selectedSkills'].setValue(value.skills);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { console.log('Completed') }
      };
      this.employeeSubscription$ = this.employeeService.getEmployee(this.id).subscribe(employeeObserver);
    } else {
      this.employeeFormGroup.controls['name'].setValue('');
      this.employeeFormGroup.controls['surname'].setValue('');
      this.employeeFormGroup.controls['email'].setValue('');
      this.employeeFormGroup.controls['department'].setValue({});
      this.employeeFormGroup.controls['selectedSkills'].setValue([]);
    }
  }

  public cancel() {
    this.cancelEmiitter.emit(false);
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
        this.cancel();
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    !this.id ? this.employeeService.save(this.employee).subscribe(employeeObserver) : this.employeeService.update(this.employee).subscribe(employeeObserver);
  }
}
