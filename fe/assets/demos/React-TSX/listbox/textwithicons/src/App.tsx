import * as React from 'react';
import { useState } from 'react';
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';

function App() {
    const [source] = useState([
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/numberinput.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxNumberInput</span></div>", title: 'jqxNumberInput' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/progressbar.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxProgressBar</span></div>", title: 'jqxProgressBar' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/calendar.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxCalendar</span></div>", title: 'jqxCalendar' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/button.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxButton</span></div>", title: 'jqxButton' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/dropdownlist.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxDropDownList</span></div>", title: 'jqxDropDownList' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/listbox.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxListBox</span></div>", title: 'jqxListBox' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/tooltip.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxTooltip</span></div>", title: 'jqxTooltip' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/scrollbar.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxScrollBar</span></div>", title: 'jqxScrollBar' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/datetimeinput.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxDateTimeInput</span></div>", title: 'jqxDateTimeInput' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/expander.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxExpander</span></div>", title: 'jqxExpander' },
        { html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/menu.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxMenu</span></div>", title: 'jqxMenu' }
    ]);

    return (
        <JqxListBox theme="material-purple" width={200} height={250} source={source} />
    );
}

export default App;