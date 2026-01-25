import { inject, Injectable } from '@angular/core';
import { ProjectHistoryService } from '../../projects/data-access/project-history.service';
import { BehaviorSubject, catchError, combineLatest, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { Role } from '../../roles/data-access/role.model';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { Employee } from '../../employees/data-access/employee.model';
import { ProjectHistory } from '../../projects/data-access/project-history.model';
import { AuthResponse } from '../../auth/data-access/auth-response.model';
import { EmployeeService } from '../../employees/data-access/employee.service';
import { ProjectService } from '../../projects/data-access/project.service';
import { Project } from '../../projects/data-access/project.model';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { SearchResult } from '../../shared/data-access/search-result.model';
import { EmployeeSearchCriteria } from '../../employees/data-access/employee-search.criteria';
import { ProjectSearchCriteria } from '../../projects/data-access/project-search.criteria';
import { ProjecetHistorySearchCriteria } from '../../projects/data-access/project-history-search.criteria';

@Injectable()
export class HomeFacadeService {

  private readonly _authResponse = this._getAuthResponse();

  private readonly _roles$ = new BehaviorSubject<Role[]>([]);
  private readonly _employees$ = new BehaviorSubject<Employee[]>([]);
  private readonly _projectsHistory$ = new BehaviorSubject<ProjectHistory[]>([]);
  private readonly _employee$ = new BehaviorSubject<Employee>({});
  private readonly _project$ = new BehaviorSubject<Project>({});
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  private readonly _page$ = new BehaviorSubject<PageEvent>(this._defaultPage);

  viewModel$ = combineLatest({
    roles: this._roles$.asObservable(),
    page: this._page$.asObservable(),
    projectsHistory: this._projectsHistory$.asObservable(),
    employee: this._employee$.asObservable(),
    departmentEmployees: this._employees$.asObservable(),
    activeProject: this._project$.asObservable(),
    loading: this._loading$.asObservable()
  });

  private readonly _projectHistoryService = inject(ProjectHistoryService);
  private readonly _projectService = inject(ProjectService);
  private readonly _employeeService = inject(EmployeeService);
  private readonly _customMessageService = inject(CustomMessageService);

  getRoles(): void {
    if (!this._authResponse) return;
    this._withLoading(() => {
      const roles = this._authResponse?.roles ?? [];
      this._roles$.next(roles);
    });
  }

  getPanelData(): void {
    const userId = this._authResponse?.userId;
    if (userId) {
      //TODO: replace find by user with search
      const criteria: EmployeeSearchCriteria = {
        userId: userId
      };
      this._withLoading(() =>
        this._employeeService.search(criteria).pipe(
          tap(searchResult => {
            if (searchResult.items) {
              this._employee$.next(searchResult.items[0])
            }
          }),
          switchMap(searchResult => {
            const items = searchResult.items ?? []
            return combineLatest([
              this._getProjectHistory(items[0]),
              this._getAllEmployeesByDepartment(items[0]),
              this._getActiveProject(items[0])
            ])
          }
          ),
          tap(([history, searchResult, project]) => {
            this._projectsHistory$.next(history ?? []);
            this._defaultPage.pageCount = searchResult?.size ?? 0;
            this._page$.next({ ...this._defaultPage });
            this._employees$.next(searchResult?.items ?? []);
            this._project$.next(project?.items ? project.items[0] : {});
          }),
          catchError(() => of(null))
        )
      );
    }

  }

  private _getProjectHistory(employee: Employee): Observable<ProjectHistory[]> {
    const criteria: ProjecetHistorySearchCriteria = {
      employeeId: employee.id
    };
    return this._projectHistoryService
      .searchAll(criteria)
      .pipe(this._handleError<ProjectHistory[]>('Error', []));
  }

  private _getAllEmployeesByDepartment(employee: Employee): Observable<SearchResult<Employee> | null> {
    if (!employee.department?.id) return of(null);
    const criteria: EmployeeSearchCriteria = {
      departmentId: employee.department.id
    }
    return this._employeeService
      .search(criteria, this._defaultPage)
      .pipe(this._handleError<SearchResult<Employee>>('Warning', {}));
  }

  private _getActiveProject(employee: Employee): Observable<SearchResult<Project> | null> {
    if (!employee.id) return of(null);
    const criteria: ProjectSearchCriteria = {
      employeeId: employee.id
    };
    return this._projectService
      .search(criteria)
      .pipe(this._handleError<SearchResult<Project>>('Error', {}));
  }

  private _getAuthResponse(): AuthResponse | null {
    const raw = localStorage.getItem('authResponse');
    return raw ? JSON.parse(raw) : null;
  }

  private _withLoading<T>(fn: () => Observable<T> | void): void {
    this._loading$.next(true);
    const result = fn();
    if (result instanceof Observable) {
      result.subscribe({
        complete: () => this._loading$.next(false),
        error: () => this._loading$.next(false),
      });
    } else {
      this._loading$.next(false);
    }
  }

  private _handleError<T>(severity: 'Error' | 'Warning', fallback: T): OperatorFunction<T, T> {
    return catchError((err) => {
      const msg = err?.error?.message ?? 'Unknown error';
      if (severity === 'Error')
        this._customMessageService.showError(severity, msg)
      else this._customMessageService.showWarn(severity, msg);
      return of(fallback);
    });
  }
}
