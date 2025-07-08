import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../data-access/project.model';
import { ProjectEditFacadeService } from '../../data-access/project-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    MultiSelect,
    DatePicker,
    Button,
    ProgressSpinner,
    ValidationMessagesComponent
  ],
  providers: [ProjectEditFacadeService]
})
export class ProjectEditComponent implements OnInit {

  projectFormGroup!: FormGroup;

  @Input() project: Project = {};

  private _projectEditFacade = inject(ProjectEditFacadeService);

  viewModel = toSignal(this._projectEditFacade.viewModel$, {
    initialValue: {
      skills: [],
      departments: [],
      employees: [],
      loading: false
    }
  });
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    this._projectEditFacade.loadSelectOptions();
    this.buildForm();
    this._initFormFields();
  }

  buildForm() {
    this.projectFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      skills: [[], [Validators.required]],
      employees: [[], [Validators.required]],
      department: [{}, [Validators.required]]
    });
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    this.project = this._getFormValues();
    this._projectEditFacade.submit(this.project).subscribe(res => {
      if (res) {
        this._dialogRef.close(true);
      }
    });
  }

  getEmployees() {
    const { department, skills } = this.projectFormGroup.getRawValue();
    this.projectFormGroup.controls['employees'].setValue([]);
    this._projectEditFacade.getEmployees(skills, department);
  }

  private _setValuesToFields() {
    if (this.project) {
      const name = this.project.name ?? '';
      const code = this.project.code ?? ''
      const employees = this.project.employees ?? [];
      const department = this.project.department ?? {};
      const skills = this.project.skills ?? [];
      const startDate = this.project.startDate ? new Date(this.project.startDate) : new Date();
      const endDate = this.project.endDate ? new Date(this.project.endDate) : new Date();

      if (this.projectFormGroup) {
        this.projectFormGroup.controls['name'].setValue(name);
        this.projectFormGroup.controls['code'].setValue(code);
        this.projectFormGroup.controls['department'].setValue(department);
        this.projectFormGroup.controls['skills'].setValue(skills);
        this.getEmployees();
        this.projectFormGroup.controls['startDate'].setValue(startDate);
        this.projectFormGroup.controls['endDate'].setValue(endDate);
        this.projectFormGroup.controls['employees'].setValue(employees);
      }

      if (Object.keys(this.project)?.length === 1) this._projectEditFacade.clearEmployees();
    }
  }

  private _getFormValues(): Project {
    const project: Project = { ...this.project };
    for (const field in this.projectFormGroup.controls) {
      project[field] = this.projectFormGroup.controls[field].value;
    }
    return project;
  }

  private _initFormFields() {
    this._setValuesToFields();
  }

  isInvalid(controlName: string): boolean {
    const control = this.projectFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }
}
