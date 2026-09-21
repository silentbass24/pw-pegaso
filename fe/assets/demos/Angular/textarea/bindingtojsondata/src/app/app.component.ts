import { Component, ViewChild, ElementRef } from '@angular/core';


import { jqxTextAreaModule, jqxTextAreaComponent } from 'jqwidgets-ng/jqxtextarea';
import 'jqwidgets-ng/jqwidgets/jqxdata.js';
@Component({
    selector: 'app-root',
    imports: [jqxTextAreaModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('selectionlog') selectionlog: ElementRef;

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

    select(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.selectionlog) { return; }
        if (event.args) {
            let item = event.args.item;
            if (item) {
                this.selectionlog.nativeElement.innerHTML = '<div>Value: ' + item.value + '</div><div>Label: ' + item.label + '</div>';
            }
        }
    };
}