import { Component } from '@angular/core';

import { jqxEditorModule, jqxEditorComponent } from 'jqwidgets-ng/jqxeditor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-root',
	imports: [jqxEditorModule, FormsModule, CommonModule],
	standalone: true,
	templateUrl: './app.component.html'
})

export class AppComponent {
	value: string;


	getWidth(): any {
		if (document.body.offsetWidth < 850) {
			return '90%';
		}

		return 850;
	}
}
