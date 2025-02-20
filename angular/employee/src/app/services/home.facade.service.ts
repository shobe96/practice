import { inject, Injectable } from '@angular/core';
import { ProjectHistoryService } from './project-history/project-history.service';
import { BehaviorSubject, catchError, combineLatest, Observable, of, switchMap } from 'rxjs';
import { Role } from '../models/role.model';
import { PageEvent } from '../models/page-event.model';
import { Employee } from '../models/employee.model';
import { ProjectHistory } from '../models/project-history.model';
import { AuthResponse } from '../models/auth-response.model';
import { EmployeeService } from './employee/employee.service';
import { EmployeeSearchResult } from '../models/employee-search-result.model';
import { ProjectService } from './project/project.service';
import { Project } from '../models/project.model';
import { CustomMessageService } from './custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class HomeFacadeService {

  private _authResponse: AuthResponse | null = {};
  private _roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _projectsHistory: BehaviorSubject<ProjectHistory[]> = new BehaviorSubject<ProjectHistory[]>([]);
  private _employee: BehaviorSubject<Employee> = new BehaviorSubject<Employee>({});
  private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>({});
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  private _page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(this._defaultPage);

  viewModel$: Observable<any> = combineLatest({
    roles: this._roles.asObservable(),
    page: this._page.asObservable(),
    projectsHistory: this._projectsHistory.asObservable(),
    employee: this._employee.asObservable(),
    departmentEmployees: this._employees.asObservable(),
    activeProject: this._project.asObservable()
  });

  private _projectHistoryService: ProjectHistoryService = inject(ProjectHistoryService);
  private _projectService: ProjectService = inject(ProjectService);
  private _employeeService: EmployeeService = inject(EmployeeService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  getRoles() {
    if (this._authResponse) {
      const roles = this._authResponse.roles ?? [];
      this._roles.next(roles);
    }
  }

  getPanelData() {
    const employeeObserver = {
      next: (value: any[]) => {
        this._projectsHistory.next(value[0] ?? []);
        this._defaultPage.pageCount = value[1]?.size ?? 0;
        this._page.next(this._defaultPage);
        this._employees.next(value[1]?.employees ?? []);
        this._project.next(value[2] ?? {});
      },
      error: () => { },
      complete: () => { }
    }
    this._authResponse = this._getAuthResponse();
    this.getRoles();
    if (this._authResponse && this._authResponse.userId) {
      this._employeeService.findByUser(this._authResponse.userId).pipe(
        switchMap((employee: Employee) => {
          this._employee.next(employee);
          return combineLatest([
            this._getProjectHistory(employee),
            this._getAllEmployeesByDepartment(employee),
            this._getActiveProject(employee)
          ]);

        })).subscribe(employeeObserver)
    }
  }

  private _getProjectHistory(employee: Employee): Observable<ProjectHistory[] | null> {
    return this._projectHistoryService.getProjectsHistoryOfEmployee(employee.id).pipe(catchError(err => { this._customMessageService.showError('Error', err.error.message); return of(null); }));
  }

  private _getAllEmployeesByDepartment(employee: Employee): Observable<EmployeeSearchResult | null> {
    if (employee.department?.id)
      return this._employeeService.findByDepartment(employee.department?.id, this._defaultPage).pipe(catchError(err => { this._customMessageService.showWarn('Warning', err.error.message); return of(null); }));
    else return of(null);
  }

  private _getActiveProject(employee: Employee) {
    if (employee.id)
      return this._projectService.getProjectByEmployee(employee.id).pipe(catchError(err => { this._customMessageService.showError('Error', err.error.message); return of(null); }));
    else return of(null)
  }

  private _getAuthResponse(): AuthResponse | null {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      return json;
    } else {
      return null;
    }
  }
}
