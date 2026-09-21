import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';

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

function App() {
    const counterRef = React.useRef(1);

    const source = React.useMemo(() => ({
        datafields: [
            { name: 'ShippedDate', map: 'm\\:properties>d\\:ShippedDate', type: 'date' },
            { name: 'Freight', map: 'm\\:properties>d\\:Freight', type: 'float' },
            { name: 'ShipName', map: 'm\\:properties>d\\:ShipName', type: 'string' },
            { name: 'ShipAddress', map: 'm\\:properties>d\\:ShipAddress', type: 'string' },
            { name: 'ShipCity', map: 'm\\:properties>d\\:ShipCity', type: 'string' },
            { name: 'ShipCountry', map: 'm\\:properties>d\\:ShipCountry', type: 'string' }
        ],
        datatype: 'xml',
        id: 'm\\:properties>d\\:OrderID',
        record: 'content',
        root: 'entry',
        sortcolumn: 'ShipName',
        sortdirection: 'asc',
        url: 'orders.xml'
    }), []);

    const tooltiprenderer = React.useCallback((element: any) => {
        const id = `toolTipContainer${counterRef.current}`;
        element[0].id = id;
        const content = element[0].innerText;
        setTimeout(() => {
            renderInto(<JqxTooltip position={'mouse'} content={content}>{content}</JqxTooltip>, document.getElementById(id));
        });
        counterRef.current++;
    }, []);

    const columns = React.useMemo(() => [
        { text: 'Ship Name', datafield: 'ShipName', width: 250, rendered: tooltiprenderer },
        { text: 'Shipped Date', datafield: 'ShippedDate', width: 100, cellsformat: 'yyyy-MM-dd', rendered: tooltiprenderer },
        { text: 'Freight', datafield: 'Freight', width: 80, cellsformat: 'f2', cellsalign: 'right', rendered: tooltiprenderer },
        { text: 'Ship Address', datafield: 'ShipAddress', width: 350, rendered: tooltiprenderer },
        { text: 'Ship City', datafield: 'ShipCity', width: 100, rendered: tooltiprenderer },
        { text: 'Ship Country', datafield: 'ShipCountry', width: 101, rendered: tooltiprenderer }
    ], [tooltiprenderer]);

    const dataAdapter = React.useMemo(() => new jqx.dataAdapter(source), [source]);

    return (
        <JqxGrid
            theme={'material-purple'}
            width={'100%'}
            height={450}
            source={dataAdapter}
            columns={columns}
            altrows={true}
            sortable={true}
        />
    );
}

export default App;