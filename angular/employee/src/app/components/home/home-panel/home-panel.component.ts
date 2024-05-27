import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthResponse } from '../../../models/auth-response.model';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss'
})
export class HomePanelComponent implements OnInit {


  employee: Employee = {};

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse !== null) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
      if (json.userId !== undefined) {
        this.employeeService.findByUser(json.userId).subscribe({
          next: (value: Employee) => {
            this.employee = value;
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
