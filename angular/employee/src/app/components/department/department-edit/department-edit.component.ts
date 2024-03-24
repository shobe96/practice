import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.scss'
})
export class DepartmentEditComponent implements OnInit {

  id: number = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    // this.employeService.mySub.next(1);
    this.route.params.subscribe((params: Params) => {
      this.id = params["departmentId"];
    });
  }
}
