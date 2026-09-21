import { Component, ViewChild, AfterViewInit } from '@angular/core';


import { jqxNavigationBarModule, jqxNavigationBarComponent } from 'jqwidgets-ng/jqxnavigationbar';
@Component({
    selector: 'app-root',
    imports: [jqxNavigationBarModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild('jqxNavigationBar') jqxNavigationBar: jqxNavigationBarComponent;

    ngAfterViewInit() {
        this.jqxNavigationBar.focus();
    }
}