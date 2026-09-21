import { Component, ViewChild, ElementRef } from '@angular/core';
import { jqxNotificationModule, jqxNotificationComponent } from 'jqwidgets-ng/jqxnotification';
import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';

@Component({
    selector: 'app-root',
    imports: [jqxNotificationModule, jqxRadioButtonModule, jqxCheckBoxModule, jqxButtonModule, jqxExpanderModule, jqxDropDownListModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myNotification') myNotification: jqxNotificationComponent;

    source: string[] = ["info", "warning", "success", "error", "mail", "time", "null"]

    openNotificationClick(): void {
        this.myNotification.open();
    };

    closeLastNotificationClick(): void {
        this.myNotification.closeLast();
    };

    closeNotificationsClick(): void {
        this.myNotification.closeAll();
    };

    topLeftChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        this.myNotification.position('top-left');
    };

    topRightChecked(): void {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myNotification) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myNotification) { return; }
        this.myNotification.position('top-right');
    };

    bottomLeftChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        this.myNotification.position('bottom-left');
    };

    bottomRightChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        this.myNotification.position('bottom-right');
    };

    change(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        let choice = event.args.item.label;
        let newTemplate;
        if (choice != "null") {
            newTemplate = choice;
        } else {
            newTemplate = null;
        }

        this.myNotification.template(newTemplate);
    };

    closeOnClickCheckboxChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        let checked = event.args.checked;
        this.myNotification.closeOnClick(checked);
    };

    autoCloseCheckBoxChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        let checked = event.args.checked;
        this.myNotification.autoClose(checked);
    };

    blinkCheckboxChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myNotification) { return; }
        let checked = event.args.checked;
        this.myNotification.blink(checked);
    };
}