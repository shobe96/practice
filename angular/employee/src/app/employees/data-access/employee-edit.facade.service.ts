import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, of, tap } from 'rxjs';
import { SkillService } from '../../skills/data-access/skill.service';
import { DepartmentService } from '../../departments/data-access/department.service';
import { Skill } from '../../skills/data-access/skill.model';
import { Department } from '../../departments/data-access/department.model';
import { CustomMessageService } from '../../shared/data-access/custom-message.service';

@Injectable()
export class EmployeeEditFacadeService {

  private readonly _skills$ = new BehaviorSubject<Skill[]>([]);
  private readonly _departments$ = new BehaviorSubject<Department[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);

  viewModel$ = combineLatest({
    skills: this._skills$.asObservable(),
    departments: this._departments$.asObservable(),
    loading: this._loading$.asObservable()
  });

  private readonly _employeeService = inject(EmployeeService);
  private readonly _skillService = inject(SkillService);
  private readonly _departmentService = inject(DepartmentService);
  private readonly _customMessageService = inject(CustomMessageService);

  submit(employee: Employee): Observable<boolean> {
    const subscription = !employee.id ?
      this._employeeService.save(employee) :
      this._employeeService.update(employee);

    this._loading$.next(true);

    return subscription.pipe(
      tap(
        () => {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
        }
      ),
      map(() => true),
      catchError((err) => {
        const msg = err?.error?.message ?? 'Unknown error';
        this._customMessageService.showError('Error', msg)
        return of(false);
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  toggleLoading(loading: boolean) {
    this._loading$.next(loading);
  }

  private _getSkills(): void {
    this._withLoading(() => this._skillService.getAllSkills(true).pipe(tap((value) => this._skills$.next(value.skills ?? [])), this._handleError([])));
  }

  private _getDepartments(): void {
    this._withLoading(() => this._departmentService.getAllDepartments(true).pipe(tap((value) => this._departments$.next(value.departments ?? [])), this._handleError([])))
  }

  private _withLoading<T>(fn: () => Observable<T>): void {
    this._loading$.next(true);
    fn().pipe(finalize(() => this._loading$.next(false))).subscribe();
  }

  private _handleError<T>(fallback: T) {
    return catchError((err) => {
      const msg = err?.error?.message ?? 'Unknown error';
      this._customMessageService.showError('Error', msg)
      return of(fallback);
    });
  }
}
