import { Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { LeaveStatus } from '../../models/leavestatus.enum';

@Injectable()

export class serachservice
{
    ukey: string = localStorage.getItem('myId');
    filteredLeaveCollection: AngularFirestoreCollection<Leave> = null;
    myDate:any;

    
    constructor(public _fireStore: AngularFirestore)
    {
         this.myDate=new Date();
    }

    getSearchresults(isManager:boolean,teamId:string,startDate:Date, endDate:Date) {
        if(isManager){
          if (startDate !=null && endDate != null) {
            this.filteredLeaveCollection = this._fireStore.collection('leaves', ref => {
              return ref.where('from', '>=', startDate)
                        .orderBy('from', 'asc');
            });
          }
          return this.filteredLeaveCollection.valueChanges();
        }
      }
}
