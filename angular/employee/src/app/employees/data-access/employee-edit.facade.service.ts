import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable } from 'rxjs';
import { SkillService } from '../../skills/data-access/skill.service';
import { DepartmentService } from '../../departments/data-access/department.service';
import { Skill } from '../../skills/data-access/skill.model';
import { Department } from '../../departments/data-access/department.model';
import { SkillSearchResult } from '../../skills/data-access/skill-search-result.model';
import { DepartmentSearchResult } from '../../departments/data-access/department-search-result.model';
import { CustomMessageService } from '../../shared/data-access/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEditFacadeService {

  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  viewModel$: Observable<{ skills: Skill[], departments: Department[], loading: boolean }> = combineLatest({
    skills: this._skills.asObservable(),
    departments: this._departments.asObservable(),
    loading: this._loading.asObservable()
  });

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(employee: Employee): Observable<Employee> {
    this._loading.next(true);
    const subscription = !employee.id ?
      this._employeeService.save(employee) :
      this._employeeService.update(employee);
    return subscription.pipe(
      map((value: Employee) => {
        if (value) {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
          return value;
        } else {
          return {};
        }
      }),
      catchError(err => { throw err.error.message }),
      finalize(() => this._loading.next(false))
    );
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  toggleLoading(loading: boolean) {
    this._loading.next(loading);
  }

  private _getSkills(): void {
    const skillsObserver = {
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
    this._skillService.getAllSkills(true).pipe(catchError((err) => { throw err.error.message })).subscribe(skillsObserver)
  }

  private _getDepartments(): void {
    const departmentsObserver = {
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
    this._departmentService.getAllDepartments(true).pipe(catchError((err) => { throw err.error.message })).subscribe(departmentsObserver);
  }
}
