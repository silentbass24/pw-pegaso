import React, { useRef, useState, useCallback } from 'react'
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import './App.css'
import JqxSplitter from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxsplitter'
import JqxTabs, { ITabsProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtabs'

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
  const splitter = useRef<JqxSplitter>(null)
  const splitterContainer = useRef<HTMLDivElement>(null)
  const splitter2Container = useRef<HTMLDivElement>(null)

  const initTabContent = useCallback((tab: number) => {
    if (tab === 0) {
      const splitterElement = (
        <JqxSplitter
          theme="material-purple"
          ref={splitter}
          height="100%"
          width="100%"
          panels={[{ size: '50%' }]}
        >
          <div>Content 1.1</div>
          <div>Content 1.2</div>
        </JqxSplitter>
      )
      if (splitterContainer.current) {
        renderInto(splitterElement, splitterContainer.current)
      }
    } else {
      const splitter2Element = (
        <JqxSplitter
          theme="material-purple"
          ref={splitter}
          height="100%"
          width="100%"
          panels={[{ size: '50%' }]}
          orientation="horizontal"
        >
          <div>Content 2.1</div>
          <div>Content 2.2</div>
        </JqxSplitter>
      )
      if (splitter2Container.current) {
        renderInto(splitter2Element, splitter2Container.current)
      }
    }
  }, [])

  const tabsProps: ITabsProps = {
    initTabContent,
  }

  return (
    <JqxTabs
      theme="material-purple"
      className="jqx-hideborder jqx-hidescrollbars"
      width={850}
      height={850}
      {...tabsProps}
    >
      <ul>
        <li style={{ marginLeft: 30 }}>Tab 1</li>
        <li>Tab 2</li>
      </ul>
      <div className="jqx-hidescrollbars jqx-hideborder" ref={splitterContainer} />
      <div className="jqx-hidescrollbars jqx-hideborder" ref={splitter2Container} />
    </JqxTabs>
  )
}

export default App