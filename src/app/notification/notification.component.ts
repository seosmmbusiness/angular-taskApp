import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../shared/notification.service';
import { Notification } from '../interfaces/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit,OnDestroy {
  notifications:Notification[] =[];
  subscription: Subscription = new Subscription;
  
  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.subscription = this.notificationService.onMessage().subscribe(notification => {
      if(notification){
        this.notifications.push(notification)

        setTimeout(() => this.closeNotification(notification), 15000);
      }
      else {
        this.notifications =[]
      }
    })
  }

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe();
  }

  closeNotification(notification:Notification) {
    if (!this.notifications.includes(notification)) return;
    this.notifications = this.notifications.filter(x => x!== notification);
  }

  cssClass(notification:Notification):string|undefined {
    if (!notification) return;
    if (!notification.color) notification.color='green'

    const classes = ['relative', 'py-3', 'pl-4', 'pr-10', 'my-2', 'mx-3','leading-normal', 'rounded-lg', 'text-sm'];
    
    let notificationClass:string = ''
    // const notificationClass:string = `bg-${notification.color}-100 text-${notification.color}-900` 

    //  Tailwind on Vercel do not generate css for color due to tree shaking
    switch(notification.color) {
      case 'red':
        notificationClass = "bg-red-100 text-red-900"
        break
      case 'green':
        notificationClass = "bg-green-100 text-green-900"
        break
      case 'blue':
        notificationClass = "bg-blue-100 text-blue-900"
        break
      default:
        notificationClass = "bg-black-100 text-black-900"
    }

    classes.push(notificationClass);

    return classes.join(' ');
  }

}
