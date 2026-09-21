import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { jqxPanelComponent, jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxNumberInputModule, jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';

@Component({
    selector: 'app-root',
    imports: [jqxNumberInputModule, jqxPanelModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('Events') Events: jqxPanelComponent;

    change(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.Events) { return; }
        let value = event.args.value;
        this.Events.clearcontent();
        this.Events.prepend('<div style="margin-top: 5px;">Value: ' + value + '</div>');
    };

    textchanged(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.Events) { return; }
        let text = event.args.text;
        this.Events.prepend('<div style="margin-top: 5px;">Text: ' + text + '</div>');
    };
}