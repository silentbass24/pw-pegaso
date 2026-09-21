import { Component } from '@angular/core';

import { jqxTextAreaModule, jqxTextAreaComponent } from 'jqwidgets-ng/jqxtextarea';
import 'jqwidgets-ng/jqwidgets/jqxdata.js';
@Component({
    selector: 'app-root',
    imports: [jqxTextAreaModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    url: string = '../assets/customers.txt';

    source: any =
        {
            datatype: 'json',
            datafields: [
                { name: 'CompanyName' },
                { name: 'ContactName' }
            ],
            url: this.url
        };

    dataAdapter: any = new jqx.dataAdapter(this.source);
}