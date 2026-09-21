import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxDockingModule, jqxDockingComponent } from 'jqwidgets-ng/jqxdocking';
import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxSliderModule } from 'jqwidgets-ng/jqxslider';

@Component({
    selector: 'app-root',
    imports: [jqxDockingModule, jqxButtonModule, jqxCheckBoxModule, jqxSliderModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild('myDocking') myDocking: jqxDockingComponent;
    @ViewChild('collapseButtonsCheckbox') collapseButtonsCheckbox: jqxCheckBoxComponent;
    @ViewChild('closeButtonsCheckbox') closeButtonsCheckbox: jqxCheckBoxComponent;

    getWidth(): any {
        if (document.body.offsetWidth < 800) {
            return '90%';
        }

        return 800;
    }

    ngAfterViewInit(): void {
        this.myDocking.setWindowPosition('window0', 100, 100);
        this.myDocking.pinWindow('window1');
        this.myDocking.hideAllCloseButtons();
        this.myDocking.showAllCollapseButtons();
    }

    collapseButtonsCheckboxOnChange(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDocking || !this.collapseButtonsCheckbox) { return; }
        let checked = this.collapseButtonsCheckbox.checked();
        if (checked) {
            this.myDocking.showAllCollapseButtons();
        } else {
            this.myDocking.hideAllCollapseButtons();
        }
    };

    closeButtonsCheckboxOnChange(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDocking || !this.closeButtonsCheckbox) { return; }
        let checked = this.closeButtonsCheckbox.checked();
        if (checked) {
            this.myDocking.showAllCloseButtons();
        } else {
            this.myDocking.hideAllCloseButtons();
        }
    };

    disabledCheckboxOnChange(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDocking) { return; }
        let disabled = this.myDocking.disabled();
        if (disabled) {
            this.myDocking.enable();
        } else {
            this.myDocking.disable();
        }
    };


    moveButtonOnClick(): void {
        this.myDocking.move('window3', 0, 1);
    };

    collapseButtonOnClick(): void {
        this.myDocking.collapseWindow('window1');
    };

    expandButtonOnClick(): void {
        this.myDocking.expandWindow('window1');
    };

    mySliderOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myDocking) { return; }
        this.myDocking.windowsOffset(event.args.value);
    };
}
