import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, catchError, combineLatest, finalize } from 'rxjs';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { ProjectSearchResult } from './project-search-result.model';
import { Project } from './project.model';
import { rowsPerPage } from '../../shared/constants.model';
import { ProjectService } from './project.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectListFacadeService {

  private _projectSearch: Project = {}
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
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  viewModel$: Observable<{ projects: Project[], page: PageEvent, rowsPerPage: number[], loading: boolean }> = combineLatest({
    projects: this._projects.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    loading: this._loading.asObservable()
  });

  private _projectService: ProjectService = inject(ProjectService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  clear(): void {
    this._loading.next(true);
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    this._loading.next(true)
    if (id) {
      const projectObserver = {
        next: () => { this.retrieve(); },
        error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
        complete: () => {
          // do nothing.
        }
      }
      this._projectService.delete(id).pipe(catchError((err) => { throw err.error.message }), finalize(() => this._loading.next(false))).subscribe(projectObserver);
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    this._loading.next(true)
    const projectObserver = {
      next: (value: ProjectSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    if (this._checkSearchFields())
      this._projectService.search(this._projectSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }), finalize(() => this._loading.next(false)))
        .subscribe(projectObserver);
    else this._getAll(false);
  }

  search(params: Project): void {
    this._loading.next(true);
    this._projectSearch = params;
    const projectObserver = {
      next: (value: ProjectSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    if (this._checkSearchFields()) {
      this._projectService.search(this._projectSearch, this._defaultPage).pipe(catchError((err) => { throw err.error.message }), finalize(() => this._loading.next(false)))
        .subscribe(projectObserver);
    }
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

  private _checkSearchFields(): boolean {
    return Boolean(this._projectSearch.name ?? this._projectSearch.code);
  }

  private _getAll(all: boolean): void {
    const projectObserver = {
      next: (value: ProjectSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._projectService.getAllProjects(all, this._defaultPage)
      .pipe(catchError((err) => { throw err.error.message }), finalize(() => this._loading.next(false)))
      .subscribe(projectObserver);
  }
}
