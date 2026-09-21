import * as React from 'react';
import JqxKanban, { IKanbanProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxkanban';

const App = () => {
    const columns = React.useMemo(() => [
        { text: 'Backlog', dataField: 'new' },
        { text: 'In Progress', dataField: 'work' },
        { text: 'Done', dataField: 'done' },
    ], []);

    const resources = React.useMemo(() => {
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
        return new jqx.dataAdapter(resourcesSource);
    }, []);

    const source = React.useMemo(() => {
        const fields: any[] = [
            { name: 'id', type: 'string' },
            { name: 'status', map: 'state', type: 'string' },
            { name: 'text', map: 'label', type: 'string' },
            { name: 'tags', type: 'string' },
            { name: 'color', map: 'hex', type: 'string' },
            { name: 'resourceId', type: 'number' }
        ];

        return new jqx.dataAdapter({
            dataFields: fields,
            dataType: 'array',
            localData: [
                { id: '1161', state: 'new', label: 'Combine Orders', tags: 'orders, combine', hex: '#5dc3f0', resourceId: 3 },
                { id: '1645', state: 'work', label: 'Change Billing Address', tags: 'billing', hex: '#f19b60', resourceId: 1 },
                { id: '9213', state: 'new', label: 'One item added to the cart', tags: 'cart', hex: '#5dc3f0', resourceId: 3 },
                { id: '6546', state: 'done', label: 'Edit Item Price', tags: 'price, edit', hex: '#5dc3f0', resourceId: 4 },
                { id: '9034', state: 'new', label: 'Login 404 issue', tags: 'issue, login', hex: '#6bbd49' }
            ]
        });
    }, []);

    return (
        <JqxKanban
            theme="material-purple"
            // @ts-ignore
            width="100%"
            source={source}
            columns={columns}
            resources={resources}
            rtl={true}
        />
    );
};

export default App;