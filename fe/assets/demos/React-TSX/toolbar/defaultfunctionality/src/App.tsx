import React, { useRef, useMemo } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import './App.css';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtoolbar';

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
    const initTools = useMemo(() => (
        (type: any, index: any, tool: any, menuToolIninitialization: any) => {
            const icon = document.createElement('div');
            if (type === "toggleButton") {
                icon.className = 'jqx-editor-toolbar-icon jqx-editor-toolbar-icon-arctic buttonIcon ';
            }
            switch (index) {
                case 0:
                    icon.className += "jqx-editor-toolbar-icon-bold jqx-editor-toolbar-icon-bold-arctic";
                    icon.setAttribute("title", "Bold");
                    icon.style.marginTop = '-5px';
                    tool[0].appendChild(icon);
                    break;
                case 1:
                    icon.className += "jqx-editor-toolbar-icon-italic jqx-editor-toolbar-icon-italic-arctic";
                    icon.setAttribute("title", "Italic");
                    icon.style.marginTop = '-5px';
                    tool[0].appendChild(icon);
                    break;
                case 2:
                    icon.className += "jqx-editor-toolbar-icon-underline jqx-editor-toolbar-icon-underline-arctic";
                    icon.setAttribute("title", "Underline");
                    icon.style.marginTop = '-5px';
                    tool[0].appendChild(icon);
                    break;
                case 3:
                    tool.jqxToggleButton({ width: 80, toggled: true });
                    tool.text("Enabled");
                    tool.on("click", () => {
                        const toggled = tool.jqxToggleButton("toggled");
                        if (toggled) {
                            tool.text("Enabled");
                        } else {
                            tool.text("Disabled");
                        }
                    });
                    break;
                case 4:
                    tool.jqxDropDownList({ width: 130, source: ["<span style='font-family: Courier New;'>Courier New</span>", "<span style='font-family: Times New Roman;'>Times New Roman</span>", "<span style='font-family: Verdana;'>Verdana</span>"], selectedIndex: 1 });
                    break;
                case 5:
                    tool.jqxComboBox({ width: 50, source: [8, 9, 10, 11, 12, 14, 16, 18, 20], selectedIndex: 3 });
                    break;
                case 6:
                    const input = <JqxInput theme={'material-purple'} width={200} placeHolder={"Type here to search..."} />;
                    renderInto(input, tool[0]);
                    break;
                case 7:
                    const button = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = '/img/administrator.png';
                    img.title = 'Custom tool';
                    button.appendChild(img);
                    tool[0].appendChild(button);
                    tool.jqxButton({ height: 15 });
                    break;
            }
        }
    ), []);
    const tools = 'toggleButton toggleButton toggleButton | toggleButton | dropdownlist combobox | input | custom';

    return (
        <JqxToolbar
            width={'100%'}
            height={35}
            tools={tools}
            initTools={initTools}
        />
    );
};

export default App;