/*
 * Offline demo backend for jqxChat.
 *
 * A jqxChat "sendRequest" callback that fakes an AI assistant entirely in the
 * browser - no key, no network - by streaming a canned reply token by token
 * through widget.appendDelta(). Use it to explore the component's UI and API
 * without wiring a real provider.
 *
 * Usage:
 *   $('#chat').jqxChat({ sendRequest: jqxChatMock });
 *
 * In a real app you would instead set "apiKey" (quick trials) or "proxyUrl"
 * (production) - see the other demos.
 */
(function () {
    var CANNED = [
        {
            match: /jqwidgets|jqx|widget|component/i,
            reply: "**jQWidgets** ships 80+ UI components for jQuery, Angular, React, Vue and Web Components " +
                   "- grids, charts, schedulers, and now this **jqxChat** assistant.\n\n" +
                   "You can drop the chat into any page with a single call:\n\n" +
                   "```js\n$('#chat').jqxChat({\n  provider: 'anthropic',\n  apiKey: 'YOUR_KEY',\n  model: 'claude-opus-4-8'\n});\n```"
        },
        {
            match: /code|example|snippet|function/i,
            reply: "Sure - here is a small example that formats nicely in the chat:\n\n" +
                   "```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet('jQWidgets');\n```\n\n" +
                   "Notice the **copy** button that appears when you hover the code block."
        },
        {
            match: /markdown|format|bold|link/i,
            reply: "I render lightweight Markdown safely: **bold**, *italic*, `inline code`, " +
                   "fenced code blocks and [links](https://www.jqwidgets.com). Everything is HTML-escaped first, " +
                   "so pasted content can never inject markup."
        },
        {
            match: /theme|dark|light|style/i,
            reply: "jqxChat inherits the active jQWidgets theme automatically. Switch the page theme " +
                   "and the chat - bubbles, buttons, avatars and the launcher - all follow along."
        },
        {
            match: /hello|hi|hey|start/i,
            reply: "Hi there! I'm a **demo assistant** running entirely offline. Ask me about jQWidgets, " +
                   "request some code, or try the starter prompts. To talk to a real model, set an `apiKey` " +
                   "or a `proxyUrl` in the widget options."
        }
    ];

    var FALLBACK =
        "This is an **offline demo reply** streamed token by token. In a real deployment jqxChat sends your " +
        "message to Claude, GPT or your own backend and streams the response the same way.\n\n" +
        "Try asking about *jQWidgets*, *code examples*, *markdown*, or *theming*.";

    function pick(text) {
        for (var i = 0; i < CANNED.length; i++) {
            if (CANNED[i].match.test(text)) {
                return CANNED[i].reply;
            }
        }
        return FALLBACK;
    }

    // returns a jQuery Deferred/Promise; streams via widget.appendDelta().
    window.jqxChatMock = function (payload, widget) {
        var history = widget.getMessages();
        var lastUser = '';
        for (var i = history.length - 1; i >= 0; i--) {
            if (history[i].role === 'user') { lastUser = history[i].content; break; }
        }

        var reply = pick(lastUser);
        // split into "tokens" (words + spaces) for a realistic streaming feel.
        var tokens = reply.match(/\s+|\S+/g) || [reply];

        var dfd = (window.jQuery || window.$).Deferred();
        var idx = 0;
        // small initial delay so the typing indicator is visible.
        setTimeout(function step() {
            if (idx >= tokens.length) {
                dfd.resolve(); // finalize from the streamed text
                return;
            }
            widget.appendDelta(tokens[idx++]);
            setTimeout(step, 22 + Math.random() * 45);
        }, 450);

        return dfd.promise();
    };
})();
