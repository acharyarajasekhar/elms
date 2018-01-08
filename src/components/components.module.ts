import { NgModule } from '@angular/core';
import { DuringThisTimeComponent } from './during-this-time/during-this-time';
import { WhoIsOnLeaveComponent } from './who-is-on-leave/who-is-on-leave';
import { AvatarDirective } from './avatar/avatar';
@NgModule({
    declarations: [
        DuringThisTimeComponent,
        WhoIsOnLeaveComponent,
        AvatarDirective
    ],
    imports: [],
    exports: [
        DuringThisTimeComponent,
        WhoIsOnLeaveComponent,
        AvatarDirective
    ]
})
export class ComponentsModule { }
