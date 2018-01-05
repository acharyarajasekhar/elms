import { NgModule } from '@angular/core';
import { DuringThisTimeComponent } from './during-this-time/during-this-time';
import { WhoIsOnLeaveComponent } from './who-is-on-leave/who-is-on-leave';
@NgModule({
	declarations: [DuringThisTimeComponent,
    WhoIsOnLeaveComponent],
	imports: [],
	exports: [DuringThisTimeComponent,
    WhoIsOnLeaveComponent]
})
export class ComponentsModule {}
