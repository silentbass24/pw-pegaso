import { Component } from '@angular/core';

import { jqxGridModule, jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxButtonGroupModule } from 'jqwidgets-ng/jqxbuttongroup';
@Component({
    selector: 'app-root',
    imports: [jqxGridModule, jqxButtonGroupModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {

}
