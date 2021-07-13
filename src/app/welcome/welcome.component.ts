import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/notification.service';

import { UserAuthService } from '../shared/userAuth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private userAuthService:UserAuthService, private notificationService:NotificationService) { }

  ngOnInit() {
  }
  
  getUserAuth(){
    this.userAuthService.getUser().subscribe(u=>{
      this.userAuthService.updateUser(u);
      this.notificationService.sendMessage({text:`User ID generated: ${u.name}`})
    })
  }
}
