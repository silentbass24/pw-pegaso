import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxChart, { IChartProps, JQXLite } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
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
    const data = [
        { city: 'London', count: 24, monthlySales: 1128430, dailyTrend: [12, 8, 9, 3, 4, 5, 6, 2, 3, 4, 5, 6, 12, 4, 11, 4, 13, 9, 10, 12, 12, 8, 13, 7, 15, 9, 11, 12, 9, 8] },
        { city: 'New York', count: 35, monthlySales: 1434650, dailyTrend: [11, 7, 3, 8, 6, 2, 2, 4, 3, 8, 5, 11, 7, 11, 11, 4, 5, 6, 5, 9, 9, 5, 11, 2, 8, 9, 14, 12, 9, 8] },
        { city: 'Berlin', count: 11, monthlySales: 498430, dailyTrend: [11, 7, 3, 8, 6, 2, 2, 4, 3, 8, 5, 11, 7, 11, 11, 4, 5, 6, 5, 9, 9, 5, 11, 2, 8, 9, 14, 12, 9, 8] },
        { city: 'Madrid', count: 4, monthlySales: 181760, dailyTrend: [11, 7, 3, 8, 6, 2, 2, 4, 3, 8, 5, 11, 7, 11, 11, 4, 5, 6, 5, 9, 9, 5, 11, 2, 8, 9, 14, 12, 9, 8] },
        { city: 'Paris', count: 9, monthlySales: 381760, dailyTrend: [11, 7, 3, 8, 6, 2, 2, 4, 3, 8, 5, 11, 7, 11, 11, 4, 5, 6, 5, 9, 9, 5, 11, 2, 8, 9, 14, 12, 9, 8] }
    ];

    const source = React.useMemo(() => ({
        dataType: 'array',
        localData: data
    }), []);

    const dataAdapter = React.useMemo(() => new jqx.dataAdapter(source), [source]);

    const createSparkline = React.useCallback((selector: string, dataParam: any, type: any) => {
        const padding = { left: 0, top: 0, right: 0, bottom: 0 };
        const titlePadding = { left: 0, top: 0, right: 0, bottom: 0 };
        const seriesGroups: IChartProps['seriesGroups'] = [
            {
                columnsGapPercent: 0,
                columnsMaxWidth: 2,
                series: [
                    {
                        colorFunction: (value: any) => {
                            return (value < 10) ? '#307DD7' : '#AA4643';
                        },
                        linesUnselectMode: 'click'
                    }
                ],
                type,
                valueAxis: {
                    minValue: 0,
                    visible: false
                }
            }
        ];
        const xAxis = {
            valuesOnTicks: false,
            visible: false
        };
        // Created straight on the cell rather than through a React root: the
        // DataTable rebuilds these cells on every render, so a root mounts after
        // the element it was given has already been replaced.
        const container = document.querySelector(`#${selector}`);
        if (!container) { return; }
        JQXLite(container).jqxChart({
            backgroundColor: 'transparent',
            colorScheme: 'scheme01',
            description: '',
            enableAnimations: false,
            padding,
            seriesGroups,
            showBorderLine: false,
            showLegend: false,
            showToolTips: false,
            source: dataParam,
            title: '',
            titlePadding,
            xAxis
        });
    }, []);

    const columns = React.useMemo(() => [
        { text: 'City', align: 'center', dataField: 'city', width: 250 },
        { text: 'Store locations', align: 'center', dataField: 'count', width: 200 },
        { text: 'Monthly sales', align: 'center', dataField: 'monthlySales' },
        {
            align: 'center',
            cellsRenderer: (row: any, column: any, value: any, rowData: any) => {
                const div = '<div id="sparklineContainer' + row + '" style="margin: 0; margin-bottom: 0; width: 100%; height: 40px;"></div>';
                return div;
            },
            dataField: 'dailyTrend',
            text: 'Daily sales trend'
        }
    ], []);

    const rendered = React.useCallback(() => {
        for (let i = 0; i < data.length; i++) {
            createSparkline('sparklineContainer' + i, data[i].dailyTrend, i % 2 === 0 ? 'column' : 'line');
        }
    }, [data, createSparkline]);

    return (
        // @ts-ignore
        <JqxDataTable
            theme={'material-purple'}
            width={'100%'}
            source={dataAdapter}
            enableHover={false}
            sortable={true}
            columns={columns}
            rendered={rendered}
        />
    );
};

export default App;