import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxTree, { ITreeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

const App = () => {
    const myTree = useRef<JqxTree>(null);

    const AddOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.addTo({ label: 'Item' }, selectedItem.element);
            myTree.current!.render();
        }
    }, []);

    const AddAfterOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.addAfter({ label: 'Item' }, selectedItem.element);
            myTree.current!.render();
        }
    }, []);

    const AddBeforeOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.addBefore({ label: 'Item' }, selectedItem.element);
            myTree.current!.render();
        }
    }, []);

    const UpdateOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.updateItem({ label: 'Item' }, selectedItem.element);
            myTree.current!.render();
        }
    }, []);

    const RemoveOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.removeItem(selectedItem.element);
            myTree.current!.render();
        }
    }, []);

    const DisableOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.disableItem(selectedItem.element);
        }
    }, []);

    const ExpandOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.expandItem(selectedItem.element);
        }
    }, []);

    const CollapseOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            myTree.current!.collapseItem(selectedItem.element);
        }
    }, []);

    const ExpandAllOnClick = useCallback((): void => {
        myTree.current!.expandAll();
    }, []);

    const CollapseAllOnClick = useCallback((): void => {
        myTree.current!.collapseAll();
    }, []);

    const EnableAllOnClick = useCallback((): void => {
        myTree.current!.enableAll();
    }, []);

    const NextOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            const nextItem = selectedItem.element.nextElementSibling;
            if (nextItem != null) {
                myTree.current!.selectItem(nextItem);
                myTree.current!.ensureVisible(nextItem);
            }
        }
    }, []);

    const PreviousOnClick = useCallback((): void => {
        const selectedItem = myTree.current!.getSelectedItem();
        if (selectedItem) {
            const previousItem = selectedItem.element.previousElementSibling;
            if (previousItem != null) {
                myTree.current!.selectItem(previousItem);
                myTree.current!.ensureVisible(previousItem);
            }
        }
    }, []);

        const ButtonEvents: string[] = [
            'AddOnClick',
            'AddAfterOnClick',
            'AddBeforeOnClick',
            'UpdateOnClick',
            'RemoveOnClick',
            'DisableOnClick',
            'ExpandOnClick',
            'CollapseOnClick',
            'ExpandAllOnClick',
            'CollapseAllOnClick',
            'EnableAllOnClick',
            'NextOnClick',
            'PreviousOnClick'
        ];

    const height = 20;
    const width = 100;

    useEffect(() => {
        const home = document.querySelector("#home");
        const solutions = document.querySelector("#solutions");

        myTree.current!.selectItem(home);
        myTree.current!.expandItem(solutions);
    }, []);

    const marginTop = { marginTop: "10px" };
    return (
        <div>
            <JqxTree theme={'material-purple'} ref={myTree} style={{ marginLeft: '20px', float: 'left' }}
                width={300} height={450}
            >
                <ul>
                    <li id="home">Home</li>
                    <li id="solutions">
                        Solutions
                        <ul>
                            <li>Education</li>
                            <li>Financial services</li>
                            <li>Government</li>
                            <li>Manufacturing</li>
                            <li>
                                Solutions
                                <ul>
                                    <li>Consumer photo and video</li>
                                    <li>Mobile</li>
                                    <li>Rich Internet applications</li>
                                    <li>Technical communication</li>
                                    <li>Training and eLearning</li>
                                    <li>Web conferencing</li>
                                </ul>
                            </li>
                            <li>All industries and solutions</li>
                        </ul>
                    </li>
                    <li>
                        Products
                        <ul>
                            <li>PC products</li>
                            <li>Mobile products</li>
                            <li>All products</li>
                        </ul>
                    </li>
                    <li>
                        Support
                        <ul>
                            <li>Support home</li>
                            <li>Customer Service</li>
                            <li>Knowledge base</li>
                            <li>Books</li>
                            <li>Training and certification</li>
                            <li>Support programs</li>
                            <li>Forums</li>
                            <li>Documentation</li>
                            <li>Updates</li>
                        </ul>
                    </li>
                    <li>
                        Communities
                        <ul>
                            <li>Designers</li>
                            <li>Developers</li>
                            <li>Educators and students</li>
                            <li>Partners</li>
                            <li>
                                By resource
                                <ul>
                                    <li>Labs</li>
                                    <li>TV</li>
                                    <li>Forums</li>
                                    <li>Exchange</li>
                                    <li>Blogs</li>
                                    <li>Experience Design</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        Company
                        <ul>
                            <li>About Us</li>
                            <li>Press</li>
                            <li>Investor Relations</li>
                            <li>Corporate Affairs</li>
                            <li>Careers</li>
                            <li>Showcase</li>
                            <li>Events</li>
                            <li>Contact Us</li>
                            <li>Become an affiliate</li>
                        </ul>
                    </li>
                </ul>
            </JqxTree>

            <div style={{ marginLeft: '60px', float: 'left' }}>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={AddOnClick} width={width} height={height}>Add</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={AddAfterOnClick} width={width} height={height}>Add After</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={AddBeforeOnClick} width={width} height={height}>Add Before</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={UpdateOnClick} width={width} height={height}>Update</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={RemoveOnClick} width={width} height={height}>Remove</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={DisableOnClick} width={width} height={height}>Disable</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={ExpandOnClick} width={width} height={height}>Expand</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={CollapseOnClick} width={width} height={height}>Collapse</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={ExpandAllOnClick} width={width} height={height}>Expand All</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={CollapseAllOnClick} width={width} height={height}>Collapse All</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={EnableAllOnClick} width={width} height={height}>Enable All</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={NextOnClick} width={width} height={height}>Next Item</JqxButton>
                </div>
                <div style={marginTop}>
                    <JqxButton theme={'material-purple'} onClick={PreviousOnClick} width={width} height={height}>Previous Item</JqxButton>
                </div>
            </div>
        </div>
    );
};

export default App;
