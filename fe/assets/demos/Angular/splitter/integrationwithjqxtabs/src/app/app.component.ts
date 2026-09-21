import { Component } from '@angular/core';

import { jqxSplitterModule, jqxSplitterComponent } from 'jqwidgets-ng/jqxsplitter';
import { jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
@Component({
	selector: 'app-root',
	imports: [jqxSplitterModule, jqxTabsModule],
	standalone: true,
	templateUrl: './app.component.html'
})

export class AppComponent {

	getWidth(): any {
		if (document.body.offsetWidth < 850) {
			return '90%';
		}

		return 850;
	}


}