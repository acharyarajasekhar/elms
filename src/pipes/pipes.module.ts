import { NgModule } from '@angular/core';
import { TrimTextPipe } from './trim-text/trim-text';
import { SummaryPipe } from '../helper/custom-pipe';
import { NamePipe } from '../helper/name-pipe';
import { NametrimPipe } from './../helper/name-trim';
import { FilterByEmailIdPipe } from './filter-by-email-id/filter-by-email-id';
import { FilterByIsManagerFlagPipe } from './filter-by-is-manager-flag/filter-by-is-manager-flag';
@NgModule({
	declarations: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe,
    FilterByEmailIdPipe,
    FilterByIsManagerFlagPipe
	],
	imports: [],
	exports: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe,
    FilterByEmailIdPipe,
    FilterByIsManagerFlagPipe
	]
})
export class PipesModule {}
