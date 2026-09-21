import { Component } from '@angular/core';

import { jqxFormattedInputModule, jqxFormattedInputComponent } from 'jqwidgets-ng/jqxformattedinput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxFormattedInputModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: number = 15;
}