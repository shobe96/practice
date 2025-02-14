import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Department } from '../../../models/department.model';
import { PaginatorState } from 'primeng/paginator';
import { DepartmentListFacadeService } from '../../../services/department/department-list.facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { DialogService } from 'primeng/dynamicdialog';
import { DepartmentEditComponent } from '../department-edit/department-edit.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  departmentFormGroup!: FormGroup;
  departmentSearch: Department = {};
  departmentId: number | null = 0;

  departmentListFacade: DepartmentListFacadeService = inject(DepartmentListFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _dialogService: DialogService = inject(DialogService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor() {
    super();
    this.departmentListFacade.search();
  }

  ngOnInit(): void {
    this._buildForm();
    this.departmentListFacade.getAll(false);
    this._subscribeToFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
    this.departmentListFacade.unsubscribe();
  }

  addNew(): void {
    this.goToEdit(null, false);
  }

  clear(): void {
    this._clearSearchFields();
    this.departmentListFacade.clear();
  }

  delete(): void {
    this.departmentListFacade.delete(this.departmentId);
  }

  goToDetails(department: Department): void {
    this.goToEdit(department, true);
  }

  goToEdit(department: Department | null, disable: boolean): void {
    const title = department ? `Department ${department.id}` : 'Add new Department';
    this._dialogService.open(DepartmentEditComponent, {
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
  }

  onPageChange(event: PaginatorState): void {
    this.departmentListFacade.onPageChange(event);
  }

  refresh(): void {
    this.departmentListFacade.retrieve();
  }

  showDeleteDialog(id: number): void {
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
        this.departmentListFacade.delete(id);
      },
    });
  }

  private _buildForm() {
    this.departmentFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  private _subscribeToFormGroup() {
    this.departmentFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.componentIsDestroyed$)
      )
      .subscribe((value: Department) => {
        if (value.name) {
          this._router.navigate([], { queryParams: { name: value.name }, queryParamsHandling: 'merge' })
        }
      });
  }

  private _clearSearchFields() {
    this.departmentFormGroup.controls['name'].setValue('');
    this._router.navigate([], { queryParams: { name: '' }, queryParamsHandling: 'merge' })
  }
}
