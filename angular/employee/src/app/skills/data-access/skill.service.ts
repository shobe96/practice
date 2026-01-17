import { Injectable } from '@angular/core';
import { Skill } from './skill.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { SkillSearchCriteria } from './skill-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseCrudService<Skill, SkillSearchCriteria> {

  baseUrl = "/api/skills";

}
