import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { Department } from '../../data-access/department.model';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { DepartmentListFacadeService } from '../../data-access/department-list.facade.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DepartmentEditComponent } from '../department-edit/department-edit.component';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { Button } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    TableModule,
    PrimeTemplate,
    Paginator,
    ProgressSpinner,
    SearchFilterWrapperComponent,
    IconButtonComponent,
    TranslatePipe
  ]
})
export class DepartmentListComponent {

  private readonly _translateService = inject(TranslateService);

  departmentId: number | null = 0;

  actionButtons: ActionButtons<Department>[] = [
    {
      icon: 'pi pi-eye',
      action: (dep: Department) => this.goToDetails(dep),
      severity: 'success',
      tooltip: 'View Department'
    },
    {
      icon: 'pi pi-pencil',
      action: (dep: Department) => this.goToEdit(dep, false),
      severity: 'warn',
      tooltip: 'Edit Department'
    },
    {
      icon: 'pi pi-trash',
      action: (dep: Department) => this.showDeleteDialog(dep.id),
      severity: 'danger',
      tooltip: 'Delete Department'
    }
  ];

  readonly currentLang = toSignal(
      this._translateService.onLangChange.pipe(
        map((event) => event.lang),
        startWith(this._translateService.getCurrentLang() || 'en')
      )
    );

  private readonly _departmentListFacade = inject(DepartmentListFacadeService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _dialogService = inject(DialogService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  departmentFormGroup = this._formBuilder.group({
    name: ['']
  });

  private readonly _queryParamsSignal = toSignal(this._activatedRoute.queryParams, {
    initialValue: {}
  });

  private readonly _departmentFormSignal = toSignal(
    this.departmentFormGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()),
    { initialValue: this.departmentFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    size: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._departmentListFacade.viewModel$, {
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
      this._departmentListFacade.search(params);
    });

    effect(() => {
      const value = this._departmentFormSignal();
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
    this._departmentListFacade.clear();
  }

  goToDetails(department: Department): void {
    this.goToEdit(department, true);
  }

  goToEdit(department: Department | null, disable: boolean): void {
    const title = department ? `Department ${department.id}` : 'Add new Department';
    const dialogRef = this._dialogService.open(DepartmentEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        department: department,
        disable: disable
      },
      baseZIndex: 10000,
      maximizable: true
    });

    dialogRef?.onClose.subscribe((value: boolean) => {
      if (value) {
        this.refresh();
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this._departmentListFacade.onPageChange(event);
  }

  refresh(): void {
    this._departmentListFacade.retrieve();
  }

  showDeleteDialog(id: number | undefined): void {
    if (id) {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete department with id: ${id}`,
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
          this._departmentListFacade.delete(id);
        },
      });
    }
  }

  nameSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('DEPARTMENT.LIST.FILTERS.NAME');
  });

  addNewLabel = computed(() => {
    this.currentLang();
    return this._translateService.instant('EMPLOYEES.LIST.ADD');
  });

  private _clearSearchFields() {
    this.departmentFormGroup.controls['name'].setValue('');
    this._router.navigate([], { queryParams: { name: '' }, queryParamsHandling: 'merge' })
  }
}
