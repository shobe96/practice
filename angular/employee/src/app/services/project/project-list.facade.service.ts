import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, combineLatest, debounceTime } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { ProjectSearchResult } from '../../models/project-search-result.model';
import { Project } from '../../models/project.model';
import { rowsPerPage } from '../../shared/constants.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectListFacadeService {

  private _projectService = inject(ProjectService);
  private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  private _page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(this._defaultPage);
  private _rowsPerPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(rowsPerPage);
  private _dialogOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});

  viewModel$: Observable<any> = combineLatest({
    projects: this._projects.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  checkSearchFields(project: Project): boolean {
    return Boolean(project.name ||
      project.code);
  }

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll(false);
  }

  delete(id: number | null, projectSearch: Project): void {
    if (id) {
      this._projectService.delete(id).subscribe(() => {
        this.retrieve(projectSearch);
        this.setDialogParams(null, 'Warning', false, false, false);
      });
    }
  }

  getAll(all: boolean): void {
    this._projectService.getAllProjects(all, this._defaultPage).subscribe((value: ProjectSearchResult) => {
      this._emitValues(value);
    });
  }

  onPageChange(projectSearch: Project, event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve(projectSearch);
  }

  retrieve(projectSearch: Project): void {
    if (this.checkSearchFields(projectSearch))
      this.search(projectSearch)
    else this.getAll(false);
  }

  search(projectSearch: Project): void {
    this._projectService.search(projectSearch, this._defaultPage)
      .pipe(
        debounceTime(2000)
      )
      .subscribe((value: ProjectSearchResult) => {
        this._emitValues(value);
      })
  }

  setDialogParams(project: Project | null, modalTitle: string, editVisible: boolean, deleteVisible: boolean, disable: boolean): void {
    const dialogOptions: any = {};
    dialogOptions.disable = disable;
    dialogOptions.modalTitle = modalTitle;
    dialogOptions.editVisible = editVisible;
    dialogOptions.deleteVisible = deleteVisible;
    dialogOptions.project = project ?? {};
    this._dialogOptions.next(dialogOptions);
  }

  private _emitValues(value: ProjectSearchResult): void {
    if (value.projects) {
      this._projects.next(value.projects);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }
}
