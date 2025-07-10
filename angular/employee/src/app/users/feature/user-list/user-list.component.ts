import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../../data-access/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserListFacadeService } from '../../data-access/user-list.facade.service';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { AuthFacadeService } from '../../../auth/data-access/auth.facade.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    TableModule,
    PrimeTemplate,
    Paginator,
    ProgressSpinner,
    SearchFilterWrapperComponent,
    IconButtonComponent
  ]
})
export class UserListComponent implements OnInit {

  userId: number | null = 0;
  actionButtons: ActionButtons<User>[] = [
    {
      icon: 'pi pi-trash',
      action: (usr: User) => this.showDeleteDialog(usr.id),
      severity: 'danger',
      tooltip: 'Delete Employee'
    }
  ];

  private readonly _userListFacade = inject(UserListFacadeService);
  private readonly _authFacade = inject(AuthFacadeService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  userFormGroup = this._formBuilder.group({
    username: [''],
  });

  private readonly _queryParamsSignal = toSignal(this._activatedRoute.queryParams, {
    initialValue: {}
  });

  private readonly _employeeFormSignal = toSignal(
    this.userFormGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()),
    { initialValue: this.userFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._userListFacade.viewModel$, {
    initialValue: {
      data: [],
      page: this._defaultPage,
      rowsPerPage: [],
      loading: false
    }
  });

  constructor() {
    effect(() => {
      const params = this._queryParamsSignal();
      this._userListFacade.search(params);
    });

    effect(() => {
      const value = this._employeeFormSignal();
      const { username } = value;
      if (username) {
        this._router.navigate([], {
          queryParams: { username },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  ngOnInit(): void {
    this._userListFacade.retrieve();
  }

  onPageChange(event: PaginatorState) {
    this._userListFacade.onPageChange(event);
  }

  clear(): void {
    this._clearSearchFields();
    this._userListFacade.clear();
  }

  refresh(): void {
    this._userListFacade.retrieve();
  }

  showDeleteDialog(id: number | undefined): void {
    if (id) {
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
          this._authFacade.deleteUser(id);
          this._userListFacade.retrieve();
        },
      });
    }
  }

  private _clearSearchFields() {
    this.userFormGroup.controls['username'].setValue('');
    this._router.navigate([], { queryParams: { username: '' }, queryParamsHandling: 'merge' })
  }
}
