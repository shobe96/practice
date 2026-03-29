import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { Department } from '../../departments/data-access/department.model';
import { Employee } from '../../employees/data-access/employee.model';
import { Skill } from '../../skills/data-access/skill.model';
import { DepartmentService } from '../../departments/data-access/department.service';
import { EmployeeService } from '../../employees/data-access/employee.service';
import { SkillService } from '../../skills/data-access/skill.service';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';
import { EmployeeSearchCriteria } from '../../employees/data-access/employee-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class ProjectEditFacadeService extends BaseEditFacade<Project> {

  private _skills$ = new BehaviorSubject<Skill[]>([]);
  private _departments$ = new BehaviorSubject<Department[]>([]);
  private _employees$ = new BehaviorSubject<Employee[]>([]);

  override viewModel$ = combineLatest({
    skills: this._skills$.asObservable(),
    departments: this._departments$.asObservable(),
    employees: this._employees$.asObservable(),
    loading: this._loading$.asObservable()
  });

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);

  constructor(projectService: ProjectService) {
    super(projectService);
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  getEmployees(skills: Skill[], department: Department) {
    if (skills.length > 0 && Object.keys(department).length > 0) {
      const criteria: EmployeeSearchCriteria = {
        skillIds: skills.map(s => s.id ?? 0),
        departmentId: department.id
      }
      this._withLoading(() => this._employeeService.search(criteria).pipe(tap((value) => this._employees$.next(value.items ?? [])))).subscribe();
    } else {
      this.clearEmployees();
    }
  }

  clearEmployees() {
    this._employees$.next([]);
  }

  private _getSkills(): void {
    this._withLoading(() => this._skillService.getAll().pipe(tap((value) => this._skills$.next(value ?? [])), this._handleError<Skill[]>([]))).subscribe();
  }

  private _getDepartments(): void {
    this._withLoading(() => this._departmentService.getAll().pipe(tap((value) => this._departments$.next(value ?? [])), this._handleError<Department[]>([]))).subscribe();
  }
}
