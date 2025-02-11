import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { RoleListFacadeService } from '../../../services/role/role-list.facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  standalone: false
})
export class RoleListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  roleFormGroup!: FormGroup;
  roleSearch: Role = {};
  roleId: number | null = 0;
  roleListFacade: RoleListFacadeService = inject(RoleListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.roleListFacade.getAll(false);
    this._subscribeToFormGroup();
  }

  private _buildForm() {
    this.roleFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.roleListFacade.clear();
  }

  delete(): void {
    this.roleListFacade.delete(this.roleId);
  }

  goToDetails(role: Role): void {
    this.roleListFacade.setDialogParams(role, `Role ${role.id}`, true, false, true);
  }

  goToEdit(role: Role | null): void {
    const title = role ? `Role ${role.id}` : 'Add new Role';
    this.roleListFacade.setDialogParams(role, title, true, false, false);
  }

  handleCancel(event: any): void {
    this.roleListFacade.setDialogParams(null, '', event.visible, false, false);
    if (event.save) {
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.roleListFacade.onPageChange(event);
  }

  refresh(): void {
    this.roleListFacade.retrieve();
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.roleId = id ?? 0;
    this.roleListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subscribeToFormGroup() {
    this.roleFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
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
}

