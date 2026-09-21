import * as React from 'react';
declare class JqxQRcode extends React.PureComponent<IQRcodeProps, IState> {
    protected static getDerivedStateFromProps(props: IQRcodeProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: IQRcodeProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: IQRcodeProps): void;
    getOptions(option: string): any;
    export(format: string, fileName?: string): any;
    getDataURL(format: string): string;
    getDataURLAsync(format: string): object;
    isValid(): boolean;
    private _manageProps;
    private _wireEvents;
}
export default JqxQRcode;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
interface IQRcodeOptions {
    backgroundColor?: string;
    displayLabel?: boolean;
    embedImage?: string;
    errorLevel?: string;
    imageHeight?: number;
    imageWidth?: number;
    labelColor?: string;
    labelFont?: string;
    labelFontSize?: number;
    labelMarginBottom?: number;
    labelMarginTop?: number;
    labelPosition?: string;
    lineColor?: string;
    squareWidth?: number;
    renderAs?: string;
    value?: string;
}
export interface IQRcodeProps extends IQRcodeOptions {
    className?: string;
    style?: React.CSSProperties;
    onInvalid?: (e?: Event) => void;
}
