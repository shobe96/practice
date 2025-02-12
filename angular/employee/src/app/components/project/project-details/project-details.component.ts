import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';
import { MessageService } from 'primeng/api';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { takeUntil } from 'rxjs';
import { ProjectDetailsFacadeService } from '../../../services/project/project-details.facade.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  standalone: false
})
export class ProjectDetailsComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  project!: Project;
  employeeId: number = 0;
  visible: boolean = false;

  projectDetailsFacade: ProjectDetailsFacadeService = inject(ProjectDetailsFacadeService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router)

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.project = this._route.snapshot.data['project'];
    this._route.params.subscribe((params: any) => {
      this.projectDetailsFacade.getProject(params.projectId);
    })
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  back() {
    this._router.navigate(["project/list"])
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId ?? 0;
    this.projectDetailsFacade.showDialog(visible);
  }

  unassignEmployee(project: Project) {
    this.projectDetailsFacade.unassignEmployee(this.employeeId, project);
  }
}
