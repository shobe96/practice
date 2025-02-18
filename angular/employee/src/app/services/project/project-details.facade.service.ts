import { inject, Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, catchError, combineLatest } from 'rxjs';
import { Project } from '../../models/project.model';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsFacadeService {

  private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>({});

  viewModel$: Observable<any> = combineLatest({
    project: this._project.asObservable()
  });

  private _projectService: ProjectService = inject(ProjectService)
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  getProject(id: number) {
    const projectObserver = {
      next: (value: Project) => {
        this._project.next(value);
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    this._projectService.getProject(id)
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
      complete: () => { }
    }
    this._projectService.unassignEmployee(employeeId, project)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(unassignObserver);
  }
}
