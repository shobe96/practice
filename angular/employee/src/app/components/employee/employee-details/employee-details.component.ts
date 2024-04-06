import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit {

  employee!: Employee;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.employee = this.route.snapshot.data['employee'];
  }

  back() {
    this.router.navigate(["employee/list"])
  }
}
