import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subscription, Subject, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { ProjectSearchResult } from '../../../models/project-search-result.model';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';
import { CrudOperations } from '../../../shared/crud-operations';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss',
    standalone: false
})
export class ProjectListComponent implements OnInit, OnDestroy, CrudOperations {
  private projects$!: Subscription;
  private searchSubject = new Subject<Project>();
  public projectSearch: Project = {};
  public projectId: number | null = 0;
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: "asc"
  };
  public projects: Project[] = [];
  public visible: boolean = false;
  public editVisible: boolean = false;
  public modalTitle: string = '';
  public disable: boolean = false;
  private projectService: ProjectService = inject(ProjectService);
  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.getAll();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.projectService.search(value, this.page).subscribe({
          next: (value) => {
            this.projects = value.projects ?? [];
            this.page.pageCount = value.size ?? 0;
          },
          error: (err) => {
            fireToast('error', 'Error', err.error.message, this.messageService);
          }
        })
      },
      error: (err) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      }
    });
  }
  ngOnDestroy(): void {
    this.projects$.unsubscribe();
    this.searchSubject.complete();
  }

  public addNew(): void {
    this.goToEdit(null);
  }

  public checkSearchFields(): boolean {
    return Boolean(this.projectSearch.name);
  }

  public clear(): void {
    this.projectSearch = {};
    this.getAll();
  }

  public delete(): void {
    if (this.projectId) {
      this.projectService.delete(this.projectId).subscribe({
        next: () => {
          this.retrieve();
          fireToast(
            'success',
            'success',
            `Project with id ${this.projectId} has been deleted.`,
            this.messageService
          );
          this.showDialog(false);
        },
        error: (err: any) => {
          fireToast('error', 'Error', err.error.message, this.messageService);
        },
        complete: () => {
        },
      });
    }
  }

  public getAll(): void {
    const projectObserver: any = {
      next: (value: ProjectSearchResult) => {
        this.projects = value.projects ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => { },
    };

    this.projects$ = this.projectService
      .getAllProjects(false, this.page)
      .subscribe(projectObserver);
  }

  public goToDetails(id: number): void {
    const route = `/project/details/${id}`
    this.router.navigate([route]);
  }

  public goToEdit(id: number | null): void {
    const title = id ? `Project ${id}` : 'Add new Project'
    this.setEditParams(true, id, title, false);
  }

  public handleCancel(event: any): void {
    this.editVisible = event.visible;
    if (event.save) {
      this.refresh();
    }
  }

  public onKeyUp(): void {
    this.retrieve();
  }

  public onPageChange(event: PaginatorState): void {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.retrieve();
  }

  public refresh(): void {
    this.retrieve();
  }

  public retrieve(): void {
    this.checkSearchFields() ? this.search() : this.getAll();
  }

  public search(): void {
    this.searchSubject.next(this.projectSearch);
  }

  public setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void {
    this.editVisible = editVisible;
    this.projectId = id;
    this.modalTitle = modalTitle;
    this.disable = disable;
  }

  public showDialog(visible: boolean, id?: number): void {
    this.projectId = id ?? 0;
    this.visible = visible;
  };

}
