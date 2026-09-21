import React, { useCallback, useMemo } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import './App.css';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxRibbon from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxribbon';

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
    const initiMainGrid = useCallback(() => {
        const mainMessages = [
            { from: 'Anthony', subject: 'Visit to the zoo', time: '09/10/2014 12:35' },
            { from: 'Peter', subject: 'Job application', time: '08/23/2014 18:13' },
            { from: 'Sarah', subject: 'The roses...', time: '08/05/2014 15:01' }
        ];
        const mainSource = {
            datafields: [
                { name: 'from', type: 'string' },
                { name: 'subject', type: 'string' },
                { name: 'time', type: 'date' }
            ],
            datatype: 'json',
            localdata: mainMessages
        };
        const mainDataAdapter = new jqx.dataAdapter(mainSource);

        const columns: IGridProps['columns'] = [
            { text: 'From', datafield: 'from', width: 100 },
            { text: 'Subject', datafield: 'subject', width: 200 },
            { text: 'Time', datafield: 'time', cellsformat: 'MMM d h:mm tt' }
        ];

        renderInto(
            <JqxGrid theme={'material-purple'}
                width={'100%'} autoheight={true} source={mainDataAdapter}
                selectionmode={'checkbox'} columns={columns} />,
            document.getElementById('mainGrid')
        );
    }, []);

    const initiSocialGrid = useCallback(() => {
        const socialMessages = [
            { from: 'PhotoPics.com', subject: 'Join us today!', time: '09/08/2014 11:00' },
            { from: 'CookMaster', subject: 'Welcome to the CookMaster forum.', time: '08/29/2014 22:33' }
        ];
        const socialSource = {
            datafields: [
                { name: 'from', type: 'string' },
                { name: 'subject', type: 'string' },
                { name: 'time', type: 'date' }
            ],
            datatype: 'json',
            localdata: socialMessages
        };
        const socialDataAdapter = new jqx.dataAdapter(socialSource);

        const columns: IGridProps['columns'] = [
            { text: 'From', datafield: 'from', width: 100 },
            { text: 'Subject', datafield: 'subject', width: 240 },
            { text: 'Time', datafield: 'time', cellsformat: 'MMM d h:mm tt' }
        ];

        renderInto(
            <JqxGrid theme={'material-purple'}
                width={'100%'} autoheight={true} source={socialDataAdapter}
                selectionmode={'checkbox'} columns={columns} />,
            document.getElementById('socialGrid')
        );
    }, []);

    const initContent = useMemo(() => (index: number) => {
        switch (index) {
            case 0:
                initiMainGrid();
                break;
            case 1:
                initiSocialGrid();
                break;
            case 2:
                renderInto(
                    <JqxButton theme={'material-purple'} width={20}>
                        <img src={'/img/refresh.png'} />
                    </JqxButton>,
                    document.getElementById('refreshButton')
                );
                break;
        }
    }, [initiMainGrid, initiSocialGrid]);

    return (
        <div>
            <div style={{
                backgroundColor: '#1C3672', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', boxSizing: 'border-box',
                color: 'White', fontSize: 'large', paddingLeft: '10px', width: '800px'
            }}>
                <img src={'/img/mail.png'} style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'bottom' }} />
                <div style={{ display: 'inline-block', fontWeight: 'bold' }}>
                    Inbox
                </div>
            </div>
            <JqxRibbon
                theme={'material-purple'}
                // @ts-ignore
                width={'100%'}
                position={'top'}
                selectionMode={'click'}
                initContent={initContent}
                animationType={'none'}
            >
                <ul style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <li style={{ marginLeft: '30px' }}>Main</li>
                    <li>Social</li>
                    <li>Promotions</li>
                </ul>
                <div>
                    <div>
                        <div id="mainGrid" style={{ marginTop: '5px', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                    </div>
                    <div>
                        <div id="socialGrid" style={{ marginTop: '5px', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                    </div>
                    <div>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>
                                        No new mail under <em>Promotions</em>.<br />
                                        <div id="refreshButton" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </JqxRibbon>
        </div>
    );
};

export default App;