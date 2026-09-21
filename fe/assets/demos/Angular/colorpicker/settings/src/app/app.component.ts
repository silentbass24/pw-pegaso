import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

import { jqxDropDownButtonModule, jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton';
import { jqxColorPickerModule, jqxColorPickerComponent } from 'jqwidgets-ng/jqxcolorpicker';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';

@Component({
    selector: 'app-root',
    imports: [jqxDropDownButtonModule, jqxRadioButtonModule, jqxColorPickerModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('myColorPicker') myColorPicker: jqxColorPickerComponent;
    @ViewChild('colorLog') colorLog: ElementRef;

    colorChanged(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.colorLog) { return; }
        this.colorLog.nativeElement.innerHTML = `<div>Color: #${event.args.color.hex}</div>`;
    }

    hueModeChanged(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myColorPicker) { return; }
        if (event.args.checked) {
            this.myColorPicker.colorMode('hue');
        }
        else {
            this.myColorPicker.colorMode('saturation');
        }
    }
}
