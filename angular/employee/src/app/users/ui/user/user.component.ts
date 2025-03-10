import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    imports: [RouterOutlet, ConfirmDialog]
})
export class UserComponent {

}
