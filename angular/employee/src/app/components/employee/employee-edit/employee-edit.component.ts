import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department/department.service';

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

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService) { }
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
      next: (value: any) => {
        this.departments = value;
      },
      error: (err: any) => {
        console.log(err)
      },
      complete: () => {console.log("Completed")}
    });
    // this.employeService.mySub.subscribe((val) => {console.log(val)});
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["employeeId"] !== undefined && params["employeeId"] !== null ? params["employeeId"] : null;
      this.initFormFields();
    });
  }

  buildForm() {
    this.employeeFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      department: [{}]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const employeObserver: any = {
        next: (value: Employee) => {
          this.employee = value;
          this.employeeFormGroup.controls['name'].setValue(value.name);
          this.employeeFormGroup.controls['surname'].setValue(value.surname);
          this.employeeFormGroup.controls['email'].setValue(value.email);
          this.employeeFormGroup.controls['department'].setValue(value.department);
        },
        error: (err: any) => { console.log(err) },
        complete: () => { console.log('Completed') }
      };
      this.employeeSubscription$ = this.employeeService.getEmployee(this.id).subscribe(employeObserver);
    }
  }

  back() {
    this.router.navigate(["employee/list"])
  }

  submit() {
    console.log(this.employee);
    this.employee.name = this.employeeFormGroup.controls['name'].value;
    this.employee.surname = this.employeeFormGroup.controls['surname'].value;
    this.employee.email = this.employeeFormGroup.controls['email'].value;
    this.employee.department = this.employeeFormGroup.controls['department'].value;
    const employeeObserver: any = {
      next: (value: any) => {
        if (this.id === null) {
          this.router.navigate([`employee/details/${value.id}`])
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
