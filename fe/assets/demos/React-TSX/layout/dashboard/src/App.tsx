import * as React from 'react';
import { useRef, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import './App.css';

import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxDataTable, { IDataTableProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable';
import JqxLayout, { ILayoutProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlayout';
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';

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
    const teamsDataTable = useRef<JqxDataTable>(null);

    const initTeamDataTable = useCallback(() => {
        const teamData =
            [{
                lead: 'Petra Wilson',
                team: 'Sales Team'
            }, {
                lead: 'Michael Nagase',
                team: 'Support Team',
            }];
        const source =
        {
            dataFields: [{
                name: 'team',
                type: 'string'
            }, {
                name: 'lead',
                type: 'string'
            }],
            dataType: "json",
            localdata: teamData
        };
        const dataAdapter = new jqx.dataAdapter(source);
        const ready = () => {
            setTimeout(() => teamsDataTable.current!.selectRow(0));
        };
        const columns: IDataTableProps['columns'] = [
            {
                dataField: 'team',
                text: 'Team',
                width: 120
            }, {
                dataField: 'lead',
                text: 'Lead'
            }
        ];

        const onRowSelect = (event: any) => {
            const boundIndex = event.args.boundIndex;
            let contacts;
            let staff;
            let projects;
            let projectsTimeline;
            let projectsHistory;

            if (boundIndex === 0) {
                team.current = 'Sales';
                contacts = teamSalesContacts;
                staff = teamSalesStaff;
                projects = teamSalesProjects;
                projectsTimeline = teamSalesProjectsTimeline;
                projectsHistory = project1Data;
            } else {
                team.current = 'Support';
                contacts = teamSupportContacts;
                staff = teamSupportStaff;
                projects = teamSupportProjects;
                projectsTimeline = teamSupportProjectsTimeline;
                projectsHistory = project3Data;
            }
            const contactsTable = document.getElementById('contactsTable');
            const staffDiv = document.getElementById('staffDiv');
            const projectsListBox = document.getElementById('projectsListBox');
            const projectsTimelineDiv = document.getElementById('projectsTimelineDiv');
            const projectHistoryChart = document.getElementById('projectHistoryChart');

            if (contactsTable) {
                contactsTable.innerHTML = contacts;
            }
            if (staffDiv) {
                staffDiv.innerHTML = staff;
            }
            if (projectsListBox) {

                renderInto(
                    <JqxListBox theme={'material-purple'} source={projects} selectedIndex={0} />,
                    document.getElementById('projectsListBox')
                );
            }
            if (projectsTimelineDiv) {
                projectsTimelineDiv.innerHTML = projectsTimeline;
            }
            if (projectHistoryChart) {
                renderInto(
                    <JqxChart theme={'material-purple'} style={{ width: '100%', height: '100%' }} source={projectsHistory} />,
                    document.getElementById('projectHistoryChart')
                );
            }
        };

        renderInto(
            <JqxDataTable theme={'material-purple'} ref={teamsDataTable} onRowSelect={onRowSelect} width={'100%'} height={'100%'}
                source={dataAdapter} ready={ready} columns={columns} />,
            document.getElementById('teamsDataTable')
        );
    }, []);

    const initProjectsListBox = useCallback(() => {

        const projectHistoryChart = document.getElementById('projectHistoryChart');

        const onSelect = (event: any) => {
            if (projectHistoryChart) {
                const args = event.args;
                if (args) {
                    const label = args.item.label;
                    let source: any;

                    switch (label) {
                        case '2015 marketing research': source = project1Data;
                            break;
                        case 'Advertisement revenue increase': source = project2Data;
                            break;
                        case 'Governmental support task': source = project3Data;
                            break;
                        case 'Conference preparation': source = project4Data;
                            break;
                        case 'HelloCompany support task': source = project5Data;
                            break;
                    }

                    renderInto(
                        <JqxChart theme={'material-purple'} style={{ width: '100%', height: '100%' }} source={source} />,
                        document.getElementById('projectHistoryChart')
                    );
                }
            }
        }

        renderInto(
            <JqxListBox theme={'material-purple'} onSelect={onSelect} width={'100%'} height={'100%'}
                source={teamSalesProjects} selectedIndex={0} />,
            document.getElementById('projectsListBox')
        );
    }, []);

    const initProjectHistoryChart = useCallback(() => {

        const description = 'Overview of project resources and solved issues';
        const titlePadding = { left: 90, top: 0, right: 0, bottom: 10 };
        const xAxis = { dataField: 'Month', gridLines: { visible: false } };
        const valueAxis = {
            description: 'Resources (in relative units)',
            maxValue: 100,
            minValue: 0,
            unitInterval: 10
        };
        const seriesGroups: IChartProps['seriesGroups'] = [{
            columnsGapPercent: 30,
            series: [{
                dataField: 'Resources',
                displayText: 'Resources spent'
            }],
            seriesGapPercent: 0,
            type: 'column',
        }, {
            columnsGapPercent: 30,
            series: [{
                dataField: 'Issues',
                displayText: 'Issues'
            }],
            seriesGapPercent: 0,
            type: 'line'
        }];

        renderInto(
            <JqxChart theme={'material-purple'} style={{ width: '100%', height: '100%' }} title={'Project History'} description={description} showBorderLine={false} colorScheme={'scheme05'}
                source={project1Data} titlePadding={titlePadding} xAxis={xAxis} valueAxis={valueAxis} seriesGroups={seriesGroups} />,
            document.getElementById('projectHistoryChart')
        );
    }, []);

    const teamSalesContacts = '<tr><td style="width: 100px;"><img src="/img/janet.png" /></td><td style=""><strong>Team lead:</strong> Petra Wilson<br /><strong>Phone: </strong>555-313-899<br /><strong>Email: </strong>petraw@company.com</td></tr>';
    const teamSalesStaff = '<strong>Petra Wilson</strong> Team lead, Phone: 555-313-899<br /><strong>Jenny Oswald</strong> Marketing consultant, Phone: 555-313-333<br /><strong>Peter Tennant</strong> Accountant, Phone: 555-313-161';
    const teamSalesProjects = ['2015 marketing research', 'Advertisement revenue increase'];
    const teamSalesProjectsTimeline = '<strong>January - December</strong><br />&nbsp;2015 marketing research<br /><br /><strong>February - June</strong><br />&nbsp;Advertisement revenue increase';
    const teamSupportContacts = '<tr><td style="width: 100px;"><img src="/img/steven.png" /></td><td style=""><strong>Team lead:</strong> Michael Nagase<br /><strong>Phone: </strong>555-313-643<br /><strong>Email: </strong>nagase@company.com</td></tr>';
    const teamSupportStaff = '<strong>Michael Nagase</strong> Team lead, Phone: 555-313-643<br /><strong>Sam Forrester</strong> Chief support officer, Phone: 555-313-644<br /><strong>Dean Milhouse</strong> Support officer, Phone: 555-313-188';
    const teamSupportProjects = ['Governmental support task', 'Conference preparation', 'HelloCompany support task'];
    const teamSupportProjectsTimeline = '<strong>September - December</strong><br />&nbsp;Governmental support task<br /><br /><strong>July - August</strong><br />&nbsp;Conference preparation<br /><br /><strong>January - December</strong><br />&nbsp;HelloCompany support task';
    const project1Data = [{ Month: 'January', Resources: 50, Issues: 2 }, { Month: 'February', Resources: 90, Issues: 7 }, { Month: 'March', Resources: 93, Issues: 15 }, { Month: 'April', Resources: 70, Issues: 36 }, { Month: 'May', Resources: 70, Issues: 20 }, { Month: 'June', Resources: 70, Issues: 20 }, { Month: 'July', Resources: 68, Issues: 16 }, { Month: 'August', Resources: 69, Issues: 9 }, { Month: 'September', Resources: 33, Issues: 2 }, { Month: 'October', Resources: 50, Issues: 0 }, { Month: 'November', Resources: 13, Issues: 0 }, { Month: 'December', Resources: 20, Issues: 0 }];
    const project2Data = [{ Month: 'January', Resources: null, Issues: null }, { Month: 'February', Resources: 90, Issues: 38 }, { Month: 'March', Resources: 100, Issues: 45 }, { Month: 'April', Resources: 80, Issues: 13 }, { Month: 'May', Resources: 27, Issues: 11 }, { Month: 'June', Resources: 20, Issues: 7 }, { Month: 'July', Resources: null, Issues: null }, { Month: 'August', Resources: null, Issues: null }, { Month: 'September', Resources: null, Issues: null }, { Month: 'October', Resources: null, Issues: null }, { Month: 'November', Resources: null, Issues: null }, { Month: 'December', Resources: null, Issues: null }];
    const project3Data = [{ Month: 'January', Resources: null, Issues: null }, { Month: 'February', Resources: null, Issues: null }, { Month: 'March', Resources: null, Issues: null }, { Month: 'April', Resources: null, Issues: null }, { Month: 'May', Resources: null, Issues: null }, { Month: 'June', Resources: null, Issues: null }, { Month: 'July', Resources: null, Issues: null }, { Month: 'August', Resources: null, Issues: null }, { Month: 'September', Resources: 10, Issues: 1 }, { Month: 'October', Resources: 80, Issues: 15 }, { Month: 'November', Resources: 99, Issues: 30 }, { Month: 'December', Resources: 20, Issues: 0 }];
    const project4Data = [{ Month: 'January', Resources: null, Issues: null }, { Month: 'February', Resources: null, Issues: null }, { Month: 'March', Resources: null, Issues: null }, { Month: 'April', Resources: null, Issues: null }, { Month: 'May', Resources: null, Issues: null }, { Month: 'June', Resources: null, Issues: null }, { Month: 'July', Resources: 70, Issues: 3 }, { Month: 'August', Resources: 11, Issues: 5 }, { Month: 'September', Resources: null, Issues: null }, { Month: 'October', Resources: null, Issues: null }, { Month: 'November', Resources: null, Issues: null }, { Month: 'December', Resources: null, Issues: null }];
    const project5Data = [{ Month: 'January', Resources: 20, Issues: 0 }, { Month: 'February', Resources: 20, Issues: 2 }, { Month: 'March', Resources: 33, Issues: 12 }, { Month: 'April', Resources: 42, Issues: 16 }, { Month: 'May', Resources: 80, Issues: 24 }, { Month: 'June', Resources: 78, Issues: 28 }, { Month: 'July', Resources: 68, Issues: 16 }, { Month: 'August', Resources: 10, Issues: 2 }, { Month: 'September', Resources: 47, Issues: 12 }, { Month: 'October', Resources: 50, Issues: 10 }, { Month: 'November', Resources: 8, Issues: 1 }, { Month: 'December', Resources: 15, Issues: 3 }];
    const team = useRef<any>('Sales');

    const layout = [{
                items: [{
                    allowPin: false,
                    items: [{
                        height: 300,
                        items: [{
                            contentContainer: 'TeamsPanel',
                            initContent: () => {
                                initTeamDataTable();
                            },
                            title: 'Teams',
                            type: 'layoutPanel'
                        }],
                        pinnedHeight: 30,
                        type: 'tabbedGroup'
                    }, {
                        allowClose: true,
                        allowPin: false,
                        height: 300,
                        items: [{
                            contentContainer: 'ProjectsPanel',
                            initContent: () => {
                                initProjectsListBox();
                            },
                            title: 'Team Projects',
                            type: 'layoutPanel',
                        }, {
                            contentContainer: 'ProjectsTimelinePanel',
                            initContent: () => {
                                const projectsTimelineDiv = document.getElementById('projectsTimelineDiv');
                                if (team.current === 'Sales') {
                                    projectsTimelineDiv!.innerHTML = teamSalesProjectsTimeline;
                                } else {
                                    projectsTimelineDiv!.innerHTML = teamSupportProjectsTimeline;
                                }
                            },
                            title: 'Projects Timeline',
                            type: 'layoutPanel'
                        }],
                        pinnedHeight: 30,
                        type: 'tabbedGroup'
                    }],
                    orientation: 'vertical',
                    type: 'layoutGroup',
                    width: 300
                }, {
                    allowPin: false,
                    items: [{
                        height: 200,
                        items: [{
                            contentContainer: 'ContactsPanel',
                            initContent: () => {
                                document.getElementById('contactsTable')!.innerHTML = teamSalesContacts;
                            },
                            title: 'Contacts',
                            type: 'layoutPanel',
                        }, {
                            contentContainer: 'StaffPanel',
                            initContent: () => {
                                const staffDiv = document.getElementById('staffDiv');
                                if (team.current === 'Sales') {
                                    staffDiv!.innerHTML = teamSalesStaff;
                                } else {
                                    staffDiv!.innerHTML = teamSupportStaff;
                                }
                            },
                            title: 'Staff',
                            type: 'layoutPanel'
                        }],
                        pinnedHeight: 30,
                        type: 'tabbedGroup',
                    }, {
                        allowPin: false,
                        height: 400,
                        items: [{
                            contentContainer: 'ProjectHistoryPanel',
                            initContent: () => {
                                initProjectHistoryChart();
                            },
                            title: 'Project History',
                            type: 'layoutPanel'
                        }],
                        pinnedHeight: 30,
                        type: 'tabbedGroup'
                    }],
                    orientation: 'vertical',
                    pinnedWidth: 80,
                    type: 'layoutGroup',
                    width: 500
                }],
                orientation: 'horizontal',
                type: 'layoutGroup'
            }];

    return (
        <JqxLayout theme={'material-purple'}
            // @ts-ignore
            width={'100%'} height={600} layout={layout} contextMenu={true}>
            <div data-container={'TeamsPanel'}>
                <div id="teamsDataTable" style={{ height: '100%' }} className="no-border" />
            </div>
            <div data-container={'ProjectsPanel'}>
                <div id="projectsListBox" className="no-border" />
            </div>
            <div data-container={'ProjectsTimelinePanel'}>
                <div id="projectsTimelineDiv" style={{ margin: '5px 0 0 5px' }} />
            </div>
            <div data-container={'ContactsPanel'}>
                <table id="contactsTable" style={{ margin: '20px' }} />
            </div>
            <div data-container={'StaffPanel'}>
                <div id="staffDiv" className="no-border" style={{ marginLeft: '5px', margin: '20px' }} />
            </div>
            <div data-container={'ProjectHistoryPanel'}>
                <div id="projectHistoryChart" style={{ border: 'none', width: '99.9%', height: '100%' }} />
            </div>
        </JqxLayout>
    );
};

export default App;
