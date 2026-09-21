import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxNumberInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxnumberinput';

const source: any[] = [12, 3, 16, 12, 24, 15, 17, 9, 31, 25, 15, 5, 8, 19, 23, 15, 31, 26, 11, 19, 5, 1, 8, 18, 12, 3, 16, 12, 24, 15, 17, 9, 31, 25, 15, 5, 8, 19, 23, 15, 31, 26, 11, 19, 5, 1, 8, 18, 5, 12, 11];

const title = 'Chart unit interval and steps example';
const description = '';
const padding = { left: 10, top: 5, right: 10, bottom: 5 };
const titlePadding = { left: 90, top: 0, right: 0, bottom: 10 };

const seriesGroups: IChartProps['seriesGroups'] = [
    {
        series: [
            { displayText: 'value', opacity: 0.7 }
        ],
        type: 'line'
    }
];

const initialXAxis = (): any => ({
    gridLines: { step: 1 },
    labels: { step: 2 },
    tickMarks: { step: 1 },
    unitInterval: 1
});

const initialValueAxis = (): any => ({
    gridLines: { step: 1 },
    labels: { step: 1 },
    minValue: 0,
    tickMarks: { step: 1 },
    title: { text: 'Value<br>' },
    unitInterval: 5
});

const App = () => {
    const myChart = useRef<JqxChart>(null);

    const [xAxis, setXAxis] = useState<any>(initialXAxis);
    const [valueAxis, setValueAxis] = useState<any>(initialValueAxis);

    // The class version refreshed the chart from a setState callback; with hooks
    // the refresh is queued once the new state has been applied.
    const refreshChart = useCallback((): void => {
        setTimeout(() => {
            if (myChart.current) {
                myChart.current.refresh();
            }
        });
    }, []);

    // Every control below changes one property of one axis and redraws.
    const updateAxis = useCallback((setAxis: React.Dispatch<React.SetStateAction<any>>, apply: (axis: any) => void): void => {
        setAxis((prev: any) => {
            const next = { ...prev };
            apply(next);
            return next;
        });
        refreshChart();
    }, [refreshChart]);

    const inputxAxisLabelsStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setXAxis, (axis) => { axis.labels = { ...axis.labels, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputxAxisGridLinesStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setXAxis, (axis) => { axis.gridLines = { ...axis.gridLines, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputxAxisTickMarksStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setXAxis, (axis) => { axis.tickMarks = { ...axis.tickMarks, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputxAxisUnitIntervalOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setXAxis, (axis) => { axis.unitInterval = parseInt(value, 10); });
    }, [updateAxis]);

    const inputvalueAxisLabelsStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setValueAxis, (axis) => { axis.labels = { ...axis.labels, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputvalueAxisGridLinesStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setValueAxis, (axis) => { axis.gridLines = { ...axis.gridLines, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputvalueAxisTickMarksStepOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setValueAxis, (axis) => { axis.tickMarks = { ...axis.tickMarks, step: parseInt(value, 10) }; });
    }, [updateAxis]);

    const inputvalueAxisUnitIntervalOnValueChange = useCallback((event: any): void => {
        const value = event.args.value;
        updateAxis(setValueAxis, (axis) => { axis.unitInterval = parseInt(value, 10); });
    }, [updateAxis]);

    const btnValuesBetweenTicksOnChange = useCallback((event: any): void => {
        updateAxis(setXAxis, (axis) => { axis.valuesOnTicks = !event.args.checked; });
    }, [updateAxis]);

    const btnvalueAxisValuesBetweenTicksOnChange = useCallback((event: any): void => {
        updateAxis(setValueAxis, (axis) => { axis.valuesOnTicks = !event.args.checked; });
    }, [updateAxis]);

    return (
        <div>
            <JqxChart ref={myChart} style={{ width: '850px', height: '500px' }}
                title={title} description={description}
                showLegend={true} enableAnimations={false} padding={padding}
                titlePadding={titlePadding} source={source} xAxis={xAxis} enableCrosshairs={false}
                valueAxis={valueAxis} seriesGroups={seriesGroups} colorScheme={'scheme05'} />

            <table>
                <tbody>
                    <tr>
                        <td>
                            <table>
                                <tbody>
                                    <tr style={{ height: '50px' }}>
                                        <td colSpan={2}><b>xAxis Settings:</b></td>
                                    </tr>
                                    <tr>
                                        <td>Labels step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputxAxisLabelsStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={2} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Grid lines step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputxAxisGridLinesStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Tick marks step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputxAxisTickMarksStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unit interval</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputxAxisUnitIntervalOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr style={{ height: '40px' }}>
                                        <td colSpan={2}>
                                            <JqxCheckBox theme={'material-purple'} width={200} height={25} onChange={btnValuesBetweenTicksOnChange}>
                                                Value's between ticks
                                            </JqxCheckBox>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table style={{ paddingLeft: '100px' }}>
                                <tbody>
                                    <tr style={{ height: '50px' }}><td colSpan={2}><b>valueAxis Settings:</b></td></tr>
                                    <tr>
                                        <td>Labels step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputvalueAxisLabelsStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Grid lines step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputvalueAxisGridLinesStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Tick marks step</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputvalueAxisTickMarksStepOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={1} />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unit interval</td>
                                        <td>
                                            <JqxNumberInput theme={'material-purple'} onValueChanged={inputvalueAxisUnitIntervalOnValueChange}
                                                width={50} height={25} min={1} max={10}
                                                inputMode={'simple'} decimalDigits={0}
                                                digits={2} spinButtons={true} value={5} />

                                        </td>
                                    </tr>
                                    <tr style={{ height: '40px' }}>
                                        <td colSpan={2}>
                                            <JqxCheckBox theme={'material-purple'} width={200} height={25} onChange={btnvalueAxisValuesBetweenTicksOnChange}>
                                                Value's between ticks
                                            </JqxCheckBox>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default App;
