import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { PageEvent } from '../../models/page-event.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/skills";
  private _http: HttpClient = inject(HttpClient);

  constructor(private http: HttpClient) { }

  public getAllSkills(all: boolean, page?: PageEvent): Observable<SkillSearchResult> {
    const url =
      all ?
        `${this._backendURL}${this._baseUrl}?all=${all}` :
        `${this._backendURL}${this._baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this._http.get<SkillSearchResult>(url);
  }

  public getSkill(skilld: number): Observable<Skill> {
    return this.http.get<Skill>(`${this._backendURL}${this._baseUrl}/get-one/${skilld}`);
  }

  public save(skill: Skill | null): Observable<Skill> {
    return this.http.post<Skill>(`${this._backendURL}${this._baseUrl}/create`, skill);
  }

  public update(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this._backendURL}${this._baseUrl}/update`, skill);
  }

  public search(skill: Skill, page: PageEvent): Observable<SkillSearchResult> {
    return this.http.get<SkillSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(skill)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  public delete(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${skillId}`);
  }
}
