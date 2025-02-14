import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserListFacadeService } from '../../../services/user/user-list.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  userFormGroup!: FormGroup;
  userSearch: User = {};
  userId: number | null = 0;

  userListFacade: UserListFacadeService = inject(UserListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._buildForm();
    this.userListFacade.getAll();
    this._subscribeToFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  delete() {
    this.userListFacade.delete(this.userId);
  }

  onPageChange(event: PaginatorState) {
    this.userListFacade.onPageChange(event);
  }

  clear(): void {
    this._clearSearchFields();
    this.userListFacade.clear();
  }

  refresh(): void {
    this.userListFacade.retrieve();
  }

  showDeleteDialog(id: number): void {
    this._confirmationService.confirm({
      message: `Are you sure you want to delete project with id: ${id}`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'danger'
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.userListFacade.delete(id);
      },
    });
  }

  private _subscribeToFormGroup() {
    this.userFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe((value: User) => {
        if (value.username) {
          this._router.navigate([], { queryParams: { username: value.username }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.userFormGroup.controls['username'].setValue('');
    this._router.navigate([], { queryParams: { username: '' }, queryParamsHandling: 'merge' })
  }

  private _buildForm() {
    this.userFormGroup = this._formBuilder.group({
      username: [''],
    });
  }
}
