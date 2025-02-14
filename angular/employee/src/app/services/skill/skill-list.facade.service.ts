import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { Skill } from '../../models/skill.model';
import { rowsPerPage } from '../../shared/constants.model';
import { SkillService } from './skill.service';

@Injectable({
  providedIn: 'root'
})
export class SkillListFacadeService {

  private _skills: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  private _page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(this._defaultPage);
  private _rowsPerPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(rowsPerPage);
  private _skillSearch: Skill = {}

  viewModel$: Observable<any> = combineLatest({
    skills: this._skills.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  private _skillService = inject(SkillService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (id) {
      this._skillService.delete(id).subscribe(() => {
        this.retrieve();
      });
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    if (this._checkSearchFields())
      this._skillService.search(this._skillSearch, this._defaultPage).subscribe((value: SkillSearchResult) => this._emitValues(value));
    else this._getAll(false);
  }

  search(params: Skill): void {
    this._skillSearch = params;
    if (this._checkSearchFields()) {
      this._skillService.search(this._skillSearch, this._defaultPage).subscribe((value: SkillSearchResult) => {
        this._emitValues(value);
      });
    }
  }

  private _emitValues(value: SkillSearchResult): void {
    if (value.skills) {
      this._skills.next(value.skills);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }

  private _checkSearchFields(): boolean {
    return Boolean(this._skillSearch.name);
  }

  private _getAll(all: boolean): void {
    this._skillService.getAllSkills(all, this._defaultPage).subscribe((value: SkillSearchResult) => {
      this._emitValues(value);
    });
  }
}
