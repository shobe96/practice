import { Component, OnInit } from '@angular/core';
import { Department } from '../../../models/department.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent implements OnInit{
  department!: Department;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.department = this.route.snapshot.data['department'];
  }

  back() {
    this.router.navigate(["department/list"])
  }
}
