import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoadingComponent } from './loading/loading.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotificationComponent } from './notification/notification.component';
import { FooterComponent } from './footer/footer.component';
import { TaskComponent } from './task/task.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SortTasksPipe } from './shared/sortTasks.pipe';

@NgModule({
  declarations: [											
    AppComponent,
      WelcomeComponent,
      LoadingComponent,
      TasksComponent,
      NotificationComponent,
      FooterComponent,
      TaskComponent,
      SortTasksPipe
   ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    DpDatePickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
