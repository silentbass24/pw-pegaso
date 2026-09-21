import * as React from 'react';
import { useRef, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import './App.css';

import JqxKanban, { IKanbanProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxkanban';
import JqxTextArea from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtextarea';

// React 19 removed ReactDOM.render. One root is kept per container element,
// because these renderers run again every time the widget redraws, and the
// render is flushed synchronously: the jQWidgets renderer that calls this looks
// the element up immediately afterwards, which the asynchronous createRoot
// render would not have produced yet.
const reactRoots = new WeakMap<Element, Root>();
const renderInto = (element: React.ReactElement, container: Element | null, attempt: number = 0): void => {
    if (!container) { return; }
    // The widget looks its own element up in the document once it mounts, so the
    // container has to be attached first - a panel's initContent and a cell
    // renderer both hand us an element that is still detached.
    if (!document.contains(container)) {
        if (attempt < 10) { requestAnimationFrame(() => renderInto(element, container, attempt + 1)); }
        return;
    }
    let root = reactRoots.get(container);
    if (!root) { root = createRoot(container); reactRoots.set(container, root); }
    flushSync(() => root!.render(element));
};
const unmountFrom = (container: Element | null): void => {
    if (!container) { return; }
    const root = reactRoots.get(container);
    if (root) { root.unmount(); reactRoots.delete(container); }
};

const App = () => {
    const onItemAttrClicked = useCallback((event: any): void => {
        const args = event.args;
        if (args.attribute === 'template') {
            myKanban.current!.removeItem(args.item.id);
        }
    }, []);

    const onColumnAttrClicked = useCallback((event: any): void => {
        const args = event.args;
        if (args.attribute === 'button') {
            args.cancelToggle = true;
            if (!args.column.collapsed) {
                const colors = ['#f19b60', '#5dc3f0', '#6bbd49', '#dddddd'];
                myKanban.current!.addItem({
                    color: colors[Math.floor(Math.random() * 4)],
                    resourceId: Math.floor(Math.random() * 4),
                    status: args.column.dataField,
                    tags: 'new task',
                    text: '<input placeholder="(No Title)" style="width: 96%; margin-top:2px; border-radius: 3px;' +
                        'border-color: #ddd; line-height:20px; height: 20px;" class="jqx-input" id="newItem' + itemIndex + '" value= "" />'
                });

                const id = `newItem${itemIndex}`;
                const myInput = document.getElementById(id);

                if (myInput !== null && myInput !== undefined) {
                    myInput.addEventListener('mousedown', (eventEl: any): void => {
                        eventEl.stopPropagation();
                    });

                    myInput.addEventListener('mouseup', (eventEl: any): void => {
                        eventEl.stopPropagation();
                    });

                    myInput.addEventListener('keydown', (eventEl: any): void => {
                        if (eventEl.keyCode === 13) {
                            const valueElement = `<span>${eventEl.target.value}</span>`;
                            eventEl.target.insertAdjacentHTML('beforebegin', valueElement);
                            eventEl.target.remove();
                        }
                    });

                    myInput.focus();
                }
                itemIndex++;
            }
        }
    }, []);

    const theme = jqx.theme;
    const myKanban = useRef<JqxKanban>(null);
    const itemIndex: number = 0;
    const myTextArea = useRef<JqxTextArea>(null);

        const fields: any[] = [
            { name: 'id', type: 'string' },
            { name: 'status', map: 'state', type: 'string' },
            { name: 'text', map: 'label', type: 'string' },
            { name: 'tags', type: 'string' },
            { name: 'color', map: 'hex', type: 'string' },
            { name: 'resourceId', type: 'number' }
        ];

        const sourceData = {
            dataFields: fields,
            dataType: 'array',
            localData: [
                { id: '1161', state: 'new', label: 'Combine Orders', tags: 'orders, combine', hex: '#5dc3f0', resourceId: 3 },
                { id: '1645', state: 'work', label: 'Change Billing Address', tags: 'billing', hex: '#f19b60', resourceId: 1 },
                { id: '9213', state: 'new', label: 'One item added to the cart', tags: 'cart', hex: '#5dc3f0', resourceId: 3 },
                { id: '6546', state: 'done', label: 'Edit Item Price', tags: 'price, edit', hex: '#5dc3f0', resourceId: 4 },
                { id: '9034', state: 'new', label: 'Login 404 issue', tags: 'issue, login', hex: '#6bbd49' }
            ]
        };

        const resourcesAdapterFunc = (): any => {
            const resourcesSource = {
                dataFields: [
                    { name: 'id', type: 'number' },
                    { name: 'name', type: 'string' },
                    { name: 'image', type: 'string' },
                    { name: 'common', type: 'boolean' }
                ],
                dataType: 'array',
                localData: [
                    { id: 0, name: 'No name', image: '/img/andrew.png', common: true },
                    { id: 1, name: 'Andrew Fuller', image: '/img/andrew.png' },
                    { id: 2, name: 'Janet Leverling', image: '/img/janet.png' },
                    { id: 3, name: 'Steven Buchanan', image: '/img/steven.png' },
                    { id: 4, name: 'Nancy Davolio', image: '/img/nancy.png' },
                    { id: 5, name: 'Michael Buchanan', image: '/img/Michael.png' },
                    { id: 6, name: 'Margaret Buchanan', image: '/img/margaret.png' },
                    { id: 7, name: 'Robert Buchanan', image: '/img/robert.png' },
                    { id: 8, name: 'Laura Buchanan', image: '/img/Laura.png' },
                    { id: 9, name: 'Laura Buchanan', image: '/img/Anne.png' }
                ]
            };
            const resourcesDataAdapter = new jqx.dataAdapter(resourcesSource);
            return resourcesDataAdapter;
        };

        const getIconClassName = (): string => {
            switch (theme) {
                case 'darkblue':
                case 'black':
                case 'shinyblack':
                case 'ui-le-frog':
                case 'metrodark':
                case 'orange':
                case 'darkblue':
                case 'highcontrast':
                case 'ui-sunny':
                case 'ui-darkness':
                    return 'jqx-icon-plus-alt-white ';
            }
            return 'jqx-icon-plus-alt';
        };

        const template: string =
            '<div class="jqx-kanban-item" id="">'
            + '<div class="jqx-kanban-item-color-status"></div>'
            + '<div style="display: none;" class="jqx-kanban-item-avatar"></div>'
            + '<div class="jqx-icon jqx-icon-close jqx-kanban-item-template-content jqx-kanban-template-icon"></div>'
            + '<div class="jqx-kanban-item-text"></div>'
            + '<div style="display: none;" class="jqx-kanban-item-footer"></div>'
            + '</div>';

        const columnRenderer = (element: any, collapsedElement: any, column: any): void => {
            if (element[0]) {
                const elementHeaderStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
                const collapsedElementHeaderStatus = collapsedElement[0].getElementsByClassName('jqx-kanban-column-header-status')[0];

                setTimeout(() => {
                    const columnItems = myKanban.current!.getColumnItems(column.dataField).length;

                    elementHeaderStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                    collapsedElementHeaderStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                }, 100);
            }
        };

        const itemRenderer = (element: any, item: any, resource: any): void => {
            element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<span style="line-height: 23px; margin-left: 5px;">' + resource.name + '</span>';

            const container = element[0].getElementsByClassName('jqx-kanban-item-text')[0];

            element[0].addEventListener('dblclick', (event: any): void => {
                const domToNull = document.getElementsByClassName('jqx-kanban-item-text');

                Array.prototype.forEach.call(domToNull, (domToNullItem: any) => {
                    if (domToNullItem.children.length !== 0) {
                        const textArea = domToNullItem.getElementsByTagName('textarea')[0];
                        if (textArea) {
                            domToNullItem.innerHTML = textArea.value;
                        }
                    }
                });

                const currentText = container.innerHTML;

                const onKeyDownHandler = (eventEl: any) => {
                    if (eventEl.keyCode === 13) {

                        const textArea = document.getElementsByTagName('textarea')[0];

                        if (myTextArea) {
                            unmountFrom(container);
                            container.innerHTML = textArea.value;
                        }
                    }
                };

                renderInto(
                    <div onKeyDown={onKeyDownHandler}>
                        <JqxTextArea theme={'material-purple'} ref={myTextArea} style={{ border: 'none' }}
                            width={'100%'} height={35} />
                    </div>,
                    container
                );

                myTextArea.current!.val(currentText);
                myTextArea.current!.focus();
                itemIndex++;
            });
        };

    const columns = [
                { text: 'Backlog', iconClassName: getIconClassName(), dataField: 'new' },
                { text: 'In Progress', iconClassName: getIconClassName(), dataField: 'work' },
                { text: 'Done', iconClassName: getIconClassName(), dataField: 'done' }
            ];
    const resources = resourcesAdapterFunc();
    const source = new jqx.dataAdapter(sourceData);

    return (
        <JqxKanban theme={'material-purple'} ref={myKanban}
            onItemAttrClicked={onItemAttrClicked} onColumnAttrClicked={onColumnAttrClicked}
            // @ts-ignore
            width={'100%'} template={template} source={source} columns={columns}
            resources={resources} itemRenderer={itemRenderer} height={600} />
    );
};

export default App;
