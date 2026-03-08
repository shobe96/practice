import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { Skill } from '../../data-access/skill.model';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkillListFacadeService } from '../../data-access/skill-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillEditComponent } from '../skill-edit/skill-edit.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActionButtons } from '../../../shared/data-access/action-buttons.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';
import { IconButtonComponent } from '../../../shared/ui/icon-button/icon-button.component';
import { SearchFilterWrapperComponent } from '../../../shared/ui/search-filter-wrapper/search-filter-wrapper.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
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
    SearchFilterWrapperComponent,
    TranslatePipe,
  ],
})
export class SkillListComponent {
  skillId: number | null = 0;

  readonly actionButtons = computed((): ActionButtons<Skill>[] => {
    const feature = this.currentLang() === 'en' ? 'Skill' : 'Veštinu';

    return [
      {
        icon: 'pi pi-eye',
        action: (dep: Skill) => this.goToDetails(dep),
        severity: 'success',
        // Translate the tooltips
        tooltip: this._translateService.instant('TABLE.ACTIONS.VIEW', {
          feature: feature,
        }),
      },
      {
        icon: 'pi pi-pencil',
        action: (dep: Skill) => this.goToEdit(dep, false),
        severity: 'warn',
        tooltip: this._translateService.instant('TABLE.ACTIONS.EDIT', {
          feature: feature,
        }),
      },
      {
        icon: 'pi pi-trash',
        action: (dep: Skill) => this.showDeleteDialog(dep.id),
        severity: 'danger',
        tooltip: this._translateService.instant('TABLE.ACTIONS.DELETE', {
          feature: feature,
        }),
      },
    ];
  });

  private _skillListFacade: SkillListFacadeService = inject(
    SkillListFacadeService
  );
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _dialogService: DialogService = inject(DialogService);
  private _confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  nameSearch = computed(() => {
    this.currentLang();
    return this._translateService.instant('SKILL.LIST.FILTERS.NAME');
  });

  addNewLabel = computed(() => {
    this.currentLang();
    return this._translateService.instant('SKILL.LIST.ADD');
  });
  skillFormGroup = this._formBuilder.group({
    name: [''],
  });

  private readonly _queryParamsSignal = toSignal(
    this._activatedRoute.queryParams,
    {
      initialValue: {},
    }
  );

  private readonly _skillFormSignal = toSignal(
    this.skillFormGroup.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ),
    { initialValue: this.skillFormGroup.getRawValue() }
  );

  private readonly _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    size: 5,
    pageCount: 0,
    sort: 'asc',
  };

  viewModel = toSignal(this._skillListFacade.viewModel$, {
    initialValue: {
      data: [],
      page: this._defaultPage,
      rowsPerPage: [],
      loading: false,
    },
  });

  constructor() {
    effect(() => {
      const params = this._queryParamsSignal();
      this._skillListFacade.search(params);
    });

    effect(() => {
      const value = this._skillFormSignal();
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
    this._skillListFacade.clear();
  }

  goToDetails(skill: Skill): void {
    this.goToEdit(skill, true);
  }

  goToEdit(skill: Skill | null, disable: boolean): void {
    const title = skill ? `Skill ${skill.id}` : 'Add new Skill';
    const dialogRef = this._dialogService.open(SkillEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        skill: skill,
        disable: disable,
      },
      baseZIndex: 10000,
      maximizable: true,
    });

    dialogRef?.onClose.subscribe((value: boolean) => {
      if (value) {
        this.refresh();
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this._skillListFacade.onPageChange(event);
  }

  refresh(): void {
    this._skillListFacade.retrieve();
  }

  showDeleteDialog(id: number | undefined): void {
    if (id) {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete skill with id: ${id}`,
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'danger',
        },
        acceptButtonProps: {
          label: 'Delete',
        },
        accept: () => {
          this._skillListFacade.delete(id);
        },
      });
    }
  }

  private _clearSearchFields() {
    this.skillFormGroup.controls['name'].setValue('');
    this._router.navigate([], {
      queryParams: { name: '' },
      queryParamsHandling: 'merge',
    });
  }
}
