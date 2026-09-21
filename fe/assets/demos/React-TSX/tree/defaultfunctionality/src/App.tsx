import React, { useState } from 'react';
import JqxExpander from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxexpander';
import JqxTree from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

const App = () => {
    const [source] = useState([
        {
            expanded: true,
            icon: "/img/mailIcon.png",
            items: [
                {
                    icon: "/img/calendarIcon.png",
                    label: "Calendar"
                },
                {
                    icon: "/img/contactsIcon.png",
                    label: "Contacts",
                    selected: true
                }
            ],
            label: "Mail"
        },
        {
            expanded: true,
            icon: "/img/folder.png",
            items: [
                { icon: "/img/folder.png", label: "Admin" },
                { icon: "/img/folder.png", label: "Corporate" },
                { icon: "/img/folder.png", label: "Finance" },
                { icon: "/img/folder.png", label: "Other" }
            ],
            label: "Inbox"
        },
        { icon: "/img/recycle.png", label: "Deleted Items" },
        { icon: "/img/notesIcon.png", label: "Notes" },
        { iconsize: 14, icon: "/img/settings.png", label: "Settings" },
        { icon: "/img/favorites.png", label: "Favorites" }
    ]);
    const [toggle] = useState<'none'>('none');

    return (
        <JqxExpander theme="material-purple" width={300} height={400} showArrow={false} toggleMode={toggle}>
            <div>Folders</div>
            <div style={{ overflow: 'hidden', padding: 0 }}>
                <JqxTree theme="material-purple" width="100%" height="100%" source={source} />
            </div>
        </JqxExpander>
    );
};

export default App;