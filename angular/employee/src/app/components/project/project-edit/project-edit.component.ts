import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss'
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  id: number | null = null;
  private routeSubscription$!: Subscription;
  private projectSubscription$!: Subscription;
  project: Project = new Project();
  projectFormGroup!: FormGroup;
  skills: Skill[] = [];
  employees: Employee[] = [];
  departments: Department[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private skillService: SkillService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.departmentService.getAllDepartments(true).subscribe({
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
      },
      error: (err: any) => {
        if (err.status === 0) {
          fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService);
        } else {
          fireToast('error', 'Error', `${err.message}`, this.messageService);
        }
      },
      complete: () => {}
    })
    this.skillService.getAllSkills(true).subscribe({
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
      },
      error: (err: any) => {
        if (err.status === 0) {
          fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService);
        } else {
          fireToast('error', 'Error', `${err.message}`, this.messageService);
        }
      },
      complete: () => { }
    });
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["projectId"] ?? null;
      this.initFormFields();
    });
    this.onChanges();
  }
  ngOnDestroy(): void {
    if (this.routeSubscription$ !== undefined) {
      this.routeSubscription$.unsubscribe();
    }
    if (this.projectSubscription$ !== undefined) {
      this.projectSubscription$.unsubscribe();
    }
  }

  buildForm() {
    this.projectFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(1)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      startDate: [{}, [Validators.required]],
      endDate: [{}, [Validators.required]],
      selectedSkills: [[], [Validators.required]],
      selectedEmployees: [[], [Validators.required]],
      selectedDepartment: [{}, [Validators.required]]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const projectObserver: any = {
        next: (value: Project) => {
          this.project = value;
          this.projectFormGroup.controls['name'].setValue(value.name);
          this.projectFormGroup.controls['code'].setValue(value.code);
          const skills = value.skills ?? [];
          const department = value.department ?? {};
          this.projectFormGroup.controls['selectedSkills'].setValue(skills);
          this.projectFormGroup.controls['selectedDepartment'].setValue(value.department);
          this.retrieveEmployees(skills, department);
          this.projectFormGroup.controls['selectedEmployees'].setValue(value.employees);
          console.log("typeof startDate",typeof(value.startDate));
          const startDate = value.startDate ?? new Date();
          const endDate = value.endDate ?? new Date();
          this.projectFormGroup.controls['startDate'].setValue(new Date(startDate));
          this.projectFormGroup.controls['endDate'].setValue(new Date(endDate));
        },
        error: (err: any) => { console.log(err) },
        complete: () => { console.log('Completed') }
      };
      this.projectSubscription$ = this.projectService.getProject(this.id).subscribe(projectObserver);
    }
  }

  back() {
    this.router.navigate(["project/list"])
  }

  submit() {
    this.project.name = this.projectFormGroup.controls['name'].value;
    this.project.code = this.projectFormGroup.controls['code'].value;
    this.project.skills = this.projectFormGroup.controls['selectedSkills'].value;
    this.project.employees = this.projectFormGroup.controls['selectedEmployees'].value;
    this.project.department = this.projectFormGroup.controls['selectedDepartment'].value;
    this.project.startDate = this.projectFormGroup.controls['startDate'].value;
    this.project.endDate = this.projectFormGroup.controls['endDate'].value;
    const projectObserver: any = {
      next: (value: Project) => {
        if (this.id === null) {
          this.router.navigate([`project/details/${value.id}`])
          fireToast("success", "Success", `Project ${value.name} has been created`, this.messageService);
        } else {
          this.router.navigate([`project/details/${value.id}`])
          fireToast("success", "Success", `Project ${value.name} has been updated`, this.messageService);
        }
      },
      error: (err: any) => { console.log(err) },
      complete: () => { },
    }
    if (this.id === null) {
      this.projectService.save(this.project).subscribe(projectObserver);
    } else {
      this.projectService.update(this.project).subscribe(projectObserver);
    }
  }

  private retrieveEmployees(skills: Skill[], department: Department) {
    this.employeeService.filterEmployeesByActiveAndSkills(skills, department).subscribe({
      next: (value: Employee[]) => {
        this.employees = value;
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }

  private onChanges() {
    this.projectFormGroup.valueChanges.subscribe(val => {
      console.log(val.selectedDepartment);
      if (val.selectedSkills.length > 0 && Object.keys(val.selectedDepartment).length > 0) {
        this.retrieveEmployees(val.selectedSkills, val.selectedDepartment);
      }
    })
  }
}
