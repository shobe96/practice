import { Subject } from "rxjs";

export class SubscriptionCleaner {
  componentIsDestroyed$ = new Subject<boolean>();

  unsubsribe() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }
}
