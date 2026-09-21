import * as React from 'react';
declare class JqxSplitLayout extends React.PureComponent<ISplitLayoutProps, IState> {
    protected static getDerivedStateFromProps(props: ISplitLayoutProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: ISplitLayoutProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: ISplitLayoutProps): void;
    getOptions(option: string): any;
    refresh(): void;
    private _manageProps;
    private _wireEvents;
}
export default JqxSplitLayout;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
interface ISplitLayoutOptions {
    disabled?: boolean;
    dataSource?: any;
    ready?: any;
    orientation?: string;
}
export interface ISplitLayoutProps extends ISplitLayoutOptions {
    className?: string;
    style?: React.CSSProperties;
    onResize?: (e?: Event) => void;
    onStateChange?: (e?: Event) => void;
}
