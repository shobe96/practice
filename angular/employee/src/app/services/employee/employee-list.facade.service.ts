import { inject, Injectable } from '@angular/core';
import { ListFacade } from '../../shared/list-facade';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject, combineLatest, debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeService } from './employee.service';
import { PageEvent } from '../../models/page-event.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListFacadeService {

  private _employeeService = inject(EmployeeService);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _size: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public viewModel$: Observable<any> = combineLatest({
    employees: this._employees.asObservable(),
    size: this._size.asObservable()
  });

  addNew(): void { }

  checkSearchFields(employee: Employee): boolean {
    return Boolean(employee.name ||
      employee.surname ||
      employee.email);
  }
  clear(): void { }
  delete(): void { }

  getAll(all: boolean, page: PageEvent): void {
    this._employeeService.getAllEmployees(all, page).subscribe((value: EmployeeSearchResult) => {
      this._emitValues(value);
    });
  }

  goToDetails(id: number): void { }
  goToEdit(id: number | null): void { }
  handleCancel(event: any): void { }
  onKeyUp(): void { }

  onPageChange(employee: Employee, page: PageEvent): void {
    this.retrieve(employee, page);
  }

  refresh(): void { }

  retrieve(employee: Employee, page: PageEvent): void {
    this.checkSearchFields(employee) ? this.search(employee, page) : this.getAll(false, page);
  }

  search(employeeSearch: Employee, page: PageEvent): void {
    this._employeeService.search(employeeSearch, page).pipe(debounceTime(2000)).subscribe((value: EmployeeSearchResult) => {
      this._emitValues(value);
    })
  }

  setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void { }
  showDialog(visible: boolean, id?: number): void { }

  private _emitValues(value: EmployeeSearchResult) {
    if (value.employees) {
      this._employees.next(value.employees);
    }
    if (value.size) {
      this._size.next(value.size);
    }
  }
}
