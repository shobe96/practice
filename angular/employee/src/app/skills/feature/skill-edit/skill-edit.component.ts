import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Skill } from '../../data-access/skill.model';
import { SkillEditFacadeService } from '../../data-access/skill-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrl: './skill-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, Button, ProgressSpinner, ValidationMessagesComponent],
  providers: [SkillEditFacadeService]
})
export class SkillEditComponent implements OnInit {
  skillFormGroup!: FormGroup;

  @Input() skill: Skill | null = {};
  @Input() disable = false;

  private _skillEditFacade: SkillEditFacadeService = inject(SkillEditFacadeService);
  viewModel = toSignal(this._skillEditFacade.viewModel$, { initialValue: { loading: false } });

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
    this.skill = this._getFormValues();
    this._skillEditFacade.submit(this.skill).subscribe(res => {
      if (res) {
        this._dialogRef.close(true);
      }
    });
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
    this._setFormDisabledState();
  }

  private _setFormDisabledState(): void {
    const controls = ['name', 'description'];
    controls.forEach((control) => this.skillFormGroup.controls[control][this.disable ? 'disable' : 'enable']());
  }

  isInvalid(controlName: string): boolean {
    const control = this.skillFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }
}
