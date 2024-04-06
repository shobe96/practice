import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Department } from '../../../models/department.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department/department.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss'
})
export class DepartmentEditComponent implements OnInit, OnDestroy {

  id: number | null = null;
  private routeSubscription$!: Subscription;
  private departmentSubscription$!: Subscription;
  department: Department = new Department();
  departmentFormGroup!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService) { }
  ngOnDestroy(): void {
    if (this.routeSubscription$ !== undefined) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.departmentSubscription$ !== undefined) {
      this.departmentSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {

    // this.employeService.mySub.next(1);
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["departmentId"] !== undefined && params["departmentId"] !== null ? params["departmentId"] : null;;
      this.initFormFields();
    });
  }

  buildForm() {
    this.departmentFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const departmentObserver: any = {
        next: (value: Employee) => {
          this.department = value;
          this.departmentFormGroup.controls['name'].setValue(value.name);
        },
        error: (err: any) => { console.log(err) },
        complete: () => { console.log('Completed') }
      };
      this.departmentSubscription$ = this.departmentService.getDepartment(this.id).subscribe(departmentObserver);
    }
  }

  back() {
    this.router.navigate(["department/list"])
  }

  submit() {
    this.department.name = this.departmentFormGroup.controls['name'].value;

    const departmentObserver: any = {
      next: (value: any) => {
        if (this.id === null) {
          this.router.navigate([`employee/details/${value.id}`])
        }
      },
      error: (err: any) => { console.log(err) },
      complete: () => { },
    }
    if (this.id === null) {
      this.departmentService.save(this.department).subscribe(departmentObserver);
    } else {
      this.departmentService.update(this.department).subscribe(departmentObserver);
    }
  }
}
