import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Employee } from '../../../employees/data-access/employee.model';
import { Router } from '@angular/router';
import { ProjectHistory } from '../../../projects/data-access/project-history.model';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { Project } from '../../../projects/data-access/project.model';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, TableModule, PrimeTemplate, Paginator, DatePipe, TranslatePipe]
})
export class HomePanelComponent {

  @Input() employee: Employee = {};
  @Input() departmentEmployees: Employee[] = [];
  @Input() projectsHistory: ProjectHistory[] = [];
  @Input() activeProject: Project = {};
  @Input() page: PageEvent = {
    page: 0,
    first: 0,
    size: 5,
    pageCount: 0,
    sort: 'asc',
  };

  private _router = inject(Router);
  private _translate = inject(TranslateService);

  goToEdit() {
    this._router.navigate([`/employee/edit/${this.employee.id}`])
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.size = event.rows ?? 0;
  }

  translateStatus(active: boolean | undefined) {
    if (active) {
      return this._translate.instant("HOME.PANEL.GENERAL.ASSAIGNED");
    } else {
      return this._translate.instant("HOME.PANEL.GENERAL.FREE");
    }
  }
}
