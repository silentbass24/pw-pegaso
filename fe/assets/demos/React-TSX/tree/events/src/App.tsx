import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import JqxPanel from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel';
import JqxTree, { ITreeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

function App() {
  const myTree = useRef<JqxTree>(null);
  const myPanel = useRef<JqxPanel>(null);

  const [source] = useState<ITreeProps['source']>([
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

  const myTreeOnSelect = useCallback((event: any) => {
    const args = event.args;
    const item = myTree.current!.getItem(args.element);
    myPanel.current!.prepend('<div style="margin-top: 5px;">Selected: ' + item.label + '</div>');
  }, []);

  const myTreeOnExpand = useCallback((event: any) => {
    const args = event.args;
    const item = myTree.current!.getItem(args.element);
    myPanel.current!.prepend('<div style="margin-top: 5px;">Expanded: ' + item.label + '</div>');
  }, []);

  const myTreeOnCollapse = useCallback((event: any) => {
    const args = event.args;
    const item = myTree.current!.getItem(args.element);
    myPanel.current!.prepend('<div style="margin-top: 5px;">Collapsed: ' + item.label + '</div>');
  }, []);

  return (
    <div>
      <JqxTree
        theme="material-purple"
        ref={myTree}
        style={{ marginLeft: '60px', float: 'left' }}
        onSelect={myTreeOnSelect}
        onExpand={myTreeOnExpand}
        onCollapse={myTreeOnCollapse}
        width={250}
        source={source}
      />
      <div style={{ marginLeft: '20px', float: 'left' }}>
        <div>
          <span>Events:</span>
          <JqxPanel theme="material-purple" ref={myPanel} style={{ border: 'none' }} width={250} height={200} />
        </div>
      </div>
    </div>
  );
}

export default App;