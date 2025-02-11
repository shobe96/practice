import { Subject } from "rxjs";

export class SubscriptionCleaner {
  componentIsDestroyed$ = new Subject<boolean>();

  constructor() {}

  unsubsribe() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }
}
