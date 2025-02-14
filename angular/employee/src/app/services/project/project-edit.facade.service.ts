import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { Department } from '../../models/department.model';
import { Employee } from '../../models/employee.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { Skill } from '../../models/skill.model';
import { enumSeverity } from '../../shared/constants.model';
import { fireToast } from '../../shared/utils';
import { DepartmentService } from '../department/department.service';
import { EmployeeService } from '../employee/employee.service';
import { SkillService } from '../skill/skill.service';
import { ProjectService } from './project.service';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectEditFacadeService {

  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);

  viewModel$: Observable<any> = combineLatest({
    skills: this._skills.asObservable(),
    departments: this._departments.asObservable(),
    employees: this._employees.asObservable()
  });

  private _employeeService = inject(EmployeeService);
  private _skillService: SkillService = inject(SkillService);
  private _departmentService: DepartmentService = inject(DepartmentService);
  private _projectService: ProjectService = inject(ProjectService);
  private _messageService: MessageService = inject(MessageService);

  submit(project: Project): Observable<Project> {
    const subscription = !project.id ?
      this._projectService.save(project) :
      this._projectService.update(project);
    return subscription.pipe(map((value: Project) => {
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

  getEmployees(skills: Skill[], department: Department) {
    if (skills.length > 0 && Object.keys(department).length > 0) {
      this._employeeService.filterEmployeesByActiveAndSkills(skills, department).subscribe((value: Employee[]) => {
        if (value) {
          this._employees.next(value);
        }
      });
    } else {
      this.clearEmployees();
    }
  }

  clearEmployees() {
    this._employees.next([]);
  }

  private _getSkills(): void {
    this._skillService.getAllSkills(true).subscribe((value: SkillSearchResult) => {
      if (value.skills) {
        this._skills.next(value.skills);
      }
    });
  }

  private _getDepartments(): void {
    this._departmentService.getAllDepartments(true).subscribe((value: DepartmentSearchResult) => {
      if (value.departments) {
        this._departments.next(value.departments);
      }
    });
  }
}
