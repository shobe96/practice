import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit {
  employee!: Employee;
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.employee = this.route.snapshot.data['employee'];
    console.log(this.employee);
  }
}
