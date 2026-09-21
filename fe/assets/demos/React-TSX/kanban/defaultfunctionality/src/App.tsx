import * as React from 'react';
import { useRef } from 'react';

import './App.css';

import JqxKanban, { IKanbanProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxkanban';
import JqxSplitter, { ISplitterProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxsplitter';

const App = () => {
    const myKanbanOne = useRef<JqxKanban>(null);
    const myKanbanTwo = useRef<JqxKanban>(null);
    const myKanbanThree = useRef<JqxKanban>(null);

        const fields: any[] = [
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
                { state: 'new', label: 'Combine Orders', tags: 'orders, combine', hex: '#5dc3f0', resourceId: 3 },
                { state: 'new', label: 'Change Billing Address', tags: 'billing', hex: '#f19b60', resourceId: 1 },
                { state: 'new', label: 'One item added to the cart', tags: 'cart', hex: '#5dc3f0', resourceId: 3 },
                { state: 'new', label: 'Edit Item Price', tags: 'price, edit', hex: '#5dc3f0', resourceId: 4 },
                { state: 'new', label: 'Login 404 issue', tags: 'issue, login', hex: '#6bbd49' }
            ]
        };

        const source2Data: any = {
            dataFields: fields,
            dataType: 'array',
            localData: [
                { state: 'ready', label: 'Logout issue', tags: 'logout, issue', hex: '#5dc3f0', resourceId: 7 },
                { state: 'ready', label: 'Remember password issue', tags: 'password, issue', hex: '#6bbd49', resourceId: 8 },
                { state: 'ready', label: 'Cart calculation issue', tags: 'cart, calculation', hex: '#f19b60', resourceId: 9 },
                { state: 'ready', label: 'Remove topic issue', tags: 'topic, issue', hex: '#6bbd49' }
            ]
        };

        const source3Data: any = {
            dataFields: fields,
            dataType: 'array',
            localData: [
                { state: 'done', label: 'Delete orders', tags: 'orders, combine', hex: '#f19b60', resourceId: 4 },
                { state: 'work', label: 'Add New Address', tags: 'address', hex: '#6bbd49', resourceId: 5 },
                { state: 'new', label: 'Rename items', tags: 'rename', hex: '#5dc3f0', resourceId: 6 },
                { state: 'work', label: 'Update cart', tags: 'cart, update', hex: '#6bbd49' }
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

        const columnRenderer = (element: any, collapsedElement: any, column: any): void => {
            if (element[0]) {
                const headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];

                setTimeout(() => {
                    const columnItems = myKanbanOne.current!.getColumnItems(column.dataField).length;
                    headerStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                }, 100);
            }
        };

        const columnRenderer2 = (element: any, collapsedElement: any, column: any): void => {
            if (element[0]) {
                const headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
                const collapsedHeaderStatus = collapsedElement[0].getElementsByClassName('jqx-kanban-column-header-status')[0];

                setTimeout(() => {
                    const columnItems = myKanbanTwo.current!.getColumnItems(column.dataField).length;
                    headerStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                    collapsedHeaderStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                }, 100);
            }
        };

        const columnRenderer3 = (element: any, collapsedElement: any, column: any): void => {
            if (element[0]) {
                const headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];

                setTimeout(() => {
                    const columnItems = myKanbanOne.current!.getColumnItems(column.dataField).length;
                    headerStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
                }, 100);
            }
        };

    const columns = [
                { text: 'Backlog', dataField: 'new', maxItems: 10 }
            ];
    const columns2 = [
                { text: 'Ready', dataField: 'ready', maxItems: 10 }
            ];
    const columns3 = [
                { text: 'Backlog', dataField: 'new', maxItems: 5 },
                { text: 'In Progress', dataField: 'work', maxItems: 5 },
                { text: 'Done', dataField: 'done', maxItems: 5 }
            ];
    const mainSplitterPanels = [{ size: 250, min: 100 }, { min: 250 }];
    const resources = resourcesAdapterFunc();
    const resources2 = resourcesAdapterFunc();
    const resources3 = resourcesAdapterFunc();
    const rightSplitterPanels = [{ min: 200, size: 350, collapsible: false }, { min: 200 }];
    const source = new jqx.dataAdapter(sourceData);
    const source2 = new jqx.dataAdapter(source2Data);
    const source3 = new jqx.dataAdapter(source3Data);

    return (
        <JqxSplitter theme={'material-purple'} width={850} height={600} panels={mainSplitterPanels}>
            <div>
                <JqxKanban theme={'material-purple'} className="kanban1" ref={myKanbanOne}
                    width={'100%'} height={'100%'} source={source}
                    columns={columns} connectWith={'.kanban2, .kanban3'}
                    resources={resources} columnRenderer={columnRenderer} />
            </div >
            <div>
                <JqxSplitter theme={'material-purple'} width={'100%'} height={'100%'}
                    orientation={'horizontal'} panels={rightSplitterPanels} >
                    <div>
                        <JqxKanban theme={'material-purple'} className="kanban2" ref={myKanbanTwo}
                            width={'100%'} height={'100%'} source={source2}
                            columns={columns2} connectWith={'.kanban1, .kanban3'}
                            resources={resources2} columnRenderer={columnRenderer2} />
                    </div>
                    <div>
                        <JqxKanban theme={'material-purple'} className="kanban3" ref={myKanbanThree}
                            width={'100%'} height={'100%'} source={source3}
                            columns={columns3} connectWith={'.kanban1, .kanban2'}
                            resources={resources3} columnRenderer={columnRenderer3} />
                    </div>
                </JqxSplitter>
            </div>
        </JqxSplitter>
    );
};

export default App;
