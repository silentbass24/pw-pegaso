import { Component, ViewChild } from '@angular/core';


import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';

import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxMenuModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myTree') myTree: jqxTreeComponent;
    @ViewChild('myMenu') myMenu: jqxMenuComponent;

    myTreeOnInitialized(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree || !this.myMenu) { return; }
        this.myTree.selectItem(document.getElementById('home'));
        this.myTree.expandItem(document.getElementById('solutions'));

        document.addEventListener('contextmenu', event => {
            event.preventDefault();
            if ((<Element>event.target).classList.contains('jqx-tree-item')) {
                this.myTree.selectItem((event.target as HTMLElement).parentNode);
                let scrollTop = window.scrollY;
                let scrollLeft = window.scrollX;
                this.myMenu.open(event.clientX + 5 + scrollLeft, event.clientY + 5 + scrollTop);
                return false;
            } else {
                this.myMenu.close();
            }
        });
    }

    myMenuOnItemClick(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree) { return; }
        let item = event.args.innerText;
        let selectedItem = null;
        switch (item) {
            case "Add Item":
                selectedItem = this.myTree.getSelectedItem();
                if (selectedItem != null) {
                    this.myTree.addTo({ label: 'Item' }, selectedItem.element);
                }
                break;
            case "Remove Item":
                selectedItem = this.myTree.getSelectedItem();
                if (selectedItem != null) {
                    this.myTree.removeItem(selectedItem.element);
                }
                break;
        }
    };
}