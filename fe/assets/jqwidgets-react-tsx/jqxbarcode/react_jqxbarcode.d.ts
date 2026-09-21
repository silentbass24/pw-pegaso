import * as React from 'react';
declare class JqxBarcode extends React.PureComponent<IBarcodeProps, IState> {
    protected static getDerivedStateFromProps(props: IBarcodeProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: IBarcodeProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: IBarcodeProps): void;
    getOptions(option: string): any;
    export(format: string, fileName?: string): any;
    getDataURL(format: string): string;
    getDataURLAsync(format: string): object;
    isValid(): boolean;
    private _manageProps;
    private _wireEvents;
}
export default JqxBarcode;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
interface IBarcodeOptions {
    backgroundColor?: string;
    displayLabel?: boolean;
    labelColor?: string;
    labelFont?: string;
    labelFontSize?: number;
    labelMarginBottom?: number;
    labelMarginTop?: number;
    labelPosition?: string;
    lineColor?: string;
    lineHeight?: number;
    lineWidth?: number;
    renderAs?: string;
    type?: string;
    value?: string;
}
export interface IBarcodeProps extends IBarcodeOptions {
    className?: string;
    style?: React.CSSProperties;
    onInvalid?: (e?: Event) => void;
}
