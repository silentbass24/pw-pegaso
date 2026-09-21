import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';



import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxSplitterModule } from 'jqwidgets-ng/jqxsplitter';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxSplitterModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild('myTree') myTree: jqxTreeComponent;
    @ViewChild('ContentPanel') ContentPanel: ElementRef;

    getWidth(): any {
        if (document.body.offsetWidth < 650) {
            return '90%';
        }

        return 650;
    }


    ngAfterViewInit() {
        this.myTree.elementRef.nativeElement.firstChild.style.border = 'none';
    }

    select(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.ContentPanel) { return; }
        this.ContentPanel.nativeElement.innerHTML = "<div style='margin: 10px;'>" + event.args.element.id + "</div>";
    }
}