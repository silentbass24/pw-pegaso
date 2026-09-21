import * as jqxcore from '../../jqwidgets/jqxcore';
import * as jqxradiobutton from '../../jqwidgets/jqxradiobutton';
import * as jqxradiobuttongroup from '../../jqwidgets/jqxradiobuttongroup';
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
var JqxRadioButtonGroup = /** @class */ (function (_super) {
    __extends(JqxRadioButtonGroup, _super);
    function JqxRadioButtonGroup(props) {
        var _this = _super.call(this, props) || this;
        /* tslint:disable:variable-name */
        _this._jqx = JQXLite;
        _this._id = 'JqxRadioButtonGroup' + (_this._jqx ? _this._jqx.generateID() : 'SSR' + (++__ssrIdCounter__));
        _this._componentSelector = '#' + _this._id;
        _this.state = { lastProps: props };
        return _this;
    }
    JqxRadioButtonGroup.getDerivedStateFromProps = function (props, state) {
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
    JqxRadioButtonGroup.prototype.componentDidMount = function () {
        var widgetOptions = this._manageProps();
        this._jqx(this._componentSelector).jqxRadioButtonGroup(widgetOptions);
        this._wireEvents();
    };
    JqxRadioButtonGroup.prototype.componentDidUpdate = function () {
        var widgetOptions = this._manageProps();
        this.setOptions(widgetOptions);
        this._wireEvents();
    };
    JqxRadioButtonGroup.prototype.componentWillUnmount = function () {
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
            element.jqxRadioButtonGroup('destroy');
        }
        catch (e) {
            /* widget was already destroyed or never created */
        }
    };
    JqxRadioButtonGroup.prototype.render = function () {
        return (createElement("div", { id: this._id, className: this.props.className, style: this.props.style }, this.props.children));
    };
    JqxRadioButtonGroup.prototype.setOptions = function (options) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup(options);
    };
    JqxRadioButtonGroup.prototype.getOptions = function (option) {
        return this._jqx(this._componentSelector).jqxRadioButtonGroup(option);
    };
    JqxRadioButtonGroup.prototype.getValue = function () {
        return this._jqx(this._componentSelector).jqxRadioButtonGroup('getValue');
    };
    JqxRadioButtonGroup.prototype.getValueAt = function (index) {
        return this._jqx(this._componentSelector).jqxRadioButtonGroup('getValueAt', index);
    };
    JqxRadioButtonGroup.prototype.enableAt = function (index) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('enableAt', index);
    };
    JqxRadioButtonGroup.prototype.disableAt = function (index) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('disableAt', index);
    };
    JqxRadioButtonGroup.prototype.checkAt = function (index) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('checkAt', index);
    };
    JqxRadioButtonGroup.prototype.uncheckAt = function (index) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('uncheckAt', index);
    };
    JqxRadioButtonGroup.prototype.uncheckAll = function () {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('uncheckAll');
    };
    JqxRadioButtonGroup.prototype.checkValue = function (value) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('checkValue', value);
    };
    JqxRadioButtonGroup.prototype.uncheckValue = function (value) {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('uncheckValue', value);
    };
    JqxRadioButtonGroup.prototype.disable = function () {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('disable');
    };
    JqxRadioButtonGroup.prototype.destroy = function () {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('destroy');
    };
    JqxRadioButtonGroup.prototype.enable = function () {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('enable');
    };
    JqxRadioButtonGroup.prototype.renderWidget = function () {
        this._jqx(this._componentSelector).jqxRadioButtonGroup('render');
    };
    JqxRadioButtonGroup.prototype.val = function (value) {
        if (value) {
            this._jqx(this._componentSelector).jqxRadioButtonGroup('val', value);
        }
        else {
            return this._jqx(this._componentSelector).jqxRadioButtonGroup('val');
        }
    };
    JqxRadioButtonGroup.prototype._manageProps = function () {
        var widgetProps = ['change', 'disabled', 'items', 'value', 'layout', 'labelPosition', 'rtl', 'theme'];
        var options = {};
        for (var prop in this.props) {
            if (widgetProps.indexOf(prop) !== -1) {
                options[prop] = this.props[prop];
            }
        }
        return options;
    };
    JqxRadioButtonGroup.prototype._wireEvents = function () {
        for (var prop in this.props) {
            if (prop.indexOf('on') === 0) {
                var originalEventName = prop.slice(2);
                originalEventName = originalEventName.charAt(0).toLowerCase() + originalEventName.slice(1);
                this._jqx(this._componentSelector).off(originalEventName);
                this._jqx(this._componentSelector).on(originalEventName, this.props[prop]);
            }
        }
    };
    return JqxRadioButtonGroup;
}(PureComponent));
var __hasWindow__ = typeof window !== 'undefined';
var jqx = (__hasWindow__ ? window.jqx : undefined);
var JQXLite = (__hasWindow__ ? window.JQXLite : undefined);

export default JqxRadioButtonGroup;
export { jqx, JQXLite };
