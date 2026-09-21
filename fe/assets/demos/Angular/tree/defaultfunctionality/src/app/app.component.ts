import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';


import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton';

import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxExpanderModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit {
    @ViewChild('treeReference') tree: jqxTreeComponent;
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.tree.selectItem(null);
        });
    }
    treeSource: any[] =
        [
            {
                icon: "assets/img/mailIcon.png", label: "Mail", expanded: true,
                items:
                    [
                        { icon: "assets/img/calendarIcon.png", label: "Calendar" },
                        { icon: "assets/img/contactsIcon.png", label: "Contacts", selected: true }
                    ]
            },
            {
                icon: "assets/img/folder.png", label: "Inbox", expanded: true,
                items:
                    [
                        { icon: "assets/img/folder.png", label: "Admin" },
                        { icon: "assets/img/folder.png", label: "Corporate" },
                        { icon: "assets/img/folder.png", label: "Finance" },
                        { icon: "assets/img/folder.png", label: "Other" },
                    ]
            },
            { icon: "assets/img/recycle.png", label: "Deleted Items" },
            { icon: "assets/img/notesIcon.png", label: "Notes" },
            { iconsize: 14, icon: "assets/img/settings.png", label: "Settings" },
            { icon: "assets/img/favorites.png", label: "Favorites" }
        ];
}