import { Component, ViewChild } from '@angular/core';

import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';
import { jqxTabsModule, jqxTabsComponent } from 'jqwidgets-ng/jqxtabs';

@Component({
    selector: 'app-root',
    imports: [jqxTabsModule, jqxRadioButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('jqxTabs') jqxTabs: jqxTabsComponent;

    height: number = 25;
    width: number = 100;

    checkedRight(event: any): void {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.jqxTabs) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.jqxTabs) { return; }
        this.jqxTabs.scrollPosition('right');
    };

    checkedBoth(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.jqxTabs) { return; }
        this.jqxTabs.scrollPosition('both');
    };

    checkedLeft(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.jqxTabs) { return; }
        this.jqxTabs.scrollPosition('left');
    };
}