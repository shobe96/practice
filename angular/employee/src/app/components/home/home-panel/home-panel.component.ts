import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';
import { ProjectHistory } from '../../../models/project-history.model';
import { PageEvent } from '../../../models/page-event.model';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { Project } from '../../../models/project.model';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf, DatePipe } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-home-panel',
    templateUrl: './home-panel.component.html',
    styleUrl: './home-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, TableModule, PrimeTemplate, NgIf, Paginator, Button, DatePipe]
})
export class HomePanelComponent {

  @Input() employee: Employee = {};
  @Input() departmentEmployees: Employee[] = [];
  @Input() projectsHistory: ProjectHistory[] = [];
  @Input() activeProject: Project = {};
  @Input() page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };

  private _router: Router = inject(Router);

  goToEdit() {
    this._router.navigate([`/employee/edit/${this.employee.id}`])
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
  }
}
