import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';


import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxDropDownButtonModule, jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton';
import { jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';

@Component({
    selector: 'app-root',
    imports: [jqxDropDownButtonModule, jqxTreeModule, jqxCheckBoxModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit {
    @ViewChild('myDropDownButton') myDropDownButton: jqxDropDownButtonComponent;
    @ViewChild('myTree') myTree: jqxTreeComponent;

    ngAfterViewInit(): void {
        this.myDropDownButton.setContent('<div style="position: relative; margin-left: 3px; margin-top: 4px;">Home</div>');
    }

    treeOnSelect(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDropDownButton || !this.myTree) { return; }
        let item = this.myTree.getItem(event.args.element);
        let dropDownContent = `<div style="position: relative; margin-left: 3px; margin-top: 4px;">${item.label}</div>`;
        this.myDropDownButton.setContent(dropDownContent);
    }

    checkBoxOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDropDownButton) { return; }
        this.myDropDownButton.autoOpen(event.args.checked);
    }
}
