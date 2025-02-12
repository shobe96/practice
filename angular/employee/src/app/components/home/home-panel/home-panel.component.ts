import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { Router } from '@angular/router';
import { ProjectHistory } from '../../../models/project-history.model';
import { PageEvent } from '../../../models/page-event.model';
import { PaginatorState } from 'primeng/paginator';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
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
