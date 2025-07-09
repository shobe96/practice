import { inject, Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, catchError, combineLatest } from 'rxjs';
import { Project } from './project.model';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';

@Injectable()
export class ProjectDetailsFacadeService {

  private _project = new BehaviorSubject<Project>({});

  viewModel$ = combineLatest({
    project: this._project.asObservable()
  });

  private _projectService = inject(ProjectService)
  private _customMessageService = inject(CustomMessageService);

  getProject(id: number) {
    const projectObserver = {
      next: (value: Project) => {
        this._project.next(value);
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._projectService.get(id)
      .pipe(
        catchError(
          (err) => { throw err.error.message }
        )
      ).subscribe(projectObserver);
  }

  unassignEmployee(employeeId: number, project: Project) {
    const unassignObserver = {
      next: () => {
        project.employees = project.employees?.filter(val => {
          return val.id !== employeeId;
        });
        this._customMessageService.showSuccess('Success', 'Employee unassigned successfully');
        this._project.next(project);
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._projectService.unassignEmployee(employeeId, project)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(unassignObserver);
  }
}
