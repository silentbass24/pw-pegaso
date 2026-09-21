import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import './App.css';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxColorPicker from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcolorpicker';
import JqxDropDownButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownbutton';
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxRibbon from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxribbon';
import JqxToggleButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtogglebutton';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';

const App = () => {
    const myRibbon = useRef<JqxRibbon>(null);
    const fileItemButton = useRef<JqxDropDownButton>(null);
    const fontColorButton = useRef<JqxDropDownButton>(null);
    const highlightColorButton = useRef<JqxDropDownButton>(null);
    const bucketColorButton = useRef<JqxDropDownButton>(null);
    const pasteButton = useRef<JqxButton>(null);
    const superScriptToggleButton = useRef<JqxToggleButton>(null);
    const subscriptToggleButton = useRef<JqxToggleButton>(null);

    const manageGridData = useCallback((): any => {
        const numberrenderer = (row: any, column: any, value: any): string => {
            return '<div style="text-align: center; margin-top: 5px;">' + (1 + value) + '</div>';
        };
        const datafields = [];
        const columns = [];
        for (let i = 0; i < 26; i++) {
            const text = String.fromCharCode(65 + i);
            if (i === 0) {
                const cssclass = 'jqx-widget-header';
                columns[columns.length] =
                    {
                        cellclassname: cssclass,
                        cellsrenderer: numberrenderer,
                        columntype: 'number',
                        exportable: false,
                        pinned: true,
                        text: ""
                    };
            }
            datafields[datafields.length] = { name: text };
            columns[columns.length] = { text, datafield: text, width: 60, align: 'center' };
        };
        const source =
        {
            datafields,
            totalrecords: 100,
            unboundmode: true
        };
        const dataAdapter = new jqx.dataAdapter(source);
        const jqxGridSettings =
        {
            columns,
            source: dataAdapter
        };

        return jqxGridSettings;
    }, []);

    const onPasteButtonClick = useCallback((event: any): void => {
        /* tslint:disable:no-console */
        const text = document.getElementsByClassName('pasteText')[0].innerHTML;
        console.log(text + ' clicked');
    }, []);

    const onPasteDropDownSelect = useCallback((event: any): void => {
        const index = event.args.index;
        const icon = '<span class="' + pasteData[index].imageClass + '" style="zoom: 1.5"></span>';
        pasteButton.current!.val(icon + '<span class="pasteText">' + pasteData[index].label + '</span>')
        pasteButton.current!.render();
    }, []);

    const onFontColorPicker = useCallback((event: any): void => {
        const fontColorPreview = document.getElementById("fontColorPreview");
        fontColorPreview!.style.backgroundColor = "#" + event.args.color.hex;
    }, []);

    const onHighlightColorPicker = useCallback((event: any): void => {
        const highlightColorPreview = document.getElementById("highlightColorPreview");
        highlightColorPreview!.style.backgroundColor = "#" + event.args.color.hex;
    }, []);

    const onSuperScriptClick = useCallback((event: any): void => {
        if (!superScriptToggleButton.current!.getOptions("toggled")) {
            superScriptToggleButton.current!.setOptions({ toggled: false });
        }
    }, []);

    const onSubScriptClick = useCallback((event: any): void => {
        if (!subscriptToggleButton.current!.getOptions("toggled")) {
            subscriptToggleButton.current!.setOptions({ toggled: false });
        }
    }, []);

    const onBucketColorPicker = useCallback((event: any): void => {
        const bucketColorPreview = document.getElementById("bucketColorPreview");
        bucketColorPreview!.style.backgroundColor = "#" + event.args.color.hex;
    }, []);

    const pasteData: any = [
        { label: 'Paste', imageClass: 'icon page_paste' },
        { label: 'Paste Special', imageClass: 'icon paste_plain' },
        { label: 'Paste text', imageClass: 'icon paste_word' },
        { label: 'Paste link', imageClass: 'icon PasteImage' }
    ];
    const fontListSource: string[] = [
        "<span style='font-family: Courier New;'>Courier New</span>",
        "<span style='font-family: Times New Roman;'>Times New Roman</span>",
        "<span style='font-family: Arial;'>Arial</span>"
    ];
    const fontSizeListSource: number[] = [8, 9, 10, 11, 12, 14, 18, 20, 22, 24];
    const changeCaseListSource: string[] = ['Sentence Case', 'lowercase', 'UPPERCASE', 'Capitalize Each Word'];

    const changeCaseListSelectionRenderer = (object: any, index: any, label: any) => {
                return '<div class="icon change-case-16" style="top: 3px; position: relative"></div>';
            };
    const columns = manageGridData().columns;
    const dropdownHeight = 21;
    const fontSizeListRenderer = (index: number, label: any, value: any) => {
                return '<span style="font-size:' + value + 'px;">' + value + '</span>';
            };
    const pasteRenderer = (index: number, label: any, value: any) => {
                const labelEl = '<span style="font-size: 10px">' + label + '</span>';
                const icon = '<span class="' + pasteData[index].imageClass + '" style=""></span>';
                return '<span>' + icon + labelEl + '</span>';
            };
    const pasteSelectionRenderer = () => {
                return "";
            };
    const source = manageGridData().source;

    useEffect(() => {
        myRibbon.current!.disableAt(0);
        bucketColorButton.current!.setContent(`
            <span style="position: relative; display: inline-block; top: 2px">
                <div class="icon paintcan"></div>
                <span id="bucketColorPreview" style="display: block; position: absolute; height: 3px; width: 16px; background: #000">
                </span>
            </span>`);
        fileItemButton.current!.setContent('<span style="position: relative; line-height: 26px; margin-left: 10px;">File</span>');
        fontColorButton.current!.setContent('<span style="position: relative; display: inline; top: 2px"><div class="icon FontDialogImage"></div><span id="fontColorPreview" style="display: block; position: absolute;  height: 3px; width: 16px; background: #000"></span></span><span style="position: relative; display: inline; top: 3px">Font Color</span>');
        highlightColorButton.current!.setContent('<span style="position: relative; display: inline; top: 2px"><div class="icon pencil"></div><span id="highlightColorPreview" style="display: block; position: absolute;  height: 3px; width: 16px; background: #F00"></span></span><span style="position: relative; display: inline; top: 3px">Highlight Color</span>');

        const icons = document.getElementsByClassName('icon');
        Array.prototype.forEach.call(icons, (icon: HTMLElement) => {
            icon.style.backgroundImage = "url('/img/ribbon-icons.png')";
        });
    }, []);

    // Event handling

    return (
        <div>
            <JqxRibbon theme={'material-purple'} ref={myRibbon}
                // @ts-ignore
                width={"100%"}
                height={131}
                animationType={"none"}
                selectionMode={"click"}
                position={"top"}
                mode={"default"}
                selectedIndex={1}
                theme={"demoTheme"}
            >
                <ul>
                    <li id="fileItem">
                        <JqxDropDownButton theme={'material-purple'} ref={fileItemButton}
                            width={50}
                            height={26}
                            arrowSize={0}
                            dropDownWidth={120}
                            theme={"demoTheme"}
                        >
                            <div style={{ height: 110 }}>
                                <ul style={{ listStyleType: "none", margin: 0, padding: 3 }}>
                                    <li>
                                        <JqxButton theme={'material-purple'} height={16} className="button" theme={"demoTheme"}>
                                            <div className="icon SaveImage" /> Save
                                        </JqxButton>
                                    </li>
                                    <li>
                                        <JqxButton theme={'material-purple'} height={16} className="button" theme={"demoTheme"}>
                                            <div className="icon SaveSelectionImage" /> Save As
                                        </JqxButton>
                                    </li>
                                    <li>
                                        <JqxButton theme={'material-purple'} height={16} className="button" theme={"demoTheme"}>
                                            <div className="icon folder" /> Open
                                        </JqxButton>
                                    </li>
                                    <li>
                                        <JqxButton theme={'material-purple'} height={16} className="button" theme={"demoTheme"}>
                                            <div className="icon close" /> Close
                                        </JqxButton>
                                    </li>
                                </ul>
                            </div>
                        </JqxDropDownButton>
                    </li>
                    <li>Home</li>
                    <li>Help</li>
                </ul>
                <div>
                    <div style={{ overflow: "hidden" }} />
                    <div style={{ overflow: "hidden" }}>
                        <table className="buttonHolderTable" id="clipBoardTable">
                            <tbody>
                                <tr>
                                    <td rowSpan={3} style={{ textAlign: "center", height: 70, fontSize: 10 }}
                                    >
                                        <div id="paste" style={{ width: 50 }}>
                                            <JqxButton theme={'material-purple'}
                                                ref={pasteButton}
                                                // mousedown={onMouseDownPasteButton}
                                                onClick={onPasteButtonClick}
                                                width={35}
                                                height={56}
                                                theme={"demoTheme"}
                                            >
                                                <span className="icon page_paste" style={{ zoom: 1.5 }} />
                                                <span className="pasteText">Paste</span>
                                            </JqxButton>
                                            <JqxDropDownList theme={'material-purple'}
                                                onSelect={onPasteDropDownSelect}
                                                width={22}
                                                height={10}
                                                autoDropDownHeight={true}
                                                animationType={"none"}
                                                selectedIndex={0}
                                                source={pasteData}
                                                dropDownWidth={110}
                                                renderer={pasteRenderer}
                                                selectionRenderer={pasteSelectionRenderer}
                                                theme={"demoTheme"}
                                            />
                                        </div>
                                    </td>
                                    <td className="firstrow" rowSpan={1}>
                                        <JqxTooltip theme={'material-purple'}
                                            position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Cut (Ctrl + X)"}
                                        >
                                            <JqxButton theme={'material-purple'} theme={"demoTheme"} height={16}>
                                                <div className="icon cut_red" />
                                                <span className="cutText">Cut</span>
                                            </JqxButton>
                                        </JqxTooltip>

                                    </td>
                                </tr>
                                <tr>
                                    <td className="secondrow">
                                        <JqxTooltip theme={'material-purple'}
                                            position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Copy (Ctrl + C)"}
                                        >
                                            <JqxButton theme={'material-purple'} theme={"demoTheme"} height={16}>
                                                <div className="icon page_copy" />
                                                <span className="copyText">Copy</span>
                                            </JqxButton>
                                        </JqxTooltip>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="thirdrow">
                                        <JqxTooltip theme={'material-purple'}
                                            position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Format Painter"}
                                        >
                                            <JqxButton theme={'material-purple'} theme={"demoTheme"} height={16}>
                                                <div className="icon FormatPainterImage" />
                                                <span className="formatPainter">Format Painter</span>
                                            </JqxButton>
                                        </JqxTooltip>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} style={{ fontSize: 9, textAlign: "center", top: -3, position: "relative" }}>
                                        Clipboard
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="sectionSeparator" />
                        <table className="buttonHolderTable" style={{ float: "left" }}>
                            <tbody>
                                <tr>
                                    <td colSpan={4}>
                                        <JqxDropDownList theme={'material-purple'}
                                            width={120}
                                            height={dropdownHeight}
                                            autoDropDownHeight={true}
                                            theme={"demoTheme"}
                                            selectedIndex={1}
                                            source={fontListSource}
                                        />
                                    </td>
                                    <td>
                                        <JqxDropDownList theme={'material-purple'}
                                            width={70}
                                            height={dropdownHeight}
                                            autoDropDownHeight={true}
                                            theme={"demoTheme"}
                                            selectedIndex={2}
                                            renderer={fontSizeListRenderer}
                                            source={fontSizeListSource}
                                        />
                                    </td>
                                    <td>
                                        <JqxButton theme={'material-purple'} theme={"demoTheme"}><div className="icon fontsizeincrease16" /></JqxButton>
                                    </td>
                                    <td>
                                        <JqxButton theme={'material-purple'} theme={"demoTheme"}><div className="icon fontsizedecrease16" /></JqxButton>
                                    </td>
                                    <td>
                                        <JqxButton theme={'material-purple'} theme={"demoTheme"}><div className="icon ClearFormattingImage" /></JqxButton>
                                    </td>
                                    <td>
                                        <JqxDropDownList theme={'material-purple'}
                                            width={40}
                                            autoDropDownHeight={true}
                                            theme={"demoTheme"}
                                            selectedIndex={0}
                                            source={changeCaseListSource}
                                            dropDownWidth={150}
                                            selectionRenderer={changeCaseListSelectionRenderer}
                                        />
                                    </td>
                                </tr>
                                <tr className="secondrow">
                                    <td colSpan={8}>
                                        <JqxDropDownButton theme={'material-purple'} ref={fontColorButton}
                                            width={100}
                                            height={dropdownHeight}
                                            arrowSize={0}
                                            dropDownWidth={180}
                                            theme={"demoTheme"}
                                        >
                                            <div style={{ padding: 3 }}>
                                                <JqxColorPicker
                                                    onColorchange={onFontColorPicker}
                                                    width={180}
                                                    height={180}
                                                    color={"FF0000"}
                                                    colorMode={"hue"}
                                                />
                                            </div>
                                        </JqxDropDownButton>
                                        <div className="separator" />
                                        <JqxDropDownButton theme={'material-purple'} ref={highlightColorButton}
                                            width={130}
                                            height={dropdownHeight}
                                            arrowSize={0}
                                            dropDownWidth={180}
                                            theme={"demoTheme"}
                                        >
                                            <div style={{ padding: 3 }}>
                                                <JqxColorPicker
                                                    onColorchange={onHighlightColorPicker}
                                                    width={180}
                                                    height={180}
                                                    color={"FF0000"}
                                                    colorMode={"hue"}
                                                />
                                            </div>
                                        </JqxDropDownButton>
                                    </td>
                                </tr>
                                <tr className="thirdrow">
                                    <td colSpan={8} style={{ padding: 0 }}>

                                        TODO: Change this JqxTooltip "autoHide"

                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Superscript"}
                                            autoHide={false}
                                            >
                                            <JqxToggleButton theme={'material-purple'} height={15} ref={superScriptToggleButton}
                                                onClick={onSuperScriptClick}
                                                theme={"demoTheme"}
                                            >
                                                <div className="icon text_superscript" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Subscript"}
                                        >
                                            <JqxToggleButton theme={'material-purple'} height={15} ref={subscriptToggleButton}
                                                onClick={onSubScriptClick}
                                                theme={"demoTheme"}
                                            >
                                                <div className="icon text_subscript" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                        <div className="separator" style={{ top: 3 }} />
                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Bold (Ctrl + B)"}
                                        >
                                            <JqxToggleButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_bold" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Italic (Ctrl + I)"}
                                        >
                                            <JqxToggleButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_italic" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            autoHideDelay={4000}
                                            autoHide={false}
                                            content={"Underline (Ctrl + U)"}
                                        >
                                            <JqxToggleButton theme={'material-purple'} height={15}
                                                theme={"demoTheme"}
                                            >
                                                <div className="icon text_underline" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"}
                                            theme={"demoTheme"}
                                            autoHideDelay={4000}
                                            autoHide={false}
                                            content={"Strikethrough"}
                                        >
                                            <JqxToggleButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_strikethrough" />
                                            </JqxToggleButton>
                                        </JqxTooltip>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={9} style={{ height: 10, fontSize: 9, textAlign: "center" }}>
                                        Font
                                </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="sectionSeparator" />
                        <table className="buttonHolderTable" style={{ float: "left", marginTop: -4 }}>
                            <tbody>
                                <tr className="firstrow">
                                    <td colSpan={8}>
                                        <JqxTooltip theme={'material-purple'}
                                            position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Bulleted List"}
                                        >
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_list_bullets" />
                                            </JqxButton>
                                        </JqxTooltip>

                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content={"Numbered List"}>
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_list_numbers" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content={"Decrease Indent"}>
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_indent" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content={"Increase Indent"}>
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_indent_remove" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content={"Sort Direction"}>
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon SortHS" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content={"Fill Style"}>
                                            <JqxDropDownButton theme={'material-purple'} ref={bucketColorButton} className="bucketColor"
                                                width={42} height={19}
                                                dropDownWidth={180} theme={"demoTheme"}>
                                                <div style={{ padding: 3 }}>
                                                    <JqxColorPicker onColorchange={onBucketColorPicker}
                                                        width={180} height={180}
                                                        color={"000000"} colorMode={"hue"} />
                                                </div>
                                            </JqxDropDownButton>
                                        </JqxTooltip>
                                    </td>
                                </tr>
                                <tr className="secondrow">
                                    <td colSpan={8}>
                                        <JqxTooltip theme={'material-purple'}
                                            position={"mouse"}
                                            theme={"demoTheme"}
                                            content={"Align Text Left (Ctrl + L)"}
                                        >
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_align_left" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content="'Center (Ctrl + E)'">
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_align_center" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content="'Align Text Right (Ctrl + R)'">
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_align_right" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content="'Justify (Ctrl + J)'">
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_align_justify" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <div className="separator" style={{ top: 5, height: 15 }} />
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content="'Line and Paragraph Spacing'">
                                            <JqxButton theme={'material-purple'} height={15} theme={"demoTheme"}>
                                                <div className="icon text_linespacing" />
                                            </JqxButton>
                                        </JqxTooltip>
                                        <JqxTooltip theme={'material-purple'} position={"mouse"} theme={"demoTheme"} content="'Show/Hide special characters'">
                                            <JqxButton theme={'material-purple'} height={15} theme={'demoTheme'}>
                                                <div className="icon ShowParagraphMarksImage" />
                                            </JqxButton>
                                        </JqxTooltip>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 43, textAlign: "center", verticalAlign: "bottom", fontSize: 9 }}>
                                        Alignment
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="sectionSeparator" />
                    </div>
                    <div style={{ overflow: "hidden" }}>
                        <table className="buttonHolderTable" style={{ height: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="bigTd">
                                        <JqxButton theme={'material-purple'} className='button left'
                                            theme={'demoTheme'}
                                            width={36}
                                            height={36}
                                        >
                                            <img className="img" src="/img/help-26.png" />
                                        </JqxButton>
                                        Help
                                    </td>
                                    <td className="bigTd">
                                        <JqxButton theme={'material-purple'} className='button left' theme={'demoTheme'} width={36} height={36}>
                                            <img className="img" src="/img/about-26.png" />
                                        </JqxButton>
                                        About
                                    </td>
                                    <td className="bigTd">
                                        <JqxButton theme={'material-purple'} className="button left" theme={'demoTheme'} width={36} height={36}>
                                            <img className="img" src="/img/downloading_updates-26.png" />
                                        </JqxButton>
                                        Update
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </JqxRibbon>
            <JqxGrid theme={'material-purple'}
                // @ts-ignore
                width={"100%"}
                source={source}
                theme={'demoTheme'}
                editable={true}
                columnsresize={true}
                selectionmode={"multiplecellsadvanced"}
                columns={columns}
            />
        </div>
    );
};

export default App;
