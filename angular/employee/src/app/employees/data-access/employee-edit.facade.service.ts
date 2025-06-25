import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, of, tap } from 'rxjs';
import { SkillService } from '../../skills/data-access/skill.service';
import { DepartmentService } from '../../departments/data-access/department.service';
import { Skill } from '../../skills/data-access/skill.model';
import { Department } from '../../departments/data-access/department.model';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';
import { DepartmentSearchResult } from '../../departments/data-access/department-search-result.model';
import { SkillSearchResult } from '../../skills/data-access/skill-search-result.model';

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
    this._withLoading(() => this._skillService.getAllSkills(true).pipe(tap((value) => this._skills$.next(value.skills ?? [])), this._handleError<SkillSearchResult>({ skills: [], size: 0 }))).subscribe();
  }

  private _getDepartments(): void {
    this._withLoading(() => this._departmentService.getAllDepartments(true).pipe(tap((value) => this._departments$.next(value.departments ?? [])), this._handleError<DepartmentSearchResult>({ departments: [], size: 0 }))).subscribe();
  }
}
