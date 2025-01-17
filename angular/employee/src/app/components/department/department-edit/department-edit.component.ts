import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Department } from '../../../models/department.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department/department.service';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-department-edit',
    templateUrl: './department-edit.component.html',
    styleUrl: './department-edit.component.scss',
    standalone: false
})
export class DepartmentEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {

  @Input() public id: number | null = null;
  @Input() public disable: boolean = false;
  @Output() public cancelEmiitter: EventEmitter<any> = new EventEmitter();
  public department: Department = {};
  public departmentFormGroup!: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private departmentService: DepartmentService = inject(DepartmentService);
  private messageService: MessageService = inject(MessageService);

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  ngOnInit(): void {
    this.buildForm();
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
      this.departmentService.getDepartment(this.id).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(departmentObserver);
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
      this.departmentService.save(this.department).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(departmentObserver) :
      this.departmentService.update(this.department).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(departmentObserver);
  }

  private setValuesToFields(value: Department) {
    const name = value.name ?? '';
    if (this.departmentFormGroup) {
      this.departmentFormGroup.controls['name'].setValue(name);
    }
  }
}
