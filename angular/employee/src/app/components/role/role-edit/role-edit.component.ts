import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role/role.service';
import { fireToast } from '../../../shared/utils';
import { RoleEditFacadeService } from '../../../services/role/role-edit.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.scss',
  standalone: false
})
export class RoleEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  @Input() role: Role | null = {};
  @Input() disable = false;
  @Output() cancelEmiitter = new EventEmitter<any>();
  roleFormGroup!: FormGroup;
  roleEditFacade: RoleEditFacadeService = inject(RoleEditFacadeService);

  private _formBuilder: FormBuilder = inject(FormBuilder);

  ngOnChanges(_changes: SimpleChanges): void {
    this._initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  ngOnInit(): void {
    this._buildForm();
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

  cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  submit() {
    this.role = this._getFormValues();

    this.roleEditFacade.submit(this.role)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((value: Role) => {
        if (Object.keys(value)) {
          this.cancel(true);
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
}
