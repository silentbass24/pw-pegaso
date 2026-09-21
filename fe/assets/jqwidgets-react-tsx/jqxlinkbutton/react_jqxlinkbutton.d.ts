import * as React from 'react';
declare class JqxLinkButton extends React.PureComponent<ILinkButtonProps, IState> {
    protected static getDerivedStateFromProps(props: ILinkButtonProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: ILinkButtonProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: ILinkButtonProps): void;
    getOptions(option: string): any;
    private _manageProps;
    private _wireEvents;
}
export default JqxLinkButton;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
interface ILinkButtonOptions {
    disabled?: boolean;
    height?: string | number;
    rtl?: boolean;
    theme?: string;
    width?: string | number;
}
export interface ILinkButtonProps extends ILinkButtonOptions {
    className?: string;
    style?: React.CSSProperties;
    href?: string;
    target?: string;
}
