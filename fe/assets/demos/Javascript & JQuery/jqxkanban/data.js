/*
    Shared data for the Kanban demos.

    item-template.htm, rtl.htm and kanban-connected.htm all load this file and
    expect kanbanSource, kanbanColumns and kanbanResources to be defined here.
*/

var kanbanColumns = [
    { text: "Backlog", dataField: "new", maxItems: 5 },
    { text: "In Progress", dataField: "work", maxItems: 5 },
    { text: "Done", dataField: "done", maxItems: 5 }
];

var kanbanSource = [
    { id: 0, status: "new", text: "State opened does not contain items", tags: "state, open", color: "#5dc3f0", resourceId: 1 },
    { id: 1, status: "work", text: "Change Billing Address", tags: "billing", color: "#f19b60", resourceId: 2 },
    { id: 2, status: "new", text: "One item added to the cart", tags: "cart", color: "#5dc3f0", resourceId: 3 },
    { id: 3, status: "done", text: "Combine Orders", tags: "orders, combine", color: "#6bbd49", resourceId: 3 },
    { id: 4, status: "work", text: "Login 404 issue", tags: "issue, login", color: "#f19b60", resourceId: 1 },
    { id: 5, status: "done", text: "Patch #2043", tags: "patch", color: "#6bbd49", resourceId: 2 },
    { id: 6, status: "new", text: "Change payment method", tags: "payment", color: "#5dc3f0", resourceId: 2 },
    { id: 7, status: "work", text: "Update the shipping rates", tags: "shipping, rates", color: "#f19b60", resourceId: 3 },
    { id: 8, status: "done", text: "Refund for order #1024", tags: "refund, orders", color: "#6bbd49", resourceId: 1 }
];

// rtl.htm passes this as the Kanban's item template.
var template1 =
    "<div class='jqx-kanban-item' id='kanban-item_0'>" +
        "<div class='jqx-kanban-item-status jqx-kanban-handle'></div>" +
        "<div class='jqx-kanban-item-header'></div>" +
        "<div class='jqx-kanban-item-footer'></div>" +
    "</div>";

var kanbanResources = [
    { id: 1, name: "Andrew Fuller", image: "../../../images/andrew.png", common: true },
    { id: 2, name: "Janet Leverling", image: "../../../images/janet.png" },
    { id: 3, name: "Steven Buchanan", image: "../../../images/steven.png" }
];
