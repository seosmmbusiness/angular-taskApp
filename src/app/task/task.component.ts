import { Input, OnDestroy, Component, OnInit  } from '@angular/core';

import { Task } from '../interfaces/task';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

import * as moment from 'moment'
import { TasksService } from '../shared/tasks.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task!: Task;

  editable:boolean=false
  outdated:boolean=false
  notificationSent:boolean=false
  subscribe: Subscription = new Subscription;

  @Output() deleteEvent = new EventEmitter<Task>();
  @Output() updateEvent = new EventEmitter<Task>();

  taskEdit = new FormGroup({
    note: new FormControl('',[Validators.required,Validators.minLength(4), Validators.maxLength(255)]),
    date: new FormControl('',this.correctDateValidation()),
  });

  datePickerConfig:Object = {
    format: "DD-MM-YYYY, HH:mm:ss",
    showTwentyFourHours: true,
    showSeconds:true
  }

  constructor(private taskService:TasksService, private notificationService:NotificationService) { 
     
  }
 
  ngOnInit() {
    if (this.task) {
      if(moment(this.task.date).isBefore(moment())) {
        this.outdated=true
        this.notificationSent=true
      }
    }

    this.subscribe = this.taskService.timer$.subscribe(_=> {
      if(moment(this.task.date).isBefore(moment())) {
    
        if(!this.notificationSent && !this.editable) {
          this.notificationService.sendMessage({text: `Task "${this.task.note}" is outdated`, color: 'red',})
          this.notificationSent = true
        }

        this.outdated=true
      }
      else {}
    })
  }
  
  ngOnDestroy(): void {
    this.subscribe.unsubscribe()
  }

  startEdit():void {
    this.taskEdit.patchValue({
      note: this.task.note,
      date: moment(this.task.date)
    });
    this.editable=true
  }

  updateTask():void {
    const {note, date} = this.taskEdit.value
    
    const updateTask:Task = {
      id:this.task.id,
      note,
      date:moment(date,'DD-MM-YYYY, HH:mm:ss').toISOString()
    }
 
    if(moment(date,'DD-MM-YYYY, HH:mm:ss').isBefore(moment())) {
      window.confirm("The task is in past") ? this.updateEvent.emit(updateTask): this.notificationService.sendMessage({text: 'Choose another date', color: 'red',})
    } else {
      this.updateEvent.emit(updateTask)
      this.notificationSent=false
    }

    this.taskEdit.reset();
    this.editable=false
  }

  deleteTask(taskToDelete:Task):void {
    this.deleteEvent.emit(taskToDelete);
  }
  correctDateValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = moment(control.value, 'DD-MM-YYYY, HH:mm:ss',true).isValid();
      return !forbidden ?  {correctDate: control.value}: null;
    };
  }
}
