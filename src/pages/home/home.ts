import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { UserServiceV2Provider } from '../../providers/user-service-v2/user-service-v2';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private slides: Array<string> = [
    "assets/imgs/lms1.jpg",
    "assets/imgs/lms2.jpg",
    "assets/imgs/lms3.jpg",
    "assets/imgs/lms4.jpg",
    "assets/imgs/lms5.jpg",
    "assets/imgs/lms6.jpg",
    "assets/imgs/lms7.jpg"
  ];

  constructor(
    public navCtrl: NavController,
    private userSvc: UserServiceV2Provider,
    private leaveSvc: LeaveServicev2Provider) {

    this.userSvc.myProfile.subscribe(profile => {
      console.log("Ach");
      console.log(profile);      
    })

    this.userSvc.myTeamMembers.subscribe(teamMates => {
      console.log(teamMates);
    })

    this.userSvc.myReportees.subscribe(reportees => {
      console.log("report");
      console.log(reportees);
    })

    this.leaveSvc.todaysLeaves.subscribe(leaves => {
      console.log("todaysLeaves");
      console.log(leaves);
    })

    this.leaveSvc.tomorrowsLeaves.subscribe(leaves => {
      console.log("tomorrowsLeaves");
      console.log(leaves);
    })

  }

  // bindLeaveCarosol() {
  //   if (localStorage.getItem('userContext') != null && localStorage.getItem('userContext') != '') {
  //     let isManager = JSON.parse(localStorage.getItem('userContext')).isManager;
  //     let myTeam = localStorage.getItem('teamId');
  //     let myId = JSON.parse(localStorage.getItem('userContext')).email;
  //     let isManagerRole: boolean = JSON.parse(localStorage.getItem('userContext')).isManager;
  //     var toDTTMtdy = new Date(new Date(this.tdydate).setHours(23, 59, 59, 0));
  //     var toDTTMtmrw = new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0));
  //     if (!isManagerRole) {
  //       this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
  //         .subscribe(leaves => {
  //           leaves.forEach((leaveItem: any) => {
  //             if (leaveItem.from <= toDTTMtdy)
  //               leaveItem.owner.get()
  //                 .then(userRef => {
  //                   var user = userRef.data();

  //                   if (user.team != null && user.team != '') {
  //                     user.team.get()
  //                       .then(teamRef => {
  //                         user.team = teamRef.data();
  //                       });
  //                     if (user.team.id == myTeam) {
  //                       leaveItem.owner = user;

  //                       this.leavesToday$.push(leaveItem);
  //                     }
  //                   }

  //                 });
  //           });
  //           //to Get Leave for Tomorrow
  //           this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
  //             .subscribe(leavestmr => {
  //               leavestmr.forEach((leaveItems: any) => {
  //                 if (leaveItems.from <= toDTTMtmrw)
  //                   leaveItems.owner.get()
  //                     .then(userRefs => {
  //                       var users = userRefs.data();

  //                       if (users.team != null && users.team != '') {
  //                         users.team.get()
  //                           .then(teamRef => {
  //                             users.team = teamRef.data();
  //                           });
  //                         if (users.team.id == myTeam) {
  //                           leaveItems.owner = users;
  //                           this.leavesTmrw$.push(leaveItems);
  //                         }
  //                       }
  //                     });
  //               });
  //             });
  //         });
  //     }
  //     else {
  //       //Get Tdy and Tmrw leaves for Manager Role
  //       //to Get Leave for today
  //       this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
  //         .subscribe(leaves => {
  //           leaves.forEach((leaveItem: any) => {

  //             if (leaveItem.from <= toDTTMtdy)
  //               leaveItem.owner.get()
  //                 .then(userRef => {
  //                   var user = userRef.data();

  //                   if (user.team != null && user.team != '') {
  //                     user.team.get()
  //                       .then(teamRef => {
  //                         user.team = teamRef.data();
  //                       });
  //                   }
  //                   if (user.manager != null && user.manager != '') {
  //                     user.manager.get()
  //                       .then(managerRef => {
  //                         user.manager = managerRef.data();
  //                       });
  //                     if (user.manager.id == myId) {
  //                       leaveItem.owner = user;
  //                       this.leavesToday$.push(leaveItem);
  //                     }
  //                   }
  //                 });
  //           });

  //           //to Get Leave for Tomorrow
  //           this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
  //             .subscribe(leavestmr => {
  //               leavestmr.forEach((leaveItems: any) => {
  //                 if (leaveItems.from <= toDTTMtmrw)
  //                   leaveItems.owner.get()
  //                     .then(userRefs => {
  //                       var users = userRefs.data();
  //                       if (users.team != null && users.team != '') {
  //                         users.team.get()
  //                           .then(teamRef => {
  //                             users.team = teamRef.data();
  //                           });
  //                       }
  //                       if (users.manager != null && users.manager != '') {
  //                         users.manager.get()
  //                           .then(managerRef => {
  //                             users.manager = managerRef.data();
  //                           });
  //                         if (users.manager.id == myId) {
  //                           leaveItems.owner = users;
  //                           this.leavesTmrw$.push(leaveItems);
  //                         }
  //                       }
  //                     });
  //               });
  //             });
  //         });

  //     }
  //   }
  // }

  goToPage(pageName) {
    this.navCtrl.push(pageName);
  }

  // getUserContext() {
  //   this.userService.getUserById(this._authId)
  //     .subscribe(result => {
  //       let userContext: any = {
  //         "name": result.name,
  //         "email": result.email,
  //         "photoUrl": result.photoUrl,
  //         "phoneNumber": result.phoneNumber,
  //         "isManager": result.isManager
  //       };
  //       localStorage.setItem('userContext', JSON.stringify(userContext));
  //       this.bindLeaveCarosol();
  //     }, err => {
  //       console.log(err);
  //       this.showToast(err);
  //     });
  // }

  // ngOnInit() {
  //   if (localStorage.getItem('userContext') != null && localStorage.getItem('userContext') != '') {
  //     let ctx = JSON.parse(localStorage.getItem('userContext'));
  //     this.leaveService
  //       .getBadgeCount(ctx.isManager, ctx.email)
  //       .subscribe((result: any) => {
  //         if (ctx.isManager == "true") {
  //           result.forEach((lvRef: any) => {
  //             lvRef.data.owner.get().then(userRef => {
  //               var user = userRef.data();
  //               if (user.manager != null && user.manager != '') {
  //                 user.manager.get()
  //                   .then(managerRef => {
  //                     user.manager = managerRef.data();
  //                   });
  //                 if (user.manager.id == ctx.email) {
  //                   lvRef.data.owner = user;
  //                   this.filteredResult$.push(lvRef);
  //                 }
  //               }
  //             })
  //           });
  //           this.badgeCount = this.filteredResult$.length;
  //         }
  //         else {
  //           let filteredResult = _.filter(result, function (obj) {
  //             return obj.data.owner.id == ctx.email;
  //           });
  //           this.badgeCount = filteredResult.length;
  //         }
  //       }, err => {
  //         console.log(err);
  //         this.showToast(err);
  //       });
  //   }
  // }

  // showToast(alert_message: string) {
  //   let toast = this.toastCtrl.create({
  //     message: alert_message,
  //     duration: 4000,
  //     position: 'bottom'
  //   });
  //   toast.present(toast);
  // }
}
