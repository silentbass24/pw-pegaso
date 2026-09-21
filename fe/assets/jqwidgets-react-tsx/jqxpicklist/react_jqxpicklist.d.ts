import * as React from 'react';
declare class JqxPickList extends React.PureComponent<IPickListProps, IState> {
    protected static getDerivedStateFromProps(props: IPickListProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: IPickListProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: IPickListProps): void;
    getOptions(option: string): any;
    getSelectedItems(): any[];
    getSelectedValues(): any[];
    getSource(): any[];
    add(values: any): void;
    remove(values: any): void;
    addAll(): void;
    removeAll(): void;
    moveUp(): void;
    moveDown(): void;
    val(value?: any): any;
    focus(): void;
    refresh(): void;
    renderWidget(): void;
    destroy(): void;
    private _manageProps;
    private _wireEvents;
}
export default JqxPickList;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
export interface IPickListChange {
    added?: any[];
    removed?: any[];
    selectedItems?: any[];
}
export interface IPickListItems {
    items?: any[];
}
export interface IPickListRenderer {
    item?: any;
    label?: string;
    value?: string;
    index?: number;
}
interface IPickListOptions {
    width?: string | number;
    height?: string | number;
    source?: any;
    selectedItems?: any[];
    displayMember?: string;
    valueMember?: string;
    sourceHeader?: string;
    targetHeader?: string;
    showCounts?: boolean;
    filterable?: boolean;
    filterPlaceHolder?: string;
    checkboxes?: boolean;
    reorderable?: boolean;
    renderer?: (item?: IPickListRenderer['item'], label?: IPickListRenderer['label'], value?: IPickListRenderer['value'], index?: IPickListRenderer['index']) => string;
    buttons?: string[];
    itemHeight?: number;
    sourceLabel?: string;
    targetLabel?: string;
    disabled?: boolean;
    rtl?: boolean;
    theme?: string;
}
export interface IPickListProps extends IPickListOptions {
    className?: string;
    style?: React.CSSProperties;
    onCreate?: (e?: Event) => void;
    onChange?: (e?: Event) => void;
    onItemsAdded?: (e?: Event) => void;
    onItemsRemoved?: (e?: Event) => void;
    onReordered?: (e?: Event) => void;
}
