import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Skill } from '../../../models/skill.model';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkillListFacadeService } from '../../../services/skill/skill-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { SkillEditComponent } from '../skill-edit/skill-edit.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  skillFormGroup!: FormGroup;
  skillSearch: Skill = {};
  skillId: number | null = 0;

  skillListFacade: SkillListFacadeService = inject(SkillListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _dialogService: DialogService = inject(DialogService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    super();
    this._subscribeToRoute();
  }

  ngOnInit(): void {
    this._buildForm();
    this.skillListFacade.retrieve();
    this._subscribeToFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  addNew(): void {
    this.goToEdit(null, false);
  }

  clear(): void {
    this._clearSearchFields();
    this.skillListFacade.clear();
  }

  goToDetails(skill: Skill): void {
    this.goToEdit(skill, true);
  }

  goToEdit(skill: Skill | null, disable: boolean): void {
    const title = skill ? `Skill ${skill.id}` : 'Add new Skill';
    this._dialogService.open(SkillEditComponent, {
      header: title,
      modal: true,
      width: '35vw',
      contentStyle: { overflow: 'auto' },
      inputValues: {
        skill: skill,
        disable: disable
      },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  onPageChange(event: PaginatorState): void {
    this.skillListFacade.onPageChange(event);
  }

  refresh(): void {
    this.skillListFacade.retrieve();
  }

  showDeleteDialog(id: number): void {
    this._confirmationService.confirm({
      message: `Are you sure you want to delete skill with id: ${id}`,
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
        this.skillListFacade.delete(id);
      },
    });
  }

  private _subscribeToFormGroup() {
    this.skillFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe((value: Skill) => {
        if (value.name) {
          this._router.navigate([], { queryParams: { name: value.name }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.skillFormGroup.controls['name'].setValue('');
    this._router.navigate([], { queryParams: { name: '' }, queryParamsHandling: 'merge' })
  }

  private _buildForm() {
    this.skillFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  private _subscribeToRoute() {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe(
        (params: Skill) => {
          this.skillListFacade.search(params);
        });
  }
}
