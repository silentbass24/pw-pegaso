import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxCheckBox, { ICheckBoxProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxSlider from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxslider';

const sampleData: any[] = [
    { Position: 0, Serie1: 30, Serie2: 5, Serie3: 25, Serie4: 30, Serie5: 10, Serie6: 5 },
    { Position: 1, Serie1: 25, Serie2: 25, Serie3: 5, Serie4: 20, Serie5: 20, Serie6: 10 },
    { Position: 3, Serie1: 30, Serie2: 5, Serie3: 25, Serie4: 10, Serie5: 20, Serie6: 15 },
    { Position: 6, Serie1: 35, Serie2: 25, Serie3: 45, Serie4: 5, Serie5: 30, Serie6: 20 },
    { Position: 7, Serie1: 5, Serie2: 20, Serie3: 25, Serie4: 20, Serie5: 40, Serie6: 15 },
    { Position: 9, Serie1: 30, Serie2: 10, Serie3: 30, Serie4: 10, Serie5: 5, Serie6: 20 },
    { Position: 10, Serie1: 60, Serie2: 45, Serie3: 10, Serie4: 20, Serie5: 10, Serie6: 15 }
];

const group1 = (): any => ({
    columnsGapPercent: 25,
    columnsMaxWidth: 40,
    columnsMinWidth: 1,
    series: [
        { dataField: 'Serie1', displayText: 'Serie1' },
        { dataField: 'Serie2', displayText: 'Serie2' },
        { dataField: 'Serie3', displayText: 'Serie3' }
    ],
    seriesGapPercent: 10,
    type: 'column'
});

const group2 = (): any => ({
    columnsGapPercent: 25,
    columnsMaxWidth: 40,
    columnsMinWidth: 1,
    greyScale: true,
    series: [
        { dataField: 'Serie4', displayText: 'Serie4' },
        { dataField: 'Serie5', displayText: 'Serie5' },
        { dataField: 'Serie6', displayText: 'Serie6' }
    ],
    seriesGapPercent: 10,
    type: 'column'
});

const padding = { left: 5, top: 5, right: 5, bottom: 5 };
const titlePadding = { left: 90, top: 0, right: 0, bottom: 10 };

const xAxis: IChartProps['xAxis'] = {
    dataField: 'Position',
    flip: false,
    gridLines: {
        color: '#BCBCBC',
        interval: 1,
        visible: true
    },
    tickMarks: {
        color: '#BCBCBC',
        interval: 1,
        visible: true
    },
    valuesOnTicks: false
};

const App = () => {
    const myChart = useRef<JqxChart>(null);
    const newSeriesGroups = useRef<any[]>([]);

    const [enableSeriesGroup1Checked, setEnableSeriesGroup1Checked] = useState<ICheckBoxProps['checked']>(true);
    const [enableSeriesGroup2Checked, setEnableSeriesGroup2Checked] = useState<ICheckBoxProps['checked']>(false);
    const [stackedSeriesGroup1Checked, setStackedSeriesGroup1Checked] = useState<ICheckBoxProps['checked']>(false);
    const [stackedSeriesGroup2Checked, setStackedSeriesGroup2Checked] = useState<ICheckBoxProps['checked']>(false);
    const [seriesGroups, setSeriesGroups] = useState<IChartProps['seriesGroups']>([group1()]);

    // The class version chained this off a setState callback; with hooks the new
    // values are passed in explicitly instead of read back from state.
    const applyStacking = useCallback((enable1: boolean, enable2: boolean, stacked1: boolean, stacked2: boolean): void => {
        const groups = newSeriesGroups.current;

        if (enable1 && groups[0]) {
            groups[0].type = stacked1 ? 'stackedcolumn' : 'column';
        }
        if (enable2 && groups.length > 0) {
            groups[groups.length - 1].type = stacked2 ? 'stackedcolumn' : 'column';
        }

        setSeriesGroups([...groups]);
        setTimeout(() => {
            if (myChart.current) {
                myChart.current.refresh();
            }
        });
    }, []);

    const updateSeriesGroupsVisibility = useCallback((event: any): void => {
        newSeriesGroups.current = [];

        const seriesGroup1VisibleClicked = event.target.classList.contains('visible1') ? true : false;
        const seriesGroup1Visible = seriesGroup1VisibleClicked ? !enableSeriesGroup1Checked : enableSeriesGroup1Checked;

        const seriesGroup2VisibleClicked = event.target.classList.contains('visible2') ? true : false;
        const seriesGroup2Visible = seriesGroup2VisibleClicked ? !enableSeriesGroup2Checked : enableSeriesGroup2Checked;

        if (seriesGroup1Visible) {
            newSeriesGroups.current[0] = group1();
        }

        if (seriesGroup2Visible) {
            const index = newSeriesGroups.current.length > 0 ? 1 : 0;
            newSeriesGroups.current[index] = group2();
        }

        const nextEnable1 = seriesGroup1VisibleClicked ? !enableSeriesGroup1Checked : enableSeriesGroup1Checked;
        const nextEnable2 = seriesGroup1VisibleClicked ? enableSeriesGroup2Checked : !enableSeriesGroup2Checked;

        setEnableSeriesGroup1Checked(nextEnable1);
        setEnableSeriesGroup2Checked(nextEnable2);

        applyStacking(!!nextEnable1, !!nextEnable2, !!stackedSeriesGroup1Checked, !!stackedSeriesGroup2Checked);
    }, [enableSeriesGroup1Checked, enableSeriesGroup2Checked, stackedSeriesGroup1Checked, stackedSeriesGroup2Checked, applyStacking]);

    const updateSeriesGroupsStacking = useCallback((event?: any): void => {
        const seriesGroup1StackedClicked = event && event.target.classList.contains('stacked1') ? true : false;
        const seriesGroup2StackedClicked = event && event.target.classList.contains('stacked2') ? true : false;

        const nextStacked1 = seriesGroup1StackedClicked ? !stackedSeriesGroup1Checked : stackedSeriesGroup1Checked;
        const nextStacked2 = seriesGroup2StackedClicked ? !stackedSeriesGroup2Checked : stackedSeriesGroup2Checked;

        if (seriesGroup1StackedClicked || seriesGroup2StackedClicked) {
            newSeriesGroups.current = seriesGroups!;
        }

        if (seriesGroup1StackedClicked) {
            setStackedSeriesGroup1Checked(nextStacked1);
        }
        if (seriesGroup2StackedClicked) {
            setStackedSeriesGroup2Checked(nextStacked2);
        }

        applyStacking(!!enableSeriesGroup1Checked, !!enableSeriesGroup2Checked, !!nextStacked1, !!nextStacked2);
    }, [enableSeriesGroup1Checked, enableSeriesGroup2Checked, stackedSeriesGroup1Checked, stackedSeriesGroup2Checked, seriesGroups, applyStacking]);

    const eventHandler = useCallback((event: any, series: number, propName: string): void => {
        const groups: any = seriesGroups;
        if (groups!.length !== 0) {
            if (groups!.length < 2) {
                const serieDataField = groups![0].series![0].dataField;
                const serie = serieDataField === 'Serie1' ? 0 : 1;

                if (series !== serie) {
                    return;
                }
                groups![0][propName] = event.args.value;
            } else {
                groups![series][propName] = event.args.value;
            }
            setSeriesGroups([...groups]);
            setTimeout(() => {
                if (myChart.current) {
                    myChart.current.refresh();
                }
            });
        }
    }, [seriesGroups]);

    const sliderColumnsGapPercent = useCallback((series: number, event: any): void => {
        eventHandler(event, series, 'columnsGapPercent');
    }, [eventHandler]);

    const sliderSeriesGap = useCallback((series: number, event: any): void => {
        eventHandler(event, series, 'seriesGapPercent');
    }, [eventHandler]);

    const sliderMinWidth = useCallback((series: number, event: any): void => {
        eventHandler(event, series, 'columnsMinWidth');
    }, [eventHandler]);

    const sliderMaxWidth = useCallback((series: number, event: any): void => {
        eventHandler(event, series, 'columnsMaxWidth');
    }, [eventHandler]);

    return (
        <div>
            <JqxChart ref={myChart} style={{ width: '850px', height: '500px' }}
                title={'Columns spacing and padding'} description={'Example with two series groups and three series in each group'}
                showLegend={true} enableAnimations={false} padding={padding}
                titlePadding={titlePadding} source={sampleData} xAxis={xAxis}
                columnSeriesOverlap={true} seriesGroups={seriesGroups} colorScheme={'scheme04'} />

            <table style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                <tbody>
                    <tr style={{ height: '50px' }}>
                        <td style={{ width: '300px' }}>
                            <strong>Series group 1:</strong>
                        </td>
                        <td>
                            <strong>Series group 2:</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <JqxCheckBox theme={'material-purple'} className={'visible1'} onChange={updateSeriesGroupsVisibility}
                                width={120} height={25} checked={enableSeriesGroup1Checked}>
                                Visible
                            </JqxCheckBox>
                        </td>
                        <td>
                            <JqxCheckBox theme={'material-purple'} className={'visible2'} onChange={updateSeriesGroupsVisibility}
                                width={120} height={25} checked={enableSeriesGroup2Checked}>
                                Visible
                            </JqxCheckBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <JqxCheckBox theme={'material-purple'} className={'stacked1'} onChange={updateSeriesGroupsStacking}
                                width={120} height={25} checked={stackedSeriesGroup1Checked}>
                                Stacked
                            </JqxCheckBox>
                        </td>
                        <td>
                            <JqxCheckBox theme={'material-purple'} className={'stacked2'} onChange={updateSeriesGroupsStacking}
                                width={120} height={25} checked={stackedSeriesGroup2Checked}>
                                Stacked
                            </JqxCheckBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Space between columns / padding:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderColumnsGapPercent(0, event)}
                                width={250} min={0} max={99} value={25}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                        <td>
                            Space between columns / padding:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderColumnsGapPercent(1, event)}
                                width={250} min={0} max={99} value={25}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Space between series:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderSeriesGap(0, event)}
                                width={250} min={0} max={100} value={10}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                        <td>
                            Space between series:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderSeriesGap(1, event)}
                                width={250} min={0} max={100} value={25}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Minimum column [width]:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderMinWidth(0, event)}
                                width={250} min={0} max={50} value={0}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                        <td>
                            Minimum column [width]:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderMinWidth(1, event)}
                                width={250} min={0} max={50} value={0}
                                ticksFrequency={5} step={1} mode={'fixed'} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Maximum column [width]:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderMaxWidth(0, event)}
                                width={250} min={1} max={120} value={40}
                                ticksFrequency={20} step={1} mode={'fixed'} />
                        </td>
                        <td>
                            Maximum column [width]:
                            <JqxSlider theme={'material-purple'} onChange={(event: any) => sliderMaxWidth(1, event)}
                                width={250} min={1} max={120} value={40}
                                ticksFrequency={20} step={1} mode={'fixed'} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default App;
