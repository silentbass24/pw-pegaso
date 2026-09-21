import React, { useMemo } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';
import JqxTreeMap, { ITreeMapProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreemap';

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
    const { colorRanges, renderCallbacks, source } = useMemo(() => {
        const colorRanges = [
            { min: 0.02, max: 0.03, color: '#ff0300' },
            { min: 0.03, max: 0.04, color: '#fe2e00' },
            { min: 0.04, max: 0.05, color: '#fe3900' },
            { min: 0.05, max: 0.06, color: '#ff5400' },
            { min: 0.06, max: 0.07, color: '#fe7500' },
            { min: 0.07, max: 0.08, color: '#fe8200' },
            { min: 0.08, max: 0.09, color: '#ffed00' },
            { min: 0.09, max: 0.1, color: '#b8db00' },
            { min: 0.1, max: 0.11, color: '#7fbf00' },
            { min: 0.11, max: 0.12, color: '#50a600' },
            { min: 0.12, max: 0.15, color: '#008000' }
        ];
        const renderCallbacks = {
            '*': (elementObject: HTMLDivElement, value: any): void => {
                const element = (elementObject as any)[0];
                let content = '<div><div style="font-weight: bold; font-family: verdana; font-size: 13px;">Year: ' + value.record.Year + '</div>';
                content += '<div style=" font-family: verdana; font-size: 12px;">HPI: ' + value.record.HPI + '</div>';
                content += '<div style=" font-family: verdana; font-size: 12px;">Build Cost: ' + value.record.BuildCost + '</div>';
                content += '<div style=" font-family: verdana; font-size: 12px;">Population: ' + value.record.Population + '</div>';
                content += '<div style=" font-family: verdana; font-size: 12px;">Interest Rate: ' + value.record.Rate + '</div>';
                content += '</div>';
                const tooltip = (
                    <JqxTooltip theme="material-purple" content={content} position="mouse">
                        <div />
                    </JqxTooltip>
                );
                renderInto(tooltip, element);
            }
        };
        const source: any = {
            dataFields: [
                { name: 'Year' },
                { name: 'HPI' },
                { name: 'BuildCost' },
                { name: 'Population' },
                { name: 'Rate' }
            ],
            dataType: 'tab',
            url: 'homeprices.txt'
        };
        const dataAdapter: any = new jqx.dataAdapter(source, {
            async: false,
            autoBind: true,
            loadError: (xhr: any, status: any, error: any) => {
                alert('Error loading "' + source.url + '" : ' + error);
            }
        });
        return { colorRanges, renderCallbacks, source: dataAdapter };
    }, []);

    return (
        <JqxTreeMap
            theme="material-purple"
            width="100%"
            height={500}
            source={source}
            displayMember="Year"
            valueMember="Rate"
            colorMode="rangeColors"
            colorRanges={colorRanges}
            renderCallbacks={renderCallbacks}
            legendLabel="Interest Rate"
        />
    );
};

export default App;