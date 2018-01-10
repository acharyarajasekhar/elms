import { LeaveStatus } from "./leavestatus.enum";

export interface Leave {
    requestor: string,
    from: Date,
    to: Date,
    isHalfDay: boolean,
    reason: string,
    approvor: string,
    status: LeaveStatus,
    createdAt: Date,
    modifiedAt: Date
  }