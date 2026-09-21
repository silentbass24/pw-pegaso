import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

import './App.css';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxDropDownList, { IDropDownListProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';

const sampleData = [{ a: 0.1535, b: 0.5 },
            { a: 0.48, b: 20.5 },
            { a: 10, b: 60 },
            { a: 100, b: 80 },
            { a: 200, b: 90 },
            { a: 245.11, b: 100.13 },
            { a: 300.13, b: 150.13 },
            { a: 340, b: 200 }];

const dropDownListSource: IDropDownListProps['source'] = [true, false, 'custom'];

const padding = { left: 5, top: 5, right: 15, bottom: 5 };
const titlePadding = { left: 0, top: 0, right: 0, bottom: 10 };

const seriesGroups: IChartProps['seriesGroups'] = [
    {
        series: [
            { dataField: 'a', displayText: 'A', symbolType: 'diamond', symbolSize: 10 },
            { dataField: 'b', displayText: 'B', symbolType: 'triangle_up', symbolSize: 10 }
        ],
        type: 'scatter'
    }
];

const initialXAxis = (): any => ({
    dataField: 'a',
    flip: false,
    gridLines:
    {
        custom: [{ value: 10 }, { value: 20 }],
        visible: true
    },
    labels: {
        custom: [{ value: 10 }, { value: 20 }],
        visible: true
    },
    logarithmicScale: true,
    logarithmicScaleBase: 2,
    tickMarks:
    {
        custom: [{ value: 10 }, { value: 20 }],
        visible: true
    }
});

const initialValueAxis = (): any => ({
    flip: false,
    gridLines: {
        custom: [{ value: 10 }, { value: 20 }]
    },
    labels: {
        custom: [{ value: 10 }, { value: 20 }],
        horizontalAlignment: 'right'
    },
    logarithmicScale: true,
    logarithmicScaleBase: 2,
    tickMarks: {
        custom: [{ value: 10 }, { value: 20 }]
    }
});

const App = () => {
    const myChart = useRef<JqxChart>(null);
    const myCustomXAxisInput = useRef<JqxInput>(null);
    const myCustomValueAxisInput = useRef<JqxInput>(null);
    const myXAxisListBox = useRef<JqxListBox>(null);
    const myValueAxisListBox = useRef<JqxListBox>(null);

    const [xAxis, setXAxis] = useState<any>(initialXAxis);
    const [valueAxis, setValueAxis] = useState<any>(initialValueAxis);
    const [xAxisDropDownSelected, setXAxisDropDownSelected] = useState<IDropDownListProps['selectedIndex']>(0);
    const [valueAxisDropDownSelected, setValueAxisDropDownSelected] = useState<IDropDownListProps['selectedIndex']>(0);

    // The class version refreshed the chart from a setState callback; with hooks
    // the refresh is queued after the state has been applied.
    const refreshChart = useCallback((): void => {
        setTimeout(() => {
            if (myChart.current) {
                myChart.current.refresh();
            }
        });
    }, []);

    const offsetsOf = (listBox: React.RefObject<JqxListBox>): any[] => {
        const items = listBox.current!.getItems();
        const customOffsets = [];
        for (const item of items) {
            customOffsets.push({ value: parseFloat(item.value) });
        }
        return customOffsets;
    };

    const dropDownLabelsVisibility_xAxisOnChange = useCallback((event: any): void => {
        const value = event.args.item.value;
        const index = event.args.index;
        setXAxis((prev: any) => {
            const newXAxis = { ...prev };
            newXAxis.labels.visible = value === 'false' ? false : value;
            newXAxis.gridLines.visible = value === 'false' ? false : value;
            newXAxis.tickMarks.visible = value === 'false' ? false : value;
            return newXAxis;
        });
        setXAxisDropDownSelected(index);
        refreshChart();
    }, [refreshChart]);

    const dropDownLabelsVisibility_valueAxisOnChange = useCallback((event: any): void => {
        const value = event.args.item.value;
        const index = event.args.index;
        setValueAxis((prev: any) => {
            const newValueAxis = { ...prev };
            newValueAxis.labels.visible = value === 'false' ? false : value;
            newValueAxis.gridLines.visible = value === 'false' ? false : value;
            newValueAxis.tickMarks.visible = value === 'false' ? false : value;
            return newValueAxis;
        });
        setValueAxisDropDownSelected(index);
        refreshChart();
    }, [refreshChart]);

    const btnAddCustomPosition_xAxisOnClick = useCallback((): void => {
        const value = myCustomXAxisInput.current!.getOptions('value');
        if (!isNaN(parseFloat(value))) {
            myXAxisListBox.current!.addItem(parseFloat(value));
            const customOffsets = offsetsOf(myXAxisListBox);
            setXAxis((prev: any) => {
                const newXAxis = { ...prev };
                newXAxis.labels.custom = customOffsets;
                newXAxis.gridLines.custom = customOffsets;
                newXAxis.tickMarks.custom = customOffsets;
                return newXAxis;
            });
            refreshChart();
        }
    }, [refreshChart]);

    const btnRemoveCustomPosition_xAxisOnClick = useCallback((): void => {
        const idx = myXAxisListBox.current!.getOptions('selectedIndex');
        if (idx === -1) {
            return;
        }
        myXAxisListBox.current!.removeAt(idx);
        const customOffsets = offsetsOf(myXAxisListBox);
        setXAxis((prev: any) => {
            const newXAxis = { ...prev };
            newXAxis.labels.custom = customOffsets;
            newXAxis.gridLines.custom = customOffsets;
            newXAxis.tickMarks.custom = customOffsets;
            return newXAxis;
        });
        refreshChart();
    }, [refreshChart]);

    const btnAddCustomPosition_valueAxisOnClick = useCallback((): void => {
        const value = myCustomValueAxisInput.current!.getOptions('value');
        if (!isNaN(parseFloat(value))) {
            myValueAxisListBox.current!.addItem(parseFloat(value));
            const customOffsets = offsetsOf(myValueAxisListBox);
            setValueAxis((prev: any) => {
                const newValueAxis = { ...prev };
                newValueAxis.labels.custom = customOffsets;
                newValueAxis.gridLines.custom = customOffsets;
                newValueAxis.tickMarks.custom = customOffsets;
                return newValueAxis;
            });
            refreshChart();
        }
    }, [refreshChart]);

    const btnRemoveCustomPosition_valueAxisOnClick = useCallback((): void => {
        const idx = myValueAxisListBox.current!.getOptions('selectedIndex');
        if (idx === -1) {
            return;
        }
        myValueAxisListBox.current!.removeAt(idx);
        const customOffsets = offsetsOf(myValueAxisListBox);
        setValueAxis((prev: any) => {
            const newValueAxis = { ...prev };
            newValueAxis.labels.custom = customOffsets;
            newValueAxis.gridLines.custom = customOffsets;
            newValueAxis.tickMarks.custom = customOffsets;
            return newValueAxis;
        });
        refreshChart();
    }, [refreshChart]);

    return (
        <div>
            <JqxChart ref={myChart} style={{ width: '850px', height: '500px' }}
                title={'Custom labels, grid lines and tick marks offsets'} enableAnimations={false} padding={padding}
                titlePadding={titlePadding} source={sampleData} xAxis={xAxis}
                valueAxis={valueAxis} seriesGroups={seriesGroups} />
            <table>
                <tbody>
                    <tr>
                        <td style={{ width: '300px' }}><strong>xAxis settings</strong></td>
                        <td style={{ width: '300px' }}><strong>valueAxis settings</strong></td>
                    </tr>
                    <tr>
                        <td>
                            <p>Label, tick marks &amp; grid lines visibility:</p>
                            <JqxDropDownList theme={'material-purple'} onChange={dropDownLabelsVisibility_xAxisOnChange}
                                width={235} height={25} dropDownHeight={80} selectedIndex={xAxisDropDownSelected}
                                source={dropDownListSource} />
                        </td>
                        <td>
                            <p>Label, tick marks &amp; grid lines visibility:</p>
                            <JqxDropDownList theme={'material-purple'} onChange={dropDownLabelsVisibility_valueAxisOnChange}
                                width={235} height={25} dropDownHeight={80} selectedIndex={valueAxisDropDownSelected}
                                source={dropDownListSource} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Custom positions:</p>
                            <JqxInput theme={'material-purple'} ref={myCustomXAxisInput} width={50} height={22} />
                            <JqxButton theme={'material-purple'} onClick={btnAddCustomPosition_xAxisOnClick}>Add</JqxButton>
                            <JqxButton theme={'material-purple'} onClick={btnRemoveCustomPosition_xAxisOnClick}>Remove</JqxButton>
                            <JqxListBox theme={'material-purple'} ref={myXAxisListBox} style={{ marginTop: '10px' }}
                                width={235} height={80} source={[10, 20]} />
                        </td >
                        <td>
                            <p>Custom positions:</p>
                            <JqxInput theme={'material-purple'} ref={myCustomValueAxisInput} width={50} height={22} />
                            <JqxButton theme={'material-purple'} onClick={btnAddCustomPosition_valueAxisOnClick}>Add</JqxButton>
                            <JqxButton theme={'material-purple'} onClick={btnRemoveCustomPosition_valueAxisOnClick}>Remove</JqxButton>
                            <JqxListBox theme={'material-purple'} ref={myValueAxisListBox} style={{ marginTop: '10px' }}
                                width={235} height={80} source={[10, 20]} />
                        </td >
                    </tr >
                </tbody >
            </table >
        </div >
    );
};

export default App;
