import { Component } from '@angular/core';

import { jqxRatingModule, jqxRatingComponent } from 'jqwidgets-ng/jqxrating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxRatingModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: number;
}