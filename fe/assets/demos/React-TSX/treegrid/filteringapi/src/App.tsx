import * as React from 'react';
import { useRef, useCallback } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxDropDownList, { IDropDownListProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';
import JqxTreeGrid, { ITreeGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';

const App = () => {
    const myTreeGrid = useRef<JqxTreeGrid>(null);
    const myDropDownList = useRef<JqxDropDownList>(null);
    const myListBox = useRef<JqxListBox>(null);

    const handleCheckChange = useRef<boolean>(true);

    const updatemyListBox = useCallback((dataField: string): void => {
        const myListBoxAdapter = new jqx.dataAdapter(sourceData,
            {
                async: false,
                autoBind: true,
                uniqueDataFields: [dataField]
            });
        const uniqueRecords = myListBoxAdapter.records;
        uniqueRecords.splice(0, 0, '(Select All)');
        myListBox.current!.setOptions({ source: uniqueRecords, displayMember: dataField });
        myListBox.current!.checkAll();
    }, []);

    const applyFilter = useCallback((dataField: string): void => {
        myTreeGrid.current!.clearFilters();
        const filtertype = 'stringfilter';
        // create a new group of filters.
        const filtergroup = new jqx.filter();
        // get listbox's checked items.
        const checkedItems = myListBox.current!.getCheckedItems();
        if (checkedItems.length === 0) {
            const filterOrOperator = 1;
            const filtervalue = "Empty";
            const filtercondition = 'equal';
            const filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
            filtergroup.addfilter(filterOrOperator, filter);
        }
        else {
            for (const items of checkedItems) {
                const filterOrOperator = 1;
                // set filter's value.
                const filtervalue = items.label;
                // set filter's condition.
                const filtercondition = 'equal';
                // create new filter.
                const filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                // add the filter to the filter group.
                filtergroup.addfilter(filterOrOperator, filter);
            }
        }
        // add the filters.
        myTreeGrid.current!.addFilter(dataField, filtergroup);
        // apply the filters.
        myTreeGrid.current!.applyFilters();
    }, []);

    const myListBoxOnCheckChange = useCallback((event: any): void => {
        if (!handleCheckChange.current) {
            return;
        }

        if (event.args.label !== '(Select All)') {
            // update the state of the "Select All" listbox item.
            handleCheckChange.current = false;
            myListBox.current!.checkIndex(0);
            const checkedItems = myListBox.current!.getCheckedItems();
            const items = myListBox.current!.getItems();
            if (checkedItems.length === 1) {
                myListBox.current!.uncheckIndex(0);
            }
            else if (items.length !== checkedItems.length) {
                myListBox.current!.indeterminateIndex(0);
            }

            handleCheckChange.current = true;
        }
        else {
            // check/uncheck all items if "Select All" is clicked.
            handleCheckChange.current = false;
            if (event.args.checked) {
                myListBox.current!.checkAll();
            }
            else {
                myListBox.current!.uncheckAll();
            }
            handleCheckChange.current = true;
        }
    }, []);

    const myDropDownListOnSelect = useCallback((event: any): void => {
        updatemyListBox(event.args.item.value);
    }, []);

    const applyBtnOnClick = useCallback((): void => {
        const dataField = myDropDownList.current!.getSelectedItem().value;
        applyFilter(dataField);
    }, []);

    const clearBtnOnClick = useCallback((): void => {
        myTreeGrid.current!.clearFilters();
    }, []);

    const employees: any[] = [{ "EmployeeID": 1, "FirstName": "Nancy", "LastName": "Davolio", "ReportsTo": 2, "Country": "USA", "Title": "Sales Representative", "HireDate": "1992-05-01 00:00:00", "BirthDate": "1948-12-08 00:00:00", "City": "Seattle", "Address": "507 - 20th Ave. E.Apt. 2A" }, { "EmployeeID": 2, "FirstName": "Andrew", "LastName": "Fuller", "ReportsTo": null, "Country": "USA", "Title": "Vice President, Sales", "HireDate": "1992-08-14 00:00:00", "BirthDate": "1952-02-19 00:00:00", "City": "Tacoma", "Address": "908 W. Capital Way" }, { "EmployeeID": 3, "FirstName": "Janet", "LastName": "Leverling", "ReportsTo": 2, "Country": "USA", "Title": "Sales Representative", "HireDate": "1992-04-01 00:00:00", "BirthDate": "1963-08-30 00:00:00", "City": "Kirkland", "Address": "722 Moss Bay Blvd." }, { "EmployeeID": 4, "FirstName": "Margaret", "LastName": "Peacock", "ReportsTo": 2, "Country": "USA", "Title": "Sales Representative", "HireDate": "1993-05-03 00:00:00", "BirthDate": "1937-09-19 00:00:00", "City": "Redmond", "Address": "4110 Old Redmond Rd." }, { "EmployeeID": 5, "FirstName": "Steven", "LastName": "Buchanan", "ReportsTo": 2, "Country": "UK", "Title": "Sales Manager", "HireDate": "1993-10-17 00:00:00", "BirthDate": "1955-03-04 00:00:00", "City": "London", "Address": "14 Garrett Hill" }, { "EmployeeID": 6, "FirstName": "Michael", "LastName": "Suyama", "ReportsTo": 5, "Country": "UK", "Title": "Sales Representative", "HireDate": "1993-10-17 00:00:00", "BirthDate": "1963-07-02 00:00:00", "City": "London", "Address": "Coventry House Miner Rd." }, { "EmployeeID": 7, "FirstName": "Robert", "LastName": "King", "ReportsTo": 5, "Country": "UK", "Title": "Sales Representative", "HireDate": "1994-01-02 00:00:00", "BirthDate": "1960-05-29 00:00:00", "City": "London", "Address": "Edgeham Hollow Winchester Way" }, { "EmployeeID": 8, "FirstName": "Laura", "LastName": "Callahan", "ReportsTo": 2, "Country": "USA", "Title": "Inside Sales Coordinator", "HireDate": "1994-03-05 00:00:00", "BirthDate": "1958-01-09 00:00:00", "City": "Seattle", "Address": "4726 - 11th Ave. N.E." }, { "EmployeeID": 9, "FirstName": "Anne", "LastName": "Dodsworth", "ReportsTo": 5, "Country": "UK", "Title": "Sales Representative", "HireDate": "1994-11-15 00:00:00", "BirthDate": "1966-01-27 00:00:00", "City": "London", "Address": "7 Houndstooth Rd." }];
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

        const dataAdapter: any = new jqx.dataAdapter(sourceData);

    const columns = [
                { dataField: 'FirstName', minWidth: 100, text: 'FirstName', width: 200 },
                { dataField: 'LastName', text: 'LastName', width: 200 },
                { dataField: 'City', text: 'City' }
            ];
    const ready = (): void => {
                setTimeout(() => {
                    myTreeGrid.current!.expandRow(2);
                });

                updatemyListBox('FirstName');
            };
    const source = dataAdapter;
    const sourceDropdownlist = [
                { label: 'First Name', value: 'FirstName' },
                { label: 'Last Name', value: 'LastName' },
                { label: 'City', value: 'City' }
            ];

    // Event handling

    return (
        <div>
            <div style={{ float: "left", marginLeft: 20 }}>
                <div>Filter By:</div>
                <JqxDropDownList theme={'material-purple'} ref={myDropDownList}
                    onSelect={myDropDownListOnSelect}
                    width={100} selectedIndex={0} autoDropDownHeight={true} source={sourceDropdownlist}
                />
                <JqxListBox theme={'material-purple'} ref={myListBox} style={{ marginTop: 10 }}
                    onCheckChange={myListBoxOnCheckChange}
                    width={160}
                    height={250}
                    checkboxes={true}
                />
                <div style={{ marginTop: 10 }}>
                    <JqxButton theme={'material-purple'} onClick={applyBtnOnClick}>Apply Filter</JqxButton>
                    <JqxButton theme={'material-purple'} onClick={clearBtnOnClick}>Clear Filter</JqxButton>
                </div>
            </div>
            <JqxTreeGrid theme={'material-purple'} ref={myTreeGrid}
                width={600}
                sortable={true}
                source={source}
                columns={columns}
                ready={ready}
            />
        </div>
    );
};

export default App;
