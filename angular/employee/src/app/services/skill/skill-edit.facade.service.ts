import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { enumSeverity } from '../../shared/constants.model';
import { fireToast } from '../../shared/utils';
import { SkillService } from './skill.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SkillEditFacadeService {

  private _skillService: SkillService = inject(SkillService);
  private _messageService: MessageService = inject(MessageService);

  submit(skill: Skill): Observable<Skill> {
    const subscription = !skill.id ?
      this._skillService.save(skill) :
      this._skillService.update(skill);
    return subscription.pipe(map((value: Skill) => {
      if (value) {
        fireToast(enumSeverity.success, 'Success', 'Action perforemd successfully', this._messageService);
        return value;
      } else {
        return {};
      }
    }))
  }
}
