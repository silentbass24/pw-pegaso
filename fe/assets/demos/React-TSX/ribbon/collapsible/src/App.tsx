import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import './App.css';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxRibbon, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxribbon';

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
    const myRibbon = useRef<JqxRibbon>(null);
    const content = useRef<HTMLDivElement>(null);



    const onChange = useCallback((event: any): void => {
        const checked = event.args.checked;
        myRibbon.current!.setOptions({ mode: checked ? "popup" : "default" });
    }, []);

    const generateContent = useCallback(() => {
        const records = getRecords();
        let ribbonHTML = '';

        for (let j = 0; j < records.length; j++) {
            const rowData = records[j];
            const laptops = rowData.laptops;
            let container = '<div style="padding-left: 15px;">';
            for (let i = 0; i < laptops.length; i++) {
                const laptop = laptops[i];
                let item = '<div style="float: left; width: 220px; overflow: hidden; white-space: nowrap; height: 275px;">';
                let image = '<div style="margin: 5px; margin-bottom: 3px;">';
                const imgurl = laptop.img;
                const img = '<img width=160 height=120 style="display: block;" src="' + imgurl + '"/>';
                image += img;
                image += '</div>';
                let info = '<div style="margin: 5px; margin-left: 20px; margin-bottom: 3px;">';
                info += '<div><i>' + laptop.model + '</i></div>';
                info += '<div>Price: $' + laptop.price + '</div>';
                info += '<div>RAM: ' + laptop.ram + '</div>';
                info += '<div>HDD: ' + laptop.hdd + '</div>';
                info += '<div>CPU: ' + laptop.cpu + '</div>';
                info += '<div>Display: ' + laptop.display + '</div>';
                info += '</div>';
                const buy = '<div class="buy" id="buy' + j + i + '" #buy style="margin: 5px; left: -40px; position: relative; margin-left: 50%; margin-bottom: 3px;">Buy</div>';

                item += image;
                item += info;
                item += buy;
                item += '</div>';
                container += item;
            }

            container += '</div>';
            ribbonHTML += container;
        };

        return ribbonHTML;
    }, []);

    const getRecords = useCallback((): any => {

        const data: any[] = [
            {
                laptops: [
                    { img: '/img/l-16.jpg', ram: '4GB DD3', cpu: 'Intel Core i5-3317U', price: 1899, display: 13.3, hdd: '128GB SSD', model: 'ASUS TAICHI31-CX009H' },
                    { img: '/img/l-17.jpg', ram: '4GB DD3', cpu: 'Intel Core i7-3517U', price: 1799, display: 13.3, hdd: '628GB', model: 'Asus TX300CA-C4024H' },
                    { img: '/img/l-26.gif', ram: '4GB DD3', cpu: 'Intel Core i7-3667U', price: 2699, display: 14.0, hdd: '256GB SSD', model: 'Lenovo Thinkpad X1 Carbon' },
                    { img: '/img/l-29.jpg', ram: '4GB DD3', cpu: 'Intel Core i5-3317U ', price: 1299, display: 11.6, hdd: '128GB SSD', model: 'Sony Vaio Duo' },
                    { img: '/img/l-30.jpg', ram: '4GB DD3', cpu: 'Intel Core i5-3230M', price: 999, display: 15.5, hdd: '256GB SSD', model: 'Sony VAIO' },
                    { img: '/img/l-13.jpg', ram: '4GB DD3', cpu: 'Intel Core i7-3720QM', price: 2999, display: 15.4, hdd: '512GB SSD', model: 'Apple MacBook Pro' }
                ]
            },
            {
                laptops: [
                    { img: '/img/l-14.jpg', ram: '8GB DD3', cpu: 'Intel Core i7-3667U', price: 1299, display: 13.3, hdd: '256GB SSD', model: 'Apple MacBook Air' },
                    { img: '/img/l-15.jpg', ram: '8GB DD3', cpu: 'Intel Core i7-3632QM', price: 2199, display: 15.4, hdd: '256GB SSD', model: 'Asus ZenBook UX51VZ' },
                    { img: '/img/l-19.jpg', ram: '8GB DD3', cpu: 'Intel Core i5-3210M', price: 1499, display: 15.6, hdd: '750GB', model: 'Samsung Series 7 Chronos' },
                    { img: '/img/l-20.jpg', ram: '8GB DD3', cpu: 'Intel Core i7-3720QM', price: 1499, display: 17.3, hdd: '256GB SSD', model: 'HP EliteBook 8770w' },
                    { img: '/img/l-21.jpg', ram: '8GB DD3', cpu: 'Intel Core i7-3517U', price: 1499, display: 14.0, hdd: '512GB', model: 'Dell XPS 14' },
                    { img: '/img/l-23.jpg', ram: '8GB DD3', cpu: 'Intel Core i7-3537U', price: 1699, display: 15.6, hdd: '1TB', model: 'Acer Aspire R7-571G' },
                ]
            },
            {
                laptops: [
                    { img: '/img/l-27.jpg', ram: '16GB DD3', cpu: 'Intel Core i5-3317U ', price: 1699, display: 12.5, hdd: '128GB SSD', model: 'Dell XPS Duo 12' },
                    { img: '/img/l-24.jpg', ram: '16GB DD3', cpu: 'Intel Core i7-4500U', price: 1599, display: 15.6, hdd: '256GB SSD', model: 'Acer Aspire V5-573G' },
                    { img: '/img/l-28.png', ram: '16GB DD3', cpu: 'Intel Core i7-3537U', price: 1799, display: 12.5, hdd: '256GB SSD', model: 'Lenovo ThinkPad Twist S230u' },
                    { img: '/img/l-25.jpg', ram: '32GB DD3', cpu: 'Intel Core i7-4700MQ', price: 2199, display: 17.3, hdd: '1TB', model: 'Toshiba Qosmio X70-A-114' },
                    { img: '/img/l-18.gif', ram: '16GB DD3', cpu: 'Intel Core i7-3820QM', price: 2499, display: 15.6, hdd: '1TB', model: 'Lenovo ThinkPad T530' },
                    { img: '/img/l-22.jpg', ram: '32GB DD3', cpu: 'Intel Core i7-4800MQ', price: 3499, display: 17.3, hdd: '750GB', model: 'Dell Alienware 17' }
                ]
            }
        ];

        const source: any = {
            dataType: 'array',
            localData: data
        };

        const dataAdapter: any = new jqx.dataAdapter(source);

        dataAdapter.dataBind();
        return dataAdapter.records;
    }, []);

    useEffect(() => {
        content.current!.innerHTML = generateContent();
        myRibbon.current!.refresh();

        let itemsInCart = 0;
        const allBuyButtons = document.getElementsByClassName('buy');
        Array.prototype.forEach.call(allBuyButtons, (buyButton: HTMLDivElement) => {

            const clickHandler = () => {
                itemsInCart += 1;
                document.getElementsByClassName('cart-top')[0].innerHTML = '<p>' + itemsInCart + ' products</p>';
            }
            renderInto(
                <JqxButton theme={'material-purple'} onClick={clickHandler} width={100} height={25} value={'Buy'} />,
                buyButton
            );
        });
    }, []);

    return (
        <div>
            <div style={{ float: 'left' }}>
                <div className="cart-top">
                    <p>0 products</p>
                </div>
                <div>
                    <div>
                        <div className="tag-title">
                            <h4>Welcome to our online shop!</h4>
                            <span className="tag-title-info" />
                        </div>
                    </div>
                </div>
                <br /><br /><br />
                <JqxRibbon theme={'material-purple'} ref={myRibbon}
                    width={700} position={'top'} mode={'popup'}
                    selectedIndex={0} selectionMode={'click'} animationType={'fade'}>
                    <ul style={{ marginTop: '28px' }}>
                        <li style={{ marginLeft: '20px' }}>Business</li>
                        <li>Games</li>
                        <li>Internet and Movies</li>
                    </ul>
                    <div ref={content}>
                        <div />
                        <div />
                        <div />
                    </div>
                </JqxRibbon>
            </div>
            <JqxCheckBox theme={'material-purple'} style={{ float: 'left', marginLeft: '50px' }} onChange={onChange}
                width={130} checked={true}>
                Menu Mode
            </JqxCheckBox>
        </div>
    );
};

export default App;
