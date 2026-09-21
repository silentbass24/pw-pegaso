import { Component, ViewChild, ElementRef } from '@angular/core';

import { jqxRadioButtonModule, jqxRadioButtonComponent } from 'jqwidgets-ng/jqxradiobutton';
@Component({
    selector: 'app-root',
    imports: [jqxRadioButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('events') eventsLog: ElementRef;

    count = 0;
    clearLog(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.eventsLog) { return; }
        this.count++;
        let log = this.eventsLog.nativeElement;

        if (this.count >= 2) {
            log.innerHTML = '';
            this.count = 0;
        }
    }

    firstBtnOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.eventsLog) { return; }
        this.clearLog();
        let log = this.eventsLog.nativeElement;
        let checked = event.args.checked;
        if (checked) {
            log.innerHTML += '<div><span>Checked: 12 Months Contract</span></div>';
        }
        else {
            log.innerHTML += '<div><span>Unchecked: 12 Months Contract</span></div>';
        }
    }

    secondBtnOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.eventsLog) { return; }
        this.clearLog();
        let log = this.eventsLog.nativeElement;
        let checked = event.args.checked;
        if (checked) {
            log.innerHTML += '<div><span>Checked: 6 Months Contract</span></div>';
        } else {
            log.innerHTML += '<div><span>Unchecked: 6 Months Contract</span></div>';
        }
    }

    thirdBtnOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.eventsLog) { return; }
        this.clearLog();
        let log = this.eventsLog.nativeElement;
        let checked = event.args.checked;
        if (checked) {
            log.innerHTML += '<div><span>Checked: 3 Months Contract</span></div>';
        } else {
            log.innerHTML += '<div><span>Unchecked: 3 Months Contract</span></div>';
        }
    }

}
