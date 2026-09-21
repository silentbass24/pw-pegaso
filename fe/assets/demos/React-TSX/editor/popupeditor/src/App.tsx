import * as React from 'react'
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxEditor from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxeditor'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow'

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

function App() {
  const myWindow = React.useRef<JqxWindow>(null)

  const btnOnClick = React.useCallback(() => {
    myWindow.current!.open()
    renderInto(
      <JqxEditor
        theme={'material-purple'}
        width={'100%'}
        height={'99%'}
        tools={'bold italic underline font size'}
      />,
      document.querySelector('#myEditor')
    )
  }, [])

  return (
    <div>
      <JqxButton theme="material-purple" onClick={btnOnClick} width={100}>
        Open Editor
      </JqxButton>
      <JqxWindow
        theme="material-purple"
        ref={myWindow}
        width={350}
        height={400}
        maxWidth={800}
        autoOpen={false}
        resizable={false}
        position="top, left"
      >
        <div>jqxEditor</div>
        <div id="myEditor" />
      </JqxWindow>
    </div>
  )
}

export default App