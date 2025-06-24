import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, finalize, map } from 'rxjs';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class SkillEditFacadeService {

  private _skillService: SkillService = inject(SkillService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  viewModel$: Observable<{ loading: boolean }> = combineLatest({
    loading: this._loading.asObservable()
  });

  submit(skill: Skill): Observable<Skill> {
    this._loading.next(true);
    const subscription = !skill.id ?
      this._skillService.save(skill) :
      this._skillService.update(skill);
    return subscription.pipe(
      map((value: Skill) => {
        if (value) {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
          return value;
        } else {
          return {};
        }
      }),
      catchError((err) => { throw err.error.message }),
      finalize(() => this._loading.next(false)));
  }
}
