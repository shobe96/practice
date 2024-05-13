import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;
constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.project = this.route.snapshot.data['project'];
  }

  back() {
    this.router.navigate(["project/list"])
  }
}
