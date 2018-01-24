import { NgModule } from '@angular/core';
import { TrimTextPipe } from './trim-text/trim-text';
import { SummaryPipe } from '../helper/custom-pipe';
import { NamePipe } from '../helper/name-pipe';
import { NametrimPipe } from './../helper/name-trim';
@NgModule({
	declarations: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe
	],
	imports: [],
	exports: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe
	]
})
export class PipesModule {}
