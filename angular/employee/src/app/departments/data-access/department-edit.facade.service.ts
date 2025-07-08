import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable } from 'rxjs';
import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';

@Injectable()
export class DepartmentEditFacadeService extends BaseEditFacade<Department> {

  constructor(departmentService: DepartmentService) {
    super(departmentService);
  }

}
