import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../data-access/role.model';
import { RoleListFacadeService } from '../../data-access/role-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    Button,
    TableModule,
    PrimeTemplate,
    Paginator,
    ProgressSpinner,
    IconButtonComponent,
    SearchFilterWrapperComponent
  ]
})
export class RoleListComponent {

  roleId: number | null = 0;
  actionButtons: ActionButtons<Role>[] = [
    {
      icon: 'pi pi-eye',
      action: (role: Role) => this.goToDetails(role),
      severity: 'success',
      tooltip: 'View Role'
    },
    {
      icon: 'pi pi-pencil',
      action: (role: Role) => this.goToEdit(role, false),
      severity: 'warn',
      tooltip: 'Edit Role'
    },
    {
      icon: 'pi pi-trash',
      action: (role: Role) => this.showDeleteDialog(role.id),
      severity: 'danger',
      tooltip: 'Delete Role'
    }
  ];

  private readonly _roleListFacade = inject(RoleListFacadeService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _dialogService = inject(DialogService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  roleFormGroup = this._formBuilder.group({
    name: [''],
  });

  private readonly _queryParamsSignal = toSignal(this._activatedRoute.queryParams, {
    initialValue: {}
  });

  private readonly _roleFormSignal = toSignal(
    this.roleFormGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()),
    { initialValue: this.roleFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._roleListFacade.viewModel$, {
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
      this._roleListFacade.search(params);
    });

    effect(() => {
      const value = this._roleFormSignal();
      const { name } = value;
      if (name) {
        this._router.navigate([], {
          queryParams: { name },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  addNew(): void {
    this.goToEdit(null, false);
  }

  clear(): void {
    this._clearSearchFields();
    this._roleListFacade.clear();
  }

  delete(): void {
    this._roleListFacade.delete(this.roleId);
  }

  goToDetails(role: Role): void {
    this.goToEdit(role, true);
  }

  goToEdit(role: Role | null, disable: boolean): void {
    const title = role ? `Role ${role.id}` : 'Add new Role';
    const dialogRef = this._dialogService.open(RoleEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        role: role,
        disable: disable
      },
      baseZIndex: 10000,
      maximizable: true
    });

    dialogRef.onClose.subscribe((value: boolean) => {
      if (value) {
        this.refresh();
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this._roleListFacade.onPageChange(event);
  }

  refresh(): void {
    this._roleListFacade.retrieve();
  }

  showDeleteDialog(id: number | undefined): void {
    if (id) {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete role with id: ${id}`,
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
          this._roleListFacade.delete(id);
        },
      });
    }
  }

  private _clearSearchFields() {
    this.roleFormGroup.controls['name'].setValue('');
    this._router.navigate([], { queryParams: { name: '' }, queryParamsHandling: 'merge' })
  }
}

