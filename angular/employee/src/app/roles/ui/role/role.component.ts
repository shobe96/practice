import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrl: './role.component.scss',
    imports: [RouterOutlet, ConfirmDialog]
})
export class RoleComponent {

}
