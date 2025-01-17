import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';
import { MessageService } from 'primeng/api';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  standalone: false
})
export class ProjectDetailsComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router)
  private projectService: ProjectService = inject(ProjectService)
  private messageService: MessageService = inject(MessageService);

  project!: Project;
  employeeId: number = 0;
  visible: boolean = false;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.project = this.route.snapshot.data['project'];
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  back() {
    this.router.navigate(["project/list"])
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId ?? 0;
    this.visible = visible;
  }

  unassignEmployee() {
    this.projectService.unassignEmployee(this.employeeId, this.project)
      .pipe(
        takeUntil(this.componentIsDestroyed$),
      )
      .subscribe({
        next: () => {
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
