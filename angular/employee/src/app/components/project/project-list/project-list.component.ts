import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Project } from '../../../models/project.model';
import { ProjectListFacadeService } from '../../../services/project/project-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { ProjectEditComponent } from '../project-edit/project-edit.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  projectFormGroup!: FormGroup;
  projectSearch: Project = {};
  projectId: number | null = 0;

  projectListFacade: ProjectListFacadeService = inject(ProjectListFacadeService);
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
    this.projectListFacade.retrieve();
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
    this.projectListFacade.clear();
  }

  delete(): void {
    this.projectListFacade.delete(this.projectId);
  }

  goToDetails(id: number): void {
    this._router.navigate([`/project/details/${id}`])
  }

  goToEdit(project: Project | null, disable: boolean): void {
    const title = project ? `Project ${project.id}` : 'Add new Project';
    this._dialogService.open(ProjectEditComponent, {
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
  }

  onPageChange(event: PaginatorState): void {
    this.projectListFacade.onPageChange(event);
  }

  refresh(): void {
    this.projectListFacade.retrieve();
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
        this.projectListFacade.delete(id);
      },
    });
  }

  private _subscribeToFormGroup() {
    this.projectFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe((value: Project) => {
        if (value.name || value.code) {
          this._router.navigate([], { queryParams: { name: value.name, code: value.code }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.projectFormGroup.controls['name'].setValue('');
    this.projectFormGroup.controls['code'].setValue('');
    this._router.navigate([], { queryParams: { name: '', code: '' }, queryParamsHandling: 'merge' })
  }

  private _buildForm() {
    this.projectFormGroup = this._formBuilder.group({
      name: [''],
      code: ['']
    });
  }

  private _subscribeToRoute() {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe(
        (params: Project) => {
          this.projectListFacade.search(params);
        });
  }
}
