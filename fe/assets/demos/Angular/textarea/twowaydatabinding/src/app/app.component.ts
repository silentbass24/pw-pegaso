import { Component } from '@angular/core';

import { jqxTextAreaModule, jqxTextAreaComponent } from 'jqwidgets-ng/jqxtextarea';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxTextAreaModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: string;
}