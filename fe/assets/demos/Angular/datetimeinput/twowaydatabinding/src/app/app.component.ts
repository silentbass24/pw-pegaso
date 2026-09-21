import { Component } from '@angular/core';

import { jqxDateTimeInputModule, jqxDateTimeInputComponent } from 'jqwidgets-ng/jqxdatetimeinput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxDateTimeInputModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    time: any = new Date();
    date: any = new Date();
}