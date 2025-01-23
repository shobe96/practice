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
import { MessageService } from 'primeng/api';
import { fireToast } from '../../shared/utils';
import { enumSeverity } from '../../shared/constants.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEditFacadeService {

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);
  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private _messageService: MessageService = inject(MessageService);

  viewModel$: Observable<any> = combineLatest({
    skills: this._skills.asObservable(),
    departments: this._departments.asObservable(),
  })

  submit(employee: Employee): Observable<Employee> {
    const subscription = !employee.id ?
      this._employeeService.save(employee) :
      this._employeeService.update(employee);
    return subscription.pipe(map((value: Employee) => {
      if (value) {
        fireToast(enumSeverity.success, 'Success', 'Action perforemd successfully', this._messageService);
        return value;
      } else {
        return {};
      }
    }))
  }

  loadSelectOptions(): void {
    this._getSkills();
    this._getDepartments();
  }

  private _getSkills(): void {
    this._skillService.getAllSkills(true).subscribe((value: SkillSearchResult) => {
      if (value.skills) {
        this._skills.next(value.skills);
      }
    })
  }

  private _getDepartments(): void {
    this._departmentService.getAllDepartments(true).subscribe((value: DepartmentSearchResult) => {
      if (value.departments) {
        this._departments.next(value.departments);
      }
    })
  }
}
