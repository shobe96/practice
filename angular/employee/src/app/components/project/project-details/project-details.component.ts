import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss',
    standalone: false
})
export class ProjectDetailsComponent implements OnInit {

  project!: Project;
  employeeId: number = 0;
  visible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.project = this.route.snapshot.data['project'];
  }

  back() {
    this.router.navigate(["project/list"])
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId ?? 0;
    this.visible = visible;
  }

  unassignEmployee() {
    this.projectService.unassignEmployee(this.employeeId, this.project).subscribe({
      next: (value: any) => {
        this.project.employees = this.project.employees?.filter(val => {
          return val.id !== this.employeeId;
        });
        fireToast('success', 'Success', 'Employee unassigned successfully', this.messageService);
        this.showDialog(false);
      },
      error: (err: any) => {
        fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService);
      },
      complete: () => { }
    })
  }
}
