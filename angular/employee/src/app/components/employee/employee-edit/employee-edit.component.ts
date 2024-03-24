import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit{

  id: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.employeService.mySub.subscribe((val) => {console.log(val)});
    this.route.params.subscribe((params: Params) => {
      this.id = params["employeeId"];
    });
  }
}
