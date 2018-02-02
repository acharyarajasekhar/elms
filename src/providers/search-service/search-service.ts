import { Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { leave } from '@angular/core/src/profile/wtf_impl';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class searchservice
{
    ukey: string = localStorage.getItem('myId');
    filteredLeaveCollection: AngularFirestoreCollection<Leave> = null;
    myDate:any;
    Leaves:Array<any>;
    myLeaves= new Subject<any>();
    
    constructor(public _fireStore: AngularFirestore)
    {
         this.myDate=new Date();
    }


    getbyManagerId(isManager:boolean,ManagerId:string,startDate:Date, endDate:Date)
    {

      var leavesCollectionRef = this._fireStore.collection('eLeaves', 
      ref => ref
      .where("to", ">=", startDate)
      .orderBy("to", "asc")
  ).snapshotChanges();
    leavesCollectionRef.subscribe(leaves => {
      this.Leaves=[];
     leaves.forEach((leaveItem:any) => { 
      var leavesArray = leaveItem.payload.doc.data();
      leavesArray.leaveId = leaveItem.payload.doc.id;
      if(leavesArray.from <= endDate)   
      leavesArray.owner.get()
      .then(userRef => { 
          var user = userRef.data(); 
          if(isManager && user.manager.id==ManagerId)
          user.manager.get()
          .then(managerRef => {
            user.manager = managerRef.data();
            user.team.get().then(teamref=>{user.team=teamref.data()
              leavesArray.owner = user;
              this.Leaves.push(leavesArray);
              this.myLeaves.next(this.Leaves);
            })
          });  
      }) 
     })
    })
    }
    
    getSearchresults(isManager:boolean,teamId:string,startDate:Date, endDate:Date) {
   
      if (startDate !=null && endDate != null) {
        var leavesCollectionRef = this._fireStore.collection('eLeaves', 
             ref => ref
               .where("to", ">=", startDate)
               .orderBy("to", "asc")
           ).snapshotChanges();
          leavesCollectionRef.subscribe(leaves => {

            this.Leaves=[];
           leaves.forEach((leaveItem:any) => { 

            var leavesArray = leaveItem.payload.doc.data();
            leavesArray.leaveId = leaveItem.payload.doc.id;
            if(leavesArray.from <= endDate)       
            leavesArray.owner.get()
              .then(userRef => { 
                  var user = userRef.data(); 
                  if(teamId!=null && user.team.id==teamId)
                  user.manager.get()
                    .then(managerRef => {
                      user.manager = managerRef.data();
                      user.team.get().then(teamref=>{user.team=teamref.data()
                        leavesArray.owner = user;
                        this.Leaves.push(leavesArray);
                        this.myLeaves.next(this.Leaves);
                      })
                    });   
              });
          });
        },
      err=>{

      });
    }
    console.log(this.Leaves)
}

getLeavesCollections():Observable<any>
{
    return this.myLeaves.asObservable();
}


}
