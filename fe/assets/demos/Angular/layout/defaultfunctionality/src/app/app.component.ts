import { Component, ViewEncapsulation, Output } from '@angular/core';

import { jqxLayoutModule, jqxLayoutComponent } from 'jqwidgets-ng/jqxlayout';
import 'jqwidgets-ng/jqwidgets/modules/jqxtree.js';
@Component({
    selector: 'app-root',
    imports: [jqxLayoutModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {

    getWidth(): any {
        if (document.body.offsetWidth < 800) {
            return '90%';
        }

        return 800;
    }

    source: any[] =
        [{
            icon: 'assets/img/earth.png',
            label: 'Project',
            expanded: true,
            items: [{
                icon: 'assets/img/folder.png',
                label: 'css',
                expanded: true,
                items: [{
                    icon: 'assets/img/nav1.png',
                    label: 'jqx.base.css'
                }, {
                    icon: 'assets/img/nav1.png',
                    label: 'jqx.energyblue.css'
                }, {
                    icon: 'assets/img/nav1.png',
                    label: 'jqx.orange.css'
                }]
            }, {
                icon: 'assets/img/folder.png',
                label: 'scripts',
                items: [{
                    icon: 'assets/img/nav1.png',
                    label: 'jqxcore.js'
                }, {
                    icon: 'assets/img/nav1.png',
                    label: 'jqxdata.js'
                }, {
                    icon: 'assets/img/nav1.png',
                    label: 'jqxlayout.js'
                }]
            }, {
                icon: 'assets/img/nav1.png',
                label: 'index.htm'
            }]
        }];

    layout: any[] =
        [{
            type: 'layoutGroup',
            orientation: 'horizontal',
            items: [{
                type: 'autoHideGroup',
                alignment: 'left',
                width: 80,
                unpinnedWidth: 200,
                items: [{
                    type: 'layoutPanel',
                    title: 'Toolbox',
                    contentContainer: 'ToolboxPanel'
                }, {
                    type: 'layoutPanel',
                    title: 'Help',
                    contentContainer: 'HelpPanel'
                }]
            }, {
                type: 'layoutGroup',
                orientation: 'vertical',
                width: 254,
                items: [{
                    type: 'documentGroup',
                    height: 400,
                    minHeight: 200,
                    items: [{
                        type: 'documentPanel',
                        title: 'Document 1',
                        contentContainer: 'Document1Panel'
                    }, {
                        type: 'documentPanel',
                        title: 'Document 2',
                        contentContainer: 'Document2Panel'
                    }]
                }, {
                    type: 'tabbedGroup',
                    height: 200,
                    pinnedHeight: 30,
                    items: [{
                        type: 'layoutPanel',
                        title: 'Error List',
                        contentContainer: 'ErrorListPanel'
                    }, {
                        type: 'layoutPanel',
                        title: 'Output',
                        contentContainer: 'OutputPanel',
                        selected: true
                    }]
                }]
            }, {
                type: 'tabbedGroup',
                width: 150,
                minWidth: 150,
                items: [{
                    type: 'layoutPanel',
                    title: 'Solution Explorer',
                    contentContainer: 'SolutionExplorerPanel',
                    initContent: () => {
                        jqwidgets.createInstance('#treeContainer', 'jqxTree', { theme: 'material', source: this.source, height: '99%', width: '100%' })
                    }
                },
                {
                    type: 'layoutPanel',
                    title: 'Properties',
                    contentContainer: 'PropertiesPanel'
                }]
            }]
        }];
}