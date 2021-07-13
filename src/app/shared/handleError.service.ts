import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

constructor(private notificationService:NotificationService) { }
  
 handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error); // log to console instead
        if (typeof error.error != 'undefined' && error.error) {
          this.notificationService.sendMessage({ text: `Operation ${operation} failed ${JSON.stringify(error.error)}`,color: 'red'});
        }
          this.notificationService.sendMessage({ text: `Operation ${operation} failed ${JSON.stringify(error)}`,color: 'red'});
        return of(result as T);
      };
    }
}
