import { Component, ViewChild, ElementRef } from '@angular/core';

import { jqxButtonGroupModule, jqxButtonGroupComponent } from 'jqwidgets-ng/jqxbuttongroup';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';

@Component({
    selector: 'app-root',
    imports: [jqxButtonGroupModule, jqxRadioButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myButtonGroup') myButtonGroup: jqxButtonGroupComponent;
    @ViewChild('myLog') myLog: ElementRef;

    myDefaultModeButtonChecked(): void {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myButtonGroup || !this.myLog) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myButtonGroup || !this.myLog) { return; }
        this.myButtonGroup.mode('default');
    };

    myRadioModeButtonChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myButtonGroup) { return; }
        this.myButtonGroup.mode('radio');
    };

    myCheckBoxModeButtonChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myButtonGroup) { return; }
        this.myButtonGroup.mode('checkbox');
    };

    groupOnBtnClick(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myLog) { return; }
        let clickedButton = event.args.button;
        this.myLog.nativeElement.innerHTML = `Clicked: ${clickedButton[0].id}`;
    }
}
