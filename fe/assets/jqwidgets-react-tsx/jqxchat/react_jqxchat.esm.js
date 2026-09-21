import * as jqxcore from '../../jqwidgets/jqxcore';
import { createElement, PureComponent } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __ssrIdCounter__ = 0;
var JqxChat = /** @class */ (function (_super) {
    __extends(JqxChat, _super);
    function JqxChat(props) {
        var _this = _super.call(this, props) || this;
        /* tslint:disable:variable-name */
        _this._jqx = JQXLite;
        _this._id = 'JqxChat' + (_this._jqx ? _this._jqx.generateID() : 'SSR' + (++__ssrIdCounter__));
        _this._componentSelector = '#' + _this._id;
        _this.state = { lastProps: props };
        return _this;
    }
    JqxChat.getDerivedStateFromProps = function (props, state) {
        if (!Object.is) {
            Object.is = function (x, y) {
                if (x === y) {
                    return x !== 0 || 1 / x === 1 / y;
                }
                else {
                    return x !== x && y !== y;
                }
            };
        }
        var areEqual = Object.is(props, state.lastProps);
        if (!areEqual) {
            var newState = { lastProps: props };
            return newState;
        }
        return null;
    };
    JqxChat.prototype.componentDidMount = function () {
        var widgetOptions = this._manageProps();
        this._jqx(this._componentSelector).jqxChat(widgetOptions);
        this._wireEvents();
    };
    JqxChat.prototype.componentDidUpdate = function () {
        var widgetOptions = this._manageProps();
        this.setOptions(widgetOptions);
        this._wireEvents();
    };
    JqxChat.prototype.componentWillUnmount = function () {
        if (!this._jqx) {
            return;
        }
        var element = this._jqx(this._componentSelector);
        if (!element || element.length === 0) {
            return;
        }
        for (var prop in this.props) {
            if (prop.indexOf('on') === 0) {
                var originalEventName = prop.slice(2);
                originalEventName = originalEventName.charAt(0).toLowerCase() + originalEventName.slice(1);
                element.off(originalEventName);
            }
        }
        try {
            element.jqxChat('destroy');
        }
        catch (e) {
            /* widget was already destroyed or never created */
        }
    };
    JqxChat.prototype.render = function () {
        return (createElement("div", { id: this._id, className: this.props.className, style: this.props.style }, this.props.children));
    };
    JqxChat.prototype.setOptions = function (options) {
        this._jqx(this._componentSelector).jqxChat(options);
    };
    JqxChat.prototype.getOptions = function (option) {
        return this._jqx(this._componentSelector).jqxChat(option);
    };
    JqxChat.prototype.sendMessage = function (text) {
        this._jqx(this._componentSelector).jqxChat('sendMessage', text);
    };
    JqxChat.prototype.stop = function () {
        this._jqx(this._componentSelector).jqxChat('stop');
    };
    JqxChat.prototype.addMessage = function (role, content) {
        this._jqx(this._componentSelector).jqxChat('addMessage', role, content);
    };
    JqxChat.prototype.appendDelta = function (delta) {
        this._jqx(this._componentSelector).jqxChat('appendDelta', delta);
    };
    JqxChat.prototype.getMessages = function () {
        return this._jqx(this._componentSelector).jqxChat('getMessages');
    };
    JqxChat.prototype.clearConversation = function () {
        this._jqx(this._componentSelector).jqxChat('clearConversation');
    };
    JqxChat.prototype.focus = function () {
        this._jqx(this._componentSelector).jqxChat('focus');
    };
    JqxChat.prototype.openPopup = function () {
        this._jqx(this._componentSelector).jqxChat('openPopup');
    };
    JqxChat.prototype.closePopup = function () {
        this._jqx(this._componentSelector).jqxChat('closePopup');
    };
    JqxChat.prototype.toggle = function () {
        this._jqx(this._componentSelector).jqxChat('toggle');
    };
    JqxChat.prototype.val = function (value) {
        if (value) {
            this._jqx(this._componentSelector).jqxChat('val', value);
        }
        else {
            return this._jqx(this._componentSelector).jqxChat('val');
        }
    };
    JqxChat.prototype.renderWidget = function () {
        this._jqx(this._componentSelector).jqxChat('render');
    };
    JqxChat.prototype.refresh = function () {
        this._jqx(this._componentSelector).jqxChat('refresh');
    };
    JqxChat.prototype.destroy = function () {
        this._jqx(this._componentSelector).jqxChat('destroy');
    };
    JqxChat.prototype._manageProps = function () {
        var widgetProps = ['accentColor', 'apiKey', 'botAvatar', 'botName', 'colorScheme', 'disabled', 'enableClear', 'enableCopyCode', 'enableStop', 'headers', 'height', 'launcherIcon', 'launcherPosition', 'maxTokens', 'messages', 'mode', 'model', 'open', 'placeHolder', 'provider', 'proxyUrl', 'rtl', 'sendButtonIcon', 'sendButtonLabel', 'sendRequest', 'showAvatars', 'showHeader', 'showHeaderAvatar', 'showTimestamps', 'starterPrompts', 'statusText', 'stream', 'subtitle', 'system', 'theme', 'title', 'typingIndicator', 'userAvatar', 'userName', 'welcomeMessage', 'width'];
        var options = {};
        for (var prop in this.props) {
            if (widgetProps.indexOf(prop) !== -1) {
                options[prop] = this.props[prop];
            }
        }
        return options;
    };
    JqxChat.prototype._wireEvents = function () {
        for (var prop in this.props) {
            if (prop.indexOf('on') === 0) {
                var originalEventName = prop.slice(2);
                originalEventName = originalEventName.charAt(0).toLowerCase() + originalEventName.slice(1);
                this._jqx(this._componentSelector).off(originalEventName);
                this._jqx(this._componentSelector).on(originalEventName, this.props[prop]);
            }
        }
    };
    return JqxChat;
}(PureComponent));
var __hasWindow__ = typeof window !== 'undefined';
var jqx = (__hasWindow__ ? window.jqx : undefined);
var JQXLite = (__hasWindow__ ? window.JQXLite : undefined);

export default JqxChat;
export { jqx, JQXLite };
