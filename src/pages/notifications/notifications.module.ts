import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { AngularFireList } from 'angularfire2/database';
import { Leave } from '../../models/leave.model';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { PipesModule } from '../../pipes/pipes.module';
import { TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [
    NotificationsPage,
    TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    PipesModule,
  ],
  exports:[
    TimeAgoPipe
  ]
})
export class NotificationsPageModule {
  constructor() {} 

}
