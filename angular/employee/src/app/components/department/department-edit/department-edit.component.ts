import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Department } from '../../../models/department.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department/department.service';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss'
})
export class DepartmentEditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public id: number | null = null;
  @Input() public disable: boolean = false;
  @Output() public cancelEmiitter: EventEmitter<any> = new EventEmitter();
  private routeSubscription$!: Subscription;
  private departmentSubscription$!: Subscription;
  public department: Department = new Department();
  public departmentFormGroup!: FormGroup;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private departmentService: DepartmentService = inject(DepartmentService);
  private messageService: MessageService = inject(MessageService);

  ngOnDestroy(): void {
    if (this.routeSubscription$) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.departmentSubscription$) {
      this.departmentSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["departmentId"] ?? null;;
      this.initFormFields();
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  buildForm() {
    this.departmentFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]]
    });
  }

  private initFormFields() {
    if (this.id) {
      const departmentObserver: any = {
        next: (value: Department) => {
          this.department = value;
          this.setValuesToFields(value);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { console.log('Completed') }
      };
      this.departmentSubscription$ = this.departmentService.getDepartment(this.id).subscribe(departmentObserver);
    } else {
      this.setValuesToFields({});
    }
  }

  public cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save});
  }

  submit() {
    this.department.name = this.departmentFormGroup.controls['name'].value;

    const departmentObserver: any = {
      next: (value: Department) => {
        !this.id ? fireToast("success", "Success", `Department ${value.name} has been created`, this.messageService) : fireToast("success", "Success", `Department ${value.name} has been updated`, this.messageService);
        this.cancel(true);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    !this.id ?
      this.departmentService.save(this.department).subscribe(departmentObserver) :
      this.departmentService.update(this.department).subscribe(departmentObserver);
  }

  private setValuesToFields(value: Department) {
    const name = value.name ?? '';
    this.departmentFormGroup.controls['name'].setValue(name);
  }
}
