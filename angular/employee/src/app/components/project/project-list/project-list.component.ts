import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Project } from '../../../models/project.model';
import { ProjectListFacadeService } from '../../../services/project/project-list.facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  standalone: false
})
export class ProjectListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  projectFormGroup!: FormGroup;
  projectSearch: Project = {};
  projectId: number | null = 0;
  projectListFacade: ProjectListFacadeService = inject(ProjectListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.projectListFacade.getAll(false);
    this._subsribeToFormGroup();
  }

  private _buildForm() {
    this.projectFormGroup = this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
    });
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.projectListFacade.clear();
  }

  delete(): void {
    this.projectListFacade.delete(this.projectId, this.projectSearch);
  }

  goToDetails(id: number): void {
    this._router.navigate([`/project/details/${id}`])
  }

  goToEdit(project: Project | null): void {
    const title = project ? `Project ${project.id}` : 'Add new Project';
    this.projectListFacade.setDialogParams(project, title, true, false, false);
  }

  handleCancel(event: any): void {
    this.projectListFacade.setDialogParams(null, '', event.visible, false, false);
    if (event.save) {
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.projectListFacade.onPageChange(this.projectSearch, event);
  }

  refresh(): void {
    this.projectListFacade.retrieve(this.projectSearch);
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.projectId = id ?? 0;
    this.projectListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subsribeToFormGroup() {
    this.projectFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((value: Project) => {
        if (value.name || value.code) {
          this.projectSearch = value;
          this.projectListFacade.search(value);
        }
      });
  }

  private _clearSearchFields() {
    this.projectFormGroup.controls['name'].setValue('');
    this.projectFormGroup.controls['code'].setValue('');
  }

}
