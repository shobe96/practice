import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Project } from '../../../models/project.model';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { ProjectEditFacadeService } from '../../../services/project/project-edit.facade.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  projectFormGroup!: FormGroup;

  @Input() project: Project = {};

  projectEditFacade: ProjectEditFacadeService = inject(ProjectEditFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.projectEditFacade.loadSelectOptions();
    this.buildForm();
    this._initFormFields();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  buildForm() {
    this.projectFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      startDate: [{}, [Validators.required]],
      endDate: [{}, [Validators.required]],
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
    this.projectEditFacade.submit(this.project)
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((value: Project) => {
        if (Object.keys(value)) {
          this.cancel();
        }
      });
  }

  getEmployees(_event: any) {
    const department = this.project.department = this.projectFormGroup.controls['department'].value;
    const skills = this.projectFormGroup.controls['skills'].value;
    this.projectFormGroup.controls['employees'].setValue([]);
    this.projectEditFacade.getEmployees(skills, department);
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
        this.getEmployees(null);
        this.projectFormGroup.controls['startDate'].setValue(startDate);
        this.projectFormGroup.controls['endDate'].setValue(endDate);
        this.projectFormGroup.controls['employees'].setValue(employees);
      }

      if (Object.keys(this.project)?.length === 1) this.projectEditFacade.clearEmployees();
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
}
