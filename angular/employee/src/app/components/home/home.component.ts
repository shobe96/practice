import { Component, OnInit } from '@angular/core';
import { AuthResponse } from '../../models/auth-response.model';
import { Role } from '../../models/role.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


  roles: Role[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse !== null) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
      this.roles = json.roles ?? [];
    }
  }

  goToPannel(code: string | undefined) {
    if (code !== undefined) {
      const route = `/home/${code.toLowerCase()}`
      this.router.navigate([route]);
    }
  }
}
