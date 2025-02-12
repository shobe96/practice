import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectService } from './project.service';
import { startWith, map, distinctUntilChanged, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Project } from '../../models/project.model';
import { fireToast } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsFacadeService {

  private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>({});
  private _showDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  viewModel$: Observable<any> = combineLatest({
    project: this._project.asObservable(),
    showDialog: this._showDialog.asObservable()
  });

  private _projectService: ProjectService = inject(ProjectService)
  private _messageService: MessageService = inject(MessageService);

  getProject(id: number) {
    this._projectService.getProject(id).subscribe((value: Project) => {
      this._project.next(value);
    });
  }

  showDialog(visible: boolean) {
    this._showDialog.next(visible);
  }

  unassignEmployee(employeeId: number, project: Project) {
    this._projectService.unassignEmployee(employeeId, project)
      .subscribe(
        () => {
          project.employees = project.employees?.filter(val => {
            return val.id !== employeeId;
          });
          fireToast('success', 'Success', 'Employee unassigned successfully', this._messageService);
          this._project.next(project);
          this._showDialog.next(false);
        }
      );
  }
}
