import { Injectable } from '@angular/core';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';

@Injectable()
export class SkillEditFacadeService extends BaseEditFacade<Skill> {

  constructor(skillService: SkillService) {
    super(skillService);
  }
}
