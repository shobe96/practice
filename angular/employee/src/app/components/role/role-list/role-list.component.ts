import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { RoleListFacadeService } from '../../../services/role/role-list.facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgIf, AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrl: './role-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, ReactiveFormsModule, InputText, Button, Tooltip, NgIf, TableModule, PrimeTemplate, Paginator, AsyncPipe]
})
export class RoleListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  roleFormGroup!: FormGroup;
  roleSearch: Role = {};
  roleId: number | null = 0;

  roleListFacade: RoleListFacadeService = inject(RoleListFacadeService);
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
    this.roleListFacade.retrieve();
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
    this.roleListFacade.clear();
  }

  delete(): void {
    this.roleListFacade.delete(this.roleId);
  }

  goToDetails(role: Role): void {
    this.goToEdit(role, true);
  }

  goToEdit(role: Role | null, disable: boolean): void {
    const title = role ? `Role ${role.id}` : 'Add new Role';
    this._dialogService.open(RoleEditComponent, {
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
  }

  onPageChange(event: PaginatorState): void {
    this.roleListFacade.onPageChange(event);
  }

  refresh(): void {
    this.roleListFacade.retrieve();
  }

  showDeleteDialog(id: number): void {
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
        this.roleListFacade.delete(id);
      },
    });
  }

  private _subscribeToFormGroup() {
    this.roleFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe((value: Role) => {
        if (value.name) {
          this._router.navigate([], { queryParams: { name: value.name }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.roleFormGroup.controls['name'].setValue('');
    this._router.navigate([], { queryParams: { name: '' }, queryParamsHandling: 'merge' })
  }

  private _buildForm() {
    this.roleFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  private _subscribeToRoute() {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe(
        (params: Role) => {
          this.roleListFacade.search(params);
        });
  }
}

