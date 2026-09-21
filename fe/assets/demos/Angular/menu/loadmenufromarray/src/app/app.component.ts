import { Component, ViewChild } from '@angular/core';

import { jqxMenuModule, jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
@Component({
    selector: 'app-root',
    imports: [jqxMenuModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    source: any[] = [
        {
            html: "<img src='assets/img/mailIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Mail</span>", items: [
                { html: "<img src='assets/img/calendarIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Calendar</span>" },
                { html: "<img src='assets/img/contactsIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Contacts</span>" }
            ]
        },
        {
            html: "<img src='assets/img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Inbox</span>", items: [
                { html: "<img src='assets/img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Admin</span>" },
                { html: "<img src='assets/img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Corporate</span>" },
                { html: "<img src='assets/img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Finance</span>" },
                { html: "<img src='assets/img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Other</span>" }]
        },
        { html: "<img src='assets/img/recycle.png'/><span style='position: relative; left: 3px; top: -2px;'>Deleted Items</span>" },
        { html: "<img src='assets/img/notesIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Notes</span>" },
        { html: "<img src='assets/img/settings.png'/><span style='position: relative; left: 3px; top: -2px;'>Settings</span>" },
        { html: "<img src='assets/img/favorites.png'/><span style='position: relative; left: 3px; top: -2px;'>Favorites</span>" }
    ];
}