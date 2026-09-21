import { Component, ViewChild, ElementRef } from '@angular/core';

import { jqxSplitterModule, jqxSplitterComponent } from 'jqwidgets-ng/jqxsplitter';
import { jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
@Component({
    selector: 'app-root',
    imports: [jqxSplitterModule, jqxTabsModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('splitter1', { static: true }) splitter1: ElementRef;
    @ViewChild('splitter2', { static: true }) splitter2: ElementRef;

    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }

        return 850;
    }

    initTabContent = (tab: number): void => {
        if (tab == 0) {
            let jqxSplitter1: jqwidgets.jqxSplitter = jqwidgets.createInstance(this.splitter1.nativeElement, 'jqxSplitter', {
                theme: 'material',
                height: '100%',
                width: '100%',
                panels: [{ size: '50%' }]
            });
        }
        else {
            let jqxSplitter2: jqwidgets.jqxSplitter = jqwidgets.createInstance(this.splitter2.nativeElement, 'jqxSplitter', {
                theme: 'material',
                orientation: 'horizontal',
                height: '100%',
                width: '100%',
                panels: [{ size: '50%' }]
            });
        }
    }
}