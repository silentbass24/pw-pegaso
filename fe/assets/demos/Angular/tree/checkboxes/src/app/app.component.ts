import { Component, ViewChild } from '@angular/core';



import { jqxTreeModule, jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
@Component({
    selector: 'app-root',
    imports: [jqxTreeModule, jqxCheckBoxModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myTree') myTree: jqxTreeComponent;

    myTreeOnInitialized(): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree) { return; }
        this.myTree.selectItem(document.getElementById('home'));
        let solutionsItem = document.getElementById('solutions');
        this.myTree.expandItem(solutionsItem);
        this.myTree.checkItem(solutionsItem, true);
        this.myTree.uncheckItem(document.getElementById('manufacturing'));
    }

    myCheckBoxOnChange(event: any): void {
        // the widget raises this while initialising, before @ViewChild is populated
        if (!this.myTree) { return; }
        let checked = event.args.checked;
        this.myTree.hasThreeStates(checked);
    };
}