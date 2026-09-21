import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox';
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';
import JqxTabs from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtabs';

const App = () => {
    const myTabs = useRef<JqxTabs>(null);
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const acceptCheckBox = useRef<JqxCheckBox>(null);
    const products = useRef<JqxListBox>(null);
    const orderContainer = useRef<HTMLDivElement>(null);



    const acceptCheckBoxChange = useCallback((event: any): void => {
        validate(true);
    }, []);

    const productsChange = useCallback((event: any): void => {
        validate(true);
        const selectedItems = products.current!.getOptions('selectedIndexes')
        let count = selectedItems.length;
        const parent = orderContainer.current!;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        while (count) {
            count--;
            if (typeof selectedItems[count] !== 'undefined' &&
                selectedItems[count] !== -1) {
                const currentHtmlContent = parent.innerHTML;
                parent.innerHTML = currentHtmlContent + '<div style="width: 190px; height: 20px;">' + (getSource()[selectedItems[count]].html) + '</div>';
            }
        }
    }, []);

    const productsUnselect = useCallback((event: any): void => {
        validate(true);
    }, []);

    useEffect(() => {
        addHandlers();
        validate(true);
        showHint('Validation hints.', '#hintSection');
    }, []);

    const addHandlers = () => {
        usernameInput.current!.addEventListener('keyup', () => {
            validate(true);
        });
        usernameInput.current!.addEventListener('change', () => {
            validate(true);
        });
        passwordInput.current!.addEventListener('keyup', () => {
            validate(true);
        });

        const nextButtonClass = document.querySelectorAll('.nextButton');
        nextButtonClass.forEach(nextButton => {
            nextButton.addEventListener('click', (e) => {
                validate(true);
                const selectedTab = myTabs.current!.getOptions('selectedItem');
                myTabs.current!.select(selectedTab + 1);
            });
        });

        const backButtonClass = document.querySelectorAll('.backButton');
        backButtonClass.forEach(backButton => {
            backButton.addEventListener('click', () => {
                validate(true);
                const selectedTab = myTabs.current!.getOptions('selectedItem');
                myTabs.current!.select(selectedTab - 1);
            });
        });
    };

    // Checking if any product have been selected
    const isItemSelected = (array: any) => {
        let count = array.length;
        if (count === 0) {
            return false;
        }

        while (count) {
            count -= 1;
            if (array[count] !== -1 && typeof array[count] !== 'undefined') {
                return true;
            }
        }

        return false;
    };

    // Validating all wizard tabs
    const validate = (notify: boolean) => {
        if (!firstTab(notify)) {
            myTabs.current!.disableAt(1);
            myTabs.current!.disableAt(2);
            return;
        } else {
            myTabs.current!.enableAt(1);
        }
        if (!secondTab(notify)) {
            myTabs.current!.disableAt(2);
            return;
        } else {
            myTabs.current!.enableAt(2);
        }
    };

    // Displaying message to the user
    const showHint = (message: string, selector: string) => {
        if (typeof selector === 'undefined') {
            selector = '.hint';
        }
        if (message === '') {
            message = 'You can continue.';
        }
        // Check is a class or not
        if (selector.indexOf('.') === 0) {
            document.getElementsByClassName(selector.slice(1))[0].innerHTML = '<strong>' + message + '</strong>';
        } else {
            document.getElementById(selector.slice(1))!.innerHTML = '<strong>' + message + '</strong>';
        }
    }

    // Validating the first tab
    const firstTab = (notify: boolean) => {
        const username = usernameInput.current!.value;
        const password = passwordInput.current!.value;
        let message = '';
        if (username.length < 3) {
            message += 'You have to enter valid username. <br />';
        }
        if (password.length < 3) {
            message += 'You have to enter valid password. <br />';
        }
        if (!acceptCheckBox.current!.getOptions("checked")) {
            message += 'You have to accept the terms. <br />';
        }
        if (message !== '') {
            if (notify) {
                showHint(message, '#hintSection');
            }
            return false;
        }

        showHint('You can continue.', '#hintSection');
        return true;
    };

    // Validating the second tab
    const secondTab = (notify?: boolean) => {
        const selectedProducts = products.current!.getOptions("selectedIndexes");
        if (!isItemSelected(selectedProducts)) {
            showHint('You have to select at least one item.', '#hintBasket');
            return false;
        } else {
            showHint('You can continue.', '#hintBasket');
        }
        return true;
    };

    // Event handling

    const getSource = (): any[] => {
        return [
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/numberinput.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxNumberInput</span></div>", title: 'jqxNumberInput' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/progressbar.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxProgressBar</span></div>", title: 'jqxProgressBar' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/calendar.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxCalendar</span></div>", title: 'jqxCalendar' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/button.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxButton</span></div>", title: 'jqxButton' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/dropdownlist.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxDropDownList</span></div>", title: 'jqxDropDownList' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/listbox.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxListBox</span></div>", title: 'jqxListBox' },
            { html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='/img/tooltip.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>jqxTooltip</span></div>", title: 'jqxTooltip' }
        ];
    }

    return (
        <JqxTabs theme={'material-purple'} ref={myTabs}
            // @ts-ignore
            width={'100%'}
            height={230}
            keyboardNavigation={false}
        >
            <ul>
                <li style={{ marginLeft: 30 }}>
                    Personal info
                </li>
                <li>Shopping basket</li>
                <li>Review order</li>
            </ul>
            <div className={"section"}>
                <div id={"form"}>
                    <div className={"inputContainer"}>
                        Username:
                    <input className={"formInput"} type="text" ref={usernameInput} />
                    </div>
                    <div className={"inputContainer"}>
                        Password:
                    <input className={"formInput"} type="password" ref={passwordInput} />
                    </div>
                </div>

                <div id={"hintWrapper"}>
                    <div id={"hintSection"} className={"hint"} />
                </div>
                <div id={"checkBoxWrapper"}>
                    <JqxCheckBox theme={'material-purple'} ref={acceptCheckBox} onChange={acceptCheckBoxChange} width={250}>
                        I accept the terms and conditions
                    </JqxCheckBox>
                </div>
                <div id={"sectionButtonsWrapper"}>
                    <JqxButton theme={'material-purple'} className={"nextButton"} width={50}>Next</JqxButton>
                </div>
            </div>
            <div className={"section"}>
                <JqxListBox theme={'material-purple'} ref={products}
                    onChange={productsChange}
                    onUnselect={productsUnselect}
                    source={getSource()}
                    width={490}
                    height={130}
                    multiple={true}
                />
                <div id={"hintWrapper2"}>
                    <div id={"hintBasket"} className={"hint"} />
                </div>
                <div id={"basketButtonsWrapper"}>
                    <JqxButton theme={'material-purple'} className={"backButton"} width={50}>Back</JqxButton>
                    <JqxButton theme={'material-purple'} className={"nextButton"} width={50}>Next</JqxButton>
                </div>
            </div>
            <div className={"section"}>
                <div id={"selectedProductsHeader"}>
                    <h4>Selected products</h4>
                    <div ref={orderContainer} />
                </div>
                <div id={"selectedProductsButtonsWrapper"}>
                    <JqxButton theme={'material-purple'} className={"backButton"} width={50}>Back</JqxButton>
                </div>
            </div>
        </JqxTabs>
    );
};

export default App;
