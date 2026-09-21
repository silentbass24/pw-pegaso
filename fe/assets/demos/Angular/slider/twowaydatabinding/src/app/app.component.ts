import { Component } from '@angular/core';

import { jqxSliderModule, jqxSliderComponent } from 'jqwidgets-ng/jqxslider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxSliderModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: number;
}