import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, map } from 'rxjs';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { Department } from '../../models/department.model';
import { Employee } from '../../models/employee.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { Skill } from '../../models/skill.model';
import { DepartmentService } from '../department/department.service';
import { EmployeeService } from '../employee/employee.service';
import { SkillService } from '../skill/skill.service';
import { ProjectService } from './project.service';
import { Project } from '../../models/project.model';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectEditFacadeService {

  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);

  viewModel$: Observable<{ skills: Skill[], departments: Department[], employees: Employee[] }> = combineLatest({
    skills: this._skills.asObservable(),
    departments: this._departments.asObservable(),
    employees: this._employees.asObservable()
  });

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);
  private _projectService: ProjectService = inject(ProjectService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(project: Project): Observable<Project> {
    const subscription = !project.id ?
      this._projectService.save(project) :
      this._projectService.update(project);
    return subscription.pipe(
      map((value: Project) => {
        if (value) {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully')
          return value;
        } else {
          return {};
        }
      }),
      catchError((err) => { throw err.error.message })
    )
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  getEmployees(skills: Skill[], department: Department) {
    if (skills.length > 0 && Object.keys(department).length > 0) {
      const employeeObserver = {
        next: (value: Employee[]) => {
          if (value) {
            this._employees.next(value);
          }
        },
        error: (errorMessage: string) => {
          this._customMessageService.showError('Error', errorMessage);
        },
        complete: () => {
          // do nothing.
        }
      }
      this._employeeService.filterEmployeesByActiveAndSkills(skills, department)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(employeeObserver);
    } else {
      this.clearEmployees();
    }
  }

  clearEmployees() {
    this._employees.next([]);
  }

  private _getSkills(): void {
    const skillObserver = {
      next: (value: SkillSearchResult) => {
        if (value.skills) {
          this._skills.next(value.skills);
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._skillService.getAllSkills(true).pipe(catchError((err) => { throw err.error.message }))
      .subscribe(skillObserver);
  }

  private _getDepartments(): void {
    const departmentObserver = {
      next: (value: DepartmentSearchResult) => {
        if (value.departments) {
          this._departments.next(value.departments);
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._departmentService.getAllDepartments(true)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(departmentObserver);
  }
}
