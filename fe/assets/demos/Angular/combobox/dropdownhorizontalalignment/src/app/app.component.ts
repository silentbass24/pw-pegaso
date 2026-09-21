import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { jqxComboBoxModule, jqxComboBoxComponent } from 'jqwidgets-ng/jqxcombobox';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';

@Component({
    selector: 'app-root',
    imports: [jqxComboBoxModule, jqxRadioButtonModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('myComboBox') myComboBox: jqxComboBoxComponent;

    source: any =
        {
            datatype: 'json',
            datafields: [
                { name: 'CompanyName' },
                { name: 'ContactName' }
            ],
            id: 'id',
            url: '../assets/customers.txt',
            async: false
        };

    dataAdapter: any = new jqx.dataAdapter(this.source);

    leftBtnOnChecked(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myComboBox) { return; }
        this.myComboBox.dropDownHorizontalAlignment('left');
    }

    count = 0; //Stops the Overwrite of the animation type on initialization
    rightBtnOnChecked(): void {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myComboBox) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.myComboBox) { return; }
        if (this.count === 1)
            this.myComboBox.dropDownHorizontalAlignment('right');
        this.count = 1;
    }
}
