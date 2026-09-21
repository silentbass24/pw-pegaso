import { Component } from '@angular/core';

import { jqxCalendarModule, jqxCalendarComponent } from 'jqwidgets-ng/jqxcalendar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxCalendarModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    date: Date = new Date();
}
