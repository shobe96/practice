import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss'
})
export class RoleDetailsComponent implements OnInit {
  role!: Role;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.role = this.route.snapshot.data['role'];
  }

  back() {
    this.router.navigate(["role/list"])
  }

  goToEdit() {
    this.router.navigate([`role/edit/${this.role.id}`]);
  }
}
