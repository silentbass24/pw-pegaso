import React, { useRef, useState, useCallback } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxTreeGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';

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
    const myTreeGrid = useRef<JqxTreeGrid>(null);
    const input = useRef<JqxInput>(null);
    const inputs = useRef<any[]>([]);
    const inputsRefs = useRef<any>({});
    const references = useRef<any[]>([]);

    const data: any[] = [
        { "property": "Name", "type": "string", "value": "jqxTreeGrid" },
        {
            "children": [
                { "property": "X", "value": "0", "type": "number" },
                { "property": "Y", "value": "0", "type": "number" }
            ],
            "property": "Location",
            "type": "string", "value": "0, 0"
        },
        {
            "children": [
                { "property": "Width", "value": "200", "type": "number" },
                { "property": "Height", "value": "200", "type": "number" }
            ],
            "property": "Size", "type": "string", "value": "200, 200"
        },
        { "property": "Background", "type": "color", "value": "#4621BC" },
        { "property": "Color", "type": "color", "value": "#B1B11B" },
        { "property": "Alignment", "type": "align", "value": "Left" },
        { "property": "Enabled", "type": "bool", "value": "true" }
    ];

    const source: any = {
        dataFields: [
            { name: 'property', type: 'string' },
            { name: 'value', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'children', type: 'array' }
        ],
        dataType: 'json',
        hierarchy:
        {
            root: 'children'
        },
        localData: data
    };

    const dataAdapter: any = new jqx.dataAdapter(source);

    const columns = [
        { editable: false, dataField: 'property', text: 'Property Name', width: 200 },
        {
            columnType: 'custom',
            createEditor: (rowKey: any, cellvalue: any, editor: any, cellText: any, width: any, height: any): void => {
                const row = myTreeGrid.current!.getRow(rowKey);
                const type = row.type;
                switch (type) {
                    case 'string':
                    case 'number': {
                        const inputDom = document.createElement('div');
                        inputDom.style.cssText = 'overflow: hidden; position: relative; height: 100%; width: 100%;';
                        editor[0].appendChild(inputDom);
                        const inputComponent = <JqxInput theme={'material-purple'} ref={input} key={rowKey} width={'100%'} height={'100%'} source={['Item 1', 'Item 2', 'Item 3', 'Item 4']} />;
                        const inputReference = renderInto(inputComponent, inputDom);
                        const inputObject: any = {};
                        inputObject[rowKey] = inputReference;
                        inputs.current.push(inputObject);
                        inputsRefs.current[rowKey] = inputReference;
                        break;
                    }
                    case 'align':
                        break;
                    case 'color':
                        break;
                    case 'bool':
                        break;
                }
            },
            dataField: 'value',
            getEditorValue: (rowKey: any, cellvalue: any, editor: any): any => {
                const row = myTreeGrid.current!.getRow(rowKey);
                const item = inputsRefs.current[rowKey];
                switch (row.type) {
                    case 'string':
                    case 'number':
                    case 'align':
                    case 'color':
                    case 'bool':
                        break;
                }
                return '';
            },
            initEditor: (rowKey: any, cellvalue: any, editor: any, cellText: any, width: any, height: any) => {
                const row = myTreeGrid.current!.getRow(rowKey);
            },
            text: 'Value',
            width: 230,
        }
    ];

    const [treeGridSource] = useState<any>(dataAdapter);

    const setRef = useCallback((ref: any) => {
        references.current.push(ref);
        ref = React.createRef<JqxInput>();
        return ref;
    }, []);

    const cellValueChanged = useCallback((event: any) => {
    }, []);

    const click = useCallback((event: any) => {
        if (input.current) {
            console.log(input.current, input.current!.val());
        }
    }, []);

    return (
        <div>
            <JqxButton theme={'material-purple'} onClick={click}>Check</JqxButton>
            <JqxTreeGrid
                theme={'material-purple'}
                ref={myTreeGrid}
                onCellValueChanged={cellValueChanged}
                source={treeGridSource}
                altRows={true}
                autoRowHeight={true}
                editable={true}
                columns={columns}
            />
        </div>
    );
}

export default App;