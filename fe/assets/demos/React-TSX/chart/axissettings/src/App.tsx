import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxRadioButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxradiobutton';
import JqxSlider from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxslider';

const source: any[] = [{ year: 2004, price: 0.1437 },
            { year: 2005, price: 0.1470 },
            { year: 2006, price: 0.1510 },
            { year: 2007, price: 0.1605 },
            { year: 2008, price: 0.1647 },
            { year: 2009, price: 0.1736 },
            { year: 2010, price: 0.1766 },
            { year: 2011, price: 0.1902 },
            { year: 2012, price: 0.1978 },
            { year: 2013, price: 0.2113 },
            { year: 2014, price: 0.2178 }];

const title = 'Electricity prices in Europe between 2004 and 2019';
const description = 'Source: Eurostat';
const padding = { left: 5, top: 5, right: 15, bottom: 5 };
const titlePadding = { left: 90, top: 0, right: 0, bottom: 10 };

const seriesGroups: IChartProps['seriesGroups'] = [
    {
        series: [
            { formatSettings: { decimalPlaces: 4 }, dataField: 'price', displayText: 'Price per kWh', symbolType: 'circle' }
        ],
        showLabels: true,
        type: 'stepline'
    }
];

const initialValueAxis = (): any => ({
    alternatingBackgroundColor: '#EFEFEF',
    alternatingBackgroundColor2: '#CECECE',
    alternatingBackgroundOpacity: 0.2,
    gridLines: {
        color: '#CDCDCD',
        visible: true
    },
    labels: {
        angle: 0,
        formatSettings: {
            decimalPlaces: 4, sufix: ' €'
        },
        visible: true
    },
    padding: { left: 0, right: 0 },
    position: 'right',
    tickMarks: {
        color: '#CDCDCD',
        size: 5,
        visible: true
    },
    title: { text: '<br><br>Price EUR / kWh' }
});

