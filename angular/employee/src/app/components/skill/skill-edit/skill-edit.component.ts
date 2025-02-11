import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Skill } from '../../../models/skill.model';
import { SkillEditFacadeService } from '../../../services/skill/skill-edit.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrl: './skill-edit.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {
  @Input() skill: Skill | null = {};
  @Input() disable = false;
  @Output() cancelEmiitter = new EventEmitter<any>();
  skillFormGroup!: FormGroup;
  skillEditFacade: SkillEditFacadeService = inject(SkillEditFacadeService);

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

  cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  submit() {
    this.skill = this._getFormValues();
    this.skillEditFacade.submit(this.skill)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((value: Skill) => {
        if (Object.keys(value)) {
          this.cancel(true);
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
}
