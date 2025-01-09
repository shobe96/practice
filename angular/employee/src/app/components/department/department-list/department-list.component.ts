import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department/department.service';
import { DepartmentSearchResult } from '../../../models/department-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';
import { CrudOperations } from '../../../shared/crud-operations';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit, OnDestroy, CrudOperations {
  private searchSubject = new Subject<Department>();
  private departments$!: Subscription;
  public departmentId: number | null = 0;
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  public departments: Department[] = [];
  public visible: boolean = false;
  public editVisible: boolean = false;
  public modalTitle: string = '';
  public disable: boolean = false;
  public departmentSearch: Department = new Department();
  private departmentService: DepartmentService = inject(DepartmentService);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.getAll();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.departmentService.search(value, this.page).subscribe({
          next: (result) => {
            this.departments = result.departments ?? [];
            this.page.pageCount = result.size ?? 0;
          },
          error: (err) => {
            fireToast('error', 'Error', err.error.message, this.messageService);
          },
          complete: () => { },
        });
      },
    });
  }
  ngOnDestroy(): void {
    this.departments$.unsubscribe();
    this.searchSubject.complete();
  }

  public addNew(): void {
    this.goToEdit(null);
  }

  public checkSearchFields(): boolean {
    return Boolean(this.departmentSearch.name);
  }

  public clear(): void {
    this.departmentSearch = new Department();
    this.getAll();
  }

  public delete(): void {
    if (this.departmentId) {
      this.departmentService.delete(this.departmentId).subscribe({
        next: () => {
          this.retrieve();
          fireToast(
            'success',
            'success',
            `Department with id ${this.departmentId} has been deleted.`,
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
    const departmentObserver: any = {
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => {},
    };

    this.departments$ = this.departmentService
      .getAllDepartments(false, this.page)
      .subscribe(departmentObserver);
  }

  public goToDetails(id: number): void {
    this.setEditParams(true, id, `Department ${id}`, true);
  }

  public goToEdit(id: number | null): void {
    const title = id ?  `Department ${id}` : 'Add new Department'
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
    this.searchSubject.next(this.departmentSearch);
  }

  public setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void {
    this.editVisible = editVisible;
    this.departmentId = id;
    this.modalTitle = modalTitle;
    this.disable = disable;
  }

  public showDialog(visible: boolean, id?: number): void {
    this.departmentId = id ?? 0;
    this.visible = visible;
  };
}
