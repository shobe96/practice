import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthResponse } from '../../../models/auth-response.model';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';
import { ProjectHistoryService } from '../../../services/project-history/project-history.service';
import { ProjectHistory } from '../../../models/project-history.model';
import { Role } from '../../../models/role.model';
import { DEPARTMENT_CHIEF } from '../../../shared/authotities-constants';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { PageEvent } from '../../../models/page-event.model';
import { PaginatorState } from 'primeng/paginator';
import { fireToast } from '../../../shared/utils';
import { MessageService } from 'primeng/api';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss',
  standalone: false
})
export class HomePanelComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  public employee: Employee = {};
  public projectsHistory: ProjectHistory[] = [];
  public showTab: boolean = true;
  public employees: Employee[] = [];
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };

  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  private projectHistoryService: ProjectHistoryService = inject(ProjectHistoryService);
  private messageService: MessageService = inject(MessageService)

  constructor() {
    super();
  }

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
      const roles: Role[] = json.roles ?? [];
      this.showTab = this.checkForRoles(roles, DEPARTMENT_CHIEF);

      if (json.userId) {
        this.employeeService.findByUser(json.userId)
          .pipe(
            switchMap((employee: Employee) => {
              this.employee = employee;
              return this.projectHistoryService.getProjectsHistoryOfEmployee(this.employee.id)
            }),
            takeUntil(this.componentIsDestroyed$)
          )
          .subscribe({
            next: (value: ProjectHistory[]) => {
              this.projectsHistory = value;
              if (this.showTab) {
                this.getAllEmployeesByDepartment();
              }
            },
            error: (err) => {
              switch (err.status) {
                case 401:
                  fireToast('error', 'Error', `Employee doesn't exist`, this.messageService);
                  break;
                case 404:
                  fireToast('error', 'Error', 'No project History', this.messageService);
                  break;
                default:
                  fireToast('error', 'Error', 'Uknown Error', this.messageService);
                  break;
              }
            },
            complete: () => { },
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  public goToEdit() {
    this.router.navigate([`/employee/edit/${this.employee.id}`])
  }

  private checkForRoles(roles: Role[], searchRoleCode: string): boolean {
    for (let role of roles) {
      if (role.code === searchRoleCode) {
        return true;
      }
    }
    return false;
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.getAllEmployeesByDepartment();
  }
  getAllEmployeesByDepartment() {
    if (this.employee.department?.id) {
      this.employeeService.findByDepartment(this.employee.department?.id, this.page).subscribe({
        next: (value: EmployeeSearchResult) => {
          this.employees = value.employees ?? [];
          this.page.pageCount = value.size ?? 0;
        },
        error: (err) => {
          fireToast('error', 'Error', err.error.message, this.messageService);
        },
        complete: () => {

        },
      });
    }
  }
}
