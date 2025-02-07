import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Skill } from '../../../models/skill.model';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkillListFacadeService } from '../../../services/skill/skill-list.facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillListComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  skillFormGroup!: FormGroup;
  skillSearch: Skill = {};
  skillId: number | null = 0;
  skillListFacade: SkillListFacadeService = inject(SkillListFacadeService);

  ngOnInit(): void {
    this._buildForm();
    this.skillListFacade.getAll(false);
    this._subscribeToFormGroup();
  }

  private _buildForm() {
    this.skillFormGroup = this._formBuilder.group({
      name: ['']
    });
  }

  addNew(): void {
    this.goToEdit(null);
  }

  clear(): void {
    this._clearSearchFields();
    this.skillListFacade.clear();
  }

  delete(): void {
    this.skillListFacade.delete(this.skillId, this.skillSearch);
  }

  goToDetails(skill: Skill): void {
    this.skillListFacade.setDialogParams(skill, `Skill ${skill.id}`, true, false, true);
  }

  goToEdit(skill: Skill | null): void {
    const title = skill ? `Skill ${skill.id}` : 'Add new Skill';
    this.skillListFacade.setDialogParams(skill, title, true, false, false);
  }

  handleCancel(event: any): void {
    this.skillListFacade.setDialogParams(null, '', event.visible, false, false);
    if (event.save) {
      this.refresh();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.skillListFacade.onPageChange(event);
  }

  refresh(): void {
    this.skillListFacade.retrieve();
  }

  showDeleteDialog(visible: boolean, id?: number): void {
    this.skillId = id ?? 0;
    this.skillListFacade.setDialogParams(null, 'Warning', false, visible, false);
  }

  private _subscribeToFormGroup() {
    this.skillFormGroup
      .valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
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
}