const initialXAxis = (): any => ({
    dataField: 'year',
    displayText: 'Year',
    gridLines: { color: '#CDCDCD' },
    labels: { angle: 0 },
    padding: { top: 0, bottom: 0 },
    tickMarks: { color: '#CDCDCD' },
    valuesOnTicks: false
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

    const sliderValueAxisLeftPaddingOnChange = useCallback((event: any): void => {
        updateAxis(setValueAxis, (axis) => { axis.padding = { ...axis.padding, left: event.args.value }; });
    }, [updateAxis]);

    const sliderValueAxisRightPaddingOnChange = useCallback((event: any): void => {
        updateAxis(setValueAxis, (axis) => { axis.padding = { ...axis.padding, right: event.args.value }; });
    }, [updateAxis]);

    const sliderValueAxisAngleOnChange = useCallback((event: any): void => {
        updateAxis(setValueAxis, (axis) => { axis.labels = { ...axis.labels, angle: event.args.value }; });
    }, [updateAxis]);

    const sliderXAxisTopPaddingOnChange = useCallback((event: any): void => {
        updateAxis(setXAxis, (axis) => { axis.padding = { ...axis.padding, top: event.args.value }; });
    }, [updateAxis]);

    const sliderXAxisBottomPaddingOnChange = useCallback((event: any): void => {
        updateAxis(setXAxis, (axis) => { axis.padding = { ...axis.padding, bottom: event.args.value }; });
    }, [updateAxis]);

    const sliderXAxisAngleOnChange = useCallback((event: any): void => {
        updateAxis(setXAxis, (axis) => { axis.labels = { ...axis.labels, angle: event.args.value }; });
    }, [updateAxis]);

    const btnLeftOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            updateAxis(setValueAxis, (axis) => { axis.position = 'left'; });
        }
    }, [updateAxis]);

    const btnRightOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            updateAxis(setValueAxis, (axis) => { axis.position = 'right'; });
        }
    }, [updateAxis]);

    const btnTopOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            updateAxis(setXAxis, (axis) => { axis.position = 'top'; });
        }
    }, [updateAxis]);

    const btnBottomOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            updateAxis(setXAxis, (axis) => { axis.position = 'bottom'; });
        }
    }, [updateAxis]);

    const btnValueAxisFlipOnChange = useCallback((event: any): void => {
        updateAxis(setValueAxis, (axis) => { axis.flip = event.args.checked; });
    }, [updateAxis]);

    const btnXAxisFlipOnChange = useCallback((event: any): void => {
        updateAxis(setXAxis, (axis) => { axis.flip = event.args.checked; });
    }, [updateAxis]);

    return (
        <div>
            <JqxChart ref={myChart} style={{ width: '850px', height: '500px' }}
                title={title} description={description}
                enableAnimations={true} showLegend={true} padding={padding}
                titlePadding={titlePadding} source={source} xAxis={xAxis}
                valueAxis={valueAxis} seriesGroups={seriesGroups} colorScheme={'scheme04'} />

            <table style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                <tbody>
                    <tr style={{ height: '50px' }}>
                        <td style={{ width: '300px' }}><strong>[value] axis properties:</strong></td>
                        <td><strong>xAxis properties:</strong></td>
                    </tr>
                    <tr>
                        <td>
                            Left padding:
                        <JqxSlider theme={'material-purple'} onChange={sliderValueAxisLeftPaddingOnChange}
                                width={250} min={0} max={50} step={1}
                                value={0} ticksFrequency={5} mode={'fixed'} />
                        </td>
                        <td>
                            Top padding:
                        <JqxSlider theme={'material-purple'} onChange={sliderXAxisTopPaddingOnChange}
                                width={250} min={0} max={50} step={1}
                                value={0} ticksFrequency={5} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Right padding:
                        <JqxSlider theme={'material-purple'} onChange={sliderValueAxisRightPaddingOnChange}
                                width={250} min={0} max={50} step={1}
                                value={0} ticksFrequency={5} mode={'fixed'} />
                        </td>
                        <td>
                            Bottom padding:
                        <JqxSlider theme={'material-purple'} onChange={sliderXAxisBottomPaddingOnChange}
                                width={250} min={0} max={50} step={1}
                                value={0} ticksFrequency={5} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Labels angle:
                        <JqxSlider theme={'material-purple'} onChange={sliderValueAxisAngleOnChange}
                                width={250} min={0} max={360} step={1}
                                value={0} ticksFrequency={30} mode={'fixed'} />
                        </td>
                        <td>
                            Labels angle:
                        <JqxSlider theme={'material-purple'} onChange={sliderXAxisAngleOnChange}
                                width={250} min={0} max={360} step={1}
                                value={0} ticksFrequency={30} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Position:
                        <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} style={{ marginTop: '10px' }} onChange={btnLeftOnChange}
                                                width={60} height={25} groupName={'valueAxis'}>
                                                Left
                                    </JqxRadioButton>
                                        </td>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} style={{ marginTop: '10px' }} onChange={btnRightOnChange}
                                                width={60} height={25} checked={true} groupName={'valueAxis'}>
                                                Right
                                    </JqxRadioButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>
                            Position:
                        <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} style={{ marginTop: '10px' }} onChange={btnTopOnChange}
                                                width={60} height={25} groupName={'xAxis'}>
                                                Top
                                    </JqxRadioButton>
                                        </td>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} style={{ marginTop: '10px' }} onChange={btnBottomOnChange}
                                                width={80} height={25} checked={true} groupName={'xAxis'}>
                                                Bottom
                                     </JqxRadioButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <JqxCheckBox theme={'material-purple'} height={25} onChange={btnValueAxisFlipOnChange}>
                                Flip valueAxis Positions
                        </JqxCheckBox>
                        </td>
                        <td>
                            <JqxCheckBox theme={'material-purple'} height={25} onChange={btnXAxisFlipOnChange}>
                                Flip xAxis Positions
                        </JqxCheckBox>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default App;
