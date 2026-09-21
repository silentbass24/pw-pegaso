import { Component } from '@angular/core';

import { jqxPanelModule, jqxPanelComponent } from 'jqwidgets-ng/jqxpanel';
import { jqxComplexInputModule, jqxComplexInputComponent } from 'jqwidgets-ng/jqxcomplexinput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [jqxComplexInputModule, jqxPanelModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: string = '15 + 7.2i';
}
