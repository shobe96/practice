import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Department } from '../../../models/department.model';
import { PaginatorState } from 'primeng/paginator';
import { DepartmentListFacadeService } from '../../../services/department/department-list.facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent implements OnInit {

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

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
        distinctUntilChanged()
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

  departmentFormGroup!: FormGroup;
  departmentSearch: Department = {};
  departmentId: number | null = 0;
  departmentListFacade: DepartmentListFacadeService = inject(DepartmentListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.departmentListFacade.getAll(false);
    this._subscribeToFormGroup();
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.departmentListFacade.clear();
  }

  delete(): void {
    this.departmentListFacade.delete(this.departmentId);
  }

  goToDetails(department: Department): void {
    this.departmentListFacade.setDialogParams(department, `Department ${department.id}`, true, false, true);
  }

  goToEdit(department: Department | null): void {
    const title = department ? `Department ${department.id}` : 'Add new Department';
    this.departmentListFacade.setDialogParams(department, title, true, false, false);
  }

  handleCancel(event: any): void {
    this.departmentListFacade.setDialogParams(null, '', event.visible, false, false);
    if (event.save) {
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.departmentListFacade.onPageChange(event);
  }

  refresh(): void {
    this.departmentListFacade.retrieve();
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.departmentId = id ?? 0;
    this.departmentListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }
}
