import { Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
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
    myLeaveItems = new Subject<any>();
    
    constructor(public _fireStore: AngularFirestore)
    {
         this.myDate=new Date();
    }


    getLeaveItem(isManager:boolean,ManagerId:string,startDate:Date, endDate:Date)
    {

      var leavesCollectionRef = this._fireStore.collection('eLeaves', 
      ref => ref
      .where("to", ">=", startDate)
      .orderBy("to", "asc")
  ).snapshotChanges();
    leavesCollectionRef.subscribe(leaves => {
      this.Leaves=[];
     if(leaves.length>0){
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
              this.myLeaveItems.next(this.Leaves);
            })
          });  
      }) 
     })
    }
    else
    {
      this.myLeaveItems.next(this.Leaves);
    }
    })
    }
    
    getSearchresults(isManager:boolean,teamId:string,ManagerId:string,startDate:Date, endDate:Date) {
      if (startDate !=null && endDate != null) {
        var leavesCollectionRef = this._fireStore.collection('eLeaves', 
             ref => ref
               .where("to", ">=", startDate)
               .orderBy("to", "asc")
           ).snapshotChanges();
          leavesCollectionRef.subscribe(leaves => {

            this.Leaves=[];
            if(leaves.length>0){
           leaves.forEach((leaveItem:any) => { 

            var leavesArray = leaveItem.payload.doc.data();
            leavesArray.leaveId = leaveItem.payload.doc.id;
            if(leavesArray.from <= endDate)       
            leavesArray.owner.get()
              .then(userRef => { 
                  var user = userRef.data(); 
                  if(isManager && user.manager.id==ManagerId)
                 {
                  user.manager.get()
                    .then(managerRef => {
                      user.manager = managerRef.data();
                      user.team.get().then(teamref=>{user.team=teamref.data()
                        leavesArray.owner = user;
                        this.Leaves.push(leavesArray);
                        this.myLeaves.next(this.Leaves);
                      })
                    });  
                  }
                  else if (!isManager && teamId!=null && user.team.id==teamId) 
                  {
                    user.manager.get()
                    .then(managerRef => {
                      user.manager = managerRef.data();
                      user.team.get().then(teamref=>{user.team=teamref.data()
                        leavesArray.owner = user;
                        this.Leaves.push(leavesArray);
                        this.myLeaves.next(this.Leaves);
                      })
                    });  
                  }
              });
          });
        }
        else
        {
          this.myLeaves.next(this.Leaves);
        }
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

getLeaveItemsCollections():Observable<any>
{
    return this.myLeaveItems.asObservable();
}


}
