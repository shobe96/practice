import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthResponse } from '../../../models/auth-response.model';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project/project.service';
import { ProjectHistoryService } from '../../../services/project-history/project-history.service';
import { ProjectHistory } from '../../../models/project-history.model';
import { Role } from '../../../models/role.model';
import { DEPARTMENT_CHIEF } from '../../../shared/authotities-constants';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { PageEvent } from '../../../models/page-event.model';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss'
})
export class HomePanelComponent implements OnInit {


  employee: Employee = {};
  projectsHistory: ProjectHistory[] = [];
  showTab: boolean = true;
  employees: Employee[] = [];
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private projectHistoryService: ProjectHistoryService
  ) { }

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse !== null) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
      const roles: Role[] = json.roles ?? [];
      this.showTab = this.checkForRoles(roles, DEPARTMENT_CHIEF);
      
      if (json.userId !== undefined) {
        this.employeeService.findByUser(json.userId).subscribe({
          next: (value: Employee) => {
            this.employee = value;
            if (this.employee.id !== undefined) {
              this.projectHistoryService.getProjectsHistoryOfEmployee(this.employee.id).subscribe({
                next: (value: ProjectHistory[]) => {
                  this.projectsHistory = value;
                },
                error: (err: any) => {

                },
                complete: () => {

                },
              })
              if (this.showTab) {
                this.getAllEmployeesByDepartment();
              }
            }
          },
          error: (err) => { },
          complete: () => {

          },
        });
      }
    }
  }
  public goToEdit() {
    this.router.navigate([`/employee/edit/${this.employee.id}`])
  }

  private checkForRoles(roles: Role[], searchRoleCode: string): boolean {
    for (let role of roles) {
      if (role.code === searchRoleCode) {
        return true;
        break;
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
    if (this.employee.department?.id !== undefined) {
      this.employeeService.findByDepartment(this.employee.department?.id, this.page).subscribe({
        next: (value: EmployeeSearchResult) => {
            this.employees = value.employees ?? [];
            this.page.pageCount = value.size ?? 0;
        },
        error: (err) => {
            
        },
        complete: () => {
            
        },
      });
    }
  }
}
