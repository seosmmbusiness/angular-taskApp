import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task';
@Pipe({
  name: 'sortTasks',
  pure: false
})
export class SortTasksPipe implements PipeTransform {

  transform(arr:Task[]): Task[] {
    if (!arr) return []
    return arr.sort(function (a:any, b:any) {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    });
  }

}
