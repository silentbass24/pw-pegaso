import { Component, ViewChild, ViewEncapsulation } from '@angular/core';


import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';
import { jqxRibbonModule, jqxRibbonComponent } from 'jqwidgets-ng/jqxribbon';

@Component({
    selector: 'app-root',
    imports: [jqxRibbonModule, jqxRadioButtonModule],
    standalone: true,
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('jqxRibbon') jqxRibbon: jqxRibbonComponent;

    checkedNear(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.jqxRibbon) { return; }
        this.jqxRibbon.scrollPosition('near');
    }

    checkedFar(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.jqxRibbon) { return; }
        this.jqxRibbon.scrollPosition('far');
    }

    checkedBoth(event: any): void {
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.jqxRibbon) { return; }
        // jqxRadioButton fires onChecked as it initialises, before @ViewChild is set
        if (!this.jqxRibbon) { return; }
        this.jqxRibbon.scrollPosition('both');
    }
}