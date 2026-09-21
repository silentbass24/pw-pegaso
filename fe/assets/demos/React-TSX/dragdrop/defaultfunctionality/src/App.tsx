import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import './App.css';

import JqxDragDrop from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdragdrop';
import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';

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
    const myGrid = useRef<JqxGrid>(null);

    const addClasses = useCallback(() => {
        const catalog = document.getElementsByClassName('draggable-demo-catalog');
        Array.prototype.forEach.call(catalog, (catalogItem: HTMLDivElement) => {
            catalogItem.className += 'jqx-scrollbar-state-normal-' + theme;
        });

        const title = document.getElementsByClassName('draggable-demo-title');
        Array.prototype.forEach.call(title, (titleItem: HTMLDivElement) => {
            titleItem.className += 'jqx-expander-header-' + theme;
            titleItem.className += 'jqx-expander-header-expanded-' + theme;
        });

        const total = document.getElementsByClassName('draggable-demo-catalog');
        Array.prototype.forEach.call(total, (totalItem: HTMLDivElement) => {
            totalItem.className += 'jqx-expander-header-' + theme;
            totalItem.className += 'jqx-expander-header-expanded-' + theme;
        });

        if (theme === 'shinyblack') {
            const shop = document.getElementsByClassName('draggable-demo-shop');
            Array.prototype.forEach.call(shop, (shopItem: HTMLDivElement) => {
                shopItem.style.backgroundColor = '#555';
            });

            const product = document.getElementsByClassName('draggable-demo-product');
            Array.prototype.forEach.call(product, (productItem: HTMLDivElement) => {
                productItem.style.backgroundColor = '#999';
            });
        }
    }, []);

    const productsRendering = useCallback(() => {
        const products: any = {
            'Cool Story T-shirt': {
                pic: 'cool-story-bro.png',
                price: 20
            },
            'Dodgers T-shirt': {
                pic: '2-sided-dodgers-bankrupt-t-shirt-ash.png',
                price: 21
            },
            'Don\'t care T-shirt': {
                pic: 'honey-badger-don-t-care.png',
                price: 19
            },
            'Guitar T-shirt': {
                pic: 'scott-pilgrim-red-rock-band.png',
                price: 24
            },
            'Loading T-shirt': {
                pic: 'brown-loading-bar-computer-geek.png',
                price: 25
            },
            'Lucky T-shirt': {
                pic: 'bright-green-gettin-lucky-in-kentucky.png',
                price: 18
            },
            'Misfits T-shirt': {
                pic: 'misfits-sf-giants-white.png',
                price: 21
            },
            'Retro Rock T-shirt': {
                pic: 'black-retro-rock-band-guitar-controller.png',
                price: 15
            },
            'The beard T-shirt': {
                pic: 'fear-the-beard.png',
                price: 17
            }
        };

        const catalog = document.getElementById('catalog');
        let product: any;
        let left = 0;
        let top = 0;
        let counter = 0;

        for (const name of Object.keys(products)) {

            if (counter !== 0 && counter % 3 === 0) {
                top += 147;
                left = 0;
            }

            const element = document.createElement('div');
            const id = counter;

            product = products[name];

            catalog!.appendChild(element);

            const style = { left: `${left}px`, top: `${top}px` };

            const widget = React.createRef<JqxDragDrop>();

            const dropTargetEnterHandler = (event: any) => {
                if (event.args) {
                    event.args.target[0].style.border = '2px solid #000';
                }
                onCart.current = true;
                widget!.current!.setOptions({ dropAction: 'none' });
            };

            const dropTargetLeave = (event: any) => {
                if (event.args) {
                    event.args.target[0].style.border = '2px solid #aaa';
                }
                onCart.current = false;
                widget!.current!.setOptions({ dropAction: 'default' });
            };

            const dragEndHandler = (event: any) => {
                const cartElement = document.getElementById('cart');
                cartElement!.style.border = '2px dashed #aaa';
                if (onCart.current) {
                    const price = product.price;
                    addItem({ price, name });
                    onCart.current = false;
                }
            };

            const dragStartHandler = () => {
                const cartElement = document.getElementById('cart');
                cartElement!.style.border = '2px solid #aaa';
            };

            const target = [document.querySelector('#cart')];
            renderInto(
                <JqxDragDrop  ref={widget} className={`draggable-demo-product jqx-rc-all dragDrop${id}`} style={style}
                    onDropTargetEnter={dropTargetEnterHandler} onDropTargetLeave={dropTargetLeave}
                    onDragEnd={dragEndHandler} onDragStart={dragStartHandler}
                    dropTarget={target} revert={true}>
                    <div className={`jqx-rc-t draggable-demo-product-header jqx-widget-header-${theme} jqx-fill-state-normal-${theme}`}>
                        <div className="draggable-demo-product-header-label">{name}</div>
                    </div>
                    <div className={`jqx-fill-state-normal-${theme} draggable-demo-product-price`}>
                        Price: <strong>${product.price}</strong>
                    </div>
                    <img src={`https://www.jqwidgets.com/react/images/t-shirts/${product.pic}`} alt={name} className="jqx-rc-b" />
                </JqxDragDrop>,

                element,

                () => {
                    const widgetChilds = document.querySelector(`.dragDrop${id}`)!.children;
                    const child = widgetChilds[1] as HTMLDivElement;
                    element.addEventListener('mouseenter', () => {
                        child.style.opacity = '0.9';
                        child.style.display = 'block';
                    });
                    element.addEventListener('mouseleave', () => {
                        child.style.opacity = '0';
                        child.style.display = 'none';
                    });
                }
            );

            left += 127;
            counter += 1;
        }
    }, []);

    const addItem = useCallback((item: any) => {
        const index = getItemIndex(item.name);
        const product = item;
        if (index >= 0) {
            const temp = cartItems.current;
            temp[index].count += 1;
            cartItems.current = temp;
            updateGridRow(index, cartItems.current[index]);
        } else {
            const id = cartItems.current.length;
            const newItem = {
                count: 1, index: id, name: product.name,
                price: product.price,
                remove: '<div style="text-align: center; cursor: pointer; width: 53px;"' +
                    'id="draggable-demo-row-' + id + '">X</div>'
            };
            const temp = cartItems.current;
            temp.push(newItem)
            cartItems.current = temp;
            addGridRow(newItem);
        }
        updatePrice(item.price);
    }, []);

    const updatePrice = useCallback((price: any) => {
        totalPrice.current = totalPrice.current + parseInt(price, 10)
        document.getElementById('total')!.innerHTML = '$ ' + totalPrice.current;
    }, []);

    const addGridRow = useCallback((row: any) => {
        myGrid.current!.addrow(null, row);
    }, []);

    const updateGridRow = useCallback((id: number, row: any) => {
        const rowID = myGrid.current!.getrowid(id);
        myGrid.current!.updaterow(rowID, row);
    }, []);

    const removeGridRow = useCallback((id: any) => {
        const rowID = myGrid.current!.getrowid(id);
        myGrid.current!.deleterow(rowID);
    }, []);

    const getItemIndex = useCallback((name: any): number => {
        const items = cartItems.current;
        for (let i = 0; i < items.length; i += 1) {
            if (items[i].name === name) {
                return i;
            }
        }
        return -1;
    }, []);

    const gridOnCellClick = useCallback((event: any): void => {
        const index = event.args.rowindex;
        if (event.args.datafield === 'remove') {
            const item = cartItems.current[index];
            if (!item) {
                return;
            }
            if (item.count > 1) {
                item.count -= 1;
                updateGridRow(index, item);
            }
            else {
                const temp = cartItems.current;
                temp.splice(index, 1);
                cartItems.current = temp;
                removeGridRow(index);
            }
            updatePrice(-item.price);
        }
    }, []);

    const theme: any = jqx.theme;
    const cartItems = useRef<any[]>([]);
    const totalPrice = useRef<number>(0);
    const onCart = useRef<boolean>(false);

    const columns = [
                { text: 'Item', datafield: 'name', width: 120 },
                { text: 'Count', datafield: 'count', width: 50 },
                { text: 'Remove', datafield: 'remove', width: 60 }
            ];

    useEffect(() => {
        productsRendering();
        addClasses();
    }, []);

    return (
        <div id="shop" className="draggable-demo-shop jqx-rc-all">
            <div id="catalog" className="draggable-demo-catalog jqx-rc-all" />
            <div className="draggable-demo-cart-wrapper jqx-rc-all">
                <div className="draggable-demo-title jqx-rc-t">Shopping Cart</div>
                <div id="cart" className="draggable-demo-cart jqx-rc-all">
                    <JqxGrid theme={'material-purple'} ref={myGrid} onCellclick={gridOnCellClick}
                        width={230} height={335} columns={columns}
                        selectionmode={'none'} keyboardnavigation={false} />
                </div>
                <div className="draggable-demo-total">Total: <strong><span id="total">$ 0</span></strong></div>
            </div>
            <div style={{ clear: 'both' }} />
        </div>
    );
};

export default App;
