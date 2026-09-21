import { Component, ViewChild, ViewEncapsulation } from '@angular/core';


import { jqxPanelComponent, jqxPanelModule } from 'jqwidgets-ng/jqxpanel';

import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxPanelModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('myTree') myTree: jqxTreeComponent;
    @ViewChild('myPanel') myPanel: jqxPanelComponent;

    source: any[] =
        [
            {
                icon: 'assets/img/mailIcon.png', label: 'Mail', expanded: true,
                items:
                    [
                        { icon: 'assets/img/calendarIcon.png', label: 'Calendar' },
                        { icon: 'assets/img/contactsIcon.png', label: 'Contacts', selected: true }
                    ]
            },
            {
                icon: 'assets/img/folder.png', label: 'Inbox', expanded: true,
                items:
                    [
                        { icon: 'assets/img/folder.png', label: 'Admin' },
                        { icon: 'assets/img/folder.png', label: 'Corporate' },
                        { icon: 'assets/img/folder.png', label: 'Finance' },
                        { icon: 'assets/img/folder.png', label: 'Other' },
                    ]
            },
            { icon: 'assets/img/recycle.png', label: 'Deleted Items' },
            { icon: 'assets/img/notesIcon.png', label: 'Notes' },
            { iconsize: 14, icon: 'assets/img/settings.png', label: 'Settings' },
            { icon: 'assets/img/favorites.png', label: 'Favorites' },
        ];

    counter: number = 0;
    myTreeOnSelect(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree || !this.myPanel) { return; }
        let args = event.args;
        let item = this.myTree.getItem(args.element);
        if (this.counter > 1) {
            this.myPanel.prepend('<div style="margin-top: 5px;">Selected: ' + item.label + '</div>');
        }
        this.counter++;
    };

    myTreeOnExpand(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree || !this.myPanel) { return; }
        let args = event.args;
        let item = this.myTree.getItem(args.element);
        this.myPanel.prepend('<div style="margin-top: 5px;">Expanded: ' + item.label + '</div>');
    };

    myTreeOnCollapse(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree || !this.myPanel) { return; }
        let args = event.args;
        let item = this.myTree.getItem(args.element);
        this.myPanel.prepend('<div style="margin-top: 5px;">Collapsed: ' + item.label + '</div>');
    };

}