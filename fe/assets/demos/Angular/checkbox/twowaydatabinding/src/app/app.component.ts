import { Component } from '@angular/core';

import { jqxCheckBoxModule, jqxCheckBoxComponent } from 'jqwidgets-ng/jqxcheckbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-root',
    imports: [jqxCheckBoxModule, FormsModule, CommonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    state: boolean = true;
}
