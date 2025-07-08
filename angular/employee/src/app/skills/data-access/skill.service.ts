import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from './skill.model';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { SkillSearchResult } from './skill-search-result.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseCrudService<Skill> {

  baseUrl = "/api/skills";

}
