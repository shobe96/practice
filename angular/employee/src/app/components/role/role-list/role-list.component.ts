import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { Role } from '../../../models/role.model';
import { Router } from '@angular/router';
import { RoleService } from '../../../services/role/role.service';
import { RoleSearchResult } from '../../../models/role-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<Role>();
  private roles$!: Subscription;
  roleId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  roles: Role[] = [];
  visible: boolean = false;
  roleSearch: Role = new Role();
  constructor(
    private roleService: RoleService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.roleService.search(value, this.page).subscribe({
          next: (result) => {
            this.roles = result.roles ?? [];
            this.page.pageCount = result.size ?? 0;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => { },
        });
      },
    });
  }
  ngOnDestroy(): void {
    this.roles$.unsubscribe();
    this.searchSubject.complete();
  }

  goToDetails(roleId: number) {
    this.router.navigate([`role/details/${roleId}`]);
  }

  goToEdit(roleId: number) {
    this.router.navigate([`role/edit/${roleId}`]);
  }

  getAllRoles() {
    const roleObserver: any = {
      next: (value: RoleSearchResult) => {
        this.roles = value.roles ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('Completed');
      },
    };

    this.roles$ = this.roleService
      .getAllRoles(false, this.page)
      .subscribe(roleObserver);
  }

  public addNew() {
    this.router.navigate(['role/new']);
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    if (
      this.roleSearch.name !== undefined &&
      this.roleSearch.name !== ''
    ) {
      this.search();
    } else {
      this.getAllRoles();
    }
  }
  search() {
    this.searchSubject.next(this.roleSearch);
  }

  showDialog(visible: boolean, roleId?: number) {
    this.roleId = roleId ?? 0;
    this.visible = visible;
  }

  clear() {
    this.roleSearch = new Role();
    this.getAllRoles();
  }

  public refresh() {
    if (
      (this.roleSearch.name !== undefined &&
        this.roleSearch.name !== '')
    ) {
      this.search();
    } else {
      this.getAllRoles();
    }
  }

  delete() {
    this.roleService.delete(this.roleId).subscribe({
      next: (value: any) => {
        if (
          this.roleSearch.name !== undefined &&
          this.roleSearch.name !== ''
        ) {
          this.search();
        } else {
          this.getAllRoles();
        }
        fireToast(
          'success',
          'success',
          `Role with id ${this.roleId} has been deleted.`,
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
      this.roleSearch.name !== undefined &&
      this.roleSearch.name !== ''
    ) {
      this.search();
    } else {
      this.getAllRoles();
    }
  }

}

