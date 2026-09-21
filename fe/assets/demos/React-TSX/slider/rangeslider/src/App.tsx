import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import './App.css';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxSlider, { ISliderProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxslider';

const App = () => {
    const priceSlider = useRef<JqxSlider>(null);
    const displaySlider = useRef<JqxSlider>(null);
    const ramSlider = useRef<JqxSlider>(null);
    const hddSlider = useRef<JqxSlider>(null);
    const resetButton = useRef<JqxButton>(null);

    const shop = useCallback(() => {
        const drawTable = () => {
            let catalogue = '<table class="demo-laptop-catalog-table"><tr>';
            let counter = 0;

            for (const laptop in laptops) {
                if (laptops.hasOwnProperty(laptop)) {
                    counter += 1;
                    if (counter % 3 === 1 && counter !== 1) {
                        catalogue += '</tr><tr>';
                    }
                    catalogue += '<td class="demo-laptop-cell jqx-rc-all" id="' + laptop + '">' +
                        '<div class="demo-laptop-cell-header"><div class="demo-laptop-cell-header-content">' + laptops[laptop].model + '</div></div>' +
                        '<div class="demo-laptop-cell-content"><img src="https://www.jqwidgets.com/react/images/' + laptop + '.jpg" alt="' + laptops[laptop].model + '" title="' + laptops[laptop].model + '" /></div>' +
                        '<div class="demo-laptop-cell-price jqx-rc-all">$ ' + laptops[laptop].price + '</div>' +
                        '</td>';
                }
            }
            catalogue += '</tr></table>';
            document.getElementById('catalogue')!.innerHTML = catalogue;

        };

        const resetFilters = () => {
            priceSlider.current!.setValue([priceSlider.current!.getOptions("min"), priceSlider.current!.getOptions("max")]);
            displaySlider.current!.setValue([displaySlider.current!.getOptions("min"), displaySlider.current!.getOptions("max")]);
            hddSlider.current!.setValue([hddSlider.current!.getOptions("min"), hddSlider.current!.getOptions("max")]);
            ramSlider.current!.setValue([ramSlider.current!.getOptions("min"), ramSlider.current!.getOptions("max")]);
        };

        const handleSlide = (option: any, value: any) => {
            filterItems(updateFilter(option, value));
            setLabelValue(slidersByName[option + 'Slider'], option, value);
        };

        const setLabelValue = (slider: any, option: any, value: any) => {
            let label;
            switch (option) {
                case 'price':
                    label = 'USD';
                    break;
                case 'hdd':
                    label = 'GB';
                    break;
                case 'display':
                    label = 'inches';
                    break;
                case 'ram':
                    label = 'GB';
                    break;
            }
            document.getElementById(option + 'Max')!.innerHTML = value.rangeEnd + ' ' + label;
            document.getElementById(option + 'Min')!.innerHTML = value.rangeStart + ' ' + label;
        };

        const filterItems = (filter: any) => {
            let failed = false;
            for (const laptop in laptops) {
                if (!!laptop) {
                    for (const property in filter) {
                        if (filter[property].max < laptops[laptop][property] || filter[property].min > laptops[laptop][property]) {
                            failed = true;
                        }
                    }
                    if (failed) {
                        if (!laptops[laptop].marked) {
                            markItem(laptop);
                        }
                    } else {
                        if (laptops[laptop].marked) {
                            unmarkItem(laptop);
                        }
                    }
                    failed = false;

                }
            }
        };

        const unmarkItem = (laptop: string) => {
            document.getElementById(laptop)!.style.opacity = '1';
            laptops[laptop].marked = false;
        };

        const markItem = (laptop: string) => {
            document.getElementById(laptop)!.style.opacity = '0.5';
            laptops[laptop].marked = true;
        };

        const buildFilter = () => {
            const priceValue = priceSlider.current!.getOptions("value");
            const displayValue = displaySlider.current!.getOptions("value");
            const ramValue = ramSlider.current!.getOptions("value");
            const hddValue = hddSlider.current!.getOptions("value");

            collectFilters.current = {
                display: {
                    max: displayValue.rangeEnd,
                    min: displayValue.rangeStart
                },
                hdd: {
                    max: hddValue.rangeEnd,
                    min: hddValue.rangeStart
                },
                price: {
                    max: priceValue.rangeEnd,
                    min: priceValue.rangeStart
                },
                ram: {
                    max: ramValue.rangeEnd,
                    min: ramValue.rangeStart
                }
            };
        };

        const updateFilter = (option: any, value: any) => {
            collectFilters.current[option].min = value.rangeStart;
            collectFilters.current[option].max = value.rangeEnd;
            return collectFilters.current;
        };

        return {
            handleSlide,
            init: (priceSlider: any, displaySlider: any, ramSlider: any, hddSlider: any, resetButton: any) => {
                drawTable();
                buildFilter();
                setLabelValue(priceSlider, 'price', priceSlider.current!.getOptions("value"));
                setLabelValue(displaySlider, 'display', displaySlider.current!.getOptions("value"));
                setLabelValue(ramSlider, 'ram', ramSlider.current!.getOptions("value"));
                setLabelValue(hddSlider, 'hdd', hddSlider.current!.getOptions("value"));
            },
            resetFilters
        };
    }, []);

    const priceSliderChange = useCallback((event: any): void => {
        shop().handleSlide('price', event.args.value);
    }, []);

    const displaySliderChange = useCallback((event: any): void => {
        shop().handleSlide('display', event.args.value);
    }, []);

    const ramSliderChange = useCallback((event: any): void => {
        shop().handleSlide('ram', event.args.value);
    }, []);

    const hddSliderChange = useCallback((event: any): void => {
        shop().handleSlide('hdd', event.args.value);
    }, []);

    const clickResetButton = useCallback((event: any): void => {
        shop().resetFilters();
    }, []);

    const laptops: any = {
        'l-1': { ram: 2, price: 510, display: 15.6, hdd: 320, model: 'Toshiba Satellite C660', marked: false },
        'l-10': { ram: 2, price: 550, display: 13.3, hdd: 320, model: 'Lenovo ThinkPad Edge', marked: false },
        'l-11': { ram: 3, price: 529, display: 15.6, hdd: 320, model: 'Fujitsu Lifebook A531', marked: false },
        'l-12': { ram: 8, price: 2401, display: 16.5, hdd: 500, model: 'SONY VAIO F', marked: false },
        'l-2': { ram: 6, price: 594, display: 15.6, hdd: 500, model: 'TOSHIBA Satellite L675', marked: false },
        'l-3': { ram: 4, price: 918, display: 14.5, hdd: 500, model: 'HP Envy 14-1190', marked: false },
        'l-4': { ram: 4, price: 1165, display: 15.6, hdd: 500, model: 'Dell Vostro 3500', marked: false },
        'l-5': { ram: 12, price: 1306, display: 15.6, hdd: 750, model: 'ASUS N73JQ-A2', marked: false },
        'l-6': { ram: 8, price: 3732, display: 17, hdd: 1280, model: 'Alienware M17X', marked: false },
        'l-7': { ram: 4, price: 800, display: 17, hdd: 500, model: 'Toshiba Satellite P300-21E', marked: false },
        'l-8': { ram: 12, price: 3595, display: 18.4, hdd: 1024, model: 'ASUS NX90JQ', visible: false },
        'l-9': { ram: 2, price: 631, display: 14.1, hdd: 500, model: 'Packard Bell EasyNote', marked: false }
    };
    const collectFilters = useRef<any>({});

        const slidersByName: any = { priceSlider: priceSlider, displaySlider: displaySlider, ramSlider: ramSlider, hddSlider: hddSlider };

    const height = 30;
    const mode = "fixed";
    const rangeSlider = true;
    const showButtons = true;
    const width = 180;

    useEffect(() => {
        shop().init(priceSlider, displaySlider, ramSlider, hddSlider, resetButton);
    }, []);

    // Event handling

    return (
        <div id="main-container" className="main-container jqx-rc-all">
            <div style={{ float: "left" }}>
                <div id="catalogue" className="catalogue jqx-rc-all" />
            </div>
            <div id="options" className="options jqx-rc-all">
                <div id="options-container" className="options-container">
                    <div className="label">
                        Price
                    </div>
                    <div className="options-value">
                        <div style={{ float: "left" }} id="priceMin" />
                        <div style={{ float: "right" }} id="priceMax" />
                    </div>
                    <br />
                    <JqxSlider theme={'material-purple'} ref={priceSlider}
                        onChange={priceSliderChange}
                        height={height}
                        width={width}
                        showButtons={showButtons}
                        max={4000}
                        min={500}
                        step={350}
                        values={[500, 4000]}
                        mode={mode}
                        rangeSlider={rangeSlider}
                        ticksFrequency={350}
                    />
                    <div className="label">
                        Screen Size
                    </div>
                    <div className="options-value">
                        <div style={{ float: "left" }} id="displayMin" />
                        <div style={{ float: "right" }} id="displayMax" />
                    </div>
                    <br />
                    <JqxSlider theme={'material-purple'} ref={displaySlider}
                        onChange={displaySliderChange}
                        height={height}
                        width={width}
                        showButtons={showButtons}
                        max={19}
                        min={9}
                        step={1}
                        values={[9, 19]}
                        mode={mode}
                        rangeSlider={rangeSlider}
                        ticksFrequency={1}
                    />
                    <div className="label">
                        RAM
                    </div>
                    <div className="options-value">
                        <div style={{ float: "left" }} id="ramMin" />
                        <div style={{ float: "right" }} id="ramMax" />
                    </div>
                    <br />
                    <JqxSlider theme={'material-purple'} ref={ramSlider}
                        onChange={ramSliderChange}
                        height={height}
                        width={width}
                        showButtons={showButtons}
                        max={12}
                        min={2}
                        step={1}
                        values={[2, 12]}
                        mode={mode}
                        rangeSlider={rangeSlider}
                        ticksFrequency={1}
                    />
                    <div className="label">
                        HDD
                    </div>
                    <div className="options-value">
                        <div style={{ float: "left" }} id="hddMin" />
                        <div style={{ float: "right" }} id="hddMax" />
                    </div>
                    <br />
                    <JqxSlider theme={'material-purple'} ref={hddSlider}
                        onChange={hddSliderChange}
                        height={height}
                        width={width}
                        showButtons={showButtons}
                        max={1500}
                        min={150}
                        step={135}
                        values={[150, 1500]}
                        mode={mode}
                        rangeSlider={rangeSlider}
                        ticksFrequency={135}
                    />
                    <JqxButton theme={'material-purple'} className="resetButton"
                        ref={resetButton}
                        onClick={clickResetButton}
                        width={100}
                    >
                        Reset filters
                    </JqxButton>
                </div >
            </div >
            <div style={{ clear: "both" }} />
        </div >
    );
};

export default App;
