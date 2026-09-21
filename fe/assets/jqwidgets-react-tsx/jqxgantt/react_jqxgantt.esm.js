import * as jqxcore from '../../jqwidgets/jqxcore';
import * as jqxganttapi from '../../jqwidgets/jqxgantt.api';
import * as jqxgantt from '../../jqwidgets/jqxgantt';
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
var JqxGantt = /** @class */ (function (_super) {
    __extends(JqxGantt, _super);
    function JqxGantt(props) {
        var _this = _super.call(this, props) || this;
        /* tslint:disable:variable-name */
        _this._jqx = JQXLite;
        _this._id = 'JqxGantt' + (_this._jqx ? _this._jqx.generateID() : 'SSR' + (++__ssrIdCounter__));
        _this._componentSelector = '#' + _this._id;
        _this.state = { lastProps: props };
        return _this;
    }
    JqxGantt.getDerivedStateFromProps = function (props, state) {
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
    JqxGantt.prototype.componentDidMount = function () {
        var widgetOptions = this._manageProps();
        this._jqx(this._componentSelector).jqxGantt(widgetOptions);
        this._wireEvents();
    };
    JqxGantt.prototype.componentDidUpdate = function () {
        var widgetOptions = this._manageProps();
        this.setOptions(widgetOptions);
        this._wireEvents();
    };
    JqxGantt.prototype.componentWillUnmount = function () {
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
    };
    JqxGantt.prototype.render = function () {
        return (createElement("div", { id: this._id, className: this.props.className, style: this.props.style }, this.props.children));
    };
    JqxGantt.prototype.setOptions = function (options) {
        this._jqx(this._componentSelector).jqxGantt(options);
    };
    JqxGantt.prototype.getOptions = function (option) {
        return this._jqx(this._componentSelector).jqxGantt(option);
    };
    JqxGantt.prototype.addFilter = function (columns, filterGroup) {
        this._jqx(this._componentSelector).jqxGantt('addFilter', columns, filterGroup);
    };
    JqxGantt.prototype.clearFilters = function () {
        this._jqx(this._componentSelector).jqxGantt('clearFilters');
    };
    JqxGantt.prototype.clearSort = function () {
        this._jqx(this._componentSelector).jqxGantt('clearSort');
    };
    JqxGantt.prototype.clearSelection = function () {
        this._jqx(this._componentSelector).jqxGantt('clearSelection');
    };
    JqxGantt.prototype.clearState = function () {
        this._jqx(this._componentSelector).jqxGantt('clearState');
    };
    JqxGantt.prototype.clearTasks = function () {
        this._jqx(this._componentSelector).jqxGantt('clearTasks');
    };
    JqxGantt.prototype.clearResources = function () {
        this._jqx(this._componentSelector).jqxGantt('clearResources');
    };
    JqxGantt.prototype.createConnection = function (startTaskIndex, taskEndIndex, connectionType, lag) {
        this._jqx(this._componentSelector).jqxGantt('createConnection', startTaskIndex, taskEndIndex, connectionType, lag);
    };
    JqxGantt.prototype.collapse = function (id) {
        this._jqx(this._componentSelector).jqxGantt('collapse', id);
    };
    JqxGantt.prototype.beginUpdate = function () {
        this._jqx(this._componentSelector).jqxGantt('beginUpdate');
    };
    JqxGantt.prototype.endUpdate = function () {
        this._jqx(this._componentSelector).jqxGantt('endUpdate');
    };
    JqxGantt.prototype.ensureVisible = function (taskId) {
        this._jqx(this._componentSelector).jqxGantt('ensureVisible', taskId);
    };
    JqxGantt.prototype.expand = function (id) {
        this._jqx(this._componentSelector).jqxGantt('expand', id);
    };
    JqxGantt.prototype.exportData = function (dataFormat, callback) {
        this._jqx(this._componentSelector).jqxGantt('exportData', dataFormat, callback);
    };
    JqxGantt.prototype.getConnections = function () {
        return this._jqx(this._componentSelector).jqxGantt('getConnections');
    };
    JqxGantt.prototype.getConnectionDetails = function (connectionId) {
        return this._jqx(this._componentSelector).jqxGantt('getConnectionDetails', connectionId);
    };
    JqxGantt.prototype.getState = function () {
        return this._jqx(this._componentSelector).jqxGantt('getState');
    };
    JqxGantt.prototype.getItemPath = function (item) {
        return this._jqx(this._componentSelector).jqxGantt('getItemPath', item);
    };
    JqxGantt.prototype.getTask = function (itemId) {
        return this._jqx(this._componentSelector).jqxGantt('getTask', itemId);
    };
    JqxGantt.prototype.getTasks = function () {
        return this._jqx(this._componentSelector).jqxGantt('getTasks');
    };
    JqxGantt.prototype.getTaskIndex = function (task) {
        return this._jqx(this._componentSelector).jqxGantt('getTaskIndex', task);
    };
    JqxGantt.prototype.getTaskConnections = function (taskId) {
        return this._jqx(this._componentSelector).jqxGantt('getTaskConnections', taskId);
    };
    JqxGantt.prototype.getTaskProject = function (task) {
        return this._jqx(this._componentSelector).jqxGantt('getTaskProject', task);
    };
    JqxGantt.prototype.getResource = function (itemId) {
        return this._jqx(this._componentSelector).jqxGantt('getResource', itemId);
    };
    JqxGantt.prototype.getResources = function () {
        return this._jqx(this._componentSelector).jqxGantt('getResources');
    };
    JqxGantt.prototype.getResourceIndex = function (resource) {
        return this._jqx(this._componentSelector).jqxGantt('getResourceIndex', resource);
    };
    JqxGantt.prototype.getResourceTasks = function (resource) {
        return this._jqx(this._componentSelector).jqxGantt('getResourceTasks', resource);
    };
    JqxGantt.prototype.getSelectedIds = function () {
        return this._jqx(this._componentSelector).jqxGantt('getSelectedIds');
    };
    JqxGantt.prototype.getSelectedTasks = function () {
        return this._jqx(this._componentSelector).jqxGantt('getSelectedTasks');
    };
    JqxGantt.prototype.getSelectedResources = function () {
        return this._jqx(this._componentSelector).jqxGantt('getSelectedResources');
    };
    JqxGantt.prototype.getWorkingHours = function () {
        return this._jqx(this._componentSelector).jqxGantt('getWorkingHours');
    };
    JqxGantt.prototype.hideTooltip = function () {
        return this._jqx(this._componentSelector).jqxGantt('hideTooltip');
    };
    JqxGantt.prototype.isWorkingDay = function (date) {
        this._jqx(this._componentSelector).jqxGantt('isWorkingDay', date);
    };
    JqxGantt.prototype.loadState = function (state) {
        this._jqx(this._componentSelector).jqxGantt('loadState', state);
    };
    JqxGantt.prototype.removeAllConnections = function () {
        this._jqx(this._componentSelector).jqxGantt('removeAllConnections');
    };
    JqxGantt.prototype.removeConnection = function (startTaskIndex, taskEndIndex, connectionType) {
        return this._jqx(this._componentSelector).jqxGantt('removeConnection', startTaskIndex, taskEndIndex, connectionType);
    };
    JqxGantt.prototype.removeTaskConnection = function (taskStart, taskEnd) {
        this._jqx(this._componentSelector).jqxGantt('removeTaskConnection', taskStart, taskEnd);
    };
    JqxGantt.prototype.showTooltip = function (target, content) {
        this._jqx(this._componentSelector).jqxGantt('showTooltip', target, content);
    };
    JqxGantt.prototype.saveState = function (state) {
        this._jqx(this._componentSelector).jqxGantt('saveState', state);
    };
    JqxGantt.prototype.insertTask = function (taskObject, project, index) {
        return this._jqx(this._componentSelector).jqxGantt('insertTask', taskObject, project, index);
    };
    JqxGantt.prototype.updateTask = function (taskId, taskObject) {
        this._jqx(this._componentSelector).jqxGantt('updateTask', taskId, taskObject);
    };
    JqxGantt.prototype.removeTask = function (taskId) {
        this._jqx(this._componentSelector).jqxGantt('removeTask', taskId);
    };
    JqxGantt.prototype.insertResource = function (resourceId, resourceObject) {
        this._jqx(this._componentSelector).jqxGantt('insertResource', resourceId, resourceObject);
    };
    JqxGantt.prototype.updateResource = function (resourceId, taskObject) {
        this._jqx(this._componentSelector).jqxGantt('updateResource', resourceId, taskObject);
    };
    JqxGantt.prototype.removeResource = function (resourceId) {
        this._jqx(this._componentSelector).jqxGantt('removeResource', resourceId);
    };
    JqxGantt.prototype.openWindow = function (taskId) {
        this._jqx(this._componentSelector).jqxGantt('openWindow', taskId);
    };
    JqxGantt.prototype.closeWindow = function () {
        this._jqx(this._componentSelector).jqxGantt('closeWindow');
    };
    JqxGantt.prototype.print = function () {
        this._jqx(this._componentSelector).jqxGantt('print');
    };
    JqxGantt.prototype.setWorkTime = function (settings) {
        this._jqx(this._componentSelector).jqxGantt('setWorkTime', settings);
    };
    JqxGantt.prototype.selectTask = function (id) {
        this._jqx(this._componentSelector).jqxGantt('selectTask', id);
    };
    JqxGantt.prototype.selectResource = function (id) {
        this._jqx(this._componentSelector).jqxGantt('selectResource', id);
    };
    JqxGantt.prototype.unselectTask = function (id) {
        this._jqx(this._componentSelector).jqxGantt('unselectTask', id);
    };
    JqxGantt.prototype.unselectResource = function (id) {
        this._jqx(this._componentSelector).jqxGantt('unselectResource', id);
    };
    JqxGantt.prototype.unsetWorkTime = function (settings) {
        this._jqx(this._componentSelector).jqxGantt('unsetWorkTime', settings);
    };
    JqxGantt.prototype.sort = function (columns) {
        this._jqx(this._componentSelector).jqxGantt('sort', columns);
    };
    JqxGantt.prototype._manageProps = function () {
        var widgetProps = ['adjustToNonworkingTime', 'autoSchedule', 'autoScheduleStrictMode', 'autoScrollStep', 'columnMenu', 'columnMinWidth', 'columnResize', 'columnResizeFeedback', 'currentTime', 'currentTimeIndicator', 'currentTimeIndicatorInterval', 'dataExportFileName', 'source', 'dayFormat', 'dateEnd', 'dateStart', 'dateMarkers', 'disabled', 'disableAutoScroll', 'disableTaskDrag', 'disableTaskProgressChange', 'disableTaskResize', 'disableSelection', 'disableSegmentDrag', 'disableSegmentResize', 'disableWindowEditor', 'durationUnit', 'filterRow', 'firstDayOfWeek', 'groupByResources', 'headerTemplate', 'hideDateMarkers', 'hideTimelineHeader', 'hideTimelineHeaderDetails', 'hideTimelineSecondHeaderDetails', 'hideResourcePanel', 'horizontalScrollBarVisibility', 'hourFormat', 'infiniteTimeline', 'infiniteTimelineStep', 'inverted', 'keyboardNavigation', 'max', 'min', 'monthFormat', 'monthScale', 'nonworkingDays', 'nonworkingHours', 'onTaskRender', 'popupWindowCustomizationFunction', 'popupWindowTabs', 'progressLabelFormatFunction', 'quarterFormat', 'resources', 'resourceColumns', 'resourceFiltering', 'resourceGroupFormatFunction', 'resourcePanelHeaderTemplate', 'resourcePanelMin', 'resourcePanelSize', 'resourcePanelRefreshRate', 'resourceTimelineFormatFunction', 'resourceTimelineMode', 'resourceTimelineView', 'rightToLeft', 'selectedTaskIds', 'selectedResourceIds', 'shadeUntilCurrentTime', 'showSelectionColumn', 'showBaseline', 'showProgressLabel', 'snapToNearest', 'sortFunction', 'sortMode', 'tasks', 'taskColumns', 'taskFiltering', 'taskPanelMin', 'taskPanelSize', 'timelineMin', 'treeMin', 'treeSize', 'timelineHeaderFormatFunction', 'tooltip', 'verticalScrollBarVisibility', 'view', 'yearFormat', 'weekFormat', 'theme'];
        var options = {};
        for (var prop in this.props) {
            if (widgetProps.indexOf(prop) !== -1) {
                options[prop] = this.props[prop];
            }
        }
        return options;
    };
    JqxGantt.prototype._wireEvents = function () {
        for (var prop in this.props) {
            if (prop.indexOf('on') === 0) {
                var originalEventName = prop.slice(2);
                originalEventName = originalEventName.charAt(0).toLowerCase() + originalEventName.slice(1);
                this._jqx(this._componentSelector).off(originalEventName);
                this._jqx(this._componentSelector).on(originalEventName, this.props[prop]);
            }
        }
    };
    return JqxGantt;
}(PureComponent));
var __hasWindow__ = typeof window !== 'undefined';
var jqx = (__hasWindow__ ? window.jqx : undefined);
var JQXLite = (__hasWindow__ ? window.JQXLite : undefined);

export default JqxGantt;
export { jqx, JQXLite };
