import { Component, ViewChild, ElementRef } from '@angular/core';

import { jqxScrollBarModule, jqxScrollBarComponent } from 'jqwidgets-ng/jqxscrollbar';
@Component({
    selector: 'app-root',
    imports: [jqxScrollBarModule, jqxScrollBarModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('HorizontalDiv') HorizontalDiv: ElementRef;

    valueChanged(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.HorizontalDiv) { return; }
        this.HorizontalDiv.nativeElement.innerText = 'Horizontal (' + parseInt(event.currentValue) + ')';
    };
}