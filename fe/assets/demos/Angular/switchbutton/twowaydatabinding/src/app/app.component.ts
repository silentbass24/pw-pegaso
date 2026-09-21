import { Component, ViewChild } from '@angular/core';

import { jqxSwitchButtonModule, jqxSwitchButtonComponent } from 'jqwidgets-ng/jqxswitchbutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxSwitchButtonModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    value: boolean = false;
}
