import { Component } from '@angular/core';
import { messageLife } from '../../shared/constants.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: false
})
export class AuthComponent {
  life = messageLife;
}
