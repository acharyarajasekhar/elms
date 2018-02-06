import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AppContextProvider } from '../../providers/app-context/app-context';

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

  todaysCollection: any = [];
  tomorrowsCollection: any = [];
  myTeamMembers: any = [];
  myReportees: any = [];
  myProfile: any = [];

  constructor(
    public navCtrl: NavController,
    private appContext: AppContextProvider) {

    this.appContext.myProfile.subscribe(profile => {
      this.myProfile = profile;
    })

    this.appContext.myTeamMembers.subscribe(teamMates => {
      this.myTeamMembers = teamMates;
    })

    this.appContext.myReportees.subscribe(reportees => {
      this.myReportees = reportees;
    })

    this.appContext.tomorrowsLeaves.subscribe(leaves => {
      this.tomorrowsCollection = [];
      this.UpdateCollection(leaves, this.tomorrowsCollection);
    })

    this.appContext.todaysLeaves.subscribe(leaves => {
      this.todaysCollection = [];
      this.UpdateCollection(leaves, this.todaysCollection);
    })

  }

  private UpdateCollection(leaves: any, collection: any) {
    if (leaves) {
      leaves.forEach(leave => {
        console.log(leave);
        this.myTeamMembers.forEach(teamMember => {
          if (leave.owner.id == teamMember.email) {
            leave.owner = teamMember;
            collection.push(leave);
          }
        });
        if (this.myProfile.isManager) {
          this.myReportees.forEach(reportee => {
            if (leave.owner.id == reportee.email) {
              leave.owner = reportee;
              collection.push(leave);
            }
          });
        }
      });
    }
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
