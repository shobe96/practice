import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Department } from '../../models/department.model';
import { DepartmentService } from './department.service';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentEditFacadeService {

  private _departmentService = inject(DepartmentService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(department: Department): Observable<Department> {
    const subscription = !department.id ?
      this._departmentService.save(department) :
      this._departmentService.update(department);
    return subscription.pipe(map((value: Department) => {
      if (value) {
        this._customMessageService.showSuccess('Success', 'Action perforemd successfully')
        return value;
      } else {
        return {};
      }
    }));
  }
}
