import { Component } from '@angular/core';

import { jqxPasswordInputModule, jqxPasswordInputComponent } from 'jqwidgets-ng/jqxpasswordinput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxPasswordInputModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: string;
}