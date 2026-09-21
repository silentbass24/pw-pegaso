import { Component, ViewChild } from '@angular/core';



import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myTree') myTree: jqxTreeComponent;

    // Create jqxTree
    source: any[] = [
        {
            icon: "assets/img/mailIcon.png", label: "Mail", expanded: true, items: [
                { icon: "assets/img/calendarIcon.png", label: "Calendar" },
                { icon: "assets/img/contactsIcon.png", label: "Contacts", selected: true }
            ]
        },
        {
            icon: "assets/img/folder.png", label: "Inbox", expanded: true, items: [
                { icon: "assets/img/folder.png", label: "Admin" },
                { icon: "assets/img/folder.png", label: "Corporate" },
                { icon: "assets/img/folder.png", label: "Finance" },
                { icon: "assets/img/folder.png", label: "Other" },
            ]
        },
        { icon: "assets/img/recycle.png", label: "Deleted Items" },
        { icon: "assets/img/notesIcon.png", label: "Notes" },
        { iconsize: 14, icon: "assets/img/settings.png", label: "Settings" },
        { icon: "assets/img/favorites.png", label: "Favorites" },
    ];
}