import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { SkillService } from './skill.service';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class SkillEditFacadeService {

  private _skillService: SkillService = inject(SkillService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(skill: Skill): Observable<Skill> {
    const subscription = !skill.id ?
      this._skillService.save(skill) :
      this._skillService.update(skill);
    return subscription.pipe(map((value: Skill) => {
      if (value) {
        this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
        return value;
      } else {
        return {};
      }
    }));
  }
}
