import { Component } from '@angular/core';

import { jqxNumberInputModule, jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxNumberInputModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: string;
}