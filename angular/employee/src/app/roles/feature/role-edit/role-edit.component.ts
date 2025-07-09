import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../data-access/role.model';
import { RoleEditFacadeService } from '../../data-access/role-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, NgIf, Button, ProgressSpinner, ValidationMessagesComponent]
})
export class RoleEditComponent implements OnInit {
  roleFormGroup!: FormGroup;

  @Input() role: Role | null = {};
  @Input() disable = false;

  private _roleEditFacade: RoleEditFacadeService = inject(RoleEditFacadeService);
  viewModel = toSignal(this._roleEditFacade.viewModel$, { initialValue: { loading: false } });

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    this._buildForm();
    this._initFormFields();
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {

    this.role = this._getFormValues();
    this._roleEditFacade.submit(this.role)
      .subscribe((res) => {
        if (res) {
          this._dialogRef.close(true);
        }
      });
  }

  private _setValuesToFields() {
    if (this.role) {
      const name = this.role.name ?? '';
      const description = this.role.description ?? ''
      const code = this.role.code ?? ''
      if (this.roleFormGroup) {
        this.roleFormGroup.controls['name'].setValue(name);
        this.roleFormGroup.controls['description'].setValue(description);
        this.roleFormGroup.controls['code'].setValue(code);
      }
    }
  }

  private _disableFields(): void {
    if (this.roleFormGroup) {
      this.roleFormGroup.controls['name'].disable();
      this.roleFormGroup.controls['description'].disable();
      this.roleFormGroup.controls['code'].disable();
    }
  }
  private _enableFields(): void {
    if (this.roleFormGroup) {
      this.roleFormGroup.controls['name'].enable();
      this.roleFormGroup.controls['description'].enable();
      this.roleFormGroup.controls['code'].enable();
    }
  }

  private _getFormValues(): Role {
    const role: Role = { ...this.role };
    for (const field in this.roleFormGroup.controls) {
      role[field] = this.roleFormGroup.controls[field].value;
    }
    return role;
  }

  private _buildForm() {
    this.roleFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
    });
  }

  private _initFormFields() {
    this._setValuesToFields();
    if (this.disable) this._disableFields();
    else this._enableFields();
  }

  isInvalid(controlName: string): boolean {
    const control = this.roleFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }
}
