import * as React from 'react';
import { useRef, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import './App.css';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';
import JqxTreeGrid, { ITreeGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';

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
    const myTreeGrid = useRef<JqxTreeGrid>(null);
    const addButton = useRef<JqxButton>(null);
    const editButton = useRef<JqxButton>(null);
    const deleteButton = useRef<JqxButton>(null);
    const cancelButton = useRef<JqxButton>(null);
    const updateButton = useRef<JqxButton>(null);

    const rowKey = useRef<any>('');
    const newRowID = useRef<any>(null);

    const rowSelect = useCallback((event: any): void => {
        const args = event.args;
        rowKey.current = args.key;
        updateButtons('Select');
    }, []);

    const rowUnselect = useCallback((event: any): void => {
        updateButtons('Unselect');
    }, []);

    const rowBeginEdit = useCallback((event: any): void => {
        updateButtons('Edit');
    }, []);

    const rowEndEdit = useCallback((event: any): void => {
        updateButtons('End Edit');
    }, []);

        const sourceData: any = {
            addRow: (rowID?: any, rowData?: any, position?: any, parentID?: any, commit?: any) => {
                // synchronize with the server - send insert command
                // call commit with parameter true if the synchronization with the server is successful
                // and with parameter false if the synchronization failed.
                // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
                newRowID.current = rowID;
                commit(true);
            },
            dataFields: [
                { name: 'Id', type: 'number' },
                { name: 'Name', type: 'string' },
                { name: 'ParentID', type: 'number' },
                { name: 'Population', type: 'number' }
            ],
            dataType: 'tab',
            deleteRow: (rowID?: any, commit?: any) => {
                // synchronize with the server - send delete command
                // call commit with parameter true if the synchronization with the server is successful
                // and with parameter false if the synchronization failed.
                commit(true);
            },
            hierarchy:
            {
                keyDataField: { name: 'Id' },
                parentDataField: { name: 'ParentID' }
            },
            id: 'Id',
            updateRow: (rowID?: any, rowData?: any, commit?: any) => {
                // synchronize with the server - send update command
                // call commit with parameter true if the synchronization with the server is successful
                // and with parameter false if the synchronization failed.
                commit(true);
            },
            url: 'locations.tsv'
        };

        const dataAdapter: any = new jqx.dataAdapter(sourceData);

    const columns = [
                { text: 'Location Name', dataField: 'Name', align: 'center', width: '50%' },
                { text: 'Population', dataField: 'Population', align: 'right', cellsAlign: 'right', width: '50%' }
            ];
    const renderToolbar = (toolBar: any) => {
                // the demo shipped without this, so toTheme() referenced an undefined name
                const theme = jqx.theme;
                const toTheme = (className: string) => {
                    // @ts-ignore
                    if (theme === "") {
                        return className;
                    }
                    // @ts-ignore
                    return className + "-" + theme + " " + className;
                };
                const container = document.createElement('div');
                container.style.cssText = 'overflow: hidden; position: relative; height: 100%; width: 100%;';
                const createButton = () => {
                    const button = document.createElement('div');
                    button.style.cssText = 'float: left; padding: 0px; margin: 0px;';
                    return button;
                };

                toolBar[0].appendChild(container);
                const addButtonDom = createButton();
                const editButtonDom = createButton();
                const deleteButtonDom = createButton();
                const cancelButtonDom = createButton();
                const updateButtonDom = createButton();

                container.appendChild(addButtonDom);
                container.appendChild(editButtonDom);
                container.appendChild(deleteButtonDom);
                container.appendChild(cancelButtonDom);
                container.appendChild(updateButtonDom);

                const isDisabled = (button: any) => {
                    return button.current!.getOptions('disabled');
                };

                const addHandler = () => {
                    if (!isDisabled(addButton)) {
                        myTreeGrid.current!.expandRow(rowKey.current);
                        // add new empty row.
                        myTreeGrid.current!.addRow(null, {}, 'first', rowKey.current);
                        // select the first row and clear the selection.
                        myTreeGrid.current!.clearSelection();
                        myTreeGrid.current!.selectRow(newRowID.current);
                        // edit the new row.
                        myTreeGrid.current!.beginRowEdit(newRowID.current);
                        // updateButtons('add');
                        updateButtons('Add');
                    }
                };

                const editHandler = () => {
                    if (!editButton.current!.props!.disabled) {
                        myTreeGrid.current!.beginRowEdit(rowKey.current);
                        updateButtons('Edit');
                    }
                };

                const deleteHandler = () => {
                    if (!isDisabled(deleteButton)) {
                        const selection = myTreeGrid.current!.getSelection();
                        if (selection.length > 1) {
                            for (const key of selection) {
                                myTreeGrid.current!.deleteRow(key.Id);
                            }
                        }
                        else {
                            myTreeGrid.current!.deleteRow(rowKey.current);
                        }

                        updateButtons('Delete');
                    }
                };

                const cancelHandler = () => {
                    if (!isDisabled(cancelButton)) {
                        // cancel changes.
                        myTreeGrid.current!.endRowEdit(rowKey.current, true);
                    }
                };

                const updateHandler = () => {
                    if (!isDisabled(updateButton)) {
                        myTreeGrid.current!.endRowEdit(rowKey.current, false);
                    }
                };

                const iconStyle = { margin: '4px', width: '16px', height: '16px' };

                const addComponent =
                    <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Add'}>
                        <JqxButton theme={'material-purple'} ref={addButton}
                            onClick={addHandler}
                            disabled={true} height={25} width={25}>
                            <div className={toTheme('jqx-icon-plus')} style={iconStyle} />
                        </JqxButton>
                    </JqxTooltip>;
                const editComponent =
                    <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Edit'}>
                        <JqxButton theme={'material-purple'} ref={editButton}
                            onClick={editHandler}
                            disabled={true} height={25} width={25}>
                            <div className={toTheme('jqx-icon-edit')} style={iconStyle} />
                        </JqxButton>
                    </JqxTooltip>;
                const deleteComponent =
                    <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Delete'}>
                        <JqxButton theme={'material-purple'} ref={deleteButton}
                            onClick={deleteHandler}
                            disabled={true} height={25} width={25}>
                            <div className={toTheme('jqx-icon-delete')} style={iconStyle} />
                        </JqxButton>
                    </JqxTooltip>;
                const cancelComponent =
                    <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Cancel'}>
                        <JqxButton theme={'material-purple'} ref={cancelButton}
                            onClick={cancelHandler}
                            disabled={true} height={25} width={25}>
                            <div className={toTheme('jqx-icon-cancel')} style={iconStyle} />
                        </JqxButton>
                    </JqxTooltip>;
                const updateComponent =
                    <JqxTooltip theme={'material-purple'} position={'bottom'} content={'Update'}>
                        <JqxButton theme={'material-purple'} ref={updateButton}
                            onClick={updateHandler}
                            disabled={true} height={25} width={25}>
                            <div className={toTheme('jqx-icon-save')} style={iconStyle} />
                        </JqxButton>
                    </JqxTooltip>;

                renderInto(addComponent, addButtonDom);
                renderInto(editComponent, editButtonDom);
                renderInto(deleteComponent, deleteButtonDom);
                renderInto(cancelComponent, cancelButtonDom);
                renderInto(updateComponent, updateButtonDom);
            };
    const source = dataAdapter;

    const setButtonState = (button: any, state: boolean) => {
        button.current!.setOptions({ disabled: state });
    };

    const updateButtons = (action: string, buttons?: any) => {
        switch (action) {
            case 'Select':
                setButtonState(addButton, false);
                setButtonState(deleteButton, false);
                setButtonState(editButton, false);
                setButtonState(cancelButton, false);
                setButtonState(updateButton, false);
                break;
            case 'Unselect':
                setButtonState(addButton, true);
                setButtonState(deleteButton, true);
                setButtonState(editButton, true);
                setButtonState(cancelButton, true);
                setButtonState(updateButton, true);

                break;
            case 'Edit':
                setButtonState(addButton, true);
                setButtonState(deleteButton, true);
                setButtonState(editButton, true);
                setButtonState(cancelButton, false);
                setButtonState(updateButton, false);
                break;
            case 'End Edit':
                setButtonState(addButton, false);
                setButtonState(deleteButton, false);
                setButtonState(editButton, false);
                setButtonState(cancelButton, true);
                setButtonState(updateButton, true);
                break;
        }
    };

    // Event handling

    return (
        <JqxTreeGrid theme={'material-purple'} ref={myTreeGrid}
            onRowSelect={rowSelect}
            onRowUnselect={rowUnselect}
            onRowBeginEdit={rowBeginEdit}
            onRowEndEdit={rowEndEdit}
            // @ts-ignore
            width={'100%'}
            source={source}
            pageable={true}
            editable={true}
            showToolbar={true}
            altRows={true}
            pagerButtonsCount={8}
            toolbarHeight={35}
            renderToolbar={renderToolbar}
            columns={columns}
        />
    );
};

export default App;
