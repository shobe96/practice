import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../data-access/project.model';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { ProjectDetailsFacadeService } from '../../data-access/project-details.facade.service';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  imports: [Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, TableModule, PrimeTemplate, Button, Tooltip]
})
export class ProjectDetailsComponent {

  project!: Project;
  employeeId = 0;
  visible = false;

  private _projectDetailsFacade = inject(ProjectDetailsFacadeService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router)
  private _confirmationService = inject(ConfirmationService);

  viewModel = toSignal(this._projectDetailsFacade.viewModel$);

  routeParams = toSignal(this._route.params);

  constructor() {
    effect(() => {
      const params = this.routeParams();
      if (params) {
        this._projectDetailsFacade.getProject(params['projectId']);
      }
    });
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
        this._projectDetailsFacade.unassignEmployee(employeeId, project);
      },
    });
  }
}
