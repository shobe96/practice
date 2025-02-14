import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ConfirmationService } from 'primeng/api';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { ProjectDetailsFacadeService } from '../../../services/project/project-details.facade.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  standalone: false
})
export class ProjectDetailsComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  project!: Project;
  employeeId = 0;
  visible = false;

  projectDetailsFacade: ProjectDetailsFacadeService = inject(ProjectDetailsFacadeService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router)
  private _dialogService: DialogService = inject(DialogService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

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

  unassignEmployee(employeeId: number, project: Project) {
    this._confirmationService.confirm({
      message: `Are you sure you want to unassign employee with id: ${employeeId} from project ${project.name}`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'danger'
      },
      acceptButtonProps: {
        label: 'Unassign',
      },
      accept: () => {
        this.projectDetailsFacade.unassignEmployee(employeeId, project);
      },
    });
  }
}
