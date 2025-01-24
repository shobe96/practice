import { Component } from '@angular/core';
import { messageLife } from '../../shared/constants.model';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  standalone: false
})
export class DepartmentComponent {
  life = messageLife;

}
