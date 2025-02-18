import { inject, Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
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
          this._customMessageService.showSuccess('Success', 'Employee unassigned successfully');
          this._project.next(project);
        }
      );
  }
}
