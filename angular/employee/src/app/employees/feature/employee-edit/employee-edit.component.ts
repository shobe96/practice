import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Employee } from '../../data-access/employee.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeeEditFacadeService } from '../../data-access/employee-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    MultiSelect,
    Button,
    ProgressSpinner,
    ValidationMessagesComponent,
  ],
  providers: [EmployeeEditFacadeService],
})
export class EmployeeEditComponent implements OnInit {
  employeeFormGroup!: FormGroup;

  @Input() employee: Employee = {};
  @Input() disable = false;

  private _employeeEditFacade = inject(EmployeeEditFacadeService);
  private _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );
  viewModel = toSignal(this._employeeEditFacade.viewModel$, {
    initialValue: {
      skills: [],
      departments: [],
      loading: false,
    },
  });
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    this._employeeEditFacade.loadSelectOptions();
    this._buildForm();
    this._initFormFields();
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    this.employee = this._getFormValues();
    this._employeeEditFacade.submit(this.employee).subscribe((res) => {
      if (res) {
        this._dialogRef.close(true);
      }
    });
  }

  private _buildForm() {
    this.employeeFormGroup = this._formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(5),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(5),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.email],
      ],
      department: [{}],
      skills: [[]],
    });
  }

  private _initFormFields() {
    this._setValuesToFields();
    this._setFormDisabledState();
  }

  private _setValuesToFields(): void {
    if (!this.employee) return;
    this.employeeFormGroup.patchValue({
      name: this.employee.name ?? '',
      surname: this.employee.surname ?? '',
      email: this.employee.email ?? '',
      department: this.employee.department ?? {},
      skills: this.employee.skills ?? [],
    });
  }

  private _getFormValues(): Employee {
    const employee: Employee = { ...this.employee };
    for (const field in this.employeeFormGroup.controls) {
      employee[field] = this.employeeFormGroup.controls[field].value;
    }
    return employee;
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }

  private _setFormDisabledState(): void {
    const controls = ['name', 'surname', 'email', 'department', 'skills'];
    controls.forEach((control) =>
      this.employeeFormGroup.controls[control][
        this.disable ? 'disable' : 'enable'
      ]()
    );
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
    return this._translateService.instant('EMPLOYEES.FORM.NAME');
  }

  get surnamePlaceholder(): string {
    return this._translateService.instant('EMPLOYEES.FORM.SURNAME');
  }

  get emailPlaceholder(): string {
    return this._translateService.instant('EMPLOYEES.FORM.EMAIL');
  }

  get selectDepratment(): string {
    const feature = this._setTranslation('Department', 'Odeljenje');
    return this._translateService.instant('FORM.SELECT', { feature: feature });
  }

  get selectSkills(): string {
    const feature = this._setTranslation('Skills', 'Veštine');
    return this._translateService.instant('FORM.SELECT', { feature: feature });
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

  get emailTranslation(): string {
    return this._translateService.instant('VALIDATIONS.EMAIL');
  }

  private _setTranslation(enLabel: string, rsLabel: string): string {
    return this.currentLang() === 'en' ? enLabel : rsLabel;
  }
}
