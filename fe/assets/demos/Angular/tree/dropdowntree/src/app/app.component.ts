import { Component, ViewChild } from '@angular/core';


import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton';

import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxDropDownButtonModule } from 'jqwidgets-ng/jqxdropdownbutton';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxDropDownButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myTree') myTree: jqxTreeComponent;
    @ViewChild('myDropDownButton') myDropDownButton: jqxDropDownButtonComponent;

    myTreeOnInitialized(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDropDownButton) { return; }
        this.myDropDownButton.setContent('<div style="position: relative; margin-left: 3px; margin-top: 4px;">Home</div>');
    }

    myTreeOnSelect(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree || !this.myDropDownButton) { return; }
        let item = this.myTree.getItem(event.args.element);
        let dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + item.label + '</div>';
        this.myDropDownButton.setContent(dropDownContent);
    };
}