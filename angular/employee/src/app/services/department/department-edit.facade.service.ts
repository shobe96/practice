import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { Department } from '../../models/department.model';
import { enumSeverity } from '../../shared/constants.model';
import { fireToast } from '../../shared/utils';
import { DepartmentService } from './department.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentEditFacadeService {

  private _departmentService = inject(DepartmentService);
  private _messageService: MessageService = inject(MessageService);

  submit(department: Department): Observable<Department> {
    const subscription = !department.id ?
      this._departmentService.save(department) :
      this._departmentService.update(department);
    return subscription.pipe(map((value: Department) => {
      if (value) {
        fireToast(enumSeverity.success, 'Success', 'Action perforemd successfully', this._messageService);
        return value;
      } else {
        return {};
      }
    }));
  }
}
