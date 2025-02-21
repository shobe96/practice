import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { RoleEditFacadeService } from '../../../services/role/role-edit.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomMessageService } from '../../../services/custom-message.service';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, NgIf, Button]
})
export class RoleEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  roleFormGroup!: FormGroup;

  @Input() role: Role | null = {};
  @Input() disable = false;

  roleEditFacade: RoleEditFacadeService = inject(RoleEditFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  ngOnInit(): void {
    this._buildForm();
    this._initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    const roleObserver = {
      next: (value: Role) => {
        if (Object.keys(value)) {
          this.cancel();
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this.role = this._getFormValues();
    this.roleEditFacade.submit(this.role)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe(roleObserver);
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
}
