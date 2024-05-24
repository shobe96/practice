import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subscription, Subject, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { ProjectSearchResult } from '../../../models/project-search-result.model';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project/project.service';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit, OnDestroy {

  private projects$!: Subscription;
  private searchSubject = new Subject<Project>();
  projectSearch: Project = new Project();
  projectId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: "asc"
  };
  projects: Project[] = [];
  visible: boolean = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAllProjects();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.projectService.search(value, this.page).subscribe({
          next: (value) => {
            this.projects = value.projects ?? [];
            this.page.pageCount = value.size ?? 0;
          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  ngOnDestroy(): void {
    this.projects$.unsubscribe();
    this.searchSubject.complete();
  }

  public getAllProjects() {
    const projectsObserver: any = {
      next: (value: ProjectSearchResult) => {
        this.projects = value.projects ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    };
    this.projects$ = this.projectService.getAllProjects(false, this.page).subscribe(projectsObserver);
  }

  public addNew() {
    this.router.navigate(["project/new"]);
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    if (this.projectSearch.name !== undefined && this.projectSearch.name !== "") {
      this.search();
    } else {
      this.getAllProjects();
    }
  }

  showDialog(visible: boolean, projectId?: number) {
    this.projectId = projectId ?? 0;
    this.visible = visible;
  }

  delete() {
    this.projectService.delete(this.projectId).subscribe({
      next: (value: any) => {
        if (this.projectSearch.name !== undefined && this.projectSearch.name !== "") {
          this.search();
        } else {
          console.log("DELETE");
          this.getAllProjects();
        }
        fireToast("success", "success", `Project with id ${this.projectId} has been deleted.`, this.messageService);
        this.showDialog(false);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { console.log("Completed") }
    });
  }

  onKeyUp() {
    if (this.projectSearch.name !== undefined && this.projectSearch.name !== "") {
      this.search();
    } else {
      this.getAllProjects();
    }
  }

  clear() {
    this.projectSearch = new Project();
    this.getAllProjects();
  }
  public refresh() {
    if (
      (this.projectSearch.name !== undefined &&
        this.projectSearch.name !== '')
    ) {
      this.search();
    } else {
      this.getAllProjects();
    }
  }
  search() {
    console.log(this.projectSearch);
    this.searchSubject.next(this.projectSearch);
  }

  goToDetails(projectId: number) {
    this.router.navigate([`project/details/$${projectId}`]);
  }

  goToEdit(projectId: number) {
    this.router.navigate([`project/edit/${projectId}`]);
  }

}
