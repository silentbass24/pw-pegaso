import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import JqxTree, { ITreeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

function App() {
  const myTree = useRef<JqxTree>(null);
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
        { icon: "/img/folder.png", label: "Other" },
      ],
      label: "Inbox"
    },
    { icon: "/img/recycle.png", label: "Deleted Items" },
    { icon: "/img/notesIcon.png", label: "Notes" },
    { iconsize: 14, icon: "/img/settings.png", label: "Settings" },
    { icon: "/img/favorites.png", label: "Favorites" }
  ]);

  useEffect(() => {
    myTree.current?.focus();
  }, []);

  return (
    <div>
      <JqxTree
        theme="material-purple"
        ref={myTree}
        style={{ tabindex: 1, float: 'left' } as React.CSSProperties}
        width={250}
        height={350}
        source={source}
      />
      <div style={{ fontFamily: 'Verdana', fontSize: '12px', width: '400px', marginLeft: '20px', float: 'left' }}>
        <ul>
          <li><b>Tab</b> - Like other widgets, the jqxTree widget receives focus by tabbing into it. Once focus is received, users will be able to use the keyboard to change the selection. A second tab will take the user out of the widget.</li>
          <li><b>Shift+Tab</b> - reverses the direction of the tab order. Once in the widget, a Shift+Tab will take the user to the previous focusable element in the tab order.</li>
          <li><b>Up and Down</b> arrow keys - move between visible items.</li>
          <li><b>Left Arrow</b> key - on an expanded item, collapses the item.</li>
          <li><b>Left Arrow</b> key - on a collapsed or end item moves focus to the item's parent item.</li>
          <li><b>Right Arrow</b> key - on a collapsed item expands the item.</li>
          <li><b>Right Arrow</b> key - on an expanded item, moves to the first child item, or does nothing on an end item.</li>
          <li><b>Home</b> key - moves to the top item in the tree view.</li>
          <li><b>End</b> key - moves to the last item in the tree view.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;