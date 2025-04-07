import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Department } from '../../data-access/department.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';
import { DepartmentEditFacadeService } from '../../data-access/department-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomMessageService } from '../../../shared/data-access/custom-message.service';
import { InputText } from 'primeng/inputtext';
import { AsyncPipe, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, NgIf, Button, ProgressSpinner, AsyncPipe]
})
export class DepartmentEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  departmentFormGroup!: FormGroup;

  @Input() department: Department | null = {};
  @Input() disable = false;

  departmentEditFacade: DepartmentEditFacadeService = inject(DepartmentEditFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _departmentEditFacade: DepartmentEditFacadeService = inject(DepartmentEditFacadeService);
  private _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  ngOnInit(): void {
    this.buildForm();
    this._initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  buildForm() {
    this.departmentFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]]
    });
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    const departmentObserver = {
      next: (value: Department) => {
        if (Object.keys(value)) {
          this.cancel();
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this.department = this._getFormValues();
    this._departmentEditFacade.submit(this.department)
      .pipe(
        takeUntil(this.componentIsDestroyed$),
      )
      .subscribe(departmentObserver);
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

  private _initFormFields() {
    this._setValuesToFields();
    if (this.disable) this._disableFields();
    else this._enableFields();
  }
}
