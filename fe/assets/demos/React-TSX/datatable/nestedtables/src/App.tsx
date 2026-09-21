import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JqxDataTable, { IDataTableProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable';

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
    const myDataTable = React.useRef<JqxDataTable>(null);
    const countRef = React.useRef<number>(0);
    const nestedTablesRef = React.useRef<any[]>([]);

    const source = React.useMemo(() => ({
        dataFields: [
            { name: 'FirstName', type: 'string' },
            { name: 'LastName', type: 'string' },
            { name: 'Title', type: 'string' },
            { name: 'Address', type: 'string' },
            { name: 'City', type: 'string' }
        ],
        dataType: 'xml',
        id: 'EmployeeID',
        record: 'Employee',
        root: 'Employees',
        url: 'employees.xml'
    }), []);

    const ordersSource = React.useMemo(() => ({
        dataFields: [
            { name: 'EmployeeID', type: 'string' },
            { name: 'ShipName', type: 'string' },
            { name: 'ShipAddress', type: 'string' },
            { name: 'ShipCity', type: 'string' },
            { name: 'ShipCountry', type: 'string' },
            { name: 'ShippedDate', type: 'date' }
        ],
        dataType: 'xml',
        record: 'Order',
        root: 'Orders',
        url: 'orderdetails.xml'
    }), []);

    const ordersDataAdapter = React.useMemo(() => new jqx.dataAdapter(ordersSource, { autoBind: true }), [ordersSource]);

    const initRowDetails = React.useCallback((id: any, row: number, element: any, rowinfo: any): void => {
        const container = document.createElement('div');
        container.style.margin = '10px';
        element[0].appendChild(container);

        const nestedDataTable = element[0].children[0];
        const containerID = `nestedDataTable${countRef.current}`;
        nestedDataTable.id = containerID;

        const filterGroup = new jqx.filter();
        const filterValue = id;
        const filterCondition = 'equal';
        const filter = filterGroup.createfilter('stringfilter', filterValue, filterCondition);

        const orders: any[] = ordersDataAdapter.records;
        const ordersbyid = [];
        for (const order of orders) {
            const result = filter.evaluate(order.EmployeeID);
            if (result) {
                ordersbyid.push(order);
            }
        }
        const nestedOrdersSource = {
            dataFields: [
                { name: 'EmployeeID', type: 'string' },
                { name: 'ShipName', type: 'string' },
                { name: 'ShipAddress', type: 'string' },
                { name: 'ShipCity', type: 'string' },
                { name: 'ShipCountry', type: 'string' },
                { name: 'ShippedDate', type: 'date' }
            ],
            id: 'OrderID',
            localdata: ordersbyid
        }
        if (nestedDataTable !== null) {
            const nestedDataTableAdapter = new jqx.dataAdapter(nestedOrdersSource);

            const columns: IDataTableProps['columns'] = [
                { text: 'Ship Name', dataField: 'ShipName', width: 200 },
                { text: 'Ship Address', dataField: 'ShipAddress', width: 200 },
                { text: 'Ship City', dataField: 'ShipCity', width: 150 },
                { text: 'Ship Country', dataField: 'ShipCountry', width: 150 },
                { text: 'Shipped Date', dataField: 'ShippedDate', cellsFormat: 'd', width: 200 }
            ];

            renderInto(
                <JqxDataTable theme={'material-purple'} width={820} height={180} columns={columns}
                    pageable={true} source={nestedDataTableAdapter} />,
                document.querySelector(`#${containerID}`)
            );

            nestedTablesRef.current[id] = nestedDataTable;
            countRef.current++;
        }
    }, [ordersDataAdapter]);

    const ready = React.useCallback((): void => {
        myDataTable.current?.showDetails(1);
    }, []);

    const columns: IDataTableProps['columns'] = React.useMemo(() => [
        { text: 'First Name', dataField: 'FirstName', width: 250 },
        { text: 'Last Name', dataField: 'LastName', width: 250 },
        { text: 'Title', dataField: 'Title' }
    ], []);

    return (
        <JqxDataTable
            theme={'material-purple'}
            ref={myDataTable}
            width={'100%'}
            source={source}
            columns={columns}
            pageable={true}
            rowDetails={true}
            pageSize={3}
            initRowDetails={initRowDetails}
            ready={ready}
        />
    );
};

export default App;