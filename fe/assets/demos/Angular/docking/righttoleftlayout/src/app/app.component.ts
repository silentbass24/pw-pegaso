import { Component } from '@angular/core';

import { jqxDockingModule, jqxDockingComponent } from 'jqwidgets-ng/jqxdocking';
import { jqxCalendarModule } from 'jqwidgets-ng/jqxcalendar';
import { jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
@Component({
    selector: 'app-root',
    imports: [jqxDockingModule, jqxCalendarModule, jqxTabsModule, jqxPanelModule, jqxListBoxModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {

    getWidth(): any {
        if (document.body.offsetWidth < 700) {
            return '90%';
        }

        return 700;
    }

    source: string[] =
        [
            'JavaScript Certification - Welcome to our network',
            'Business Challenges via Web take a part',
            'jQWidgets better web, less time. Take a tour',
            'Facebook - you have 7 new notifications',
            'Twitter - John Doe is following you. Look at his profile',
            'New videos, take a look at YouTube.com'
        ];
}
