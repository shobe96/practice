import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Project } from '../../models/project.model';
import { fireToast } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsFacadeService {

  private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>({});

  viewModel$: Observable<any> = combineLatest({
    project: this._project.asObservable()
  });

  private _projectService: ProjectService = inject(ProjectService)
  private _messageService: MessageService = inject(MessageService);

  getProject(id: number) {
    this._projectService.getProject(id).subscribe((value: Project) => {
      this._project.next(value);
    });
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
        }
      );
  }
}
