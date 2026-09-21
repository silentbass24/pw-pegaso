import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxResponsivePanelModule, jqxResponsivePanelComponent } from 'jqwidgets-ng/jqxresponsivepanel';
import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';

@Component({
    selector: 'app-root',
    imports: [jqxResponsivePanelModule, jqxButtonModule, jqxTreeModule, jqxPanelModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    @ViewChild('myResponsivePanel') myResponsivePanel: jqxResponsivePanelComponent;

    responsivePanelOnCollapse(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myResponsivePanel) { return; }
        if (event.args.element)
            return;
        this.myResponsivePanel.elementRef.nativeElement.firstChild.style.display = 'block';
    }
}