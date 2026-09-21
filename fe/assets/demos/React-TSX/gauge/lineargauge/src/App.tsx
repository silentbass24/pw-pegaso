import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxCheckBox, { ICheckBoxProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxExpander from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxexpander';
import JqxLinearGauge, { ILinearGaugeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlineargauge';
import JqxRadioButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxradiobutton';

const ranges: ILinearGaugeProps['ranges'] = [
    { startValue: -10, endValue: 10, style: { fill: '#FFF157', stroke: '#FFF157' } },
    { startValue: 10, endValue: 35, style: { fill: '#FFA200', stroke: '#FFA200' } },
    { startValue: 35, endValue: 60, style: { fill: '#FF4800', stroke: '#FF4800' } }
];

const majorTicks: ILinearGaugeProps['ticksMajor'] = { visible: true, interval: 10, size: '10%' };
const minorTicks: ILinearGaugeProps['ticksMinor'] = { visible: true, size: '5%', interval: 2.5, style: { 'stroke-width': 1, stroke: '#aaaaaa' } };

const App = () => {
    const myLinearGauge = useRef<JqxLinearGauge>(null);
    const bothLabelsRadioButton = useRef<JqxRadioButton>(null);
    const bothTicksRadioButton = useRef<JqxRadioButton>(null);

    const [width, setWidth] = useState<ILinearGaugeProps['width']>('100px');
    const [height, setHeight] = useState<ILinearGaugeProps['height']>('300px');
    const [orientation, setOrientation] = useState<ILinearGaugeProps['orientation']>('vertical');
    const [background, setBackground] = useState<ILinearGaugeProps['background']>({ visible: true });
    const [labels, setLabels] = useState<ILinearGaugeProps['labels']>({ interval: 20 });
    const [ticksMajor, setTicksMajor] = useState<ILinearGaugeProps['ticksMajor']>(majorTicks);
    const [ticksMinor, setTicksMinor] = useState<ILinearGaugeProps['ticksMinor']>(minorTicks);
    const [ticksPosition, setTicksPosition] = useState<ILinearGaugeProps['ticksPosition']>(undefined);
    const [showRanges, setShowRanges] = useState<ILinearGaugeProps['showRanges']>(true);

    const [verticalChecked, setVerticalChecked] = useState<ICheckBoxProps['checked']>(true);
    const [showTicksChecked, setShowTicksChecked] = useState<ICheckBoxProps['checked']>(true);
    const [showLabelsChecked, setShowLabelsChecked] = useState<ICheckBoxProps['checked']>(true);
    const [showRangesChecked, setShowRangesChecked] = useState<ICheckBoxProps['checked']>(true);
    const [showBackgroundChecked, setShowBackgroundChecked] = useState<ICheckBoxProps['checked']>(true);

    useEffect(() => {
        bothLabelsRadioButton.current!.setOptions({ checked: true });
        bothTicksRadioButton.current!.setOptions({ checked: true });

        setTimeout(() => {
            myLinearGauge.current!.setOptions({ value: 50 });
        });
    }, []);

    const isVerticalCheckboxOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            setHeight('300px');
            setOrientation('vertical');
            setVerticalChecked(true);
            setWidth('100px');
        } else {
            setHeight('100px');
            setOrientation('horizontal');
            setVerticalChecked(false);
            setWidth('300px');
        }
    }, []);

    const showTicksCheckboxOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            setShowTicksChecked(true);
            setTicksMajor({ visible: true, size: '10%', interval: 10 });
            setTicksMinor({ visible: true, size: '5%', interval: 2.5, style: { 'stroke-width': 1, stroke: '#aaaaaa' } });
        } else {
            setShowTicksChecked(false);
            setTicksMajor({ visible: false });
            setTicksMinor({ visible: false });
        }
    }, []);

    const showLabelsCheckboxOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            setLabels({ visible: true, interval: 20 });
            setShowLabelsChecked(true);
        } else {
            setLabels({ visible: false });
            setShowLabelsChecked(false);
        }
    }, []);

    const showRangesCheckboxOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            setShowRanges(true);
            setShowRangesChecked(true);
        } else {
            setShowRanges(false);
            setShowRangesChecked(false);
        }
    }, []);

    const showBackgroundCheckboxOnChange = useCallback((event: any): void => {
        if (event.args.checked) {
            setBackground({ visible: true });
            setShowBackgroundChecked(true);
        } else {
            setBackground({ visible: false });
            setShowBackgroundChecked(false);
        }
    }, []);

    const labelsNearRadioOnChecked = useCallback((): void => {
        setLabels({ interval: 20, position: 'near' });
    }, []);

    const labelsFarRadioOnChecked = useCallback((): void => {
        setLabels({ interval: 20, position: 'far' });
    }, []);

    const labelsBothRadioOnChecked = useCallback((): void => {
        setLabels({ interval: 20, position: 'both' });
    }, []);

    const ticksNearRadioOnChecked = useCallback((): void => {
        setTicksPosition('near');
    }, []);

    const ticksFarRadioOnChecked = useCallback((): void => {
        setTicksPosition('far');
    }, []);

    const ticksBothRadioOnChecked = useCallback((): void => {
        setTicksPosition('both');
    }, []);

    const showAnimationButtonOnClick = useCallback((): void => {
        myLinearGauge.current!.setOptions({ animationDuration: 0 });
        myLinearGauge.current!.setOptions({ value: -60 });
        myLinearGauge.current!.setOptions({ animationDuration: 1000 });
        myLinearGauge.current!.setOptions({ value: 50 });
    }, []);

    return (
        <div>
            <JqxLinearGauge ref={myLinearGauge} style={{ marginLeft: '20px', float: 'left' }}
                width={width} height={height} orientation={orientation}
                ticksMajor={ticksMajor} ticksMinor={ticksMinor} max={60} background={background}
                labels={labels} showRanges={showRanges} pointer={{ size: '6%' }}
                ticksPosition={ticksPosition} colorScheme={'scheme05'} ranges={ranges} />

            <div style={{ marginLeft: '330px' }}>
                <JqxExpander theme={'material-purple'} width={280} height={320} toggleMode={'none'} showArrow={false}>
                    <div className="demo-options-header">Options</div>
                    <div>
                        <JqxCheckBox theme={'material-purple'} style={{ marginTop: '15px' }} onChange={isVerticalCheckboxOnChange} checked={verticalChecked}>Is Vertical</JqxCheckBox>
                        <br />
                        <div>
                            <table style={{ float: 'left', marginLeft: '10px' }}>
                                <tbody>
                                    <tr>
                                        <td>Labels position:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} onChecked={labelsNearRadioOnChecked} groupName={'labels-position'}>Near</JqxRadioButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} onChecked={labelsFarRadioOnChecked} groupName={'labels-position'}>Far</JqxRadioButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} ref={bothLabelsRadioButton} onChecked={labelsBothRadioOnChecked} groupName={'labels-position'}>Both</JqxRadioButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table style={{ float: 'right', marginRight: '10px' }}>
                                <tbody>
                                    <tr>
                                        <td>Ticks position:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} onChecked={ticksNearRadioOnChecked} groupName={'ticks-position'}>Near</JqxRadioButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} onChecked={ticksFarRadioOnChecked} groupName={'ticks-position'}>Far</JqxRadioButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <JqxRadioButton theme={'material-purple'} ref={bothTicksRadioButton} onChecked={ticksBothRadioOnChecked} groupName={'ticks-position'}>Both</JqxRadioButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ clear: 'both' }} />
                        </div>
                        <br />
                        <JqxCheckBox theme={'material-purple'} onChange={showTicksCheckboxOnChange} checked={showTicksChecked}>Show Ticks</JqxCheckBox>
                        <JqxCheckBox theme={'material-purple'} onChange={showLabelsCheckboxOnChange} checked={showLabelsChecked}>Show Labels</JqxCheckBox>
                        <JqxCheckBox theme={'material-purple'} onChange={showRangesCheckboxOnChange} checked={showRangesChecked}>Show Ranges</JqxCheckBox>
                        <JqxCheckBox theme={'material-purple'} onChange={showBackgroundCheckboxOnChange} checked={showBackgroundChecked}>Show Background</JqxCheckBox>
                        <br />
                        <JqxButton theme={'material-purple'} style={{ marginLeft: '90px', textAlign: 'center' }} onClick={showAnimationButtonOnClick} width={100} height={20}>Reset Value</JqxButton>
                    </div>
                </JqxExpander>
            </div>
        </div>
    );
};

export default App;
