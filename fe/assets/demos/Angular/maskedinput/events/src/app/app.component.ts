import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { jqxPanelComponent, jqxPanelModule } from 'jqwidgets-ng/jqxpanel';

import { jqxMaskedInputModule, jqxMaskedInputComponent } from 'jqwidgets-ng/jqxmaskedinput';
@Component({
    selector: 'app-root',
    imports: [jqxMaskedInputModule, jqxPanelModule],
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
        const eventType = event.type;
        const eventValue = event.args.value;
        this.Events.prepend('<div style="margin-top: 5px;">type: ' + eventType + '; value: ' + eventValue + '</div>');
    };
}
