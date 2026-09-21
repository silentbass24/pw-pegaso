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
    @ViewChild('VerticalDiv') VerticalDiv: ElementRef;

    onValueChangedVertical(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.VerticalDiv) { return; }
        this.VerticalDiv.nativeElement.innerHTML = 'Vertical (' + parseInt(event.currentValue) + ')';
    };

    onValueChangedHorizontal(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.HorizontalDiv) { return; }
        this.HorizontalDiv.nativeElement.innerHTML = 'Horizontal (' + parseInt(event.currentValue) + ')';
    };
}