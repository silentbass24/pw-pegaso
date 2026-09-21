import * as React from 'react';
import { useRef, useState, useMemo, useCallback } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxTreeGrid, { ITreeGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow';

const employees: any[] = [{ 'EmployeeID': 1, 'FirstName': 'Nancy', 'LastName': 'Davolio', 'ReportsTo': 2, 'Country': 'USA', 'Title': 'Sales Representative', 'HireDate': '1992-05-01 00:00:00', 'BirthDate': '1948-12-08 00:00:00', 'City': 'Seattle', 'Address': '507 - 20th Ave. E.Apt. 2A' }, { 'EmployeeID': 2, 'FirstName': 'Andrew', 'LastName': 'Fuller', 'ReportsTo': null, 'Country': 'USA', 'Title': 'Vice President, Sales', 'HireDate': '1992-08-14 00:00:00', 'BirthDate': '1952-02-19 00:00:00', 'City': 'Tacoma', 'Address': '908 W. Capital Way' }, { 'EmployeeID': 3, 'FirstName': 'Janet', 'LastName': 'Leverling', 'ReportsTo': 2, 'Country': 'USA', 'Title': 'Sales Representative', 'HireDate': '1992-04-01 00:00:00', 'BirthDate': '1963-08-30 00:00:00', 'City': 'Kirkland', 'Address': '722 Moss Bay Blvd.' }, { 'EmployeeID': 4, 'FirstName': 'Margaret', 'LastName': 'Peacock', 'ReportsTo': 2, 'Country': 'USA', 'Title': 'Sales Representative', 'HireDate': '1993-05-03 00:00:00', 'BirthDate': '1937-09-19 00:00:00', 'City': 'Redmond', 'Address': '4110 Old Redmond Rd.' }, { 'EmployeeID': 5, 'FirstName': 'Steven', 'LastName': 'Buchanan', 'ReportsTo': 2, 'Country': 'UK', 'Title': 'Sales Manager', 'HireDate': '1993-10-17 00:00:00', 'BirthDate': '1955-03-04 00:00:00', 'City': 'London', 'Address': '14 Garrett Hill' }, { 'EmployeeID': 6, 'FirstName': 'Michael', 'LastName': 'Suyama', 'ReportsTo': 5, 'Country': 'UK', 'Title': 'Sales Representative', 'HireDate': '1993-10-17 00:00:00', 'BirthDate': '1963-07-02 00:00:00', 'City': 'London', 'Address': 'Coventry House Miner Rd.' }, { 'EmployeeID': 7, 'FirstName': 'Robert', 'LastName': 'King', 'ReportsTo': 5, 'Country': 'UK', 'Title': 'Sales Representative', 'HireDate': '1994-01-02 00:00:00', 'BirthDate': '1960-05-29 00:00:00', 'City': 'London', 'Address': 'Edgeham Hollow Winchester Way' }, { 'EmployeeID': 8, 'FirstName': 'Laura', 'LastName': 'Callahan', 'ReportsTo': 2, 'Country': 'USA', 'Title': 'Inside Sales Coordinator', 'HireDate': '1994-03-05 00:00:00', 'BirthDate': '1958-01-09 00:00:00', 'City': 'Seattle', 'Address': '4726 - 11th Ave. N.E.' }, { 'EmployeeID': 9, 'FirstName': 'Anne', 'LastName': 'Dodsworth', 'ReportsTo': 5, 'Country': 'UK', 'Title': 'Sales Representative', 'HireDate': '1994-11-15 00:00:00', 'BirthDate': '1966-01-27 00:00:00', 'City': 'London', 'Address': '7 Houndstooth Rd.' }];

const sourceData: any = {
    dataFields: [
        { name: 'EmployeeID', type: 'number' },
        { name: 'ReportsTo', type: 'number' },
        { name: 'FirstName', type: 'string' },
        { name: 'LastName', type: 'string' },
        { name: 'Country', type: 'string' },
        { name: 'City', type: 'string' },
        { name: 'Address', type: 'string' },
        { name: 'Title', type: 'string' },
        { name: 'HireDate', type: 'date' },
        { name: 'BirthDate', type: 'date' }
    ],
    dataType: 'json',
    hierarchy:
    {
        keyDataField: { name: 'EmployeeID' },
        parentDataField: { name: 'ReportsTo' }
    },
    id: 'EmployeeID',
    localData: employees
};

const textAlignLeft: React.CSSProperties = { textAlign: 'left' };
const textAlignRigth: React.CSSProperties = { textAlign: 'right' };

const App = () => {
    const myTreeGrid = useRef<JqxTreeGrid>(null);
    const EmployeeID = useRef<JqxInput>(null);
    const Country = useRef<JqxInput>(null);
    const Title = useRef<JqxInput>(null);
    const BirthDate = useRef<JqxDateTimeInput>(null);
    const myWindow = useRef<JqxWindow>(null);
    const dataRow = useRef<any>(null);

    const [disabled, setDisabled] = useState<boolean>(false);

    const dataAdapter = useMemo(() => new jqx.dataAdapter(sourceData), []);

    const [columns] = useState<ITreeGridProps['columns']>([
        { text: 'Employee ID', editable: false, dataField: 'EmployeeID', width: 150 },
        { text: 'Title', dataField: 'Title', width: 250 },
        { text: 'Country', dataField: 'Country', width: 150 },
        { text: 'Bith Date', dataField: 'BirthDate', cellsAlign: 'right', align: 'right', cellsFormat: 'd' }
    ]);

    const ready = useCallback((): void => {
        setTimeout(() => {
            myTreeGrid.current!.expandRow(2);
            myTreeGrid.current!.expandRow(5);
        });
    }, []);

    const getValue = (widget: any) => {
        return widget.current!.getOptions('value');
    };

    // Event handling
    const RowDoubleClick = useCallback((event: any): void => {
        const args = event.args;
        const key = args.key;
        const row = args.row;
        // update the widgets inside jqxWindow.
        myWindow.current!.setTitle('Edit Row: ' + row.EmployeeID);
        myWindow.current!.open();
        dataRow.current = key;
        EmployeeID.current!.val(row.EmployeeID);
        Title.current!.val(row.Title);
        Country.current!.val(row.Country);
        BirthDate.current!.val(row.BirthDate);
        // disable TreeGrid.
        setDisabled(true);
    }, []);

    const windowClose = useCallback((): void => {
        setDisabled(false);
    }, []);

    const clickSave = useCallback((): void => {
        myWindow.current!.close();
        const editRow = parseInt(dataRow.current, 10);
        const rowData = {
            BirthDate: getValue(BirthDate),
            Country: getValue(Country),
            EmployeeID: getValue(EmployeeID),
            Title: getValue(Title)
        };

        myTreeGrid.current!.updateRow(editRow, rowData);
    }, []);

    const clickCancel = useCallback((): void => {
        myWindow.current!.close();
    }, []);

    return (
        <div>
            <JqxTreeGrid theme={'material-purple'} ref={myTreeGrid}
                onRowDoubleClick={RowDoubleClick}
                // @ts-ignore
                width={'100%'}
                source={dataAdapter}
                sortable={true}
                altRows={true}
                columns={columns}
                ready={ready}
                disabled={disabled}
            />

            <JqxWindow theme={'material-purple'} ref={myWindow}
                onClose={windowClose}
                width={270}
                height={225}
                resizable={false}
                position={{ x: 60, y: 45 }}
                autoOpen={false}>

                <div>Edit Dialog</div>
                <div style={{ overflow: 'hidden' }}>
                    <table style={{ tableLayout: 'fixed', borderStyle: 'none' }}>
                        <tbody>
                            <tr>
                                <td style={textAlignRigth}>
                                    Employee ID:
                                </td>
                                <td style={textAlignLeft}>
                                    <JqxInput theme={'material-purple'} ref={EmployeeID} disabled={true} width={150} height={30} />
                                </td>
                            </tr>
                            <tr>
                                <td style={textAlignRigth}>
                                    Title:
                                </td>
                                <td style={textAlignLeft}>
                                    <JqxInput theme={'material-purple'} ref={Title} width={150} height={30} />
                                </td>
                            </tr>
                            <tr>
                                <td style={textAlignRigth}>
                                    Country:
                                </td>
                                <td style={textAlignLeft}>
                                    <JqxInput theme={'material-purple'} ref={Country} width={150} height={30} />
                                </td>
                            </tr>
                            <tr>
                                <td style={textAlignRigth}>Birth Date:</td>
                                <td style={textAlignLeft}>
                                    <JqxDateTimeInput theme={'material-purple'} ref={BirthDate} width={150} height={30} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'right', paddingTop: '10px', paddingLeft: '80px' }}>
                                    <JqxButton theme={'material-purple'} style={{ float: 'left', padding: 0, lineHeight: '25px' }} onClick={clickSave} width={80} height={25}>Save</JqxButton>
                                    <JqxButton theme={'material-purple'} style={{ float: 'left', padding: 0, marginLeft: 10, lineHeight: '25px' }} onClick={clickCancel} width={80} height={25}>Cancel</JqxButton>
                                </td>
                            </tr>
                        </tbody>
                    </table >

                </div>
            </JqxWindow>

        </div>
    );
};

export default App;
