import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { SkillService } from '../../skills/data-access/skill.service';
import { DepartmentService } from '../../departments/data-access/department.service';
import { Skill } from '../../skills/data-access/skill.model';
import { Department } from '../../departments/data-access/department.model';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';
import { SearchResult } from '../../shared/data-access/search-result.model';

@Injectable()
export class EmployeeEditFacadeService extends BaseEditFacade<Employee> {

  private readonly _skills$ = new BehaviorSubject<Skill[]>([]);
  private readonly _departments$ = new BehaviorSubject<Department[]>([]);

  override viewModel$ = combineLatest({
    skills: this._skills$.asObservable(),
    departments: this._departments$.asObservable(),
    loading: this._loading$.asObservable()
  });

  private readonly _skillService = inject(SkillService);
  private readonly _departmentService = inject(DepartmentService);

  constructor(employeeService: EmployeeService) {
    super(employeeService);
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  private _getSkills(): void {
    this._withLoading(() => this._skillService.getAll().pipe(tap((value) => this._skills$.next(value ?? [])), this._handleError<Skill[]>([]))).subscribe();
  }

  private _getDepartments(): void {
    this._withLoading(() => this._departmentService.getAll().pipe(tap((value) => this._departments$.next(value ?? [])), this._handleError<Department[]>([]))).subscribe();
  }
}
