import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Department } from '../../data-access/department.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentEditFacadeService } from '../../data-access/department-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, Button, ProgressSpinner, ValidationMessagesComponent],
  providers: [DepartmentEditFacadeService]
})
export class DepartmentEditComponent implements OnInit {

  departmentFormGroup!: FormGroup;

  @Input() department: Department | null = {};
  @Input() disable = false;

  private _departmentEditFacade = inject(DepartmentEditFacadeService);
  viewModel = toSignal(this._departmentEditFacade.viewModel$, { initialValue: { loading: false } });

  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(DynamicDialogRef);
  private _translateService = inject(TranslateService);

  ngOnInit(): void {
    this.buildForm();
    this._initFormFields();
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
    this.department = this._getFormValues();
    this._departmentEditFacade.submit(this.department).subscribe(res => {
      if (res) {
        this._dialogRef.close(true);
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

  private _initFormFields() {
    this._setValuesToFields();
    this._setFormDisabledState();
  }

  private _setFormDisabledState(): void {
    const control = 'name';
    this.departmentFormGroup.controls[control][this.disable ? 'disable' : 'enable']();
  }

  isInvalid(controlName: string): boolean {
    const control = this.departmentFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }

  minLengthTranslation(key: string, length: number): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.MIN_LENGTH', {
      field: field,
      length: length,
    });
  }

  maxLengthTranslation(key: string, length: number): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.MAX_LENGTH', {
      field: field,
      length: length,
    });
  }

  requiredTranslation(key: string): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.REQUIRED', {
      field: field,
    });
  }

  get submitLabel(): string {
    return this._translateService.instant('FORM.SUBMIT');
  }

  get cancelLabel(): string {
    return this._translateService.instant('FORM.CANCEL');
  }

  get loadingLabel(): string {
    return this._translateService.instant('LOADING');
  }

  get namePlaceholder(): string {
    return this._translateService.instant('DEPARTMENT.FORM.NAME');
  }
}
