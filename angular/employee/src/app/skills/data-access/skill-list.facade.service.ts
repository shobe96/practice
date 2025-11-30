import { Injectable } from '@angular/core';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { SkillSearchCriteria } from './skill-search.criteria';

@Injectable()
export class SkillListFacadeService extends BaseListFacade<Skill, SkillSearchCriteria> {

  protected override _search: Skill = {}

  searchKeys = ['name'];

  constructor(skillService: SkillService) {
    super(skillService);
  }
}
