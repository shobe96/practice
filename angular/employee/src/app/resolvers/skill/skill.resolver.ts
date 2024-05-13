import { ResolveFn } from '@angular/router';
import { SkillService } from '../../services/skill/skill.service';
import { inject } from '@angular/core';
import { Skill } from '../../models/skill.model';

export const skillResolver: ResolveFn<Skill> = (route, state) => {
  const skillId: number = Number(route.paramMap.get('skillId')?.replace("$", ""));
  return inject(SkillService).getSkill(skillId);
};
