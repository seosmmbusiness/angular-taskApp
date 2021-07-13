import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './interfaces/user';
import { UserAuthService } from './shared/userAuth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  title = 'TaskApp';
  user!:User;
  subscription: Subscription = new Subscription;

  constructor (private userAuthService:UserAuthService) {
  }

  ngOnInit() {
    this.subscription = this.userAuthService.currentUser
    .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe()
  }

}
