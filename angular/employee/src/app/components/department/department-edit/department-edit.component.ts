import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Department } from '../../../models/department.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';
import { DepartmentEditFacadeService } from '../../../services/department/department-edit.facade.service';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {

  @Input() department: Department | null = {};
  @Input() disable = false;
  @Output() cancelEmiitter = new EventEmitter<any>();
  departmentFormGroup!: FormGroup;
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _departmentEditFacade: DepartmentEditFacadeService = inject(DepartmentEditFacadeService);

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
    this._initFormFields();
  }

  buildForm() {
    this.departmentFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]]
    });
  }

  private _initFormFields() {
    this._setValuesToFields();
    if (this.disable) this._disableFields();
    else this._enableFields();
  }

  cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  submit() {
    this.department = this._getFormValues();
    this._departmentEditFacade.submit(this.department)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((value: Department) => {
        if (Object.keys(value)) {
          this.cancel(true);
        }
      });
  }

  private _setValuesToFields() {
    if (this.department) {
      const name = this.department.name ?? '';
      if (this.departmentFormGroup) {
        this.departmentFormGroup.controls['name'].setValue(name);
      }
    }
  }

  private _getFormValues(): Department {
    const department: Department = { ...this.department };
    for (const field in this.departmentFormGroup.controls) {
      department[field] = this.departmentFormGroup.controls[field].value;
    }
    return department;
  }

  private _disableFields(): void {
    if (this.departmentFormGroup) {
      this.departmentFormGroup.controls['name'].disable();
    }
  }
  private _enableFields(): void {
    if (this.departmentFormGroup) {
      this.departmentFormGroup.controls['name'].enable();
    }
  }
}
