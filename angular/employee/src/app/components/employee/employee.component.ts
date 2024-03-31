import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
}
