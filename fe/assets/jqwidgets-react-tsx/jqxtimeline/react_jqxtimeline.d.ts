import * as React from 'react';
declare class JqxTimeline extends React.PureComponent<ITimelineProps, IState> {
    protected static getDerivedStateFromProps(props: ITimelineProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: ITimelineProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: ITimelineProps): void;
    getOptions(option: string): any;
    renderWidget(): [];
    private _manageProps;
    private _wireEvents;
}
export default JqxTimeline;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
interface ITimelineOptions {
    autoWidth?: boolean;
    collapsible?: boolean;
    disabled?: boolean;
    horizontal?: boolean;
    position?: string;
    source?: [];
    theme?: string;
}
export interface ITimelineProps extends ITimelineOptions {
    className?: string;
    style?: React.CSSProperties;
}
