import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import JqxTree, { ITreeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

const App = () => {
    const myTree = useRef<JqxTree>(null);
    const [source] = useState<ITreeProps['source']>([
        {
            expanded: true,
            icon: '/img/mailIcon.png',
            items: [
                {
                    icon: '/img/calendarIcon.png',
                    label: 'Calendar'
                },
                {
                    icon: '/img/contactsIcon.png',
                    label: 'Contacts',
                    selected: true
                }
            ],
            label: 'Mail'
        },
        {
            expanded: true,
            icon: '/img/folder.png',
            items: [
                { icon: '/img/folder.png', label: 'Admin' },
                { icon: '/img/folder.png', label: 'Corporate' },
                { icon: '/img/folder.png', label: 'Finance' },
                { icon: '/img/folder.png', label: 'Other' }
            ],
            label: 'Inbox'
        },
        { icon: '/img/recycle.png', label: 'Deleted Items' },
        { icon: '/img/notesIcon.png', label: 'Notes' },
        { iconsize: 14, icon: '/img/settings.png', label: 'Settings' },
        { icon: '/img/favorites.png', label: 'Favorites' }
    ]);

    useEffect(() => {
        myTree.current?.focus();
    }, []);

    return (
        <JqxTree
            theme="material-purple"
            ref={myTree}
            style={{ marginLeft: 60, float: 'left' }}
            width={250}
            height={250}
            rtl={true}
            source={source}
        />
    );
};

export default App;