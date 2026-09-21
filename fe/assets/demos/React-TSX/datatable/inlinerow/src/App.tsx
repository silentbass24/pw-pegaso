import * as React from 'react';
import { useRef, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxDataTable, { IDataTableProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';

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
    const myDataTable = useRef<JqxDataTable>(null);
    const shipCountryInput = useRef<JqxInput>(null);
    const myAddButton = useRef<JqxButton>(null);
    const myEditButton = useRef<JqxButton>(null);
    const myDeleteButton = useRef<JqxButton>(null);
    const myCancelButton = useRef<JqxButton>(null);
    const myUpdateButton = useRef<JqxButton>(null);
    const rowIndex = useRef<number>(undefined as any);

    const onRowSelect = useCallback((event: any): void => {
        rowIndex.current = event.args.index;
        updateButtons('Select');
    }, []);

    const onRowUnselect = useCallback((event: any): void => {
        updateButtons('Unselect');
    }, []);

    const onRowEndEdit = useCallback((event: any): void => {
        updateButtons('End Edit');
    }, []);

    const onRowBeginEdit = useCallback((event: any): void => {
        updateButtons('Edit');
    }, []);

    const updateButtons = useCallback((action: string): void => {
        switch (action) {
            case 'Select':
                myAddButton.current!.setOptions({ disabled: false });
                myDeleteButton.current!.setOptions({ disabled: false });
                myEditButton.current!.setOptions({ disabled: false });
                myCancelButton.current!.setOptions({ disabled: true });
                myUpdateButton.current!.setOptions({ disabled: true });
                break;
            case 'Unselect':
                myAddButton.current!.setOptions({ disabled: false });
                myDeleteButton.current!.setOptions({ disabled: true });
                myEditButton.current!.setOptions({ disabled: true });
                myCancelButton.current!.setOptions({ disabled: true });
                myUpdateButton.current!.setOptions({ disabled: true });
                break;
            case 'Edit':
                myAddButton.current!.setOptions({ disabled: true });
                myDeleteButton.current!.setOptions({ disabled: true });
                myEditButton.current!.setOptions({ disabled: true });
                myCancelButton.current!.setOptions({ disabled: false });
                myUpdateButton.current!.setOptions({ disabled: false });
                break;
            case 'End Edit':
                myAddButton.current!.setOptions({ disabled: false });
                myDeleteButton.current!.setOptions({ disabled: false });
                myEditButton.current!.setOptions({ disabled: false });
                myCancelButton.current!.setOptions({ disabled: true });
                myUpdateButton.current!.setOptions({ disabled: true });
                break;
        }
    }, []);

        const sourceData = {
            dataFields: [
                { name: 'OrderID', type: 'int' },
                { name: 'Freight', type: 'float' },
                { name: 'ShipName', type: 'string' },
                { name: 'ShipAddress', type: 'string' },
                { name: 'ShipCity', type: 'string' },
                { name: 'ShipCountry', type: 'string' },
                { name: 'ShippedDate', type: 'date' }
            ],
            dataType: 'xml',
            id: 'OrderID',
            record: 'Order',
            root: 'Orders',
            url: 'orderdetails.xml'
        };

        const renderToolbar = (toolBar: any): void => {
            const theme = jqx.theme;

            const toTheme = (className: string): string => {
                if (theme === '') {
                    return className;
                }
                return className + ' ' + className + '-' + theme;
            }

            // appends buttons to the status bar.
            const container = document.createElement('div');
            container.id = "myContainer";
            const fragment = document.createDocumentFragment();

            container.style.cssText = 'overflow: hidden; height: 100%; width: 100%';

            const createButtons = (name: string, cssClass: string): any => {
                const button = document.createElement('div');
                button.style.cssText = 'float: left;';

                return button;
            }

            const buttons = [
                createButtons('addButton', toTheme('jqx-icon-plus')),
                createButtons('editButton', toTheme('jqx-icon-edit')),
                createButtons('deleteButton', toTheme('jqx-icon-delete')),
                createButtons('cancelButton', toTheme('jqx-icon-cancel')),
                createButtons('updateButton', toTheme('jqx-icon-save'))
            ];

            for (const btn of buttons) {
                fragment.appendChild(btn);
            }

            container.appendChild(fragment);
            toolBar[0].appendChild(container);

            const addHandler = () => {
                if (!myAddButton.current!.getOptions('disabled')) {
                    // add new empty row.
                    myDataTable.current!.addRow(null, {}, 'first')
                    // select the first row and clear the selection.
                    myDataTable.current!.clearSelection();
                    myDataTable.current!.selectRow(0);
                    // edit the new row.
                    myDataTable.current!.beginRowEdit(0);
                    updateButtons('add');
                }
            };

            const editHandler = () => {
                if (!myEditButton.current!.getOptions('disabled')) {
                    myDataTable.current!.beginRowEdit(rowIndex.current);
                    updateButtons('edit');
                }
            };

            const deleteHandler = () => {
                if (!myDeleteButton.current!.getOptions('disabled')) {
                    myDataTable.current!.deleteRow(rowIndex.current);
                    updateButtons('delete');
                }
            };

            const cancelHandler = () => {
                if (!myCancelButton.current!.getOptions('disabled')) {
                    // cancel changes.
                    myDataTable.current!.endRowEdit(rowIndex.current, true);
                }
            };

            const saveHandler = () => {
                if (!myUpdateButton.current!.getOptions('disabled')) {
                    // save changes.
                    myDataTable.current!.endRowEdit(rowIndex.current, false);
                }
            };

            const buttonStyle = { margin: '2px', padding: '3px', border: 'none' };
            const iconStyle = { margin: '4px', width: '16px', height: '16px' };

            renderInto(
                <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Add'}>
                    <JqxButton theme={'material-purple'} ref={myAddButton} onClick={addHandler} style={buttonStyle}
                        width={25} height={25}>
                        <div className={toTheme('jqx-icon-plus')} style={iconStyle} />
                    </JqxButton>
                </JqxTooltip>,
                buttons[0]
            );
            renderInto(
                <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Edit'}>
                    <JqxButton theme={'material-purple'} ref={myEditButton} onClick={editHandler} style={buttonStyle}
                        width={25} height={25} disabled={true}>
                        <div className={toTheme('jqx-icon-edit')} style={iconStyle} />
                    </JqxButton>
                </JqxTooltip>,
                buttons[1]
            );
            renderInto(
                <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Delete'}>
                    <JqxButton theme={'material-purple'} ref={myDeleteButton} onClick={deleteHandler} style={buttonStyle}
                        width={25} height={25} disabled={true}>
                        <div className={toTheme('jqx-icon-delete')} style={iconStyle} />
                    </JqxButton>
                </JqxTooltip>,
                buttons[2]
            );
            renderInto(
                <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Cancel'}>
                    <JqxButton theme={'material-purple'} ref={myCancelButton} onClick={cancelHandler} style={buttonStyle}
                        width={25} height={25} disabled={true}>
                        <div className={toTheme('jqx-icon-cancel')} style={iconStyle} />
                    </JqxButton>
                </JqxTooltip>,
                buttons[3]
            );
            renderInto(
                <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Save Changes'}>
                    <JqxButton theme={'material-purple'} ref={myUpdateButton} onClick={saveHandler} style={buttonStyle}
                        width={25} height={25} disabled={true}>
                        <div className={toTheme('jqx-icon-save')} style={iconStyle} />
                    </JqxButton>
                </JqxTooltip>,
                buttons[4]
            );
        };

        const columns: IDataTableProps['columns'] = [
            { text: 'Order ID', editable: false, dataField: 'OrderID', width: 200 },
            { text: 'Freight', dataField: 'Freight', cellsFormat: 'f', cellsAlign: 'right', align: 'right', width: 200 },
            {
                columnType: 'custom',
                createEditor: (row: any, cellValue: any, editor: any, width: any, height: any): void => {
                    const countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic', 'Congo, Republic of the', 'Costa Rica', 'Cote d`Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Mongolia', 'Morocco', 'Monaco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Samoa', 'San Marino', ' Sao Tome', 'Saudi Arabia', 'Senegal', 'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

                    renderInto(
                        <JqxInput theme={'material-purple'} ref={shipCountryInput}
                            width={'100%'} height={'100%'} sourceData={countries} />,
                        editor[0]
                    );

                    editor.find('input')[0].style.paddingLeft = '4px';
                    editor.find('input')[0].style.border = 'none';
                    editor.find('input')[0].style.boxSizing = 'border-box';

                    editor.find('input')[0].value = cellValue;
                },
                dataField: 'ShipCountry',
                getEditorValue: (row: any, cellvalue: any, editor: any): string => {
                    // return the editor's value.
                    return editor.find('input')[0].value;
                },
                initEditor: (row: any, cellvalue: any, editor: any, celltext: any, width: any, height: any): void => {
                    // set the editor's current value. The callback is called each time the editor is displayed.
                    if (!cellvalue) {
                        cellvalue = '';
                    }
                    editor.find('input')[0].value = cellvalue;
                },
                text: 'Ship Country',
                width: 250,
            },
            { text: 'Shipped Date', dataField: 'ShippedDate', cellsAlign: 'right', align: 'right', cellsFormat: 'dd/MM/yyyy' }
        ];

    const source = new jqx.dataAdapter(sourceData);

    return (
        <JqxDataTable theme={'material-purple'} ref={myDataTable}
            onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
            onRowBeginEdit={onRowBeginEdit} onRowEndEdit={onRowEndEdit}
            // @ts-ignore
            width={'100%'} source={source} columns={columns}
            altRows={true} editable={true} pageable={true} pagerButtonsCount={8}
            showToolbar={true} toolbarHeight={35} renderToolbar={renderToolbar} />
    );
};

export default App;
