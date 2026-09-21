import * as React from 'react';
declare class JqxChat extends React.PureComponent<IChatProps, IState> {
    protected static getDerivedStateFromProps(props: IChatProps, state: IState): null | IState;
    private _jqx;
    private _id;
    private _componentSelector;
    constructor(props: IChatProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    setOptions(options: IChatProps): void;
    getOptions(option: string): any;
    sendMessage(text?: string): void;
    stop(): void;
    addMessage(role: string, content: string): void;
    appendDelta(delta: string): void;
    getMessages(): IChatMessage[];
    clearConversation(): void;
    focus(): void;
    openPopup(): void;
    closePopup(): void;
    toggle(): void;
    val(value?: any): any;
    renderWidget(): void;
    refresh(): void;
    destroy(): void;
    private _manageProps;
    private _wireEvents;
}
export default JqxChat;
export declare const jqx: any;
export declare const JQXLite: any;
interface IState {
    lastProps: object;
}
export declare type IChatRole = 'user' | 'assistant';
export interface IChatMessage {
    role?: IChatRole;
    content?: string;
}
interface IChatOptions {
    accentColor?: string;
    apiKey?: string;
    botAvatar?: string;
    botName?: string;
    colorScheme?: 'auto' | 'light' | 'dark';
    disabled?: boolean;
    enableClear?: boolean;
    enableCopyCode?: boolean;
    enableStop?: boolean;
    headers?: object;
    height?: string | number;
    launcherIcon?: string;
    launcherPosition?: 'bottom-right' | 'bottom-left';
    maxTokens?: number;
    messages?: IChatMessage[];
    mode?: 'inline' | 'popup';
    model?: string;
    open?: boolean;
    placeHolder?: string;
    provider?: 'anthropic' | 'openai' | 'custom';
    proxyUrl?: string;
    rtl?: boolean;
    sendButtonIcon?: boolean;
    sendButtonLabel?: string;
    sendRequest?: any;
    showAvatars?: boolean;
    showHeader?: boolean;
    showHeaderAvatar?: boolean;
    showTimestamps?: boolean;
    starterPrompts?: string[];
    statusText?: string;
    stream?: boolean;
    subtitle?: string;
    system?: string;
    theme?: string;
    title?: string;
    typingIndicator?: boolean;
    userAvatar?: string;
    userName?: string;
    welcomeMessage?: string;
    width?: string | number;
}
export interface IChatProps extends IChatOptions {
    className?: string;
    style?: React.CSSProperties;
    onMessageSent?: (e?: Event) => void;
    onResponseStart?: (e?: Event) => void;
    onResponseDelta?: (e?: Event) => void;
    onMessageReceived?: (e?: Event) => void;
    onResponseEnd?: (e?: Event) => void;
    onError?: (e?: Event) => void;
    onOpen?: (e?: Event) => void;
    onClose?: (e?: Event) => void;
    onStop?: (e?: Event) => void;
    onCreate?: (e?: Event) => void;
}
