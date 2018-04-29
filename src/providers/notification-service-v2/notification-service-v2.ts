import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppContextProvider } from '../app-context/app-context';
import { LeaveServicev2Provider } from '../leave-servicev2/leave-servicev2';

@Injectable()
export class NotificationServiceV2 {

    constructor(
        public appContext: AppContextProvider,
        private leaveSvc: LeaveServicev2Provider,
        public store: AngularFirestore) {

            this.appContext.myProfile.subscribe(profile => {
                if(profile && profile.email) {
                    this.store.collection('eNotifications').doc(profile.email).collection('notifications')
                    .valueChanges().subscribe(results => {
                        this.appContext.notificationsV2.next(results);
                        // console.log(results);
                        this.getMyNotificationDetails();
                    })
                }
            });

    }

    getMyNotificationDetails() {
        this.appContext.notificationLeaves.next([]);
        if(this.appContext.notificationsV2Collection && this.appContext.notificationsV2Collection.length > 0) {
            let leaves = [];
            this.appContext.notificationsV2Collection.forEach(n => {
                this.store.collection('eLeaves').doc(n.leaveId).valueChanges().subscribe((result: any) => {
                    
                    if(result) {

                        result.leaveId = n.leaveId;

                        result.owner.get()
                        .then((userRef: any) => {
                            let user = userRef.data();
                            user.manager.get().then(managerRef => {
                                user.manager = managerRef.data();
                                result.owner = user;

                                if(user.email == n.targetUserID) {
                                    result.isMyLeave = true;
                                }
                                else if(user.manager.email == n.targetUserID) {
                                    result.isMyReporteeLeave = true;
                                }

                                console.log(result);
                                leaves.push(result);
                                this.appContext.notificationLeaves.next(leaves);
                            })
                        })
                    }                   
                    
                })
            })
        }
    }

    clearNotification(leaveId) {
        this.store.collection('eNotifications').doc(this.appContext.myProfileObject.email)
        .collection('notifications', ref => ref.where('leaveId', '==', leaveId))
        .snapshotChanges().subscribe((items:any) => {
            items.forEach(item => {
                // console.log(item);
                item.payload.doc.ref.delete().then(() => {
                    this.getMyNotificationDetails();
                    console.log("Notification successfully deleted!");
                  }).catch(function(error) {
                    this.getMyNotificationDetails();
                    console.error("Error removing Notification: ", error);
                  });
            })            
        })
    }

}