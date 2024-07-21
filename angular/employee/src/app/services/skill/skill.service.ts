import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { PageEvent } from '../../models/page-event.model';
import { SkillSearchResult } from '../../models/skill-search-result.model';
import { buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/skills"

  constructor(private http: HttpClient) { }

  public getAllSkills(all: boolean, page?: PageEvent): Observable<SkillSearchResult> {
    if (all) {
      return this.http.get<SkillSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<SkillSearchResult>(`${this.backendURL}${this.baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
  }

  public getSkill(skilld: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.backendURL}${this.baseUrl}/get-one/${skilld}`);
  }

  public save(skill: Skill | null): Observable<Skill> {
    return this.http.post<Skill>(`${this.backendURL}${this.baseUrl}/create`, skill);
  }

  public update(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.backendURL}${this.baseUrl}/update`, skill);
  }

  public search(skill: Skill, page: PageEvent): Observable<SkillSearchResult> {
    return this.http.get<SkillSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(skill)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  public delete(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${skillId}`);
  }
}
