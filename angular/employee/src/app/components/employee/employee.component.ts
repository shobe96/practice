import { Component } from '@angular/core';
import { messageLife } from '../../shared/constants.model';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrl: './employee.component.scss',
    imports: [RouterOutlet, Toast, ConfirmDialog]
})
export class EmployeeComponent {
  life = messageLife;
}
