import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthResponse } from '../../../models/auth-response.model';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project/project.service';
import { ProjectHistoryService } from '../../../services/project-history/project-history.service';
import { ProjectHistory } from '../../../models/project-history.model';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss'
})
export class HomePanelComponent implements OnInit {


  employee: Employee = {};
  projectsHistory: ProjectHistory[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private projectService: ProjectService,
    private projectHistoryService: ProjectHistoryService
  ) { }

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse !== null) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
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
}
