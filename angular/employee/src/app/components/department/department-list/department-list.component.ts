import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Department } from '../../../models/department.model';
import { PaginatorState } from 'primeng/paginator';
import { DepartmentListFacadeService } from '../../../services/department/department-list.facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  departmentFormGroup!: FormGroup;
  departmentSearch: Department = {};
  departmentId: number | null = 0;
  departmentListFacade: DepartmentListFacadeService = inject(DepartmentListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.departmentListFacade.getAll(false);
    this._subsribeToFormGroup();
  }

  private _buildForm() {
    this.departmentFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.departmentListFacade.clear();
  }

  delete(): void {
    this.departmentListFacade.delete(this.departmentId, this.departmentSearch);
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
    this.departmentListFacade.onPageChange(this.departmentSearch, event);
  }

  refresh(): void {
    this.departmentListFacade.retrieve(this.departmentSearch);
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.departmentId = id ?? 0;
    this.departmentListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subsribeToFormGroup() {
    this.departmentFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((value: Department) => {
        if (value.name) {
          this.departmentSearch = value;
          this.departmentListFacade.search(value);
        }
      });
  }

  private _clearSearchFields() {
    this.departmentFormGroup.controls['name'].setValue('');
    this.departmentSearch = {};
  }
}
