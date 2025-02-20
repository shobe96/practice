import { Component } from '@angular/core';
import { messageLife } from '../../shared/constants.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  standalone: false
})
export class EmployeeComponent {
  life = messageLife;
}
