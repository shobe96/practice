import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { Project } from '../../data-access/project.model';
import { ProjectListFacadeService } from '../../data-access/project-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectEditComponent } from '../project-edit/project-edit.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText, Button,
    TableModule,
    PrimeTemplate,
    Paginator,
    DatePipe,
    ProgressSpinner,
    SearchFilterWrapperComponent,
    IconButtonComponent,
    TranslatePipe
  ]
})
export class ProjectListComponent {

  private readonly _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  projectId: number | null = 0;
  readonly actionButtons = computed((): ActionButtons<Project>[] => {
      const feature = this.currentLang() === 'en' ? 'Project' : 'Projekat';
  
      return [
        {
          icon: 'pi pi-eye',
          action: (pro: Project) => this.goToDetails(pro),
          severity: 'success',
          // Translate the tooltips
          tooltip: this._translateService.instant('TABLE.ACTIONS.VIEW', {
            feature: feature,
          }),
        },
        {
          icon: 'pi pi-pencil',
          action: (pro: Project) => this.goToEdit(pro),
          severity: 'warn',
          tooltip: this._translateService.instant('TABLE.ACTIONS.EDIT', {
            feature: feature,
          }),
        },
        {
          icon: 'pi pi-trash',
          action: (pro: Project) => this.showDeleteDialog(pro.id),
          severity: 'danger',
          tooltip: this._translateService.instant('TABLE.ACTIONS.DELETE', {
            feature: feature,
          }),
        },
      ];
    });

  private readonly _projectListFacade: ProjectListFacadeService = inject(ProjectListFacadeService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);
  private readonly _dialogService: DialogService = inject(DialogService);
  private readonly _confirmationService: ConfirmationService = inject(ConfirmationService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  projectFormGroup = this._formBuilder.group({
    name: [''],
    code: ['']
  });

  private readonly _queryParamsSignal = toSignal(this._activatedRoute.queryParams, {
    initialValue: {}
  });

  private readonly _projectFormSignal = toSignal(
    this.projectFormGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()),
    { initialValue: this.projectFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    size: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._projectListFacade.viewModel$, {
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
      this._projectListFacade.search(params);
    });

    effect(() => {
      const value = this._projectFormSignal();
      const { name, code } = value;
      if (name || code) {
        this._router.navigate([], {
          queryParams: { name, code },
          queryParamsHandling: 'merge',
        });
      }
    });
  }
  
  addNewLabel = computed(() => {
    this.currentLang();
    return this._translateService.instant('PROJECT.LIST.ADD');
  });

  nameSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('PROJECT.LIST.FILTERS.NAME');
  });

  codeSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('PROJECT.LIST.FILTERS.CODE');
  });

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this._projectListFacade.clear();
  }

  delete(): void {
    this._projectListFacade.delete(this.projectId);
  }

  goToDetails(project: Project): void {
    this._router.navigate([`/project/details/${project.id}`])
  }

  goToEdit(project: Project | null): void {
    const newLabel = this.currentLang() === 'en' ? 'Project' : 'novi Projekat';
    const title = project
      ? `${this._translateService.instant('PROJECT.FORM.TITLE')} ${
          project.id
        }`
      : this._translateService.instant('FORM.TITLE', { feature: newLabel });
    const dialogRef = this._dialogService.open(ProjectEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        project: project
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
    this._projectListFacade.onPageChange(event);
  }

  refresh(): void {
    this._projectListFacade.retrieve();
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
          this._projectListFacade.delete(id);
        },
      });
    }
  }

  private _clearSearchFields() {
    this.projectFormGroup.controls['name'].setValue('');
    this.projectFormGroup.controls['code'].setValue('');
    this._router.navigate([], { queryParams: { name: '', code: '' }, queryParamsHandling: 'merge' })
  }
}
