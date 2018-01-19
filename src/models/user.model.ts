export interface User {
    uid: string;
    name: string;
    email: string;
    photoUrl: string;
    phoneNumber: string;
    manager: string;
    team: string;
    isManagerRole?:boolean;
  }