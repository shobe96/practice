import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { Department } from '../../../models/department.model';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../services/department/department.service';
import { DepartmentSearchResult } from '../../../models/department-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<Department>();
  private departments$!: Subscription;
  departmentId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  departments: Department[] = [];
  visible: boolean = false;
  departmentSearch: Department = new Department();

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.departmentService.search(value, this.page).subscribe({
          next: (result) => {
            this.departments = result.departments ?? [];
            this.page.pageCount = result.size ?? 0;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {},
        });
      },
    });
  }
  ngOnDestroy(): void {
    this.departments$.unsubscribe();
    this.searchSubject.complete();
  }

  goToDetails(departmentId: number) {
    this.router.navigate([`department/details/${departmentId}`]);
  }

  goToEdit(departmentId: number) {
    this.router.navigate([`department/edit/${departmentId}`]);
  }

  getAllDepartments() {
    const departmentObserver: any = {
      next: (value: DepartmentSearchResult) => {
        this.departments = value.departments ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('Completed');
      },
    };

    this.departments$ = this.departmentService
      .getAllDepartments(false, this.page)
      .subscribe(departmentObserver);
  }

  public addNew() {
    this.router.navigate(['department/new']);
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    if (
      this.departmentSearch.name !== undefined &&
      this.departmentSearch.name !== ''
    ) {
      this.search();
    } else {
      this.getAllDepartments();
    }
  }
  search() {
    this.searchSubject.next(this.departmentSearch);
  }

  showDialog(visible: boolean, departmentId?: number) {
    this.departmentId = departmentId ?? 0;
    this.visible = visible;
  }

  clear() {
    this.departmentSearch = new Department();
    this.getAllDepartments();
  }

  delete() {
    this.departmentService.delete(this.departmentId).subscribe({
      next: (value: any) => {
        if (
          this.departmentSearch.name !== undefined &&
          this.departmentSearch.name !== ''
        ) {
          this.search();
        } else {
          this.getAllDepartments();
        }
        fireToast(
          'success',
          'success',
          `Department with id ${this.departmentId} has been deleted.`,
          this.messageService
        );
        this.showDialog(false);
      },
      error: (err: any) => {
        console.log(err);
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  onKeyUp() {
    if (
      this.departmentSearch.name !== undefined &&
      this.departmentSearch.name !== ''
    ) {
      this.search();
    } else {
      this.getAllDepartments();
    }
  }
}
