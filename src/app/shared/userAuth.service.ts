import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { User } from '../interfaces/user';

import { HandleErrorService } from './handleError.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private apiUrl = 'https://europe-west1-st-testcase.cloudfunctions.net/api/auth';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private userData = new BehaviorSubject<User>({id:null,name: null});
  currentUser = this.userData.asObservable();

  constructor(private http: HttpClient,private handleError:HandleErrorService, private loadingService:LoadingService) { }

  updateUser(user:User) {
    this.userData.next(user)
  }

  getUser(): Observable<User> {
    this.loadingService.showLoading();
    return this.http.post<User>(this.apiUrl,{},this.httpOptions)
            .pipe(
              catchError(this.handleError.handleError<User>("getUser")),
              finalize(()=> this.loadingService.hideLoading()),
            )
  }
}
