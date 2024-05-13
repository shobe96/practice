import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserSearchResult } from '../../../models/user-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { AuthService } from '../../../services/auth/auth.service';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  private users$!: Subscription;
  userId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: "asc"
  };
  users: User[] = [];
  visible: boolean = false;

  constructor(private userService: UserService, private router: Router, private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  ngOnDestroy(): void {
    this.users$.unsubscribe();
  }

  public getAllUsers() {
    const usersObserver: any = {
      next: (value: UserSearchResult) => {
        this.users = value.users ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        console.log(err);
        fireToast('error', 'Error', err.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    };
    this.users$ = this.userService.getAllUsers(this.page).subscribe(usersObserver);
  }

  delete() {
    this.authService.delete(this.userId).subscribe({
      next: (value: any) => {
        this.getAllUsers();
        this.showDialog(false);
        fireToast("success", "success", `Employee with id ${this.userId} has been deleted.`, this.messageService);
      },
      error: (err: any) => { console.log(err); fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { console.log("Completed") }
    });
  }
  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.getAllUsers();
  }
  showDialog(visible: boolean, userId?: number) {
    this.userId = userId ?? 0;
    this.visible = visible;
  }
}
