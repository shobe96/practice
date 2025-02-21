import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Skill } from '../../../models/skill.model';
import { SkillEditFacadeService } from '../../../services/skill/skill-edit.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomMessageService } from '../../../services/custom-message.service';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrl: './skill-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, NgIf, Button]
})
export class SkillEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  skillFormGroup!: FormGroup;

  @Input() skill: Skill | null = {};
  @Input() disable = false;

  skillEditFacade: SkillEditFacadeService = inject(SkillEditFacadeService);
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
    const skillObserver = {
      next: (value: Skill) => {
        if (Object.keys(value)) {
          this.cancel();
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this.skill = this._getFormValues();
    this.skillEditFacade.submit(this.skill)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe(skillObserver);
  }

  private _setValuesToFields() {
    if (this.skill) {
      const name = this.skill.name ?? '';
      const description = this.skill.description ?? ''
      if (this.skillFormGroup) {
        this.skillFormGroup.controls['name'].setValue(name);
        this.skillFormGroup.controls['description'].setValue(description);
      }
    }
  }

  private _disableFields(): void {
    if (this.skillFormGroup) {
      this.skillFormGroup.controls['name'].disable();
      this.skillFormGroup.controls['description'].disable();
    }
  }
  private _enableFields(): void {
    if (this.skillFormGroup) {
      this.skillFormGroup.controls['name'].enable();
      this.skillFormGroup.controls['description'].enable();
    }
  }

  private _getFormValues(): Skill {
    const skill: Skill = { ...this.skill };
    for (const field in this.skillFormGroup.controls) {
      skill[field] = this.skillFormGroup.controls[field].value;
    }
    return skill;
  }

  private _buildForm() {
    this.skillFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
    });
  }

  private _initFormFields() {
    this._setValuesToFields();
    if (this.disable) this._disableFields();
    else this._enableFields();
  }
}
