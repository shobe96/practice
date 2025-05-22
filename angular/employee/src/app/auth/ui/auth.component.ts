import { Component } from '@angular/core';
import { messageLife } from '../../shared/constants.model';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    imports: [RouterOutlet, Toast]
})
export class AuthComponent {
  life = messageLife;
}
