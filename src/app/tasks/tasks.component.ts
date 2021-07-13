import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../shared/notification.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { Task } from '../interfaces/task';
import { TasksService } from '../shared/tasks.service';
import { User } from '../interfaces/user';

import * as moment from 'moment'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  @Input()
  user!: User;
  
  tasks:Task[] =[]

  datePickerConfig:Object = {
    format: "DD-MM-YYYY, HH:mm:ss",
    drops: 'up',
    showTwentyFourHours: true,
    showSeconds:true
  }
  
  taskAdd = new FormGroup({
    note: new FormControl('',[Validators.required,Validators.minLength(4), Validators.maxLength(255)]),
    date: new FormControl('',this.correctDateValidation()),
  });

  constructor(private taskService:TasksService, private notificationService:NotificationService) { 
  }

  ngOnInit() {
    this.taskAdd.patchValue({
      date: moment().add(2, 'm')
    });
    this.taskService.getTasks(this.user).subscribe(tasks => {
      if(tasks && tasks.reduce((n, x) => n + +(moment(x.date).isBefore(moment())), 0) > 0){
        this.notificationService.sendMessage({text:`You have ${tasks.reduce((n, x) => n + +(moment(x.date).isBefore(moment())), 0)} outdated tasks`, color: 'red'})
      }
      this.tasks=tasks
    })
  }

  submit() {
    const {id,note, date} = this.taskAdd.value
 
    const task:Task = {
      id,
      note,
      date:moment(date,'DD-MM-YYYY, HH:mm:ss',true).toISOString()
    }

    if(moment(date,'DD-MM-YYYY, HH:mm:ss',true).isBefore(moment())) {
      window.confirm("The task is in past") ? this.taskService.createTask(task, this.user).subscribe((tasks)=> {
        this.tasks=tasks
        this.taskAdd.reset()
        this.taskAdd.patchValue({
          date: moment().add(2, 'm')
        })
        this.notificationService.sendMessage({text:`Task created`})
      }) : this.notificationService.sendMessage({text: 'Choose another date', color: 'red',})
    }
    else {
      this.taskService.createTask(task, this.user).subscribe((tasks)=> {
        this.tasks=tasks
        this.taskAdd.reset()
        this.taskAdd.patchValue({
          date: moment().add(2, 'm')
        })
        this.notificationService.sendMessage({text:`Task created`})
      })
    }

  }

  updateTask(taskToUpdate:Task):void {
    this.tasks = this.tasks.map((task) => task.id === taskToUpdate.id ? taskToUpdate : task)
    this.taskService.updateTask(taskToUpdate,this.user).subscribe(_ => this.notificationService.sendMessage({text:`Task edited`, color:'blue'}))
  }

  deleteTask(taskToDelete:Task):void {
    this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id)
    this.taskService.removeTask(taskToDelete.id,this.user).subscribe(_=> this.notificationService.sendMessage({text:`Task deleted`, color:'red'}))
  }

  correctDateValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = moment(control.value, 'DD-MM-YYYY, HH:mm:ss',true).isValid();
      return !forbidden ?  {correctDate: control.value}: null;
    };
  }

}
