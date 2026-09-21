import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

import JqxBulletChart, { IBulletChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbulletchart';
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxDropDownList, { IDropDownListProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import JqxExpander from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxexpander';
import JqxRadioButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxradiobutton';
import JqxSlider from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxslider';

const source: IDropDownListProps['source'] = ['Black', 'Red', 'Green', 'Blue', 'From theme'];

const ranges: IBulletChartProps['ranges'] = [
    { color: '#000000', endValue: 200, opacity: 0.5, startValue: 0 },
    { color: '#000000', endValue: 250, opacity: 0.3, startValue: 200 },
    { color: '#000000', endValue: 300, opacity: 0.1, startValue: 250 }
];

const App = () => {
    const myBulletChart = useRef<JqxBulletChart>(null);
    const showLabelsCheckbox = useRef<JqxCheckBox>(null);
    const disabledCheckbox = useRef<JqxCheckBox>(null);
    const rtlCheckbox = useRef<JqxCheckBox>(null);
    const enableAnimationCheckbox = useRef<JqxCheckBox>(null);
    const nearRadio = useRef<JqxRadioButton>(null);
    const farRadio = useRef<JqxRadioButton>(null);
    const bothRadio = useRef<JqxRadioButton>(null);
    const currencyRadio = useRef<JqxRadioButton>(null);
    const percentRadio = useRef<JqxRadioButton>(null);
    const noneRadio = useRef<JqxRadioButton>(null);
    const valueSlider = useRef<JqxSlider>(null);
    const pointerDropDownList = useRef<JqxDropDownList>(null);
    const targetDropDownList = useRef<JqxDropDownList>(null);

    const [animationDuration, setAnimationDuration] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [rtl, setRtl] = useState<boolean>(false);
    const [labelsFormat, setLabelsFormat] = useState<string>('c');
    const [ticks, setTicks] = useState<any>({ interval: 50, position: 'both', size: 10 });
    const [pointer, setPointer] = useState<any>({ label: 'Revenue 2019 YTD', size: '25%', value: 270 });
    const [target, setTarget] = useState<any>({ label: 'Revenue 2018 YTD', size: 4, value: 260 });

    const [showLabelsChecked, setShowLabelsChecked] = useState<boolean>(true);
    const [disabledChecked, setDisabledChecked] = useState<boolean>(false);
    const [rtlChecked, setRtlChecked] = useState<boolean>(false);
    const [enableAnimationChecked, setEnableAnimationChecked] = useState<boolean>(false);
    const [nearRadioChecked, setNearRadioChecked] = useState<boolean>(false);
    const [farRadioChecked, setFarRadioChecked] = useState<boolean>(false);
    const [bothRadioChecked, setBothRadioChecked] = useState<boolean>(true);
    const [currencyRadioChecked, setCurrencyRadioChecked] = useState<boolean>(true);
    const [percentRadioChecked, setPercentRadioChecked] = useState<boolean>(false);
    const [noneRadioChecked, setNoneRadioChecked] = useState<boolean>(false);
    const [pointerDropDownSelected, setPointerDropDownSelected] = useState<IDropDownListProps['selectedIndex']>(4);
    const [targetDropDownSelected, setTargetDropDownSelected] = useState<IDropDownListProps['selectedIndex']>(4);

    const showLabelsCheckboxChange = useCallback((event: any): void => {
        const checked = event.args.checked;
        if (checked) {
            nearRadio.current!.enable();
            farRadio.current!.enable();
            bothRadio.current!.enable();
            currencyRadio.current!.enable();
            percentRadio.current!.enable();
            noneRadio.current!.enable();
            if (nearRadio.current!.props.checked) {
                setTicks({ position: 'near' });
            } else if (farRadio.current!.props.checked) {
                setTicks({ position: 'far' });
            } else {
                setTicks({ position: 'both' });
            }
            setShowLabelsChecked(true);
        } else {
            setShowLabelsChecked(false);
            setTicks({ position: 'none' });
            nearRadio.current!.disable();
            farRadio.current!.disable();
            bothRadio.current!.disable();
            currencyRadio.current!.disable();
            percentRadio.current!.disable();
            noneRadio.current!.disable();
        }
    }, []);

    const handleNearRadioChecked = useCallback((): void => {
        if (!nearRadioChecked) {
            setBothRadioChecked(false);
            setFarRadioChecked(false);
            setNearRadioChecked(true);
            setTicks({ position: 'near' });
        }
    }, [nearRadioChecked]);

    const handleFarRadioChecked = useCallback((): void => {
        if (!farRadioChecked) {
            setBothRadioChecked(false);
            setFarRadioChecked(true);
            setNearRadioChecked(false);
            setTicks({ position: 'far' });
        }
    }, [farRadioChecked]);

    const handleBothRadioChecked = useCallback((): void => {
        if (!bothRadioChecked) {
            setBothRadioChecked(true);
            setFarRadioChecked(false);
            setNearRadioChecked(false);
            setTicks({ position: 'both' });
        }
    }, [bothRadioChecked]);

    const handleCurrencyRadioChecked = useCallback((): void => {
        if (!currencyRadioChecked) {
            setCurrencyRadioChecked(true);
            setLabelsFormat('c');
            setNoneRadioChecked(false);
            setPercentRadioChecked(false);
        }
    }, [currencyRadioChecked]);

    const handlePercentRadioChecked = useCallback((): void => {
        if (!percentRadioChecked) {
            setCurrencyRadioChecked(false);
            setLabelsFormat('p');
            setNoneRadioChecked(false);
            setPercentRadioChecked(true);
        }
    }, [percentRadioChecked]);

    const handleNoneRadioChecked = useCallback((): void => {
        if (!noneRadioChecked) {
            setCurrencyRadioChecked(false);
            setLabelsFormat('null');
            setNoneRadioChecked(true);
            setPercentRadioChecked(false);
        }
    }, [noneRadioChecked]);

    const enableAnimationCheckboxChange = useCallback((event: any): void => {
        const checked = event.args.checked;
        if (checked) {
            setAnimationDuration(400);
            setEnableAnimationChecked(true);
        } else {
            setAnimationDuration(0);
            setEnableAnimationChecked(false);
        }
    }, []);

    const valueSliderChange = useCallback((event: any): void => {
        const value = event.args.value;
        myBulletChart.current!.val(value);
    }, []);

    const pointerDropDownListChange = useCallback((event: any): void => {
        if (event.args.index !== pointerDropDownSelected) {
            const choice = event.args.item.label;
            const newColor = choice !== 'From theme' ? choice : '';
            setPointer({ color: newColor });
            setPointerDropDownSelected(event.args.index);
        }
    }, [pointerDropDownSelected]);

    const targetDropDownListChange = useCallback((event: any): void => {
        if (event.args.index !== targetDropDownSelected) {
            const choice = event.args.item.label;
            const newColor = choice !== 'From theme' ? choice : '';
            setTarget({ color: newColor });
            setTargetDropDownSelected(event.args.index);
        }
    }, [targetDropDownSelected]);

    const disabledCheckboxChange = useCallback((event: any): void => {
        const checked = event.args.checked;
        setDisabled(!!checked);
        setDisabledChecked(!!checked);
    }, []);

    const rtlCheckboxChange = useCallback((event: any): void => {
        const checked = event.args.checked;
        setRtl(!!checked);
        setRtlChecked(!!checked);
    }, []);

    return (
        <div>
            <JqxBulletChart ref={myBulletChart} style={{ float: 'left', marginLeft: '10px' }}
                // @ts-ignore
                width={'100%'} height={80} barSize={'40%'} ranges={ranges}
                ticks={ticks} title={'Revenue 2019 YTD'} description={'(U.S. $ in thousands)'}
                animationDuration={animationDuration} pointer={pointer} target={target}
                showTooltip={true} labelsFormat={labelsFormat} disabled={disabled} rtl={rtl}
            />
            <JqxExpander theme={'material-purple'} style={{ float: 'left', marginLeft: '60px' }}
                width={210} height={550} toggleMode={'none'} showArrow={false}>
                <div>JqxBulletChart Settings</div>
                <div>
                    <div style={{ padding: '5px' }}>
                        <JqxCheckBox theme={'material-purple'} ref={showLabelsCheckbox} onChange={showLabelsCheckboxChange} checked={showLabelsChecked}>Show Labels</JqxCheckBox>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', marginLeft: '20px', fontFamily: 'Verdana', fontSize: '12px' }}>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={nearRadio} onChecked={handleNearRadioChecked} checked={nearRadioChecked} groupName={'position'}>Near</JqxRadioButton>
                            </li>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={farRadio} onChecked={handleFarRadioChecked} checked={farRadioChecked} groupName={'position'} style={{ marginTop: '5px' }}>Far</JqxRadioButton>
                            </li>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={bothRadio} onChecked={handleBothRadioChecked} checked={bothRadioChecked} groupName={'position'} style={{ marginTop: '5px' }}>Both</JqxRadioButton>
                            </li>
                        </ul>
                        <br />
                        <div>Labels Format:</div>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', marginLeft: '20px', fontFamily: 'Verdana', fontSize: '12px' }}>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={currencyRadio} onChecked={handleCurrencyRadioChecked} checked={currencyRadioChecked} groupName={'format'}>Currency</JqxRadioButton>
                            </li>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={percentRadio} onChecked={handlePercentRadioChecked} checked={percentRadioChecked} groupName={'format'} style={{ marginTop: '5px' }}>Percent</JqxRadioButton>
                            </li>
                            <li>
                                <JqxRadioButton theme={'material-purple'} ref={noneRadio} onChecked={handleNoneRadioChecked} checked={noneRadioChecked} groupName={'format'} style={{ marginTop: '5px' }}>None</JqxRadioButton>
                            </li>
                        </ul>
                        <br />
                        <JqxCheckBox theme={'material-purple'} ref={enableAnimationCheckbox} onChange={enableAnimationCheckboxChange} checked={enableAnimationChecked}>Enable Animation</JqxCheckBox>
                        <br />
                        <div>Pointer Value:</div>
                        <JqxSlider theme={'material-purple'} ref={valueSlider} onChange={valueSliderChange} style={{ paddingLeft: '5px' }}
                            width={175} min={0} max={300} step={10} showTicks={false}
                            mode={'fixed'} showButtons={false} value={270}
                        />
                        <br />
                        <div>Pointer Color:</div>
                        <JqxDropDownList theme={'material-purple'} ref={pointerDropDownList} onChange={pointerDropDownListChange}
                            width={'100%'} height={25} selectedIndex={pointerDropDownSelected}
                            source={source} autoDropDownHeight={true}
                        />
                        <br />
                        <div>Target Color:</div>
                        <JqxDropDownList theme={'material-purple'} ref={targetDropDownList} onChange={targetDropDownListChange}
                            width={'100%'} height={25} selectedIndex={targetDropDownSelected}
                            source={source} autoDropDownHeight={true}
                        />
                        <br />
                        <JqxCheckBox theme={'material-purple'} ref={disabledCheckbox} onChange={disabledCheckboxChange} checked={disabledChecked} style={{ marginBottom: '5px' }}>Disabled</JqxCheckBox>
                        <JqxCheckBox theme={'material-purple'} ref={rtlCheckbox} onChange={rtlCheckboxChange} checked={rtlChecked}>Right-to-Left</JqxCheckBox>
                    </div>
                </div>
            </JqxExpander>
        </div>
    );
};

export default App;
