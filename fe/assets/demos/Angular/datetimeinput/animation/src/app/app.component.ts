import { Component, ViewChild } from '@angular/core';

import { jqxDateTimeInputModule, jqxDateTimeInputComponent } from 'jqwidgets-ng/jqxdatetimeinput';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';

@Component({
    selector: 'app-root',
    imports: [jqxDateTimeInputModule, jqxRadioButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myDateTimeInput') myDateTimeInput: jqxDateTimeInputComponent;

    count: number = 0;

    noneAnimationBtn() {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDateTimeInput) { return; }
        this.myDateTimeInput.animationType('none');
    }

    slideAnimationBtn() {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDateTimeInput) { return; }
        this.myDateTimeInput.animationType('slide');
    }

    // avoids unnecessary overwrite in the beggining
    fadeAnimationBtn() {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myDateTimeInput) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myDateTimeInput) { return; }
        if (this.count !== 0)
            this.myDateTimeInput.animationType('fade');
        this.count = 1;
    }
}