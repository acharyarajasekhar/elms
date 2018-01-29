import { LeaveStatus } from "./leavestatus.enum";
import { Reference } from "angularfire2/firestore";

export interface Leave {
    requestor: string;
    from: any;
    to: any;
    isHalfDay: boolean;
    reason: string;
    status: LeaveStatus;
    createdAt: any;
    modifiedAt: any;
    isRead :boolean;
    name?: string;
    photoUrl?: string;
    userId:string;
    teamId?:string;
    managerId?: string;
    owner?:Reference<any>;
    unixFrDate?:any; //~>change in name will break indexing,sorting & searching
    unixToDate?:any; //~>change in name will break indexing,sorting & searching
  }