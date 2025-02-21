import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserListFacadeService } from '../../../services/user/user-list.facade.service';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgIf, AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, ReactiveFormsModule, InputText, Button, Tooltip, NgIf, TableModule, PrimeTemplate, Paginator, AsyncPipe]
})
export class UserListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {
  userFormGroup!: FormGroup;
  userSearch: User = {};
  userId: number | null = 0;

  userListFacade: UserListFacadeService = inject(UserListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    super();
    this._subscribeToRoute();
  }

  ngOnInit(): void {
    this._buildForm();
    this.userListFacade.retrieve();
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

  private _subscribeToRoute() {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe(
        (params: User) => {
          this.userListFacade.search(params);
        });
  }
}
