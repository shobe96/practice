import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject, catchError, combineLatest, map, Observable } from 'rxjs';
import { SkillService } from '../skill/skill.service';
import { DepartmentService } from '../department/department.service';
import { Skill } from '../../models/skill.model';
import { Department } from '../../models/department.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEditFacadeService {

  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);

  viewModel$: Observable<any> = combineLatest({
    skills: this._skills.asObservable(),
    departments: this._departments.asObservable(),
  });

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(employee: Employee): Observable<Employee> {
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
      catchError(err => { throw err.error.message }));
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  private _getSkills(): void {
    const skillsObserver = {
      next: (value: SkillSearchResult) => {
        if (value.skills) {
          this._skills.next(value.skills);
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
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
      complete: () => { }
    }
    this._departmentService.getAllDepartments(true).pipe(catchError((err) => { throw err.error.message })).subscribe(departmentsObserver);
  }
}
