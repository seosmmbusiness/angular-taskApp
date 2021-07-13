import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private subject = new Subject<Notification>()

  constructor() { }

  sendMessage(notification:Notification) {
    this.subject.next(notification)
  }

  onMessage():Observable<Notification> {
    return this.subject.asObservable();
  }

}
