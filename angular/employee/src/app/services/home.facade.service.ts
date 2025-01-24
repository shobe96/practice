import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProjectHistoryService } from './project-history/project-history.service';
import { BehaviorSubject, combineLatest, Observable, switchMap, takeUntil } from 'rxjs';
import { Role } from '../models/role.model';
import { PageEvent } from '../models/page-event.model';
import { Employee } from '../models/employee.model';
import { ProjectHistory } from '../models/project-history.model';
import { AuthResponse } from '../models/auth-response.model';
import { EmployeeService } from './employee/employee.service';
import { fireToast } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class HomeFacadeService {

  private _projectHistoryService: ProjectHistoryService = inject(ProjectHistoryService);
  private _employeeService: EmployeeService = inject(EmployeeService);
  private _roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _projectsHistory: BehaviorSubject<ProjectHistory[]> = new BehaviorSubject<ProjectHistory[]>([]);
  private _employee: BehaviorSubject<Employee> = new BehaviorSubject<Employee>({});
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
    employee: this._employee.asObservable()
  });

  private authResponse = this._getAuthResponse();

  private _getAuthResponse(): AuthResponse | null {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      return json;
    } else {
      return null;
    }
  }

  getRoles() {
    if (this.authResponse) {
      const roles = this.authResponse.roles ?? [];
      this._roles.next(roles);
    }
  }

  getProjectHistory() {
    if (this.authResponse && this.authResponse.userId) {
      this._employeeService.findByUser(this.authResponse.userId)
        .pipe(
          switchMap((employee: Employee) => {
            this._employee.next(employee)
            return this._projectHistoryService.getProjectsHistoryOfEmployee(employee.id)
          })
        )
        .subscribe((value: ProjectHistory[]) => {
          this._projectsHistory.next(value);
        });
    }
  }

  // getAllEmployeesByDepartment() {
  //     if (this.employee.department?.id) {
  //       this.employeeService.findByDepartment(this.employee.department?.id, this.page).subscribe({
  //         next: (value: EmployeeSearchResult) => {
  //           this.employees = value.employees ?? [];
  //           this.page.pageCount = value.size ?? 0;
  //         },
  //         error: (err) => {
  //           fireToast('error', 'Error', err.error.message, this.messageService);
  //         },
  //         complete: () => {

  //         },
  //       });
  //     }
  //   }
}
