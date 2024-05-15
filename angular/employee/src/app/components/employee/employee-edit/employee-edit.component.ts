import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class EmployeeEditComponent implements OnInit, OnDestroy {

  id: number | null = null;
  private routeSubscription$!: Subscription;
  private employeeSubscription$!: Subscription;
  private departmentSubscription$!: Subscription
  employee: Employee = new Employee();
  employeeFormGroup!: FormGroup;
  departments: Department[] = [];
  skills: Skill[] = [];

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private skillService: SkillService
  ) { }
  ngOnDestroy(): void {
    if (this.routeSubscription$ !== undefined) {
      this.routeSubscription$.unsubscribe();
    }
    if (this.employeeSubscription$ !== undefined) {
      this.employeeSubscription$.unsubscribe();
    }

    if (this.departmentSubscription$ !== undefined) {
      this.departmentSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.departmentSubscription$ = this.departmentService.getAllDepartments(true).subscribe({
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
      },
      error: (err: any) => {
        console.log(err)
      },
      complete: () => { console.log("Completed") }
    });
    // this.employeService.mySub.subscribe((val) => {console.log(val)});
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["employeeId"] !== undefined && params["employeeId"] !== null ? params["employeeId"] : null;
      this.initFormFields();
    });

    this.skillService.getAllSkills(true).subscribe({
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
      },
      error: (err: any) => {
        if (err.status === 0) {
          fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService);
        } else {
          fireToast('error', 'Error', `${err.message}`, this.messageService);
        }
      },
      complete: () => { }
    });


    this.buildForm();
  }

  buildForm() {
    this.employeeFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      department: [{}],
      selectedSkills: [[]]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const employeeObserver: any = {
        next: (value: Employee) => {
          this.employee = value;
          this.employeeFormGroup.controls['name'].setValue(value.name);
          this.employeeFormGroup.controls['surname'].setValue(value.surname);
          this.employeeFormGroup.controls['email'].setValue(value.email);
          this.employeeFormGroup.controls['department'].setValue(value.department);
          this.employeeFormGroup.controls['selectedSkills'].setValue(value.skills);
        },
        error: (err: any) => { console.log(err) },
        complete: () => { console.log('Completed') }
      };
      this.employeeSubscription$ = this.employeeService.getEmployee(this.id).subscribe(employeeObserver);
    }
  }

  back() {
    this.router.navigate(["employee/list"]);
  }

  submit() {
    this.employee.name = this.employeeFormGroup.controls['name'].value;
    this.employee.surname = this.employeeFormGroup.controls['surname'].value;
    this.employee.email = this.employeeFormGroup.controls['email'].value;
    this.employee.department = this.employeeFormGroup.controls['department'].value;
    this.employee.skills = this.employeeFormGroup.controls['selectedSkills'].value;
    const employeeObserver: any = {
      next: (value: Employee) => {
        if (this.id === null) {
          this.router.navigate([`employee/details/${value.id}`])
          fireToast("success", "Success", `Employee ${value.name} ${value.surname} has been created`, this.messageService);
        } else {
          fireToast("success", "Success", `Employee ${value.name} ${value.surname} has been updated`, this.messageService);
        }
      },
      error: (err: any) => { console.log(err) },
      complete: () => { },
    }
    if (this.id === null) {
      this.employeeService.save(this.employee).subscribe(employeeObserver);
    } else {
      this.employeeService.update(this.employee).subscribe(employeeObserver);
    }
  }
}
