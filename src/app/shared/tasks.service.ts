import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { interval, Observable } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { Task } from '../interfaces/task';

import { HandleErrorService } from './handleError.service';
import { LoadingService } from './loading.service';


@Injectable({
  providedIn: 'root'
})

export class TasksService {
  private apiUrl = 'https://europe-west1-st-testcase.cloudfunctions.net/api/reminders';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  timer$ = interval(1000)

  constructor(private http: HttpClient,private handleError:HandleErrorService, private loadingService:LoadingService) { }

  
  getTasks(user:User):Observable<Task[]> {
    this.loadingService.showLoading();
    const url = `${this.apiUrl}?userId=${user.id}`;
    return this.http.get<Task[]>(url)
            .pipe(
              catchError(this.handleError.handleError<Task[]>("Getting tasks")),
              finalize(()=> this.loadingService.hideLoading())
            );
  }

  createTask(task:Task, user:User):Observable<Task[]>{
    this.loadingService.showLoading();

    const url = `${this.apiUrl}?userId=${user.id}`;

    return this.http.post<Task>(url, task)
            .pipe(
              catchError(this.handleError.handleError<Task>("Creating a new Task")),
              switchMap(() => {
                return this.http.get<Task[]>(url)
                        .pipe(
                          catchError(this.handleError.handleError<Task[]>("Get tasks after creation of new task")),
                          finalize(()=> this.loadingService.hideLoading()),
                        );
              })
            );
  }

  removeTask(id:string,user:User):Observable<any>{
    this.loadingService.showLoading();

    const url = `${this.apiUrl}/${id}?userId=${user.id}`;
    return this.http.delete<Task>(url,this.httpOptions)
            .pipe(
              catchError(this.handleError.handleError<any>("Remove task")),
              finalize(()=> this.loadingService.hideLoading()),
            );
  }

  updateTask(task:Task,user:User):Observable<any> {
    this.loadingService.showLoading();

    const {id, note, date} = task;
    const updatedTask = {
      note,
      date
    }

    const url = `${this.apiUrl}/${id}?userId=${user.id}`;
    return this.http.put(url,updatedTask, this.httpOptions)
            .pipe(
              catchError(this.handleError.handleError<any>("Update task")),
              finalize(()=> this.loadingService.hideLoading()),
            )
  }

}
