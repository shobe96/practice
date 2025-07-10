import { Injectable } from '@angular/core';
import { Skill } from './skill.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseCrudService<Skill> {

  baseUrl = "/api/skills";

}
