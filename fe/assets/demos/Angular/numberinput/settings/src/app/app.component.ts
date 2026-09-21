import { Component, ViewChild } from '@angular/core';

import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';

import { jqxNumberInputModule, jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
@Component({
    selector: 'app-root',
    imports: [jqxNumberInputModule, jqxCheckBoxModule, jqxRadioButtonModule, jqxDropDownListModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('numericInput') numericInput: jqxNumberInputComponent;

    symboltypes: string[] = ['$', '%', 'None'];
    decimaldigitsNumbers: string[] = ['0', '1', '2', '3', '4'];
    digitsNumbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

    change(event) {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.numericInput) { return; }
        let checked = event.args.checked;
        this.numericInput.spinButtons(checked);
    };

    checkedLeftbutton(event) {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.numericInput) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.numericInput) { return; }
        this.numericInput.symbolPosition('left');
    };

    checkedRightbutton(event) {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.numericInput) { return; }
        this.numericInput.symbolPosition('right');
    };

    symboltypeSelect(event) {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.numericInput) { return; }
        let index = event.args.index;
        if (index == 2) {
            this.numericInput.symbol('');
        }
        else {
            let symbol = this.symboltypes[index];
            this.numericInput.symbol(symbol);
        }
    };

    decimaldigitsSelect(event) {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.numericInput) { return; }
        let index = event.args.index;
        this.numericInput.decimalDigits(this.decimaldigitsNumbers[index]);
    };

    digitsSelect(event) {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.numericInput) { return; }
        let index = event.args.index;
        this.numericInput.digits(this.digitsNumbers[index]);
    };
}