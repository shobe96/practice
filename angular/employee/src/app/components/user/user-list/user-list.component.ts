import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserSearchResult } from '../../../models/user-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { AuthService } from '../../../services/auth/auth.service';
import { fireToast } from '../../../shared/utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserListFacadeService } from '../../../services/user/user-list.facade.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false
})
export class UserListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  userFormGroup!: FormGroup;
  userSearch: User = {};
  userId: number | null = 0;
  userListFacade: UserListFacadeService = inject(UserListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.userListFacade.getAll();
    this._subsribeToFormGroup();
  }

  private _buildForm() {
    this.userFormGroup = this._formBuilder.group({
      username: [''],
    });
  }

  delete() {
    this.userListFacade.delete(this.userId, this.userSearch);
  }
  onPageChange(event: PaginatorState) {
    this.userListFacade.onPageChange(this.userSearch, event);
  }

  clear(): void {
    this._clearSearchFields();
    this.userListFacade.clear();
  }

  refresh(): void {
    this.userListFacade.retrieve(this.userSearch);
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.userId = id ?? 0;
    this.userListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subsribeToFormGroup() {
    this.userFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((value: User) => {
        if (value.username) {
          this.userSearch = value;
          this.userListFacade.search(value);
        }
      });
  }

  private _clearSearchFields() {
    this.userFormGroup.controls['username'].setValue('');
    this.userSearch = {};
  }
}
