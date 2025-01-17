import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';
import { Skill } from '../../../models/skill.model';
import { SkillService } from '../../../services/skill/skill.service';
import { SkillSearchResult } from '../../../models/skill-search-result.model';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department/department.service';
import { DepartmentSearchResult } from '../../../models/department-search-result.model';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss',
  standalone: false
})
export class ProjectEditComponent extends SubscriptionCleaner implements OnInit, OnDestroy, OnChanges {
  @Input() public id: number | null = null;
  @Input() public disable: boolean = false;
  @Output() public cancelEmiitter: EventEmitter<any> = new EventEmitter();
  public project: Project = {};
  public projectFormGroup!: FormGroup;
  public skills: Skill[] = [];
  public employees: Employee[] = [];
  public departments: Department[] = [];

  private route: ActivatedRoute = inject(ActivatedRoute);
  private projectService: ProjectService = inject(ProjectService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);
  private skillService: SkillService = inject(SkillService);
  private employeeService: EmployeeService = inject(EmployeeService);
  private departmentService: DepartmentService = inject(DepartmentService);

  ngOnInit(): void {
    this.departmentService.getAllDepartments(true).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
      },
      error: (err: any) => {
        !err.status ? fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService) : fireToast('error', 'Error', `${err.message}`, this.messageService);
      },
      complete: () => { }
    })
    this.skillService.getAllSkills(true).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
      },
      error: (err: any) => {
        !err.status ? fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService) : fireToast('error', 'Error', `${err.message}`, this.messageService);
      },
      complete: () => { }
    });
    this.buildForm();
    this.route.params.pipe(takeUntil(this.componentIsDestroyed$)).subscribe((params: Params) => {
      this.id = params["projectId"] ?? null;
      this.initFormFields();
    });
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  public buildForm() {
    this.projectFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      startDate: [{}, [Validators.required]],
      endDate: [{}, [Validators.required]],
      selectedSkills: [[], [Validators.required]],
      selectedEmployees: [[], [Validators.required]],
      selectedDepartment: [{}, [Validators.required]]
    });
  }

  private initFormFields() {
    if (this.id) {
      const projectObserver: any = {
        next: (value: Project) => {
          this.project = value;
          this.setValuesToFields(value);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      };
      this.projectService.getProject(this.id).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(projectObserver);
    } else {
      this.setValuesToFields({});
    }
  }

  public cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  public submit() {
    this.project.name = this.projectFormGroup.controls['name'].value;
    this.project.code = this.projectFormGroup.controls['code'].value;
    this.project.skills = this.projectFormGroup.controls['selectedSkills'].value;
    this.project.employees = this.projectFormGroup.controls['selectedEmployees'].value;
    this.project.department = this.projectFormGroup.controls['selectedDepartment'].value;
    this.project.startDate = this.projectFormGroup.controls['startDate'].value;
    this.project.endDate = this.projectFormGroup.controls['endDate'].value;
    const projectObserver: any = {
      next: (value: Project) => {
        !this.id ? fireToast("success", "Success", `Project ${value.name} has been created`, this.messageService) : fireToast("success", "Success", `Project ${value.name} has been updated`, this.messageService);
        this.cancel(true);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    !this.id ? this.projectService.save(this.project).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(projectObserver) : this.projectService.update(this.project).pipe(takeUntil(this.componentIsDestroyed$)).subscribe(projectObserver);
  }

  private retrieveEmployees(skills: Skill[], department: Department) {
    if (skills.length > 0 && Object.keys(department).length > 0) {
      this.employeeService.filterEmployeesByActiveAndSkills(skills, department).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
        next: (value: Employee[]) => {
          this.employees = value;
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      });
    }
  }

  public onChanges(_event: any) {
    const department = this.project.department = this.projectFormGroup.controls['selectedDepartment'].value;
    const skills = this.projectFormGroup.controls['selectedSkills'].value;
    this.retrieveEmployees(skills, department);
  }

  private setValuesToFields(value: Project) {
    if (this.projectFormGroup) {
      const name = value.name ?? '';
      const code = value.code ?? ''
      const startDate = value.startDate ?? new Date();
      const endDate = value.endDate ?? new Date();
      const employees = value.employees ?? [];
      const department = value.department ?? {};
      const selectedSkills = value.skills ?? [];
      this.retrieveEmployees(selectedSkills, department);
      if (this.projectFormGroup) {
        this.projectFormGroup.controls['name'].setValue(name);
        this.projectFormGroup.controls['code'].setValue(code);
        this.projectFormGroup.controls['selectedSkills'].setValue(selectedSkills);
        this.projectFormGroup.controls['selectedDepartment'].setValue(department);
        this.projectFormGroup.controls['selectedEmployees'].setValue(employees);
        this.projectFormGroup.controls['startDate'].setValue(new Date(startDate));
        this.projectFormGroup.controls['endDate'].setValue(new Date(endDate));
      }
    }
  }
}
