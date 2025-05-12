/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hotwired/stimulus/dist/stimulus.js":
/*!**********************************************************!*\
  !*** ./node_modules/@hotwired/stimulus/dist/stimulus.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   Application: () => (/* binding */ Application),
    /* harmony export */   AttributeObserver: () => (/* binding */ AttributeObserver),
    /* harmony export */   Context: () => (/* binding */ Context),
    /* harmony export */   Controller: () => (/* binding */ Controller),
    /* harmony export */   ElementObserver: () => (/* binding */ ElementObserver),
    /* harmony export */   IndexedMultimap: () => (/* binding */ IndexedMultimap),
    /* harmony export */   Multimap: () => (/* binding */ Multimap),
    /* harmony export */   SelectorObserver: () => (/* binding */ SelectorObserver),
    /* harmony export */   StringMapObserver: () => (/* binding */ StringMapObserver),
    /* harmony export */   TokenListObserver: () => (/* binding */ TokenListObserver),
    /* harmony export */   ValueListObserver: () => (/* binding */ ValueListObserver),
    /* harmony export */   add: () => (/* binding */ add),
    /* harmony export */   defaultSchema: () => (/* binding */ defaultSchema),
    /* harmony export */   del: () => (/* binding */ del),
    /* harmony export */   fetch: () => (/* binding */ fetch),
    /* harmony export */   prune: () => (/* binding */ prune)
    /* harmony export */ });
    /*
    Stimulus 3.2.1
    Copyright Â© 2023 Basecamp, LLC
     */
    class EventListener {
        constructor(eventTarget, eventName, eventOptions) {
            this.eventTarget = eventTarget;
            this.eventName = eventName;
            this.eventOptions = eventOptions;
            this.unorderedBindings = new Set();
        }
        connect() {
            this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
        }
        disconnect() {
            this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
        }
        bindingConnected(binding) {
            this.unorderedBindings.add(binding);
        }
        bindingDisconnected(binding) {
            this.unorderedBindings.delete(binding);
        }
        handleEvent(event) {
            const extendedEvent = extendEvent(event);
            for (const binding of this.bindings) {
                if (extendedEvent.immediatePropagationStopped) {
                    break;
                }
                else {
                    binding.handleEvent(extendedEvent);
                }
            }
        }
        hasBindings() {
            return this.unorderedBindings.size > 0;
        }
        get bindings() {
            return Array.from(this.unorderedBindings).sort((left, right) => {
                const leftIndex = left.index, rightIndex = right.index;
                return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
            });
        }
    }
    function extendEvent(event) {
        if ("immediatePropagationStopped" in event) {
            return event;
        }
        else {
            const { stopImmediatePropagation } = event;
            return Object.assign(event, {
                immediatePropagationStopped: false,
                stopImmediatePropagation() {
                    this.immediatePropagationStopped = true;
                    stopImmediatePropagation.call(this);
                },
            });
        }
    }
    
    class Dispatcher {
        constructor(application) {
            this.application = application;
            this.eventListenerMaps = new Map();
            this.started = false;
        }
        start() {
            if (!this.started) {
                this.started = true;
                this.eventListeners.forEach((eventListener) => eventListener.connect());
            }
        }
        stop() {
            if (this.started) {
                this.started = false;
                this.eventListeners.forEach((eventListener) => eventListener.disconnect());
            }
        }
        get eventListeners() {
            return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
        }
        bindingConnected(binding) {
            this.fetchEventListenerForBinding(binding).bindingConnected(binding);
        }
        bindingDisconnected(binding, clearEventListeners = false) {
            this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
            if (clearEventListeners)
                this.clearEventListenersForBinding(binding);
        }
        handleError(error, message, detail = {}) {
            this.application.handleError(error, `Error ${message}`, detail);
        }
        clearEventListenersForBinding(binding) {
            const eventListener = this.fetchEventListenerForBinding(binding);
            if (!eventListener.hasBindings()) {
                eventListener.disconnect();
                this.removeMappedEventListenerFor(binding);
            }
        }
        removeMappedEventListenerFor(binding) {
            const { eventTarget, eventName, eventOptions } = binding;
            const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
            const cacheKey = this.cacheKey(eventName, eventOptions);
            eventListenerMap.delete(cacheKey);
            if (eventListenerMap.size == 0)
                this.eventListenerMaps.delete(eventTarget);
        }
        fetchEventListenerForBinding(binding) {
            const { eventTarget, eventName, eventOptions } = binding;
            return this.fetchEventListener(eventTarget, eventName, eventOptions);
        }
        fetchEventListener(eventTarget, eventName, eventOptions) {
            const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
            const cacheKey = this.cacheKey(eventName, eventOptions);
            let eventListener = eventListenerMap.get(cacheKey);
            if (!eventListener) {
                eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
                eventListenerMap.set(cacheKey, eventListener);
            }
            return eventListener;
        }
        createEventListener(eventTarget, eventName, eventOptions) {
            const eventListener = new EventListener(eventTarget, eventName, eventOptions);
            if (this.started) {
                eventListener.connect();
            }
            return eventListener;
        }
        fetchEventListenerMapForEventTarget(eventTarget) {
            let eventListenerMap = this.eventListenerMaps.get(eventTarget);
            if (!eventListenerMap) {
                eventListenerMap = new Map();
                this.eventListenerMaps.set(eventTarget, eventListenerMap);
            }
            return eventListenerMap;
        }
        cacheKey(eventName, eventOptions) {
            const parts = [eventName];
            Object.keys(eventOptions)
                .sort()
                .forEach((key) => {
                parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
            });
            return parts.join(":");
        }
    }
    
    const defaultActionDescriptorFilters = {
        stop({ event, value }) {
            if (value)
                event.stopPropagation();
            return true;
        },
        prevent({ event, value }) {
            if (value)
                event.preventDefault();
            return true;
        },
        self({ event, value, element }) {
            if (value) {
                return element === event.target;
            }
            else {
                return true;
            }
        },
    };
    const descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
    function parseActionDescriptorString(descriptorString) {
        const source = descriptorString.trim();
        const matches = source.match(descriptorPattern) || [];
        let eventName = matches[2];
        let keyFilter = matches[3];
        if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
            eventName += `.${keyFilter}`;
            keyFilter = "";
        }
        return {
            eventTarget: parseEventTarget(matches[4]),
            eventName,
            eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
            identifier: matches[5],
            methodName: matches[6],
            keyFilter: matches[1] || keyFilter,
        };
    }
    function parseEventTarget(eventTargetName) {
        if (eventTargetName == "window") {
            return window;
        }
        else if (eventTargetName == "document") {
            return document;
        }
    }
    function parseEventOptions(eventOptions) {
        return eventOptions
            .split(":")
            .reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
    }
    function stringifyEventTarget(eventTarget) {
        if (eventTarget == window) {
            return "window";
        }
        else if (eventTarget == document) {
            return "document";
        }
    }
    
    function camelize(value) {
        return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
    }
    function namespaceCamelize(value) {
        return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
    }
    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    function dasherize(value) {
        return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
    }
    function tokenize(value) {
        return value.match(/[^\s]+/g) || [];
    }
    
    function isSomething(object) {
        return object !== null && object !== undefined;
    }
    function hasProperty(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }
    
    const allModifiers = ["meta", "ctrl", "alt", "shift"];
    class Action {
        constructor(element, index, descriptor, schema) {
            this.element = element;
            this.index = index;
            this.eventTarget = descriptor.eventTarget || element;
            this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
            this.eventOptions = descriptor.eventOptions || {};
            this.identifier = descriptor.identifier || error("missing identifier");
            this.methodName = descriptor.methodName || error("missing method name");
            this.keyFilter = descriptor.keyFilter || "";
            this.schema = schema;
        }
        static forToken(token, schema) {
            return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
        }
        toString() {
            const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
            const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
            return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
        }
        shouldIgnoreKeyboardEvent(event) {
            if (!this.keyFilter) {
                return false;
            }
            const filters = this.keyFilter.split("+");
            if (this.keyFilterDissatisfied(event, filters)) {
                return true;
            }
            const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
            if (!standardFilter) {
                return false;
            }
            if (!hasProperty(this.keyMappings, standardFilter)) {
                error(`contains unknown key filter: ${this.keyFilter}`);
            }
            return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
        }
        shouldIgnoreMouseEvent(event) {
            if (!this.keyFilter) {
                return false;
            }
            const filters = [this.keyFilter];
            if (this.keyFilterDissatisfied(event, filters)) {
                return true;
            }
            return false;
        }
        get params() {
            const params = {};
            const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
            for (const { name, value } of Array.from(this.element.attributes)) {
                const match = name.match(pattern);
                const key = match && match[1];
                if (key) {
                    params[camelize(key)] = typecast(value);
                }
            }
            return params;
        }
        get eventTargetName() {
            return stringifyEventTarget(this.eventTarget);
        }
        get keyMappings() {
            return this.schema.keyMappings;
        }
        keyFilterDissatisfied(event, filters) {
            const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
            return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
        }
    }
    const defaultEventNames = {
        a: () => "click",
        button: () => "click",
        form: () => "submit",
        details: () => "toggle",
        input: (e) => (e.getAttribute("type") == "submit" ? "click" : "input"),
        select: () => "change",
        textarea: () => "input",
    };
    function getDefaultEventNameForElement(element) {
        const tagName = element.tagName.toLowerCase();
        if (tagName in defaultEventNames) {
            return defaultEventNames[tagName](element);
        }
    }
    function error(message) {
        throw new Error(message);
    }
    function typecast(value) {
        try {
            return JSON.parse(value);
        }
        catch (o_O) {
            return value;
        }
    }
    
    class Binding {
        constructor(context, action) {
            this.context = context;
            this.action = action;
        }
        get index() {
            return this.action.index;
        }
        get eventTarget() {
            return this.action.eventTarget;
        }
        get eventOptions() {
            return this.action.eventOptions;
        }
        get identifier() {
            return this.context.identifier;
        }
        handleEvent(event) {
            const actionEvent = this.prepareActionEvent(event);
            if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
                this.invokeWithEvent(actionEvent);
            }
        }
        get eventName() {
            return this.action.eventName;
        }
        get method() {
            const method = this.controller[this.methodName];
            if (typeof method == "function") {
                return method;
            }
            throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
        }
        applyEventModifiers(event) {
            const { element } = this.action;
            const { actionDescriptorFilters } = this.context.application;
            const { controller } = this.context;
            let passes = true;
            for (const [name, value] of Object.entries(this.eventOptions)) {
                if (name in actionDescriptorFilters) {
                    const filter = actionDescriptorFilters[name];
                    passes = passes && filter({ name, value, event, element, controller });
                }
                else {
                    continue;
                }
            }
            return passes;
        }
        prepareActionEvent(event) {
            return Object.assign(event, { params: this.action.params });
        }
        invokeWithEvent(event) {
            const { target, currentTarget } = event;
            try {
                this.method.call(this.controller, event);
                this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
            }
            catch (error) {
                const { identifier, controller, element, index } = this;
                const detail = { identifier, controller, element, index, event };
                this.context.handleError(error, `invoking action "${this.action}"`, detail);
            }
        }
        willBeInvokedByEvent(event) {
            const eventTarget = event.target;
            if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
                return false;
            }
            if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
                return false;
            }
            if (this.element === eventTarget) {
                return true;
            }
            else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
                return this.scope.containsElement(eventTarget);
            }
            else {
                return this.scope.containsElement(this.action.element);
            }
        }
        get controller() {
            return this.context.controller;
        }
        get methodName() {
            return this.action.methodName;
        }
        get element() {
            return this.scope.element;
        }
        get scope() {
            return this.context.scope;
        }
    }
    
    class ElementObserver {
        constructor(element, delegate) {
            this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
            this.element = element;
            this.started = false;
            this.delegate = delegate;
            this.elements = new Set();
            this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
        }
        start() {
            if (!this.started) {
                this.started = true;
                this.mutationObserver.observe(this.element, this.mutationObserverInit);
                this.refresh();
            }
        }
        pause(callback) {
            if (this.started) {
                this.mutationObserver.disconnect();
                this.started = false;
            }
            callback();
            if (!this.started) {
                this.mutationObserver.observe(this.element, this.mutationObserverInit);
                this.started = true;
            }
        }
        stop() {
            if (this.started) {
                this.mutationObserver.takeRecords();
                this.mutationObserver.disconnect();
                this.started = false;
            }
        }
        refresh() {
            if (this.started) {
                const matches = new Set(this.matchElementsInTree());
                for (const element of Array.from(this.elements)) {
                    if (!matches.has(element)) {
                        this.removeElement(element);
                    }
                }
                for (const element of Array.from(matches)) {
                    this.addElement(element);
                }
            }
        }
        processMutations(mutations) {
            if (this.started) {
                for (const mutation of mutations) {
                    this.processMutation(mutation);
                }
            }
        }
        processMutation(mutation) {
            if (mutation.type == "attributes") {
                this.processAttributeChange(mutation.target, mutation.attributeName);
            }
            else if (mutation.type == "childList") {
                this.processRemovedNodes(mutation.removedNodes);
                this.processAddedNodes(mutation.addedNodes);
            }
        }
        processAttributeChange(element, attributeName) {
            if (this.elements.has(element)) {
                if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                    this.delegate.elementAttributeChanged(element, attributeName);
                }
                else {
                    this.removeElement(element);
                }
            }
            else if (this.matchElement(element)) {
                this.addElement(element);
            }
        }
        processRemovedNodes(nodes) {
            for (const node of Array.from(nodes)) {
                const element = this.elementFromNode(node);
                if (element) {
                    this.processTree(element, this.removeElement);
                }
            }
        }
        processAddedNodes(nodes) {
            for (const node of Array.from(nodes)) {
                const element = this.elementFromNode(node);
                if (element && this.elementIsActive(element)) {
                    this.processTree(element, this.addElement);
                }
            }
        }
        matchElement(element) {
            return this.delegate.matchElement(element);
        }
        matchElementsInTree(tree = this.element) {
            return this.delegate.matchElementsInTree(tree);
        }
        processTree(tree, processor) {
            for (const element of this.matchElementsInTree(tree)) {
                processor.call(this, element);
            }
        }
        elementFromNode(node) {
            if (node.nodeType == Node.ELEMENT_NODE) {
                return node;
            }
        }
        elementIsActive(element) {
            if (element.isConnected != this.element.isConnected) {
                return false;
            }
            else {
                return this.element.contains(element);
            }
        }
        addElement(element) {
            if (!this.elements.has(element)) {
                if (this.elementIsActive(element)) {
                    this.elements.add(element);
                    if (this.delegate.elementMatched) {
                        this.delegate.elementMatched(element);
                    }
                }
            }
        }
        removeElement(element) {
            if (this.elements.has(element)) {
                this.elements.delete(element);
                if (this.delegate.elementUnmatched) {
                    this.delegate.elementUnmatched(element);
                }
            }
        }
    }
    
    class AttributeObserver {
        constructor(element, attributeName, delegate) {
            this.attributeName = attributeName;
            this.delegate = delegate;
            this.elementObserver = new ElementObserver(element, this);
        }
        get element() {
            return this.elementObserver.element;
        }
        get selector() {
            return `[${this.attributeName}]`;
        }
        start() {
            this.elementObserver.start();
        }
        pause(callback) {
            this.elementObserver.pause(callback);
        }
        stop() {
            this.elementObserver.stop();
        }
        refresh() {
            this.elementObserver.refresh();
        }
        get started() {
            return this.elementObserver.started;
        }
        matchElement(element) {
            return element.hasAttribute(this.attributeName);
        }
        matchElementsInTree(tree) {
            const match = this.matchElement(tree) ? [tree] : [];
            const matches = Array.from(tree.querySelectorAll(this.selector));
            return match.concat(matches);
        }
        elementMatched(element) {
            if (this.delegate.elementMatchedAttribute) {
                this.delegate.elementMatchedAttribute(element, this.attributeName);
            }
        }
        elementUnmatched(element) {
            if (this.delegate.elementUnmatchedAttribute) {
                this.delegate.elementUnmatchedAttribute(element, this.attributeName);
            }
        }
        elementAttributeChanged(element, attributeName) {
            if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
                this.delegate.elementAttributeValueChanged(element, attributeName);
            }
        }
    }
    
    function add(map, key, value) {
        fetch(map, key).add(value);
    }
    function del(map, key, value) {
        fetch(map, key).delete(value);
        prune(map, key);
    }
    function fetch(map, key) {
        let values = map.get(key);
        if (!values) {
            values = new Set();
            map.set(key, values);
        }
        return values;
    }
    function prune(map, key) {
        const values = map.get(key);
        if (values != null && values.size == 0) {
            map.delete(key);
        }
    }
    
    class Multimap {
        constructor() {
            this.valuesByKey = new Map();
        }
        get keys() {
            return Array.from(this.valuesByKey.keys());
        }
        get values() {
            const sets = Array.from(this.valuesByKey.values());
            return sets.reduce((values, set) => values.concat(Array.from(set)), []);
        }
        get size() {
            const sets = Array.from(this.valuesByKey.values());
            return sets.reduce((size, set) => size + set.size, 0);
        }
        add(key, value) {
            add(this.valuesByKey, key, value);
        }
        delete(key, value) {
            del(this.valuesByKey, key, value);
        }
        has(key, value) {
            const values = this.valuesByKey.get(key);
            return values != null && values.has(value);
        }
        hasKey(key) {
            return this.valuesByKey.has(key);
        }
        hasValue(value) {
            const sets = Array.from(this.valuesByKey.values());
            return sets.some((set) => set.has(value));
        }
        getValuesForKey(key) {
            const values = this.valuesByKey.get(key);
            return values ? Array.from(values) : [];
        }
        getKeysForValue(value) {
            return Array.from(this.valuesByKey)
                .filter(([_key, values]) => values.has(value))
                .map(([key, _values]) => key);
        }
    }
    
    class IndexedMultimap extends Multimap {
        constructor() {
            super();
            this.keysByValue = new Map();
        }
        get values() {
            return Array.from(this.keysByValue.keys());
        }
        add(key, value) {
            super.add(key, value);
            add(this.keysByValue, value, key);
        }
        delete(key, value) {
            super.delete(key, value);
            del(this.keysByValue, value, key);
        }
        hasValue(value) {
            return this.keysByValue.has(value);
        }
        getKeysForValue(value) {
            const set = this.keysByValue.get(value);
            return set ? Array.from(set) : [];
        }
    }
    
    class SelectorObserver {
        constructor(element, selector, delegate, details) {
            this._selector = selector;
            this.details = details;
            this.elementObserver = new ElementObserver(element, this);
            this.delegate = delegate;
            this.matchesByElement = new Multimap();
        }
        get started() {
            return this.elementObserver.started;
        }
        get selector() {
            return this._selector;
        }
        set selector(selector) {
            this._selector = selector;
            this.refresh();
        }
        start() {
            this.elementObserver.start();
        }
        pause(callback) {
            this.elementObserver.pause(callback);
        }
        stop() {
            this.elementObserver.stop();
        }
        refresh() {
            this.elementObserver.refresh();
        }
        get element() {
            return this.elementObserver.element;
        }
        matchElement(element) {
            const { selector } = this;
            if (selector) {
                const matches = element.matches(selector);
                if (this.delegate.selectorMatchElement) {
                    return matches && this.delegate.selectorMatchElement(element, this.details);
                }
                return matches;
            }
            else {
                return false;
            }
        }
        matchElementsInTree(tree) {
            const { selector } = this;
            if (selector) {
                const match = this.matchElement(tree) ? [tree] : [];
                const matches = Array.from(tree.querySelectorAll(selector)).filter((match) => this.matchElement(match));
                return match.concat(matches);
            }
            else {
                return [];
            }
        }
        elementMatched(element) {
            const { selector } = this;
            if (selector) {
                this.selectorMatched(element, selector);
            }
        }
        elementUnmatched(element) {
            const selectors = this.matchesByElement.getKeysForValue(element);
            for (const selector of selectors) {
                this.selectorUnmatched(element, selector);
            }
        }
        elementAttributeChanged(element, _attributeName) {
            const { selector } = this;
            if (selector) {
                const matches = this.matchElement(element);
                const matchedBefore = this.matchesByElement.has(selector, element);
                if (matches && !matchedBefore) {
                    this.selectorMatched(element, selector);
                }
                else if (!matches && matchedBefore) {
                    this.selectorUnmatched(element, selector);
                }
            }
        }
        selectorMatched(element, selector) {
            this.delegate.selectorMatched(element, selector, this.details);
            this.matchesByElement.add(selector, element);
        }
        selectorUnmatched(element, selector) {
            this.delegate.selectorUnmatched(element, selector, this.details);
            this.matchesByElement.delete(selector, element);
        }
    }
    
    class StringMapObserver {
        constructor(element, delegate) {
            this.element = element;
            this.delegate = delegate;
            this.started = false;
            this.stringMap = new Map();
            this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
        }
        start() {
            if (!this.started) {
                this.started = true;
                this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
                this.refresh();
            }
        }
        stop() {
            if (this.started) {
                this.mutationObserver.takeRecords();
                this.mutationObserver.disconnect();
                this.started = false;
            }
        }
        refresh() {
            if (this.started) {
                for (const attributeName of this.knownAttributeNames) {
                    this.refreshAttribute(attributeName, null);
                }
            }
        }
        processMutations(mutations) {
            if (this.started) {
                for (const mutation of mutations) {
                    this.processMutation(mutation);
                }
            }
        }
        processMutation(mutation) {
            const attributeName = mutation.attributeName;
            if (attributeName) {
                this.refreshAttribute(attributeName, mutation.oldValue);
            }
        }
        refreshAttribute(attributeName, oldValue) {
            const key = this.delegate.getStringMapKeyForAttribute(attributeName);
            if (key != null) {
                if (!this.stringMap.has(attributeName)) {
                    this.stringMapKeyAdded(key, attributeName);
                }
                const value = this.element.getAttribute(attributeName);
                if (this.stringMap.get(attributeName) != value) {
                    this.stringMapValueChanged(value, key, oldValue);
                }
                if (value == null) {
                    const oldValue = this.stringMap.get(attributeName);
                    this.stringMap.delete(attributeName);
                    if (oldValue)
                        this.stringMapKeyRemoved(key, attributeName, oldValue);
                }
                else {
                    this.stringMap.set(attributeName, value);
                }
            }
        }
        stringMapKeyAdded(key, attributeName) {
            if (this.delegate.stringMapKeyAdded) {
                this.delegate.stringMapKeyAdded(key, attributeName);
            }
        }
        stringMapValueChanged(value, key, oldValue) {
            if (this.delegate.stringMapValueChanged) {
                this.delegate.stringMapValueChanged(value, key, oldValue);
            }
        }
        stringMapKeyRemoved(key, attributeName, oldValue) {
            if (this.delegate.stringMapKeyRemoved) {
                this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
            }
        }
        get knownAttributeNames() {
            return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
        }
        get currentAttributeNames() {
            return Array.from(this.element.attributes).map((attribute) => attribute.name);
        }
        get recordedAttributeNames() {
            return Array.from(this.stringMap.keys());
        }
    }
    
    class TokenListObserver {
        constructor(element, attributeName, delegate) {
            this.attributeObserver = new AttributeObserver(element, attributeName, this);
            this.delegate = delegate;
            this.tokensByElement = new Multimap();
        }
        get started() {
            return this.attributeObserver.started;
        }
        start() {
            this.attributeObserver.start();
        }
        pause(callback) {
            this.attributeObserver.pause(callback);
        }
        stop() {
            this.attributeObserver.stop();
        }
        refresh() {
            this.attributeObserver.refresh();
        }
        get element() {
            return this.attributeObserver.element;
        }
        get attributeName() {
            return this.attributeObserver.attributeName;
        }
        elementMatchedAttribute(element) {
            this.tokensMatched(this.readTokensForElement(element));
        }
        elementAttributeValueChanged(element) {
            const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
            this.tokensUnmatched(unmatchedTokens);
            this.tokensMatched(matchedTokens);
        }
        elementUnmatchedAttribute(element) {
            this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
        }
        tokensMatched(tokens) {
            tokens.forEach((token) => this.tokenMatched(token));
        }
        tokensUnmatched(tokens) {
            tokens.forEach((token) => this.tokenUnmatched(token));
        }
        tokenMatched(token) {
            this.delegate.tokenMatched(token);
            this.tokensByElement.add(token.element, token);
        }
        tokenUnmatched(token) {
            this.delegate.tokenUnmatched(token);
            this.tokensByElement.delete(token.element, token);
        }
        refreshTokensForElement(element) {
            const previousTokens = this.tokensByElement.getValuesForKey(element);
            const currentTokens = this.readTokensForElement(element);
            const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
            if (firstDifferingIndex == -1) {
                return [[], []];
            }
            else {
                return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
            }
        }
        readTokensForElement(element) {
            const attributeName = this.attributeName;
            const tokenString = element.getAttribute(attributeName) || "";
            return parseTokenString(tokenString, element, attributeName);
        }
    }
    function parseTokenString(tokenString, element, attributeName) {
        return tokenString
            .trim()
            .split(/\s+/)
            .filter((content) => content.length)
            .map((content, index) => ({ element, attributeName, content, index }));
    }
    function zip(left, right) {
        const length = Math.max(left.length, right.length);
        return Array.from({ length }, (_, index) => [left[index], right[index]]);
    }
    function tokensAreEqual(left, right) {
        return left && right && left.index == right.index && left.content == right.content;
    }
    
    class ValueListObserver {
        constructor(element, attributeName, delegate) {
            this.tokenListObserver = new TokenListObserver(element, attributeName, this);
            this.delegate = delegate;
            this.parseResultsByToken = new WeakMap();
            this.valuesByTokenByElement = new WeakMap();
        }
        get started() {
            return this.tokenListObserver.started;
        }
        start() {
            this.tokenListObserver.start();
        }
        stop() {
            this.tokenListObserver.stop();
        }
        refresh() {
            this.tokenListObserver.refresh();
        }
        get element() {
            return this.tokenListObserver.element;
        }
        get attributeName() {
            return this.tokenListObserver.attributeName;
        }
        tokenMatched(token) {
            const { element } = token;
            const { value } = this.fetchParseResultForToken(token);
            if (value) {
                this.fetchValuesByTokenForElement(element).set(token, value);
                this.delegate.elementMatchedValue(element, value);
            }
        }
        tokenUnmatched(token) {
            const { element } = token;
            const { value } = this.fetchParseResultForToken(token);
            if (value) {
                this.fetchValuesByTokenForElement(element).delete(token);
                this.delegate.elementUnmatchedValue(element, value);
            }
        }
        fetchParseResultForToken(token) {
            let parseResult = this.parseResultsByToken.get(token);
            if (!parseResult) {
                parseResult = this.parseToken(token);
                this.parseResultsByToken.set(token, parseResult);
            }
            return parseResult;
        }
        fetchValuesByTokenForElement(element) {
            let valuesByToken = this.valuesByTokenByElement.get(element);
            if (!valuesByToken) {
                valuesByToken = new Map();
                this.valuesByTokenByElement.set(element, valuesByToken);
            }
            return valuesByToken;
        }
        parseToken(token) {
            try {
                const value = this.delegate.parseValueForToken(token);
                return { value };
            }
            catch (error) {
                return { error };
            }
        }
    }
    
    class BindingObserver {
        constructor(context, delegate) {
            this.context = context;
            this.delegate = delegate;
            this.bindingsByAction = new Map();
        }
        start() {
            if (!this.valueListObserver) {
                this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
                this.valueListObserver.start();
            }
        }
        stop() {
            if (this.valueListObserver) {
                this.valueListObserver.stop();
                delete this.valueListObserver;
                this.disconnectAllActions();
            }
        }
        get element() {
            return this.context.element;
        }
        get identifier() {
            return this.context.identifier;
        }
        get actionAttribute() {
            return this.schema.actionAttribute;
        }
        get schema() {
            return this.context.schema;
        }
        get bindings() {
            return Array.from(this.bindingsByAction.values());
        }
        connectAction(action) {
            const binding = new Binding(this.context, action);
            this.bindingsByAction.set(action, binding);
            this.delegate.bindingConnected(binding);
        }
        disconnectAction(action) {
            const binding = this.bindingsByAction.get(action);
            if (binding) {
                this.bindingsByAction.delete(action);
                this.delegate.bindingDisconnected(binding);
            }
        }
        disconnectAllActions() {
            this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
            this.bindingsByAction.clear();
        }
        parseValueForToken(token) {
            const action = Action.forToken(token, this.schema);
            if (action.identifier == this.identifier) {
                return action;
            }
        }
        elementMatchedValue(element, action) {
            this.connectAction(action);
        }
        elementUnmatchedValue(element, action) {
            this.disconnectAction(action);
        }
    }
    
    class ValueObserver {
        constructor(context, receiver) {
            this.context = context;
            this.receiver = receiver;
            this.stringMapObserver = new StringMapObserver(this.element, this);
            this.valueDescriptorMap = this.controller.valueDescriptorMap;
        }
        start() {
            this.stringMapObserver.start();
            this.invokeChangedCallbacksForDefaultValues();
        }
        stop() {
            this.stringMapObserver.stop();
        }
        get element() {
            return this.context.element;
        }
        get controller() {
            return this.context.controller;
        }
        getStringMapKeyForAttribute(attributeName) {
            if (attributeName in this.valueDescriptorMap) {
                return this.valueDescriptorMap[attributeName].name;
            }
        }
        stringMapKeyAdded(key, attributeName) {
            const descriptor = this.valueDescriptorMap[attributeName];
            if (!this.hasValue(key)) {
                this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
            }
        }
        stringMapValueChanged(value, name, oldValue) {
            const descriptor = this.valueDescriptorNameMap[name];
            if (value === null)
                return;
            if (oldValue === null) {
                oldValue = descriptor.writer(descriptor.defaultValue);
            }
            this.invokeChangedCallback(name, value, oldValue);
        }
        stringMapKeyRemoved(key, attributeName, oldValue) {
            const descriptor = this.valueDescriptorNameMap[key];
            if (this.hasValue(key)) {
                this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
            }
            else {
                this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
            }
        }
        invokeChangedCallbacksForDefaultValues() {
            for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
                if (defaultValue != undefined && !this.controller.data.has(key)) {
                    this.invokeChangedCallback(name, writer(defaultValue), undefined);
                }
            }
        }
        invokeChangedCallback(name, rawValue, rawOldValue) {
            const changedMethodName = `${name}Changed`;
            const changedMethod = this.receiver[changedMethodName];
            if (typeof changedMethod == "function") {
                const descriptor = this.valueDescriptorNameMap[name];
                try {
                    const value = descriptor.reader(rawValue);
                    let oldValue = rawOldValue;
                    if (rawOldValue) {
                        oldValue = descriptor.reader(rawOldValue);
                    }
                    changedMethod.call(this.receiver, value, oldValue);
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        error.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error.message}`;
                    }
                    throw error;
                }
            }
        }
        get valueDescriptors() {
            const { valueDescriptorMap } = this;
            return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
        }
        get valueDescriptorNameMap() {
            const descriptors = {};
            Object.keys(this.valueDescriptorMap).forEach((key) => {
                const descriptor = this.valueDescriptorMap[key];
                descriptors[descriptor.name] = descriptor;
            });
            return descriptors;
        }
        hasValue(attributeName) {
            const descriptor = this.valueDescriptorNameMap[attributeName];
            const hasMethodName = `has${capitalize(descriptor.name)}`;
            return this.receiver[hasMethodName];
        }
    }
    
    class TargetObserver {
        constructor(context, delegate) {
            this.context = context;
            this.delegate = delegate;
            this.targetsByName = new Multimap();
        }
        start() {
            if (!this.tokenListObserver) {
                this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
                this.tokenListObserver.start();
            }
        }
        stop() {
            if (this.tokenListObserver) {
                this.disconnectAllTargets();
                this.tokenListObserver.stop();
                delete this.tokenListObserver;
            }
        }
        tokenMatched({ element, content: name }) {
            if (this.scope.containsElement(element)) {
                this.connectTarget(element, name);
            }
        }
        tokenUnmatched({ element, content: name }) {
            this.disconnectTarget(element, name);
        }
        connectTarget(element, name) {
            var _a;
            if (!this.targetsByName.has(name, element)) {
                this.targetsByName.add(name, element);
                (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
            }
        }
        disconnectTarget(element, name) {
            var _a;
            if (this.targetsByName.has(name, element)) {
                this.targetsByName.delete(name, element);
                (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
            }
        }
        disconnectAllTargets() {
            for (const name of this.targetsByName.keys) {
                for (const element of this.targetsByName.getValuesForKey(name)) {
                    this.disconnectTarget(element, name);
                }
            }
        }
        get attributeName() {
            return `data-${this.context.identifier}-target`;
        }
        get element() {
            return this.context.element;
        }
        get scope() {
            return this.context.scope;
        }
    }
    
    function readInheritableStaticArrayValues(constructor, propertyName) {
        const ancestors = getAncestorsForConstructor(constructor);
        return Array.from(ancestors.reduce((values, constructor) => {
            getOwnStaticArrayValues(constructor, propertyName).forEach((name) => values.add(name));
            return values;
        }, new Set()));
    }
    function readInheritableStaticObjectPairs(constructor, propertyName) {
        const ancestors = getAncestorsForConstructor(constructor);
        return ancestors.reduce((pairs, constructor) => {
            pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
            return pairs;
        }, []);
    }
    function getAncestorsForConstructor(constructor) {
        const ancestors = [];
        while (constructor) {
            ancestors.push(constructor);
            constructor = Object.getPrototypeOf(constructor);
        }
        return ancestors.reverse();
    }
    function getOwnStaticArrayValues(constructor, propertyName) {
        const definition = constructor[propertyName];
        return Array.isArray(definition) ? definition : [];
    }
    function getOwnStaticObjectPairs(constructor, propertyName) {
        const definition = constructor[propertyName];
        return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
    }
    
    class OutletObserver {
        constructor(context, delegate) {
            this.started = false;
            this.context = context;
            this.delegate = delegate;
            this.outletsByName = new Multimap();
            this.outletElementsByName = new Multimap();
            this.selectorObserverMap = new Map();
            this.attributeObserverMap = new Map();
        }
        start() {
            if (!this.started) {
                this.outletDefinitions.forEach((outletName) => {
                    this.setupSelectorObserverForOutlet(outletName);
                    this.setupAttributeObserverForOutlet(outletName);
                });
                this.started = true;
                this.dependentContexts.forEach((context) => context.refresh());
            }
        }
        refresh() {
            this.selectorObserverMap.forEach((observer) => observer.refresh());
            this.attributeObserverMap.forEach((observer) => observer.refresh());
        }
        stop() {
            if (this.started) {
                this.started = false;
                this.disconnectAllOutlets();
                this.stopSelectorObservers();
                this.stopAttributeObservers();
            }
        }
        stopSelectorObservers() {
            if (this.selectorObserverMap.size > 0) {
                this.selectorObserverMap.forEach((observer) => observer.stop());
                this.selectorObserverMap.clear();
            }
        }
        stopAttributeObservers() {
            if (this.attributeObserverMap.size > 0) {
                this.attributeObserverMap.forEach((observer) => observer.stop());
                this.attributeObserverMap.clear();
            }
        }
        selectorMatched(element, _selector, { outletName }) {
            const outlet = this.getOutlet(element, outletName);
            if (outlet) {
                this.connectOutlet(outlet, element, outletName);
            }
        }
        selectorUnmatched(element, _selector, { outletName }) {
            const outlet = this.getOutletFromMap(element, outletName);
            if (outlet) {
                this.disconnectOutlet(outlet, element, outletName);
            }
        }
        selectorMatchElement(element, { outletName }) {
            const selector = this.selector(outletName);
            const hasOutlet = this.hasOutlet(element, outletName);
            const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
            if (selector) {
                return hasOutlet && hasOutletController && element.matches(selector);
            }
            else {
                return false;
            }
        }
        elementMatchedAttribute(_element, attributeName) {
            const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
            if (outletName) {
                this.updateSelectorObserverForOutlet(outletName);
            }
        }
        elementAttributeValueChanged(_element, attributeName) {
            const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
            if (outletName) {
                this.updateSelectorObserverForOutlet(outletName);
            }
        }
        elementUnmatchedAttribute(_element, attributeName) {
            const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
            if (outletName) {
                this.updateSelectorObserverForOutlet(outletName);
            }
        }
        connectOutlet(outlet, element, outletName) {
            var _a;
            if (!this.outletElementsByName.has(outletName, element)) {
                this.outletsByName.add(outletName, outlet);
                this.outletElementsByName.add(outletName, element);
                (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
            }
        }
        disconnectOutlet(outlet, element, outletName) {
            var _a;
            if (this.outletElementsByName.has(outletName, element)) {
                this.outletsByName.delete(outletName, outlet);
                this.outletElementsByName.delete(outletName, element);
                (_a = this.selectorObserverMap
                    .get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
            }
        }
        disconnectAllOutlets() {
            for (const outletName of this.outletElementsByName.keys) {
                for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
                    for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
                        this.disconnectOutlet(outlet, element, outletName);
                    }
                }
            }
        }
        updateSelectorObserverForOutlet(outletName) {
            const observer = this.selectorObserverMap.get(outletName);
            if (observer) {
                observer.selector = this.selector(outletName);
            }
        }
        setupSelectorObserverForOutlet(outletName) {
            const selector = this.selector(outletName);
            const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
            this.selectorObserverMap.set(outletName, selectorObserver);
            selectorObserver.start();
        }
        setupAttributeObserverForOutlet(outletName) {
            const attributeName = this.attributeNameForOutletName(outletName);
            const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
            this.attributeObserverMap.set(outletName, attributeObserver);
            attributeObserver.start();
        }
        selector(outletName) {
            return this.scope.outlets.getSelectorForOutletName(outletName);
        }
        attributeNameForOutletName(outletName) {
            return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
        }
        getOutletNameFromOutletAttributeName(attributeName) {
            return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
        }
        get outletDependencies() {
            const dependencies = new Multimap();
            this.router.modules.forEach((module) => {
                const constructor = module.definition.controllerConstructor;
                const outlets = readInheritableStaticArrayValues(constructor, "outlets");
                outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
            });
            return dependencies;
        }
        get outletDefinitions() {
            return this.outletDependencies.getKeysForValue(this.identifier);
        }
        get dependentControllerIdentifiers() {
            return this.outletDependencies.getValuesForKey(this.identifier);
        }
        get dependentContexts() {
            const identifiers = this.dependentControllerIdentifiers;
            return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
        }
        hasOutlet(element, outletName) {
            return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
        }
        getOutlet(element, outletName) {
            return this.application.getControllerForElementAndIdentifier(element, outletName);
        }
        getOutletFromMap(element, outletName) {
            return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
        }
        get scope() {
            return this.context.scope;
        }
        get schema() {
            return this.context.schema;
        }
        get identifier() {
            return this.context.identifier;
        }
        get application() {
            return this.context.application;
        }
        get router() {
            return this.application.router;
        }
    }
    
    class Context {
        constructor(module, scope) {
            this.logDebugActivity = (functionName, detail = {}) => {
                const { identifier, controller, element } = this;
                detail = Object.assign({ identifier, controller, element }, detail);
                this.application.logDebugActivity(this.identifier, functionName, detail);
            };
            this.module = module;
            this.scope = scope;
            this.controller = new module.controllerConstructor(this);
            this.bindingObserver = new BindingObserver(this, this.dispatcher);
            this.valueObserver = new ValueObserver(this, this.controller);
            this.targetObserver = new TargetObserver(this, this);
            this.outletObserver = new OutletObserver(this, this);
            try {
                this.controller.initialize();
                this.logDebugActivity("initialize");
            }
            catch (error) {
                this.handleError(error, "initializing controller");
            }
        }
        connect() {
            this.bindingObserver.start();
            this.valueObserver.start();
            this.targetObserver.start();
            this.outletObserver.start();
            try {
                this.controller.connect();
                this.logDebugActivity("connect");
            }
            catch (error) {
                this.handleError(error, "connecting controller");
            }
        }
        refresh() {
            this.outletObserver.refresh();
        }
        disconnect() {
            try {
                this.controller.disconnect();
                this.logDebugActivity("disconnect");
            }
            catch (error) {
                this.handleError(error, "disconnecting controller");
            }
            this.outletObserver.stop();
            this.targetObserver.stop();
            this.valueObserver.stop();
            this.bindingObserver.stop();
        }
        get application() {
            return this.module.application;
        }
        get identifier() {
            return this.module.identifier;
        }
        get schema() {
            return this.application.schema;
        }
        get dispatcher() {
            return this.application.dispatcher;
        }
        get element() {
            return this.scope.element;
        }
        get parentElement() {
            return this.element.parentElement;
        }
        handleError(error, message, detail = {}) {
            const { identifier, controller, element } = this;
            detail = Object.assign({ identifier, controller, element }, detail);
            this.application.handleError(error, `Error ${message}`, detail);
        }
        targetConnected(element, name) {
            this.invokeControllerMethod(`${name}TargetConnected`, element);
        }
        targetDisconnected(element, name) {
            this.invokeControllerMethod(`${name}TargetDisconnected`, element);
        }
        outletConnected(outlet, element, name) {
            this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
        }
        outletDisconnected(outlet, element, name) {
            this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
        }
        invokeControllerMethod(methodName, ...args) {
            const controller = this.controller;
            if (typeof controller[methodName] == "function") {
                controller[methodName](...args);
            }
        }
    }
    
    function bless(constructor) {
        return shadow(constructor, getBlessedProperties(constructor));
    }
    function shadow(constructor, properties) {
        const shadowConstructor = extend(constructor);
        const shadowProperties = getShadowProperties(constructor.prototype, properties);
        Object.defineProperties(shadowConstructor.prototype, shadowProperties);
        return shadowConstructor;
    }
    function getBlessedProperties(constructor) {
        const blessings = readInheritableStaticArrayValues(constructor, "blessings");
        return blessings.reduce((blessedProperties, blessing) => {
            const properties = blessing(constructor);
            for (const key in properties) {
                const descriptor = blessedProperties[key] || {};
                blessedProperties[key] = Object.assign(descriptor, properties[key]);
            }
            return blessedProperties;
        }, {});
    }
    function getShadowProperties(prototype, properties) {
        return getOwnKeys(properties).reduce((shadowProperties, key) => {
            const descriptor = getShadowedDescriptor(prototype, properties, key);
            if (descriptor) {
                Object.assign(shadowProperties, { [key]: descriptor });
            }
            return shadowProperties;
        }, {});
    }
    function getShadowedDescriptor(prototype, properties, key) {
        const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
        const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
        if (!shadowedByValue) {
            const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
            if (shadowingDescriptor) {
                descriptor.get = shadowingDescriptor.get || descriptor.get;
                descriptor.set = shadowingDescriptor.set || descriptor.set;
            }
            return descriptor;
        }
    }
    const getOwnKeys = (() => {
        if (typeof Object.getOwnPropertySymbols == "function") {
            return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
        }
        else {
            return Object.getOwnPropertyNames;
        }
    })();
    const extend = (() => {
        function extendWithReflect(constructor) {
            function extended() {
                return Reflect.construct(constructor, arguments, new.target);
            }
            extended.prototype = Object.create(constructor.prototype, {
                constructor: { value: extended },
            });
            Reflect.setPrototypeOf(extended, constructor);
            return extended;
        }
        function testReflectExtension() {
            const a = function () {
                this.a.call(this);
            };
            const b = extendWithReflect(a);
            b.prototype.a = function () { };
            return new b();
        }
        try {
            testReflectExtension();
            return extendWithReflect;
        }
        catch (error) {
            return (constructor) => class extended extends constructor {
            };
        }
    })();
    
    function blessDefinition(definition) {
        return {
            identifier: definition.identifier,
            controllerConstructor: bless(definition.controllerConstructor),
        };
    }
    
    class Module {
        constructor(application, definition) {
            this.application = application;
            this.definition = blessDefinition(definition);
            this.contextsByScope = new WeakMap();
            this.connectedContexts = new Set();
        }
        get identifier() {
            return this.definition.identifier;
        }
        get controllerConstructor() {
            return this.definition.controllerConstructor;
        }
        get contexts() {
            return Array.from(this.connectedContexts);
        }
        connectContextForScope(scope) {
            const context = this.fetchContextForScope(scope);
            this.connectedContexts.add(context);
            context.connect();
        }
        disconnectContextForScope(scope) {
            const context = this.contextsByScope.get(scope);
            if (context) {
                this.connectedContexts.delete(context);
                context.disconnect();
            }
        }
        fetchContextForScope(scope) {
            let context = this.contextsByScope.get(scope);
            if (!context) {
                context = new Context(this, scope);
                this.contextsByScope.set(scope, context);
            }
            return context;
        }
    }
    
    class ClassMap {
        constructor(scope) {
            this.scope = scope;
        }
        has(name) {
            return this.data.has(this.getDataKey(name));
        }
        get(name) {
            return this.getAll(name)[0];
        }
        getAll(name) {
            const tokenString = this.data.get(this.getDataKey(name)) || "";
            return tokenize(tokenString);
        }
        getAttributeName(name) {
            return this.data.getAttributeNameForKey(this.getDataKey(name));
        }
        getDataKey(name) {
            return `${name}-class`;
        }
        get data() {
            return this.scope.data;
        }
    }
    
    class DataMap {
        constructor(scope) {
            this.scope = scope;
        }
        get element() {
            return this.scope.element;
        }
        get identifier() {
            return this.scope.identifier;
        }
        get(key) {
            const name = this.getAttributeNameForKey(key);
            return this.element.getAttribute(name);
        }
        set(key, value) {
            const name = this.getAttributeNameForKey(key);
            this.element.setAttribute(name, value);
            return this.get(key);
        }
        has(key) {
            const name = this.getAttributeNameForKey(key);
            return this.element.hasAttribute(name);
        }
        delete(key) {
            if (this.has(key)) {
                const name = this.getAttributeNameForKey(key);
                this.element.removeAttribute(name);
                return true;
            }
            else {
                return false;
            }
        }
        getAttributeNameForKey(key) {
            return `data-${this.identifier}-${dasherize(key)}`;
        }
    }
    
    class Guide {
        constructor(logger) {
            this.warnedKeysByObject = new WeakMap();
            this.logger = logger;
        }
        warn(object, key, message) {
            let warnedKeys = this.warnedKeysByObject.get(object);
            if (!warnedKeys) {
                warnedKeys = new Set();
                this.warnedKeysByObject.set(object, warnedKeys);
            }
            if (!warnedKeys.has(key)) {
                warnedKeys.add(key);
                this.logger.warn(message, object);
            }
        }
    }
    
    function attributeValueContainsToken(attributeName, token) {
        return `[${attributeName}~="${token}"]`;
    }
    
    class TargetSet {
        constructor(scope) {
            this.scope = scope;
        }
        get element() {
            return this.scope.element;
        }
        get identifier() {
            return this.scope.identifier;
        }
        get schema() {
            return this.scope.schema;
        }
        has(targetName) {
            return this.find(targetName) != null;
        }
        find(...targetNames) {
            return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), undefined);
        }
        findAll(...targetNames) {
            return targetNames.reduce((targets, targetName) => [
                ...targets,
                ...this.findAllTargets(targetName),
                ...this.findAllLegacyTargets(targetName),
            ], []);
        }
        findTarget(targetName) {
            const selector = this.getSelectorForTargetName(targetName);
            return this.scope.findElement(selector);
        }
        findAllTargets(targetName) {
            const selector = this.getSelectorForTargetName(targetName);
            return this.scope.findAllElements(selector);
        }
        getSelectorForTargetName(targetName) {
            const attributeName = this.schema.targetAttributeForScope(this.identifier);
            return attributeValueContainsToken(attributeName, targetName);
        }
        findLegacyTarget(targetName) {
            const selector = this.getLegacySelectorForTargetName(targetName);
            return this.deprecate(this.scope.findElement(selector), targetName);
        }
        findAllLegacyTargets(targetName) {
            const selector = this.getLegacySelectorForTargetName(targetName);
            return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
        }
        getLegacySelectorForTargetName(targetName) {
            const targetDescriptor = `${this.identifier}.${targetName}`;
            return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
        }
        deprecate(element, targetName) {
            if (element) {
                const { identifier } = this;
                const attributeName = this.schema.targetAttribute;
                const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
                this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". ` +
                    `The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
            }
            return element;
        }
        get guide() {
            return this.scope.guide;
        }
    }
    
    class OutletSet {
        constructor(scope, controllerElement) {
            this.scope = scope;
            this.controllerElement = controllerElement;
        }
        get element() {
            return this.scope.element;
        }
        get identifier() {
            return this.scope.identifier;
        }
        get schema() {
            return this.scope.schema;
        }
        has(outletName) {
            return this.find(outletName) != null;
        }
        find(...outletNames) {
            return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), undefined);
        }
        findAll(...outletNames) {
            return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
        }
        getSelectorForOutletName(outletName) {
            const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
            return this.controllerElement.getAttribute(attributeName);
        }
        findOutlet(outletName) {
            const selector = this.getSelectorForOutletName(outletName);
            if (selector)
                return this.findElement(selector, outletName);
        }
        findAllOutlets(outletName) {
            const selector = this.getSelectorForOutletName(outletName);
            return selector ? this.findAllElements(selector, outletName) : [];
        }
        findElement(selector, outletName) {
            const elements = this.scope.queryElements(selector);
            return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
        }
        findAllElements(selector, outletName) {
            const elements = this.scope.queryElements(selector);
            return elements.filter((element) => this.matchesElement(element, selector, outletName));
        }
        matchesElement(element, selector, outletName) {
            const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
            return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
        }
    }
    
    class Scope {
        constructor(schema, element, identifier, logger) {
            this.targets = new TargetSet(this);
            this.classes = new ClassMap(this);
            this.data = new DataMap(this);
            this.containsElement = (element) => {
                return element.closest(this.controllerSelector) === this.element;
            };
            this.schema = schema;
            this.element = element;
            this.identifier = identifier;
            this.guide = new Guide(logger);
            this.outlets = new OutletSet(this.documentScope, element);
        }
        findElement(selector) {
            return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
        }
        findAllElements(selector) {
            return [
                ...(this.element.matches(selector) ? [this.element] : []),
                ...this.queryElements(selector).filter(this.containsElement),
            ];
        }
        queryElements(selector) {
            return Array.from(this.element.querySelectorAll(selector));
        }
        get controllerSelector() {
            return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
        }
        get isDocumentScope() {
            return this.element === document.documentElement;
        }
        get documentScope() {
            return this.isDocumentScope
                ? this
                : new Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
        }
    }
    
    class ScopeObserver {
        constructor(element, schema, delegate) {
            this.element = element;
            this.schema = schema;
            this.delegate = delegate;
            this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
            this.scopesByIdentifierByElement = new WeakMap();
            this.scopeReferenceCounts = new WeakMap();
        }
        start() {
            this.valueListObserver.start();
        }
        stop() {
            this.valueListObserver.stop();
        }
        get controllerAttribute() {
            return this.schema.controllerAttribute;
        }
        parseValueForToken(token) {
            const { element, content: identifier } = token;
            return this.parseValueForElementAndIdentifier(element, identifier);
        }
        parseValueForElementAndIdentifier(element, identifier) {
            const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
            let scope = scopesByIdentifier.get(identifier);
            if (!scope) {
                scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
                scopesByIdentifier.set(identifier, scope);
            }
            return scope;
        }
        elementMatchedValue(element, value) {
            const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
            this.scopeReferenceCounts.set(value, referenceCount);
            if (referenceCount == 1) {
                this.delegate.scopeConnected(value);
            }
        }
        elementUnmatchedValue(element, value) {
            const referenceCount = this.scopeReferenceCounts.get(value);
            if (referenceCount) {
                this.scopeReferenceCounts.set(value, referenceCount - 1);
                if (referenceCount == 1) {
                    this.delegate.scopeDisconnected(value);
                }
            }
        }
        fetchScopesByIdentifierForElement(element) {
            let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
            if (!scopesByIdentifier) {
                scopesByIdentifier = new Map();
                this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
            }
            return scopesByIdentifier;
        }
    }
    
    class Router {
        constructor(application) {
            this.application = application;
            this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
            this.scopesByIdentifier = new Multimap();
            this.modulesByIdentifier = new Map();
        }
        get element() {
            return this.application.element;
        }
        get schema() {
            return this.application.schema;
        }
        get logger() {
            return this.application.logger;
        }
        get controllerAttribute() {
            return this.schema.controllerAttribute;
        }
        get modules() {
            return Array.from(this.modulesByIdentifier.values());
        }
        get contexts() {
            return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
        }
        start() {
            this.scopeObserver.start();
        }
        stop() {
            this.scopeObserver.stop();
        }
        loadDefinition(definition) {
            this.unloadIdentifier(definition.identifier);
            const module = new Module(this.application, definition);
            this.connectModule(module);
            const afterLoad = definition.controllerConstructor.afterLoad;
            if (afterLoad) {
                afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
            }
        }
        unloadIdentifier(identifier) {
            const module = this.modulesByIdentifier.get(identifier);
            if (module) {
                this.disconnectModule(module);
            }
        }
        getContextForElementAndIdentifier(element, identifier) {
            const module = this.modulesByIdentifier.get(identifier);
            if (module) {
                return module.contexts.find((context) => context.element == element);
            }
        }
        proposeToConnectScopeForElementAndIdentifier(element, identifier) {
            const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
            if (scope) {
                this.scopeObserver.elementMatchedValue(scope.element, scope);
            }
            else {
                console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
            }
        }
        handleError(error, message, detail) {
            this.application.handleError(error, message, detail);
        }
        createScopeForElementAndIdentifier(element, identifier) {
            return new Scope(this.schema, element, identifier, this.logger);
        }
        scopeConnected(scope) {
            this.scopesByIdentifier.add(scope.identifier, scope);
            const module = this.modulesByIdentifier.get(scope.identifier);
            if (module) {
                module.connectContextForScope(scope);
            }
        }
        scopeDisconnected(scope) {
            this.scopesByIdentifier.delete(scope.identifier, scope);
            const module = this.modulesByIdentifier.get(scope.identifier);
            if (module) {
                module.disconnectContextForScope(scope);
            }
        }
        connectModule(module) {
            this.modulesByIdentifier.set(module.identifier, module);
            const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
            scopes.forEach((scope) => module.connectContextForScope(scope));
        }
        disconnectModule(module) {
            this.modulesByIdentifier.delete(module.identifier);
            const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
            scopes.forEach((scope) => module.disconnectContextForScope(scope));
        }
    }
    
    const defaultSchema = {
        controllerAttribute: "data-controller",
        actionAttribute: "data-action",
        targetAttribute: "data-target",
        targetAttributeForScope: (identifier) => `data-${identifier}-target`,
        outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
        keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n]))),
    };
    function objectFromEntries(array) {
        return array.reduce((memo, [k, v]) => (Object.assign(Object.assign({}, memo), { [k]: v })), {});
    }
    
    class Application {
        constructor(element = document.documentElement, schema = defaultSchema) {
            this.logger = console;
            this.debug = false;
            this.logDebugActivity = (identifier, functionName, detail = {}) => {
                if (this.debug) {
                    this.logFormattedMessage(identifier, functionName, detail);
                }
            };
            this.element = element;
            this.schema = schema;
            this.dispatcher = new Dispatcher(this);
            this.router = new Router(this);
            this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
        }
        static start(element, schema) {
            const application = new this(element, schema);
            application.start();
            return application;
        }
        async start() {
            await domReady();
            this.logDebugActivity("application", "starting");
            this.dispatcher.start();
            this.router.start();
            this.logDebugActivity("application", "start");
        }
        stop() {
            this.logDebugActivity("application", "stopping");
            this.dispatcher.stop();
            this.router.stop();
            this.logDebugActivity("application", "stop");
        }
        register(identifier, controllerConstructor) {
            this.load({ identifier, controllerConstructor });
        }
        registerActionOption(name, filter) {
            this.actionDescriptorFilters[name] = filter;
        }
        load(head, ...rest) {
            const definitions = Array.isArray(head) ? head : [head, ...rest];
            definitions.forEach((definition) => {
                if (definition.controllerConstructor.shouldLoad) {
                    this.router.loadDefinition(definition);
                }
            });
        }
        unload(head, ...rest) {
            const identifiers = Array.isArray(head) ? head : [head, ...rest];
            identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
        }
        get controllers() {
            return this.router.contexts.map((context) => context.controller);
        }
        getControllerForElementAndIdentifier(element, identifier) {
            const context = this.router.getContextForElementAndIdentifier(element, identifier);
            return context ? context.controller : null;
        }
        handleError(error, message, detail) {
            var _a;
            this.logger.error(`%s\n\n%o\n\n%o`, message, error, detail);
            (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
        }
        logFormattedMessage(identifier, functionName, detail = {}) {
            detail = Object.assign({ application: this }, detail);
            this.logger.groupCollapsed(`${identifier} #${functionName}`);
            this.logger.log("details:", Object.assign({}, detail));
            this.logger.groupEnd();
        }
    }
    function domReady() {
        return new Promise((resolve) => {
            if (document.readyState == "loading") {
                document.addEventListener("DOMContentLoaded", () => resolve());
            }
            else {
                resolve();
            }
        });
    }
    
    function ClassPropertiesBlessing(constructor) {
        const classes = readInheritableStaticArrayValues(constructor, "classes");
        return classes.reduce((properties, classDefinition) => {
            return Object.assign(properties, propertiesForClassDefinition(classDefinition));
        }, {});
    }
    function propertiesForClassDefinition(key) {
        return {
            [`${key}Class`]: {
                get() {
                    const { classes } = this;
                    if (classes.has(key)) {
                        return classes.get(key);
                    }
                    else {
                        const attribute = classes.getAttributeName(key);
                        throw new Error(`Missing attribute "${attribute}"`);
                    }
                },
            },
            [`${key}Classes`]: {
                get() {
                    return this.classes.getAll(key);
                },
            },
            [`has${capitalize(key)}Class`]: {
                get() {
                    return this.classes.has(key);
                },
            },
        };
    }
    
    function OutletPropertiesBlessing(constructor) {
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        return outlets.reduce((properties, outletDefinition) => {
            return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
        }, {});
    }
    function getOutletController(controller, element, identifier) {
        return controller.application.getControllerForElementAndIdentifier(element, identifier);
    }
    function getControllerAndEnsureConnectedScope(controller, element, outletName) {
        let outletController = getOutletController(controller, element, outletName);
        if (outletController)
            return outletController;
        controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
        outletController = getOutletController(controller, element, outletName);
        if (outletController)
            return outletController;
    }
    function propertiesForOutletDefinition(name) {
        const camelizedName = namespaceCamelize(name);
        return {
            [`${camelizedName}Outlet`]: {
                get() {
                    const outletElement = this.outlets.find(name);
                    const selector = this.outlets.getSelectorForOutletName(name);
                    if (outletElement) {
                        const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                        if (outletController)
                            return outletController;
                        throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
                    }
                    throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
                },
            },
            [`${camelizedName}Outlets`]: {
                get() {
                    const outlets = this.outlets.findAll(name);
                    if (outlets.length > 0) {
                        return outlets
                            .map((outletElement) => {
                            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                            if (outletController)
                                return outletController;
                            console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
                        })
                            .filter((controller) => controller);
                    }
                    return [];
                },
            },
            [`${camelizedName}OutletElement`]: {
                get() {
                    const outletElement = this.outlets.find(name);
                    const selector = this.outlets.getSelectorForOutletName(name);
                    if (outletElement) {
                        return outletElement;
                    }
                    else {
                        throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
                    }
                },
            },
            [`${camelizedName}OutletElements`]: {
                get() {
                    return this.outlets.findAll(name);
                },
            },
            [`has${capitalize(camelizedName)}Outlet`]: {
                get() {
                    return this.outlets.has(name);
                },
            },
        };
    }
    
    function TargetPropertiesBlessing(constructor) {
        const targets = readInheritableStaticArrayValues(constructor, "targets");
        return targets.reduce((properties, targetDefinition) => {
            return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
        }, {});
    }
    function propertiesForTargetDefinition(name) {
        return {
            [`${name}Target`]: {
                get() {
                    const target = this.targets.find(name);
                    if (target) {
                        return target;
                    }
                    else {
                        throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                    }
                },
            },
            [`${name}Targets`]: {
                get() {
                    return this.targets.findAll(name);
                },
            },
            [`has${capitalize(name)}Target`]: {
                get() {
                    return this.targets.has(name);
                },
            },
        };
    }
    
    function ValuePropertiesBlessing(constructor) {
        const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
        const propertyDescriptorMap = {
            valueDescriptorMap: {
                get() {
                    return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                        const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                        const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                        return Object.assign(result, { [attributeName]: valueDescriptor });
                    }, {});
                },
            },
        };
        return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
            return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
        }, propertyDescriptorMap);
    }
    function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
        const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
        const { key, name, reader: read, writer: write } = definition;
        return {
            [name]: {
                get() {
                    const value = this.data.get(key);
                    if (value !== null) {
                        return read(value);
                    }
                    else {
                        return definition.defaultValue;
                    }
                },
                set(value) {
                    if (value === undefined) {
                        this.data.delete(key);
                    }
                    else {
                        this.data.set(key, write(value));
                    }
                },
            },
            [`has${capitalize(name)}`]: {
                get() {
                    return this.data.has(key) || definition.hasCustomDefaultValue;
                },
            },
        };
    }
    function parseValueDefinitionPair([token, typeDefinition], controller) {
        return valueDescriptorForTokenAndTypeDefinition({
            controller,
            token,
            typeDefinition,
        });
    }
    function parseValueTypeConstant(constant) {
        switch (constant) {
            case Array:
                return "array";
            case Boolean:
                return "boolean";
            case Number:
                return "number";
            case Object:
                return "object";
            case String:
                return "string";
        }
    }
    function parseValueTypeDefault(defaultValue) {
        switch (typeof defaultValue) {
            case "boolean":
                return "boolean";
            case "number":
                return "number";
            case "string":
                return "string";
        }
        if (Array.isArray(defaultValue))
            return "array";
        if (Object.prototype.toString.call(defaultValue) === "[object Object]")
            return "object";
    }
    function parseValueTypeObject(payload) {
        const { controller, token, typeObject } = payload;
        const hasType = isSomething(typeObject.type);
        const hasDefault = isSomething(typeObject.default);
        const fullObject = hasType && hasDefault;
        const onlyType = hasType && !hasDefault;
        const onlyDefault = !hasType && hasDefault;
        const typeFromObject = parseValueTypeConstant(typeObject.type);
        const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
        if (onlyType)
            return typeFromObject;
        if (onlyDefault)
            return typeFromDefaultValue;
        if (typeFromObject !== typeFromDefaultValue) {
            const propertyPath = controller ? `${controller}.${token}` : token;
            throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
        }
        if (fullObject)
            return typeFromObject;
    }
    function parseValueTypeDefinition(payload) {
        const { controller, token, typeDefinition } = payload;
        const typeObject = { controller, token, typeObject: typeDefinition };
        const typeFromObject = parseValueTypeObject(typeObject);
        const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
        const typeFromConstant = parseValueTypeConstant(typeDefinition);
        const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
        if (type)
            return type;
        const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
        throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
    }
    function defaultValueForDefinition(typeDefinition) {
        const constant = parseValueTypeConstant(typeDefinition);
        if (constant)
            return defaultValuesByType[constant];
        const hasDefault = hasProperty(typeDefinition, "default");
        const hasType = hasProperty(typeDefinition, "type");
        const typeObject = typeDefinition;
        if (hasDefault)
            return typeObject.default;
        if (hasType) {
            const { type } = typeObject;
            const constantFromType = parseValueTypeConstant(type);
            if (constantFromType)
                return defaultValuesByType[constantFromType];
        }
        return typeDefinition;
    }
    function valueDescriptorForTokenAndTypeDefinition(payload) {
        const { token, typeDefinition } = payload;
        const key = `${dasherize(token)}-value`;
        const type = parseValueTypeDefinition(payload);
        return {
            type,
            key,
            name: camelize(key),
            get defaultValue() {
                return defaultValueForDefinition(typeDefinition);
            },
            get hasCustomDefaultValue() {
                return parseValueTypeDefault(typeDefinition) !== undefined;
            },
            reader: readers[type],
            writer: writers[type] || writers.default,
        };
    }
    const defaultValuesByType = {
        get array() {
            return [];
        },
        boolean: false,
        number: 0,
        get object() {
            return {};
        },
        string: "",
    };
    const readers = {
        array(value) {
            const array = JSON.parse(value);
            if (!Array.isArray(array)) {
                throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
            }
            return array;
        },
        boolean(value) {
            return !(value == "0" || String(value).toLowerCase() == "false");
        },
        number(value) {
            return Number(value.replace(/_/g, ""));
        },
        object(value) {
            const object = JSON.parse(value);
            if (object === null || typeof object != "object" || Array.isArray(object)) {
                throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
            }
            return object;
        },
        string(value) {
            return value;
        },
    };
    const writers = {
        default: writeString,
        array: writeJSON,
        object: writeJSON,
    };
    function writeJSON(value) {
        return JSON.stringify(value);
    }
    function writeString(value) {
        return `${value}`;
    }
    
    class Controller {
        constructor(context) {
            this.context = context;
        }
        static get shouldLoad() {
            return true;
        }
        static afterLoad(_identifier, _application) {
            return;
        }
        get application() {
            return this.context.application;
        }
        get scope() {
            return this.context.scope;
        }
        get element() {
            return this.scope.element;
        }
        get identifier() {
            return this.scope.identifier;
        }
        get targets() {
            return this.scope.targets;
        }
        get outlets() {
            return this.scope.outlets;
        }
        get classes() {
            return this.scope.classes;
        }
        get data() {
            return this.scope.data;
        }
        initialize() {
        }
        connect() {
        }
        disconnect() {
        }
        dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true, } = {}) {
            const type = prefix ? `${prefix}:${eventName}` : eventName;
            const event = new CustomEvent(type, { detail, bubbles, cancelable });
            target.dispatchEvent(event);
            return event;
        }
    }
    Controller.blessings = [
        ClassPropertiesBlessing,
        TargetPropertiesBlessing,
        ValuePropertiesBlessing,
        OutletPropertiesBlessing,
    ];
    Controller.targets = [];
    Controller.outlets = [];
    Controller.values = {};
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/sifter/dist/esm/sifter.js":
    /*!**********************************************************!*\
      !*** ./node_modules/@orchidjs/sifter/dist/esm/sifter.js ***!
      \**********************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   Sifter: () => (/* binding */ Sifter),
    /* harmony export */   cmp: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.cmp),
    /* harmony export */   getAttr: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAttr),
    /* harmony export */   getAttrNesting: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAttrNesting),
    /* harmony export */   getPattern: () => (/* reexport safe */ _orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_1__.getPattern),
    /* harmony export */   iterate: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate),
    /* harmony export */   propToArray: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.propToArray),
    /* harmony export */   scoreValue: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__.scoreValue)
    /* harmony export */ });
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@orchidjs/sifter/dist/esm/utils.js");
    /* harmony import */ var _orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @orchidjs/unicode-variants */ "./node_modules/@orchidjs/unicode-variants/dist/esm/index.js");
    /* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "./node_modules/@orchidjs/sifter/dist/esm/types.js");
    /**
     * sifter.js
     * Copyright (c) 2013â€“2020 Brian Reavis & contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     * @author Brian Reavis <brian@thirdroute.com>
     */
    
    
    class Sifter {
        items; // []|{};
        settings;
        /**
         * Textually searches arrays and hashes of objects
         * by property (or multiple properties). Designed
         * specifically for autocomplete.
         *
         */
        constructor(items, settings) {
            this.items = items;
            this.settings = settings || { diacritics: true };
        }
        ;
        /**
         * Splits a search string into an array of individual
         * regexps to be used to match results.
         *
         */
        tokenize(query, respect_word_boundaries, weights) {
            if (!query || !query.length)
                return [];
            const tokens = [];
            const words = query.split(/\s+/);
            var field_regex;
            if (weights) {
                field_regex = new RegExp('^(' + Object.keys(weights).map(_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_1__.escape_regex).join('|') + ')\:(.*)$');
            }
            words.forEach((word) => {
                let field_match;
                let field = null;
                let regex = null;
                // look for "field:query" tokens
                if (field_regex && (field_match = word.match(field_regex))) {
                    field = field_match[1];
                    word = field_match[2];
                }
                if (word.length > 0) {
                    if (this.settings.diacritics) {
                        regex = (0,_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_1__.getPattern)(word) || null;
                    }
                    else {
                        regex = (0,_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_1__.escape_regex)(word);
                    }
                    if (regex && respect_word_boundaries)
                        regex = "\\b" + regex;
                }
                tokens.push({
                    string: word,
                    regex: regex ? new RegExp(regex, 'iu') : null,
                    field: field,
                });
            });
            return tokens;
        }
        ;
        /**
         * Returns a function to be used to score individual results.
         *
         * Good matches will have a higher score than poor matches.
         * If an item is not a match, 0 will be returned by the function.
         *
         * @returns {T.ScoreFn}
         */
        getScoreFunction(query, options) {
            var search = this.prepareSearch(query, options);
            return this._getScoreFunction(search);
        }
        /**
         * @returns {T.ScoreFn}
         *
         */
        _getScoreFunction(search) {
            const tokens = search.tokens, token_count = tokens.length;
            if (!token_count) {
                return function () { return 0; };
            }
            const fields = search.options.fields, weights = search.weights, field_count = fields.length, getAttrFn = search.getAttrFn;
            if (!field_count) {
                return function () { return 1; };
            }
            /**
             * Calculates the score of an object
             * against the search query.
             *
             */
            const scoreObject = (function () {
                if (field_count === 1) {
                    return function (token, data) {
                        const field = fields[0].field;
                        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.scoreValue)(getAttrFn(data, field), token, weights[field] || 1);
                    };
                }
                return function (token, data) {
                    var sum = 0;
                    // is the token specific to a field?
                    if (token.field) {
                        const value = getAttrFn(data, token.field);
                        if (!token.regex && value) {
                            sum += (1 / field_count);
                        }
                        else {
                            sum += (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.scoreValue)(value, token, 1);
                        }
                    }
                    else {
                        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(weights, (weight, field) => {
                            sum += (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.scoreValue)(getAttrFn(data, field), token, weight);
                        });
                    }
                    return sum / field_count;
                };
            })();
            if (token_count === 1) {
                return function (data) {
                    return scoreObject(tokens[0], data);
                };
            }
            if (search.options.conjunction === 'and') {
                return function (data) {
                    var score, sum = 0;
                    for (let token of tokens) {
                        score = scoreObject(token, data);
                        if (score <= 0)
                            return 0;
                        sum += score;
                    }
                    return sum / token_count;
                };
            }
            else {
                return function (data) {
                    var sum = 0;
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(tokens, (token) => {
                        sum += scoreObject(token, data);
                    });
                    return sum / token_count;
                };
            }
        }
        ;
        /**
         * Returns a function that can be used to compare two
         * results, for sorting purposes. If no sorting should
         * be performed, `null` will be returned.
         *
         * @return function(a,b)
         */
        getSortFunction(query, options) {
            var search = this.prepareSearch(query, options);
            return this._getSortFunction(search);
        }
        _getSortFunction(search) {
            var implicit_score, sort_flds = [];
            const self = this, options = search.options, sort = (!search.query && options.sort_empty) ? options.sort_empty : options.sort;
            if (typeof sort == 'function') {
                return sort.bind(this);
            }
            /**
             * Fetches the specified sort field value
             * from a search result item.
             *
             */
            const get_field = function (name, result) {
                if (name === '$score')
                    return result.score;
                return search.getAttrFn(self.items[result.id], name);
            };
            // parse options
            if (sort) {
                for (let s of sort) {
                    if (search.query || s.field !== '$score') {
                        sort_flds.push(s);
                    }
                }
            }
            // the "$score" field is implied to be the primary
            // sort field, unless it's manually specified
            if (search.query) {
                implicit_score = true;
                for (let fld of sort_flds) {
                    if (fld.field === '$score') {
                        implicit_score = false;
                        break;
                    }
                }
                if (implicit_score) {
                    sort_flds.unshift({ field: '$score', direction: 'desc' });
                }
                // without a search.query, all items will have the same score
            }
            else {
                sort_flds = sort_flds.filter((fld) => fld.field !== '$score');
            }
            // build function
            const sort_flds_count = sort_flds.length;
            if (!sort_flds_count) {
                return null;
            }
            return function (a, b) {
                var result, field;
                for (let sort_fld of sort_flds) {
                    field = sort_fld.field;
                    let multiplier = sort_fld.direction === 'desc' ? -1 : 1;
                    result = multiplier * (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.cmp)(get_field(field, a), get_field(field, b));
                    if (result)
                        return result;
                }
                return 0;
            };
        }
        ;
        /**
         * Parses a search query and returns an object
         * with tokens and fields ready to be populated
         * with results.
         *
         */
        prepareSearch(query, optsUser) {
            const weights = {};
            var options = Object.assign({}, optsUser);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.propToArray)(options, 'sort');
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.propToArray)(options, 'sort_empty');
            // convert fields to new format
            if (options.fields) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.propToArray)(options, 'fields');
                const fields = [];
                options.fields.forEach((field) => {
                    if (typeof field == 'string') {
                        field = { field: field, weight: 1 };
                    }
                    fields.push(field);
                    weights[field.field] = ('weight' in field) ? field.weight : 1;
                });
                options.fields = fields;
            }
            return {
                options: options,
                query: query.toLowerCase().trim(),
                tokens: this.tokenize(query, options.respect_word_boundaries, weights),
                total: 0,
                items: [],
                weights: weights,
                getAttrFn: (options.nesting) ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAttrNesting : _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAttr,
            };
        }
        ;
        /**
         * Searches through all items and returns a sorted array of matches.
         *
         */
        search(query, options) {
            var self = this, score, search;
            search = this.prepareSearch(query, options);
            options = search.options;
            query = search.query;
            // generate result scoring function
            const fn_score = options.score || self._getScoreFunction(search);
            // perform search and sort
            if (query.length) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(self.items, (item, id) => {
                    score = fn_score(item);
                    if (options.filter === false || score > 0) {
                        search.items.push({ 'score': score, 'id': id });
                    }
                });
            }
            else {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(self.items, (_, id) => {
                    search.items.push({ 'score': 1, 'id': id });
                });
            }
            const fn_sort = self._getSortFunction(search);
            if (fn_sort)
                search.items.sort(fn_sort);
            // apply limits
            search.total = search.items.length;
            if (typeof options.limit === 'number') {
                search.items = search.items.slice(0, options.limit);
            }
            return search;
        }
        ;
    }
    
    
    //# sourceMappingURL=sifter.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/sifter/dist/esm/types.js":
    /*!*********************************************************!*\
      !*** ./node_modules/@orchidjs/sifter/dist/esm/types.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    
    //# sourceMappingURL=types.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/sifter/dist/esm/utils.js":
    /*!*********************************************************!*\
      !*** ./node_modules/@orchidjs/sifter/dist/esm/utils.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   cmp: () => (/* binding */ cmp),
    /* harmony export */   getAttr: () => (/* binding */ getAttr),
    /* harmony export */   getAttrNesting: () => (/* binding */ getAttrNesting),
    /* harmony export */   iterate: () => (/* binding */ iterate),
    /* harmony export */   propToArray: () => (/* binding */ propToArray),
    /* harmony export */   scoreValue: () => (/* binding */ scoreValue)
    /* harmony export */ });
    /* harmony import */ var _orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @orchidjs/unicode-variants */ "./node_modules/@orchidjs/unicode-variants/dist/esm/index.js");
    
    /**
     * A property getter resolving dot-notation
     * @param  {Object}  obj     The root object to fetch property on
     * @param  {String}  name    The optionally dotted property name to fetch
     * @return {Object}          The resolved property value
     */
    const getAttr = (obj, name) => {
        if (!obj)
            return;
        return obj[name];
    };
    /**
     * A property getter resolving dot-notation
     * @param  {Object}  obj     The root object to fetch property on
     * @param  {String}  name    The optionally dotted property name to fetch
     * @return {Object}          The resolved property value
     */
    const getAttrNesting = (obj, name) => {
        if (!obj)
            return;
        var part, names = name.split(".");
        while ((part = names.shift()) && (obj = obj[part]))
            ;
        return obj;
    };
    /**
     * Calculates how close of a match the
     * given value is against a search token.
     *
     */
    const scoreValue = (value, token, weight) => {
        var score, pos;
        if (!value)
            return 0;
        value = value + '';
        if (token.regex == null)
            return 0;
        pos = value.search(token.regex);
        if (pos === -1)
            return 0;
        score = token.string.length / value.length;
        if (pos === 0)
            score += 0.5;
        return score * weight;
    };
    /**
     * Cast object property to an array if it exists and has a value
     *
     */
    const propToArray = (obj, key) => {
        var value = obj[key];
        if (typeof value == 'function')
            return value;
        if (value && !Array.isArray(value)) {
            obj[key] = [value];
        }
    };
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
        if (Array.isArray(object)) {
            object.forEach(callback);
        }
        else {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback(object[key], key);
                }
            }
        }
    };
    const cmp = (a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a > b ? 1 : (a < b ? -1 : 0);
        }
        a = (0,_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_0__.asciifold)(a + '').toLowerCase();
        b = (0,_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_0__.asciifold)(b + '').toLowerCase();
        if (a > b)
            return 1;
        if (b > a)
            return -1;
        return 0;
    };
    //# sourceMappingURL=utils.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/unicode-variants/dist/esm/index.js":
    /*!*******************************************************************!*\
      !*** ./node_modules/@orchidjs/unicode-variants/dist/esm/index.js ***!
      \*******************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   _asciifold: () => (/* binding */ _asciifold),
    /* harmony export */   asciifold: () => (/* binding */ asciifold),
    /* harmony export */   code_points: () => (/* binding */ code_points),
    /* harmony export */   escape_regex: () => (/* reexport safe */ _regex_js__WEBPACK_IMPORTED_MODULE_0__.escape_regex),
    /* harmony export */   generateMap: () => (/* binding */ generateMap),
    /* harmony export */   generateSets: () => (/* binding */ generateSets),
    /* harmony export */   generator: () => (/* binding */ generator),
    /* harmony export */   getPattern: () => (/* binding */ getPattern),
    /* harmony export */   initialize: () => (/* binding */ initialize),
    /* harmony export */   mapSequence: () => (/* binding */ mapSequence),
    /* harmony export */   normalize: () => (/* binding */ normalize),
    /* harmony export */   substringsToPattern: () => (/* binding */ substringsToPattern),
    /* harmony export */   unicode_map: () => (/* binding */ unicode_map)
    /* harmony export */ });
    /* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/@orchidjs/unicode-variants/dist/esm/regex.js");
    /* harmony import */ var _strings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strings.js */ "./node_modules/@orchidjs/unicode-variants/dist/esm/strings.js");
    
    
    const code_points = [[0, 65535]];
    const accent_pat = '[\u0300-\u036F\u{b7}\u{2be}\u{2bc}]';
    let unicode_map;
    let multi_char_reg;
    const max_char_length = 3;
    const latin_convert = {};
    const latin_condensed = {
        '/': 'â„âˆ•',
        '0': 'ß€',
        "a": "â±¥ÉÉ‘",
        "aa": "êœ³",
        "ae": "Ã¦Ç½Ç£",
        "ao": "êœµ",
        "au": "êœ·",
        "av": "êœ¹êœ»",
        "ay": "êœ½",
        "b": "Æ€É“Æƒ",
        "c": "êœ¿ÆˆÈ¼â†„",
        "d": "Ä‘É—É–á´…ÆŒê®·ÔÉ¦",
        "e": "É›Çá´‡É‡",
        "f": "ê¼Æ’",
        "g": "Ç¥É êž¡áµ¹ê¿É¢",
        "h": "Ä§â±¨â±¶É¥",
        "i": "É¨Ä±",
        "j": "É‰È·",
        "k": "Æ™â±ªêêƒê…êž£",
        "l": "Å‚ÆšÉ«â±¡ê‰ê‡êžÉ­",
        "m": "É±É¯Ï»",
        "n": "êž¥ÆžÉ²êž‘á´ŽÐ»Ô‰",
        "o": "Ã¸Ç¿É”Éµê‹êá´‘",
        "oe": "Å“",
        "oi": "Æ£",
        "oo": "ê",
        "ou": "È£",
        "p": "Æ¥áµ½ê‘ê“ê•Ï",
        "q": "ê—ê™É‹",
        "r": "ÉÉ½ê›êž§êžƒ",
        "s": "ÃŸÈ¿êž©êž…Ê‚",
        "t": "Å§Æ­Êˆâ±¦êž‡",
        "th": "Ã¾",
        "tz": "êœ©",
        "u": "Ê‰",
        "v": "Ê‹êŸÊŒ",
        "vy": "ê¡",
        "w": "â±³",
        "y": "Æ´Éá»¿",
        "z": "Æ¶È¥É€â±¬ê£",
        "hv": "Æ•"
    };
    for (let latin in latin_condensed) {
        let unicode = latin_condensed[latin] || '';
        for (let i = 0; i < unicode.length; i++) {
            let char = unicode.substring(i, i + 1);
            latin_convert[char] = latin;
        }
    }
    const convert_pat = new RegExp(Object.keys(latin_convert).join('|') + '|' + accent_pat, 'gu');
    /**
     * Initialize the unicode_map from the give code point ranges
     */
    const initialize = (_code_points) => {
        if (unicode_map !== undefined)
            return;
        unicode_map = generateMap(_code_points || code_points);
    };
    /**
     * Helper method for normalize a string
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
     */
    const normalize = (str, form = 'NFKD') => str.normalize(form);
    /**
     * Remove accents without reordering string
     * calling str.normalize('NFKD') on \u{594}\u{595}\u{596} becomes \u{596}\u{594}\u{595}
     * via https://github.com/krisk/Fuse/issues/133#issuecomment-318692703
     */
    const asciifold = (str) => {
        return Array.from(str).reduce(
        /**
         * @param {string} result
         * @param {string} char
         */
        (result, char) => {
            return result + _asciifold(char);
        }, '');
    };
    const _asciifold = (str) => {
        str = normalize(str)
            .toLowerCase()
            .replace(convert_pat, (/** @type {string} */ char) => {
            return latin_convert[char] || '';
        });
        //return str;
        return normalize(str, 'NFC');
    };
    /**
     * Generate a list of unicode variants from the list of code points
     */
    function* generator(code_points) {
        for (const [code_point_min, code_point_max] of code_points) {
            for (let i = code_point_min; i <= code_point_max; i++) {
                let composed = String.fromCharCode(i);
                let folded = asciifold(composed);
                if (folded == composed.toLowerCase()) {
                    continue;
                }
                // skip when folded is a string longer than 3 characters long
                // bc the resulting regex patterns will be long
                // eg:
                // folded ØµÙ„Ù‰ Ø§Ù„Ù„Ù‡ Ø¹Ù„ÙŠÙ‡ ÙˆØ³Ù„Ù… length 18 code point 65018
                // folded Ø¬Ù„ Ø¬Ù„Ø§Ù„Ù‡ length 8 code point 65019
                if (folded.length > max_char_length) {
                    continue;
                }
                if (folded.length == 0) {
                    continue;
                }
                yield { folded: folded, composed: composed, code_point: i };
            }
        }
    }
    /**
     * Generate a unicode map from the list of code points
     */
    const generateSets = (code_points) => {
        const unicode_sets = {};
        const addMatching = (folded, to_add) => {
            /** @type {Set<string>} */
            const folded_set = unicode_sets[folded] || new Set();
            const patt = new RegExp('^' + (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.setToPattern)(folded_set) + '$', 'iu');
            if (to_add.match(patt)) {
                return;
            }
            folded_set.add((0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.escape_regex)(to_add));
            unicode_sets[folded] = folded_set;
        };
        for (let value of generator(code_points)) {
            addMatching(value.folded, value.folded);
            addMatching(value.folded, value.composed);
        }
        return unicode_sets;
    };
    /**
     * Generate a unicode map from the list of code points
     * ae => (?:(?:ae|Ã†|Ç¼|Ç¢)|(?:A|â’¶|ï¼¡...)(?:E|É›|â’º...))
     */
    const generateMap = (code_points) => {
        const unicode_sets = generateSets(code_points);
        const unicode_map = {};
        let multi_char = [];
        for (let folded in unicode_sets) {
            let set = unicode_sets[folded];
            if (set) {
                unicode_map[folded] = (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.setToPattern)(set);
            }
            if (folded.length > 1) {
                multi_char.push((0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.escape_regex)(folded));
            }
        }
        multi_char.sort((a, b) => b.length - a.length);
        const multi_char_patt = (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.arrayToPattern)(multi_char);
        multi_char_reg = new RegExp('^' + multi_char_patt, 'u');
        return unicode_map;
    };
    /**
     * Map each element of an array from its folded value to all possible unicode matches
     */
    const mapSequence = (strings, min_replacement = 1) => {
        let chars_replaced = 0;
        strings = strings.map((str) => {
            if (unicode_map[str]) {
                chars_replaced += str.length;
            }
            return unicode_map[str] || str;
        });
        if (chars_replaced >= min_replacement) {
            return (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.sequencePattern)(strings);
        }
        return '';
    };
    /**
     * Convert a short string and split it into all possible patterns
     * Keep a pattern only if min_replacement is met
     *
     * 'abc'
     * 		=> [['abc'],['ab','c'],['a','bc'],['a','b','c']]
     *		=> ['abc-pattern','ab-c-pattern'...]
     */
    const substringsToPattern = (str, min_replacement = 1) => {
        min_replacement = Math.max(min_replacement, str.length - 1);
        return (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.arrayToPattern)((0,_strings_js__WEBPACK_IMPORTED_MODULE_1__.allSubstrings)(str).map((sub_pat) => {
            return mapSequence(sub_pat, min_replacement);
        }));
    };
    /**
     * Convert an array of sequences into a pattern
     * [{start:0,end:3,length:3,substr:'iii'}...] => (?:iii...)
     */
    const sequencesToPattern = (sequences, all = true) => {
        let min_replacement = sequences.length > 1 ? 1 : 0;
        return (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.arrayToPattern)(sequences.map((sequence) => {
            let seq = [];
            const len = all ? sequence.length() : sequence.length() - 1;
            for (let j = 0; j < len; j++) {
                seq.push(substringsToPattern(sequence.substrs[j] || '', min_replacement));
            }
            return (0,_regex_js__WEBPACK_IMPORTED_MODULE_0__.sequencePattern)(seq);
        }));
    };
    /**
     * Return true if the sequence is already in the sequences
     */
    const inSequences = (needle_seq, sequences) => {
        for (const seq of sequences) {
            if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
                continue;
            }
            if (seq.substrs.join('') !== needle_seq.substrs.join('')) {
                continue;
            }
            let needle_parts = needle_seq.parts;
            const filter = (part) => {
                for (const needle_part of needle_parts) {
                    if (needle_part.start === part.start && needle_part.substr === part.substr) {
                        return false;
                    }
                    if (part.length == 1 || needle_part.length == 1) {
                        continue;
                    }
                    // check for overlapping parts
                    // a = ['::=','==']
                    // b = ['::','===']
                    // a = ['r','sm']
                    // b = ['rs','m']
                    if (part.start < needle_part.start && part.end > needle_part.start) {
                        return true;
                    }
                    if (needle_part.start < part.start && needle_part.end > part.start) {
                        return true;
                    }
                }
                return false;
            };
            let filtered = seq.parts.filter(filter);
            if (filtered.length > 0) {
                continue;
            }
            return true;
        }
        return false;
    };
    class Sequence {
        parts;
        substrs;
        start;
        end;
        constructor() {
            this.parts = [];
            this.substrs = [];
            this.start = 0;
            this.end = 0;
        }
        add(part) {
            if (part) {
                this.parts.push(part);
                this.substrs.push(part.substr);
                this.start = Math.min(part.start, this.start);
                this.end = Math.max(part.end, this.end);
            }
        }
        last() {
            return this.parts[this.parts.length - 1];
        }
        length() {
            return this.parts.length;
        }
        clone(position, last_piece) {
            let clone = new Sequence();
            let parts = JSON.parse(JSON.stringify(this.parts));
            let last_part = parts.pop();
            for (const part of parts) {
                clone.add(part);
            }
            let last_substr = last_piece.substr.substring(0, position - last_part.start);
            let clone_last_len = last_substr.length;
            clone.add({ start: last_part.start, end: last_part.start + clone_last_len, length: clone_last_len, substr: last_substr });
            return clone;
        }
    }
    /**
     * Expand a regular expression pattern to include unicode variants
     * 	eg /a/ becomes /aâ“ï½áºšÃ Ã¡Ã¢áº§áº¥áº«áº©Ã£ÄÄƒáº±áº¯áºµáº³È§Ç¡Ã¤ÇŸáº£Ã¥Ç»ÇŽÈÈƒáº¡áº­áº·á¸Ä…â±¥ÉÉ‘Aâ’¶ï¼¡Ã€ÃÃ‚áº¦áº¤áºªáº¨ÃƒÄ€Ä‚áº°áº®áº´áº²È¦Ç Ã„Çžáº¢Ã…ÇºÇÈ€È‚áº áº¬áº¶á¸€Ä„Èºâ±¯/
     *
     * Issue:
     *  ïºŠïº‹ [ 'ïºŠ = \\u{fe8a}', 'ïº‹ = \\u{fe8b}' ]
     *	becomes:	ÙŠÙ”ÙŠÙ” [ 'ÙŠ = \\u{64a}', 'Ù” = \\u{654}', 'ÙŠ = \\u{64a}', 'Ù” = \\u{654}' ]
     *
     *	Ä°Ä² = IIJ = â…¡J
     *
     * 	1/2/4
     */
    const getPattern = (str) => {
        initialize();
        str = asciifold(str);
        let pattern = '';
        let sequences = [new Sequence()];
        for (let i = 0; i < str.length; i++) {
            let substr = str.substring(i);
            let match = substr.match(multi_char_reg);
            const char = str.substring(i, i + 1);
            const match_str = match ? match[0] : null;
            // loop through sequences
            // add either the char or multi_match
            let overlapping = [];
            let added_types = new Set();
            for (const sequence of sequences) {
                const last_piece = sequence.last();
                if (!last_piece || last_piece.length == 1 || last_piece.end <= i) {
                    // if we have a multi match
                    if (match_str) {
                        const len = match_str.length;
                        sequence.add({ start: i, end: i + len, length: len, substr: match_str });
                        added_types.add('1');
                    }
                    else {
                        sequence.add({ start: i, end: i + 1, length: 1, substr: char });
                        added_types.add('2');
                    }
                }
                else if (match_str) {
                    let clone = sequence.clone(i, last_piece);
                    const len = match_str.length;
                    clone.add({ start: i, end: i + len, length: len, substr: match_str });
                    overlapping.push(clone);
                }
                else {
                    // don't add char
                    // adding would create invalid patterns: 234 => [2,34,4]
                    added_types.add('3');
                }
            }
            // if we have overlapping
            if (overlapping.length > 0) {
                // ['ii','iii'] before ['i','i','iii']
                overlapping = overlapping.sort((a, b) => {
                    return a.length() - b.length();
                });
                for (let clone of overlapping) {
                    // don't add if we already have an equivalent sequence
                    if (inSequences(clone, sequences)) {
                        continue;
                    }
                    sequences.push(clone);
                }
                continue;
            }
            // if we haven't done anything unique
            // clean up the patterns
            // helps keep patterns smaller
            // if str = 'râ‚¨ãŽ§aarss', pattern will be 446 instead of 655
            if (i > 0 && added_types.size == 1 && !added_types.has('3')) {
                pattern += sequencesToPattern(sequences, false);
                let new_seq = new Sequence();
                const old_seq = sequences[0];
                if (old_seq) {
                    new_seq.add(old_seq.last());
                }
                sequences = [new_seq];
            }
        }
        pattern += sequencesToPattern(sequences, true);
        return pattern;
    };
    
    //# sourceMappingURL=index.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/unicode-variants/dist/esm/regex.js":
    /*!*******************************************************************!*\
      !*** ./node_modules/@orchidjs/unicode-variants/dist/esm/regex.js ***!
      \*******************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   arrayToPattern: () => (/* binding */ arrayToPattern),
    /* harmony export */   escape_regex: () => (/* binding */ escape_regex),
    /* harmony export */   hasDuplicates: () => (/* binding */ hasDuplicates),
    /* harmony export */   maxValueLength: () => (/* binding */ maxValueLength),
    /* harmony export */   sequencePattern: () => (/* binding */ sequencePattern),
    /* harmony export */   setToPattern: () => (/* binding */ setToPattern),
    /* harmony export */   unicodeLength: () => (/* binding */ unicodeLength)
    /* harmony export */ });
    /**
     * Convert array of strings to a regular expression
     *	ex ['ab','a'] => (?:ab|a)
     * 	ex ['a','b'] => [ab]
     */
    const arrayToPattern = (chars) => {
        chars = chars.filter(Boolean);
        if (chars.length < 2) {
            return chars[0] || '';
        }
        return (maxValueLength(chars) == 1) ? '[' + chars.join('') + ']' : '(?:' + chars.join('|') + ')';
    };
    const sequencePattern = (array) => {
        if (!hasDuplicates(array)) {
            return array.join('');
        }
        let pattern = '';
        let prev_char_count = 0;
        const prev_pattern = () => {
            if (prev_char_count > 1) {
                pattern += '{' + prev_char_count + '}';
            }
        };
        array.forEach((char, i) => {
            if (char === array[i - 1]) {
                prev_char_count++;
                return;
            }
            prev_pattern();
            pattern += char;
            prev_char_count = 1;
        });
        prev_pattern();
        return pattern;
    };
    /**
     * Convert array of strings to a regular expression
     *	ex ['ab','a'] => (?:ab|a)
     * 	ex ['a','b'] => [ab]
     */
    const setToPattern = (chars) => {
        let array = Array.from(chars);
        return arrayToPattern(array);
    };
    /**
     * https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
     */
    const hasDuplicates = (array) => {
        return (new Set(array)).size !== array.length;
    };
    /**
     * https://stackoverflow.com/questions/63006601/why-does-u-throw-an-invalid-escape-error
     */
    const escape_regex = (str) => {
        return (str + '').replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, '\\$1');
    };
    /**
     * Return the max length of array values
     */
    const maxValueLength = (array) => {
        return array.reduce((longest, value) => Math.max(longest, unicodeLength(value)), 0);
    };
    const unicodeLength = (str) => {
        return Array.from(str).length;
    };
    //# sourceMappingURL=regex.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@orchidjs/unicode-variants/dist/esm/strings.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@orchidjs/unicode-variants/dist/esm/strings.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   allSubstrings: () => (/* binding */ allSubstrings)
    /* harmony export */ });
    /**
     * Get all possible combinations of substrings that add up to the given string
     * https://stackoverflow.com/questions/30169587/find-all-the-combination-of-substrings-that-add-up-to-the-given-string
     */
    const allSubstrings = (input) => {
        if (input.length === 1)
            return [[input]];
        let result = [];
        const start = input.substring(1);
        const suba = allSubstrings(start);
        suba.forEach(function (subresult) {
            let tmp = subresult.slice(0);
            tmp[0] = input.charAt(0) + tmp[0];
            result.push(tmp);
            tmp = subresult.slice(0);
            tmp.unshift(input.charAt(0));
            result.push(tmp);
        });
        return result;
    };
    //# sourceMappingURL=strings.js.map
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/createPopper.js":
    /*!*********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   createPopper: () => (/* binding */ createPopper),
    /* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
    /* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
    /* harmony export */ });
    /* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
    /* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
    /* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
    /* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
    /* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
    /* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
    /* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
    /* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
    
    
    
    
    
    
    
    
    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };
    
    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
    
      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }
    
    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }
    
      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }
    
        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
              popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties
    
            var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers
    
            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            });
            runModifierEffects();
            return instance.update();
          },
          // Sync update â€“ it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }
    
            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore
    
            if (!areValidElements(reference, popper)) {
              return;
            } // Store the reference and popper rects to be read by modifiers
    
    
            state.rects = {
              reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
              popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect
    
            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`
    
            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
    
            for (var index = 0; index < state.orderedModifiers.length; index++) {
              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }
    
              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;
    
              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update â€“ it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };
    
        if (!areValidElements(reference, popper)) {
          return instance;
        }
    
        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.
    
        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref) {
            var name = _ref.name,
                _ref$options = _ref.options,
                options = _ref$options === void 0 ? {} : _ref$options,
                effect = _ref.effect;
    
            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });
    
              var noopFn = function noopFn() {};
    
              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }
    
        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }
    
        return instance;
      };
    }
    var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
    /*!***************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
      \***************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ contains)
    /* harmony export */ });
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method
    
      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
          var next = child;
    
          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...
    
    
            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false
    
    
      return false;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
    /* harmony export */ });
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");
    
    
    
    
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }
    
      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }
    
      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;
    
      if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
        scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
      }
    
      var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
          visualViewport = _ref.visualViewport;
    
      var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getClippingRect)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
    /* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
    /* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
    /* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
    /* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
    /* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function getInnerBoundingClientRect(element, strategy) {
      var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }
    
    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`
    
    
    function getClippingParents(element) {
      var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
      var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;
    
      if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414
    
    
      return clippingParents.filter(function (clippingParent) {
        return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents
    
    
    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
        accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
        accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
        accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
    /*!***********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
      \***********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getCompositeRect)
    /* harmony export */ });
    /* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
    /* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    
    
    
    
    
    
    
    
    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
      var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.
    
    
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }
    
      var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
      var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
      var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
      var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };
    
      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
          scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
        }
    
        if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
          offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
        }
      }
    
      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
    /*!***********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
      \***********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getComputedStyle)
    /* harmony export */ });
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    
    function getComputedStyle(element) {
      return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
    /*!*************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
      \*************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getDocumentElement)
    /* harmony export */ });
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getDocumentRect)
    /* harmony export */ });
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
    /* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
    /* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    
    
    
     // Gets the entire size of the scrollable document area, even extending outside
    // of the `<html>` and `<body>` rect bounds if horizontally scrollable
    
    function getDocumentRect(element) {
      var _element$ownerDocumen;
    
      var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
      var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
      var y = -winScroll.scrollTop;
    
      if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
        x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
      }
    
      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
    /* harmony export */ });
    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
    /*!********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
      \********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getLayoutRect)
    /* harmony export */ });
    /* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
     // Returns the layout rect of an element relative to its offsetParent. Layout
    // means it doesn't take into account transforms.
    
    function getLayoutRect(element) {
      var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223
    
      var width = element.offsetWidth;
      var height = element.offsetHeight;
    
      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }
    
      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }
    
      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
    /*!******************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
      \******************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getNodeName)
    /* harmony export */ });
    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
    /*!********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
      \********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getNodeScroll)
    /* harmony export */ });
    /* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");
    
    
    
    
    function getNodeScroll(node) {
      if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
        return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
      } else {
        return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
      }
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getOffsetParent)
    /* harmony export */ });
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
    /* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
    /* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");
    
    
    
    
    
    
    
    
    function getTrueOffsetParent(element) {
      if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
      (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
        return null;
      }
    
      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block
    
    
    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
      var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
    
      if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
    
        if (elementCss.position === 'fixed') {
          return null;
        }
      }
    
      var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
    
      if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
        currentNode = currentNode.host;
      }
    
      while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
        var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    
        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }
    
      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.
    
    
    function getOffsetParent(element) {
      var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
      var offsetParent = getTrueOffsetParent(element);
    
      while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }
    
      if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
        return window;
      }
    
      return offsetParent || getContainingBlock(element) || window;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
    /*!********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
      \********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getParentNode)
    /* harmony export */ });
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
    
    
    function getParentNode(element) {
      if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
        return element;
      }
    
      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback
    
      );
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getScrollParent)
    /* harmony export */ });
    /* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
    /* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
    
    
    
    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }
    
      if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
        return node;
      }
    
      return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getViewportRect)
    /* harmony export */ });
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
    /* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");
    
    
    
    
    function getViewportRect(element, strategy) {
      var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
      var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;
    
      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
    
        if (layoutViewport || !layoutViewport && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }
    
      return {
        width: width,
        height: height,
        x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
        y: y
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
    /*!****************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
      \****************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getWindow)
    /* harmony export */ });
    function getWindow(node) {
      if (node == null) {
        return window;
      }
    
      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }
    
      return node;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getWindowScroll)
    /* harmony export */ });
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    
    function getWindowScroll(node) {
      var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
    /*!**************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
      \**************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
    /* harmony export */ });
    /* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
    /* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
    
    
    
    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   isElement: () => (/* binding */ isElement),
    /* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
    /* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
    /* harmony export */ });
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    
    
    function isElement(node) {
      var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }
    
    function isHTMLElement(node) {
      var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }
    
    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }
    
      var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
    /*!***********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
      \***********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ isLayoutViewport)
    /* harmony export */ });
    /* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");
    
    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ isScrollParent)
    /* harmony export */ });
    /* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
    
    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;
    
      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ isTableElement)
    /* harmony export */ });
    /* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    
    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
    /*!************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
      \************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ listScrollParents)
    /* harmony export */ });
    /* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
    /* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
    /* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
    
    
    
    
    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */
    
    function listScrollParents(element, list) {
      var _element$ownerDocumen;
    
      if (list === void 0) {
        list = [];
      }
    
      var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/enums.js":
    /*!**************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/enums.js ***!
      \**************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   afterMain: () => (/* binding */ afterMain),
    /* harmony export */   afterRead: () => (/* binding */ afterRead),
    /* harmony export */   afterWrite: () => (/* binding */ afterWrite),
    /* harmony export */   auto: () => (/* binding */ auto),
    /* harmony export */   basePlacements: () => (/* binding */ basePlacements),
    /* harmony export */   beforeMain: () => (/* binding */ beforeMain),
    /* harmony export */   beforeRead: () => (/* binding */ beforeRead),
    /* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
    /* harmony export */   bottom: () => (/* binding */ bottom),
    /* harmony export */   clippingParents: () => (/* binding */ clippingParents),
    /* harmony export */   end: () => (/* binding */ end),
    /* harmony export */   left: () => (/* binding */ left),
    /* harmony export */   main: () => (/* binding */ main),
    /* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
    /* harmony export */   placements: () => (/* binding */ placements),
    /* harmony export */   popper: () => (/* binding */ popper),
    /* harmony export */   read: () => (/* binding */ read),
    /* harmony export */   reference: () => (/* binding */ reference),
    /* harmony export */   right: () => (/* binding */ right),
    /* harmony export */   start: () => (/* binding */ start),
    /* harmony export */   top: () => (/* binding */ top),
    /* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
    /* harmony export */   viewport: () => (/* binding */ viewport),
    /* harmony export */   write: () => (/* binding */ write)
    /* harmony export */ });
    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM
    
    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers
    
    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)
    
    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/index.js":
    /*!**************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/index.js ***!
      \**************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   afterMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
    /* harmony export */   afterRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
    /* harmony export */   afterWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
    /* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
    /* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
    /* harmony export */   auto: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
    /* harmony export */   basePlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
    /* harmony export */   beforeMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
    /* harmony export */   beforeRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
    /* harmony export */   beforeWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
    /* harmony export */   bottom: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
    /* harmony export */   clippingParents: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
    /* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
    /* harmony export */   createPopper: () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
    /* harmony export */   createPopperBase: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
    /* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
    /* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
    /* harmony export */   end: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
    /* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
    /* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
    /* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
    /* harmony export */   left: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
    /* harmony export */   main: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
    /* harmony export */   modifierPhases: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
    /* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
    /* harmony export */   placements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
    /* harmony export */   popper: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
    /* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
    /* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
    /* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
    /* harmony export */   read: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
    /* harmony export */   reference: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
    /* harmony export */   right: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
    /* harmony export */   start: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
    /* harmony export */   top: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
    /* harmony export */   variationPlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
    /* harmony export */   viewport: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
    /* harmony export */   write: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
    /* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
    
     // eslint-disable-next-line import/no-unused-modules
    
     // eslint-disable-next-line import/no-unused-modules
    
     // eslint-disable-next-line import/no-unused-modules
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
    /*!******************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
      \******************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
    /* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    
     // This modifier takes the styles prepared by the `computeStyles` modifier
    // and applies them to the HTMLElements such as popper and arrow
    
    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements
    
        if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]
    
    
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];
    
          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }
    
    function effect(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;
    
      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }
    
      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them
    
          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements
    
          if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
            return;
          }
    
          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect,
      requires: ['computeStyles']
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
    /*!************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
      \************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
    /* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
    /* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
    /* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
    /* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
    /* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
    /* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    
    
    
    
    
    
    
    
     // eslint-disable-next-line import/no-unused-modules
    
    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
    };
    
    function arrow(_ref) {
      var _state$modifiersData$;
    
      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
      var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
      var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';
    
      if (!arrowElement || !popperOffsets) {
        return;
      }
    
      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
      var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
      var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds
    
      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...
    
      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }
    
    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;
    
      if (arrowElement == null) {
        return;
      } // CSS selector
    
    
      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);
    
        if (!arrowElement) {
          return;
        }
      }
    
      if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
        return;
      }
    
      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
    /*!********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
      \********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
    /* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
    /* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
    /* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
    /* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    
    
    
    
    
    
     // eslint-disable-next-line import/no-unused-modules
    
    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.
    
    function roundOffsetsByDPR(_ref, win) {
      var x = _ref.x,
          y = _ref.y;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
        y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
      };
    }
    
    function mapToStyles(_ref2) {
      var _Object$assign2;
    
      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;
    
      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };
    
      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
      var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
      var win = window;
    
      if (adaptive) {
        var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';
    
        if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
          offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);
    
          if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
    
    
        offsetParent = offsetParent;
    
        if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
          sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }
    
        if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
          sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }
    
      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);
    
      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
        x: x,
        y: y
      };
    
      x = _ref4.x;
      y = _ref4.y;
    
      if (gpuAcceleration) {
        var _Object$assign;
    
        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }
    
      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }
    
    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
      var commonStyles = {
        placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
        variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };
    
      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }
    
      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }
    
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
     // eslint-disable-next-line import/no-unused-modules
    
    var passive = {
      passive: true
    };
    
    function effect(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }
    
      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }
    
      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }
    
        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect,
      data: {}
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
    /*!***********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
      \***********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
    /* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
    /* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
    
    
    
    
    
    
     // eslint-disable-next-line import/no-unused-modules
    
    function getExpandedFallbackPlacements(placement) {
      if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
        return [];
      }
    
      var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
      return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
    }
    
    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
    
      if (state.modifiersData[name]._skip) {
        return;
      }
    
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];
    
      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];
    
        var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
    
        var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
        var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
    
        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
        }
    
        var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
        var checks = [];
    
        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }
    
        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }
    
        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }
    
        checksMap.set(placement, checks);
      }
    
      if (makeFallbackChecks) {
        // `2` may be desired in some cases â€“ research later
        var numberOfChecks = flipVariations ? 3 : 1;
    
        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);
    
            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });
    
          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };
    
        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);
    
          if (_ret === "break") break;
        }
      }
    
      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
    /*!***********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
      \***********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    
    
    
    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }
    
      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }
    
    function isAnySideFullyClipped(overflow) {
      return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
        return overflow[side] >= 0;
      });
    }
    
    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
    /*!************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
      \************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
    /* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
    /* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
    /* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
    /* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
    /* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
    /* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
    /* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
    /* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
    /* harmony export */ });
    /* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
    /* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
    /* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
    /* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
    /* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
    /* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
    /* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
    /* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
    /* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
    
    
    
    
    
    
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
    /*!*************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
      \*************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
    /* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
    /* harmony export */ });
    /* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    
     // eslint-disable-next-line import/no-unused-modules
    
    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
      var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;
    
      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];
    
      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }
    
    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;
    
      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }
    
      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
    /*!********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
      \********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
    
    
    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
    /* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
    /* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
    /* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
    /* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
    /* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
    /* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
    /* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    
    
    
    
    
    
    
    
    
    
    
    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
      var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
      var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };
    
      if (!popperOffsets) {
        return;
      }
    
      if (checkMainAxis) {
        var _offsetModifierState$;
    
        var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
        var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min = offset + overflow[mainSide];
        var max = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds
    
        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)
    
        var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }
    
      if (checkAltAxis) {
        var _offsetModifierState$2;
    
        var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    
        var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    
        var _offset = popperOffsets[altAxis];
    
        var _len = altAxis === 'y' ? 'height' : 'width';
    
        var _min = _offset + overflow[_mainSide];
    
        var _max = _offset - overflow[_altSide];
    
        var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;
    
        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    
        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    
        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    
        var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    
        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
    
      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    });
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
    /*!********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
      \********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   createPopper: () => (/* binding */ createPopper),
    /* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
    /* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
    /* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
    /* harmony export */ });
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
    /* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
    /* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
    /* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
    
    
    
    
    
    var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
    var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/popper.js":
    /*!***************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/popper.js ***!
      \***************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
    /* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
    /* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
    /* harmony export */   createPopper: () => (/* binding */ createPopper),
    /* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
    /* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
    /* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
    /* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
    /* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
    /* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
    /* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
    /* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
    /* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
    /* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
    /* harmony export */ });
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
    /* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
    /* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
    /* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
    /* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
    /* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
    /* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
    /* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
    /* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
    /* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
    /* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
    /* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
    
    
    
    
    
    
    
    
    
    
    var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
    var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules
    
     // eslint-disable-next-line import/no-unused-modules
    
     // eslint-disable-next-line import/no-unused-modules
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
    /*!***********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
      \***********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
    /* harmony export */ });
    /* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
    /* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    
    
    
    
    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }
    
      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
      var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
      var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
        return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
      }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
      var allowedPlacements = placements.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });
    
      if (allowedPlacements.length === 0) {
        allowedPlacements = placements;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...
    
    
      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ computeOffsets)
    /* harmony export */ });
    /* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
    /* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
    /* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    
    
    
    
    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
      var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;
    
      switch (basePlacement) {
        case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;
    
        case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;
    
        case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;
    
        case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;
    
        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }
    
      var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;
    
      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';
    
        switch (variation) {
          case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;
    
          case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
    
          default:
        }
      }
    
      return offsets;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
    /*!***********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
      \***********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ debounce)
    /* harmony export */ });
    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }
    
        return pending;
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ detectOverflow)
    /* harmony export */ });
    /* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
    /* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
    /* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
    /* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
    /* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
    /* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
    /* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
    /* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
    
    
    
    
    
    
    
    
     // eslint-disable-next-line import/no-unused-modules
    
    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }
    
      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$strategy = _options.strategy,
          strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
      var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
      var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect
    
      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element
    
      if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }
    
      return overflowOffsets;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
    /*!******************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
      \******************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ expandToHashMap)
    /* harmony export */ });
    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
    /*!*************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
      \*************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getAltAxis)
    /* harmony export */ });
    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
    /*!*******************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
      \*******************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getBasePlacement)
    /* harmony export */ });
    
    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getFreshSideObject)
    /* harmony export */ });
    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
    /* harmony export */ });
    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
    /*!***********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
      \***********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getOppositePlacement)
    /* harmony export */ });
    var hash = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash[matched];
      });
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
    /*!********************************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
      \********************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
    /* harmony export */ });
    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
    /*!***************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
      \***************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getVariation)
    /* harmony export */ });
    function getVariation(placement) {
      return placement.split('-')[1];
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/math.js":
    /*!*******************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
      \*******************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   max: () => (/* binding */ max),
    /* harmony export */   min: () => (/* binding */ min),
    /* harmony export */   round: () => (/* binding */ round)
    /* harmony export */ });
    var max = Math.max;
    var min = Math.min;
    var round = Math.round;
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
    /*!**************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
      \**************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ mergeByName)
    /* harmony export */ });
    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values
    
      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
    /*!*********************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
      \*********************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ mergePaddingObject)
    /* harmony export */ });
    /* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
    
    function mergePaddingObject(paddingObject) {
      return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ orderModifiers)
    /* harmony export */ });
    /* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
     // source: https://stackoverflow.com/questions/49875255
    
    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively
    
      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);
    
            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }
    
      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }
    
    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase
    
      return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
    /*!*******************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
      \*******************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ rectToClientRect)
    /* harmony export */ });
    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
    /*!************************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
      \************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getUAString)
    /* harmony export */ });
    function getUAString() {
      var uaData = navigator.userAgentData;
    
      if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
        return uaData.brands.map(function (item) {
          return item.brand + "/" + item.version;
        }).join(' ');
      }
    
      return navigator.userAgent;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@popperjs/core/lib/utils/within.js":
    /*!*********************************************************!*\
      !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   within: () => (/* binding */ within),
    /* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
    /* harmony export */ });
    /* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
    
    function within(min, value, max) {
      return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/app.js":
    /*!**************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/app.js ***!
      \**************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   app: () => (/* binding */ app)
    /* harmony export */ });
    /* harmony import */ var _symfony_stimulus_bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @symfony/stimulus-bridge */ "./node_modules/@symfony/stimulus-bridge/dist/index.js");
    /* harmony import */ var _symfony_ux_live_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @symfony/ux-live-component */ "./node_modules/@symfony/ux-live-component/dist/live_controller.js");
    /* harmony import */ var _controllers_ApiLoginController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controllers/ApiLoginController */ "./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js");
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    
    
    
    
    // Registers Stimulus controllers from controllers.json and in the controllers/ directory
    const app = (0,_symfony_stimulus_bridge__WEBPACK_IMPORTED_MODULE_0__.startStimulusApp)(__webpack_require__("./node_modules/@sylius-ui/shop/Resources/assets/controllers sync recursive ./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js! \\.[jt]sx?$"));
    
    app.register('live', _symfony_ux_live_component__WEBPACK_IMPORTED_MODULE_1__["default"]);
    app.register('api-login', _controllers_ApiLoginController__WEBPACK_IMPORTED_MODULE_2__["default"]);
    
    app.debug = "development" !== 'production';
    
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/controllers sync recursive ./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js! \\.[jt]sx?$":
    /*!*******************************************************************************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/controllers/ sync ./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js! \.[jt]sx?$ ***!
      \*******************************************************************************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    var map = {
        "./ApiLoginController.js": "./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js"
    };
    
    
    function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
    }
    function webpackContextResolve(req) {
        if(!__webpack_require__.o(map, req)) {
            var e = new Error("Cannot find module '" + req + "'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }
        return map[req];
    }
    webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
    };
    webpackContext.resolve = webpackContextResolve;
    module.exports = webpackContext;
    webpackContext.id = "./node_modules/@sylius-ui/shop/Resources/assets/controllers sync recursive ./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js! \\.[jt]sx?$";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js":
    /*!*****************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js ***!
      \*****************************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
        static values = { url: String };
        static targets = ['email', 'password', 'csrfToken', 'error', 'errorPrototype'];
    
        login() {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    _username: this.emailTarget.value,
                    _password: this.passwordTarget.value,
                    [this.csrfTokenTarget.name]: this.csrfTokenTarget.value
                })
            };
    
            fetch(this.urlValue, requestOptions)
                .then(response => response.json())
                .then(response => {
                    if (response.success) {
                        window.location.reload();
                    } else {
                        const errorElement = this.errorPrototypeTarget.cloneNode(true);
                        errorElement.innerHTML = response.message;
                        this.errorTarget.innerHTML = errorElement.outerHTML;
                    }
                })
            ;
        }
    });
    
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images sync recursive \\.(jpg%7Cjpeg%7Cpng%7Csvg%7Cgif%7Cwebp)$":
    /*!*************************************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/ sync \.(jpg%7Cjpeg%7Cpng%7Csvg%7Cgif%7Cwebp)$ ***!
      \*************************************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    var map = {
        "./adyen-logo.svg": "./node_modules/@sylius-ui/shop/Resources/assets/images/adyen-logo.svg",
        "./homepage-banner-logo.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner-logo.webp",
        "./homepage-banner.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner.webp",
        "./homepage-new-collection-photo-1.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-1.webp",
        "./homepage-new-collection-photo-2.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-2.webp",
        "./homepage-new-collection-photo-3.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-3.webp",
        "./loader.gif": "./node_modules/@sylius-ui/shop/Resources/assets/images/loader.gif",
        "./logo.webp": "./node_modules/@sylius-ui/shop/Resources/assets/images/logo.webp",
        "./mollie-logo.svg": "./node_modules/@sylius-ui/shop/Resources/assets/images/mollie-logo.svg",
        "./paypal-logo.svg": "./node_modules/@sylius-ui/shop/Resources/assets/images/paypal-logo.svg"
    };
    
    
    function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
    }
    function webpackContextResolve(req) {
        if(!__webpack_require__.o(map, req)) {
            var e = new Error("Cannot find module '" + req + "'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }
        return map[req];
    }
    webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
    };
    webpackContext.resolve = webpackContextResolve;
    module.exports = webpackContext;
    webpackContext.id = "./node_modules/@sylius-ui/shop/Resources/assets/images sync recursive \\.(jpg%7Cjpeg%7Cpng%7Csvg%7Cgif%7Cwebp)$";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/adyen-logo.svg":
    /*!*****************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/adyen-logo.svg ***!
      \*****************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/adyen-logo.23b1b26a.svg";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner-logo.webp":
    /*!****************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner-logo.webp ***!
      \****************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/homepage-banner-logo.6759d0fb.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner.webp":
    /*!***********************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-banner.webp ***!
      \***********************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/homepage-banner.8ec389de.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-1.webp":
    /*!***************************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-1.webp ***!
      \***************************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/homepage-new-collection-photo-1.2b163989.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-2.webp":
    /*!***************************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-2.webp ***!
      \***************************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/homepage-new-collection-photo-2.2c91a0c3.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-3.webp":
    /*!***************************************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/homepage-new-collection-photo-3.webp ***!
      \***************************************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/homepage-new-collection-photo-3.466a0c4c.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/loader.gif":
    /*!*************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/loader.gif ***!
      \*************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/loader.0488c2fc.gif";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/logo.webp":
    /*!************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/logo.webp ***!
      \************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/logo.bb3df97b.webp";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/mollie-logo.svg":
    /*!******************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/mollie-logo.svg ***!
      \******************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/mollie-logo.fa881b7d.svg";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/images/paypal-logo.svg":
    /*!******************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/images/paypal-logo.svg ***!
      \******************************************************************************/
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    module.exports = __webpack_require__.p + "images/paypal-logo.88881bcb.svg";
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/scripts/bootstrap.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/scripts/bootstrap.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    // eslint-disable-next-line no-unused-vars
    
    
    // Fix dropdowns
    (() => {
        document.querySelectorAll('.dropdown-static').forEach((dropdownToggleEl) => {
            const parent = dropdownToggleEl.closest('[data-bs-toggle="dropdown"]');
            if (parent) {
                new bootstrap__WEBPACK_IMPORTED_MODULE_0__.Dropdown(parent, {
                    popperConfig(defaultBsPopperConfig) {
                        return { ...defaultBsPopperConfig, strategy: 'fixed' };
                    }
                });
            }
        });
    })();
    
    // Initialize tooltips
    (() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTriggerEl) => {
            new bootstrap__WEBPACK_IMPORTED_MODULE_0__.Tooltip(tooltipTriggerEl);
        });
    })();
    
    window.bootstrap = bootstrap__WEBPACK_IMPORTED_MODULE_0__;
    
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/scripts/spotlight.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/scripts/spotlight.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var spotlight_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! spotlight.js */ "./node_modules/spotlight.js/dist/spotlight.bundle.js");
    /* harmony import */ var spotlight_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(spotlight_js__WEBPACK_IMPORTED_MODULE_0__);
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@sylius-ui/shop/Resources/assets/styles/main.scss":
    /*!************************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/styles/main.scss ***!
      \************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    
    /***/ "./node_modules/@symfony/stimulus-bridge/dist/index.js":
    /*!*************************************************************!*\
      !*** ./node_modules/@symfony/stimulus-bridge/dist/index.js ***!
      \*************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   startStimulusApp: () => (/* binding */ startStimulusApp)
    /* harmony export */ });
    /* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
    /* harmony import */ var _webpack_loader_symfony_stimulus_bridge_controllers_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webpack/loader!@symfony/stimulus-bridge/controllers.json */ "./node_modules/@symfony/stimulus-bridge/dist/webpack/loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers.json");
    
    
    
    /*
    Stimulus Webpack Helpers 1.0.0
    Copyright Â© 2021 Basecamp, LLC
     */
    function definitionsFromContext(context) {
        return context.keys()
            .map((key) => definitionForModuleWithContextAndKey(context, key))
            .filter((value) => value);
    }
    function definitionForModuleWithContextAndKey(context, key) {
        const identifier = identifierForContextKey(key);
        if (identifier) {
            return definitionForModuleAndIdentifier(context(key), identifier);
        }
    }
    function definitionForModuleAndIdentifier(module, identifier) {
        const controllerConstructor = module.default;
        if (typeof controllerConstructor == "function") {
            return { identifier, controllerConstructor };
        }
    }
    function identifierForContextKey(key) {
        const logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
        if (logicalName) {
            return logicalName.replace(/_/g, "-").replace(/\//g, "--");
        }
    }
    
    function startStimulusApp(context) {
        const application = _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Application.start();
        if (true) {
            application.debug = true;
        }
        if (context) {
            application.load(definitionsFromContext(context));
        }
        for (const controllerName in _webpack_loader_symfony_stimulus_bridge_controllers_json__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            if (!_webpack_loader_symfony_stimulus_bridge_controllers_json__WEBPACK_IMPORTED_MODULE_1__["default"].hasOwnProperty(controllerName)) {
                continue;
            }
            application.register(controllerName, _webpack_loader_symfony_stimulus_bridge_controllers_json__WEBPACK_IMPORTED_MODULE_1__["default"][controllerName]);
        }
        return application;
    }
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@symfony/stimulus-bridge/dist/webpack/loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers.json":
    /*!***************************************************************************************************************************************!*\
      !*** ./node_modules/@symfony/stimulus-bridge/dist/webpack/loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers.json ***!
      \***************************************************************************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _symfony_ux_autocomplete_dist_controller_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @symfony/ux-autocomplete/dist/controller.js */ "./node_modules/@symfony/ux-autocomplete/dist/controller.js");
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
      'symfony--ux-autocomplete--autocomplete': _symfony_ux_autocomplete_dist_controller_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    });
    
    /***/ }),
    
    /***/ "./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js":
    /*!***********************************************************************************************************************************************************!*\
      !*** ./node_modules/@symfony/stimulus-bridge/lazy-controller-loader.js!./node_modules/@sylius-ui/shop/Resources/assets/controllers/ApiLoginController.js ***!
      \***********************************************************************************************************************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
        static values = { url: String };
        static targets = ['email', 'password', 'csrfToken', 'error', 'errorPrototype'];
    
        login() {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    _username: this.emailTarget.value,
                    _password: this.passwordTarget.value,
                    [this.csrfTokenTarget.name]: this.csrfTokenTarget.value
                })
            };
    
            fetch(this.urlValue, requestOptions)
                .then(response => response.json())
                .then(response => {
                    if (response.success) {
                        window.location.reload();
                    } else {
                        const errorElement = this.errorPrototypeTarget.cloneNode(true);
                        errorElement.innerHTML = response.message;
                        this.errorTarget.innerHTML = errorElement.outerHTML;
                    }
                })
            ;
        }
    });
    
    
    /***/ }),
    
    /***/ "./node_modules/@symfony/ux-autocomplete/dist/controller.js":
    /*!******************************************************************!*\
      !*** ./node_modules/@symfony/ux-autocomplete/dist/controller.js ***!
      \******************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ default_1)
    /* harmony export */ });
    /* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
    /* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tom-select */ "./node_modules/tom-select/dist/esm/tom-select.complete.js");
    
    
    
    /******************************************************************************
    Copyright (c) Microsoft Corporation.
    
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.
    
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */
    
    
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    
    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    
    var _default_1_instances, _default_1_getCommonConfig, _default_1_createAutocomplete, _default_1_createAutocompleteWithHtmlContents, _default_1_createAutocompleteWithRemoteData, _default_1_stripTags, _default_1_mergeObjects, _default_1_createTomSelect;
    class default_1 extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
        constructor() {
            super(...arguments);
            _default_1_instances.add(this);
            this.isObserving = false;
            this.hasLoadedChoicesPreviously = false;
            this.originalOptions = [];
        }
        initialize() {
            if (!this.mutationObserver) {
                this.mutationObserver = new MutationObserver((mutations) => {
                    this.onMutations(mutations);
                });
            }
        }
        connect() {
            if (this.selectElement) {
                this.originalOptions = this.createOptionsDataStructure(this.selectElement);
            }
            this.initializeTomSelect();
        }
        initializeTomSelect() {
            if (this.selectElement) {
                this.selectElement.setAttribute('data-skip-morph', '');
            }
            if (this.urlValue) {
                this.tomSelect = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createAutocompleteWithRemoteData).call(this, this.urlValue, this.hasMinCharactersValue ? this.minCharactersValue : null);
                return;
            }
            if (this.optionsAsHtmlValue) {
                this.tomSelect = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createAutocompleteWithHtmlContents).call(this);
                return;
            }
            this.tomSelect = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createAutocomplete).call(this);
            this.startMutationObserver();
        }
        disconnect() {
            this.stopMutationObserver();
            let currentSelectedValues = [];
            if (this.selectElement) {
                if (this.selectElement.multiple) {
                    currentSelectedValues = Array.from(this.selectElement.options)
                        .filter((option) => option.selected)
                        .map((option) => option.value);
                }
                else {
                    currentSelectedValues = [this.selectElement.value];
                }
            }
            this.tomSelect.destroy();
            if (this.selectElement) {
                if (this.selectElement.multiple) {
                    Array.from(this.selectElement.options).forEach((option) => {
                        option.selected = currentSelectedValues.includes(option.value);
                    });
                }
                else {
                    this.selectElement.value = currentSelectedValues[0];
                }
            }
        }
        urlValueChanged() {
            this.resetTomSelect();
        }
        getMaxOptions() {
            return this.selectElement ? this.selectElement.options.length : 50;
        }
        get selectElement() {
            if (!(this.element instanceof HTMLSelectElement)) {
                return null;
            }
            return this.element;
        }
        get formElement() {
            if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLSelectElement)) {
                throw new Error('Autocomplete Stimulus controller can only be used on an <input> or <select>.');
            }
            return this.element;
        }
        dispatchEvent(name, payload) {
            this.dispatch(name, { detail: payload, prefix: 'autocomplete' });
        }
        get preload() {
            if (!this.hasPreloadValue) {
                return 'focus';
            }
            if (this.preloadValue === 'false') {
                return false;
            }
            if (this.preloadValue === 'true') {
                return true;
            }
            return this.preloadValue;
        }
        resetTomSelect() {
            if (this.tomSelect) {
                this.dispatchEvent('before-reset', { tomSelect: this.tomSelect });
                this.stopMutationObserver();
                const currentHtml = this.element.innerHTML;
                const currentValue = this.tomSelect.getValue();
                this.tomSelect.destroy();
                this.element.innerHTML = currentHtml;
                this.initializeTomSelect();
                this.tomSelect.setValue(currentValue);
            }
        }
        changeTomSelectDisabledState(isDisabled) {
            this.stopMutationObserver();
            if (isDisabled) {
                this.tomSelect.disable();
            }
            else {
                this.tomSelect.enable();
            }
            this.startMutationObserver();
        }
        startMutationObserver() {
            if (!this.isObserving && this.mutationObserver) {
                this.mutationObserver.observe(this.element, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true,
                    attributeOldValue: true,
                });
                this.isObserving = true;
            }
        }
        stopMutationObserver() {
            if (this.isObserving && this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.isObserving = false;
            }
        }
        onMutations(mutations) {
            let changeDisabledState = false;
            let requireReset = false;
            mutations.forEach((mutation) => {
                switch (mutation.type) {
                    case 'attributes':
                        if (mutation.target === this.element && mutation.attributeName === 'disabled') {
                            changeDisabledState = true;
                            break;
                        }
                        if (mutation.target === this.element && mutation.attributeName === 'multiple') {
                            const isNowMultiple = this.element.hasAttribute('multiple');
                            const wasMultiple = mutation.oldValue === 'multiple';
                            if (isNowMultiple !== wasMultiple) {
                                requireReset = true;
                            }
                            break;
                        }
                        break;
                }
            });
            const newOptions = this.selectElement ? this.createOptionsDataStructure(this.selectElement) : [];
            const areOptionsEquivalent = this.areOptionsEquivalent(newOptions);
            if (!areOptionsEquivalent || requireReset) {
                this.originalOptions = newOptions;
                this.resetTomSelect();
            }
            if (changeDisabledState) {
                this.changeTomSelectDisabledState(this.formElement.disabled);
            }
        }
        createOptionsDataStructure(selectElement) {
            return Array.from(selectElement.options).map((option) => {
                return {
                    value: option.value,
                    text: option.text,
                };
            });
        }
        areOptionsEquivalent(newOptions) {
            const filteredOriginalOptions = this.originalOptions.filter((option) => option.value !== '');
            const filteredNewOptions = newOptions.filter((option) => option.value !== '');
            const originalPlaceholderOption = this.originalOptions.find((option) => option.value === '');
            const newPlaceholderOption = newOptions.find((option) => option.value === '');
            if (originalPlaceholderOption &&
                newPlaceholderOption &&
                originalPlaceholderOption.text !== newPlaceholderOption.text) {
                return false;
            }
            if (filteredOriginalOptions.length !== filteredNewOptions.length) {
                return false;
            }
            const normalizeOption = (option) => `${option.value}-${option.text}`;
            const originalOptionsSet = new Set(filteredOriginalOptions.map(normalizeOption));
            const newOptionsSet = new Set(filteredNewOptions.map(normalizeOption));
            return (originalOptionsSet.size === newOptionsSet.size &&
                [...originalOptionsSet].every((option) => newOptionsSet.has(option)));
        }
    }
    _default_1_instances = new WeakSet(), _default_1_getCommonConfig = function _default_1_getCommonConfig() {
        const plugins = {};
        const isMultiple = !this.selectElement || this.selectElement.multiple;
        if (!this.formElement.disabled && !isMultiple) {
            plugins.clear_button = { title: '' };
        }
        if (isMultiple) {
            plugins.remove_button = { title: '' };
        }
        if (this.urlValue) {
            plugins.virtual_scroll = {};
        }
        const render = {
            no_results: () => {
                return `<div class="no-results">${this.noResultsFoundTextValue}</div>`;
            },
            option_create: (data, escapeData) => {
                return `<div class="create">${this.createOptionTextValue.replace('%placeholder%', `<strong>${escapeData(data.input)}</strong>`)}</div>`;
            },
        };
        const config = {
            render,
            plugins,
            onItemAdd: () => {
                this.tomSelect.setTextboxValue('');
            },
            closeAfterSelect: true,
            onOptionAdd: (value, data) => {
                let parentElement = this.tomSelect.input;
                let optgroupData = null;
                const optgroup = data[this.tomSelect.settings.optgroupField];
                if (optgroup && this.tomSelect.optgroups) {
                    optgroupData = this.tomSelect.optgroups[optgroup];
                    if (optgroupData) {
                        const optgroupElement = parentElement.querySelector(`optgroup[label="${optgroupData.label}"]`);
                        if (optgroupElement) {
                            parentElement = optgroupElement;
                        }
                    }
                }
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.text = data[this.tomSelect.settings.labelField];
                const optionOrder = data.$order;
                let orderedOption = null;
                for (const [, tomSelectOption] of Object.entries(this.tomSelect.options)) {
                    if (tomSelectOption.$order === optionOrder) {
                        orderedOption = parentElement.querySelector(`:scope > option[value="${tomSelectOption[this.tomSelect.settings.valueField]}"]`);
                        break;
                    }
                }
                if (orderedOption) {
                    orderedOption.insertAdjacentElement('afterend', optionElement);
                }
                else if (optionOrder >= 0) {
                    parentElement.append(optionElement);
                }
                else {
                    parentElement.prepend(optionElement);
                }
            },
        };
        if (!this.selectElement && !this.urlValue) {
            config.shouldLoad = () => false;
        }
        return __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_mergeObjects).call(this, config, this.tomSelectOptionsValue);
    }, _default_1_createAutocomplete = function _default_1_createAutocomplete() {
        const config = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_mergeObjects).call(this, __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_getCommonConfig).call(this), {
            maxOptions: this.getMaxOptions(),
        });
        return __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createTomSelect).call(this, config);
    }, _default_1_createAutocompleteWithHtmlContents = function _default_1_createAutocompleteWithHtmlContents() {
        const commonConfig = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_getCommonConfig).call(this);
        const labelField = commonConfig.labelField ?? 'text';
        const config = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_mergeObjects).call(this, commonConfig, {
            maxOptions: this.getMaxOptions(),
            score: (search) => {
                const scoringFunction = this.tomSelect.getScoreFunction(search);
                return (item) => {
                    return scoringFunction({ ...item, text: __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_stripTags).call(this, item[labelField]) });
                };
            },
            render: {
                item: (item) => `<div>${item[labelField]}</div>`,
                option: (item) => `<div>${item[labelField]}</div>`,
            },
        });
        return __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createTomSelect).call(this, config);
    }, _default_1_createAutocompleteWithRemoteData = function _default_1_createAutocompleteWithRemoteData(autocompleteEndpointUrl, minCharacterLength) {
        const commonConfig = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_getCommonConfig).call(this);
        const labelField = commonConfig.labelField ?? 'text';
        const config = __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_mergeObjects).call(this, commonConfig, {
            firstUrl: (query) => {
                const separator = autocompleteEndpointUrl.includes('?') ? '&' : '?';
                return `${autocompleteEndpointUrl}${separator}query=${encodeURIComponent(query)}`;
            },
            load: function (query, callback) {
                const url = this.getUrl(query);
                fetch(url)
                    .then((response) => response.json())
                    .then((json) => {
                    this.setNextUrl(query, json.next_page);
                    callback(json.results.options || json.results, json.results.optgroups || []);
                })
                    .catch(() => callback([], []));
            },
            shouldLoad: (query) => {
                if (null !== minCharacterLength) {
                    return query.length >= minCharacterLength;
                }
                if (this.hasLoadedChoicesPreviously) {
                    return true;
                }
                if (query.length > 0) {
                    this.hasLoadedChoicesPreviously = true;
                }
                return query.length >= 3;
            },
            optgroupField: 'group_by',
            score: (search) => (item) => 1,
            render: {
                option: (item) => `<div>${item[labelField]}</div>`,
                item: (item) => `<div>${item[labelField]}</div>`,
                loading_more: () => {
                    return `<div class="loading-more-results">${this.loadingMoreTextValue}</div>`;
                },
                no_more_results: () => {
                    return `<div class="no-more-results">${this.noMoreResultsTextValue}</div>`;
                },
                no_results: () => {
                    return `<div class="no-results">${this.noResultsFoundTextValue}</div>`;
                },
                option_create: (data, escapeData) => {
                    return `<div class="create">${this.createOptionTextValue.replace('%placeholder%', `<strong>${escapeData(data.input)}</strong>`)}</div>`;
                },
            },
            preload: this.preload,
        });
        return __classPrivateFieldGet(this, _default_1_instances, "m", _default_1_createTomSelect).call(this, config);
    }, _default_1_stripTags = function _default_1_stripTags(string) {
        return string.replace(/(<([^>]+)>)/gi, '');
    }, _default_1_mergeObjects = function _default_1_mergeObjects(object1, object2) {
        return { ...object1, ...object2 };
    }, _default_1_createTomSelect = function _default_1_createTomSelect(options) {
        const preConnectPayload = { options };
        this.dispatchEvent('pre-connect', preConnectPayload);
        const tomSelect = new tom_select__WEBPACK_IMPORTED_MODULE_1__["default"](this.formElement, options);
        const connectPayload = { tomSelect, options };
        this.dispatchEvent('connect', connectPayload);
        return tomSelect;
    };
    default_1.values = {
        url: String,
        optionsAsHtml: Boolean,
        loadingMoreText: String,
        noResultsFoundText: String,
        noMoreResultsText: String,
        createOptionText: String,
        minCharacters: Number,
        tomSelectOptions: Object,
        preload: String,
    };
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/@symfony/ux-live-component/dist/live_controller.js":
    /*!*************************************************************************!*\
      !*** ./node_modules/@symfony/ux-live-component/dist/live_controller.js ***!
      \*************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   Component: () => (/* binding */ Component),
    /* harmony export */   "default": () => (/* binding */ LiveControllerDefault),
    /* harmony export */   getComponent: () => (/* binding */ getComponent)
    /* harmony export */ });
    /* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
    
    
    class BackendRequest {
        constructor(promise, actions, updateModels) {
            this.isResolved = false;
            this.promise = promise;
            this.promise.then((response) => {
                this.isResolved = true;
                return response;
            });
            this.actions = actions;
            this.updatedModels = updateModels;
        }
        containsOneOfActions(targetedActions) {
            return this.actions.filter((action) => targetedActions.includes(action)).length > 0;
        }
        areAnyModelsUpdated(targetedModels) {
            return this.updatedModels.filter((model) => targetedModels.includes(model)).length > 0;
        }
    }
    
    class RequestBuilder {
        constructor(url, method = 'post') {
            this.url = url;
            this.method = method;
        }
        buildRequest(props, actions, updated, children, updatedPropsFromParent, files) {
            const splitUrl = this.url.split('?');
            let [url] = splitUrl;
            const [, queryString] = splitUrl;
            const params = new URLSearchParams(queryString || '');
            const fetchOptions = {};
            fetchOptions.headers = {
                Accept: 'application/vnd.live-component+html',
                'X-Requested-With': 'XMLHttpRequest',
            };
            const totalFiles = Object.entries(files).reduce((total, current) => total + current.length, 0);
            const hasFingerprints = Object.keys(children).length > 0;
            if (actions.length === 0 &&
                totalFiles === 0 &&
                this.method === 'get' &&
                this.willDataFitInUrl(JSON.stringify(props), JSON.stringify(updated), params, JSON.stringify(children), JSON.stringify(updatedPropsFromParent))) {
                params.set('props', JSON.stringify(props));
                params.set('updated', JSON.stringify(updated));
                if (Object.keys(updatedPropsFromParent).length > 0) {
                    params.set('propsFromParent', JSON.stringify(updatedPropsFromParent));
                }
                if (hasFingerprints) {
                    params.set('children', JSON.stringify(children));
                }
                fetchOptions.method = 'GET';
            }
            else {
                fetchOptions.method = 'POST';
                const requestData = { props, updated };
                if (Object.keys(updatedPropsFromParent).length > 0) {
                    requestData.propsFromParent = updatedPropsFromParent;
                }
                if (hasFingerprints) {
                    requestData.children = children;
                }
                if (actions.length > 0) {
                    if (actions.length === 1) {
                        requestData.args = actions[0].args;
                        url += `/${encodeURIComponent(actions[0].name)}`;
                    }
                    else {
                        url += '/_batch';
                        requestData.actions = actions;
                    }
                }
                const formData = new FormData();
                formData.append('data', JSON.stringify(requestData));
                for (const [key, value] of Object.entries(files)) {
                    const length = value.length;
                    for (let i = 0; i < length; ++i) {
                        formData.append(key, value[i]);
                    }
                }
                fetchOptions.body = formData;
            }
            const paramsString = params.toString();
            return {
                url: `${url}${paramsString.length > 0 ? `?${paramsString}` : ''}`,
                fetchOptions,
            };
        }
        willDataFitInUrl(propsJson, updatedJson, params, childrenJson, propsFromParentJson) {
            const urlEncodedJsonData = new URLSearchParams(propsJson + updatedJson + childrenJson + propsFromParentJson).toString();
            return (urlEncodedJsonData + params.toString()).length < 1500;
        }
    }
    
    class Backend {
        constructor(url, method = 'post') {
            this.requestBuilder = new RequestBuilder(url, method);
        }
        makeRequest(props, actions, updated, children, updatedPropsFromParent, files) {
            const { url, fetchOptions } = this.requestBuilder.buildRequest(props, actions, updated, children, updatedPropsFromParent, files);
            return new BackendRequest(fetch(url, fetchOptions), actions.map((backendAction) => backendAction.name), Object.keys(updated));
        }
    }
    
    class BackendResponse {
        constructor(response) {
            this.response = response;
        }
        async getBody() {
            if (!this.body) {
                this.body = await this.response.text();
            }
            return this.body;
        }
    }
    
    function getElementAsTagText(element) {
        return element.innerHTML
            ? element.outerHTML.slice(0, element.outerHTML.indexOf(element.innerHTML))
            : element.outerHTML;
    }
    
    let componentMapByElement = new WeakMap();
    let componentMapByComponent = new Map();
    const registerComponent = (component) => {
        componentMapByElement.set(component.element, component);
        componentMapByComponent.set(component, component.name);
    };
    const unregisterComponent = (component) => {
        componentMapByElement.delete(component.element);
        componentMapByComponent.delete(component);
    };
    const getComponent = (element) => new Promise((resolve, reject) => {
        let count = 0;
        const maxCount = 10;
        const interval = setInterval(() => {
            const component = componentMapByElement.get(element);
            if (component) {
                clearInterval(interval);
                resolve(component);
            }
            count++;
            if (count > maxCount) {
                clearInterval(interval);
                reject(new Error(`Component not found for element ${getElementAsTagText(element)}`));
            }
        }, 5);
    });
    const findComponents = (currentComponent, onlyParents, onlyMatchName) => {
        const components = [];
        componentMapByComponent.forEach((componentName, component) => {
            if (onlyParents && (currentComponent === component || !component.element.contains(currentComponent.element))) {
                return;
            }
            if (onlyMatchName && componentName !== onlyMatchName) {
                return;
            }
            components.push(component);
        });
        return components;
    };
    const findChildren = (currentComponent) => {
        const children = [];
        componentMapByComponent.forEach((componentName, component) => {
            if (currentComponent === component) {
                return;
            }
            if (!currentComponent.element.contains(component.element)) {
                return;
            }
            let foundChildComponent = false;
            componentMapByComponent.forEach((childComponentName, childComponent) => {
                if (foundChildComponent) {
                    return;
                }
                if (childComponent === component) {
                    return;
                }
                if (childComponent.element.contains(component.element)) {
                    foundChildComponent = true;
                }
            });
            children.push(component);
        });
        return children;
    };
    const findParent = (currentComponent) => {
        let parentElement = currentComponent.element.parentElement;
        while (parentElement) {
            const component = componentMapByElement.get(parentElement);
            if (component) {
                return component;
            }
            parentElement = parentElement.parentElement;
        }
        return null;
    };
    
    class HookManager {
        constructor() {
            this.hooks = new Map();
        }
        register(hookName, callback) {
            const hooks = this.hooks.get(hookName) || [];
            hooks.push(callback);
            this.hooks.set(hookName, hooks);
        }
        unregister(hookName, callback) {
            const hooks = this.hooks.get(hookName) || [];
            const index = hooks.indexOf(callback);
            if (index === -1) {
                return;
            }
            hooks.splice(index, 1);
            this.hooks.set(hookName, hooks);
        }
        triggerHook(hookName, ...args) {
            const hooks = this.hooks.get(hookName) || [];
            hooks.forEach((callback) => callback(...args));
        }
    }
    
    class ChangingItemsTracker {
        constructor() {
            this.changedItems = new Map();
            this.removedItems = new Map();
        }
        setItem(itemName, newValue, previousValue) {
            if (this.removedItems.has(itemName)) {
                const removedRecord = this.removedItems.get(itemName);
                this.removedItems.delete(itemName);
                if (removedRecord.original === newValue) {
                    return;
                }
            }
            if (this.changedItems.has(itemName)) {
                const originalRecord = this.changedItems.get(itemName);
                if (originalRecord.original === newValue) {
                    this.changedItems.delete(itemName);
                    return;
                }
                this.changedItems.set(itemName, { original: originalRecord.original, new: newValue });
                return;
            }
            this.changedItems.set(itemName, { original: previousValue, new: newValue });
        }
        removeItem(itemName, currentValue) {
            let trueOriginalValue = currentValue;
            if (this.changedItems.has(itemName)) {
                const originalRecord = this.changedItems.get(itemName);
                trueOriginalValue = originalRecord.original;
                this.changedItems.delete(itemName);
                if (trueOriginalValue === null) {
                    return;
                }
            }
            if (!this.removedItems.has(itemName)) {
                this.removedItems.set(itemName, { original: trueOriginalValue });
            }
        }
        getChangedItems() {
            return Array.from(this.changedItems, ([name, { new: value }]) => ({ name, value }));
        }
        getRemovedItems() {
            return Array.from(this.removedItems.keys());
        }
        isEmpty() {
            return this.changedItems.size === 0 && this.removedItems.size === 0;
        }
    }
    
    class ElementChanges {
        constructor() {
            this.addedClasses = new Set();
            this.removedClasses = new Set();
            this.styleChanges = new ChangingItemsTracker();
            this.attributeChanges = new ChangingItemsTracker();
        }
        addClass(className) {
            if (!this.removedClasses.delete(className)) {
                this.addedClasses.add(className);
            }
        }
        removeClass(className) {
            if (!this.addedClasses.delete(className)) {
                this.removedClasses.add(className);
            }
        }
        addStyle(styleName, newValue, originalValue) {
            this.styleChanges.setItem(styleName, newValue, originalValue);
        }
        removeStyle(styleName, originalValue) {
            this.styleChanges.removeItem(styleName, originalValue);
        }
        addAttribute(attributeName, newValue, originalValue) {
            this.attributeChanges.setItem(attributeName, newValue, originalValue);
        }
        removeAttribute(attributeName, originalValue) {
            this.attributeChanges.removeItem(attributeName, originalValue);
        }
        getAddedClasses() {
            return [...this.addedClasses];
        }
        getRemovedClasses() {
            return [...this.removedClasses];
        }
        getChangedStyles() {
            return this.styleChanges.getChangedItems();
        }
        getRemovedStyles() {
            return this.styleChanges.getRemovedItems();
        }
        getChangedAttributes() {
            return this.attributeChanges.getChangedItems();
        }
        getRemovedAttributes() {
            return this.attributeChanges.getRemovedItems();
        }
        applyToElement(element) {
            element.classList.add(...this.addedClasses);
            element.classList.remove(...this.removedClasses);
            this.styleChanges.getChangedItems().forEach((change) => {
                element.style.setProperty(change.name, change.value);
                return;
            });
            this.styleChanges.getRemovedItems().forEach((styleName) => {
                element.style.removeProperty(styleName);
            });
            this.attributeChanges.getChangedItems().forEach((change) => {
                element.setAttribute(change.name, change.value);
            });
            this.attributeChanges.getRemovedItems().forEach((attributeName) => {
                element.removeAttribute(attributeName);
            });
        }
        isEmpty() {
            return (this.addedClasses.size === 0 &&
                this.removedClasses.size === 0 &&
                this.styleChanges.isEmpty() &&
                this.attributeChanges.isEmpty());
        }
    }
    
    class ExternalMutationTracker {
        constructor(element, shouldTrackChangeCallback) {
            this.changedElements = new WeakMap();
            this.changedElementsCount = 0;
            this.addedElements = [];
            this.removedElements = [];
            this.isStarted = false;
            this.element = element;
            this.shouldTrackChangeCallback = shouldTrackChangeCallback;
            this.mutationObserver = new MutationObserver(this.onMutations.bind(this));
        }
        start() {
            if (this.isStarted) {
                return;
            }
            this.mutationObserver.observe(this.element, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true,
            });
            this.isStarted = true;
        }
        stop() {
            if (this.isStarted) {
                this.mutationObserver.disconnect();
                this.isStarted = false;
            }
        }
        getChangedElement(element) {
            return this.changedElements.has(element) ? this.changedElements.get(element) : null;
        }
        getAddedElements() {
            return this.addedElements;
        }
        wasElementAdded(element) {
            return this.addedElements.includes(element);
        }
        handlePendingChanges() {
            this.onMutations(this.mutationObserver.takeRecords());
        }
        onMutations(mutations) {
            const handledAttributeMutations = new WeakMap();
            for (const mutation of mutations) {
                const element = mutation.target;
                if (!this.shouldTrackChangeCallback(element)) {
                    continue;
                }
                if (this.isElementAddedByTranslation(element)) {
                    continue;
                }
                let isChangeInAddedElement = false;
                for (const addedElement of this.addedElements) {
                    if (addedElement.contains(element)) {
                        isChangeInAddedElement = true;
                        break;
                    }
                }
                if (isChangeInAddedElement) {
                    continue;
                }
                switch (mutation.type) {
                    case 'childList':
                        this.handleChildListMutation(mutation);
                        break;
                    case 'attributes':
                        if (!handledAttributeMutations.has(element)) {
                            handledAttributeMutations.set(element, []);
                        }
                        if (!handledAttributeMutations.get(element).includes(mutation.attributeName)) {
                            this.handleAttributeMutation(mutation);
                            handledAttributeMutations.set(element, [
                                ...handledAttributeMutations.get(element),
                                mutation.attributeName,
                            ]);
                        }
                        break;
                }
            }
        }
        handleChildListMutation(mutation) {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof Element)) {
                    return;
                }
                if (this.removedElements.includes(node)) {
                    this.removedElements.splice(this.removedElements.indexOf(node), 1);
                    return;
                }
                if (this.isElementAddedByTranslation(node)) {
                    return;
                }
                this.addedElements.push(node);
            });
            mutation.removedNodes.forEach((node) => {
                if (!(node instanceof Element)) {
                    return;
                }
                if (this.addedElements.includes(node)) {
                    this.addedElements.splice(this.addedElements.indexOf(node), 1);
                    return;
                }
                this.removedElements.push(node);
            });
        }
        handleAttributeMutation(mutation) {
            const element = mutation.target;
            if (!this.changedElements.has(element)) {
                this.changedElements.set(element, new ElementChanges());
                this.changedElementsCount++;
            }
            const changedElement = this.changedElements.get(element);
            switch (mutation.attributeName) {
                case 'class':
                    this.handleClassAttributeMutation(mutation, changedElement);
                    break;
                case 'style':
                    this.handleStyleAttributeMutation(mutation, changedElement);
                    break;
                default:
                    this.handleGenericAttributeMutation(mutation, changedElement);
            }
            if (changedElement.isEmpty()) {
                this.changedElements.delete(element);
                this.changedElementsCount--;
            }
        }
        handleClassAttributeMutation(mutation, elementChanges) {
            const element = mutation.target;
            const previousValue = mutation.oldValue || '';
            const previousValues = previousValue.match(/(\S+)/gu) || [];
            const newValues = [].slice.call(element.classList);
            const addedValues = newValues.filter((value) => !previousValues.includes(value));
            const removedValues = previousValues.filter((value) => !newValues.includes(value));
            addedValues.forEach((value) => {
                elementChanges.addClass(value);
            });
            removedValues.forEach((value) => {
                elementChanges.removeClass(value);
            });
        }
        handleStyleAttributeMutation(mutation, elementChanges) {
            const element = mutation.target;
            const previousValue = mutation.oldValue || '';
            const previousStyles = this.extractStyles(previousValue);
            const newValue = element.getAttribute('style') || '';
            const newStyles = this.extractStyles(newValue);
            const addedOrChangedStyles = Object.keys(newStyles).filter((key) => previousStyles[key] === undefined || previousStyles[key] !== newStyles[key]);
            const removedStyles = Object.keys(previousStyles).filter((key) => !newStyles[key]);
            addedOrChangedStyles.forEach((style) => {
                elementChanges.addStyle(style, newStyles[style], previousStyles[style] === undefined ? null : previousStyles[style]);
            });
            removedStyles.forEach((style) => {
                elementChanges.removeStyle(style, previousStyles[style]);
            });
        }
        handleGenericAttributeMutation(mutation, elementChanges) {
            const attributeName = mutation.attributeName;
            const element = mutation.target;
            let oldValue = mutation.oldValue;
            let newValue = element.getAttribute(attributeName);
            if (oldValue === attributeName) {
                oldValue = '';
            }
            if (newValue === attributeName) {
                newValue = '';
            }
            if (!element.hasAttribute(attributeName)) {
                if (oldValue === null) {
                    return;
                }
                elementChanges.removeAttribute(attributeName, mutation.oldValue);
                return;
            }
            if (newValue === oldValue) {
                return;
            }
            elementChanges.addAttribute(attributeName, element.getAttribute(attributeName), mutation.oldValue);
        }
        extractStyles(styles) {
            const styleObject = {};
            styles.split(';').forEach((style) => {
                const parts = style.split(':');
                if (parts.length === 1) {
                    return;
                }
                const property = parts[0].trim();
                styleObject[property] = parts.slice(1).join(':').trim();
            });
            return styleObject;
        }
        isElementAddedByTranslation(element) {
            return element.tagName === 'FONT' && element.getAttribute('style') === 'vertical-align: inherit;';
        }
    }
    
    function parseDirectives(content) {
        const directives = [];
        if (!content) {
            return directives;
        }
        let currentActionName = '';
        let currentArgumentValue = '';
        let currentArguments = [];
        let currentModifiers = [];
        let state = 'action';
        const getLastActionName = () => {
            if (currentActionName) {
                return currentActionName;
            }
            if (directives.length === 0) {
                throw new Error('Could not find any directives');
            }
            return directives[directives.length - 1].action;
        };
        const pushInstruction = () => {
            directives.push({
                action: currentActionName,
                args: currentArguments,
                modifiers: currentModifiers,
                getString: () => {
                    return content;
                },
            });
            currentActionName = '';
            currentArgumentValue = '';
            currentArguments = [];
            currentModifiers = [];
            state = 'action';
        };
        const pushArgument = () => {
            currentArguments.push(currentArgumentValue.trim());
            currentArgumentValue = '';
        };
        const pushModifier = () => {
            if (currentArguments.length > 1) {
                throw new Error(`The modifier "${currentActionName}()" does not support multiple arguments.`);
            }
            currentModifiers.push({
                name: currentActionName,
                value: currentArguments.length > 0 ? currentArguments[0] : null,
            });
            currentActionName = '';
            currentArguments = [];
            state = 'action';
        };
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            switch (state) {
                case 'action':
                    if (char === '(') {
                        state = 'arguments';
                        break;
                    }
                    if (char === ' ') {
                        if (currentActionName) {
                            pushInstruction();
                        }
                        break;
                    }
                    if (char === '|') {
                        pushModifier();
                        break;
                    }
                    currentActionName += char;
                    break;
                case 'arguments':
                    if (char === ')') {
                        pushArgument();
                        state = 'after_arguments';
                        break;
                    }
                    if (char === ',') {
                        pushArgument();
                        break;
                    }
                    currentArgumentValue += char;
                    break;
                case 'after_arguments':
                    if (char === '|') {
                        pushModifier();
                        break;
                    }
                    if (char !== ' ') {
                        throw new Error(`Missing space after ${getLastActionName()}()`);
                    }
                    pushInstruction();
                    break;
            }
        }
        switch (state) {
            case 'action':
            case 'after_arguments':
                if (currentActionName) {
                    pushInstruction();
                }
                break;
            default:
                throw new Error(`Did you forget to add a closing ")" after "${currentActionName}"?`);
        }
        return directives;
    }
    
    function combineSpacedArray(parts) {
        const finalParts = [];
        parts.forEach((part) => {
            finalParts.push(...trimAll(part).split(' '));
        });
        return finalParts;
    }
    function trimAll(str) {
        return str.replace(/[\s]+/g, ' ').trim();
    }
    function normalizeModelName(model) {
        return (model
            .replace(/\[]$/, '')
            .split('[')
            .map((s) => s.replace(']', ''))
            .join('.'));
    }
    
    function getValueFromElement(element, valueStore) {
        if (element instanceof HTMLInputElement) {
            if (element.type === 'checkbox') {
                const modelNameData = getModelDirectiveFromElement(element, false);
                if (modelNameData !== null) {
                    const modelValue = valueStore.get(modelNameData.action);
                    if (Array.isArray(modelValue)) {
                        return getMultipleCheckboxValue(element, modelValue);
                    }
                    if (Object(modelValue) === modelValue) {
                        return getMultipleCheckboxValue(element, Object.values(modelValue));
                    }
                }
                if (element.hasAttribute('value')) {
                    return element.checked ? element.getAttribute('value') : null;
                }
                return element.checked;
            }
            return inputValue(element);
        }
        if (element instanceof HTMLSelectElement) {
            if (element.multiple) {
                return Array.from(element.selectedOptions).map((el) => el.value);
            }
            return element.value;
        }
        if (element.dataset.value) {
            return element.dataset.value;
        }
        if ('value' in element) {
            return element.value;
        }
        if (element.hasAttribute('value')) {
            return element.getAttribute('value');
        }
        return null;
    }
    function setValueOnElement(element, value) {
        if (element instanceof HTMLInputElement) {
            if (element.type === 'file') {
                return;
            }
            if (element.type === 'radio') {
                element.checked = element.value == value;
                return;
            }
            if (element.type === 'checkbox') {
                if (Array.isArray(value)) {
                    element.checked = value.some((val) => val == element.value);
                }
                else if (element.hasAttribute('value')) {
                    element.checked = element.value == value;
                }
                else {
                    element.checked = value;
                }
                return;
            }
        }
        if (element instanceof HTMLSelectElement) {
            const arrayWrappedValue = [].concat(value).map((value) => {
                return `${value}`;
            });
            Array.from(element.options).forEach((option) => {
                option.selected = arrayWrappedValue.includes(option.value);
            });
            return;
        }
        value = value === undefined ? '' : value;
        element.value = value;
    }
    function getAllModelDirectiveFromElements(element) {
        if (!element.dataset.model) {
            return [];
        }
        const directives = parseDirectives(element.dataset.model);
        directives.forEach((directive) => {
            if (directive.args.length > 0) {
                throw new Error(`The data-model="${element.dataset.model}" format is invalid: it does not support passing arguments to the model.`);
            }
            directive.action = normalizeModelName(directive.action);
        });
        return directives;
    }
    function getModelDirectiveFromElement(element, throwOnMissing = true) {
        const dataModelDirectives = getAllModelDirectiveFromElements(element);
        if (dataModelDirectives.length > 0) {
            return dataModelDirectives[0];
        }
        if (element.getAttribute('name')) {
            const formElement = element.closest('form');
            if (formElement && 'model' in formElement.dataset) {
                const directives = parseDirectives(formElement.dataset.model || '*');
                const directive = directives[0];
                if (directive.args.length > 0) {
                    throw new Error(`The data-model="${formElement.dataset.model}" format is invalid: it does not support passing arguments to the model.`);
                }
                directive.action = normalizeModelName(element.getAttribute('name'));
                return directive;
            }
        }
        if (!throwOnMissing) {
            return null;
        }
        throw new Error(`Cannot determine the model name for "${getElementAsTagText(element)}": the element must either have a "data-model" (or "name" attribute living inside a <form data-model="*">).`);
    }
    function elementBelongsToThisComponent(element, component) {
        if (component.element === element) {
            return true;
        }
        if (!component.element.contains(element)) {
            return false;
        }
        const closestLiveComponent = element.closest('[data-controller~="live"]');
        return closestLiveComponent === component.element;
    }
    function cloneHTMLElement(element) {
        const newElement = element.cloneNode(true);
        if (!(newElement instanceof HTMLElement)) {
            throw new Error('Could not clone element');
        }
        return newElement;
    }
    function htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        if (template.content.childElementCount > 1) {
            throw new Error(`Component HTML contains ${template.content.childElementCount} elements, but only 1 root element is allowed.`);
        }
        const child = template.content.firstElementChild;
        if (!child) {
            throw new Error('Child not found');
        }
        if (!(child instanceof HTMLElement)) {
            throw new Error(`Created element is not an HTMLElement: ${html.trim()}`);
        }
        return child;
    }
    const getMultipleCheckboxValue = (element, currentValues) => {
        const finalValues = [...currentValues];
        const value = inputValue(element);
        const index = currentValues.indexOf(value);
        if (element.checked) {
            if (index === -1) {
                finalValues.push(value);
            }
            return finalValues;
        }
        if (index > -1) {
            finalValues.splice(index, 1);
        }
        return finalValues;
    };
    const inputValue = (element) => element.dataset.value ? element.dataset.value : element.value;
    
    // base IIFE to define idiomorph
    var Idiomorph = (function () {
    
            //=============================================================================
            // AND NOW IT BEGINS...
            //=============================================================================
            let EMPTY_SET = new Set();
    
            // default configuration values, updatable by users now
            let defaults = {
                morphStyle: "outerHTML",
                callbacks : {
                    beforeNodeAdded: noOp,
                    afterNodeAdded: noOp,
                    beforeNodeMorphed: noOp,
                    afterNodeMorphed: noOp,
                    beforeNodeRemoved: noOp,
                    afterNodeRemoved: noOp,
                    beforeAttributeUpdated: noOp,
    
                },
                head: {
                    style: 'merge',
                    shouldPreserve: function (elt) {
                        return elt.getAttribute("im-preserve") === "true";
                    },
                    shouldReAppend: function (elt) {
                        return elt.getAttribute("im-re-append") === "true";
                    },
                    shouldRemove: noOp,
                    afterHeadMorphed: noOp,
                }
            };
    
            //=============================================================================
            // Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
            //=============================================================================
            function morph(oldNode, newContent, config = {}) {
    
                if (oldNode instanceof Document) {
                    oldNode = oldNode.documentElement;
                }
    
                if (typeof newContent === 'string') {
                    newContent = parseContent(newContent);
                }
    
                let normalizedContent = normalizeContent(newContent);
    
                let ctx = createMorphContext(oldNode, normalizedContent, config);
    
                return morphNormalizedContent(oldNode, normalizedContent, ctx);
            }
    
            function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
                if (ctx.head.block) {
                    let oldHead = oldNode.querySelector('head');
                    let newHead = normalizedNewContent.querySelector('head');
                    if (oldHead && newHead) {
                        let promises = handleHeadElement(newHead, oldHead, ctx);
                        // when head promises resolve, call morph again, ignoring the head tag
                        Promise.all(promises).then(function () {
                            morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
                                head: {
                                    block: false,
                                    ignore: true
                                }
                            }));
                        });
                        return;
                    }
                }
    
                if (ctx.morphStyle === "innerHTML") {
    
                    // innerHTML, so we are only updating the children
                    morphChildren(normalizedNewContent, oldNode, ctx);
                    return oldNode.children;
    
                } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
                    // otherwise find the best element match in the new content, morph that, and merge its siblings
                    // into either side of the best match
                    let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
    
                    // stash the siblings that will need to be inserted on either side of the best match
                    let previousSibling = bestMatch?.previousSibling;
                    let nextSibling = bestMatch?.nextSibling;
    
                    // morph it
                    let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
    
                    if (bestMatch) {
                        // if there was a best match, merge the siblings in too and return the
                        // whole bunch
                        return insertSiblings(previousSibling, morphedNode, nextSibling);
                    } else {
                        // otherwise nothing was added to the DOM
                        return []
                    }
                } else {
                    throw "Do not understand how to morph style " + ctx.morphStyle;
                }
            }
    
    
            /**
             * @param possibleActiveElement
             * @param ctx
             * @returns {boolean}
             */
            function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
                return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement;
            }
    
            /**
             * @param oldNode root node to merge content into
             * @param newContent new content to merge
             * @param ctx the merge context
             * @returns {Element} the element that ended up in the DOM
             */
            function morphOldNodeTo(oldNode, newContent, ctx) {
                if (ctx.ignoreActive && oldNode === document.activeElement) ; else if (newContent == null) {
                    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
    
                    oldNode.remove();
                    ctx.callbacks.afterNodeRemoved(oldNode);
                    return null;
                } else if (!isSoftMatch(oldNode, newContent)) {
                    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
                    if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;
    
                    oldNode.parentElement.replaceChild(newContent, oldNode);
                    ctx.callbacks.afterNodeAdded(newContent);
                    ctx.callbacks.afterNodeRemoved(oldNode);
                    return newContent;
                } else {
                    if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) return oldNode;
    
                    if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ; else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
                        handleHeadElement(newContent, oldNode, ctx);
                    } else {
                        syncNodeFrom(newContent, oldNode, ctx);
                        if (!ignoreValueOfActiveElement(oldNode, ctx)) {
                            morphChildren(newContent, oldNode, ctx);
                        }
                    }
                    ctx.callbacks.afterNodeMorphed(oldNode, newContent);
                    return oldNode;
                }
            }
    
            /**
             * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
             * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
             * by using id sets, we are able to better match up with content deeper in the DOM.
             *
             * Basic algorithm is, for each node in the new content:
             *
             * - if we have reached the end of the old parent, append the new content
             * - if the new content has an id set match with the current insertion point, morph
             * - search for an id set match
             * - if id set match found, morph
             * - otherwise search for a "soft" match
             * - if a soft match is found, morph
             * - otherwise, prepend the new node before the current insertion point
             *
             * The two search algorithms terminate if competing node matches appear to outweigh what can be achieved
             * with the current node.  See findIdSetMatch() and findSoftMatch() for details.
             *
             * @param {Element} newParent the parent element of the new content
             * @param {Element } oldParent the old content that we are merging the new content into
             * @param ctx the merge context
             */
            function morphChildren(newParent, oldParent, ctx) {
    
                let nextNewChild = newParent.firstChild;
                let insertionPoint = oldParent.firstChild;
                let newChild;
    
                // run through all the new content
                while (nextNewChild) {
    
                    newChild = nextNewChild;
                    nextNewChild = newChild.nextSibling;
    
                    // if we are at the end of the exiting parent's children, just append
                    if (insertionPoint == null) {
                        if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
    
                        oldParent.appendChild(newChild);
                        ctx.callbacks.afterNodeAdded(newChild);
                        removeIdsFromConsideration(ctx, newChild);
                        continue;
                    }
    
                    // if the current node has an id set match then morph
                    if (isIdSetMatch(newChild, insertionPoint, ctx)) {
                        morphOldNodeTo(insertionPoint, newChild, ctx);
                        insertionPoint = insertionPoint.nextSibling;
                        removeIdsFromConsideration(ctx, newChild);
                        continue;
                    }
    
                    // otherwise search forward in the existing old children for an id set match
                    let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);
    
                    // if we found a potential match, remove the nodes until that point and morph
                    if (idSetMatch) {
                        insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
                        morphOldNodeTo(idSetMatch, newChild, ctx);
                        removeIdsFromConsideration(ctx, newChild);
                        continue;
                    }
    
                    // no id set match found, so scan forward for a soft match for the current node
                    let softMatch = findSoftMatch(newParent, oldParent, newChild, insertionPoint, ctx);
    
                    // if we found a soft match for the current node, morph
                    if (softMatch) {
                        insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
                        morphOldNodeTo(softMatch, newChild, ctx);
                        removeIdsFromConsideration(ctx, newChild);
                        continue;
                    }
    
                    // abandon all hope of morphing, just insert the new child before the insertion point
                    // and move on
                    if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
    
                    oldParent.insertBefore(newChild, insertionPoint);
                    ctx.callbacks.afterNodeAdded(newChild);
                    removeIdsFromConsideration(ctx, newChild);
                }
    
                // remove any remaining old nodes that didn't match up with new content
                while (insertionPoint !== null) {
    
                    let tempNode = insertionPoint;
                    insertionPoint = insertionPoint.nextSibling;
                    removeNode(tempNode, ctx);
                }
            }
    
            //=============================================================================
            // Attribute Syncing Code
            //=============================================================================
    
            /**
             * @param attr {String} the attribute to be mutated
             * @param to {Element} the element that is going to be updated
             * @param updateType {("update"|"remove")}
             * @param ctx the merge context
             * @returns {boolean} true if the attribute should be ignored, false otherwise
             */
            function ignoreAttribute(attr, to, updateType, ctx) {
                if(attr === 'value' && ctx.ignoreActiveValue && to === document.activeElement){
                    return true;
                }
                return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
            }
    
            /**
             * syncs a given node with another node, copying over all attributes and
             * inner element state from the 'from' node to the 'to' node
             *
             * @param {Element} from the element to copy attributes & state from
             * @param {Element} to the element to copy attributes & state to
             * @param ctx the merge context
             */
            function syncNodeFrom(from, to, ctx) {
                let type = from.nodeType;
    
                // if is an element type, sync the attributes from the
                // new node into the new node
                if (type === 1 /* element type */) {
                    const fromAttributes = from.attributes;
                    const toAttributes = to.attributes;
                    for (const fromAttribute of fromAttributes) {
                        if (ignoreAttribute(fromAttribute.name, to, 'update', ctx)) {
                            continue;
                        }
                        if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
                            to.setAttribute(fromAttribute.name, fromAttribute.value);
                        }
                    }
                    // iterate backwards to avoid skipping over items when a delete occurs
                    for (let i = toAttributes.length - 1; 0 <= i; i--) {
                        const toAttribute = toAttributes[i];
                        if (ignoreAttribute(toAttribute.name, to, 'remove', ctx)) {
                            continue;
                        }
                        if (!from.hasAttribute(toAttribute.name)) {
                            to.removeAttribute(toAttribute.name);
                        }
                    }
                }
    
                // sync text nodes
                if (type === 8 /* comment */ || type === 3 /* text */) {
                    if (to.nodeValue !== from.nodeValue) {
                        to.nodeValue = from.nodeValue;
                    }
                }
    
                if (!ignoreValueOfActiveElement(to, ctx)) {
                    // sync input values
                    syncInputValue(from, to, ctx);
                }
            }
    
            /**
             * @param from {Element} element to sync the value from
             * @param to {Element} element to sync the value to
             * @param attributeName {String} the attribute name
             * @param ctx the merge context
             */
            function syncBooleanAttribute(from, to, attributeName, ctx) {
                if (from[attributeName] !== to[attributeName]) {
                    let ignoreUpdate = ignoreAttribute(attributeName, to, 'update', ctx);
                    if (!ignoreUpdate) {
                        to[attributeName] = from[attributeName];
                    }
                    if (from[attributeName]) {
                        if (!ignoreUpdate) {
                            to.setAttribute(attributeName, from[attributeName]);
                        }
                    } else {
                        if (!ignoreAttribute(attributeName, to, 'remove', ctx)) {
                            to.removeAttribute(attributeName);
                        }
                    }
                }
            }
    
            /**
             * NB: many bothans died to bring us information:
             *
             *  https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
             *  https://github.com/choojs/nanomorph/blob/master/lib/morph.jsL113
             *
             * @param from {Element} the element to sync the input value from
             * @param to {Element} the element to sync the input value to
             * @param ctx the merge context
             */
            function syncInputValue(from, to, ctx) {
                if (from instanceof HTMLInputElement &&
                    to instanceof HTMLInputElement &&
                    from.type !== 'file') {
    
                    let fromValue = from.value;
                    let toValue = to.value;
    
                    // sync boolean attributes
                    syncBooleanAttribute(from, to, 'checked', ctx);
                    syncBooleanAttribute(from, to, 'disabled', ctx);
    
                    if (!from.hasAttribute('value')) {
                        if (!ignoreAttribute('value', to, 'remove', ctx)) {
                            to.value = '';
                            to.removeAttribute('value');
                        }
                    } else if (fromValue !== toValue) {
                        if (!ignoreAttribute('value', to, 'update', ctx)) {
                            to.setAttribute('value', fromValue);
                            to.value = fromValue;
                        }
                    }
                } else if (from instanceof HTMLOptionElement) {
                    syncBooleanAttribute(from, to, 'selected', ctx);
                } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
                    let fromValue = from.value;
                    let toValue = to.value;
                    if (ignoreAttribute('value', to, 'update', ctx)) {
                        return;
                    }
                    if (fromValue !== toValue) {
                        to.value = fromValue;
                    }
                    if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
                        to.firstChild.nodeValue = fromValue;
                    }
                }
            }
    
            //=============================================================================
            // the HEAD tag can be handled specially, either w/ a 'merge' or 'append' style
            //=============================================================================
            function handleHeadElement(newHeadTag, currentHead, ctx) {
    
                let added = [];
                let removed = [];
                let preserved = [];
                let nodesToAppend = [];
    
                let headMergeStyle = ctx.head.style;
    
                // put all new head elements into a Map, by their outerHTML
                let srcToNewHeadNodes = new Map();
                for (const newHeadChild of newHeadTag.children) {
                    srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
                }
    
                // for each elt in the current head
                for (const currentHeadElt of currentHead.children) {
    
                    // If the current head element is in the map
                    let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
                    let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
                    let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
                    if (inNewContent || isPreserved) {
                        if (isReAppended) {
                            // remove the current version and let the new version replace it and re-execute
                            removed.push(currentHeadElt);
                        } else {
                            // this element already exists and should not be re-appended, so remove it from
                            // the new content map, preserving it in the DOM
                            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
                            preserved.push(currentHeadElt);
                        }
                    } else {
                        if (headMergeStyle === "append") {
                            // we are appending and this existing element is not new content
                            // so if and only if it is marked for re-append do we do anything
                            if (isReAppended) {
                                removed.push(currentHeadElt);
                                nodesToAppend.push(currentHeadElt);
                            }
                        } else {
                            // if this is a merge, we remove this content since it is not in the new head
                            if (ctx.head.shouldRemove(currentHeadElt) !== false) {
                                removed.push(currentHeadElt);
                            }
                        }
                    }
                }
    
                // Push the remaining new head elements in the Map into the
                // nodes to append to the head tag
                nodesToAppend.push(...srcToNewHeadNodes.values());
    
                let promises = [];
                for (const newNode of nodesToAppend) {
                    let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
                    if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
                        if (newElt.href || newElt.src) {
                            let resolve = null;
                            let promise = new Promise(function (_resolve) {
                                resolve = _resolve;
                            });
                            newElt.addEventListener('load', function () {
                                resolve();
                            });
                            promises.push(promise);
                        }
                        currentHead.appendChild(newElt);
                        ctx.callbacks.afterNodeAdded(newElt);
                        added.push(newElt);
                    }
                }
    
                // remove all removed elements, after we have appended the new elements to avoid
                // additional network requests for things like style sheets
                for (const removedElement of removed) {
                    if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
                        currentHead.removeChild(removedElement);
                        ctx.callbacks.afterNodeRemoved(removedElement);
                    }
                }
    
                ctx.head.afterHeadMorphed(currentHead, {added: added, kept: preserved, removed: removed});
                return promises;
            }
    
            function noOp() {
            }
    
            /*
              Deep merges the config object and the Idiomoroph.defaults object to
              produce a final configuration object
             */
            function mergeDefaults(config) {
                let finalConfig = {};
                // copy top level stuff into final config
                Object.assign(finalConfig, defaults);
                Object.assign(finalConfig, config);
    
                // copy callbacks into final config (do this to deep merge the callbacks)
                finalConfig.callbacks = {};
                Object.assign(finalConfig.callbacks, defaults.callbacks);
                Object.assign(finalConfig.callbacks, config.callbacks);
    
                // copy head config into final config  (do this to deep merge the head)
                finalConfig.head = {};
                Object.assign(finalConfig.head, defaults.head);
                Object.assign(finalConfig.head, config.head);
                return finalConfig;
            }
    
            function createMorphContext(oldNode, newContent, config) {
                config = mergeDefaults(config);
                return {
                    target: oldNode,
                    newContent: newContent,
                    config: config,
                    morphStyle: config.morphStyle,
                    ignoreActive: config.ignoreActive,
                    ignoreActiveValue: config.ignoreActiveValue,
                    idMap: createIdMap(oldNode, newContent),
                    deadIds: new Set(),
                    callbacks: config.callbacks,
                    head: config.head
                }
            }
    
            function isIdSetMatch(node1, node2, ctx) {
                if (node1 == null || node2 == null) {
                    return false;
                }
                if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
                    if (node1.id !== "" && node1.id === node2.id) {
                        return true;
                    } else {
                        return getIdIntersectionCount(ctx, node1, node2) > 0;
                    }
                }
                return false;
            }
    
            function isSoftMatch(node1, node2) {
                if (node1 == null || node2 == null) {
                    return false;
                }
                return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName
            }
    
            function removeNodesBetween(startInclusive, endExclusive, ctx) {
                while (startInclusive !== endExclusive) {
                    let tempNode = startInclusive;
                    startInclusive = startInclusive.nextSibling;
                    removeNode(tempNode, ctx);
                }
                removeIdsFromConsideration(ctx, endExclusive);
                return endExclusive.nextSibling;
            }
    
            //=============================================================================
            // Scans forward from the insertionPoint in the old parent looking for a potential id match
            // for the newChild.  We stop if we find a potential id match for the new child OR
            // if the number of potential id matches we are discarding is greater than the
            // potential id matches for the new child
            //=============================================================================
            function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    
                // max id matches we are willing to discard in our search
                let newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);
    
                let potentialMatch = null;
    
                // only search forward if there is a possibility of an id match
                if (newChildPotentialIdCount > 0) {
                    let potentialMatch = insertionPoint;
                    // if there is a possibility of an id match, scan forward
                    // keep track of the potential id match count we are discarding (the
                    // newChildPotentialIdCount must be greater than this to make it likely
                    // worth it)
                    let otherMatchCount = 0;
                    while (potentialMatch != null) {
    
                        // If we have an id match, return the current potential match
                        if (isIdSetMatch(newChild, potentialMatch, ctx)) {
                            return potentialMatch;
                        }
    
                        // computer the other potential matches of this new content
                        otherMatchCount += getIdIntersectionCount(ctx, potentialMatch, newContent);
                        if (otherMatchCount > newChildPotentialIdCount) {
                            // if we have more potential id matches in _other_ content, we
                            // do not have a good candidate for an id match, so return null
                            return null;
                        }
    
                        // advanced to the next old content child
                        potentialMatch = potentialMatch.nextSibling;
                    }
                }
                return potentialMatch;
            }
    
            //=============================================================================
            // Scans forward from the insertionPoint in the old parent looking for a potential soft match
            // for the newChild.  We stop if we find a potential soft match for the new child OR
            // if we find a potential id match in the old parents children OR if we find two
            // potential soft matches for the next two pieces of new content
            //=============================================================================
            function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    
                let potentialSoftMatch = insertionPoint;
                let nextSibling = newChild.nextSibling;
                let siblingSoftMatchCount = 0;
    
                while (potentialSoftMatch != null) {
    
                    if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
                        // the current potential soft match has a potential id set match with the remaining new
                        // content so bail out of looking
                        return null;
                    }
    
                    // if we have a soft match with the current node, return it
                    if (isSoftMatch(newChild, potentialSoftMatch)) {
                        return potentialSoftMatch;
                    }
    
                    if (isSoftMatch(nextSibling, potentialSoftMatch)) {
                        // the next new node has a soft match with this node, so
                        // increment the count of future soft matches
                        siblingSoftMatchCount++;
                        nextSibling = nextSibling.nextSibling;
    
                        // If there are two future soft matches, bail to allow the siblings to soft match
                        // so that we don't consume future soft matches for the sake of the current node
                        if (siblingSoftMatchCount >= 2) {
                            return null;
                        }
                    }
    
                    // advanced to the next old content child
                    potentialSoftMatch = potentialSoftMatch.nextSibling;
                }
    
                return potentialSoftMatch;
            }
    
            function parseContent(newContent) {
                let parser = new DOMParser();
    
                // remove svgs to avoid false-positive matches on head, etc.
                let contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, '');
    
                // if the newContent contains a html, head or body tag, we can simply parse it w/o wrapping
                if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
                    let content = parser.parseFromString(newContent, "text/html");
                    // if it is a full HTML document, return the document itself as the parent container
                    if (contentWithSvgsRemoved.match(/<\/html>/)) {
                        content.generatedByIdiomorph = true;
                        return content;
                    } else {
                        // otherwise return the html element as the parent container
                        let htmlElement = content.firstChild;
                        if (htmlElement) {
                            htmlElement.generatedByIdiomorph = true;
                            return htmlElement;
                        } else {
                            return null;
                        }
                    }
                } else {
                    // if it is partial HTML, wrap it in a template tag to provide a parent element and also to help
                    // deal with touchy tags like tr, tbody, etc.
                    let responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
                    let content = responseDoc.body.querySelector('template').content;
                    content.generatedByIdiomorph = true;
                    return content
                }
            }
    
            function normalizeContent(newContent) {
                if (newContent == null) {
                    // noinspection UnnecessaryLocalVariableJS
                    const dummyParent = document.createElement('div');
                    return dummyParent;
                } else if (newContent.generatedByIdiomorph) {
                    // the template tag created by idiomorph parsing can serve as a dummy parent
                    return newContent;
                } else if (newContent instanceof Node) {
                    // a single node is added as a child to a dummy parent
                    const dummyParent = document.createElement('div');
                    dummyParent.append(newContent);
                    return dummyParent;
                } else {
                    // all nodes in the array or HTMLElement collection are consolidated under
                    // a single dummy parent element
                    const dummyParent = document.createElement('div');
                    for (const elt of [...newContent]) {
                        dummyParent.append(elt);
                    }
                    return dummyParent;
                }
            }
    
            function insertSiblings(previousSibling, morphedNode, nextSibling) {
                let stack = [];
                let added = [];
                while (previousSibling != null) {
                    stack.push(previousSibling);
                    previousSibling = previousSibling.previousSibling;
                }
                while (stack.length > 0) {
                    let node = stack.pop();
                    added.push(node); // push added preceding siblings on in order and insert
                    morphedNode.parentElement.insertBefore(node, morphedNode);
                }
                added.push(morphedNode);
                while (nextSibling != null) {
                    stack.push(nextSibling);
                    added.push(nextSibling); // here we are going in order, so push on as we scan, rather than add
                    nextSibling = nextSibling.nextSibling;
                }
                while (stack.length > 0) {
                    morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
                }
                return added;
            }
    
            function findBestNodeMatch(newContent, oldNode, ctx) {
                let currentElement;
                currentElement = newContent.firstChild;
                let bestElement = currentElement;
                let score = 0;
                while (currentElement) {
                    let newScore = scoreElement(currentElement, oldNode, ctx);
                    if (newScore > score) {
                        bestElement = currentElement;
                        score = newScore;
                    }
                    currentElement = currentElement.nextSibling;
                }
                return bestElement;
            }
    
            function scoreElement(node1, node2, ctx) {
                if (isSoftMatch(node1, node2)) {
                    return .5 + getIdIntersectionCount(ctx, node1, node2);
                }
                return 0;
            }
    
            function removeNode(tempNode, ctx) {
                removeIdsFromConsideration(ctx, tempNode);
                if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;
    
                tempNode.remove();
                ctx.callbacks.afterNodeRemoved(tempNode);
            }
    
            //=============================================================================
            // ID Set Functions
            //=============================================================================
    
            function isIdInConsideration(ctx, id) {
                return !ctx.deadIds.has(id);
            }
    
            function idIsWithinNode(ctx, id, targetNode) {
                let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
                return idSet.has(id);
            }
    
            function removeIdsFromConsideration(ctx, node) {
                let idSet = ctx.idMap.get(node) || EMPTY_SET;
                for (const id of idSet) {
                    ctx.deadIds.add(id);
                }
            }
    
            function getIdIntersectionCount(ctx, node1, node2) {
                let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
                let matchCount = 0;
                for (const id of sourceSet) {
                    // a potential match is an id in the source and potentialIdsSet, but
                    // that has not already been merged into the DOM
                    if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
                        ++matchCount;
                    }
                }
                return matchCount;
            }
    
            /**
             * A bottom up algorithm that finds all elements with ids inside of the node
             * argument and populates id sets for those nodes and all their parents, generating
             * a set of ids contained within all nodes for the entire hierarchy in the DOM
             *
             * @param node {Element}
             * @param {Map<Node, Set<String>>} idMap
             */
            function populateIdMapForNode(node, idMap) {
                let nodeParent = node.parentElement;
                // find all elements with an id property
                let idElements = node.querySelectorAll('[id]');
                for (const elt of idElements) {
                    let current = elt;
                    // walk up the parent hierarchy of that element, adding the id
                    // of element to the parent's id set
                    while (current !== nodeParent && current != null) {
                        let idSet = idMap.get(current);
                        // if the id set doesn't exist, create it and insert it in the  map
                        if (idSet == null) {
                            idSet = new Set();
                            idMap.set(current, idSet);
                        }
                        idSet.add(elt.id);
                        current = current.parentElement;
                    }
                }
            }
    
            /**
             * This function computes a map of nodes to all ids contained within that node (inclusive of the
             * node).  This map can be used to ask if two nodes have intersecting sets of ids, which allows
             * for a looser definition of "matching" than tradition id matching, and allows child nodes
             * to contribute to a parent nodes matching.
             *
             * @param {Element} oldContent  the old content that will be morphed
             * @param {Element} newContent  the new content to morph to
             * @returns {Map<Node, Set<String>>} a map of nodes to id sets for the
             */
            function createIdMap(oldContent, newContent) {
                let idMap = new Map();
                populateIdMapForNode(oldContent, idMap);
                populateIdMapForNode(newContent, idMap);
                return idMap;
            }
    
            //=============================================================================
            // This is what ends up becoming the Idiomorph global object
            //=============================================================================
            return {
                morph,
                defaults
            }
        })();
    
    function normalizeAttributesForComparison(element) {
        const isFileInput = element instanceof HTMLInputElement && element.type === 'file';
        if (!isFileInput) {
            if ('value' in element) {
                element.setAttribute('value', element.value);
            }
            else if (element.hasAttribute('value')) {
                element.setAttribute('value', '');
            }
        }
        Array.from(element.children).forEach((child) => {
            normalizeAttributesForComparison(child);
        });
    }
    
    const syncAttributes = (fromEl, toEl) => {
        for (let i = 0; i < fromEl.attributes.length; i++) {
            const attr = fromEl.attributes[i];
            toEl.setAttribute(attr.name, attr.value);
        }
    };
    function executeMorphdom(rootFromElement, rootToElement, modifiedFieldElements, getElementValue, externalMutationTracker) {
        const originalElementIdsToSwapAfter = [];
        const originalElementsToPreserve = new Map();
        const markElementAsNeedingPostMorphSwap = (id, replaceWithClone) => {
            const oldElement = originalElementsToPreserve.get(id);
            if (!(oldElement instanceof HTMLElement)) {
                throw new Error(`Original element with id ${id} not found`);
            }
            originalElementIdsToSwapAfter.push(id);
            if (!replaceWithClone) {
                return null;
            }
            const clonedOldElement = cloneHTMLElement(oldElement);
            oldElement.replaceWith(clonedOldElement);
            return clonedOldElement;
        };
        rootToElement.querySelectorAll('[data-live-preserve]').forEach((newElement) => {
            const id = newElement.id;
            if (!id) {
                throw new Error('The data-live-preserve attribute requires an id attribute to be set on the element');
            }
            const oldElement = rootFromElement.querySelector(`#${id}`);
            if (!(oldElement instanceof HTMLElement)) {
                throw new Error(`The element with id "${id}" was not found in the original HTML`);
            }
            newElement.removeAttribute('data-live-preserve');
            originalElementsToPreserve.set(id, oldElement);
            syncAttributes(newElement, oldElement);
        });
        Idiomorph.morph(rootFromElement, rootToElement, {
            callbacks: {
                beforeNodeMorphed: (fromEl, toEl) => {
                    if (!(fromEl instanceof Element) || !(toEl instanceof Element)) {
                        return true;
                    }
                    if (fromEl === rootFromElement) {
                        return true;
                    }
                    if (fromEl.id && originalElementsToPreserve.has(fromEl.id)) {
                        if (fromEl.id === toEl.id) {
                            return false;
                        }
                        const clonedFromEl = markElementAsNeedingPostMorphSwap(fromEl.id, true);
                        if (!clonedFromEl) {
                            throw new Error('missing clone');
                        }
                        Idiomorph.morph(clonedFromEl, toEl);
                        return false;
                    }
                    if (fromEl instanceof HTMLElement && toEl instanceof HTMLElement) {
                        if (typeof fromEl.__x !== 'undefined') {
                            if (!window.Alpine) {
                                throw new Error('Unable to access Alpine.js though the global window.Alpine variable. Please make sure Alpine.js is loaded before Symfony UX LiveComponent.');
                            }
                            if (typeof window.Alpine.morph !== 'function') {
                                throw new Error('Unable to access Alpine.js morph function. Please make sure the Alpine.js Morph plugin is installed and loaded, see https://alpinejs.dev/plugins/morph for more information.');
                            }
                            window.Alpine.morph(fromEl.__x, toEl);
                        }
                        if (externalMutationTracker.wasElementAdded(fromEl)) {
                            fromEl.insertAdjacentElement('afterend', toEl);
                            return false;
                        }
                        if (modifiedFieldElements.includes(fromEl)) {
                            setValueOnElement(toEl, getElementValue(fromEl));
                        }
                        if (fromEl === document.activeElement &&
                            fromEl !== document.body &&
                            null !== getModelDirectiveFromElement(fromEl, false)) {
                            setValueOnElement(toEl, getElementValue(fromEl));
                        }
                        const elementChanges = externalMutationTracker.getChangedElement(fromEl);
                        if (elementChanges) {
                            elementChanges.applyToElement(toEl);
                        }
                        if (fromEl.nodeName.toUpperCase() !== 'OPTION' && fromEl.isEqualNode(toEl)) {
                            const normalizedFromEl = cloneHTMLElement(fromEl);
                            normalizeAttributesForComparison(normalizedFromEl);
                            const normalizedToEl = cloneHTMLElement(toEl);
                            normalizeAttributesForComparison(normalizedToEl);
                            if (normalizedFromEl.isEqualNode(normalizedToEl)) {
                                return false;
                            }
                        }
                    }
                    if (fromEl.hasAttribute('data-skip-morph') || (fromEl.id && fromEl.id !== toEl.id)) {
                        fromEl.innerHTML = toEl.innerHTML;
                        return true;
                    }
                    if (fromEl.parentElement?.hasAttribute('data-skip-morph')) {
                        return false;
                    }
                    return !fromEl.hasAttribute('data-live-ignore');
                },
                beforeNodeRemoved(node) {
                    if (!(node instanceof HTMLElement)) {
                        return true;
                    }
                    if (node.id && originalElementsToPreserve.has(node.id)) {
                        markElementAsNeedingPostMorphSwap(node.id, false);
                        return true;
                    }
                    if (externalMutationTracker.wasElementAdded(node)) {
                        return false;
                    }
                    return !node.hasAttribute('data-live-ignore');
                },
            },
        });
        originalElementIdsToSwapAfter.forEach((id) => {
            const newElement = rootFromElement.querySelector(`#${id}`);
            const originalElement = originalElementsToPreserve.get(id);
            if (!(newElement instanceof HTMLElement) || !(originalElement instanceof HTMLElement)) {
                throw new Error('Missing elements.');
            }
            newElement.replaceWith(originalElement);
        });
    }
    
    class UnsyncedInputsTracker {
        constructor(component, modelElementResolver) {
            this.elementEventListeners = [
                { event: 'input', callback: (event) => this.handleInputEvent(event) },
            ];
            this.component = component;
            this.modelElementResolver = modelElementResolver;
            this.unsyncedInputs = new UnsyncedInputContainer();
        }
        activate() {
            this.elementEventListeners.forEach(({ event, callback }) => {
                this.component.element.addEventListener(event, callback);
            });
        }
        deactivate() {
            this.elementEventListeners.forEach(({ event, callback }) => {
                this.component.element.removeEventListener(event, callback);
            });
        }
        markModelAsSynced(modelName) {
            this.unsyncedInputs.markModelAsSynced(modelName);
        }
        handleInputEvent(event) {
            const target = event.target;
            if (!target) {
                return;
            }
            this.updateModelFromElement(target);
        }
        updateModelFromElement(element) {
            if (!elementBelongsToThisComponent(element, this.component)) {
                return;
            }
            if (!(element instanceof HTMLElement)) {
                throw new Error('Could not update model for non HTMLElement');
            }
            const modelName = this.modelElementResolver.getModelName(element);
            this.unsyncedInputs.add(element, modelName);
        }
        getUnsyncedInputs() {
            return this.unsyncedInputs.allUnsyncedInputs();
        }
        getUnsyncedModels() {
            return Array.from(this.unsyncedInputs.getUnsyncedModelNames());
        }
        resetUnsyncedFields() {
            this.unsyncedInputs.resetUnsyncedFields();
        }
    }
    class UnsyncedInputContainer {
        constructor() {
            this.unsyncedNonModelFields = [];
            this.unsyncedModelNames = [];
            this.unsyncedModelFields = new Map();
        }
        add(element, modelName = null) {
            if (modelName) {
                this.unsyncedModelFields.set(modelName, element);
                if (!this.unsyncedModelNames.includes(modelName)) {
                    this.unsyncedModelNames.push(modelName);
                }
                return;
            }
            this.unsyncedNonModelFields.push(element);
        }
        resetUnsyncedFields() {
            this.unsyncedModelFields.forEach((value, key) => {
                if (!this.unsyncedModelNames.includes(key)) {
                    this.unsyncedModelFields.delete(key);
                }
            });
        }
        allUnsyncedInputs() {
            return [...this.unsyncedNonModelFields, ...this.unsyncedModelFields.values()];
        }
        markModelAsSynced(modelName) {
            const index = this.unsyncedModelNames.indexOf(modelName);
            if (index !== -1) {
                this.unsyncedModelNames.splice(index, 1);
            }
        }
        getUnsyncedModelNames() {
            return this.unsyncedModelNames;
        }
    }
    
    function getDeepData(data, propertyPath) {
        const { currentLevelData, finalKey } = parseDeepData(data, propertyPath);
        if (currentLevelData === undefined) {
            return undefined;
        }
        return currentLevelData[finalKey];
    }
    const parseDeepData = (data, propertyPath) => {
        const finalData = JSON.parse(JSON.stringify(data));
        let currentLevelData = finalData;
        const parts = propertyPath.split('.');
        for (let i = 0; i < parts.length - 1; i++) {
            currentLevelData = currentLevelData[parts[i]];
        }
        const finalKey = parts[parts.length - 1];
        return {
            currentLevelData,
            finalData,
            finalKey,
            parts,
        };
    };
    
    class ValueStore {
        constructor(props) {
            this.props = {};
            this.dirtyProps = {};
            this.pendingProps = {};
            this.updatedPropsFromParent = {};
            this.props = props;
        }
        get(name) {
            const normalizedName = normalizeModelName(name);
            if (this.dirtyProps[normalizedName] !== undefined) {
                return this.dirtyProps[normalizedName];
            }
            if (this.pendingProps[normalizedName] !== undefined) {
                return this.pendingProps[normalizedName];
            }
            if (this.props[normalizedName] !== undefined) {
                return this.props[normalizedName];
            }
            return getDeepData(this.props, normalizedName);
        }
        has(name) {
            return this.get(name) !== undefined;
        }
        set(name, value) {
            const normalizedName = normalizeModelName(name);
            if (this.get(normalizedName) === value) {
                return false;
            }
            this.dirtyProps[normalizedName] = value;
            return true;
        }
        getOriginalProps() {
            return { ...this.props };
        }
        getDirtyProps() {
            return { ...this.dirtyProps };
        }
        getUpdatedPropsFromParent() {
            return { ...this.updatedPropsFromParent };
        }
        flushDirtyPropsToPending() {
            this.pendingProps = { ...this.dirtyProps };
            this.dirtyProps = {};
        }
        reinitializeAllProps(props) {
            this.props = props;
            this.updatedPropsFromParent = {};
            this.pendingProps = {};
        }
        pushPendingPropsBackToDirty() {
            this.dirtyProps = { ...this.pendingProps, ...this.dirtyProps };
            this.pendingProps = {};
        }
        storeNewPropsFromParent(props) {
            let changed = false;
            for (const [key, value] of Object.entries(props)) {
                const currentValue = this.get(key);
                if (currentValue !== value) {
                    changed = true;
                }
            }
            if (changed) {
                this.updatedPropsFromParent = props;
            }
            return changed;
        }
    }
    
    class Component {
        constructor(element, name, props, listeners, id, backend, elementDriver) {
            this.fingerprint = '';
            this.defaultDebounce = 150;
            this.backendRequest = null;
            this.pendingActions = [];
            this.pendingFiles = {};
            this.isRequestPending = false;
            this.requestDebounceTimeout = null;
            this.element = element;
            this.name = name;
            this.backend = backend;
            this.elementDriver = elementDriver;
            this.id = id;
            this.listeners = new Map();
            listeners.forEach((listener) => {
                if (!this.listeners.has(listener.event)) {
                    this.listeners.set(listener.event, []);
                }
                this.listeners.get(listener.event)?.push(listener.action);
            });
            this.valueStore = new ValueStore(props);
            this.unsyncedInputsTracker = new UnsyncedInputsTracker(this, elementDriver);
            this.hooks = new HookManager();
            this.resetPromise();
            this.externalMutationTracker = new ExternalMutationTracker(this.element, (element) => elementBelongsToThisComponent(element, this));
            this.externalMutationTracker.start();
        }
        addPlugin(plugin) {
            plugin.attachToComponent(this);
        }
        connect() {
            registerComponent(this);
            this.hooks.triggerHook('connect', this);
            this.unsyncedInputsTracker.activate();
            this.externalMutationTracker.start();
        }
        disconnect() {
            unregisterComponent(this);
            this.hooks.triggerHook('disconnect', this);
            this.clearRequestDebounceTimeout();
            this.unsyncedInputsTracker.deactivate();
            this.externalMutationTracker.stop();
        }
        on(hookName, callback) {
            this.hooks.register(hookName, callback);
        }
        off(hookName, callback) {
            this.hooks.unregister(hookName, callback);
        }
        set(model, value, reRender = false, debounce = false) {
            const promise = this.nextRequestPromise;
            const modelName = normalizeModelName(model);
            if (!this.valueStore.has(modelName)) {
                throw new Error(`Invalid model name "${model}".`);
            }
            const isChanged = this.valueStore.set(modelName, value);
            this.hooks.triggerHook('model:set', model, value, this);
            this.unsyncedInputsTracker.markModelAsSynced(modelName);
            if (reRender && isChanged) {
                this.debouncedStartRequest(debounce);
            }
            return promise;
        }
        getData(model) {
            const modelName = normalizeModelName(model);
            if (!this.valueStore.has(modelName)) {
                throw new Error(`Invalid model "${model}".`);
            }
            return this.valueStore.get(modelName);
        }
        action(name, args = {}, debounce = false) {
            const promise = this.nextRequestPromise;
            this.pendingActions.push({
                name,
                args,
            });
            this.debouncedStartRequest(debounce);
            return promise;
        }
        files(key, input) {
            this.pendingFiles[key] = input;
        }
        render() {
            const promise = this.nextRequestPromise;
            this.tryStartingRequest();
            return promise;
        }
        getUnsyncedModels() {
            return this.unsyncedInputsTracker.getUnsyncedModels();
        }
        emit(name, data, onlyMatchingComponentsNamed = null) {
            this.performEmit(name, data, false, onlyMatchingComponentsNamed);
        }
        emitUp(name, data, onlyMatchingComponentsNamed = null) {
            this.performEmit(name, data, true, onlyMatchingComponentsNamed);
        }
        emitSelf(name, data) {
            this.doEmit(name, data);
        }
        performEmit(name, data, emitUp, matchingName) {
            const components = findComponents(this, emitUp, matchingName);
            components.forEach((component) => {
                component.doEmit(name, data);
            });
        }
        doEmit(name, data) {
            if (!this.listeners.has(name)) {
                return;
            }
            const actions = this.listeners.get(name) || [];
            actions.forEach((action) => {
                this.action(action, data, 1);
            });
        }
        isTurboEnabled() {
            return typeof Turbo !== 'undefined' && !this.element.closest('[data-turbo="false"]');
        }
        tryStartingRequest() {
            if (!this.backendRequest) {
                this.performRequest();
                return;
            }
            this.isRequestPending = true;
        }
        performRequest() {
            const thisPromiseResolve = this.nextRequestPromiseResolve;
            this.resetPromise();
            this.unsyncedInputsTracker.resetUnsyncedFields();
            const filesToSend = {};
            for (const [key, value] of Object.entries(this.pendingFiles)) {
                if (value.files) {
                    filesToSend[key] = value.files;
                }
            }
            const requestConfig = {
                props: this.valueStore.getOriginalProps(),
                actions: this.pendingActions,
                updated: this.valueStore.getDirtyProps(),
                children: {},
                updatedPropsFromParent: this.valueStore.getUpdatedPropsFromParent(),
                files: filesToSend,
            };
            this.hooks.triggerHook('request:started', requestConfig);
            this.backendRequest = this.backend.makeRequest(requestConfig.props, requestConfig.actions, requestConfig.updated, requestConfig.children, requestConfig.updatedPropsFromParent, requestConfig.files);
            this.hooks.triggerHook('loading.state:started', this.element, this.backendRequest);
            this.pendingActions = [];
            this.valueStore.flushDirtyPropsToPending();
            this.isRequestPending = false;
            this.backendRequest.promise.then(async (response) => {
                const backendResponse = new BackendResponse(response);
                const html = await backendResponse.getBody();
                for (const input of Object.values(this.pendingFiles)) {
                    input.value = '';
                }
                const headers = backendResponse.response.headers;
                if (!headers.get('Content-Type')?.includes('application/vnd.live-component+html') &&
                    !headers.get('X-Live-Redirect')) {
                    const controls = { displayError: true };
                    this.valueStore.pushPendingPropsBackToDirty();
                    this.hooks.triggerHook('response:error', backendResponse, controls);
                    if (controls.displayError) {
                        this.renderError(html);
                    }
                    this.backendRequest = null;
                    thisPromiseResolve(backendResponse);
                    return response;
                }
                this.processRerender(html, backendResponse);
                this.backendRequest = null;
                thisPromiseResolve(backendResponse);
                if (this.isRequestPending) {
                    this.isRequestPending = false;
                    this.performRequest();
                }
                return response;
            });
        }
        processRerender(html, backendResponse) {
            const controls = { shouldRender: true };
            this.hooks.triggerHook('render:started', html, backendResponse, controls);
            if (!controls.shouldRender) {
                return;
            }
            if (backendResponse.response.headers.get('Location')) {
                if (this.isTurboEnabled()) {
                    Turbo.visit(backendResponse.response.headers.get('Location'));
                }
                else {
                    window.location.href = backendResponse.response.headers.get('Location') || '';
                }
                return;
            }
            this.hooks.triggerHook('loading.state:finished', this.element);
            const modifiedModelValues = {};
            Object.keys(this.valueStore.getDirtyProps()).forEach((modelName) => {
                modifiedModelValues[modelName] = this.valueStore.get(modelName);
            });
            let newElement;
            try {
                newElement = htmlToElement(html);
                if (!newElement.matches('[data-controller~=live]')) {
                    throw new Error('A live component template must contain a single root controller element.');
                }
            }
            catch (error) {
                console.error(`There was a problem with the '${this.name}' component HTML returned:`, {
                    id: this.id,
                });
                throw error;
            }
            this.externalMutationTracker.handlePendingChanges();
            this.externalMutationTracker.stop();
            executeMorphdom(this.element, newElement, this.unsyncedInputsTracker.getUnsyncedInputs(), (element) => getValueFromElement(element, this.valueStore), this.externalMutationTracker);
            this.externalMutationTracker.start();
            const newProps = this.elementDriver.getComponentProps();
            this.valueStore.reinitializeAllProps(newProps);
            const eventsToEmit = this.elementDriver.getEventsToEmit();
            const browserEventsToDispatch = this.elementDriver.getBrowserEventsToDispatch();
            Object.keys(modifiedModelValues).forEach((modelName) => {
                this.valueStore.set(modelName, modifiedModelValues[modelName]);
            });
            eventsToEmit.forEach(({ event, data, target, componentName }) => {
                if (target === 'up') {
                    this.emitUp(event, data, componentName);
                    return;
                }
                if (target === 'self') {
                    this.emitSelf(event, data);
                    return;
                }
                this.emit(event, data, componentName);
            });
            browserEventsToDispatch.forEach(({ event, payload }) => {
                this.element.dispatchEvent(new CustomEvent(event, {
                    detail: payload,
                    bubbles: true,
                }));
            });
            this.hooks.triggerHook('render:finished', this);
        }
        calculateDebounce(debounce) {
            if (debounce === true) {
                return this.defaultDebounce;
            }
            if (debounce === false) {
                return 0;
            }
            return debounce;
        }
        clearRequestDebounceTimeout() {
            if (this.requestDebounceTimeout) {
                clearTimeout(this.requestDebounceTimeout);
                this.requestDebounceTimeout = null;
            }
        }
        debouncedStartRequest(debounce) {
            this.clearRequestDebounceTimeout();
            this.requestDebounceTimeout = window.setTimeout(() => {
                this.render();
            }, this.calculateDebounce(debounce));
        }
        renderError(html) {
            let modal = document.getElementById('live-component-error');
            if (modal) {
                modal.innerHTML = '';
            }
            else {
                modal = document.createElement('div');
                modal.id = 'live-component-error';
                modal.style.padding = '50px';
                modal.style.backgroundColor = 'rgba(0, 0, 0, .5)';
                modal.style.zIndex = '100000';
                modal.style.position = 'fixed';
                modal.style.top = '0px';
                modal.style.bottom = '0px';
                modal.style.left = '0px';
                modal.style.right = '0px';
                modal.style.display = 'flex';
                modal.style.flexDirection = 'column';
            }
            const iframe = document.createElement('iframe');
            iframe.style.borderRadius = '5px';
            iframe.style.flexGrow = '1';
            modal.appendChild(iframe);
            document.body.prepend(modal);
            document.body.style.overflow = 'hidden';
            if (iframe.contentWindow) {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(html);
                iframe.contentWindow.document.close();
            }
            const closeModal = (modal) => {
                if (modal) {
                    modal.outerHTML = '';
                }
                document.body.style.overflow = 'visible';
            };
            modal.addEventListener('click', () => closeModal(modal));
            modal.setAttribute('tabindex', '0');
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal(modal);
                }
            });
            modal.focus();
        }
        resetPromise() {
            this.nextRequestPromise = new Promise((resolve) => {
                this.nextRequestPromiseResolve = resolve;
            });
        }
        _updateFromParentProps(props) {
            const isChanged = this.valueStore.storeNewPropsFromParent(props);
            if (isChanged) {
                this.render();
            }
        }
    }
    function proxifyComponent(component) {
        return new Proxy(component, {
            get(component, prop) {
                if (prop in component || typeof prop !== 'string') {
                    if (typeof component[prop] === 'function') {
                        const callable = component[prop];
                        return (...args) => {
                            return callable.apply(component, args);
                        };
                    }
                    return Reflect.get(component, prop);
                }
                if (component.valueStore.has(prop)) {
                    return component.getData(prop);
                }
                return (args) => {
                    return component.action.apply(component, [prop, args]);
                };
            },
            set(target, property, value) {
                if (property in target) {
                    target[property] = value;
                    return true;
                }
                target.set(property, value);
                return true;
            },
        });
    }
    
    class StimulusElementDriver {
        constructor(controller) {
            this.controller = controller;
        }
        getModelName(element) {
            const modelDirective = getModelDirectiveFromElement(element, false);
            if (!modelDirective) {
                return null;
            }
            return modelDirective.action;
        }
        getComponentProps() {
            return this.controller.propsValue;
        }
        getEventsToEmit() {
            return this.controller.eventsToEmitValue;
        }
        getBrowserEventsToDispatch() {
            return this.controller.eventsToDispatchValue;
        }
    }
    
    function getModelBinding (modelDirective) {
        let shouldRender = true;
        let targetEventName = null;
        let debounce = false;
        modelDirective.modifiers.forEach((modifier) => {
            switch (modifier.name) {
                case 'on':
                    if (!modifier.value) {
                        throw new Error(`The "on" modifier in ${modelDirective.getString()} requires a value - e.g. on(change).`);
                    }
                    if (!['input', 'change'].includes(modifier.value)) {
                        throw new Error(`The "on" modifier in ${modelDirective.getString()} only accepts the arguments "input" or "change".`);
                    }
                    targetEventName = modifier.value;
                    break;
                case 'norender':
                    shouldRender = false;
                    break;
                case 'debounce':
                    debounce = modifier.value ? Number.parseInt(modifier.value) : true;
                    break;
                default:
                    throw new Error(`Unknown modifier "${modifier.name}" in data-model="${modelDirective.getString()}".`);
            }
        });
        const [modelName, innerModelName] = modelDirective.action.split(':');
        return {
            modelName,
            innerModelName: innerModelName || null,
            shouldRender,
            debounce,
            targetEventName,
        };
    }
    
    class ChildComponentPlugin {
        constructor(component) {
            this.parentModelBindings = [];
            this.component = component;
            const modelDirectives = getAllModelDirectiveFromElements(this.component.element);
            this.parentModelBindings = modelDirectives.map(getModelBinding);
        }
        attachToComponent(component) {
            component.on('request:started', (requestData) => {
                requestData.children = this.getChildrenFingerprints();
            });
            component.on('model:set', (model, value) => {
                this.notifyParentModelChange(model, value);
            });
        }
        getChildrenFingerprints() {
            const fingerprints = {};
            this.getChildren().forEach((child) => {
                if (!child.id) {
                    throw new Error('missing id');
                }
                fingerprints[child.id] = {
                    fingerprint: child.fingerprint,
                    tag: child.element.tagName.toLowerCase(),
                };
            });
            return fingerprints;
        }
        notifyParentModelChange(modelName, value) {
            const parentComponent = findParent(this.component);
            if (!parentComponent) {
                return;
            }
            this.parentModelBindings.forEach((modelBinding) => {
                const childModelName = modelBinding.innerModelName || 'value';
                if (childModelName !== modelName) {
                    return;
                }
                parentComponent.set(modelBinding.modelName, value, modelBinding.shouldRender, modelBinding.debounce);
            });
        }
        getChildren() {
            return findChildren(this.component);
        }
    }
    
    class LazyPlugin {
        constructor() {
            this.intersectionObserver = null;
        }
        attachToComponent(component) {
            if ('lazy' !== component.element.attributes.getNamedItem('loading')?.value) {
                return;
            }
            component.on('connect', () => {
                this.getObserver().observe(component.element);
            });
            component.on('disconnect', () => {
                this.intersectionObserver?.unobserve(component.element);
            });
        }
        getObserver() {
            if (!this.intersectionObserver) {
                this.intersectionObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.dispatchEvent(new CustomEvent('live:appear'));
                            observer.unobserve(entry.target);
                        }
                    });
                });
            }
            return this.intersectionObserver;
        }
    }
    
    class LoadingPlugin {
        attachToComponent(component) {
            component.on('loading.state:started', (element, request) => {
                this.startLoading(component, element, request);
            });
            component.on('loading.state:finished', (element) => {
                this.finishLoading(component, element);
            });
            this.finishLoading(component, component.element);
        }
        startLoading(component, targetElement, backendRequest) {
            this.handleLoadingToggle(component, true, targetElement, backendRequest);
        }
        finishLoading(component, targetElement) {
            this.handleLoadingToggle(component, false, targetElement, null);
        }
        handleLoadingToggle(component, isLoading, targetElement, backendRequest) {
            if (isLoading) {
                this.addAttributes(targetElement, ['busy']);
            }
            else {
                this.removeAttributes(targetElement, ['busy']);
            }
            this.getLoadingDirectives(component, targetElement).forEach(({ element, directives }) => {
                if (isLoading) {
                    this.addAttributes(element, ['data-live-is-loading']);
                }
                else {
                    this.removeAttributes(element, ['data-live-is-loading']);
                }
                directives.forEach((directive) => {
                    this.handleLoadingDirective(element, isLoading, directive, backendRequest);
                });
            });
        }
        handleLoadingDirective(element, isLoading, directive, backendRequest) {
            const finalAction = parseLoadingAction(directive.action, isLoading);
            const targetedActions = [];
            const targetedModels = [];
            let delay = 0;
            const validModifiers = new Map();
            validModifiers.set('delay', (modifier) => {
                if (!isLoading) {
                    return;
                }
                delay = modifier.value ? Number.parseInt(modifier.value) : 200;
            });
            validModifiers.set('action', (modifier) => {
                if (!modifier.value) {
                    throw new Error(`The "action" in data-loading must have an action name - e.g. action(foo). It's missing for "${directive.getString()}"`);
                }
                targetedActions.push(modifier.value);
            });
            validModifiers.set('model', (modifier) => {
                if (!modifier.value) {
                    throw new Error(`The "model" in data-loading must have an action name - e.g. model(foo). It's missing for "${directive.getString()}"`);
                }
                targetedModels.push(modifier.value);
            });
            directive.modifiers.forEach((modifier) => {
                if (validModifiers.has(modifier.name)) {
                    const callable = validModifiers.get(modifier.name) ?? (() => { });
                    callable(modifier);
                    return;
                }
                throw new Error(`Unknown modifier "${modifier.name}" used in data-loading="${directive.getString()}". Available modifiers are: ${Array.from(validModifiers.keys()).join(', ')}.`);
            });
            if (isLoading &&
                targetedActions.length > 0 &&
                backendRequest &&
                !backendRequest.containsOneOfActions(targetedActions)) {
                return;
            }
            if (isLoading &&
                targetedModels.length > 0 &&
                backendRequest &&
                !backendRequest.areAnyModelsUpdated(targetedModels)) {
                return;
            }
            let loadingDirective;
            switch (finalAction) {
                case 'show':
                    loadingDirective = () => this.showElement(element);
                    break;
                case 'hide':
                    loadingDirective = () => this.hideElement(element);
                    break;
                case 'addClass':
                    loadingDirective = () => this.addClass(element, directive.args);
                    break;
                case 'removeClass':
                    loadingDirective = () => this.removeClass(element, directive.args);
                    break;
                case 'addAttribute':
                    loadingDirective = () => this.addAttributes(element, directive.args);
                    break;
                case 'removeAttribute':
                    loadingDirective = () => this.removeAttributes(element, directive.args);
                    break;
                default:
                    throw new Error(`Unknown data-loading action "${finalAction}"`);
            }
            if (delay) {
                window.setTimeout(() => {
                    if (backendRequest && !backendRequest.isResolved) {
                        loadingDirective();
                    }
                }, delay);
                return;
            }
            loadingDirective();
        }
        getLoadingDirectives(component, element) {
            const loadingDirectives = [];
            let matchingElements = [...Array.from(element.querySelectorAll('[data-loading]'))];
            matchingElements = matchingElements.filter((elt) => elementBelongsToThisComponent(elt, component));
            if (element.hasAttribute('data-loading')) {
                matchingElements = [element, ...matchingElements];
            }
            matchingElements.forEach((element) => {
                if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
                    throw new Error('Invalid Element Type');
                }
                const directives = parseDirectives(element.dataset.loading || 'show');
                loadingDirectives.push({
                    element,
                    directives,
                });
            });
            return loadingDirectives;
        }
        showElement(element) {
            element.style.display = 'revert';
        }
        hideElement(element) {
            element.style.display = 'none';
        }
        addClass(element, classes) {
            element.classList.add(...combineSpacedArray(classes));
        }
        removeClass(element, classes) {
            element.classList.remove(...combineSpacedArray(classes));
            if (element.classList.length === 0) {
                element.removeAttribute('class');
            }
        }
        addAttributes(element, attributes) {
            attributes.forEach((attribute) => {
                element.setAttribute(attribute, '');
            });
        }
        removeAttributes(element, attributes) {
            attributes.forEach((attribute) => {
                element.removeAttribute(attribute);
            });
        }
    }
    const parseLoadingAction = (action, isLoading) => {
        switch (action) {
            case 'show':
                return isLoading ? 'show' : 'hide';
            case 'hide':
                return isLoading ? 'hide' : 'show';
            case 'addClass':
                return isLoading ? 'addClass' : 'removeClass';
            case 'removeClass':
                return isLoading ? 'removeClass' : 'addClass';
            case 'addAttribute':
                return isLoading ? 'addAttribute' : 'removeAttribute';
            case 'removeAttribute':
                return isLoading ? 'removeAttribute' : 'addAttribute';
        }
        throw new Error(`Unknown data-loading action "${action}"`);
    };
    
    class PageUnloadingPlugin {
        constructor() {
            this.isConnected = false;
        }
        attachToComponent(component) {
            component.on('render:started', (html, response, controls) => {
                if (!this.isConnected) {
                    controls.shouldRender = false;
                }
            });
            component.on('connect', () => {
                this.isConnected = true;
            });
            component.on('disconnect', () => {
                this.isConnected = false;
            });
        }
    }
    
    class PollingDirector {
        constructor(component) {
            this.isPollingActive = true;
            this.pollingIntervals = [];
            this.component = component;
        }
        addPoll(actionName, duration) {
            this.polls.push({ actionName, duration });
            if (this.isPollingActive) {
                this.initiatePoll(actionName, duration);
            }
        }
        startAllPolling() {
            if (this.isPollingActive) {
                return;
            }
            this.isPollingActive = true;
            this.polls.forEach(({ actionName, duration }) => {
                this.initiatePoll(actionName, duration);
            });
        }
        stopAllPolling() {
            this.isPollingActive = false;
            this.pollingIntervals.forEach((interval) => {
                clearInterval(interval);
            });
        }
        clearPolling() {
            this.stopAllPolling();
            this.polls = [];
            this.startAllPolling();
        }
        initiatePoll(actionName, duration) {
            let callback;
            if (actionName === '$render') {
                callback = () => {
                    this.component.render();
                };
            }
            else {
                callback = () => {
                    this.component.action(actionName, {}, 0);
                };
            }
            const timer = window.setInterval(() => {
                callback();
            }, duration);
            this.pollingIntervals.push(timer);
        }
    }
    
    class PollingPlugin {
        attachToComponent(component) {
            this.element = component.element;
            this.pollingDirector = new PollingDirector(component);
            this.initializePolling();
            component.on('connect', () => {
                this.pollingDirector.startAllPolling();
            });
            component.on('disconnect', () => {
                this.pollingDirector.stopAllPolling();
            });
            component.on('render:finished', () => {
                this.initializePolling();
            });
        }
        addPoll(actionName, duration) {
            this.pollingDirector.addPoll(actionName, duration);
        }
        clearPolling() {
            this.pollingDirector.clearPolling();
        }
        initializePolling() {
            this.clearPolling();
            if (this.element.dataset.poll === undefined) {
                return;
            }
            const rawPollConfig = this.element.dataset.poll;
            const directives = parseDirectives(rawPollConfig || '$render');
            directives.forEach((directive) => {
                let duration = 2000;
                directive.modifiers.forEach((modifier) => {
                    switch (modifier.name) {
                        case 'delay':
                            if (modifier.value) {
                                duration = Number.parseInt(modifier.value);
                            }
                            break;
                        default:
                            console.warn(`Unknown modifier "${modifier.name}" in data-poll "${rawPollConfig}".`);
                    }
                });
                this.addPoll(directive.action, duration);
            });
        }
    }
    
    function isValueEmpty(value) {
        if (null === value || value === '' || undefined === value || (Array.isArray(value) && value.length === 0)) {
            return true;
        }
        if (typeof value !== 'object') {
            return false;
        }
        for (const key of Object.keys(value)) {
            if (!isValueEmpty(value[key])) {
                return false;
            }
        }
        return true;
    }
    function toQueryString(data) {
        const buildQueryStringEntries = (data, entries = {}, baseKey = '') => {
            Object.entries(data).forEach(([iKey, iValue]) => {
                const key = baseKey === '' ? iKey : `${baseKey}[${iKey}]`;
                if ('' === baseKey && isValueEmpty(iValue)) {
                    entries[key] = '';
                }
                else if (null !== iValue) {
                    if (typeof iValue === 'object') {
                        entries = { ...entries, ...buildQueryStringEntries(iValue, entries, key) };
                    }
                    else {
                        entries[key] = encodeURIComponent(iValue)
                            .replace(/%20/g, '+')
                            .replace(/%2C/g, ',');
                    }
                }
            });
            return entries;
        };
        const entries = buildQueryStringEntries(data);
        return Object.entries(entries)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    }
    function fromQueryString(search) {
        search = search.replace('?', '');
        if (search === '')
            return {};
        const insertDotNotatedValueIntoData = (key, value, data) => {
            const [first, second, ...rest] = key.split('.');
            if (!second) {
                data[key] = value;
                return value;
            }
            if (data[first] === undefined) {
                data[first] = Number.isNaN(Number.parseInt(second)) ? {} : [];
            }
            insertDotNotatedValueIntoData([second, ...rest].join('.'), value, data[first]);
        };
        const entries = search.split('&').map((i) => i.split('='));
        const data = {};
        entries.forEach(([key, value]) => {
            value = decodeURIComponent(value.replace(/\+/g, '%20'));
            if (!key.includes('[')) {
                data[key] = value;
            }
            else {
                if ('' === value)
                    return;
                const dotNotatedKey = key.replace(/\[/g, '.').replace(/]/g, '');
                insertDotNotatedValueIntoData(dotNotatedKey, value, data);
            }
        });
        return data;
    }
    class UrlUtils extends URL {
        has(key) {
            const data = this.getData();
            return Object.keys(data).includes(key);
        }
        set(key, value) {
            const data = this.getData();
            data[key] = value;
            this.setData(data);
        }
        get(key) {
            return this.getData()[key];
        }
        remove(key) {
            const data = this.getData();
            delete data[key];
            this.setData(data);
        }
        getData() {
            if (!this.search) {
                return {};
            }
            return fromQueryString(this.search);
        }
        setData(data) {
            this.search = toQueryString(data);
        }
    }
    class HistoryStrategy {
        static replace(url) {
            history.replaceState(history.state, '', url);
        }
    }
    
    class QueryStringPlugin {
        constructor(mapping) {
            this.mapping = mapping;
        }
        attachToComponent(component) {
            component.on('render:finished', (component) => {
                const urlUtils = new UrlUtils(window.location.href);
                const currentUrl = urlUtils.toString();
                Object.entries(this.mapping).forEach(([prop, mapping]) => {
                    const value = component.valueStore.get(prop);
                    urlUtils.set(mapping.name, value);
                });
                if (currentUrl !== urlUtils.toString()) {
                    HistoryStrategy.replace(urlUtils);
                }
            });
        }
    }
    
    class SetValueOntoModelFieldsPlugin {
        attachToComponent(component) {
            this.synchronizeValueOfModelFields(component);
            component.on('render:finished', () => {
                this.synchronizeValueOfModelFields(component);
            });
        }
        synchronizeValueOfModelFields(component) {
            component.element.querySelectorAll('[data-model]').forEach((element) => {
                if (!(element instanceof HTMLElement)) {
                    throw new Error('Invalid element using data-model.');
                }
                if (element instanceof HTMLFormElement) {
                    return;
                }
                if (!elementBelongsToThisComponent(element, component)) {
                    return;
                }
                const modelDirective = getModelDirectiveFromElement(element);
                if (!modelDirective) {
                    return;
                }
                const modelName = modelDirective.action;
                if (component.getUnsyncedModels().includes(modelName)) {
                    return;
                }
                if (component.valueStore.has(modelName)) {
                    setValueOnElement(element, component.valueStore.get(modelName));
                }
                if (element instanceof HTMLSelectElement && !element.multiple) {
                    component.valueStore.set(modelName, getValueFromElement(element, component.valueStore));
                }
            });
        }
    }
    
    class ValidatedFieldsPlugin {
        attachToComponent(component) {
            component.on('model:set', (modelName) => {
                this.handleModelSet(modelName, component.valueStore);
            });
        }
        handleModelSet(modelName, valueStore) {
            if (valueStore.has('validatedFields')) {
                const validatedFields = [...valueStore.get('validatedFields')];
                if (!validatedFields.includes(modelName)) {
                    validatedFields.push(modelName);
                }
                valueStore.set('validatedFields', validatedFields);
            }
        }
    }
    
    class LiveControllerDefault extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
        constructor() {
            super(...arguments);
            this.pendingActionTriggerModelElement = null;
            this.elementEventListeners = [
                { event: 'input', callback: (event) => this.handleInputEvent(event) },
                { event: 'change', callback: (event) => this.handleChangeEvent(event) },
            ];
            this.pendingFiles = {};
        }
        initialize() {
            this.mutationObserver = new MutationObserver(this.onMutations.bind(this));
            this.createComponent();
        }
        connect() {
            this.connectComponent();
            this.mutationObserver.observe(this.element, {
                attributes: true,
            });
        }
        disconnect() {
            this.disconnectComponent();
            this.mutationObserver.disconnect();
        }
        update(event) {
            if (event.type === 'input' || event.type === 'change') {
                throw new Error(`Since LiveComponents 2.3, you no longer need data-action="live#update" on form elements. Found on element: ${getElementAsTagText(event.currentTarget)}`);
            }
            this.updateModelFromElementEvent(event.currentTarget, null);
        }
        action(event) {
            const params = event.params;
            if (!params.action) {
                throw new Error(`No action name provided on element: ${getElementAsTagText(event.currentTarget)}. Did you forget to add the "data-live-action-param" attribute?`);
            }
            const rawAction = params.action;
            const actionArgs = { ...params };
            delete actionArgs.action;
            const directives = parseDirectives(rawAction);
            let debounce = false;
            directives.forEach((directive) => {
                let pendingFiles = {};
                const validModifiers = new Map();
                validModifiers.set('stop', () => {
                    event.stopPropagation();
                });
                validModifiers.set('self', () => {
                    if (event.target !== event.currentTarget) {
                        return;
                    }
                });
                validModifiers.set('debounce', (modifier) => {
                    debounce = modifier.value ? Number.parseInt(modifier.value) : true;
                });
                validModifiers.set('files', (modifier) => {
                    if (!modifier.value) {
                        pendingFiles = this.pendingFiles;
                    }
                    else if (this.pendingFiles[modifier.value]) {
                        pendingFiles[modifier.value] = this.pendingFiles[modifier.value];
                    }
                });
                directive.modifiers.forEach((modifier) => {
                    if (validModifiers.has(modifier.name)) {
                        const callable = validModifiers.get(modifier.name) ?? (() => { });
                        callable(modifier);
                        return;
                    }
                    console.warn(`Unknown modifier ${modifier.name} in action "${rawAction}". Available modifiers are: ${Array.from(validModifiers.keys()).join(', ')}.`);
                });
                for (const [key, input] of Object.entries(pendingFiles)) {
                    if (input.files) {
                        this.component.files(key, input);
                    }
                    delete this.pendingFiles[key];
                }
                this.component.action(directive.action, actionArgs, debounce);
                if (getModelDirectiveFromElement(event.currentTarget, false)) {
                    this.pendingActionTriggerModelElement = event.currentTarget;
                }
            });
        }
        $render() {
            return this.component.render();
        }
        emit(event) {
            this.getEmitDirectives(event).forEach(({ name, data, nameMatch }) => {
                this.component.emit(name, data, nameMatch);
            });
        }
        emitUp(event) {
            this.getEmitDirectives(event).forEach(({ name, data, nameMatch }) => {
                this.component.emitUp(name, data, nameMatch);
            });
        }
        emitSelf(event) {
            this.getEmitDirectives(event).forEach(({ name, data }) => {
                this.component.emitSelf(name, data);
            });
        }
        $updateModel(model, value, shouldRender = true, debounce = true) {
            return this.component.set(model, value, shouldRender, debounce);
        }
        propsUpdatedFromParentValueChanged() {
            this.component._updateFromParentProps(this.propsUpdatedFromParentValue);
        }
        fingerprintValueChanged() {
            this.component.fingerprint = this.fingerprintValue;
        }
        getEmitDirectives(event) {
            const params = event.params;
            if (!params.event) {
                throw new Error(`No event name provided on element: ${getElementAsTagText(event.currentTarget)}. Did you forget to add the "data-live-event-param" attribute?`);
            }
            const eventInfo = params.event;
            const eventArgs = { ...params };
            delete eventArgs.event;
            const directives = parseDirectives(eventInfo);
            const emits = [];
            directives.forEach((directive) => {
                let nameMatch = null;
                directive.modifiers.forEach((modifier) => {
                    switch (modifier.name) {
                        case 'name':
                            nameMatch = modifier.value;
                            break;
                        default:
                            throw new Error(`Unknown modifier ${modifier.name} in event "${eventInfo}".`);
                    }
                });
                emits.push({
                    name: directive.action,
                    data: eventArgs,
                    nameMatch,
                });
            });
            return emits;
        }
        createComponent() {
            const id = this.element.id || null;
            this.component = new Component(this.element, this.nameValue, this.propsValue, this.listenersValue, id, LiveControllerDefault.backendFactory(this), new StimulusElementDriver(this));
            this.proxiedComponent = proxifyComponent(this.component);
            Object.defineProperty(this.element, '__component', {
                value: this.proxiedComponent,
                writable: true,
            });
            if (this.hasDebounceValue) {
                this.component.defaultDebounce = this.debounceValue;
            }
            const plugins = [
                new LoadingPlugin(),
                new LazyPlugin(),
                new ValidatedFieldsPlugin(),
                new PageUnloadingPlugin(),
                new PollingPlugin(),
                new SetValueOntoModelFieldsPlugin(),
                new QueryStringPlugin(this.queryMappingValue),
                new ChildComponentPlugin(this.component),
            ];
            plugins.forEach((plugin) => {
                this.component.addPlugin(plugin);
            });
        }
        connectComponent() {
            this.component.connect();
            this.mutationObserver.observe(this.element, {
                attributes: true,
            });
            this.elementEventListeners.forEach(({ event, callback }) => {
                this.component.element.addEventListener(event, callback);
            });
            this.dispatchEvent('connect');
        }
        disconnectComponent() {
            this.component.disconnect();
            this.elementEventListeners.forEach(({ event, callback }) => {
                this.component.element.removeEventListener(event, callback);
            });
            this.dispatchEvent('disconnect');
        }
        handleInputEvent(event) {
            const target = event.target;
            if (!target) {
                return;
            }
            this.updateModelFromElementEvent(target, 'input');
        }
        handleChangeEvent(event) {
            const target = event.target;
            if (!target) {
                return;
            }
            this.updateModelFromElementEvent(target, 'change');
        }
        updateModelFromElementEvent(element, eventName) {
            if (!elementBelongsToThisComponent(element, this.component)) {
                return;
            }
            if (!(element instanceof HTMLElement)) {
                throw new Error('Could not update model for non HTMLElement');
            }
            if (element instanceof HTMLInputElement && element.type === 'file') {
                const key = element.name;
                if (element.files?.length) {
                    this.pendingFiles[key] = element;
                }
                else if (this.pendingFiles[key]) {
                    delete this.pendingFiles[key];
                }
            }
            const modelDirective = getModelDirectiveFromElement(element, false);
            if (!modelDirective) {
                return;
            }
            const modelBinding = getModelBinding(modelDirective);
            if (!modelBinding.targetEventName) {
                modelBinding.targetEventName = 'input';
            }
            if (this.pendingActionTriggerModelElement === element) {
                modelBinding.shouldRender = false;
            }
            if (eventName === 'change' && modelBinding.targetEventName === 'input') {
                modelBinding.targetEventName = 'change';
            }
            if (eventName && modelBinding.targetEventName !== eventName) {
                return;
            }
            if (false === modelBinding.debounce) {
                if (modelBinding.targetEventName === 'input') {
                    modelBinding.debounce = true;
                }
                else {
                    modelBinding.debounce = 0;
                }
            }
            const finalValue = getValueFromElement(element, this.component.valueStore);
            this.component.set(modelBinding.modelName, finalValue, modelBinding.shouldRender, modelBinding.debounce);
        }
        dispatchEvent(name, detail = {}, canBubble = true, cancelable = false) {
            detail.controller = this;
            detail.component = this.proxiedComponent;
            this.dispatch(name, { detail, prefix: 'live', cancelable, bubbles: canBubble });
        }
        onMutations(mutations) {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'id' &&
                    this.element.id !== this.component.id) {
                    this.disconnectComponent();
                    this.createComponent();
                    this.connectComponent();
                }
            });
        }
    }
    LiveControllerDefault.values = {
        name: String,
        url: String,
        props: { type: Object, default: {} },
        propsUpdatedFromParent: { type: Object, default: {} },
        listeners: { type: Array, default: [] },
        eventsToEmit: { type: Array, default: [] },
        eventsToDispatch: { type: Array, default: [] },
        debounce: { type: Number, default: 150 },
        fingerprint: { type: String, default: '' },
        requestMethod: { type: String, default: 'post' },
        queryMapping: { type: Object, default: {} },
    };
    LiveControllerDefault.backendFactory = (controller) => new Backend(controller.urlValue, controller.requestMethodValue);
    
    
    
    
    /***/ }),
    
    /***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
    /*!*********************************************************!*\
      !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   Alert: () => (/* binding */ Alert),
    /* harmony export */   Button: () => (/* binding */ Button),
    /* harmony export */   Carousel: () => (/* binding */ Carousel),
    /* harmony export */   Collapse: () => (/* binding */ Collapse),
    /* harmony export */   Dropdown: () => (/* binding */ Dropdown),
    /* harmony export */   Modal: () => (/* binding */ Modal),
    /* harmony export */   Offcanvas: () => (/* binding */ Offcanvas),
    /* harmony export */   Popover: () => (/* binding */ Popover),
    /* harmony export */   ScrollSpy: () => (/* binding */ ScrollSpy),
    /* harmony export */   Tab: () => (/* binding */ Tab),
    /* harmony export */   Toast: () => (/* binding */ Toast),
    /* harmony export */   Tooltip: () => (/* binding */ Tooltip)
    /* harmony export */ });
    /* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
    /* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
    /*!
      * Bootstrap v5.3.5 (https://getbootstrap.com/)
      * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */
    
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    /**
     * Constants
     */
    
    const elementMap = new Map();
    const Data = {
      set(element, key, instance) {
        if (!elementMap.has(element)) {
          elementMap.set(element, new Map());
        }
        const instanceMap = elementMap.get(element);
    
        // make it clear we only want one instance per element
        // can be removed later when multiple key/instances are fine to be used
        if (!instanceMap.has(key) && instanceMap.size !== 0) {
          // eslint-disable-next-line no-console
          console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
          return;
        }
        instanceMap.set(key, instance);
      },
      get(element, key) {
        if (elementMap.has(element)) {
          return elementMap.get(element).get(key) || null;
        }
        return null;
      },
      remove(element, key) {
        if (!elementMap.has(element)) {
          return;
        }
        const instanceMap = elementMap.get(element);
        instanceMap.delete(key);
    
        // free up element references if there are no instances left for an element
        if (instanceMap.size === 0) {
          elementMap.delete(element);
        }
      }
    };
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/index.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend';
    
    /**
     * Properly escape IDs selectors to handle weird IDs
     * @param {string} selector
     * @returns {string}
     */
    const parseSelector = selector => {
      if (selector && window.CSS && window.CSS.escape) {
        // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
        selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
      }
      return selector;
    };
    
    // Shout-out Angus Croll (https://goo.gl/pxwQGp)
    const toType = object => {
      if (object === null || object === undefined) {
        return `${object}`;
      }
      return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    
    /**
     * Public Util API
     */
    
    const getUID = prefix => {
      do {
        prefix += Math.floor(Math.random() * MAX_UID);
      } while (document.getElementById(prefix));
      return prefix;
    };
    const getTransitionDurationFromElement = element => {
      if (!element) {
        return 0;
      }
    
      // Get transition-duration of the element
      let {
        transitionDuration,
        transitionDelay
      } = window.getComputedStyle(element);
      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);
    
      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }
    
      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
    const triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = object => {
      if (!object || typeof object !== 'object') {
        return false;
      }
      if (typeof object.jquery !== 'undefined') {
        object = object[0];
      }
      return typeof object.nodeType !== 'undefined';
    };
    const getElement = object => {
      // it's a jQuery object or a node element
      if (isElement(object)) {
        return object.jquery ? object[0] : object;
      }
      if (typeof object === 'string' && object.length > 0) {
        return document.querySelector(parseSelector(object));
      }
      return null;
    };
    const isVisible = element => {
      if (!isElement(element) || element.getClientRects().length === 0) {
        return false;
      }
      const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
      // Handle `details` element as its content may falsie appear visible when it is closed
      const closedDetails = element.closest('details:not([open])');
      if (!closedDetails) {
        return elementIsVisible;
      }
      if (closedDetails !== element) {
        const summary = element.closest('summary');
        if (summary && summary.parentNode !== closedDetails) {
          return false;
        }
        if (summary === null) {
          return false;
        }
      }
      return elementIsVisible;
    };
    const isDisabled = element => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }
      if (element.classList.contains('disabled')) {
        return true;
      }
      if (typeof element.disabled !== 'undefined') {
        return element.disabled;
      }
      return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    const findShadowRoot = element => {
      if (!document.documentElement.attachShadow) {
        return null;
      }
    
      // Can find the shadow root otherwise it'll return the document
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }
      if (element instanceof ShadowRoot) {
        return element;
      }
    
      // when we don't find a shadow root
      if (!element.parentNode) {
        return null;
      }
      return findShadowRoot(element.parentNode);
    };
    const noop = () => {};
    
    /**
     * Trick to restart an element's animation
     *
     * @param {HTMLElement} element
     * @return void
     *
     * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
     */
    const reflow = element => {
      element.offsetHeight; // eslint-disable-line no-unused-expressions
    };
    const getjQuery = () => {
      if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
        return window.jQuery;
      }
      return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = callback => {
      if (document.readyState === 'loading') {
        // add listener on the first call when the document is in loading state
        if (!DOMContentLoadedCallbacks.length) {
          document.addEventListener('DOMContentLoaded', () => {
            for (const callback of DOMContentLoadedCallbacks) {
              callback();
            }
          });
        }
        DOMContentLoadedCallbacks.push(callback);
      } else {
        callback();
      }
    };
    const isRTL = () => document.documentElement.dir === 'rtl';
    const defineJQueryPlugin = plugin => {
      onDOMContentLoaded(() => {
        const $ = getjQuery();
        /* istanbul ignore if */
        if ($) {
          const name = plugin.NAME;
          const JQUERY_NO_CONFLICT = $.fn[name];
          $.fn[name] = plugin.jQueryInterface;
          $.fn[name].Constructor = plugin;
          $.fn[name].noConflict = () => {
            $.fn[name] = JQUERY_NO_CONFLICT;
            return plugin.jQueryInterface;
          };
        }
      });
    };
    const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
      return typeof possibleCallback === 'function' ? possibleCallback.call(...args) : defaultValue;
    };
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
      if (!waitForTransition) {
        execute(callback);
        return;
      }
      const durationPadding = 5;
      const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
      let called = false;
      const handler = ({
        target
      }) => {
        if (target !== transitionElement) {
          return;
        }
        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
      };
      transitionElement.addEventListener(TRANSITION_END, handler);
      setTimeout(() => {
        if (!called) {
          triggerTransitionEnd(transitionElement);
        }
      }, emulatedDuration);
    };
    
    /**
     * Return the previous/next element of a list.
     *
     * @param {array} list    The list of elements
     * @param activeElement   The active element
     * @param shouldGetNext   Choose to get next or previous element
     * @param isCycleAllowed
     * @return {Element|elem} The proper element
     */
    const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
      const listLength = list.length;
      let index = list.indexOf(activeElement);
    
      // if the element does not exist in the list return an element
      // depending on the direction and if cycle is allowed
      if (index === -1) {
        return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
      }
      index += shouldGetNext ? 1 : -1;
      if (isCycleAllowed) {
        index = (index + listLength) % listLength;
      }
      return list[Math.max(0, Math.min(index, listLength - 1))];
    };
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
    let uidEvent = 1;
    const customEvents = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
    const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
    
    /**
     * Private methods
     */
    
    function makeEventUid(element, uid) {
      return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
    function getElementEvents(element) {
      const uid = makeEventUid(element);
      element.uidEvent = uid;
      eventRegistry[uid] = eventRegistry[uid] || {};
      return eventRegistry[uid];
    }
    function bootstrapHandler(element, fn) {
      return function handler(event) {
        hydrateObj(event, {
          delegateTarget: element
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, fn);
        }
        return fn.apply(element, [event]);
      };
    }
    function bootstrapDelegationHandler(element, selector, fn) {
      return function handler(event) {
        const domElements = element.querySelectorAll(selector);
        for (let {
          target
        } = event; target && target !== this; target = target.parentNode) {
          for (const domElement of domElements) {
            if (domElement !== target) {
              continue;
            }
            hydrateObj(event, {
              delegateTarget: target
            });
            if (handler.oneOff) {
              EventHandler.off(element, event.type, selector, fn);
            }
            return fn.apply(target, [event]);
          }
        }
      };
    }
    function findHandler(events, callable, delegationSelector = null) {
      return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
    }
    function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
      const isDelegated = typeof handler === 'string';
      // TODO: tooltip passes `false` instead of selector, so we need to check
      const callable = isDelegated ? delegationFunction : handler || delegationFunction;
      let typeEvent = getTypeEvent(originalTypeEvent);
      if (!nativeEvents.has(typeEvent)) {
        typeEvent = originalTypeEvent;
      }
      return [isDelegated, callable, typeEvent];
    }
    function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
      let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    
      // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
      // this prevents the handler from being dispatched the same way as mouseover or mouseout does
      if (originalTypeEvent in customEvents) {
        const wrapFunction = fn => {
          return function (event) {
            if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
              return fn.call(this, event);
            }
          };
        };
        callable = wrapFunction(callable);
      }
      const events = getElementEvents(element);
      const handlers = events[typeEvent] || (events[typeEvent] = {});
      const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
      if (previousFunction) {
        previousFunction.oneOff = previousFunction.oneOff && oneOff;
        return;
      }
      const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
      const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
      fn.delegationSelector = isDelegated ? handler : null;
      fn.callable = callable;
      fn.oneOff = oneOff;
      fn.uidEvent = uid;
      handlers[uid] = fn;
      element.addEventListener(typeEvent, fn, isDelegated);
    }
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
      const fn = findHandler(events[typeEvent], handler, delegationSelector);
      if (!fn) {
        return;
      }
      element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
      delete events[typeEvent][fn.uidEvent];
    }
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
      const storeElementEvent = events[typeEvent] || {};
      for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
        if (handlerKey.includes(namespace)) {
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    }
    function getTypeEvent(event) {
      // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
      event = event.replace(stripNameRegex, '');
      return customEvents[event] || event;
    }
    const EventHandler = {
      on(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, false);
      },
      one(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, true);
      },
      off(element, originalTypeEvent, handler, delegationFunction) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return;
        }
        const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getElementEvents(element);
        const storeElementEvent = events[typeEvent] || {};
        const isNamespace = originalTypeEvent.startsWith('.');
        if (typeof callable !== 'undefined') {
          // Simplest case: handler is passed, remove that listener ONLY.
          if (!Object.keys(storeElementEvent).length) {
            return;
          }
          removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
          return;
        }
        if (isNamespace) {
          for (const elementEvent of Object.keys(events)) {
            removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
          }
        }
        for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
          const handlerKey = keyHandlers.replace(stripUidRegex, '');
          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
          }
        }
      },
      trigger(element, event, args) {
        if (typeof event !== 'string' || !element) {
          return null;
        }
        const $ = getjQuery();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        let jQueryEvent = null;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;
        if (inNamespace && $) {
          jQueryEvent = $.Event(event, args);
          $(element).trigger(jQueryEvent);
          bubbles = !jQueryEvent.isPropagationStopped();
          nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
          defaultPrevented = jQueryEvent.isDefaultPrevented();
        }
        const evt = hydrateObj(new Event(event, {
          bubbles,
          cancelable: true
        }), args);
        if (defaultPrevented) {
          evt.preventDefault();
        }
        if (nativeDispatch) {
          element.dispatchEvent(evt);
        }
        if (evt.defaultPrevented && jQueryEvent) {
          jQueryEvent.preventDefault();
        }
        return evt;
      }
    };
    function hydrateObj(obj, meta = {}) {
      for (const [key, value] of Object.entries(meta)) {
        try {
          obj[key] = value;
        } catch (_unused) {
          Object.defineProperty(obj, key, {
            configurable: true,
            get() {
              return value;
            }
          });
        }
      }
      return obj;
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/manipulator.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    function normalizeData(value) {
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      if (value === Number(value).toString()) {
        return Number(value);
      }
      if (value === '' || value === 'null') {
        return null;
      }
      if (typeof value !== 'string') {
        return value;
      }
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (_unused) {
        return value;
      }
    }
    function normalizeDataKey(key) {
      return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    }
    const Manipulator = {
      setDataAttribute(element, key, value) {
        element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
      },
      removeDataAttribute(element, key) {
        element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
      },
      getDataAttributes(element) {
        if (!element) {
          return {};
        }
        const attributes = {};
        const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
        for (const key of bsKeys) {
          let pureKey = key.replace(/^bs/, '');
          pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
          attributes[pureKey] = normalizeData(element.dataset[key]);
        }
        return attributes;
      },
      getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
      }
    };
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/config.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Class definition
     */
    
    class Config {
      // Getters
      static get Default() {
        return {};
      }
      static get DefaultType() {
        return {};
      }
      static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
      }
      _getConfig(config) {
        config = this._mergeConfigObj(config);
        config = this._configAfterMerge(config);
        this._typeCheckConfig(config);
        return config;
      }
      _configAfterMerge(config) {
        return config;
      }
      _mergeConfigObj(config, element) {
        const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse
    
        return {
          ...this.constructor.Default,
          ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
          ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
          ...(typeof config === 'object' ? config : {})
        };
      }
      _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
        for (const [property, expectedTypes] of Object.entries(configTypes)) {
          const value = config[property];
          const valueType = isElement(value) ? 'element' : toType(value);
          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
          }
        }
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const VERSION = '5.3.5';
    
    /**
     * Class definition
     */
    
    class BaseComponent extends Config {
      constructor(element, config) {
        super();
        element = getElement(element);
        if (!element) {
          return;
        }
        this._element = element;
        this._config = this._getConfig(config);
        Data.set(this._element, this.constructor.DATA_KEY, this);
      }
    
      // Public
      dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);
        for (const propertyName of Object.getOwnPropertyNames(this)) {
          this[propertyName] = null;
        }
      }
      _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
      }
      _getConfig(config) {
        config = this._mergeConfigObj(config, this._element);
        config = this._configAfterMerge(config);
        this._typeCheckConfig(config);
        return config;
      }
    
      // Static
      static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
      }
      static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
      }
      static get VERSION() {
        return VERSION;
      }
      static get DATA_KEY() {
        return `bs.${this.NAME}`;
      }
      static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
      }
      static eventName(name) {
        return `${name}${this.EVENT_KEY}`;
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    const getSelector = element => {
      let selector = element.getAttribute('data-bs-target');
      if (!selector || selector === '#') {
        let hrefAttribute = element.getAttribute('href');
    
        // The only valid content that could double as a selector are IDs or classes,
        // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
        // `document.querySelector` will rightfully complain it is invalid.
        // See https://github.com/twbs/bootstrap/issues/32273
        if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
          return null;
        }
    
        // Just in case some CMS puts out a full URL with the anchor appended
        if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
          hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
        }
        selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
      }
      return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
    };
    const SelectorEngine = {
      find(selector, element = document.documentElement) {
        return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
      },
      findOne(selector, element = document.documentElement) {
        return Element.prototype.querySelector.call(element, selector);
      },
      children(element, selector) {
        return [].concat(...element.children).filter(child => child.matches(selector));
      },
      parents(element, selector) {
        const parents = [];
        let ancestor = element.parentNode.closest(selector);
        while (ancestor) {
          parents.push(ancestor);
          ancestor = ancestor.parentNode.closest(selector);
        }
        return parents;
      },
      prev(element, selector) {
        let previous = element.previousElementSibling;
        while (previous) {
          if (previous.matches(selector)) {
            return [previous];
          }
          previous = previous.previousElementSibling;
        }
        return [];
      },
      // TODO: this is now unused; remove later along with prev()
      next(element, selector) {
        let next = element.nextElementSibling;
        while (next) {
          if (next.matches(selector)) {
            return [next];
          }
          next = next.nextElementSibling;
        }
        return [];
      },
      focusableChildren(element) {
        const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
        return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
      },
      getSelectorFromElement(element) {
        const selector = getSelector(element);
        if (selector) {
          return SelectorEngine.findOne(selector) ? selector : null;
        }
        return null;
      },
      getElementFromSelector(element) {
        const selector = getSelector(element);
        return selector ? SelectorEngine.findOne(selector) : null;
      },
      getMultipleElementsFromSelector(element) {
        const selector = getSelector(element);
        return selector ? SelectorEngine.find(selector) : [];
      }
    };
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/component-functions.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    const enableDismissTrigger = (component, method = 'hide') => {
      const clickEvent = `click.dismiss${component.EVENT_KEY}`;
      const name = component.NAME;
      EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }
        if (isDisabled(this)) {
          return;
        }
        const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
        const instance = component.getOrCreateInstance(target);
    
        // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
        instance[method]();
      });
    };
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap alert.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$f = 'alert';
    const DATA_KEY$a = 'bs.alert';
    const EVENT_KEY$b = `.${DATA_KEY$a}`;
    const EVENT_CLOSE = `close${EVENT_KEY$b}`;
    const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
    const CLASS_NAME_FADE$5 = 'fade';
    const CLASS_NAME_SHOW$8 = 'show';
    
    /**
     * Class definition
     */
    
    class Alert extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$f;
      }
    
      // Public
      close() {
        const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
        if (closeEvent.defaultPrevented) {
          return;
        }
        this._element.classList.remove(CLASS_NAME_SHOW$8);
        const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
        this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
      }
    
      // Private
      _destroyElement() {
        this._element.remove();
        EventHandler.trigger(this._element, EVENT_CLOSED);
        this.dispose();
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Alert.getOrCreateInstance(this);
          if (typeof config !== 'string') {
            return;
          }
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    enableDismissTrigger(Alert, 'close');
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Alert);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap button.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$e = 'button';
    const DATA_KEY$9 = 'bs.button';
    const EVENT_KEY$a = `.${DATA_KEY$9}`;
    const DATA_API_KEY$6 = '.data-api';
    const CLASS_NAME_ACTIVE$3 = 'active';
    const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
    
    /**
     * Class definition
     */
    
    class Button extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$e;
      }
    
      // Public
      toggle() {
        // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
        this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Button.getOrCreateInstance(this);
          if (config === 'toggle') {
            data[config]();
          }
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
      event.preventDefault();
      const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
      const data = Button.getOrCreateInstance(button);
      data.toggle();
    });
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Button);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/swipe.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$d = 'swipe';
    const EVENT_KEY$9 = '.bs.swipe';
    const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
    const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
    const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
    const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
    const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
    const POINTER_TYPE_TOUCH = 'touch';
    const POINTER_TYPE_PEN = 'pen';
    const CLASS_NAME_POINTER_EVENT = 'pointer-event';
    const SWIPE_THRESHOLD = 40;
    const Default$c = {
      endCallback: null,
      leftCallback: null,
      rightCallback: null
    };
    const DefaultType$c = {
      endCallback: '(function|null)',
      leftCallback: '(function|null)',
      rightCallback: '(function|null)'
    };
    
    /**
     * Class definition
     */
    
    class Swipe extends Config {
      constructor(element, config) {
        super();
        this._element = element;
        if (!element || !Swipe.isSupported()) {
          return;
        }
        this._config = this._getConfig(config);
        this._deltaX = 0;
        this._supportPointerEvents = Boolean(window.PointerEvent);
        this._initEvents();
      }
    
      // Getters
      static get Default() {
        return Default$c;
      }
      static get DefaultType() {
        return DefaultType$c;
      }
      static get NAME() {
        return NAME$d;
      }
    
      // Public
      dispose() {
        EventHandler.off(this._element, EVENT_KEY$9);
      }
    
      // Private
      _start(event) {
        if (!this._supportPointerEvents) {
          this._deltaX = event.touches[0].clientX;
          return;
        }
        if (this._eventIsPointerPenTouch(event)) {
          this._deltaX = event.clientX;
        }
      }
      _end(event) {
        if (this._eventIsPointerPenTouch(event)) {
          this._deltaX = event.clientX - this._deltaX;
        }
        this._handleSwipe();
        execute(this._config.endCallback);
      }
      _move(event) {
        this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
      }
      _handleSwipe() {
        const absDeltaX = Math.abs(this._deltaX);
        if (absDeltaX <= SWIPE_THRESHOLD) {
          return;
        }
        const direction = absDeltaX / this._deltaX;
        this._deltaX = 0;
        if (!direction) {
          return;
        }
        execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
      }
      _initEvents() {
        if (this._supportPointerEvents) {
          EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
          EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
          this._element.classList.add(CLASS_NAME_POINTER_EVENT);
        } else {
          EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
          EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
          EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
        }
      }
      _eventIsPointerPenTouch(event) {
        return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
      }
    
      // Static
      static isSupported() {
        return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap carousel.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$c = 'carousel';
    const DATA_KEY$8 = 'bs.carousel';
    const EVENT_KEY$8 = `.${DATA_KEY$8}`;
    const DATA_API_KEY$5 = '.data-api';
    const ARROW_LEFT_KEY$1 = 'ArrowLeft';
    const ARROW_RIGHT_KEY$1 = 'ArrowRight';
    const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
    
    const ORDER_NEXT = 'next';
    const ORDER_PREV = 'prev';
    const DIRECTION_LEFT = 'left';
    const DIRECTION_RIGHT = 'right';
    const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
    const EVENT_SLID = `slid${EVENT_KEY$8}`;
    const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
    const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
    const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
    const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
    const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
    const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
    const CLASS_NAME_CAROUSEL = 'carousel';
    const CLASS_NAME_ACTIVE$2 = 'active';
    const CLASS_NAME_SLIDE = 'slide';
    const CLASS_NAME_END = 'carousel-item-end';
    const CLASS_NAME_START = 'carousel-item-start';
    const CLASS_NAME_NEXT = 'carousel-item-next';
    const CLASS_NAME_PREV = 'carousel-item-prev';
    const SELECTOR_ACTIVE = '.active';
    const SELECTOR_ITEM = '.carousel-item';
    const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
    const SELECTOR_ITEM_IMG = '.carousel-item img';
    const SELECTOR_INDICATORS = '.carousel-indicators';
    const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
    const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
    const KEY_TO_DIRECTION = {
      [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
      [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
    };
    const Default$b = {
      interval: 5000,
      keyboard: true,
      pause: 'hover',
      ride: false,
      touch: true,
      wrap: true
    };
    const DefaultType$b = {
      interval: '(number|boolean)',
      // TODO:v6 remove boolean support
      keyboard: 'boolean',
      pause: '(string|boolean)',
      ride: '(boolean|string)',
      touch: 'boolean',
      wrap: 'boolean'
    };
    
    /**
     * Class definition
     */
    
    class Carousel extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._interval = null;
        this._activeElement = null;
        this._isSliding = false;
        this.touchTimeout = null;
        this._swipeHelper = null;
        this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
        this._addEventListeners();
        if (this._config.ride === CLASS_NAME_CAROUSEL) {
          this.cycle();
        }
      }
    
      // Getters
      static get Default() {
        return Default$b;
      }
      static get DefaultType() {
        return DefaultType$b;
      }
      static get NAME() {
        return NAME$c;
      }
    
      // Public
      next() {
        this._slide(ORDER_NEXT);
      }
      nextWhenVisible() {
        // FIXME TODO use `document.visibilityState`
        // Don't call next when the page isn't visible
        // or the carousel or its parent isn't visible
        if (!document.hidden && isVisible(this._element)) {
          this.next();
        }
      }
      prev() {
        this._slide(ORDER_PREV);
      }
      pause() {
        if (this._isSliding) {
          triggerTransitionEnd(this._element);
        }
        this._clearInterval();
      }
      cycle() {
        this._clearInterval();
        this._updateInterval();
        this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
      }
      _maybeEnableCycle() {
        if (!this._config.ride) {
          return;
        }
        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
          return;
        }
        this.cycle();
      }
      to(index) {
        const items = this._getItems();
        if (index > items.length - 1 || index < 0) {
          return;
        }
        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
          return;
        }
        const activeIndex = this._getItemIndex(this._getActive());
        if (activeIndex === index) {
          return;
        }
        const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
        this._slide(order, items[index]);
      }
      dispose() {
        if (this._swipeHelper) {
          this._swipeHelper.dispose();
        }
        super.dispose();
      }
    
      // Private
      _configAfterMerge(config) {
        config.defaultInterval = config.interval;
        return config;
      }
      _addEventListeners() {
        if (this._config.keyboard) {
          EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
        }
        if (this._config.pause === 'hover') {
          EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
          EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
        }
        if (this._config.touch && Swipe.isSupported()) {
          this._addTouchEventListeners();
        }
      }
      _addTouchEventListeners() {
        for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
          EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
        }
        const endCallBack = () => {
          if (this._config.pause !== 'hover') {
            return;
          }
    
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
    
          this.pause();
          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }
          this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        };
        const swipeConfig = {
          leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
          rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
          endCallback: endCallBack
        };
        this._swipeHelper = new Swipe(this._element, swipeConfig);
      }
      _keydown(event) {
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }
        const direction = KEY_TO_DIRECTION[event.key];
        if (direction) {
          event.preventDefault();
          this._slide(this._directionToOrder(direction));
        }
      }
      _getItemIndex(element) {
        return this._getItems().indexOf(element);
      }
      _setActiveIndicatorElement(index) {
        if (!this._indicatorsElement) {
          return;
        }
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
        if (newActiveIndicator) {
          newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
          newActiveIndicator.setAttribute('aria-current', 'true');
        }
      }
      _updateInterval() {
        const element = this._activeElement || this._getActive();
        if (!element) {
          return;
        }
        const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
        this._config.interval = elementInterval || this._config.defaultInterval;
      }
      _slide(order, element = null) {
        if (this._isSliding) {
          return;
        }
        const activeElement = this._getActive();
        const isNext = order === ORDER_NEXT;
        const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
        if (nextElement === activeElement) {
          return;
        }
        const nextElementIndex = this._getItemIndex(nextElement);
        const triggerEvent = eventName => {
          return EventHandler.trigger(this._element, eventName, {
            relatedTarget: nextElement,
            direction: this._orderToDirection(order),
            from: this._getItemIndex(activeElement),
            to: nextElementIndex
          });
        };
        const slideEvent = triggerEvent(EVENT_SLIDE);
        if (slideEvent.defaultPrevented) {
          return;
        }
        if (!activeElement || !nextElement) {
          // Some weirdness is happening, so we bail
          // TODO: change tests that use empty divs to avoid this check
          return;
        }
        const isCycling = Boolean(this._interval);
        this.pause();
        this._isSliding = true;
        this._setActiveIndicatorElement(nextElementIndex);
        this._activeElement = nextElement;
        const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
        const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);
        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          triggerEvent(EVENT_SLID);
        };
        this._queueCallback(completeCallBack, activeElement, this._isAnimated());
        if (isCycling) {
          this.cycle();
        }
      }
      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_SLIDE);
      }
      _getActive() {
        return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
      }
      _getItems() {
        return SelectorEngine.find(SELECTOR_ITEM, this._element);
      }
      _clearInterval() {
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }
      }
      _directionToOrder(direction) {
        if (isRTL()) {
          return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
        }
        return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
      }
      _orderToDirection(order) {
        if (isRTL()) {
          return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Carousel.getOrCreateInstance(this, config);
          if (typeof config === 'number') {
            data.to(config);
            return;
          }
          if (typeof config === 'string') {
            if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          }
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
      const target = SelectorEngine.getElementFromSelector(this);
      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }
      event.preventDefault();
      const carousel = Carousel.getOrCreateInstance(target);
      const slideIndex = this.getAttribute('data-bs-slide-to');
      if (slideIndex) {
        carousel.to(slideIndex);
        carousel._maybeEnableCycle();
        return;
      }
      if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
        carousel.next();
        carousel._maybeEnableCycle();
        return;
      }
      carousel.prev();
      carousel._maybeEnableCycle();
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
      const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
      for (const carousel of carousels) {
        Carousel.getOrCreateInstance(carousel);
      }
    });
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Carousel);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$b = 'collapse';
    const DATA_KEY$7 = 'bs.collapse';
    const EVENT_KEY$7 = `.${DATA_KEY$7}`;
    const DATA_API_KEY$4 = '.data-api';
    const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
    const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
    const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
    const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
    const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
    const CLASS_NAME_SHOW$7 = 'show';
    const CLASS_NAME_COLLAPSE = 'collapse';
    const CLASS_NAME_COLLAPSING = 'collapsing';
    const CLASS_NAME_COLLAPSED = 'collapsed';
    const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
    const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
    const WIDTH = 'width';
    const HEIGHT = 'height';
    const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
    const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
    const Default$a = {
      parent: null,
      toggle: true
    };
    const DefaultType$a = {
      parent: '(null|element)',
      toggle: 'boolean'
    };
    
    /**
     * Class definition
     */
    
    class Collapse extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._isTransitioning = false;
        this._triggerArray = [];
        const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
        for (const elem of toggleList) {
          const selector = SelectorEngine.getSelectorFromElement(elem);
          const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
          if (selector !== null && filterElement.length) {
            this._triggerArray.push(elem);
          }
        }
        this._initializeChildren();
        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
        }
        if (this._config.toggle) {
          this.toggle();
        }
      }
    
      // Getters
      static get Default() {
        return Default$a;
      }
      static get DefaultType() {
        return DefaultType$a;
      }
      static get NAME() {
        return NAME$b;
      }
    
      // Public
      toggle() {
        if (this._isShown()) {
          this.hide();
        } else {
          this.show();
        }
      }
      show() {
        if (this._isTransitioning || this._isShown()) {
          return;
        }
        let activeChildren = [];
    
        // find active children
        if (this._config.parent) {
          activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
            toggle: false
          }));
        }
        if (activeChildren.length && activeChildren[0]._isTransitioning) {
          return;
        }
        const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
        if (startEvent.defaultPrevented) {
          return;
        }
        for (const activeInstance of activeChildren) {
          activeInstance.hide();
        }
        const dimension = this._getDimension();
        this._element.classList.remove(CLASS_NAME_COLLAPSE);
        this._element.classList.add(CLASS_NAME_COLLAPSING);
        this._element.style[dimension] = 0;
        this._addAriaAndCollapsedClass(this._triggerArray, true);
        this._isTransitioning = true;
        const complete = () => {
          this._isTransitioning = false;
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
          this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
          this._element.style[dimension] = '';
          EventHandler.trigger(this._element, EVENT_SHOWN$6);
        };
        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;
        this._queueCallback(complete, this._element, true);
        this._element.style[dimension] = `${this._element[scrollSize]}px`;
      }
      hide() {
        if (this._isTransitioning || !this._isShown()) {
          return;
        }
        const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
        if (startEvent.defaultPrevented) {
          return;
        }
        const dimension = this._getDimension();
        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
        reflow(this._element);
        this._element.classList.add(CLASS_NAME_COLLAPSING);
        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
        for (const trigger of this._triggerArray) {
          const element = SelectorEngine.getElementFromSelector(trigger);
          if (element && !this._isShown(element)) {
            this._addAriaAndCollapsedClass([trigger], false);
          }
        }
        this._isTransitioning = true;
        const complete = () => {
          this._isTransitioning = false;
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
          this._element.classList.add(CLASS_NAME_COLLAPSE);
          EventHandler.trigger(this._element, EVENT_HIDDEN$6);
        };
        this._element.style[dimension] = '';
        this._queueCallback(complete, this._element, true);
      }
      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$7);
      }
    
      // Private
      _configAfterMerge(config) {
        config.toggle = Boolean(config.toggle); // Coerce string values
        config.parent = getElement(config.parent);
        return config;
      }
      _getDimension() {
        return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
      }
      _initializeChildren() {
        if (!this._config.parent) {
          return;
        }
        const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
        for (const element of children) {
          const selected = SelectorEngine.getElementFromSelector(element);
          if (selected) {
            this._addAriaAndCollapsedClass([element], this._isShown(selected));
          }
        }
      }
      _getFirstLevelChildren(selector) {
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
        // remove children if greater depth
        return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
      }
      _addAriaAndCollapsedClass(triggerArray, isOpen) {
        if (!triggerArray.length) {
          return;
        }
        for (const element of triggerArray) {
          element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
          element.setAttribute('aria-expanded', isOpen);
        }
      }
    
      // Static
      static jQueryInterface(config) {
        const _config = {};
        if (typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }
        return this.each(function () {
          const data = Collapse.getOrCreateInstance(this, _config);
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          }
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
        event.preventDefault();
      }
      for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
        Collapse.getOrCreateInstance(element, {
          toggle: false
        }).toggle();
      }
    });
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Collapse);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap dropdown.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$a = 'dropdown';
    const DATA_KEY$6 = 'bs.dropdown';
    const EVENT_KEY$6 = `.${DATA_KEY$6}`;
    const DATA_API_KEY$3 = '.data-api';
    const ESCAPE_KEY$2 = 'Escape';
    const TAB_KEY$1 = 'Tab';
    const ARROW_UP_KEY$1 = 'ArrowUp';
    const ARROW_DOWN_KEY$1 = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button
    
    const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
    const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
    const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
    const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
    const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const CLASS_NAME_SHOW$6 = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
    const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
    const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
    const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR = '.navbar';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const PLACEMENT_TOPCENTER = 'top';
    const PLACEMENT_BOTTOMCENTER = 'bottom';
    const Default$9 = {
      autoClose: true,
      boundary: 'clippingParents',
      display: 'dynamic',
      offset: [0, 2],
      popperConfig: null,
      reference: 'toggle'
    };
    const DefaultType$9 = {
      autoClose: '(boolean|string)',
      boundary: '(string|element)',
      display: 'string',
      offset: '(array|string|function)',
      popperConfig: '(null|object|function)',
      reference: '(string|element|object)'
    };
    
    /**
     * Class definition
     */
    
    class Dropdown extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._popper = null;
        this._parent = this._element.parentNode; // dropdown wrapper
        // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
        this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
        this._inNavbar = this._detectNavbar();
      }
    
      // Getters
      static get Default() {
        return Default$9;
      }
      static get DefaultType() {
        return DefaultType$9;
      }
      static get NAME() {
        return NAME$a;
      }
    
      // Public
      toggle() {
        return this._isShown() ? this.hide() : this.show();
      }
      show() {
        if (isDisabled(this._element) || this._isShown()) {
          return;
        }
        const relatedTarget = {
          relatedTarget: this._element
        };
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
        if (showEvent.defaultPrevented) {
          return;
        }
        this._createPopper();
    
        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.on(element, 'mouseover', noop);
          }
        }
        this._element.focus();
        this._element.setAttribute('aria-expanded', true);
        this._menu.classList.add(CLASS_NAME_SHOW$6);
        this._element.classList.add(CLASS_NAME_SHOW$6);
        EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
      }
      hide() {
        if (isDisabled(this._element) || !this._isShown()) {
          return;
        }
        const relatedTarget = {
          relatedTarget: this._element
        };
        this._completeHide(relatedTarget);
      }
      dispose() {
        if (this._popper) {
          this._popper.destroy();
        }
        super.dispose();
      }
      update() {
        this._inNavbar = this._detectNavbar();
        if (this._popper) {
          this._popper.update();
        }
      }
    
      // Private
      _completeHide(relatedTarget) {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
        if (hideEvent.defaultPrevented) {
          return;
        }
    
        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.off(element, 'mouseover', noop);
          }
        }
        if (this._popper) {
          this._popper.destroy();
        }
        this._menu.classList.remove(CLASS_NAME_SHOW$6);
        this._element.classList.remove(CLASS_NAME_SHOW$6);
        this._element.setAttribute('aria-expanded', 'false');
        Manipulator.removeDataAttribute(this._menu, 'popper');
        EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
      }
      _getConfig(config) {
        config = super._getConfig(config);
        if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
          // Popper virtual elements require a getBoundingClientRect method
          throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }
        return config;
      }
      _createPopper() {
        if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org/docs/v2/)');
        }
        let referenceElement = this._element;
        if (this._config.reference === 'parent') {
          referenceElement = this._parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }
        const popperConfig = this._getPopperConfig();
        this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
      }
      _isShown() {
        return this._menu.classList.contains(CLASS_NAME_SHOW$6);
      }
      _getPlacement() {
        const parentDropdown = this._parent;
        if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
          return PLACEMENT_RIGHT;
        }
        if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
          return PLACEMENT_LEFT;
        }
        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
          return PLACEMENT_TOPCENTER;
        }
        if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
          return PLACEMENT_BOTTOMCENTER;
        }
    
        // We need to trim the value because custom properties can also include spaces
        const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
          return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }
        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
      }
      _detectNavbar() {
        return this._element.closest(SELECTOR_NAVBAR) !== null;
      }
      _getOffset() {
        const {
          offset
        } = this._config;
        if (typeof offset === 'string') {
          return offset.split(',').map(value => Number.parseInt(value, 10));
        }
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
        return offset;
      }
      _getPopperConfig() {
        const defaultBsPopperConfig = {
          placement: this._getPlacement(),
          modifiers: [{
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }]
        };
    
        // Disable Popper if we have a static display or Dropdown is in Navbar
        if (this._inNavbar || this._config.display === 'static') {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
          defaultBsPopperConfig.modifiers = [{
            name: 'applyStyles',
            enabled: false
          }];
        }
        return {
          ...defaultBsPopperConfig,
          ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
        };
      }
      _selectMenuItem({
        key,
        target
      }) {
        const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
        if (!items.length) {
          return;
        }
    
        // if target isn't included in items (e.g. when expanding the dropdown)
        // allow cycling to get the last item in case key equals ARROW_UP_KEY
        getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Dropdown.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        });
      }
      static clearMenus(event) {
        if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
          return;
        }
        const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
        for (const toggle of openToggles) {
          const context = Dropdown.getInstance(toggle);
          if (!context || context._config.autoClose === false) {
            continue;
          }
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);
          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          }
    
          // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }
          const relatedTarget = {
            relatedTarget: context._element
          };
          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
          context._completeHide(relatedTarget);
        }
      }
      static dataApiKeydownHandler(event) {
        // If not an UP | DOWN | ESCAPE key => not a dropdown command
        // If input/textarea && if key is other than ESCAPE => not a dropdown command
    
        const isInput = /input|textarea/i.test(event.target.tagName);
        const isEscapeEvent = event.key === ESCAPE_KEY$2;
        const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
        if (!isUpOrDownEvent && !isEscapeEvent) {
          return;
        }
        if (isInput && !isEscapeEvent) {
          return;
        }
        event.preventDefault();
    
        // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
        const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
        const instance = Dropdown.getOrCreateInstance(getToggleButton);
        if (isUpOrDownEvent) {
          event.stopPropagation();
          instance.show();
          instance._selectMenuItem(event);
          return;
        }
        if (instance._isShown()) {
          // else is escape and we check if it is shown
          event.stopPropagation();
          instance.hide();
          getToggleButton.focus();
        }
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
      event.preventDefault();
      Dropdown.getOrCreateInstance(this).toggle();
    });
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Dropdown);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/backdrop.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$9 = 'backdrop';
    const CLASS_NAME_FADE$4 = 'fade';
    const CLASS_NAME_SHOW$5 = 'show';
    const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
    const Default$8 = {
      className: 'modal-backdrop',
      clickCallback: null,
      isAnimated: false,
      isVisible: true,
      // if false, we use the backdrop helper without adding any element to the dom
      rootElement: 'body' // give the choice to place backdrop under different elements
    };
    const DefaultType$8 = {
      className: 'string',
      clickCallback: '(function|null)',
      isAnimated: 'boolean',
      isVisible: 'boolean',
      rootElement: '(element|string)'
    };
    
    /**
     * Class definition
     */
    
    class Backdrop extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
        this._isAppended = false;
        this._element = null;
      }
    
      // Getters
      static get Default() {
        return Default$8;
      }
      static get DefaultType() {
        return DefaultType$8;
      }
      static get NAME() {
        return NAME$9;
      }
    
      // Public
      show(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
        this._append();
        const element = this._getElement();
        if (this._config.isAnimated) {
          reflow(element);
        }
        element.classList.add(CLASS_NAME_SHOW$5);
        this._emulateAnimation(() => {
          execute(callback);
        });
      }
      hide(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
        this._getElement().classList.remove(CLASS_NAME_SHOW$5);
        this._emulateAnimation(() => {
          this.dispose();
          execute(callback);
        });
      }
      dispose() {
        if (!this._isAppended) {
          return;
        }
        EventHandler.off(this._element, EVENT_MOUSEDOWN);
        this._element.remove();
        this._isAppended = false;
      }
    
      // Private
      _getElement() {
        if (!this._element) {
          const backdrop = document.createElement('div');
          backdrop.className = this._config.className;
          if (this._config.isAnimated) {
            backdrop.classList.add(CLASS_NAME_FADE$4);
          }
          this._element = backdrop;
        }
        return this._element;
      }
      _configAfterMerge(config) {
        // use getElement() with the default "body" to get a fresh Element on each instantiation
        config.rootElement = getElement(config.rootElement);
        return config;
      }
      _append() {
        if (this._isAppended) {
          return;
        }
        const element = this._getElement();
        this._config.rootElement.append(element);
        EventHandler.on(element, EVENT_MOUSEDOWN, () => {
          execute(this._config.clickCallback);
        });
        this._isAppended = true;
      }
      _emulateAnimation(callback) {
        executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/focustrap.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$8 = 'focustrap';
    const DATA_KEY$5 = 'bs.focustrap';
    const EVENT_KEY$5 = `.${DATA_KEY$5}`;
    const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
    const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
    const TAB_KEY = 'Tab';
    const TAB_NAV_FORWARD = 'forward';
    const TAB_NAV_BACKWARD = 'backward';
    const Default$7 = {
      autofocus: true,
      trapElement: null // The element to trap focus inside of
    };
    const DefaultType$7 = {
      autofocus: 'boolean',
      trapElement: 'element'
    };
    
    /**
     * Class definition
     */
    
    class FocusTrap extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
        this._isActive = false;
        this._lastTabNavDirection = null;
      }
    
      // Getters
      static get Default() {
        return Default$7;
      }
      static get DefaultType() {
        return DefaultType$7;
      }
      static get NAME() {
        return NAME$8;
      }
    
      // Public
      activate() {
        if (this._isActive) {
          return;
        }
        if (this._config.autofocus) {
          this._config.trapElement.focus();
        }
        EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
        EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
        EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
        this._isActive = true;
      }
      deactivate() {
        if (!this._isActive) {
          return;
        }
        this._isActive = false;
        EventHandler.off(document, EVENT_KEY$5);
      }
    
      // Private
      _handleFocusin(event) {
        const {
          trapElement
        } = this._config;
        if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
          return;
        }
        const elements = SelectorEngine.focusableChildren(trapElement);
        if (elements.length === 0) {
          trapElement.focus();
        } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
          elements[elements.length - 1].focus();
        } else {
          elements[0].focus();
        }
      }
      _handleKeydown(event) {
        if (event.key !== TAB_KEY) {
          return;
        }
        this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/scrollBar.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    const SELECTOR_STICKY_CONTENT = '.sticky-top';
    const PROPERTY_PADDING = 'padding-right';
    const PROPERTY_MARGIN = 'margin-right';
    
    /**
     * Class definition
     */
    
    class ScrollBarHelper {
      constructor() {
        this._element = document.body;
      }
    
      // Public
      getWidth() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
      }
      hide() {
        const width = this.getWidth();
        this._disableOverFlow();
        // give padding to element to balance the hidden scrollbar width
        this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
        // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
        this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
        this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
      }
      reset() {
        this._resetElementAttributes(this._element, 'overflow');
        this._resetElementAttributes(this._element, PROPERTY_PADDING);
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
      }
      isOverflowing() {
        return this.getWidth() > 0;
      }
    
      // Private
      _disableOverFlow() {
        this._saveInitialAttribute(this._element, 'overflow');
        this._element.style.overflow = 'hidden';
      }
      _setElementAttributes(selector, styleProperty, callback) {
        const scrollbarWidth = this.getWidth();
        const manipulationCallBack = element => {
          if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
            return;
          }
          this._saveInitialAttribute(element, styleProperty);
          const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
          element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
      _saveInitialAttribute(element, styleProperty) {
        const actualValue = element.style.getPropertyValue(styleProperty);
        if (actualValue) {
          Manipulator.setDataAttribute(element, styleProperty, actualValue);
        }
      }
      _resetElementAttributes(selector, styleProperty) {
        const manipulationCallBack = element => {
          const value = Manipulator.getDataAttribute(element, styleProperty);
          // We only want to remove the property if the value is `null`; the value can also be zero
          if (value === null) {
            element.style.removeProperty(styleProperty);
            return;
          }
          Manipulator.removeDataAttribute(element, styleProperty);
          element.style.setProperty(styleProperty, value);
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
      _applyManipulationCallback(selector, callBack) {
        if (isElement(selector)) {
          callBack(selector);
          return;
        }
        for (const sel of SelectorEngine.find(selector, this._element)) {
          callBack(sel);
        }
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap modal.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$7 = 'modal';
    const DATA_KEY$4 = 'bs.modal';
    const EVENT_KEY$4 = `.${DATA_KEY$4}`;
    const DATA_API_KEY$2 = '.data-api';
    const ESCAPE_KEY$1 = 'Escape';
    const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
    const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
    const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
    const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
    const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
    const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
    const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
    const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
    const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
    const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_FADE$3 = 'fade';
    const CLASS_NAME_SHOW$4 = 'show';
    const CLASS_NAME_STATIC = 'modal-static';
    const OPEN_SELECTOR$1 = '.modal.show';
    const SELECTOR_DIALOG = '.modal-dialog';
    const SELECTOR_MODAL_BODY = '.modal-body';
    const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
    const Default$6 = {
      backdrop: true,
      focus: true,
      keyboard: true
    };
    const DefaultType$6 = {
      backdrop: '(boolean|string)',
      focus: 'boolean',
      keyboard: 'boolean'
    };
    
    /**
     * Class definition
     */
    
    class Modal extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._isShown = false;
        this._isTransitioning = false;
        this._scrollBar = new ScrollBarHelper();
        this._addEventListeners();
      }
    
      // Getters
      static get Default() {
        return Default$6;
      }
      static get DefaultType() {
        return DefaultType$6;
      }
      static get NAME() {
        return NAME$7;
      }
    
      // Public
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
      show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
          return;
        }
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
          relatedTarget
        });
        if (showEvent.defaultPrevented) {
          return;
        }
        this._isShown = true;
        this._isTransitioning = true;
        this._scrollBar.hide();
        document.body.classList.add(CLASS_NAME_OPEN);
        this._adjustDialog();
        this._backdrop.show(() => this._showElement(relatedTarget));
      }
      hide() {
        if (!this._isShown || this._isTransitioning) {
          return;
        }
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
        if (hideEvent.defaultPrevented) {
          return;
        }
        this._isShown = false;
        this._isTransitioning = true;
        this._focustrap.deactivate();
        this._element.classList.remove(CLASS_NAME_SHOW$4);
        this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
      }
      dispose() {
        EventHandler.off(window, EVENT_KEY$4);
        EventHandler.off(this._dialog, EVENT_KEY$4);
        this._backdrop.dispose();
        this._focustrap.deactivate();
        super.dispose();
      }
      handleUpdate() {
        this._adjustDialog();
      }
    
      // Private
      _initializeBackDrop() {
        return new Backdrop({
          isVisible: Boolean(this._config.backdrop),
          // 'static' option will be translated to true, and booleans will keep their value,
          isAnimated: this._isAnimated()
        });
      }
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
      _showElement(relatedTarget) {
        // try to append dynamic modal
        if (!document.body.contains(this._element)) {
          document.body.append(this._element);
        }
        this._element.style.display = 'block';
        this._element.removeAttribute('aria-hidden');
        this._element.setAttribute('aria-modal', true);
        this._element.setAttribute('role', 'dialog');
        this._element.scrollTop = 0;
        const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
        reflow(this._element);
        this._element.classList.add(CLASS_NAME_SHOW$4);
        const transitionComplete = () => {
          if (this._config.focus) {
            this._focustrap.activate();
          }
          this._isTransitioning = false;
          EventHandler.trigger(this._element, EVENT_SHOWN$4, {
            relatedTarget
          });
        };
        this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
      }
      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (event.key !== ESCAPE_KEY$1) {
            return;
          }
          if (this._config.keyboard) {
            this.hide();
            return;
          }
          this._triggerBackdropTransition();
        });
        EventHandler.on(window, EVENT_RESIZE$1, () => {
          if (this._isShown && !this._isTransitioning) {
            this._adjustDialog();
          }
        });
        EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
          // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
          EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
            if (this._element !== event.target || this._element !== event2.target) {
              return;
            }
            if (this._config.backdrop === 'static') {
              this._triggerBackdropTransition();
              return;
            }
            if (this._config.backdrop) {
              this.hide();
            }
          });
        });
      }
      _hideModal() {
        this._element.style.display = 'none';
        this._element.setAttribute('aria-hidden', true);
        this._element.removeAttribute('aria-modal');
        this._element.removeAttribute('role');
        this._isTransitioning = false;
        this._backdrop.hide(() => {
          document.body.classList.remove(CLASS_NAME_OPEN);
          this._resetAdjustments();
          this._scrollBar.reset();
          EventHandler.trigger(this._element, EVENT_HIDDEN$4);
        });
      }
      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_FADE$3);
      }
      _triggerBackdropTransition() {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
        if (hideEvent.defaultPrevented) {
          return;
        }
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        const initialOverflowY = this._element.style.overflowY;
        // return if the following background transition hasn't yet completed
        if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
          return;
        }
        if (!isModalOverflowing) {
          this._element.style.overflowY = 'hidden';
        }
        this._element.classList.add(CLASS_NAME_STATIC);
        this._queueCallback(() => {
          this._element.classList.remove(CLASS_NAME_STATIC);
          this._queueCallback(() => {
            this._element.style.overflowY = initialOverflowY;
          }, this._dialog);
        }, this._dialog);
        this._element.focus();
      }
    
      /**
       * The following methods are used to handle overflowing modals
       */
    
      _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        const scrollbarWidth = this._scrollBar.getWidth();
        const isBodyOverflowing = scrollbarWidth > 0;
        if (isBodyOverflowing && !isModalOverflowing) {
          const property = isRTL() ? 'paddingLeft' : 'paddingRight';
          this._element.style[property] = `${scrollbarWidth}px`;
        }
        if (!isBodyOverflowing && isModalOverflowing) {
          const property = isRTL() ? 'paddingRight' : 'paddingLeft';
          this._element.style[property] = `${scrollbarWidth}px`;
        }
      }
      _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
      }
    
      // Static
      static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
          const data = Modal.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](relatedTarget);
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
      const target = SelectorEngine.getElementFromSelector(this);
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      EventHandler.one(target, EVENT_SHOW$4, showEvent => {
        if (showEvent.defaultPrevented) {
          // only register focus restorer if modal will actually get shown
          return;
        }
        EventHandler.one(target, EVENT_HIDDEN$4, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
      });
    
      // avoid conflict when clicking modal toggler while another one is open
      const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
      if (alreadyOpen) {
        Modal.getInstance(alreadyOpen).hide();
      }
      const data = Modal.getOrCreateInstance(target);
      data.toggle(this);
    });
    enableDismissTrigger(Modal);
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Modal);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap offcanvas.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$6 = 'offcanvas';
    const DATA_KEY$3 = 'bs.offcanvas';
    const EVENT_KEY$3 = `.${DATA_KEY$3}`;
    const DATA_API_KEY$1 = '.data-api';
    const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
    const ESCAPE_KEY = 'Escape';
    const CLASS_NAME_SHOW$3 = 'show';
    const CLASS_NAME_SHOWING$1 = 'showing';
    const CLASS_NAME_HIDING = 'hiding';
    const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
    const OPEN_SELECTOR = '.offcanvas.show';
    const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
    const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
    const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
    const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
    const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
    const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
    const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
    const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
    const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
    const Default$5 = {
      backdrop: true,
      keyboard: true,
      scroll: false
    };
    const DefaultType$5 = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      scroll: 'boolean'
    };
    
    /**
     * Class definition
     */
    
    class Offcanvas extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._addEventListeners();
      }
    
      // Getters
      static get Default() {
        return Default$5;
      }
      static get DefaultType() {
        return DefaultType$5;
      }
      static get NAME() {
        return NAME$6;
      }
    
      // Public
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
      show(relatedTarget) {
        if (this._isShown) {
          return;
        }
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
          relatedTarget
        });
        if (showEvent.defaultPrevented) {
          return;
        }
        this._isShown = true;
        this._backdrop.show();
        if (!this._config.scroll) {
          new ScrollBarHelper().hide();
        }
        this._element.setAttribute('aria-modal', true);
        this._element.setAttribute('role', 'dialog');
        this._element.classList.add(CLASS_NAME_SHOWING$1);
        const completeCallBack = () => {
          if (!this._config.scroll || this._config.backdrop) {
            this._focustrap.activate();
          }
          this._element.classList.add(CLASS_NAME_SHOW$3);
          this._element.classList.remove(CLASS_NAME_SHOWING$1);
          EventHandler.trigger(this._element, EVENT_SHOWN$3, {
            relatedTarget
          });
        };
        this._queueCallback(completeCallBack, this._element, true);
      }
      hide() {
        if (!this._isShown) {
          return;
        }
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
        if (hideEvent.defaultPrevented) {
          return;
        }
        this._focustrap.deactivate();
        this._element.blur();
        this._isShown = false;
        this._element.classList.add(CLASS_NAME_HIDING);
        this._backdrop.hide();
        const completeCallback = () => {
          this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
          this._element.removeAttribute('aria-modal');
          this._element.removeAttribute('role');
          if (!this._config.scroll) {
            new ScrollBarHelper().reset();
          }
          EventHandler.trigger(this._element, EVENT_HIDDEN$3);
        };
        this._queueCallback(completeCallback, this._element, true);
      }
      dispose() {
        this._backdrop.dispose();
        this._focustrap.deactivate();
        super.dispose();
      }
    
      // Private
      _initializeBackDrop() {
        const clickCallback = () => {
          if (this._config.backdrop === 'static') {
            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
            return;
          }
          this.hide();
        };
    
        // 'static' option will be translated to true, and booleans will keep their value
        const isVisible = Boolean(this._config.backdrop);
        return new Backdrop({
          className: CLASS_NAME_BACKDROP,
          isVisible,
          isAnimated: true,
          rootElement: this._element.parentNode,
          clickCallback: isVisible ? clickCallback : null
        });
      }
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
          if (event.key !== ESCAPE_KEY) {
            return;
          }
          if (this._config.keyboard) {
            this.hide();
            return;
          }
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        });
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Offcanvas.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
      const target = SelectorEngine.getElementFromSelector(this);
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
          this.focus();
        }
      });
    
      // avoid conflict when clicking a toggler of an offcanvas, while another is open
      const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
      if (alreadyOpen && alreadyOpen !== target) {
        Offcanvas.getInstance(alreadyOpen).hide();
      }
      const data = Offcanvas.getOrCreateInstance(target);
      data.toggle(this);
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
      for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
        Offcanvas.getOrCreateInstance(selector).show();
      }
    });
    EventHandler.on(window, EVENT_RESIZE, () => {
      for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
        if (getComputedStyle(element).position !== 'fixed') {
          Offcanvas.getOrCreateInstance(element).hide();
        }
      }
    });
    enableDismissTrigger(Offcanvas);
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Offcanvas);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/sanitizer.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    // js-docs-start allow-list
    const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    const DefaultAllowlist = {
      // Global attributes allowed on any supplied element below.
      '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
      a: ['target', 'href', 'title', 'rel'],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      dd: [],
      div: [],
      dl: [],
      dt: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };
    // js-docs-end allow-list
    
    const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
    
    /**
     * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
     * contexts.
     *
     * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
     */
    // eslint-disable-next-line unicorn/better-regex
    const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
    const allowedAttribute = (attribute, allowedAttributeList) => {
      const attributeName = attribute.nodeName.toLowerCase();
      if (allowedAttributeList.includes(attributeName)) {
        if (uriAttributes.has(attributeName)) {
          return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
        }
        return true;
      }
    
      // Check if a regular expression validates the attribute.
      return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
    };
    function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
      if (!unsafeHtml.length) {
        return unsafeHtml;
      }
      if (sanitizeFunction && typeof sanitizeFunction === 'function') {
        return sanitizeFunction(unsafeHtml);
      }
      const domParser = new window.DOMParser();
      const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
      const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
      for (const element of elements) {
        const elementName = element.nodeName.toLowerCase();
        if (!Object.keys(allowList).includes(elementName)) {
          element.remove();
          continue;
        }
        const attributeList = [].concat(...element.attributes);
        const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
        for (const attribute of attributeList) {
          if (!allowedAttribute(attribute, allowedAttributes)) {
            element.removeAttribute(attribute.nodeName);
          }
        }
      }
      return createdDocument.body.innerHTML;
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/template-factory.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$5 = 'TemplateFactory';
    const Default$4 = {
      allowList: DefaultAllowlist,
      content: {},
      // { selector : text ,  selector2 : text2 , }
      extraClass: '',
      html: false,
      sanitize: true,
      sanitizeFn: null,
      template: '<div></div>'
    };
    const DefaultType$4 = {
      allowList: 'object',
      content: 'object',
      extraClass: '(string|function)',
      html: 'boolean',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      template: 'string'
    };
    const DefaultContentType = {
      entry: '(string|element|function|null)',
      selector: '(string|element)'
    };
    
    /**
     * Class definition
     */
    
    class TemplateFactory extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
      }
    
      // Getters
      static get Default() {
        return Default$4;
      }
      static get DefaultType() {
        return DefaultType$4;
      }
      static get NAME() {
        return NAME$5;
      }
    
      // Public
      getContent() {
        return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
      }
      hasContent() {
        return this.getContent().length > 0;
      }
      changeContent(content) {
        this._checkContent(content);
        this._config.content = {
          ...this._config.content,
          ...content
        };
        return this;
      }
      toHtml() {
        const templateWrapper = document.createElement('div');
        templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
        for (const [selector, text] of Object.entries(this._config.content)) {
          this._setContent(templateWrapper, text, selector);
        }
        const template = templateWrapper.children[0];
        const extraClass = this._resolvePossibleFunction(this._config.extraClass);
        if (extraClass) {
          template.classList.add(...extraClass.split(' '));
        }
        return template;
      }
    
      // Private
      _typeCheckConfig(config) {
        super._typeCheckConfig(config);
        this._checkContent(config.content);
      }
      _checkContent(arg) {
        for (const [selector, content] of Object.entries(arg)) {
          super._typeCheckConfig({
            selector,
            entry: content
          }, DefaultContentType);
        }
      }
      _setContent(template, content, selector) {
        const templateElement = SelectorEngine.findOne(selector, template);
        if (!templateElement) {
          return;
        }
        content = this._resolvePossibleFunction(content);
        if (!content) {
          templateElement.remove();
          return;
        }
        if (isElement(content)) {
          this._putElementInTemplate(getElement(content), templateElement);
          return;
        }
        if (this._config.html) {
          templateElement.innerHTML = this._maybeSanitize(content);
          return;
        }
        templateElement.textContent = content;
      }
      _maybeSanitize(arg) {
        return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
      }
      _resolvePossibleFunction(arg) {
        return execute(arg, [undefined, this]);
      }
      _putElementInTemplate(element, templateElement) {
        if (this._config.html) {
          templateElement.innerHTML = '';
          templateElement.append(element);
          return;
        }
        templateElement.textContent = element.textContent;
      }
    }
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap tooltip.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$4 = 'tooltip';
    const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
    const CLASS_NAME_FADE$2 = 'fade';
    const CLASS_NAME_MODAL = 'modal';
    const CLASS_NAME_SHOW$2 = 'show';
    const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
    const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    const EVENT_MODAL_HIDE = 'hide.bs.modal';
    const TRIGGER_HOVER = 'hover';
    const TRIGGER_FOCUS = 'focus';
    const TRIGGER_CLICK = 'click';
    const TRIGGER_MANUAL = 'manual';
    const EVENT_HIDE$2 = 'hide';
    const EVENT_HIDDEN$2 = 'hidden';
    const EVENT_SHOW$2 = 'show';
    const EVENT_SHOWN$2 = 'shown';
    const EVENT_INSERTED = 'inserted';
    const EVENT_CLICK$1 = 'click';
    const EVENT_FOCUSIN$1 = 'focusin';
    const EVENT_FOCUSOUT$1 = 'focusout';
    const EVENT_MOUSEENTER = 'mouseenter';
    const EVENT_MOUSELEAVE = 'mouseleave';
    const AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: isRTL() ? 'left' : 'right',
      BOTTOM: 'bottom',
      LEFT: isRTL() ? 'right' : 'left'
    };
    const Default$3 = {
      allowList: DefaultAllowlist,
      animation: true,
      boundary: 'clippingParents',
      container: false,
      customClass: '',
      delay: 0,
      fallbackPlacements: ['top', 'right', 'bottom', 'left'],
      html: false,
      offset: [0, 6],
      placement: 'top',
      popperConfig: null,
      sanitize: true,
      sanitizeFn: null,
      selector: false,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
      title: '',
      trigger: 'hover focus'
    };
    const DefaultType$3 = {
      allowList: 'object',
      animation: 'boolean',
      boundary: '(string|element)',
      container: '(string|element|boolean)',
      customClass: '(string|function)',
      delay: '(number|object)',
      fallbackPlacements: 'array',
      html: 'boolean',
      offset: '(array|string|function)',
      placement: '(string|function)',
      popperConfig: '(null|object|function)',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      selector: '(string|boolean)',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string'
    };
    
    /**
     * Class definition
     */
    
    class Tooltip extends BaseComponent {
      constructor(element, config) {
        if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
          throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org/docs/v2/)');
        }
        super(element, config);
    
        // Private
        this._isEnabled = true;
        this._timeout = 0;
        this._isHovered = null;
        this._activeTrigger = {};
        this._popper = null;
        this._templateFactory = null;
        this._newContent = null;
    
        // Protected
        this.tip = null;
        this._setListeners();
        if (!this._config.selector) {
          this._fixTitle();
        }
      }
    
      // Getters
      static get Default() {
        return Default$3;
      }
      static get DefaultType() {
        return DefaultType$3;
      }
      static get NAME() {
        return NAME$4;
      }
    
      // Public
      enable() {
        this._isEnabled = true;
      }
      disable() {
        this._isEnabled = false;
      }
      toggleEnabled() {
        this._isEnabled = !this._isEnabled;
      }
      toggle() {
        if (!this._isEnabled) {
          return;
        }
        if (this._isShown()) {
          this._leave();
          return;
        }
        this._enter();
      }
      dispose() {
        clearTimeout(this._timeout);
        EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
        if (this._element.getAttribute('data-bs-original-title')) {
          this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
        }
        this._disposePopper();
        super.dispose();
      }
      show() {
        if (this._element.style.display === 'none') {
          throw new Error('Please use show on visible elements');
        }
        if (!(this._isWithContent() && this._isEnabled)) {
          return;
        }
        const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
        const shadowRoot = findShadowRoot(this._element);
        const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
        if (showEvent.defaultPrevented || !isInTheDom) {
          return;
        }
    
        // TODO: v6 remove this or make it optional
        this._disposePopper();
        const tip = this._getTipElement();
        this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
        const {
          container
        } = this._config;
        if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
          container.append(tip);
          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
        }
        this._popper = this._createPopper(tip);
        tip.classList.add(CLASS_NAME_SHOW$2);
    
        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.on(element, 'mouseover', noop);
          }
        }
        const complete = () => {
          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
          if (this._isHovered === false) {
            this._leave();
          }
          this._isHovered = false;
        };
        this._queueCallback(complete, this.tip, this._isAnimated());
      }
      hide() {
        if (!this._isShown()) {
          return;
        }
        const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
        if (hideEvent.defaultPrevented) {
          return;
        }
        const tip = this._getTipElement();
        tip.classList.remove(CLASS_NAME_SHOW$2);
    
        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.off(element, 'mouseover', noop);
          }
        }
        this._activeTrigger[TRIGGER_CLICK] = false;
        this._activeTrigger[TRIGGER_FOCUS] = false;
        this._activeTrigger[TRIGGER_HOVER] = false;
        this._isHovered = null; // it is a trick to support manual triggering
    
        const complete = () => {
          if (this._isWithActiveTrigger()) {
            return;
          }
          if (!this._isHovered) {
            this._disposePopper();
          }
          this._element.removeAttribute('aria-describedby');
          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
        };
        this._queueCallback(complete, this.tip, this._isAnimated());
      }
      update() {
        if (this._popper) {
          this._popper.update();
        }
      }
    
      // Protected
      _isWithContent() {
        return Boolean(this._getTitle());
      }
      _getTipElement() {
        if (!this.tip) {
          this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
        }
        return this.tip;
      }
      _createTipElement(content) {
        const tip = this._getTemplateFactory(content).toHtml();
    
        // TODO: remove this check in v6
        if (!tip) {
          return null;
        }
        tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
        // TODO: v6 the following can be achieved with CSS only
        tip.classList.add(`bs-${this.constructor.NAME}-auto`);
        const tipId = getUID(this.constructor.NAME).toString();
        tip.setAttribute('id', tipId);
        if (this._isAnimated()) {
          tip.classList.add(CLASS_NAME_FADE$2);
        }
        return tip;
      }
      setContent(content) {
        this._newContent = content;
        if (this._isShown()) {
          this._disposePopper();
          this.show();
        }
      }
      _getTemplateFactory(content) {
        if (this._templateFactory) {
          this._templateFactory.changeContent(content);
        } else {
          this._templateFactory = new TemplateFactory({
            ...this._config,
            // the `content` var has to be after `this._config`
            // to override config.content in case of popover
            content,
            extraClass: this._resolvePossibleFunction(this._config.customClass)
          });
        }
        return this._templateFactory;
      }
      _getContentForTemplate() {
        return {
          [SELECTOR_TOOLTIP_INNER]: this._getTitle()
        };
      }
      _getTitle() {
        return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
      }
    
      // Private
      _initializeOnDelegatedTarget(event) {
        return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
      }
      _isAnimated() {
        return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
      }
      _isShown() {
        return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
      }
      _createPopper(tip) {
        const placement = execute(this._config.placement, [this, tip, this._element]);
        const attachment = AttachmentMap[placement.toUpperCase()];
        return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
      }
      _getOffset() {
        const {
          offset
        } = this._config;
        if (typeof offset === 'string') {
          return offset.split(',').map(value => Number.parseInt(value, 10));
        }
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
        return offset;
      }
      _resolvePossibleFunction(arg) {
        return execute(arg, [this._element, this._element]);
      }
      _getPopperConfig(attachment) {
        const defaultBsPopperConfig = {
          placement: attachment,
          modifiers: [{
            name: 'flip',
            options: {
              fallbackPlacements: this._config.fallbackPlacements
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }, {
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'arrow',
            options: {
              element: `.${this.constructor.NAME}-arrow`
            }
          }, {
            name: 'preSetPlacement',
            enabled: true,
            phase: 'beforeMain',
            fn: data => {
              // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
              // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
              this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
            }
          }]
        };
        return {
          ...defaultBsPopperConfig,
          ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
        };
      }
      _setListeners() {
        const triggers = this._config.trigger.split(' ');
        for (const trigger of triggers) {
          if (trigger === 'click') {
            EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);
              context.toggle();
            });
          } else if (trigger !== TRIGGER_MANUAL) {
            const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
            const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
            EventHandler.on(this._element, eventIn, this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);
              context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
              context._enter();
            });
            EventHandler.on(this._element, eventOut, this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);
              context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
              context._leave();
            });
          }
        }
        this._hideModalHandler = () => {
          if (this._element) {
            this.hide();
          }
        };
        EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      }
      _fixTitle() {
        const title = this._element.getAttribute('title');
        if (!title) {
          return;
        }
        if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
          this._element.setAttribute('aria-label', title);
        }
        this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
        this._element.removeAttribute('title');
      }
      _enter() {
        if (this._isShown() || this._isHovered) {
          this._isHovered = true;
          return;
        }
        this._isHovered = true;
        this._setTimeout(() => {
          if (this._isHovered) {
            this.show();
          }
        }, this._config.delay.show);
      }
      _leave() {
        if (this._isWithActiveTrigger()) {
          return;
        }
        this._isHovered = false;
        this._setTimeout(() => {
          if (!this._isHovered) {
            this.hide();
          }
        }, this._config.delay.hide);
      }
      _setTimeout(handler, timeout) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(handler, timeout);
      }
      _isWithActiveTrigger() {
        return Object.values(this._activeTrigger).includes(true);
      }
      _getConfig(config) {
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        for (const dataAttribute of Object.keys(dataAttributes)) {
          if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
            delete dataAttributes[dataAttribute];
          }
        }
        config = {
          ...dataAttributes,
          ...(typeof config === 'object' && config ? config : {})
        };
        config = this._mergeConfigObj(config);
        config = this._configAfterMerge(config);
        this._typeCheckConfig(config);
        return config;
      }
      _configAfterMerge(config) {
        config.container = config.container === false ? document.body : getElement(config.container);
        if (typeof config.delay === 'number') {
          config.delay = {
            show: config.delay,
            hide: config.delay
          };
        }
        if (typeof config.title === 'number') {
          config.title = config.title.toString();
        }
        if (typeof config.content === 'number') {
          config.content = config.content.toString();
        }
        return config;
      }
      _getDelegateConfig() {
        const config = {};
        for (const [key, value] of Object.entries(this._config)) {
          if (this.constructor.Default[key] !== value) {
            config[key] = value;
          }
        }
        config.selector = false;
        config.trigger = 'manual';
    
        // In the future can be replaced with:
        // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
        // `Object.fromEntries(keysWithDifferentValues)`
        return config;
      }
      _disposePopper() {
        if (this._popper) {
          this._popper.destroy();
          this._popper = null;
        }
        if (this.tip) {
          this.tip.remove();
          this.tip = null;
        }
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tooltip.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        });
      }
    }
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Tooltip);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap popover.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$3 = 'popover';
    const SELECTOR_TITLE = '.popover-header';
    const SELECTOR_CONTENT = '.popover-body';
    const Default$2 = {
      ...Tooltip.Default,
      content: '',
      offset: [0, 8],
      placement: 'right',
      template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
      trigger: 'click'
    };
    const DefaultType$2 = {
      ...Tooltip.DefaultType,
      content: '(null|string|element|function)'
    };
    
    /**
     * Class definition
     */
    
    class Popover extends Tooltip {
      // Getters
      static get Default() {
        return Default$2;
      }
      static get DefaultType() {
        return DefaultType$2;
      }
      static get NAME() {
        return NAME$3;
      }
    
      // Overrides
      _isWithContent() {
        return this._getTitle() || this._getContent();
      }
    
      // Private
      _getContentForTemplate() {
        return {
          [SELECTOR_TITLE]: this._getTitle(),
          [SELECTOR_CONTENT]: this._getContent()
        };
      }
      _getContent() {
        return this._resolvePossibleFunction(this._config.content);
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Popover.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        });
      }
    }
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Popover);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap scrollspy.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$2 = 'scrollspy';
    const DATA_KEY$2 = 'bs.scrollspy';
    const EVENT_KEY$2 = `.${DATA_KEY$2}`;
    const DATA_API_KEY = '.data-api';
    const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
    const EVENT_CLICK = `click${EVENT_KEY$2}`;
    const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
    const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
    const CLASS_NAME_ACTIVE$1 = 'active';
    const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
    const SELECTOR_TARGET_LINKS = '[href]';
    const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
    const SELECTOR_NAV_LINKS = '.nav-link';
    const SELECTOR_NAV_ITEMS = '.nav-item';
    const SELECTOR_LIST_ITEMS = '.list-group-item';
    const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
    const SELECTOR_DROPDOWN = '.dropdown';
    const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
    const Default$1 = {
      offset: null,
      // TODO: v6 @deprecated, keep it for backwards compatibility reasons
      rootMargin: '0px 0px -25%',
      smoothScroll: false,
      target: null,
      threshold: [0.1, 0.5, 1]
    };
    const DefaultType$1 = {
      offset: '(number|null)',
      // TODO v6 @deprecated, keep it for backwards compatibility reasons
      rootMargin: 'string',
      smoothScroll: 'boolean',
      target: 'element',
      threshold: 'array'
    };
    
    /**
     * Class definition
     */
    
    class ScrollSpy extends BaseComponent {
      constructor(element, config) {
        super(element, config);
    
        // this._element is the observablesContainer and config.target the menu links wrapper
        this._targetLinks = new Map();
        this._observableSections = new Map();
        this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
        this._activeTarget = null;
        this._observer = null;
        this._previousScrollData = {
          visibleEntryTop: 0,
          parentScrollTop: 0
        };
        this.refresh(); // initialize
      }
    
      // Getters
      static get Default() {
        return Default$1;
      }
      static get DefaultType() {
        return DefaultType$1;
      }
      static get NAME() {
        return NAME$2;
      }
    
      // Public
      refresh() {
        this._initializeTargetsAndObservables();
        this._maybeEnableSmoothScroll();
        if (this._observer) {
          this._observer.disconnect();
        } else {
          this._observer = this._getNewObserver();
        }
        for (const section of this._observableSections.values()) {
          this._observer.observe(section);
        }
      }
      dispose() {
        this._observer.disconnect();
        super.dispose();
      }
    
      // Private
      _configAfterMerge(config) {
        // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
        config.target = getElement(config.target) || document.body;
    
        // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
        config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
        if (typeof config.threshold === 'string') {
          config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
        }
        return config;
      }
      _maybeEnableSmoothScroll() {
        if (!this._config.smoothScroll) {
          return;
        }
    
        // unregister any previous listeners
        EventHandler.off(this._config.target, EVENT_CLICK);
        EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
          const observableSection = this._observableSections.get(event.target.hash);
          if (observableSection) {
            event.preventDefault();
            const root = this._rootElement || window;
            const height = observableSection.offsetTop - this._element.offsetTop;
            if (root.scrollTo) {
              root.scrollTo({
                top: height,
                behavior: 'smooth'
              });
              return;
            }
    
            // Chrome 60 doesn't support `scrollTo`
            root.scrollTop = height;
          }
        });
      }
      _getNewObserver() {
        const options = {
          root: this._rootElement,
          threshold: this._config.threshold,
          rootMargin: this._config.rootMargin
        };
        return new IntersectionObserver(entries => this._observerCallback(entries), options);
      }
    
      // The logic of selection
      _observerCallback(entries) {
        const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
        const activate = entry => {
          this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
          this._process(targetElement(entry));
        };
        const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
        const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
        this._previousScrollData.parentScrollTop = parentScrollTop;
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            this._activeTarget = null;
            this._clearActiveClass(targetElement(entry));
            continue;
          }
          const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
          // if we are scrolling down, pick the bigger offsetTop
          if (userScrollsDown && entryIsLowerThanPrevious) {
            activate(entry);
            // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
            if (!parentScrollTop) {
              return;
            }
            continue;
          }
    
          // if we are scrolling up, pick the smallest offsetTop
          if (!userScrollsDown && !entryIsLowerThanPrevious) {
            activate(entry);
          }
        }
      }
      _initializeTargetsAndObservables() {
        this._targetLinks = new Map();
        this._observableSections = new Map();
        const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
        for (const anchor of targetLinks) {
          // ensure that the anchor has an id and is not disabled
          if (!anchor.hash || isDisabled(anchor)) {
            continue;
          }
          const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);
    
          // ensure that the observableSection exists & is visible
          if (isVisible(observableSection)) {
            this._targetLinks.set(decodeURI(anchor.hash), anchor);
            this._observableSections.set(anchor.hash, observableSection);
          }
        }
      }
      _process(target) {
        if (this._activeTarget === target) {
          return;
        }
        this._clearActiveClass(this._config.target);
        this._activeTarget = target;
        target.classList.add(CLASS_NAME_ACTIVE$1);
        this._activateParents(target);
        EventHandler.trigger(this._element, EVENT_ACTIVATE, {
          relatedTarget: target
        });
      }
      _activateParents(target) {
        // Activate dropdown parents
        if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
          SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
          return;
        }
        for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
            item.classList.add(CLASS_NAME_ACTIVE$1);
          }
        }
      }
      _clearActiveClass(parent) {
        parent.classList.remove(CLASS_NAME_ACTIVE$1);
        const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
        for (const node of activeNodes) {
          node.classList.remove(CLASS_NAME_ACTIVE$1);
        }
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = ScrollSpy.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
      for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
        ScrollSpy.getOrCreateInstance(spy);
      }
    });
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(ScrollSpy);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap tab.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME$1 = 'tab';
    const DATA_KEY$1 = 'bs.tab';
    const EVENT_KEY$1 = `.${DATA_KEY$1}`;
    const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
    const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
    const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
    const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
    const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
    const ARROW_LEFT_KEY = 'ArrowLeft';
    const ARROW_RIGHT_KEY = 'ArrowRight';
    const ARROW_UP_KEY = 'ArrowUp';
    const ARROW_DOWN_KEY = 'ArrowDown';
    const HOME_KEY = 'Home';
    const END_KEY = 'End';
    const CLASS_NAME_ACTIVE = 'active';
    const CLASS_NAME_FADE$1 = 'fade';
    const CLASS_NAME_SHOW$1 = 'show';
    const CLASS_DROPDOWN = 'dropdown';
    const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
    const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
    const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
    const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
    const SELECTOR_OUTER = '.nav-item, .list-group-item';
    const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
    const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
    const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
    
    /**
     * Class definition
     */
    
    class Tab extends BaseComponent {
      constructor(element) {
        super(element);
        this._parent = this._element.closest(SELECTOR_TAB_PANEL);
        if (!this._parent) {
          return;
          // TODO: should throw exception in v6
          // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
        }
    
        // Set up initial aria attributes
        this._setInitialAttributes(this._parent, this._getChildren());
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }
    
      // Getters
      static get NAME() {
        return NAME$1;
      }
    
      // Public
      show() {
        // Shows this elem and deactivate the active sibling if exists
        const innerElem = this._element;
        if (this._elemIsActive(innerElem)) {
          return;
        }
    
        // Search for active tab on same parent to deactivate it
        const active = this._getActiveElem();
        const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
          relatedTarget: innerElem
        }) : null;
        const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
          relatedTarget: active
        });
        if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
          return;
        }
        this._deactivate(active, innerElem);
        this._activate(innerElem, active);
      }
    
      // Private
      _activate(element, relatedElem) {
        if (!element) {
          return;
        }
        element.classList.add(CLASS_NAME_ACTIVE);
        this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section
    
        const complete = () => {
          if (element.getAttribute('role') !== 'tab') {
            element.classList.add(CLASS_NAME_SHOW$1);
            return;
          }
          element.removeAttribute('tabindex');
          element.setAttribute('aria-selected', true);
          this._toggleDropDown(element, true);
          EventHandler.trigger(element, EVENT_SHOWN$1, {
            relatedTarget: relatedElem
          });
        };
        this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
      }
      _deactivate(element, relatedElem) {
        if (!element) {
          return;
        }
        element.classList.remove(CLASS_NAME_ACTIVE);
        element.blur();
        this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too
    
        const complete = () => {
          if (element.getAttribute('role') !== 'tab') {
            element.classList.remove(CLASS_NAME_SHOW$1);
            return;
          }
          element.setAttribute('aria-selected', false);
          element.setAttribute('tabindex', '-1');
          this._toggleDropDown(element, false);
          EventHandler.trigger(element, EVENT_HIDDEN$1, {
            relatedTarget: relatedElem
          });
        };
        this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
      }
      _keydown(event) {
        if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
          return;
        }
        event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
        event.preventDefault();
        const children = this._getChildren().filter(element => !isDisabled(element));
        let nextActiveElement;
        if ([HOME_KEY, END_KEY].includes(event.key)) {
          nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
        } else {
          const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
          nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
        }
        if (nextActiveElement) {
          nextActiveElement.focus({
            preventScroll: true
          });
          Tab.getOrCreateInstance(nextActiveElement).show();
        }
      }
      _getChildren() {
        // collection of inner elements
        return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
      }
      _getActiveElem() {
        return this._getChildren().find(child => this._elemIsActive(child)) || null;
      }
      _setInitialAttributes(parent, children) {
        this._setAttributeIfNotExists(parent, 'role', 'tablist');
        for (const child of children) {
          this._setInitialAttributesOnChild(child);
        }
      }
      _setInitialAttributesOnChild(child) {
        child = this._getInnerElement(child);
        const isActive = this._elemIsActive(child);
        const outerElem = this._getOuterElement(child);
        child.setAttribute('aria-selected', isActive);
        if (outerElem !== child) {
          this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
        }
        if (!isActive) {
          child.setAttribute('tabindex', '-1');
        }
        this._setAttributeIfNotExists(child, 'role', 'tab');
    
        // set attributes to the related panel too
        this._setInitialAttributesOnTargetPanel(child);
      }
      _setInitialAttributesOnTargetPanel(child) {
        const target = SelectorEngine.getElementFromSelector(child);
        if (!target) {
          return;
        }
        this._setAttributeIfNotExists(target, 'role', 'tabpanel');
        if (child.id) {
          this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
        }
      }
      _toggleDropDown(element, open) {
        const outerElem = this._getOuterElement(element);
        if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
          return;
        }
        const toggle = (selector, className) => {
          const element = SelectorEngine.findOne(selector, outerElem);
          if (element) {
            element.classList.toggle(className, open);
          }
        };
        toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
        toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
        outerElem.setAttribute('aria-expanded', open);
      }
      _setAttributeIfNotExists(element, attribute, value) {
        if (!element.hasAttribute(attribute)) {
          element.setAttribute(attribute, value);
        }
      }
      _elemIsActive(elem) {
        return elem.classList.contains(CLASS_NAME_ACTIVE);
      }
    
      // Try to get the inner element (usually the .nav-link)
      _getInnerElement(elem) {
        return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
      }
    
      // Try to get the outer element (usually the .nav-item)
      _getOuterElement(elem) {
        return elem.closest(SELECTOR_OUTER) || elem;
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tab.getOrCreateInstance(this);
          if (typeof config !== 'string') {
            return;
          }
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      Tab.getOrCreateInstance(this).show();
    });
    
    /**
     * Initialize on focus
     */
    EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
      for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
        Tab.getOrCreateInstance(element);
      }
    });
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Tab);
    
    /**
     * --------------------------------------------------------------------------
     * Bootstrap toast.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    
    
    /**
     * Constants
     */
    
    const NAME = 'toast';
    const DATA_KEY = 'bs.toast';
    const EVENT_KEY = `.${DATA_KEY}`;
    const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
    const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
    const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
    const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_SHOWING = 'showing';
    const DefaultType = {
      animation: 'boolean',
      autohide: 'boolean',
      delay: 'number'
    };
    const Default = {
      animation: true,
      autohide: true,
      delay: 5000
    };
    
    /**
     * Class definition
     */
    
    class Toast extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;
        this._setListeners();
      }
    
      // Getters
      static get Default() {
        return Default;
      }
      static get DefaultType() {
        return DefaultType;
      }
      static get NAME() {
        return NAME;
      }
    
      // Public
      show() {
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
        if (showEvent.defaultPrevented) {
          return;
        }
        this._clearTimeout();
        if (this._config.animation) {
          this._element.classList.add(CLASS_NAME_FADE);
        }
        const complete = () => {
          this._element.classList.remove(CLASS_NAME_SHOWING);
          EventHandler.trigger(this._element, EVENT_SHOWN);
          this._maybeScheduleHide();
        };
        this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
        reflow(this._element);
        this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
        this._queueCallback(complete, this._element, this._config.animation);
      }
      hide() {
        if (!this.isShown()) {
          return;
        }
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
          return;
        }
        const complete = () => {
          this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
          this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
          EventHandler.trigger(this._element, EVENT_HIDDEN);
        };
        this._element.classList.add(CLASS_NAME_SHOWING);
        this._queueCallback(complete, this._element, this._config.animation);
      }
      dispose() {
        this._clearTimeout();
        if (this.isShown()) {
          this._element.classList.remove(CLASS_NAME_SHOW);
        }
        super.dispose();
      }
      isShown() {
        return this._element.classList.contains(CLASS_NAME_SHOW);
      }
    
      // Private
    
      _maybeScheduleHide() {
        if (!this._config.autohide) {
          return;
        }
        if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
          return;
        }
        this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay);
      }
      _onInteraction(event, isInteracting) {
        switch (event.type) {
          case 'mouseover':
          case 'mouseout':
            {
              this._hasMouseInteraction = isInteracting;
              break;
            }
          case 'focusin':
          case 'focusout':
            {
              this._hasKeyboardInteraction = isInteracting;
              break;
            }
        }
        if (isInteracting) {
          this._clearTimeout();
          return;
        }
        const nextElement = event.relatedTarget;
        if (this._element === nextElement || this._element.contains(nextElement)) {
          return;
        }
        this._maybeScheduleHide();
      }
      _setListeners() {
        EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
        EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
      }
      _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    
      // Static
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Toast.getOrCreateInstance(this, config);
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config](this);
          }
        });
      }
    }
    
    /**
     * Data API implementation
     */
    
    enableDismissTrigger(Toast);
    
    /**
     * jQuery
     */
    
    defineJQueryPlugin(Toast);
    
    
    //# sourceMappingURL=bootstrap.esm.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/spotlight.js/dist/spotlight.bundle.js":
    /*!************************************************************!*\
      !*** ./node_modules/spotlight.js/dist/spotlight.bundle.js ***!
      \************************************************************/
    /***/ (function() {
    
    /**
     * Spotlight.js v0.7.8 (Bundle)
     * Copyright 2019-2021 Nextapps GmbH
     * Author: Thomas Wilkerling
     * Licence: Apache-2.0
     * https://github.com/nextapps-de/spotlight
     */
    (function(){'use strict';var aa=document.createElement("style");aa.innerHTML="@keyframes pulsate{0%,to{opacity:1}50%{opacity:.2}}#spotlight{position:fixed;top:-1px;bottom:-1px;width:100%;z-index:99999;color:#fff;background-color:#000;opacity:0;overflow:hidden;-webkit-user-select:none;-ms-user-select:none;user-select:none;transition:opacity .2s ease-out;font-family:Arial,sans-serif;font-size:16px;font-weight:400;contain:strict;touch-action:none;pointer-events:none}#spotlight.show{opacity:1;transition:none;pointer-events:auto}#spotlight.white{color:#212529;background-color:#fff}#spotlight.white .spl-next,#spotlight.white .spl-page~*,#spotlight.white .spl-prev,#spotlight.white .spl-spinner{filter:invert(1)}#spotlight.white .spl-progress{background-color:rgba(0,0,0,.35)}#spotlight.white .spl-footer,#spotlight.white .spl-header{background-color:rgba(255,255,255,.65)}#spotlight.white .spl-button{background:#212529;color:#fff}.spl-footer,.spl-header{background-color:rgba(0,0,0,.45)}#spotlight .contain,#spotlight .cover{object-fit:cover;height:100%;width:100%}#spotlight .contain{object-fit:contain}#spotlight .autofit{object-fit:none;width:auto;height:auto;max-height:none;max-width:none;transition:none}.spl-scene,.spl-spinner,.spl-track{width:100%;height:100%;position:absolute}.spl-track{contain:strict}.spl-spinner{background-position:center;background-repeat:no-repeat;background-size:42px;opacity:0}.spl-spinner.spin{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAzOCAzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmYiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iLjY1Ij48Y2lyY2xlIHN0cm9rZS1vcGFjaXR5PSIuMTUiIGN4PSIxOCIgY3k9IjE4IiByPSIxOCIvPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgMTggMTgiIHRvPSIzNjAgMTggMTgiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9wYXRoPjwvZz48L2c+PC9zdmc+);transition:opacity .2s linear .25s;opacity:1}.spl-spinner.error{background-image:url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiB3aWR0aD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTYsMUExNSwxNSwwLDEsMCwzMSwxNiwxNSwxNSwwLDAsMCwxNiwxWm0wLDJhMTMsMTMsMCwwLDEsOC40NSwzLjE0TDYuMTQsMjQuNDVBMTMsMTMsMCwwLDEsMTYsM1ptMCwyNmExMywxMywwLDAsMS04LjQ1LTMuMTRMMjUuODYsNy41NUExMywxMywwLDAsMSwxNiwyOVoiIGlkPSJiYW5fc2lnbl9jcm9zc2VkX2NpcmNsZSIvPjwvc3ZnPg==);background-size:128px;transition:none;opacity:.5}.spl-scene{transition:transform .65s cubic-bezier(.1,1,.1,1);contain:layout size;will-change:transform}.spl-pane>*{position:absolute;width:auto;height:auto;max-width:100%;max-height:100%;left:50%;top:50%;margin:0;padding:0;border:0;transform:translate(-50%,-50%) scale(1);transition:transform .65s cubic-bezier(.3,1,.3,1),opacity .65s ease;contain:layout style;will-change:transform,opacity;visibility:hidden}.spl-header,.spl-pane,.spl-progress{position:absolute;top:0}.spl-pane{width:100%;height:100%;transition:transform .65s cubic-bezier(.3,1,.3,1);contain:layout size;will-change:transform,contents}.spl-header{width:100%;height:50px;text-align:right;transform:translateY(-100px);transition:transform .35s ease;overflow:hidden;will-change:transform}#spotlight.menu .spl-footer,#spotlight.menu .spl-header,.spl-footer:hover,.spl-header:hover{transform:translateY(0)}.spl-header div{display:inline-block;vertical-align:middle;white-space:nowrap;width:50px;height:50px;opacity:.5}.spl-progress{width:100%;height:3px;background-color:rgba(255,255,255,.45);transform:translateX(-100%);transition:transform linear}.spl-footer,.spl-next,.spl-prev{position:absolute;transition:transform .35s ease;will-change:transform}.spl-footer{left:0;right:0;bottom:0;line-height:20px;padding:20px 20px 0;padding-bottom:env(safe-area-inset-bottom,0);text-align:left;font-size:15px;font-weight:400;transform:translateY(100%)}.spl-title{font-size:22px}.spl-button,.spl-description,.spl-title{margin-bottom:20px}.spl-button{display:inline-block;background:#fff;color:#000;border-radius:5px;padding:10px 20px;cursor:pointer}.spl-next,.spl-page~*,.spl-prev{background-position:center;background-repeat:no-repeat}.spl-page{float:left;width:auto;line-height:50px}.spl-page~*{background-size:21px;float:right}.spl-fullscreen{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHZpZXdCb3g9Ii0xIC0xIDI2IDI2IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggM0g1YTIgMiAwIDAgMC0yIDJ2M20xOCAwVjVhMiAyIDAgMCAwLTItMmgtM20wIDE4aDNhMiAyIDAgMCAwIDItMnYtM00zIDE2djNhMiAyIDAgMCAwIDIgMmgzIi8+PC9zdmc+)}.spl-fullscreen.on{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04IDN2M2EyIDIgMCAwIDEtMiAySDNtMTggMGgtM2EyIDIgMCAwIDEtMi0yVjNtMCAxOHYtM2EyIDIgMCAwIDEgMi0yaDNNMyAxNmgzYTIgMiAwIDAgMSAyIDJ2MyIvPjwvc3ZnPg==)}.spl-autofit{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBoZWlnaHQ9Ijk2cHgiIHZpZXdCb3g9IjAgMCA5NiA5NiIgd2lkdGg9Ijk2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggdHJhbnNmb3JtPSJyb3RhdGUoOTAgNTAgNTApIiBmaWxsPSIjZmZmIiBkPSJNNzEuMzExLDgwQzY5LjY3LDg0LjY2LDY1LjIzLDg4LDYwLDg4SDIwYy02LjYzLDAtMTItNS4zNy0xMi0xMlYzNmMwLTUuMjMsMy4zNC05LjY3LDgtMTEuMzExVjc2YzAsMi4yMSwxLjc5LDQsNCw0SDcxLjMxMSAgeiIvPjxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDkwIDUwIDUwKSIgZmlsbD0iI2ZmZiIgZD0iTTc2LDhIMzZjLTYuNjMsMC0xMiw1LjM3LTEyLDEydjQwYzAsNi42Myw1LjM3LDEyLDEyLDEyaDQwYzYuNjMsMCwxMi01LjM3LDEyLTEyVjIwQzg4LDEzLjM3LDgyLjYzLDgsNzYsOHogTTgwLDYwICBjMCwyLjIxLTEuNzksNC00LDRIMzZjLTIuMjEsMC00LTEuNzktNC00VjIwYzAtMi4yMSwxLjc5LTQsNC00aDQwYzIuMjEsMCw0LDEuNzksNCw0VjYweiIvPjwvc3ZnPg==)}.spl-zoom-in,.spl-zoom-out{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ii8+PGxpbmUgeDE9IjIxIiB4Mj0iMTYuNjUiIHkxPSIyMSIgeTI9IjE2LjY1Ii8+PGxpbmUgeDE9IjgiIHgyPSIxNCIgeTE9IjExIiB5Mj0iMTEiLz48L3N2Zz4=);background-size:22px}.spl-zoom-in{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ii8+PGxpbmUgeDE9IjIxIiB4Mj0iMTYuNjUiIHkxPSIyMSIgeTI9IjE2LjY1Ii8+PGxpbmUgeDE9IjExIiB4Mj0iMTEiIHkxPSI4IiB5Mj0iMTQiLz48bGluZSB4MT0iOCIgeDI9IjE0IiB5MT0iMTEiIHkyPSIxMSIvPjwvc3ZnPg==)}.spl-download{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNDEuNzMycHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDE0MS43MzIgMTQxLjczMiIgd2lkdGg9IjE0MS43MzJweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIwLjY3NCwxMjUuMTM4SDIwLjc5M3YxNi41OTRoOTkuODgxVjEyNS4xMzh6IE0xMTkuMDE5LDU4Ljc3NmMtMi41NjEtMi41NjItNi43MTYtMi41NjItOS4yNzUsMEw3Ny4yMSw5MS4zMTJWNi41NjIgICBDNzcuMjEsMi45MzYsNzQuMjY5LDAsNzAuNjQ4LDBjLTMuNjI0LDAtNi41NiwyLjkzNy02LjU2LDYuNTYzdjg0Ljc1TDMxLjk5Miw1OS4yMThjLTIuNTYyLTIuNTY0LTYuNzE1LTIuNTY0LTkuMjc3LDAgICBjLTIuNTY1LDIuNTYyLTIuNTY1LDYuNzE2LDAsOS4yNzlsNDMuMjk0LDQzLjI5M2MwLjE1LDAuMTU0LDAuMzE0LDAuMjk5LDAuNDgxLDAuNDM4YzAuMDc2LDAuMDYyLDAuMTU1LDAuMTEzLDAuMjM0LDAuMTc2ICAgYzAuMDk0LDAuMDY1LDAuMTg2LDAuMTQyLDAuMjc5LDAuMjA2YzAuMDk3LDAuMDYzLDAuMTkyLDAuMTE0LDAuMjg2LDAuMTc0YzAuMDg4LDAuMDU0LDAuMTc0LDAuMTA1LDAuMjY1LDAuMTUzICAgYzAuMSwwLjA1NiwwLjE5OSwwLjEsMC4yOTgsMC4xNDdjMC4wOTcsMC4wNDUsMC4xOSwwLjA5MSwwLjI4MywwLjEzMmMwLjA5OCwwLjA0LDAuMTk2LDAuMDcyLDAuMjk1LDAuMTA1ICAgYzAuMTA0LDAuMDM4LDAuMjA3LDAuMDc4LDAuMzEyLDAuMTA5YzAuMTAxLDAuMDMsMC4xOTcsMC4wNTIsMC4yOTcsMC4wNzdjMC4xMDgsMC4wMjMsMC4yMTQsMC4wNTgsMC4zMjQsMC4wNzggICBjMC4xMTUsMC4wMjEsMC4yMzEsMC4wMzMsMC4zNDYsMC4wNTRjMC4wOTcsMC4wMTUsMC4xOTIsMC4wMzIsMC4yODksMC4wNDJjMC40MywwLjA0MiwwLjg2NSwwLjA0MiwxLjI5NSwwICAgYzAuMS0wLjAxLDAuMTkxLTAuMDI3LDAuMjg5LTAuMDQyYzAuMTE0LTAuMDIxLDAuMjMzLTAuMDI5LDAuMzQ0LTAuMDU0YzAuMTA5LTAuMDIxLDAuMjE3LTAuMDU1LDAuMzI0LTAuMDc4ICAgYzAuMTAyLTAuMDI1LDAuMTk5LTAuMDQ3LDAuMjk5LTAuMDc3YzAuMTA1LTAuMDMxLDAuMjA3LTAuMDcxLDAuMzEyLTAuMTA5YzAuMTAyLTAuMDMsMC4xOTUtMC4wNjIsMC4yOTUtMC4xMDUgICBjMC4wOTYtMC4wNDEsMC4xOTEtMC4wODcsMC4yODMtMC4xMzJjMC4xLTAuMDQ4LDAuMTk5LTAuMDkyLDAuMjk3LTAuMTQ3YzAuMDkxLTAuMDQ4LDAuMTc3LTAuMTA0LDAuMjY0LTAuMTUzICAgYzAuMDk4LTAuMDYsMC4xOTMtMC4xMSwwLjI4Ny0wLjE3NGMwLjA5Ni0wLjA2NCwwLjE4OS0wLjE0MSwwLjI4MS0wLjIwNmMwLjA3Ni0wLjA2MiwwLjE1Ni0wLjExMywwLjIzMy0wLjE3NiAgIGMwLjI0OS0wLjIwNCwwLjQ3OS0wLjQzNywwLjY5NC0wLjY3YzAuMDc2LTAuMDY3LDAuMTU0LTAuMTMxLDAuMjI5LTAuMjAzbDQzLjI5NC00My4yOTYgICBDMTIxLjU4MSw2NS40OTEsMTIxLjU4MSw2MS4zMzcsMTE5LjAxOSw1OC43NzYiLz48L2c+PC9zdmc+);background-size:20px}.spl-theme{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBoZWlnaHQ9IjI0cHgiIHZlcnNpb249IjEuMiIgdmlld0JveD0iMiAyIDIwIDIwIiB3aWR0aD0iMjRweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIsNGMtNC40MTgsMC04LDMuNTgyLTgsOHMzLjU4Miw4LDgsOHM4LTMuNTgyLDgtOFMxNi40MTgsNCwxMiw0eiBNMTIsMThjLTMuMzE0LDAtNi0yLjY4Ni02LTZzMi42ODYtNiw2LTZzNiwyLjY4Niw2LDYgUzE1LjMxNCwxOCwxMiwxOHoiLz48cGF0aCBkPSJNMTIsN3YxMGMyLjc1NywwLDUtMi4yNDMsNS01UzE0Ljc1Nyw3LDEyLDd6Ii8+PC9nPjwvc3ZnPg==)}.spl-play{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSItMC41IC0wLjUgMjUgMjUiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwb2x5Z29uIGZpbGw9IiNmZmYiIHBvaW50cz0iMTAgOCAxNiAxMiAxMCAxNiAxMCA4Ii8+PC9zdmc+)}.spl-play.on{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSItMC41IC0wLjUgMjUgMjUiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMCIgeDI9IjEwIiB5MT0iMTUiIHkyPSI5Ii8+PGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxNSIgeTI9IjkiLz48L3N2Zz4=);animation:pulsate 1s ease infinite}.spl-close{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIyIDIgMjAgMjAiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTgiIHgyPSI2IiB5MT0iNiIgeTI9IjE4Ii8+PGxpbmUgeDE9IjYiIHgyPSIxOCIgeTE9IjYiIHkyPSIxOCIvPjwvc3ZnPg==)}.spl-next,.spl-prev{top:50%;width:50px;height:50px;opacity:.65;background-color:rgba(0,0,0,.45);border-radius:100%;cursor:pointer;margin-top:-25px;transform:translateX(-100px);background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWxpbmUgcG9pbnRzPSIxNSAxOCA5IDEyIDE1IDYiLz48L3N2Zz4=);background-size:30px}.spl-prev{left:20px}.spl-next{left:auto;right:20px;transform:translateX(100px) scaleX(-1)}#spotlight.menu .spl-prev{transform:translateX(0)}#spotlight.menu .spl-next{transform:translateX(0) scaleX(-1)}@media (hover:hover){.spl-page~div{cursor:pointer;transition:opacity .2s ease}.spl-next:hover,.spl-page~div:hover,.spl-prev:hover{opacity:1}}@media (max-width:500px){.spl-header div{width:44px}.spl-footer .spl-title{font-size:20px}.spl-footer{font-size:14px}.spl-next,.spl-prev{width:35px;height:35px;margin-top:-17.5px;background-size:15px 15px}.spl-spinner{background-size:30px 30px}}.hide-scrollbars{overflow:hidden!important}";
    var ba=document.getElementsByTagName("head")[0];ba.firstChild?ba.insertBefore(aa,ba.firstChild):ba.appendChild(aa);Object.assign||(Object.assign=function(a,b){for(var c=Object.keys(b),e=0,f;e<c.length;e++)f=c[e],a[f]=b[f];return a});Element.prototype.closest||(Element.prototype.closest=function(a){a=a.substring(1);for(var b=this;b&&1===b.nodeType;){if(b.classList.contains(a))return b;b=b.parentElement}return null});function d(a,b,c){a.classList[c?"add":"remove"](b)}function g(a,b,c){c=""+c;a["_s_"+b]!==c&&(a.style.setProperty(b,c),a["_s_"+b]=c)}var ca=0;function da(a,b){b&&(g(a,"transition","none"),b());ca||(ca=a.clientTop&&0);b&&g(a,"transition","")}function h(a,b,c,e){k(!0,a,b,c,e)}function k(a,b,c,e,f){b[(a?"add":"remove")+"EventListener"](c,e,f||!1===f?f:!0)}function ea(a,b){a.stopPropagation();b&&a.preventDefault()}function l(a,b){g(a,"display",b?"":"none")}
    function fa(a,b){g(a,"visibility",b?"":"hidden")}function m(a,b){g(a,"transition",b?"":"none")};var n="theme download play page close autofit zoom-in zoom-out prev next fullscreen".split(" "),ha={page:1,close:1,autofit:1,"zoom-in":1,"zoom-out":1,prev:1,next:1,fullscreen:1};var p=document.createElement("div");p.id="spotlight";p.innerHTML="<div class=spl-spinner></div><div class=spl-track><div class=spl-scene><div class=spl-pane></div></div></div><div class=spl-header><div class=spl-page> </div></div><div class=spl-progress></div><div class=spl-footer><div class=spl-title> </div><div class=spl-description> </div><div class=spl-button> </div></div><div class=spl-prev></div><div class=spl-next></div>";var ia={},ja=document.createElement("video");function ka(a,b,c,e){if("node"!==e)for(var f=Object.keys(c),A=0,w;A<f.length;A++)if(w=f[A],3<w.length&&0===w.indexOf("src"))if("video"===e){var F=ia[w];if(F){if(0<F){var Ga=c[w];break}}else if(ja.canPlayType("video/"+w.substring(3).replace("-","").toLowerCase())){ia[w]=1;Ga=c[w];break}else ia[w]=-1}else if(F=parseInt(w.substring(4),10))if(F=Math.abs(b-F),!jb||F<jb){var jb=F;Ga=c[w]}return Ga||c.src||c.href||a.src||a.href};var q={},la=navigator.connection,ma=window.devicePixelRatio||1,r,t,na,oa,u,pa,qa,ra,v,sa,ta,ua,x,y,z,B,C,D,va,E,G,wa,xa,ya,za,Aa,Ba,H,Ca,Da,Ea,Fa,I,Ha,Ia,Ja,Ka,J,K,L,M,N,La=document.createElement("img"),Ma,Na,Oa,Pa,Qa,Ra,Sa,Ta,Ua,Va,Wa,O,Xa,P,Q,R,S,Ya,T,Za;h(document,"click",$a);
    function ab(){function a(c){return q[c]=(p||document).getElementsByClassName("spl-"+c)[0]}if(!K){K=document.body;Ma=a("scene");Na=a("header");Oa=a("footer");Pa=a("title");Qa=a("description");Ra=a("button");Sa=a("prev");Ta=a("next");Va=a("page");O=a("progress");Xa=a("spinner");M=[a("pane")];U("close",bb);K[T="requestFullscreen"]||K[T="msRequestFullscreen"]||K[T="webkitRequestFullscreen"]||K[T="mozRequestFullscreen"]||(T="");T?(Za=T.replace("request","exit").replace("mozRequest","mozCancel").replace("Request",
    "Exit"),Ua=U("fullscreen",cb)):n.pop();U("autofit",V);U("zoom-in",db);U("zoom-out",eb);U("theme",fb);Wa=U("play",W);U("download",gb);h(Sa,"click",hb);h(Ta,"click",ib);var b=a("track");h(b,"mousedown",kb);h(b,"mousemove",lb);h(b,"mouseleave",mb);h(b,"mouseup",mb);h(b,"touchstart",kb,{passive:!1});h(b,"touchmove",lb,{passive:!0});h(b,"touchend",mb);h(Ra,"click",function(){Fa?Fa(z,D):Ea&&(location.href=Ea)})}}
    function U(a,b){var c=document.createElement("div");c.className="spl-"+a;h(c,"click",b);Na.appendChild(c);return q[a]=c}function $a(a){var b=a.target.closest(".spotlight");if(b){ea(a,!0);a=b.closest(".spotlight-group");C=(a||document).getElementsByClassName("spotlight");for(var c=0;c<C.length;c++)if(C[c]===b){E=a&&a.dataset;nb(c+1);break}}}
    function nb(a){if(B=C.length){K||ab();xa&&xa(a);for(var b=M[0],c=b.parentNode,e=M.length;e<B;e++){var f=b.cloneNode(!1);g(f,"left",100*e+"%");c.appendChild(f);M[e]=f}L||(K.appendChild(p),ob());z=a||1;m(Ma);pb(!0);T&&l(Ua,0<screen.availHeight-window.innerHeight);history.pushState({spl:1},"");history.pushState({spl:2},"");m(p,!0);d(K,"hide-scrollbars",!0);d(p,"show",!0);qb(!0);ob();X();H&&W(!0,!0)}}function Y(a,b){a=D[a];return"undefined"!==typeof a?(a=""+a,"false"!==a&&(a||b)):b}
    function rb(a){a?da(N,rb):(m(Ma,Ka),g(N,"opacity",Ja?0:1),sb(Ia&&.8),J&&d(N,J,!0))}
    function tb(a){L=M[a-1];N=L.firstChild;z=a;if(N)x&&V(),Aa&&d(N,Aa,!0),rb(!0),J&&d(N,J),Ja&&g(N,"opacity",1),Ia&&g(N,"transform",""),g(N,"visibility","visible"),Q&&(La.src=Q),H&&ub(R);else{var b=P.media,c=Y("spinner",!0);if("video"===b)vb(c,!0),N=document.createElement("video"),N.onloadedmetadata=function(){N===this&&(N.onerror=null,N.width=N.videoWidth,N.height=N.videoHeight,wb(),vb(c),tb(a))},N.poster=D.poster,N.preload=Da?"auto":"metadata",N.controls=Y("controls",!0),N.autoplay=D.autoplay,N.h=Y("inline"),
    N.muted=Y("muted"),N.src=P.src,L.appendChild(N);else{if("node"===b){N=P.src;"string"===typeof N&&(N=document.querySelector(N));N&&(N.g||(N.g=N.parentNode),wb(),L.appendChild(N),tb(a));return}vb(c,!0);N=document.createElement("img");N.onload=function(){N===this&&(N.onerror=null,vb(c),tb(a),wb())};N.src=P.src;L.appendChild(N)}N&&(c||g(N,"visibility","visible"),N.onerror=function(){N===this&&(xb(N),d(Xa,"error",!0),vb(c))})}}function vb(a,b){a&&d(Xa,"spin",b)}
    function yb(){return document.fullscreen||document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement}function zb(){ob();N&&wb();if(T){var a=yb();d(Ua,"on",a);a||l(Ua,0<screen.availHeight-window.innerHeight)}}function ob(){u=p.clientWidth;pa=p.clientHeight}function wb(){qa=N.clientWidth;ra=N.clientHeight}function sb(a){g(N,"transform","translate(-50%, -50%) scale("+(a||v)+")")}function Z(a,b){g(L,"transform",a||b?"translate("+a+"px, "+b+"px)":"")}
    function Ab(a,b,c){b?da(Ma,function(){Ab(a,!1,c)}):g(Ma,"transform","translateX("+(100*-a+(c||0))+"%)")}function qb(a){k(a,window,"keydown",Bb);k(a,window,"wheel",Cb);k(a,window,"resize",zb);k(a,window,"popstate",Db)}function Db(a){L&&a.state.spl&&bb(!0)}function Bb(a){if(L){var b=!1!==D["zoom-in"];switch(a.keyCode){case 8:b&&V();break;case 27:bb();break;case 32:H&&W();break;case 37:hb();break;case 39:ib();break;case 38:case 107:case 187:b&&db();break;case 40:case 109:case 189:b&&eb()}}}
    function Cb(a){L&&!1!==D["zoom-in"]&&(a=a.deltaY,0>.5*(0>a?1:a?-1:0)?eb():db())}function W(a,b){("boolean"===typeof a?a:!R)===!R&&(R=R?clearTimeout(R):1,d(Wa,"on",R),b||ub(R))}function ub(a){wa&&(da(O,function(){g(O,"transition-duration","");g(O,"transform","")}),a&&(g(O,"transition-duration",Ha+"s"),g(O,"transform","translateX(0)")));a&&(R=setTimeout(ib,1E3*Ha))}function X(){Ba&&(Ya=Date.now()+2950,S||(d(p,"menu",!0),Eb(3E3)))}
    function Eb(a){S=setTimeout(function(){var b=Date.now();b>=Ya?(d(p,"menu"),S=0):Eb(Ya-b)},a)}function Fb(a){"boolean"===typeof a&&(S=a?S:0);S?(S=clearTimeout(S),d(p,"menu")):X()}function kb(a){ea(a,!0);sa=!0;ta=!1;var b=a.touches;b&&(b=b[0])&&(a=b);ua=qa*v<=u;na=a.pageX;oa=a.pageY;m(L)}function mb(a){ea(a);if(sa){if(ta){if(ua&&ta){var b=(a=r<-(u/7)&&(z<B||G))||r>u/7&&(1<z||G);if(a||b)Ab(z-1,!0,r/u*100),a&&ib()||b&&hb();r=0;Z()}m(L,!0)}else Fb();sa=!1}}
    function lb(a){ea(a);if(sa){var b=a.touches;b&&(b=b[0])&&(a=b);b=(qa*v-u)/2;r-=na-(na=a.pageX);ua||(r>b?r=b:r<-b&&(r=-b),ra*v>pa&&(b=(ra*v-pa)/2,t-=oa-(oa=a.pageY),t>b?t=b:t<-b&&(t=-b)));ta=!0;Z(r,t)}else X()}function cb(a){var b=yb();if("boolean"!==typeof a||a!==!!b)if(b)document[Za]();else p[T]()}function fb(a){"string"!==typeof a&&(a=y?"":Ca||"white");y!==a&&(y&&d(p,y),a&&d(p,a,!0),y=a)}
    function V(a){"boolean"===typeof a&&(x=!a);x=1===v&&!x;d(N,"autofit",x);g(N,"transform","");v=1;t=r=0;wb();m(L);Z()}function db(){var a=v/.65;50>=a&&(x&&V(),r/=.65,t/=.65,Z(r,t),Gb(a))}function eb(){var a=.65*v;x&&V();1<=a&&(1===a?r=t=0:(r*=.65,t*=.65),Z(r,t),Gb(a))}function Gb(a){v=a||1;sb()}function gb(){var a=K,b=document.createElement("a"),c=N.src;b.href=c;b.download=c.substring(c.lastIndexOf("/")+1);a.appendChild(b);b.click();a.removeChild(b)}
    function bb(a){setTimeout(function(){K.removeChild(p);L=N=P=D=E=C=xa=ya=za=Fa=null},200);d(K,"hide-scrollbars");d(p,"show");cb(!1);qb();history.go(!0===a?-1:-2);Q&&(La.src="");R&&W();N&&xb(N);S&&(S=clearTimeout(S));y&&fb();I&&d(p,I);za&&za()}function xb(a){if(a.g)a.g.appendChild(a),a.g=null;else{var b=a.parentNode;b&&b.removeChild(a);a.src=a.onerror=""}}function hb(a){a&&X();if(1<B){if(1<z)return Hb(z-1);if(G)return Ab(B,!0),Hb(B)}}
    function ib(a){a&&X();if(1<B){if(z<B)return Hb(z+1);if(G)return Ab(-1,!0),Hb(1);R&&W()}}function Hb(a){if(a!==z){R?(clearTimeout(R),ub()):X();var b=a>z;z=a;pb(b);return!0}}
    function Ib(a){var b=C[z-1],c=b;D={};E&&Object.assign(D,E);Object.assign(D,c.dataset||c);va=D.media;Fa=D.onclick;Ca=D.theme;I=D["class"];Ba=Y("autohide",!0);G=Y("infinite");wa=Y("progress",!0);H=Y("autoslide");Da=Y("preload",!0);Ea=D.buttonHref;Ha=H&&parseFloat(H)||7;y||Ca&&fb(Ca);I&&d(p,I,!0);I&&da(p);if(c=D.control){c="string"===typeof c?c.split(","):c;for(var e=0;e<n.length;e++)D[n[e]]=!1;for(e=0;e<c.length;e++){var f=c[e].trim();"zoom"===f?D["zoom-in"]=D["zoom-out"]=!0:D[f]=!0}}c=D.animation;
    Ia=Ja=Ka=!c;J=!1;if(c)for(c="string"===typeof c?c.split(","):c,e=0;e<c.length;e++)f=c[e].trim(),"scale"===f?Ia=!0:"fade"===f?Ja=!0:"slide"===f?Ka=!0:f&&(J=f);Aa=D.fit;e=la&&la.downlink;c=Math.max(pa,u)*ma;e&&1200*e<c&&(c=1200*e);var A;P={media:va,src:ka(b,c,D,va),title:Y("title",b.alt||b.title||(A=b.firstElementChild)&&(A.alt||A.title))};Q&&(La.src=Q="");Da&&a&&(b=C[z])&&(a=b.dataset||b,(A=a.media)&&"image"!==A||(Q=ka(b,c,a,A)));for(b=0;b<n.length;b++)a=n[b],l(q[a],Y(a,ha[a]))}
    function pb(a){t=r=0;v=1;if(N)if(N.onerror)xb(N);else{var b=N;setTimeout(function(){b&&N!==b&&(xb(b),b=null)},650);rb();Z()}Ib(a);Ab(z-1);d(Xa,"error");tb(z);m(L);Z();a=P.title;var c=Y("description"),e=Y("button"),f=a||c||e;f&&(a&&(Pa.firstChild.nodeValue=a),c&&(Qa.firstChild.nodeValue=c),e&&(Ra.firstChild.nodeValue=e),l(Pa,a),l(Qa,c),l(Ra,e),g(Oa,"transform","all"===Ba?"":"none"));Ba||d(p,"menu",!0);fa(Oa,f);fa(Sa,G||1<z);fa(Ta,G||z<B);Va.firstChild.nodeValue=1<B?z+" / "+B:"";ya&&ya(z,D)};window.Spotlight={init:ab,theme:fb,fullscreen:cb,download:gb,autofit:V,next:ib,prev:hb,goto:Hb,close:bb,zoom:Gb,menu:Fb,show:function(a,b,c){C=a;b&&(E=b,xa=b.onshow,ya=b.onchange,za=b.onclose,c=c||b.index);nb(c)},play:W,addControl:U,removeControl:function(a){var b=q[a];b&&(Na.removeChild(b),q[a]=null)}};}).call(this);
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/constants.js":
    /*!*******************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/constants.js ***!
      \*******************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   IS_MAC: () => (/* binding */ IS_MAC),
    /* harmony export */   KEY_A: () => (/* binding */ KEY_A),
    /* harmony export */   KEY_BACKSPACE: () => (/* binding */ KEY_BACKSPACE),
    /* harmony export */   KEY_DELETE: () => (/* binding */ KEY_DELETE),
    /* harmony export */   KEY_DOWN: () => (/* binding */ KEY_DOWN),
    /* harmony export */   KEY_ESC: () => (/* binding */ KEY_ESC),
    /* harmony export */   KEY_LEFT: () => (/* binding */ KEY_LEFT),
    /* harmony export */   KEY_RETURN: () => (/* binding */ KEY_RETURN),
    /* harmony export */   KEY_RIGHT: () => (/* binding */ KEY_RIGHT),
    /* harmony export */   KEY_SHORTCUT: () => (/* binding */ KEY_SHORTCUT),
    /* harmony export */   KEY_TAB: () => (/* binding */ KEY_TAB),
    /* harmony export */   KEY_UP: () => (/* binding */ KEY_UP)
    /* harmony export */ });
    const KEY_A = 65;
    const KEY_RETURN = 13;
    const KEY_ESC = 27;
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    const KEY_BACKSPACE = 8;
    const KEY_DELETE = 46;
    const KEY_TAB = 9;
    const IS_MAC = typeof navigator === 'undefined' ? false : /Mac/.test(navigator.userAgent);
    const KEY_SHORTCUT = IS_MAC ? 'metaKey' : 'ctrlKey'; // ctrl key or apple key for ma
    //# sourceMappingURL=constants.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/contrib/highlight.js":
    /*!***************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/contrib/highlight.js ***!
      \***************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   highlight: () => (/* binding */ highlight),
    /* harmony export */   removeHighlight: () => (/* binding */ removeHighlight)
    /* harmony export */ });
    /* harmony import */ var _vanilla_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vanilla.js */ "./node_modules/tom-select/dist/esm/vanilla.js");
    /**
     * highlight v3 | MIT license | Johann Burkard <jb@eaio.com>
     * Highlights arbitrary terms in a node.
     *
     * - Modified by Marshal <beatgates@gmail.com> 2011-6-24 (added regex)
     * - Modified by Brian Reavis <brian@thirdroute.com> 2012-8-27 (cleanup)
     */
    
    const highlight = (element, regex) => {
        if (regex === null)
            return;
        // convet string to regex
        if (typeof regex === 'string') {
            if (!regex.length)
                return;
            regex = new RegExp(regex, 'i');
        }
        // Wrap matching part of text node with highlighting <span>, e.g.
        // Soccer  ->  <span class="highlight">Soc</span>cer  for regex = /soc/i
        const highlightText = (node) => {
            var match = node.data.match(regex);
            if (match && node.data.length > 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(match.index);
                middlebit.splitText(match[0].length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_0__.replaceNode)(middlebit, spannode);
                return 1;
            }
            return 0;
        };
        // Recurse element node, looking for child text nodes to highlight, unless element
        // is childless, <script>, <style>, or already highlighted: <span class="hightlight">
        const highlightChildren = (node) => {
            if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== 'highlight' || node.tagName !== 'SPAN')) {
                Array.from(node.childNodes).forEach(element => {
                    highlightRecursive(element);
                });
            }
        };
        const highlightRecursive = (node) => {
            if (node.nodeType === 3) {
                return highlightText(node);
            }
            highlightChildren(node);
            return 0;
        };
        highlightRecursive(element);
    };
    /**
     * removeHighlight fn copied from highlight v5 and
     * edited to remove with(), pass js strict mode, and use without jquery
     */
    const removeHighlight = (el) => {
        var elements = el.querySelectorAll("span.highlight");
        Array.prototype.forEach.call(elements, function (el) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        });
    };
    //# sourceMappingURL=highlight.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/contrib/microevent.js":
    /*!****************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/contrib/microevent.js ***!
      \****************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ MicroEvent)
    /* harmony export */ });
    /**
     * MicroEvent - to make any js object an event emitter
     *
     * - pure javascript - server compatible, browser compatible
     * - dont rely on the browser doms
     * - super simple - you get it immediatly, no mistery, no magic involved
     *
     * @author Jerome Etienne (https://github.com/jeromeetienne)
     */
    /**
     * Execute callback for each event in space separated list of event names
     *
     */
    function forEvents(events, callback) {
        events.split(/\s+/).forEach((event) => {
            callback(event);
        });
    }
    class MicroEvent {
        constructor() {
            this._events = {};
        }
        on(events, fct) {
            forEvents(events, (event) => {
                const event_array = this._events[event] || [];
                event_array.push(fct);
                this._events[event] = event_array;
            });
        }
        off(events, fct) {
            var n = arguments.length;
            if (n === 0) {
                this._events = {};
                return;
            }
            forEvents(events, (event) => {
                if (n === 1) {
                    delete this._events[event];
                    return;
                }
                const event_array = this._events[event];
                if (event_array === undefined)
                    return;
                event_array.splice(event_array.indexOf(fct), 1);
                this._events[event] = event_array;
            });
        }
        trigger(events, ...args) {
            var self = this;
            forEvents(events, (event) => {
                const event_array = self._events[event];
                if (event_array === undefined)
                    return;
                event_array.forEach(fct => {
                    fct.apply(self, args);
                });
            });
        }
    }
    ;
    //# sourceMappingURL=microevent.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/contrib/microplugin.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/contrib/microplugin.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ MicroPlugin)
    /* harmony export */ });
    /**
     * microplugin.js
     * Copyright (c) 2013 Brian Reavis & contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     * @author Brian Reavis <brian@thirdroute.com>
     */
    function MicroPlugin(Interface) {
        Interface.plugins = {};
        return class extends Interface {
            constructor() {
                super(...arguments);
                this.plugins = {
                    names: [],
                    settings: {},
                    requested: {},
                    loaded: {}
                };
            }
            /**
             * Registers a plugin.
             *
             * @param {function} fn
             */
            static define(name, fn) {
                Interface.plugins[name] = {
                    'name': name,
                    'fn': fn
                };
            }
            /**
             * Initializes the listed plugins (with options).
             * Acceptable formats:
             *
             * List (without options):
             *   ['a', 'b', 'c']
             *
             * List (with options):
             *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
             *
             * Hash (with options):
             *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
             *
             * @param {array|object} plugins
             */
            initializePlugins(plugins) {
                var key, name;
                const self = this;
                const queue = [];
                if (Array.isArray(plugins)) {
                    plugins.forEach((plugin) => {
                        if (typeof plugin === 'string') {
                            queue.push(plugin);
                        }
                        else {
                            self.plugins.settings[plugin.name] = plugin.options;
                            queue.push(plugin.name);
                        }
                    });
                }
                else if (plugins) {
                    for (key in plugins) {
                        if (plugins.hasOwnProperty(key)) {
                            self.plugins.settings[key] = plugins[key];
                            queue.push(key);
                        }
                    }
                }
                while (name = queue.shift()) {
                    self.require(name);
                }
            }
            loadPlugin(name) {
                var self = this;
                var plugins = self.plugins;
                var plugin = Interface.plugins[name];
                if (!Interface.plugins.hasOwnProperty(name)) {
                    throw new Error('Unable to find "' + name + '" plugin');
                }
                plugins.requested[name] = true;
                plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
                plugins.names.push(name);
            }
            /**
             * Initializes a plugin.
             *
             */
            require(name) {
                var self = this;
                var plugins = self.plugins;
                if (!self.plugins.loaded.hasOwnProperty(name)) {
                    if (plugins.requested[name]) {
                        throw new Error('Plugin has circular dependency ("' + name + '")');
                    }
                    self.loadPlugin(name);
                }
                return plugins.loaded[name];
            }
        };
    }
    //# sourceMappingURL=microplugin.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/defaults.js":
    /*!******************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/defaults.js ***!
      \******************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
        options: [],
        optgroups: [],
        plugins: [],
        delimiter: ',',
        splitOn: null, // regexp or string for splitting up values from a paste command
        persist: true,
        diacritics: true,
        create: null,
        createOnBlur: false,
        createFilter: null,
        highlight: true,
        openOnFocus: true,
        shouldOpen: null,
        maxOptions: 50,
        maxItems: null,
        hideSelected: null,
        duplicates: false,
        addPrecedence: false,
        selectOnTab: false,
        preload: null,
        allowEmptyOption: false,
        //closeAfterSelect: false,
        refreshThrottle: 300,
        loadThrottle: 300,
        loadingClass: 'loading',
        dataAttr: null, //'data-data',
        optgroupField: 'optgroup',
        valueField: 'value',
        labelField: 'text',
        disabledField: 'disabled',
        optgroupLabelField: 'label',
        optgroupValueField: 'value',
        lockOptgroupOrder: false,
        sortField: '$order',
        searchField: ['text'],
        searchConjunction: 'and',
        mode: null,
        wrapperClass: 'ts-wrapper',
        controlClass: 'ts-control',
        dropdownClass: 'ts-dropdown',
        dropdownContentClass: 'ts-dropdown-content',
        itemClass: 'item',
        optionClass: 'option',
        dropdownParent: null,
        controlInput: '<input type="text" autocomplete="off" size="1" />',
        copyClassesToDropdown: false,
        placeholder: null,
        hidePlaceholder: null,
        shouldLoad: function (query) {
            return query.length > 0;
        },
        /*
        load                 : null, // function(query, callback) { ... }
        score                : null, // function(search) { ... }
        onInitialize         : null, // function() { ... }
        onChange             : null, // function(value) { ... }
        onItemAdd            : null, // function(value, $item) { ... }
        onItemRemove         : null, // function(value) { ... }
        onClear              : null, // function() { ... }
        onOptionAdd          : null, // function(value, data) { ... }
        onOptionRemove       : null, // function(value) { ... }
        onOptionClear        : null, // function() { ... }
        onOptionGroupAdd     : null, // function(id, data) { ... }
        onOptionGroupRemove  : null, // function(id) { ... }
        onOptionGroupClear   : null, // function() { ... }
        onDropdownOpen       : null, // function(dropdown) { ... }
        onDropdownClose      : null, // function(dropdown) { ... }
        onType               : null, // function(str) { ... }
        onDelete             : null, // function(values) { ... }
        */
        render: {
        /*
        item: null,
        optgroup: null,
        optgroup_header: null,
        option: null,
        option_create: null
        */
        }
    });
    //# sourceMappingURL=defaults.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/getSettings.js":
    /*!*********************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/getSettings.js ***!
      \*********************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ getSettings)
    /* harmony export */ });
    /* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/tom-select/dist/esm/defaults.js");
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/tom-select/dist/esm/utils.js");
    
    
    function getSettings(input, settings_user) {
        var settings = Object.assign({}, _defaults_js__WEBPACK_IMPORTED_MODULE_0__["default"], settings_user);
        var attr_data = settings.dataAttr;
        var field_label = settings.labelField;
        var field_value = settings.valueField;
        var field_disabled = settings.disabledField;
        var field_optgroup = settings.optgroupField;
        var field_optgroup_label = settings.optgroupLabelField;
        var field_optgroup_value = settings.optgroupValueField;
        var tag_name = input.tagName.toLowerCase();
        var placeholder = input.getAttribute('placeholder') || input.getAttribute('data-placeholder');
        if (!placeholder && !settings.allowEmptyOption) {
            let option = input.querySelector('option[value=""]');
            if (option) {
                placeholder = option.textContent;
            }
        }
        var settings_element = {
            placeholder: placeholder,
            options: [],
            optgroups: [],
            items: [],
            maxItems: null,
        };
        /**
         * Initialize from a <select> element.
         *
         */
        var init_select = () => {
            var tagName;
            var options = settings_element.options;
            var optionsMap = {};
            var group_count = 1;
            let $order = 0;
            var readData = (el) => {
                var data = Object.assign({}, el.dataset); // get plain object from DOMStringMap
                var json = attr_data && data[attr_data];
                if (typeof json === 'string' && json.length) {
                    data = Object.assign(data, JSON.parse(json));
                }
                return data;
            };
            var addOption = (option, group) => {
                var value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.hash_key)(option.value);
                if (value == null)
                    return;
                if (!value && !settings.allowEmptyOption)
                    return;
                // if the option already exists, it's probably been
                // duplicated in another optgroup. in this case, push
                // the current group to the "optgroup" property on the
                // existing option so that it's rendered in both places.
                if (optionsMap.hasOwnProperty(value)) {
                    if (group) {
                        var arr = optionsMap[value][field_optgroup];
                        if (!arr) {
                            optionsMap[value][field_optgroup] = group;
                        }
                        else if (!Array.isArray(arr)) {
                            optionsMap[value][field_optgroup] = [arr, group];
                        }
                        else {
                            arr.push(group);
                        }
                    }
                }
                else {
                    var option_data = readData(option);
                    option_data[field_label] = option_data[field_label] || option.textContent;
                    option_data[field_value] = option_data[field_value] || value;
                    option_data[field_disabled] = option_data[field_disabled] || option.disabled;
                    option_data[field_optgroup] = option_data[field_optgroup] || group;
                    option_data.$option = option;
                    option_data.$order = option_data.$order || ++$order;
                    optionsMap[value] = option_data;
                    options.push(option_data);
                }
                if (option.selected) {
                    settings_element.items.push(value);
                }
            };
            var addGroup = (optgroup) => {
                var id, optgroup_data;
                optgroup_data = readData(optgroup);
                optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute('label') || '';
                optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
                optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
                optgroup_data.$order = optgroup_data.$order || ++$order;
                settings_element.optgroups.push(optgroup_data);
                id = optgroup_data[field_optgroup_value];
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.iterate)(optgroup.children, (option) => {
                    addOption(option, id);
                });
            };
            settings_element.maxItems = input.hasAttribute('multiple') ? null : 1;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.iterate)(input.children, (child) => {
                tagName = child.tagName.toLowerCase();
                if (tagName === 'optgroup') {
                    addGroup(child);
                }
                else if (tagName === 'option') {
                    addOption(child);
                }
            });
        };
        /**
         * Initialize from a <input type="text"> element.
         *
         */
        var init_textbox = () => {
            const data_raw = input.getAttribute(attr_data);
            if (!data_raw) {
                var value = input.value.trim() || '';
                if (!settings.allowEmptyOption && !value.length)
                    return;
                const values = value.split(settings.delimiter);
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.iterate)(values, (value) => {
                    const option = {};
                    option[field_label] = value;
                    option[field_value] = value;
                    settings_element.options.push(option);
                });
                settings_element.items = values;
            }
            else {
                settings_element.options = JSON.parse(data_raw);
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.iterate)(settings_element.options, (opt) => {
                    settings_element.items.push(opt[field_value]);
                });
            }
        };
        if (tag_name === 'select') {
            init_select();
        }
        else {
            init_textbox();
        }
        return Object.assign({}, _defaults_js__WEBPACK_IMPORTED_MODULE_0__["default"], settings_element, settings_user);
    }
    ;
    //# sourceMappingURL=getSettings.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/caret_position/plugin.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/caret_position/plugin.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
      if (Array.isArray(object)) {
        object.forEach(callback);
      } else {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            callback(object[key], key);
          }
        }
      }
    };
    
    /**
     * Remove css classes
     *
     */
    const removeClasses = (elmts, ...classes) => {
      var norm_classes = classesArray(classes);
      elmts = castAsArray(elmts);
      elmts.map(el => {
        norm_classes.map(cls => {
          el.classList.remove(cls);
        });
      });
    };
    
    /**
     * Return arguments
     *
     */
    const classesArray = args => {
      var classes = [];
      iterate(args, _classes => {
        if (typeof _classes === 'string') {
          _classes = _classes.trim().split(/[\t\n\f\r\s]/);
        }
        if (Array.isArray(_classes)) {
          classes = classes.concat(_classes);
        }
      });
      return classes.filter(Boolean);
    };
    
    /**
     * Create an array from arg if it's not already an array
     *
     */
    const castAsArray = arg => {
      if (!Array.isArray(arg)) {
        arg = [arg];
      }
      return arg;
    };
    
    /**
     * Get the index of an element amongst sibling nodes of the same type
     *
     */
    const nodeIndex = (el, amongst) => {
      if (!el) return -1;
      amongst = amongst || el.nodeName;
      var i = 0;
      while (el = el.previousElementSibling) {
        if (el.matches(amongst)) {
          i++;
        }
      }
      return i;
    };
    
    /**
     * Plugin: "dropdown_input" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      var self = this;
    
      /**
       * Moves the caret to the specified index.
       *
       * The input must be moved by leaving it in place and moving the
       * siblings, due to the fact that focus cannot be restored once lost
       * on mobile webkit devices
       *
       */
      self.hook('instead', 'setCaret', new_pos => {
        if (self.settings.mode === 'single' || !self.control.contains(self.control_input)) {
          new_pos = self.items.length;
        } else {
          new_pos = Math.max(0, Math.min(self.items.length, new_pos));
          if (new_pos != self.caretPos && !self.isPending) {
            self.controlChildren().forEach((child, j) => {
              if (j < new_pos) {
                self.control_input.insertAdjacentElement('beforebegin', child);
              } else {
                self.control.appendChild(child);
              }
            });
          }
        }
        self.caretPos = new_pos;
      });
      self.hook('instead', 'moveCaret', direction => {
        if (!self.isFocused) return;
    
        // move caret before or after selected items
        const last_active = self.getLastActive(direction);
        if (last_active) {
          const idx = nodeIndex(last_active);
          self.setCaret(direction > 0 ? idx + 1 : idx);
          self.setActiveItem();
          removeClasses(last_active, 'last-active');
    
          // move caret left or right of current position
        } else {
          self.setCaret(self.caretPos + direction);
        }
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/change_listener/plugin.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/change_listener/plugin.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
    };
    
    /**
     * Plugin: "change_listener" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      addEvent(this.input, 'change', () => {
        this.sync();
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/checkbox_options/plugin.js":
    /*!*****************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/checkbox_options/plugin.js ***!
      \*****************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    const hash_key = value => {
      if (typeof value === 'undefined' || value === null) return null;
      return get_hash(value);
    };
    const get_hash = value => {
      if (typeof value === 'boolean') return value ? '1' : '0';
      return value + '';
    };
    
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
      if (evt) {
        evt.preventDefault();
        if (stop) {
          evt.stopPropagation();
        }
      }
    };
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Plugin: "checkbox_options" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin (userOptions) {
      var self = this;
      var orig_onOptionSelect = self.onOptionSelect;
      self.settings.hideSelected = false;
      const cbOptions = Object.assign({
        // so that the user may add different ones as well
        className: "tomselect-checkbox",
        // the following default to the historic plugin's values
        checkedClassNames: undefined,
        uncheckedClassNames: undefined
      }, userOptions);
      var UpdateChecked = function UpdateChecked(checkbox, toCheck) {
        if (toCheck) {
          checkbox.checked = true;
          if (cbOptions.uncheckedClassNames) {
            checkbox.classList.remove(...cbOptions.uncheckedClassNames);
          }
          if (cbOptions.checkedClassNames) {
            checkbox.classList.add(...cbOptions.checkedClassNames);
          }
        } else {
          checkbox.checked = false;
          if (cbOptions.checkedClassNames) {
            checkbox.classList.remove(...cbOptions.checkedClassNames);
          }
          if (cbOptions.uncheckedClassNames) {
            checkbox.classList.add(...cbOptions.uncheckedClassNames);
          }
        }
      };
    
      // update the checkbox for an option
      var UpdateCheckbox = function UpdateCheckbox(option) {
        setTimeout(() => {
          var checkbox = option.querySelector('input.' + cbOptions.className);
          if (checkbox instanceof HTMLInputElement) {
            UpdateChecked(checkbox, option.classList.contains('selected'));
          }
        }, 1);
      };
    
      // add checkbox to option template
      self.hook('after', 'setupTemplates', () => {
        var orig_render_option = self.settings.render.option;
        self.settings.render.option = (data, escape_html) => {
          var rendered = getDom(orig_render_option.call(self, data, escape_html));
          var checkbox = document.createElement('input');
          if (cbOptions.className) {
            checkbox.classList.add(cbOptions.className);
          }
          checkbox.addEventListener('click', function (evt) {
            preventDefault(evt);
          });
          checkbox.type = 'checkbox';
          const hashed = hash_key(data[self.settings.valueField]);
          UpdateChecked(checkbox, !!(hashed && self.items.indexOf(hashed) > -1));
          rendered.prepend(checkbox);
          return rendered;
        };
      });
    
      // uncheck when item removed
      self.on('item_remove', value => {
        var option = self.getOption(value);
        if (option) {
          // if dropdown hasn't been opened yet, the option won't exist
          option.classList.remove('selected'); // selected class won't be removed yet
          UpdateCheckbox(option);
        }
      });
    
      // check when item added
      self.on('item_add', value => {
        var option = self.getOption(value);
        if (option) {
          // if dropdown hasn't been opened yet, the option won't exist
          UpdateCheckbox(option);
        }
      });
    
      // remove items when selected option is clicked
      self.hook('instead', 'onOptionSelect', (evt, option) => {
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
          self.removeItem(option.dataset.value);
          self.refreshOptions();
          preventDefault(evt, true);
          return;
        }
        orig_onOptionSelect.call(self, evt, option);
        UpdateCheckbox(option);
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/clear_button/plugin.js":
    /*!*************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/clear_button/plugin.js ***!
      \*************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Plugin: "dropdown_header" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin (userOptions) {
      const self = this;
      const options = Object.assign({
        className: 'clear-button',
        title: 'Clear All',
        html: data => {
          return `<div class="${data.className}" title="${data.title}">&#10799;</div>`;
        }
      }, userOptions);
      self.on('initialize', () => {
        var button = getDom(options.html(options));
        button.addEventListener('click', evt => {
          if (self.isLocked) return;
          self.clear();
          if (self.settings.mode === 'single' && self.settings.allowEmptyOption) {
            self.addItem('');
          }
          evt.preventDefault();
          evt.stopPropagation();
        });
        self.control.appendChild(button);
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/drag_drop/plugin.js":
    /*!**********************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/drag_drop/plugin.js ***!
      \**********************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
      if (evt) {
        evt.preventDefault();
        if (stop) {
          evt.stopPropagation();
        }
      }
    };
    
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
    };
    
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
      if (Array.isArray(object)) {
        object.forEach(callback);
      } else {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            callback(object[key], key);
          }
        }
      }
    };
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Set attributes of an element
     *
     */
    const setAttr = (el, attrs) => {
      iterate(attrs, (val, attr) => {
        if (val == null) {
          el.removeAttribute(attr);
        } else {
          el.setAttribute(attr, '' + val);
        }
      });
    };
    
    /**
     * Plugin: "drag_drop" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    const insertAfter = (referenceNode, newNode) => {
      var _referenceNode$parent;
      (_referenceNode$parent = referenceNode.parentNode) == null || _referenceNode$parent.insertBefore(newNode, referenceNode.nextSibling);
    };
    const insertBefore = (referenceNode, newNode) => {
      var _referenceNode$parent2;
      (_referenceNode$parent2 = referenceNode.parentNode) == null || _referenceNode$parent2.insertBefore(newNode, referenceNode);
    };
    const isBefore = (referenceNode, newNode) => {
      do {
        var _newNode;
        newNode = (_newNode = newNode) == null ? void 0 : _newNode.previousElementSibling;
        if (referenceNode == newNode) {
          return true;
        }
      } while (newNode && newNode.previousElementSibling);
      return false;
    };
    function plugin () {
      var self = this;
      if (self.settings.mode !== 'multi') return;
      var orig_lock = self.lock;
      var orig_unlock = self.unlock;
      let sortable = true;
      let drag_item;
    
      /**
       * Add draggable attribute to item
       */
      self.hook('after', 'setupTemplates', () => {
        var orig_render_item = self.settings.render.item;
        self.settings.render.item = (data, escape) => {
          const item = getDom(orig_render_item.call(self, data, escape));
          setAttr(item, {
            'draggable': 'true'
          });
    
          // prevent doc_mousedown (see tom-select.ts)
          const mousedown = evt => {
            if (!sortable) preventDefault(evt);
            evt.stopPropagation();
          };
          const dragStart = evt => {
            drag_item = item;
            setTimeout(() => {
              item.classList.add('ts-dragging');
            }, 0);
          };
          const dragOver = evt => {
            evt.preventDefault();
            item.classList.add('ts-drag-over');
            moveitem(item, drag_item);
          };
          const dragLeave = () => {
            item.classList.remove('ts-drag-over');
          };
          const moveitem = (targetitem, dragitem) => {
            if (dragitem === undefined) return;
            if (isBefore(dragitem, item)) {
              insertAfter(targetitem, dragitem);
            } else {
              insertBefore(targetitem, dragitem);
            }
          };
          const dragend = () => {
            var _drag_item;
            document.querySelectorAll('.ts-drag-over').forEach(el => el.classList.remove('ts-drag-over'));
            (_drag_item = drag_item) == null || _drag_item.classList.remove('ts-dragging');
            drag_item = undefined;
            var values = [];
            self.control.querySelectorAll(`[data-value]`).forEach(el => {
              if (el.dataset.value) {
                let value = el.dataset.value;
                if (value) {
                  values.push(value);
                }
              }
            });
            self.setValue(values);
          };
          addEvent(item, 'mousedown', mousedown);
          addEvent(item, 'dragstart', dragStart);
          addEvent(item, 'dragenter', dragOver);
          addEvent(item, 'dragover', dragOver);
          addEvent(item, 'dragleave', dragLeave);
          addEvent(item, 'dragend', dragend);
          return item;
        };
      });
      self.hook('instead', 'lock', () => {
        sortable = false;
        return orig_lock.call(self);
      });
      self.hook('instead', 'unlock', () => {
        sortable = true;
        return orig_unlock.call(self);
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/dropdown_header/plugin.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/dropdown_header/plugin.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
      if (evt) {
        evt.preventDefault();
        if (stop) {
          evt.stopPropagation();
        }
      }
    };
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Plugin: "dropdown_header" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin (userOptions) {
      const self = this;
      const options = Object.assign({
        title: 'Untitled',
        headerClass: 'dropdown-header',
        titleRowClass: 'dropdown-header-title',
        labelClass: 'dropdown-header-label',
        closeClass: 'dropdown-header-close',
        html: data => {
          return '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + '</span>' + '<a class="' + data.closeClass + '">&times;</a>' + '</div>' + '</div>';
        }
      }, userOptions);
      self.on('initialize', () => {
        var header = getDom(options.html(options));
        var close_link = header.querySelector('.' + options.closeClass);
        if (close_link) {
          close_link.addEventListener('click', evt => {
            preventDefault(evt, true);
            self.close();
          });
        }
        self.dropdown.insertBefore(header, self.dropdown.firstChild);
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/dropdown_input/plugin.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/dropdown_input/plugin.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    const KEY_ESC = 27;
    const KEY_TAB = 9;
     // ctrl key or apple key for ma
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
      if (evt) {
        evt.preventDefault();
        if (stop) {
          evt.stopPropagation();
        }
      }
    };
    
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
    };
    
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
      if (Array.isArray(object)) {
        object.forEach(callback);
      } else {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            callback(object[key], key);
          }
        }
      }
    };
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Add css classes
     *
     */
    const addClasses = (elmts, ...classes) => {
      var norm_classes = classesArray(classes);
      elmts = castAsArray(elmts);
      elmts.map(el => {
        norm_classes.map(cls => {
          el.classList.add(cls);
        });
      });
    };
    
    /**
     * Return arguments
     *
     */
    const classesArray = args => {
      var classes = [];
      iterate(args, _classes => {
        if (typeof _classes === 'string') {
          _classes = _classes.trim().split(/[\t\n\f\r\s]/);
        }
        if (Array.isArray(_classes)) {
          classes = classes.concat(_classes);
        }
      });
      return classes.filter(Boolean);
    };
    
    /**
     * Create an array from arg if it's not already an array
     *
     */
    const castAsArray = arg => {
      if (!Array.isArray(arg)) {
        arg = [arg];
      }
      return arg;
    };
    
    /**
     * Plugin: "dropdown_input" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      const self = this;
      self.settings.shouldOpen = true; // make sure the input is shown even if there are no options to display in the dropdown
    
      self.hook('before', 'setup', () => {
        self.focus_node = self.control;
        addClasses(self.control_input, 'dropdown-input');
        const div = getDom('<div class="dropdown-input-wrap">');
        div.append(self.control_input);
        self.dropdown.insertBefore(div, self.dropdown.firstChild);
    
        // set a placeholder in the select control
        const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
        placeholder.placeholder = self.settings.placeholder || '';
        self.control.append(placeholder);
      });
      self.on('initialize', () => {
        // set tabIndex on control to -1, otherwise [shift+tab] will put focus right back on control_input
        self.control_input.addEventListener('keydown', evt => {
          //addEvent(self.control_input,'keydown' as const,(evt:KeyboardEvent) =>{
          switch (evt.keyCode) {
            case KEY_ESC:
              if (self.isOpen) {
                preventDefault(evt, true);
                self.close();
              }
              self.clearActiveItems();
              return;
            case KEY_TAB:
              self.focus_node.tabIndex = -1;
              break;
          }
          return self.onKeyDown.call(self, evt);
        });
        self.on('blur', () => {
          self.focus_node.tabIndex = self.isDisabled ? -1 : self.tabIndex;
        });
    
        // give the control_input focus when the dropdown is open
        self.on('dropdown_open', () => {
          self.control_input.focus();
        });
    
        // prevent onBlur from closing when focus is on the control_input
        const orig_onBlur = self.onBlur;
        self.hook('instead', 'onBlur', evt => {
          if (evt && evt.relatedTarget == self.control_input) return;
          return orig_onBlur.call(self);
        });
        addEvent(self.control_input, 'blur', () => self.onBlur());
    
        // return focus to control to allow further keyboard input
        self.hook('before', 'close', () => {
          if (!self.isOpen) return;
          self.focus_node.focus({
            preventScroll: true
          });
        });
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/input_autogrow/plugin.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/input_autogrow/plugin.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
    };
    
    /**
     * Plugin: "input_autogrow" (Tom Select)
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      var self = this;
      self.on('initialize', () => {
        var test_input = document.createElement('span');
        var control = self.control_input;
        test_input.style.cssText = 'position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ';
        self.wrapper.appendChild(test_input);
        var transfer_styles = ['letterSpacing', 'fontSize', 'fontFamily', 'fontWeight', 'textTransform'];
        for (const style_name of transfer_styles) {
          // @ts-ignore TS7015 https://stackoverflow.com/a/50506154/697576
          test_input.style[style_name] = control.style[style_name];
        }
    
        /**
         * Set the control width
         *
         */
        var resize = () => {
          test_input.textContent = control.value;
          control.style.width = test_input.clientWidth + 'px';
        };
        resize();
        self.on('update item_add item_remove', resize);
        addEvent(control, 'input', resize);
        addEvent(control, 'keyup', resize);
        addEvent(control, 'blur', resize);
        addEvent(control, 'update', resize);
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/no_active_items/plugin.js":
    /*!****************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/no_active_items/plugin.js ***!
      \****************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Plugin: "no_active_items" (Tom Select)
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      this.hook('instead', 'setActiveItem', () => {});
      this.hook('instead', 'selectAll', () => {});
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/no_backspace_delete/plugin.js":
    /*!********************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/no_backspace_delete/plugin.js ***!
      \********************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Plugin: "input_autogrow" (Tom Select)
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      var self = this;
      var orig_deleteSelection = self.deleteSelection;
      this.hook('instead', 'deleteSelection', evt => {
        if (self.activeItems.length) {
          return orig_deleteSelection.call(self, evt);
        }
        return false;
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/optgroup_columns/plugin.js":
    /*!*****************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/optgroup_columns/plugin.js ***!
      \*****************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
     // ctrl key or apple key for ma
    
    /**
     * Get the closest node to the evt.target matching the selector
     * Stops at wrapper
     *
     */
    const parentMatch = (target, selector, wrapper) => {
      while (target && target.matches) {
        if (target.matches(selector)) {
          return target;
        }
        target = target.parentNode;
      }
    };
    
    /**
     * Get the index of an element amongst sibling nodes of the same type
     *
     */
    const nodeIndex = (el, amongst) => {
      if (!el) return -1;
      amongst = amongst || el.nodeName;
      var i = 0;
      while (el = el.previousElementSibling) {
        if (el.matches(amongst)) {
          i++;
        }
      }
      return i;
    };
    
    /**
     * Plugin: "optgroup_columns" (Tom Select.js)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      var self = this;
      var orig_keydown = self.onKeyDown;
      self.hook('instead', 'onKeyDown', evt => {
        var index, option, options, optgroup;
        if (!self.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
          return orig_keydown.call(self, evt);
        }
        self.ignoreHover = true;
        optgroup = parentMatch(self.activeOption, '[data-group]');
        index = nodeIndex(self.activeOption, '[data-selectable]');
        if (!optgroup) {
          return;
        }
        if (evt.keyCode === KEY_LEFT) {
          optgroup = optgroup.previousSibling;
        } else {
          optgroup = optgroup.nextSibling;
        }
        if (!optgroup) {
          return;
        }
        options = optgroup.querySelectorAll('[data-selectable]');
        option = options[Math.min(options.length - 1, index)];
        if (option) {
          self.setActiveOption(option);
        }
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/remove_button/plugin.js":
    /*!**************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/remove_button/plugin.js ***!
      \**************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Escapes a string for use within HTML.
     *
     */
    const escape_html = str => {
      return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
      if (evt) {
        evt.preventDefault();
        if (stop) {
          evt.stopPropagation();
        }
      }
    };
    
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
    };
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = query => {
      if (query.jquery) {
        return query[0];
      }
      if (query instanceof HTMLElement) {
        return query;
      }
      if (isHtmlString(query)) {
        var tpl = document.createElement('template');
        tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
        return tpl.content.firstChild;
      }
      return document.querySelector(query);
    };
    const isHtmlString = arg => {
      if (typeof arg === 'string' && arg.indexOf('<') > -1) {
        return true;
      }
      return false;
    };
    
    /**
     * Plugin: "remove_button" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin (userOptions) {
      const options = Object.assign({
        label: '&times;',
        title: 'Remove',
        className: 'remove',
        append: true
      }, userOptions);
    
      //options.className = 'remove-single';
      var self = this;
    
      // override the render method to add remove button to each item
      if (!options.append) {
        return;
      }
      var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
      self.hook('after', 'setupTemplates', () => {
        var orig_render_item = self.settings.render.item;
        self.settings.render.item = (data, escape) => {
          var item = getDom(orig_render_item.call(self, data, escape));
          var close_button = getDom(html);
          item.appendChild(close_button);
          addEvent(close_button, 'mousedown', evt => {
            preventDefault(evt, true);
          });
          addEvent(close_button, 'click', evt => {
            if (self.isLocked) return;
    
            // propagating will trigger the dropdown to show for single mode
            preventDefault(evt, true);
            if (self.isLocked) return;
            if (!self.shouldDelete([item], evt)) return;
            self.removeItem(item);
            self.refreshOptions(false);
            self.inputState();
          });
          return item;
        };
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/restore_on_backspace/plugin.js":
    /*!*********************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/restore_on_backspace/plugin.js ***!
      \*********************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Plugin: "restore_on_backspace" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin (userOptions) {
      const self = this;
      const options = Object.assign({
        text: option => {
          return option[self.settings.labelField];
        }
      }, userOptions);
      self.on('item_remove', function (value) {
        if (!self.isFocused) {
          return;
        }
        if (self.control_input.value.trim() === '') {
          var option = self.options[value];
          if (option) {
            self.setTextboxValue(options.text.call(self, option));
          }
        }
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/plugins/virtual_scroll/plugin.js":
    /*!***************************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/plugins/virtual_scroll/plugin.js ***!
      \***************************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ plugin)
    /* harmony export */ });
    /**
    * Tom Select v2.4.3
    * Licensed under the Apache License, Version 2.0 (the "License");
    */
    
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
      if (Array.isArray(object)) {
        object.forEach(callback);
      } else {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            callback(object[key], key);
          }
        }
      }
    };
    
    /**
     * Add css classes
     *
     */
    const addClasses = (elmts, ...classes) => {
      var norm_classes = classesArray(classes);
      elmts = castAsArray(elmts);
      elmts.map(el => {
        norm_classes.map(cls => {
          el.classList.add(cls);
        });
      });
    };
    
    /**
     * Return arguments
     *
     */
    const classesArray = args => {
      var classes = [];
      iterate(args, _classes => {
        if (typeof _classes === 'string') {
          _classes = _classes.trim().split(/[\t\n\f\r\s]/);
        }
        if (Array.isArray(_classes)) {
          classes = classes.concat(_classes);
        }
      });
      return classes.filter(Boolean);
    };
    
    /**
     * Create an array from arg if it's not already an array
     *
     */
    const castAsArray = arg => {
      if (!Array.isArray(arg)) {
        arg = [arg];
      }
      return arg;
    };
    
    /**
     * Plugin: "restore_on_backspace" (Tom Select)
     * Copyright (c) contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     */
    
    function plugin () {
      const self = this;
      const orig_canLoad = self.canLoad;
      const orig_clearActiveOption = self.clearActiveOption;
      const orig_loadCallback = self.loadCallback;
      var pagination = {};
      var dropdown_content;
      var loading_more = false;
      var load_more_opt;
      var default_values = [];
      if (!self.settings.shouldLoadMore) {
        // return true if additional results should be loaded
        self.settings.shouldLoadMore = () => {
          const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
          if (scroll_percent > 0.9) {
            return true;
          }
          if (self.activeOption) {
            var selectable = self.selectable();
            var index = Array.from(selectable).indexOf(self.activeOption);
            if (index >= selectable.length - 2) {
              return true;
            }
          }
          return false;
        };
      }
      if (!self.settings.firstUrl) {
        throw 'virtual_scroll plugin requires a firstUrl() method';
      }
    
      // in order for virtual scrolling to work,
      // options need to be ordered the same way they're returned from the remote data source
      self.settings.sortField = [{
        field: '$order'
      }, {
        field: '$score'
      }];
    
      // can we load more results for given query?
      const canLoadMore = query => {
        if (typeof self.settings.maxOptions === 'number' && dropdown_content.children.length >= self.settings.maxOptions) {
          return false;
        }
        if (query in pagination && pagination[query]) {
          return true;
        }
        return false;
      };
      const clearFilter = (option, value) => {
        if (self.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
          return true;
        }
        return false;
      };
    
      // set the next url that will be
      self.setNextUrl = (value, next_url) => {
        pagination[value] = next_url;
      };
    
      // getUrl() to be used in settings.load()
      self.getUrl = query => {
        if (query in pagination) {
          const next_url = pagination[query];
          pagination[query] = false;
          return next_url;
        }
    
        // if the user goes back to a previous query
        // we need to load the first page again
        self.clearPagination();
        return self.settings.firstUrl.call(self, query);
      };
    
      // clear pagination
      self.clearPagination = () => {
        pagination = {};
      };
    
      // don't clear the active option (and cause unwanted dropdown scroll)
      // while loading more results
      self.hook('instead', 'clearActiveOption', () => {
        if (loading_more) {
          return;
        }
        return orig_clearActiveOption.call(self);
      });
    
      // override the canLoad method
      self.hook('instead', 'canLoad', query => {
        // first time the query has been seen
        if (!(query in pagination)) {
          return orig_canLoad.call(self, query);
        }
        return canLoadMore(query);
      });
    
      // wrap the load
      self.hook('instead', 'loadCallback', (options, optgroups) => {
        if (!loading_more) {
          self.clearOptions(clearFilter);
        } else if (load_more_opt) {
          const first_option = options[0];
          if (first_option !== undefined) {
            load_more_opt.dataset.value = first_option[self.settings.valueField];
          }
        }
        orig_loadCallback.call(self, options, optgroups);
        loading_more = false;
      });
    
      // add templates to dropdown
      //	loading_more if we have another url in the queue
      //	no_more_results if we don't have another url in the queue
      self.hook('after', 'refreshOptions', () => {
        const query = self.lastValue;
        var option;
        if (canLoadMore(query)) {
          option = self.render('loading_more', {
            query: query
          });
          if (option) {
            option.setAttribute('data-selectable', ''); // so that navigating dropdown with [down] keypresses can navigate to this node
            load_more_opt = option;
          }
        } else if (query in pagination && !dropdown_content.querySelector('.no-results')) {
          option = self.render('no_more_results', {
            query: query
          });
        }
        if (option) {
          addClasses(option, self.settings.optionClass);
          dropdown_content.append(option);
        }
      });
    
      // add scroll listener and default templates
      self.on('initialize', () => {
        default_values = Object.keys(self.options);
        dropdown_content = self.dropdown_content;
    
        // default templates
        self.settings.render = Object.assign({}, {
          loading_more: () => {
            return `<div class="loading-more-results">Loading more results ... </div>`;
          },
          no_more_results: () => {
            return `<div class="no-more-results">No more results</div>`;
          }
        }, self.settings.render);
    
        // watch dropdown content scroll position
        dropdown_content.addEventListener('scroll', () => {
          if (!self.settings.shouldLoadMore.call(self)) {
            return;
          }
    
          // !important: this will get checked again in load() but we still need to check here otherwise loading_more will be set to true
          if (!canLoadMore(self.lastValue)) {
            return;
          }
    
          // don't call load() too much
          if (loading_more) return;
          loading_more = true;
          self.load.call(self, self.lastValue);
        });
      });
    }
    
    
    //# sourceMappingURL=plugin.js.map
    
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/tom-select.complete.js":
    /*!*****************************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/tom-select.complete.js ***!
      \*****************************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _tom_select_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tom-select.js */ "./node_modules/tom-select/dist/esm/tom-select.js");
    /* harmony import */ var _plugins_change_listener_plugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins/change_listener/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/change_listener/plugin.js");
    /* harmony import */ var _plugins_checkbox_options_plugin_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plugins/checkbox_options/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/checkbox_options/plugin.js");
    /* harmony import */ var _plugins_clear_button_plugin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins/clear_button/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/clear_button/plugin.js");
    /* harmony import */ var _plugins_drag_drop_plugin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugins/drag_drop/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/drag_drop/plugin.js");
    /* harmony import */ var _plugins_dropdown_header_plugin_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins/dropdown_header/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/dropdown_header/plugin.js");
    /* harmony import */ var _plugins_caret_position_plugin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugins/caret_position/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/caret_position/plugin.js");
    /* harmony import */ var _plugins_dropdown_input_plugin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugins/dropdown_input/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/dropdown_input/plugin.js");
    /* harmony import */ var _plugins_input_autogrow_plugin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugins/input_autogrow/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/input_autogrow/plugin.js");
    /* harmony import */ var _plugins_no_backspace_delete_plugin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./plugins/no_backspace_delete/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/no_backspace_delete/plugin.js");
    /* harmony import */ var _plugins_no_active_items_plugin_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./plugins/no_active_items/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/no_active_items/plugin.js");
    /* harmony import */ var _plugins_optgroup_columns_plugin_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./plugins/optgroup_columns/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/optgroup_columns/plugin.js");
    /* harmony import */ var _plugins_remove_button_plugin_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./plugins/remove_button/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/remove_button/plugin.js");
    /* harmony import */ var _plugins_restore_on_backspace_plugin_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./plugins/restore_on_backspace/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/restore_on_backspace/plugin.js");
    /* harmony import */ var _plugins_virtual_scroll_plugin_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./plugins/virtual_scroll/plugin.js */ "./node_modules/tom-select/dist/esm/plugins/virtual_scroll/plugin.js");
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('change_listener', _plugins_change_listener_plugin_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('checkbox_options', _plugins_checkbox_options_plugin_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('clear_button', _plugins_clear_button_plugin_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('drag_drop', _plugins_drag_drop_plugin_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('dropdown_header', _plugins_dropdown_header_plugin_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('caret_position', _plugins_caret_position_plugin_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('dropdown_input', _plugins_dropdown_input_plugin_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('input_autogrow', _plugins_input_autogrow_plugin_js__WEBPACK_IMPORTED_MODULE_8__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('no_backspace_delete', _plugins_no_backspace_delete_plugin_js__WEBPACK_IMPORTED_MODULE_9__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('no_active_items', _plugins_no_active_items_plugin_js__WEBPACK_IMPORTED_MODULE_10__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('optgroup_columns', _plugins_optgroup_columns_plugin_js__WEBPACK_IMPORTED_MODULE_11__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('remove_button', _plugins_remove_button_plugin_js__WEBPACK_IMPORTED_MODULE_12__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('restore_on_backspace', _plugins_restore_on_backspace_plugin_js__WEBPACK_IMPORTED_MODULE_13__["default"]);
    _tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"].define('virtual_scroll', _plugins_virtual_scroll_plugin_js__WEBPACK_IMPORTED_MODULE_14__["default"]);
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_tom_select_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
    //# sourceMappingURL=tom-select.complete.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/tom-select.js":
    /*!********************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/tom-select.js ***!
      \********************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ TomSelect)
    /* harmony export */ });
    /* harmony import */ var _contrib_microevent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contrib/microevent.js */ "./node_modules/tom-select/dist/esm/contrib/microevent.js");
    /* harmony import */ var _contrib_microplugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contrib/microplugin.js */ "./node_modules/tom-select/dist/esm/contrib/microplugin.js");
    /* harmony import */ var _orchidjs_sifter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @orchidjs/sifter */ "./node_modules/@orchidjs/sifter/dist/esm/sifter.js");
    /* harmony import */ var _orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @orchidjs/unicode-variants */ "./node_modules/@orchidjs/unicode-variants/dist/esm/index.js");
    /* harmony import */ var _contrib_highlight_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contrib/highlight.js */ "./node_modules/tom-select/dist/esm/contrib/highlight.js");
    /* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants.js */ "./node_modules/tom-select/dist/esm/constants.js");
    /* harmony import */ var _getSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getSettings.js */ "./node_modules/tom-select/dist/esm/getSettings.js");
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils.js */ "./node_modules/tom-select/dist/esm/utils.js");
    /* harmony import */ var _vanilla_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./vanilla.js */ "./node_modules/tom-select/dist/esm/vanilla.js");
    
    
    
    
    
    
    
    
    
    var instance_i = 0;
    class TomSelect extends (0,_contrib_microplugin_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_contrib_microevent_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        constructor(input_arg, user_settings) {
            super();
            this.order = 0;
            this.isOpen = false;
            this.isDisabled = false;
            this.isReadOnly = false;
            this.isInvalid = false; // @deprecated 1.8
            this.isValid = true;
            this.isLocked = false;
            this.isFocused = false;
            this.isInputHidden = false;
            this.isSetup = false;
            this.ignoreFocus = false;
            this.ignoreHover = false;
            this.hasOptions = false;
            this.lastValue = '';
            this.caretPos = 0;
            this.loading = 0;
            this.loadedSearches = {};
            this.activeOption = null;
            this.activeItems = [];
            this.optgroups = {};
            this.options = {};
            this.userOptions = {};
            this.items = [];
            this.refreshTimeout = null;
            instance_i++;
            var dir;
            var input = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(input_arg);
            if (input.tomselect) {
                throw new Error('Tom Select already initialized on this element');
            }
            input.tomselect = this;
            // detect rtl environment
            var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
            dir = computedStyle.getPropertyValue('direction');
            // setup default state
            const settings = (0,_getSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"])(input, user_settings);
            this.settings = settings;
            this.input = input;
            this.tabIndex = input.tabIndex || 0;
            this.is_select_tag = input.tagName.toLowerCase() === 'select';
            this.rtl = /rtl/i.test(dir);
            this.inputId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getId)(input, 'tomselect-' + instance_i);
            this.isRequired = input.required;
            // search system
            this.sifter = new _orchidjs_sifter__WEBPACK_IMPORTED_MODULE_2__.Sifter(this.options, { diacritics: settings.diacritics });
            // option-dependent defaults
            settings.mode = settings.mode || (settings.maxItems === 1 ? 'single' : 'multi');
            if (typeof settings.hideSelected !== 'boolean') {
                settings.hideSelected = settings.mode === 'multi';
            }
            if (typeof settings.hidePlaceholder !== 'boolean') {
                settings.hidePlaceholder = settings.mode !== 'multi';
            }
            // set up createFilter callback
            var filter = settings.createFilter;
            if (typeof filter !== 'function') {
                if (typeof filter === 'string') {
                    filter = new RegExp(filter);
                }
                if (filter instanceof RegExp) {
                    settings.createFilter = (input) => filter.test(input);
                }
                else {
                    settings.createFilter = (value) => {
                        return this.settings.duplicates || !this.options[value];
                    };
                }
            }
            this.initializePlugins(settings.plugins);
            this.setupCallbacks();
            this.setupTemplates();
            // Create all elements
            const wrapper = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)('<div>');
            const control = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)('<div>');
            const dropdown = this._render('dropdown');
            const dropdown_content = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(`<div role="listbox" tabindex="-1">`);
            const classes = this.input.getAttribute('class') || '';
            const inputMode = settings.mode;
            var control_input;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(wrapper, settings.wrapperClass, classes, inputMode);
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(control, settings.controlClass);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(wrapper, control);
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(dropdown, settings.dropdownClass, inputMode);
            if (settings.copyClassesToDropdown) {
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(dropdown, classes);
            }
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(dropdown_content, settings.dropdownContentClass);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(dropdown, dropdown_content);
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(settings.dropdownParent || wrapper).appendChild(dropdown);
            // default controlInput
            if ((0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.isHtmlString)(settings.controlInput)) {
                control_input = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(settings.controlInput);
                // set attributes
                var attrs = ['autocorrect', 'autocapitalize', 'autocomplete', 'spellcheck'];
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(attrs, (attr) => {
                    if (input.getAttribute(attr)) {
                        (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(control_input, { [attr]: input.getAttribute(attr) });
                    }
                });
                control_input.tabIndex = -1;
                control.appendChild(control_input);
                this.focus_node = control_input;
                // dom element
            }
            else if (settings.controlInput) {
                control_input = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(settings.controlInput);
                this.focus_node = control_input;
            }
            else {
                control_input = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)('<input/>');
                this.focus_node = control;
            }
            this.wrapper = wrapper;
            this.dropdown = dropdown;
            this.dropdown_content = dropdown_content;
            this.control = control;
            this.control_input = control_input;
            this.setup();
        }
        /**
         * set up event bindings.
         *
         */
        setup() {
            const self = this;
            const settings = self.settings;
            const control_input = self.control_input;
            const dropdown = self.dropdown;
            const dropdown_content = self.dropdown_content;
            const wrapper = self.wrapper;
            const control = self.control;
            const input = self.input;
            const focus_node = self.focus_node;
            const passive_event = { passive: true };
            const listboxId = self.inputId + '-ts-dropdown';
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(dropdown_content, {
                id: listboxId
            });
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(focus_node, {
                role: 'combobox',
                'aria-haspopup': 'listbox',
                'aria-expanded': 'false',
                'aria-controls': listboxId
            });
            const control_id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getId)(focus_node, self.inputId + '-ts-control');
            const query = "label[for='" + (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.escapeQuery)(self.inputId) + "']";
            const label = document.querySelector(query);
            const label_click = self.focus.bind(self);
            if (label) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(label, 'click', label_click);
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(label, { for: control_id });
                const label_id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getId)(label, self.inputId + '-ts-label');
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(focus_node, { 'aria-labelledby': label_id });
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(dropdown_content, { 'aria-labelledby': label_id });
            }
            wrapper.style.width = input.style.width;
            if (self.plugins.names.length) {
                const classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)([wrapper, dropdown], classes_plugins);
            }
            if ((settings.maxItems === null || settings.maxItems > 1) && self.is_select_tag) {
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(input, { multiple: 'multiple' });
            }
            if (settings.placeholder) {
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(control_input, { placeholder: settings.placeholder });
            }
            // if splitOn was not passed in, construct it from the delimiter to allow pasting universally
            if (!settings.splitOn && settings.delimiter) {
                settings.splitOn = new RegExp('\\s*' + (0,_orchidjs_unicode_variants__WEBPACK_IMPORTED_MODULE_3__.escape_regex)(settings.delimiter) + '+\\s*');
            }
            // debounce user defined load() if loadThrottle > 0
            // after initializePlugins() so plugins can create/modify user defined loaders
            if (settings.load && settings.loadThrottle) {
                settings.load = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.loadDebounce)(settings.load, settings.loadThrottle);
            }
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(dropdown, 'mousemove', () => {
                self.ignoreHover = false;
            });
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(dropdown, 'mouseenter', (e) => {
                var target_match = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.parentMatch)(e.target, '[data-selectable]', dropdown);
                if (target_match)
                    self.onOptionHover(e, target_match);
            }, { capture: true });
            // clicking on an option should select it
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(dropdown, 'click', (evt) => {
                const option = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.parentMatch)(evt.target, '[data-selectable]');
                if (option) {
                    self.onOptionSelect(evt, option);
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(evt, true);
                }
            });
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(control, 'click', (evt) => {
                var target_match = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.parentMatch)(evt.target, '[data-ts-item]', control);
                if (target_match && self.onItemSelect(evt, target_match)) {
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(evt, true);
                    return;
                }
                // retain focus (see control_input mousedown)
                if (control_input.value != '') {
                    return;
                }
                self.onClick();
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(evt, true);
            });
            // keydown on focus_node for arrow_down/arrow_up
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(focus_node, 'keydown', (e) => self.onKeyDown(e));
            // keypress and input/keyup
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(control_input, 'keypress', (e) => self.onKeyPress(e));
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(control_input, 'input', (e) => self.onInput(e));
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(focus_node, 'blur', (e) => self.onBlur(e));
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(focus_node, 'focus', (e) => self.onFocus(e));
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(control_input, 'paste', (e) => self.onPaste(e));
            const doc_mousedown = (evt) => {
                // blur if target is outside of this instance
                // dropdown is not always inside wrapper
                const target = evt.composedPath()[0];
                if (!wrapper.contains(target) && !dropdown.contains(target)) {
                    if (self.isFocused) {
                        self.blur();
                    }
                    self.inputState();
                    return;
                }
                // retain focus by preventing native handling. if the
                // event target is the input it should not be modified.
                // otherwise, text selection within the input won't work.
                // Fixes bug #212 which is no covered by tests
                if (target == control_input && self.isOpen) {
                    evt.stopPropagation();
                    // clicking anywhere in the control should not blur the control_input (which would close the dropdown)
                }
                else {
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(evt, true);
                }
            };
            const win_scroll = () => {
                if (self.isOpen) {
                    self.positionDropdown();
                }
            };
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(document, 'mousedown', doc_mousedown);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(window, 'scroll', win_scroll, passive_event);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(window, 'resize', win_scroll, passive_event);
            this._destroy = () => {
                document.removeEventListener('mousedown', doc_mousedown);
                window.removeEventListener('scroll', win_scroll);
                window.removeEventListener('resize', win_scroll);
                if (label)
                    label.removeEventListener('click', label_click);
            };
            // store original html and tab index so that they can be
            // restored when the destroy() method is called.
            this.revertSettings = {
                innerHTML: input.innerHTML,
                tabIndex: input.tabIndex
            };
            input.tabIndex = -1;
            input.insertAdjacentElement('afterend', self.wrapper);
            self.sync(false);
            settings.items = [];
            delete settings.optgroups;
            delete settings.options;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addEvent)(input, 'invalid', () => {
                if (self.isValid) {
                    self.isValid = false;
                    self.isInvalid = true;
                    self.refreshState();
                }
            });
            self.updateOriginalInput();
            self.refreshItems();
            self.close(false);
            self.inputState();
            self.isSetup = true;
            if (input.disabled) {
                self.disable();
            }
            else if (input.readOnly) {
                self.setReadOnly(true);
            }
            else {
                self.enable(); //sets tabIndex
            }
            self.on('change', this.onChange);
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(input, 'tomselected', 'ts-hidden-accessible');
            self.trigger('initialize');
            // preload options
            if (settings.preload === true) {
                self.preload();
            }
        }
        /**
         * Register options and optgroups
         *
         */
        setupOptions(options = [], optgroups = []) {
            // build options table
            this.addOptions(options);
            // build optgroup table
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(optgroups, (optgroup) => {
                this.registerOptionGroup(optgroup);
            });
        }
        /**
         * Sets up default rendering functions.
         */
        setupTemplates() {
            var self = this;
            var field_label = self.settings.labelField;
            var field_optgroup = self.settings.optgroupLabelField;
            var templates = {
                'optgroup': (data) => {
                    let optgroup = document.createElement('div');
                    optgroup.className = 'optgroup';
                    optgroup.appendChild(data.options);
                    return optgroup;
                },
                'optgroup_header': (data, escape) => {
                    return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
                },
                'option': (data, escape) => {
                    return '<div>' + escape(data[field_label]) + '</div>';
                },
                'item': (data, escape) => {
                    return '<div>' + escape(data[field_label]) + '</div>';
                },
                'option_create': (data, escape) => {
                    return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
                },
                'no_results': () => {
                    return '<div class="no-results">No results found</div>';
                },
                'loading': () => {
                    return '<div class="spinner"></div>';
                },
                'not_loading': () => { },
                'dropdown': () => {
                    return '<div></div>';
                }
            };
            self.settings.render = Object.assign({}, templates, self.settings.render);
        }
        /**
         * Maps fired events to callbacks provided
         * in the settings used when creating the control.
         */
        setupCallbacks() {
            var key, fn;
            var callbacks = {
                'initialize': 'onInitialize',
                'change': 'onChange',
                'item_add': 'onItemAdd',
                'item_remove': 'onItemRemove',
                'item_select': 'onItemSelect',
                'clear': 'onClear',
                'option_add': 'onOptionAdd',
                'option_remove': 'onOptionRemove',
                'option_clear': 'onOptionClear',
                'optgroup_add': 'onOptionGroupAdd',
                'optgroup_remove': 'onOptionGroupRemove',
                'optgroup_clear': 'onOptionGroupClear',
                'dropdown_open': 'onDropdownOpen',
                'dropdown_close': 'onDropdownClose',
                'type': 'onType',
                'load': 'onLoad',
                'focus': 'onFocus',
                'blur': 'onBlur'
            };
            for (key in callbacks) {
                fn = this.settings[callbacks[key]];
                if (fn)
                    this.on(key, fn);
            }
        }
        /**
         * Sync the Tom Select instance with the original input or select
         *
         */
        sync(get_settings = true) {
            const self = this;
            const settings = get_settings ? (0,_getSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"])(self.input, { delimiter: self.settings.delimiter }) : self.settings;
            self.setupOptions(settings.options, settings.optgroups);
            self.setValue(settings.items || [], true); // silent prevents recursion
            self.lastQuery = null; // so updated options will be displayed in dropdown
        }
        /**
         * Triggered when the main control element
         * has a click event.
         *
         */
        onClick() {
            var self = this;
            if (self.activeItems.length > 0) {
                self.clearActiveItems();
                self.focus();
                return;
            }
            if (self.isFocused && self.isOpen) {
                self.blur();
            }
            else {
                self.focus();
            }
        }
        /**
         * @deprecated v1.7
         *
         */
        onMouseDown() { }
        /**
         * Triggered when the value of the control has been changed.
         * This should propagate the event to the original DOM
         * input / select element.
         */
        onChange() {
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.triggerEvent)(this.input, 'input');
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.triggerEvent)(this.input, 'change');
        }
        /**
         * Triggered on <input> paste.
         *
         */
        onPaste(e) {
            var self = this;
            if (self.isInputHidden || self.isLocked) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                return;
            }
            // If a regex or string is included, this will split the pasted
            // input and create Items for each separate value
            if (!self.settings.splitOn) {
                return;
            }
            // Wait for pasted text to be recognized in value
            setTimeout(() => {
                var pastedText = self.inputValue();
                if (!pastedText.match(self.settings.splitOn)) {
                    return;
                }
                var splitInput = pastedText.trim().split(self.settings.splitOn);
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(splitInput, (piece) => {
                    const hash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(piece);
                    if (hash) {
                        if (this.options[piece]) {
                            self.addItem(piece);
                        }
                        else {
                            self.createItem(piece);
                        }
                    }
                });
            }, 0);
        }
        /**
         * Triggered on <input> keypress.
         *
         */
        onKeyPress(e) {
            var self = this;
            if (self.isLocked) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                return;
            }
            var character = String.fromCharCode(e.keyCode || e.which);
            if (self.settings.create && self.settings.mode === 'multi' && character === self.settings.delimiter) {
                self.createItem();
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                return;
            }
        }
        /**
         * Triggered on <input> keydown.
         *
         */
        onKeyDown(e) {
            var self = this;
            self.ignoreHover = true;
            if (self.isLocked) {
                if (e.keyCode !== _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_TAB) {
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                }
                return;
            }
            switch (e.keyCode) {
                // ctrl+A: select all
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_A:
                    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)(_constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_SHORTCUT, e)) {
                        if (self.control_input.value == '') {
                            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                            self.selectAll();
                            return;
                        }
                    }
                    break;
                // esc: close dropdown
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_ESC:
                    if (self.isOpen) {
                        (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e, true);
                        self.close();
                    }
                    self.clearActiveItems();
                    return;
                // down: open dropdown or move selection down
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_DOWN:
                    if (!self.isOpen && self.hasOptions) {
                        self.open();
                    }
                    else if (self.activeOption) {
                        let next = self.getAdjacent(self.activeOption, 1);
                        if (next)
                            self.setActiveOption(next);
                    }
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                    return;
                // up: move selection up
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_UP:
                    if (self.activeOption) {
                        let prev = self.getAdjacent(self.activeOption, -1);
                        if (prev)
                            self.setActiveOption(prev);
                    }
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                    return;
                // return: select active option
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_RETURN:
                    if (self.canSelect(self.activeOption)) {
                        self.onOptionSelect(e, self.activeOption);
                        (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                        // if the option_create=null, the dropdown might be closed
                    }
                    else if (self.settings.create && self.createItem()) {
                        (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                        // don't submit form when searching for a value
                    }
                    else if (document.activeElement == self.control_input && self.isOpen) {
                        (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                    }
                    return;
                // left: modifiy item selection to the left
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_LEFT:
                    self.advanceSelection(-1, e);
                    return;
                // right: modifiy item selection to the right
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_RIGHT:
                    self.advanceSelection(1, e);
                    return;
                // tab: select active option and/or create item
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_TAB:
                    if (self.settings.selectOnTab) {
                        if (self.canSelect(self.activeOption)) {
                            self.onOptionSelect(e, self.activeOption);
                            // prevent default [tab] behaviour of jump to the next field
                            // if select isFull, then the dropdown won't be open and [tab] will work normally
                            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                        }
                        if (self.settings.create && self.createItem()) {
                            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                        }
                    }
                    return;
                // delete|backspace: delete items
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_BACKSPACE:
                case _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_DELETE:
                    self.deleteSelection(e);
                    return;
            }
            // don't enter text in the control_input when active items are selected
            if (self.isInputHidden && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)(_constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_SHORTCUT, e)) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
            }
        }
        /**
         * Triggered on <input> keyup.
         *
         */
        onInput(e) {
            if (this.isLocked) {
                return;
            }
            const value = this.inputValue();
            if (this.lastValue === value)
                return;
            this.lastValue = value;
            if (value == '') {
                this._onInput();
                return;
            }
            if (this.refreshTimeout) {
                window.clearTimeout(this.refreshTimeout);
            }
            this.refreshTimeout = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.timeout)(() => {
                this.refreshTimeout = null;
                this._onInput();
            }, this.settings.refreshThrottle);
        }
        _onInput() {
            const value = this.lastValue;
            if (this.settings.shouldLoad.call(this, value)) {
                this.load(value);
            }
            this.refreshOptions();
            this.trigger('type', value);
        }
        /**
         * Triggered when the user rolls over
         * an option in the autocomplete dropdown menu.
         *
         */
        onOptionHover(evt, option) {
            if (this.ignoreHover)
                return;
            this.setActiveOption(option, false);
        }
        /**
         * Triggered on <input> focus.
         *
         */
        onFocus(e) {
            var self = this;
            var wasFocused = self.isFocused;
            if (self.isDisabled || self.isReadOnly) {
                self.blur();
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
                return;
            }
            if (self.ignoreFocus)
                return;
            self.isFocused = true;
            if (self.settings.preload === 'focus')
                self.preload();
            if (!wasFocused)
                self.trigger('focus');
            if (!self.activeItems.length) {
                self.inputState();
                self.refreshOptions(!!self.settings.openOnFocus);
            }
            self.refreshState();
        }
        /**
         * Triggered on <input> blur.
         *
         */
        onBlur(e) {
            if (document.hasFocus() === false)
                return;
            var self = this;
            if (!self.isFocused)
                return;
            self.isFocused = false;
            self.ignoreFocus = false;
            var deactivate = () => {
                self.close();
                self.setActiveItem();
                self.setCaret(self.items.length);
                self.trigger('blur');
            };
            if (self.settings.create && self.settings.createOnBlur) {
                self.createItem(null, deactivate);
            }
            else {
                deactivate();
            }
        }
        /**
         * Triggered when the user clicks on an option
         * in the autocomplete dropdown menu.
         *
         */
        onOptionSelect(evt, option) {
            var value, self = this;
            // should not be possible to trigger a option under a disabled optgroup
            if (option.parentElement && option.parentElement.matches('[data-disabled]')) {
                return;
            }
            if (option.classList.contains('create')) {
                self.createItem(null, () => {
                    if (self.settings.closeAfterSelect) {
                        self.close();
                    }
                });
            }
            else {
                value = option.dataset.value;
                if (typeof value !== 'undefined') {
                    self.lastQuery = null;
                    self.addItem(value);
                    if (self.settings.closeAfterSelect) {
                        self.close();
                    }
                    if (!self.settings.hideSelected && evt.type && /click/.test(evt.type)) {
                        self.setActiveOption(option);
                    }
                }
            }
        }
        /**
         * Return true if the given option can be selected
         *
         */
        canSelect(option) {
            if (this.isOpen && option && this.dropdown_content.contains(option)) {
                return true;
            }
            return false;
        }
        /**
         * Triggered when the user clicks on an item
         * that has been selected.
         *
         */
        onItemSelect(evt, item) {
            var self = this;
            if (!self.isLocked && self.settings.mode === 'multi') {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(evt);
                self.setActiveItem(item, evt);
                return true;
            }
            return false;
        }
        /**
         * Determines whether or not to invoke
         * the user-provided option provider / loader
         *
         * Note, there is a subtle difference between
         * this.canLoad() and this.settings.shouldLoad();
         *
         *	- settings.shouldLoad() is a user-input validator.
         *	When false is returned, the not_loading template
         *	will be added to the dropdown
         *
         *	- canLoad() is lower level validator that checks
         * 	the Tom Select instance. There is no inherent user
         *	feedback when canLoad returns false
         *
         */
        canLoad(value) {
            if (!this.settings.load)
                return false;
            if (this.loadedSearches.hasOwnProperty(value))
                return false;
            return true;
        }
        /**
         * Invokes the user-provided option provider / loader.
         *
         */
        load(value) {
            const self = this;
            if (!self.canLoad(value))
                return;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(self.wrapper, self.settings.loadingClass);
            self.loading++;
            const callback = self.loadCallback.bind(self);
            self.settings.load.call(self, value, callback);
        }
        /**
         * Invoked by the user-provided option provider
         *
         */
        loadCallback(options, optgroups) {
            const self = this;
            self.loading = Math.max(self.loading - 1, 0);
            self.lastQuery = null;
            self.clearActiveOption(); // when new results load, focus should be on first option
            self.setupOptions(options, optgroups);
            self.refreshOptions(self.isFocused && !self.isInputHidden);
            if (!self.loading) {
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(self.wrapper, self.settings.loadingClass);
            }
            self.trigger('load', options, optgroups);
        }
        preload() {
            var classList = this.wrapper.classList;
            if (classList.contains('preloaded'))
                return;
            classList.add('preloaded');
            this.load('');
        }
        /**
         * Sets the input field of the control to the specified value.
         *
         */
        setTextboxValue(value = '') {
            var input = this.control_input;
            var changed = input.value !== value;
            if (changed) {
                input.value = value;
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.triggerEvent)(input, 'update');
                this.lastValue = value;
            }
        }
        /**
         * Returns the value of the control. If multiple items
         * can be selected (e.g. <select multiple>), this returns
         * an array. If only one item can be selected, this
         * returns a string.
         *
         */
        getValue() {
            if (this.is_select_tag && this.input.hasAttribute('multiple')) {
                return this.items;
            }
            return this.items.join(this.settings.delimiter);
        }
        /**
         * Resets the selected items to the given value.
         *
         */
        setValue(value, silent) {
            var events = silent ? [] : ['change'];
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.debounce_events)(this, events, () => {
                this.clear(silent);
                this.addItems(value, silent);
            });
        }
        /**
         * Resets the number of max items to the given value
         *
         */
        setMaxItems(value) {
            if (value === 0)
                value = null; //reset to unlimited items.
            this.settings.maxItems = value;
            this.refreshState();
        }
        /**
         * Sets the selected item.
         *
         */
        setActiveItem(item, e) {
            var self = this;
            var eventName;
            var i, begin, end, swap;
            var last;
            if (self.settings.mode === 'single')
                return;
            // clear the active selection
            if (!item) {
                self.clearActiveItems();
                if (self.isFocused) {
                    self.inputState();
                }
                return;
            }
            // modify selection
            eventName = e && e.type.toLowerCase();
            if (eventName === 'click' && (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)('shiftKey', e) && self.activeItems.length) {
                last = self.getLastActive();
                begin = Array.prototype.indexOf.call(self.control.children, last);
                end = Array.prototype.indexOf.call(self.control.children, item);
                if (begin > end) {
                    swap = begin;
                    begin = end;
                    end = swap;
                }
                for (i = begin; i <= end; i++) {
                    item = self.control.children[i];
                    if (self.activeItems.indexOf(item) === -1) {
                        self.setActiveItemClass(item);
                    }
                }
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e);
            }
            else if ((eventName === 'click' && (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)(_constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_SHORTCUT, e)) || (eventName === 'keydown' && (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)('shiftKey', e))) {
                if (item.classList.contains('active')) {
                    self.removeActiveItem(item);
                }
                else {
                    self.setActiveItemClass(item);
                }
            }
            else {
                self.clearActiveItems();
                self.setActiveItemClass(item);
            }
            // ensure control has focus
            self.inputState();
            if (!self.isFocused) {
                self.focus();
            }
        }
        /**
         * Set the active and last-active classes
         *
         */
        setActiveItemClass(item) {
            const self = this;
            const last_active = self.control.querySelector('.last-active');
            if (last_active)
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(last_active, 'last-active');
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(item, 'active last-active');
            self.trigger('item_select', item);
            if (self.activeItems.indexOf(item) == -1) {
                self.activeItems.push(item);
            }
        }
        /**
         * Remove active item
         *
         */
        removeActiveItem(item) {
            var idx = this.activeItems.indexOf(item);
            this.activeItems.splice(idx, 1);
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(item, 'active');
        }
        /**
         * Clears all the active items
         *
         */
        clearActiveItems() {
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(this.activeItems, 'active');
            this.activeItems = [];
        }
        /**
         * Sets the selected item in the dropdown menu
         * of available options.
         *
         */
        setActiveOption(option, scroll = true) {
            if (option === this.activeOption) {
                return;
            }
            this.clearActiveOption();
            if (!option)
                return;
            this.activeOption = option;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(this.focus_node, { 'aria-activedescendant': option.getAttribute('id') });
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(option, { 'aria-selected': 'true' });
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(option, 'active');
            if (scroll)
                this.scrollToOption(option);
        }
        /**
         * Sets the dropdown_content scrollTop to display the option
         *
         */
        scrollToOption(option, behavior) {
            if (!option)
                return;
            const content = this.dropdown_content;
            const height_menu = content.clientHeight;
            const scrollTop = content.scrollTop || 0;
            const height_item = option.offsetHeight;
            const y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;
            if (y + height_item > height_menu + scrollTop) {
                this.scroll(y - height_menu + height_item, behavior);
            }
            else if (y < scrollTop) {
                this.scroll(y, behavior);
            }
        }
        /**
         * Scroll the dropdown to the given position
         *
         */
        scroll(scrollTop, behavior) {
            const content = this.dropdown_content;
            if (behavior) {
                content.style.scrollBehavior = behavior;
            }
            content.scrollTop = scrollTop;
            content.style.scrollBehavior = '';
        }
        /**
         * Clears the active option
         *
         */
        clearActiveOption() {
            if (this.activeOption) {
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(this.activeOption, 'active');
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(this.activeOption, { 'aria-selected': null });
            }
            this.activeOption = null;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(this.focus_node, { 'aria-activedescendant': null });
        }
        /**
         * Selects all items (CTRL + A).
         */
        selectAll() {
            const self = this;
            if (self.settings.mode === 'single')
                return;
            const activeItems = self.controlChildren();
            if (!activeItems.length)
                return;
            self.inputState();
            self.close();
            self.activeItems = activeItems;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(activeItems, (item) => {
                self.setActiveItemClass(item);
            });
        }
        /**
         * Determines if the control_input should be in a hidden or visible state
         *
         */
        inputState() {
            var self = this;
            if (!self.control.contains(self.control_input))
                return;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(self.control_input, { placeholder: self.settings.placeholder });
            if (self.activeItems.length > 0 || (!self.isFocused && self.settings.hidePlaceholder && self.items.length > 0)) {
                self.setTextboxValue();
                self.isInputHidden = true;
            }
            else {
                if (self.settings.hidePlaceholder && self.items.length > 0) {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(self.control_input, { placeholder: '' });
                }
                self.isInputHidden = false;
            }
            self.wrapper.classList.toggle('input-hidden', self.isInputHidden);
        }
        /**
         * Get the input value
         */
        inputValue() {
            return this.control_input.value.trim();
        }
        /**
         * Gives the control focus.
         */
        focus() {
            var self = this;
            if (self.isDisabled || self.isReadOnly)
                return;
            self.ignoreFocus = true;
            if (self.control_input.offsetWidth) {
                self.control_input.focus();
            }
            else {
                self.focus_node.focus();
            }
            setTimeout(() => {
                self.ignoreFocus = false;
                self.onFocus();
            }, 0);
        }
        /**
         * Forces the control out of focus.
         *
         */
        blur() {
            this.focus_node.blur();
            this.onBlur();
        }
        /**
         * Returns a function that scores an object
         * to show how good of a match it is to the
         * provided query.
         *
         * @return {function}
         */
        getScoreFunction(query) {
            return this.sifter.getScoreFunction(query, this.getSearchOptions());
        }
        /**
         * Returns search options for sifter (the system
         * for scoring and sorting results).
         *
         * @see https://github.com/orchidjs/sifter.js
         * @return {object}
         */
        getSearchOptions() {
            var settings = this.settings;
            var sort = settings.sortField;
            if (typeof settings.sortField === 'string') {
                sort = [{ field: settings.sortField }];
            }
            return {
                fields: settings.searchField,
                conjunction: settings.searchConjunction,
                sort: sort,
                nesting: settings.nesting
            };
        }
        /**
         * Searches through available options and returns
         * a sorted array of matches.
         *
         */
        search(query) {
            var result, calculateScore;
            var self = this;
            var options = this.getSearchOptions();
            // validate user-provided result scoring function
            if (self.settings.score) {
                calculateScore = self.settings.score.call(self, query);
                if (typeof calculateScore !== 'function') {
                    throw new Error('Tom Select "score" setting must be a function that returns a function');
                }
            }
            // perform search
            if (query !== self.lastQuery) {
                self.lastQuery = query;
                result = self.sifter.search(query, Object.assign(options, { score: calculateScore }));
                self.currentResults = result;
            }
            else {
                result = Object.assign({}, self.currentResults);
            }
            // filter out selected items
            if (self.settings.hideSelected) {
                result.items = result.items.filter((item) => {
                    let hashed = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(item.id);
                    return !(hashed && self.items.indexOf(hashed) !== -1);
                });
            }
            return result;
        }
        /**
         * Refreshes the list of available options shown
         * in the autocomplete dropdown menu.
         *
         */
        refreshOptions(triggerDropdown = true) {
            var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
            var create;
            const groups = {};
            const groups_order = [];
            var self = this;
            var query = self.inputValue();
            const same_query = query === self.lastQuery || (query == '' && self.lastQuery == null);
            var results = self.search(query);
            var active_option = null;
            var show_dropdown = self.settings.shouldOpen || false;
            var dropdown_content = self.dropdown_content;
            if (same_query) {
                active_option = self.activeOption;
                if (active_option) {
                    active_group = active_option.closest('[data-group]');
                }
            }
            // build markup
            n = results.items.length;
            if (typeof self.settings.maxOptions === 'number') {
                n = Math.min(n, self.settings.maxOptions);
            }
            if (n > 0) {
                show_dropdown = true;
            }
            // get fragment for group and the position of the group in group_order
            const getGroupFragment = (optgroup, order) => {
                let group_order_i = groups[optgroup];
                if (group_order_i !== undefined) {
                    let order_group = groups_order[group_order_i];
                    if (order_group !== undefined) {
                        return [group_order_i, order_group.fragment];
                    }
                }
                let group_fragment = document.createDocumentFragment();
                group_order_i = groups_order.length;
                groups_order.push({ fragment: group_fragment, order, optgroup });
                return [group_order_i, group_fragment];
            };
            // render and group available options individually
            for (i = 0; i < n; i++) {
                // get option dom element
                let item = results.items[i];
                if (!item)
                    continue;
                let opt_value = item.id;
                let option = self.options[opt_value];
                if (option === undefined)
                    continue;
                let opt_hash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.get_hash)(opt_value);
                let option_el = self.getOption(opt_hash, true);
                // toggle 'selected' class
                if (!self.settings.hideSelected) {
                    option_el.classList.toggle('selected', self.items.includes(opt_hash));
                }
                optgroup = option[self.settings.optgroupField] || '';
                optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];
                for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
                    optgroup = optgroups[j];
                    let order = option.$order;
                    let self_optgroup = self.optgroups[optgroup];
                    if (self_optgroup === undefined) {
                        optgroup = '';
                    }
                    else {
                        order = self_optgroup.$order;
                    }
                    const [group_order_i, group_fragment] = getGroupFragment(optgroup, order);
                    // nodes can only have one parent, so if the option is in mutple groups, we need a clone
                    if (j > 0) {
                        option_el = option_el.cloneNode(true);
                        (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(option_el, { id: option.$id + '-clone-' + j, 'aria-selected': null });
                        option_el.classList.add('ts-cloned');
                        (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(option_el, 'active');
                        // make sure we keep the activeOption in the same group
                        if (self.activeOption && self.activeOption.dataset.value == opt_value) {
                            if (active_group && active_group.dataset.group === optgroup.toString()) {
                                active_option = option_el;
                            }
                        }
                    }
                    group_fragment.appendChild(option_el);
                    if (optgroup != '') {
                        groups[optgroup] = group_order_i;
                    }
                }
            }
            // sort optgroups
            if (self.settings.lockOptgroupOrder) {
                groups_order.sort((a, b) => {
                    return a.order - b.order;
                });
            }
            // render optgroup headers & join groups
            html = document.createDocumentFragment();
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(groups_order, (group_order) => {
                let group_fragment = group_order.fragment;
                let optgroup = group_order.optgroup;
                if (!group_fragment || !group_fragment.children.length)
                    return;
                let group_heading = self.optgroups[optgroup];
                if (group_heading !== undefined) {
                    let group_options = document.createDocumentFragment();
                    let header = self.render('optgroup_header', group_heading);
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(group_options, header);
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(group_options, group_fragment);
                    let group_html = self.render('optgroup', { group: group_heading, options: group_options });
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(html, group_html);
                }
                else {
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(html, group_fragment);
                }
            });
            dropdown_content.innerHTML = '';
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.append)(dropdown_content, html);
            // highlight matching terms inline
            if (self.settings.highlight) {
                (0,_contrib_highlight_js__WEBPACK_IMPORTED_MODULE_4__.removeHighlight)(dropdown_content);
                if (results.query.length && results.tokens.length) {
                    (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(results.tokens, (tok) => {
                        (0,_contrib_highlight_js__WEBPACK_IMPORTED_MODULE_4__.highlight)(dropdown_content, tok.regex);
                    });
                }
            }
            // helper method for adding templates to dropdown
            var add_template = (template) => {
                let content = self.render(template, { input: query });
                if (content) {
                    show_dropdown = true;
                    dropdown_content.insertBefore(content, dropdown_content.firstChild);
                }
                return content;
            };
            // add loading message
            if (self.loading) {
                add_template('loading');
                // invalid query
            }
            else if (!self.settings.shouldLoad.call(self, query)) {
                add_template('not_loading');
                // add no_results message
            }
            else if (results.items.length === 0) {
                add_template('no_results');
            }
            // add create option
            has_create_option = self.canCreate(query);
            if (has_create_option) {
                create = add_template('option_create');
            }
            // activate
            self.hasOptions = results.items.length > 0 || has_create_option;
            if (show_dropdown) {
                if (results.items.length > 0) {
                    if (!active_option && self.settings.mode === 'single' && self.items[0] != undefined) {
                        active_option = self.getOption(self.items[0]);
                    }
                    if (!dropdown_content.contains(active_option)) {
                        let active_index = 0;
                        if (create && !self.settings.addPrecedence) {
                            active_index = 1;
                        }
                        active_option = self.selectable()[active_index];
                    }
                }
                else if (create) {
                    active_option = create;
                }
                if (triggerDropdown && !self.isOpen) {
                    self.open();
                    self.scrollToOption(active_option, 'auto');
                }
                self.setActiveOption(active_option);
            }
            else {
                self.clearActiveOption();
                if (triggerDropdown && self.isOpen) {
                    self.close(false); // if create_option=null, we want the dropdown to close but not reset the textbox value
                }
            }
        }
        /**
         * Return list of selectable options
         *
         */
        selectable() {
            return this.dropdown_content.querySelectorAll('[data-selectable]');
        }
        /**
         * Adds an available option. If it already exists,
         * nothing will happen. Note: this does not refresh
         * the options list dropdown (use `refreshOptions`
         * for that).
         *
         * Usage:
         *
         *   this.addOption(data)
         *
         */
        addOption(data, user_created = false) {
            const self = this;
            // @deprecated 1.7.7
            // use addOptions( array, user_created ) for adding multiple options
            if (Array.isArray(data)) {
                self.addOptions(data, user_created);
                return false;
            }
            const key = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(data[self.settings.valueField]);
            if (key === null || self.options.hasOwnProperty(key)) {
                return false;
            }
            data.$order = data.$order || ++self.order;
            data.$id = self.inputId + '-opt-' + data.$order;
            self.options[key] = data;
            self.lastQuery = null;
            if (user_created) {
                self.userOptions[key] = user_created;
                self.trigger('option_add', key, data);
            }
            return key;
        }
        /**
         * Add multiple options
         *
         */
        addOptions(data, user_created = false) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(data, (dat) => {
                this.addOption(dat, user_created);
            });
        }
        /**
         * @deprecated 1.7.7
         */
        registerOption(data) {
            return this.addOption(data);
        }
        /**
         * Registers an option group to the pool of option groups.
         *
         * @return {boolean|string}
         */
        registerOptionGroup(data) {
            var key = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(data[this.settings.optgroupValueField]);
            if (key === null)
                return false;
            data.$order = data.$order || ++this.order;
            this.optgroups[key] = data;
            return key;
        }
        /**
         * Registers a new optgroup for options
         * to be bucketed into.
         *
         */
        addOptionGroup(id, data) {
            var hashed_id;
            data[this.settings.optgroupValueField] = id;
            if (hashed_id = this.registerOptionGroup(data)) {
                this.trigger('optgroup_add', hashed_id, data);
            }
        }
        /**
         * Removes an existing option group.
         *
         */
        removeOptionGroup(id) {
            if (this.optgroups.hasOwnProperty(id)) {
                delete this.optgroups[id];
                this.clearCache();
                this.trigger('optgroup_remove', id);
            }
        }
        /**
         * Clears all existing option groups.
         */
        clearOptionGroups() {
            this.optgroups = {};
            this.clearCache();
            this.trigger('optgroup_clear');
        }
        /**
         * Updates an option available for selection. If
         * it is visible in the selected items or options
         * dropdown, it will be re-rendered automatically.
         *
         */
        updateOption(value, data) {
            const self = this;
            var item_new;
            var index_item;
            const value_old = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(value);
            const value_new = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(data[self.settings.valueField]);
            // sanity checks
            if (value_old === null)
                return;
            const data_old = self.options[value_old];
            if (data_old == undefined)
                return;
            if (typeof value_new !== 'string')
                throw new Error('Value must be set in option data');
            const option = self.getOption(value_old);
            const item = self.getItem(value_old);
            data.$order = data.$order || data_old.$order;
            delete self.options[value_old];
            // invalidate render cache
            // don't remove existing node yet, we'll remove it after replacing it
            self.uncacheValue(value_new);
            self.options[value_new] = data;
            // update the option if it's in the dropdown
            if (option) {
                if (self.dropdown_content.contains(option)) {
                    const option_new = self._render('option', data);
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.replaceNode)(option, option_new);
                    if (self.activeOption === option) {
                        self.setActiveOption(option_new);
                    }
                }
                option.remove();
            }
            // update the item if we have one
            if (item) {
                index_item = self.items.indexOf(value_old);
                if (index_item !== -1) {
                    self.items.splice(index_item, 1, value_new);
                }
                item_new = self._render('item', data);
                if (item.classList.contains('active'))
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(item_new, 'active');
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.replaceNode)(item, item_new);
            }
            // invalidate last query because we might have updated the sortField
            self.lastQuery = null;
        }
        /**
         * Removes a single option.
         *
         */
        removeOption(value, silent) {
            const self = this;
            value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.get_hash)(value);
            self.uncacheValue(value);
            delete self.userOptions[value];
            delete self.options[value];
            self.lastQuery = null;
            self.trigger('option_remove', value);
            self.removeItem(value, silent);
        }
        /**
         * Clears all options.
         */
        clearOptions(filter) {
            const boundFilter = (filter || this.clearFilter).bind(this);
            this.loadedSearches = {};
            this.userOptions = {};
            this.clearCache();
            const selected = {};
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(this.options, (option, key) => {
                if (boundFilter(option, key)) {
                    selected[key] = option;
                }
            });
            this.options = this.sifter.items = selected;
            this.lastQuery = null;
            this.trigger('option_clear');
        }
        /**
         * Used by clearOptions() to decide whether or not an option should be removed
         * Return true to keep an option, false to remove
         *
         */
        clearFilter(option, value) {
            if (this.items.indexOf(value) >= 0) {
                return true;
            }
            return false;
        }
        /**
         * Returns the dom element of the option
         * matching the given value.
         *
         */
        getOption(value, create = false) {
            const hashed = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(value);
            if (hashed === null)
                return null;
            const option = this.options[hashed];
            if (option != undefined) {
                if (option.$div) {
                    return option.$div;
                }
                if (create) {
                    return this._render('option', option);
                }
            }
            return null;
        }
        /**
         * Returns the dom element of the next or previous dom element of the same type
         * Note: adjacent options may not be adjacent DOM elements (optgroups)
         *
         */
        getAdjacent(option, direction, type = 'option') {
            var self = this, all;
            if (!option) {
                return null;
            }
            if (type == 'item') {
                all = self.controlChildren();
            }
            else {
                all = self.dropdown_content.querySelectorAll('[data-selectable]');
            }
            for (let i = 0; i < all.length; i++) {
                if (all[i] != option) {
                    continue;
                }
                if (direction > 0) {
                    return all[i + 1];
                }
                return all[i - 1];
            }
            return null;
        }
        /**
         * Returns the dom element of the item
         * matching the given value.
         *
         */
        getItem(item) {
            if (typeof item == 'object') {
                return item;
            }
            var value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(item);
            return value !== null
                ? this.control.querySelector(`[data-value="${(0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addSlashes)(value)}"]`)
                : null;
        }
        /**
         * "Selects" multiple items at once. Adds them to the list
         * at the current caret position.
         *
         */
        addItems(values, silent) {
            var self = this;
            var items = Array.isArray(values) ? values : [values];
            items = items.filter(x => self.items.indexOf(x) === -1);
            const last_item = items[items.length - 1];
            items.forEach(item => {
                self.isPending = (item !== last_item);
                self.addItem(item, silent);
            });
        }
        /**
         * "Selects" an item. Adds it to the list
         * at the current caret position.
         *
         */
        addItem(value, silent) {
            var events = silent ? [] : ['change', 'dropdown_close'];
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.debounce_events)(this, events, () => {
                var item, wasFull;
                const self = this;
                const inputMode = self.settings.mode;
                const hashed = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(value);
                if (hashed && self.items.indexOf(hashed) !== -1) {
                    if (inputMode === 'single') {
                        self.close();
                    }
                    if (inputMode === 'single' || !self.settings.duplicates) {
                        return;
                    }
                }
                if (hashed === null || !self.options.hasOwnProperty(hashed))
                    return;
                if (inputMode === 'single')
                    self.clear(silent);
                if (inputMode === 'multi' && self.isFull())
                    return;
                item = self._render('item', self.options[hashed]);
                if (self.control.contains(item)) { // duplicates
                    item = item.cloneNode(true);
                }
                wasFull = self.isFull();
                self.items.splice(self.caretPos, 0, hashed);
                self.insertAtCaret(item);
                if (self.isSetup) {
                    // update menu / remove the option (if this is not one item being added as part of series)
                    if (!self.isPending && self.settings.hideSelected) {
                        let option = self.getOption(hashed);
                        let next = self.getAdjacent(option, 1);
                        if (next) {
                            self.setActiveOption(next);
                        }
                    }
                    // refreshOptions after setActiveOption(),
                    // otherwise setActiveOption() will be called by refreshOptions() with the wrong value
                    if (!self.isPending && !self.settings.closeAfterSelect) {
                        self.refreshOptions(self.isFocused && inputMode !== 'single');
                    }
                    // hide the menu if the maximum number of items have been selected or no options are left
                    if (self.settings.closeAfterSelect != false && self.isFull()) {
                        self.close();
                    }
                    else if (!self.isPending) {
                        self.positionDropdown();
                    }
                    self.trigger('item_add', hashed, item);
                    if (!self.isPending) {
                        self.updateOriginalInput({ silent: silent });
                    }
                }
                if (!self.isPending || (!wasFull && self.isFull())) {
                    self.inputState();
                    self.refreshState();
                }
            });
        }
        /**
         * Removes the selected item matching
         * the provided value.
         *
         */
        removeItem(item = null, silent) {
            const self = this;
            item = self.getItem(item);
            if (!item)
                return;
            var i, idx;
            const value = item.dataset.value;
            i = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.nodeIndex)(item);
            item.remove();
            if (item.classList.contains('active')) {
                idx = self.activeItems.indexOf(item);
                self.activeItems.splice(idx, 1);
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(item, 'active');
            }
            self.items.splice(i, 1);
            self.lastQuery = null;
            if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
                self.removeOption(value, silent);
            }
            if (i < self.caretPos) {
                self.setCaret(self.caretPos - 1);
            }
            self.updateOriginalInput({ silent: silent });
            self.refreshState();
            self.positionDropdown();
            self.trigger('item_remove', value, item);
        }
        /**
         * Invokes the `create` method provided in the
         * TomSelect options that should provide the data
         * for the new item, given the user input.
         *
         * Once this completes, it will be added
         * to the item list.
         *
         */
        createItem(input = null, callback = () => { }) {
            // triggerDropdown parameter @deprecated 2.1.1
            if (arguments.length === 3) {
                callback = arguments[2];
            }
            if (typeof callback != 'function') {
                callback = () => { };
            }
            var self = this;
            var caret = self.caretPos;
            var output;
            input = input || self.inputValue();
            if (!self.canCreate(input)) {
                callback();
                return false;
            }
            self.lock();
            var created = false;
            var create = (data) => {
                self.unlock();
                if (!data || typeof data !== 'object')
                    return callback();
                var value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.hash_key)(data[self.settings.valueField]);
                if (typeof value !== 'string') {
                    return callback();
                }
                self.setTextboxValue();
                self.addOption(data, true);
                self.setCaret(caret);
                self.addItem(value);
                callback(data);
                created = true;
            };
            if (typeof self.settings.create === 'function') {
                output = self.settings.create.call(this, input, create);
            }
            else {
                output = {
                    [self.settings.labelField]: input,
                    [self.settings.valueField]: input,
                };
            }
            if (!created) {
                create(output);
            }
            return true;
        }
        /**
         * Re-renders the selected item lists.
         */
        refreshItems() {
            var self = this;
            self.lastQuery = null;
            if (self.isSetup) {
                self.addItems(self.items);
            }
            self.updateOriginalInput();
            self.refreshState();
        }
        /**
         * Updates all state-dependent attributes
         * and CSS classes.
         */
        refreshState() {
            const self = this;
            self.refreshValidityState();
            const isFull = self.isFull();
            const isLocked = self.isLocked;
            self.wrapper.classList.toggle('rtl', self.rtl);
            const wrap_classList = self.wrapper.classList;
            wrap_classList.toggle('focus', self.isFocused);
            wrap_classList.toggle('disabled', self.isDisabled);
            wrap_classList.toggle('readonly', self.isReadOnly);
            wrap_classList.toggle('required', self.isRequired);
            wrap_classList.toggle('invalid', !self.isValid);
            wrap_classList.toggle('locked', isLocked);
            wrap_classList.toggle('full', isFull);
            wrap_classList.toggle('input-active', self.isFocused && !self.isInputHidden);
            wrap_classList.toggle('dropdown-active', self.isOpen);
            wrap_classList.toggle('has-options', (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.isEmptyObject)(self.options));
            wrap_classList.toggle('has-items', self.items.length > 0);
        }
        /**
         * Update the `required` attribute of both input and control input.
         *
         * The `required` property needs to be activated on the control input
         * for the error to be displayed at the right place. `required` also
         * needs to be temporarily deactivated on the input since the input is
         * hidden and can't show errors.
         */
        refreshValidityState() {
            var self = this;
            if (!self.input.validity) {
                return;
            }
            self.isValid = self.input.validity.valid;
            self.isInvalid = !self.isValid;
        }
        /**
         * Determines whether or not more items can be added
         * to the control without exceeding the user-defined maximum.
         *
         * @returns {boolean}
         */
        isFull() {
            return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
        }
        /**
         * Refreshes the original <select> or <input>
         * element to reflect the current state.
         *
         */
        updateOriginalInput(opts = {}) {
            const self = this;
            var option, label;
            const empty_option = self.input.querySelector('option[value=""]');
            if (self.is_select_tag) {
                const selected = [];
                const has_selected = self.input.querySelectorAll('option:checked').length;
                function AddSelected(option_el, value, label) {
                    if (!option_el) {
                        option_el = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)('<option value="' + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.escape_html)(value) + '">' + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.escape_html)(label) + '</option>');
                    }
                    // don't move empty option from top of list
                    // fixes bug in firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1725293
                    if (option_el != empty_option) {
                        self.input.append(option_el);
                    }
                    selected.push(option_el);
                    // marking empty option as selected can break validation
                    // fixes https://github.com/orchidjs/tom-select/issues/303
                    if (option_el != empty_option || has_selected > 0) {
                        option_el.selected = true;
                    }
                    return option_el;
                }
                // unselect all selected options
                self.input.querySelectorAll('option:checked').forEach((option_el) => {
                    option_el.selected = false;
                });
                // nothing selected?
                if (self.items.length == 0 && self.settings.mode == 'single') {
                    AddSelected(empty_option, "", "");
                    // order selected <option> tags for values in self.items
                }
                else {
                    self.items.forEach((value) => {
                        option = self.options[value];
                        label = option[self.settings.labelField] || '';
                        if (selected.includes(option.$option)) {
                            const reuse_opt = self.input.querySelector(`option[value="${(0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.addSlashes)(value)}"]:not(:checked)`);
                            AddSelected(reuse_opt, value, label);
                        }
                        else {
                            option.$option = AddSelected(option.$option, value, label);
                        }
                    });
                }
            }
            else {
                self.input.value = self.getValue();
            }
            if (self.isSetup) {
                if (!opts.silent) {
                    self.trigger('change', self.getValue());
                }
            }
        }
        /**
         * Shows the autocomplete dropdown containing
         * the available options.
         */
        open() {
            var self = this;
            if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull()))
                return;
            self.isOpen = true;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(self.focus_node, { 'aria-expanded': 'true' });
            self.refreshState();
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.applyCSS)(self.dropdown, { visibility: 'hidden', display: 'block' });
            self.positionDropdown();
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.applyCSS)(self.dropdown, { visibility: 'visible', display: 'block' });
            self.focus();
            self.trigger('dropdown_open', self.dropdown);
        }
        /**
         * Closes the autocomplete dropdown menu.
         */
        close(setTextboxValue = true) {
            var self = this;
            var trigger = self.isOpen;
            if (setTextboxValue) {
                // before blur() to prevent form onchange event
                self.setTextboxValue();
                if (self.settings.mode === 'single' && self.items.length) {
                    self.inputState();
                }
            }
            self.isOpen = false;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(self.focus_node, { 'aria-expanded': 'false' });
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.applyCSS)(self.dropdown, { display: 'none' });
            if (self.settings.hideSelected) {
                self.clearActiveOption();
            }
            self.refreshState();
            if (trigger)
                self.trigger('dropdown_close', self.dropdown);
        }
        /**
         * Calculates and applies the appropriate
         * position of the dropdown if dropdownParent = 'body'.
         * Otherwise, position is determined by css
         */
        positionDropdown() {
            if (this.settings.dropdownParent !== 'body') {
                return;
            }
            var context = this.control;
            var rect = context.getBoundingClientRect();
            var top = context.offsetHeight + rect.top + window.scrollY;
            var left = rect.left + window.scrollX;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.applyCSS)(this.dropdown, {
                width: rect.width + 'px',
                top: top + 'px',
                left: left + 'px'
            });
        }
        /**
         * Resets / clears all selected items
         * from the control.
         *
         */
        clear(silent) {
            var self = this;
            if (!self.items.length)
                return;
            var items = self.controlChildren();
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(items, (item) => {
                self.removeItem(item, true);
            });
            self.inputState();
            if (!silent)
                self.updateOriginalInput();
            self.trigger('clear');
        }
        /**
         * A helper method for inserting an element
         * at the current caret position.
         *
         */
        insertAtCaret(el) {
            const self = this;
            const caret = self.caretPos;
            const target = self.control;
            target.insertBefore(el, target.children[caret] || null);
            self.setCaret(caret + 1);
        }
        /**
         * Removes the current selected item(s).
         *
         */
        deleteSelection(e) {
            var direction, selection, caret, tail;
            var self = this;
            direction = (e && e.keyCode === _constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_BACKSPACE) ? -1 : 1;
            selection = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getSelection)(self.control_input);
            // determine items that will be removed
            const rm_items = [];
            if (self.activeItems.length) {
                tail = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getTail)(self.activeItems, direction);
                caret = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.nodeIndex)(tail);
                if (direction > 0) {
                    caret++;
                }
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(self.activeItems, (item) => rm_items.push(item));
            }
            else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
                const items = self.controlChildren();
                let rm_item;
                if (direction < 0 && selection.start === 0 && selection.length === 0) {
                    rm_item = items[self.caretPos - 1];
                }
                else if (direction > 0 && selection.start === self.inputValue().length) {
                    rm_item = items[self.caretPos];
                }
                if (rm_item !== undefined) {
                    rm_items.push(rm_item);
                }
            }
            if (!self.shouldDelete(rm_items, e)) {
                return false;
            }
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.preventDefault)(e, true);
            // perform removal
            if (typeof caret !== 'undefined') {
                self.setCaret(caret);
            }
            while (rm_items.length) {
                self.removeItem(rm_items.pop());
            }
            self.inputState();
            self.positionDropdown();
            self.refreshOptions(false);
            return true;
        }
        /**
         * Return true if the items should be deleted
         */
        shouldDelete(items, evt) {
            const values = items.map(item => item.dataset.value);
            // allow the callback to abort
            if (!values.length || (typeof this.settings.onDelete === 'function' && this.settings.onDelete(values, evt) === false)) {
                return false;
            }
            return true;
        }
        /**
         * Selects the previous / next item (depending on the `direction` argument).
         *
         * > 0 - right
         * < 0 - left
         *
         */
        advanceSelection(direction, e) {
            var last_active, adjacent, self = this;
            if (self.rtl)
                direction *= -1;
            if (self.inputValue().length)
                return;
            // add or remove to active items
            if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)(_constants_js__WEBPACK_IMPORTED_MODULE_5__.KEY_SHORTCUT, e) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isKeyDown)('shiftKey', e)) {
                last_active = self.getLastActive(direction);
                if (last_active) {
                    if (!last_active.classList.contains('active')) {
                        adjacent = last_active;
                    }
                    else {
                        adjacent = self.getAdjacent(last_active, direction, 'item');
                    }
                    // if no active item, get items adjacent to the control input
                }
                else if (direction > 0) {
                    adjacent = self.control_input.nextElementSibling;
                }
                else {
                    adjacent = self.control_input.previousElementSibling;
                }
                if (adjacent) {
                    if (adjacent.classList.contains('active')) {
                        self.removeActiveItem(last_active);
                    }
                    self.setActiveItemClass(adjacent); // mark as last_active !! after removeActiveItem() on last_active
                }
                // move caret to the left or right
            }
            else {
                self.moveCaret(direction);
            }
        }
        moveCaret(direction) { }
        /**
         * Get the last active item
         *
         */
        getLastActive(direction) {
            let last_active = this.control.querySelector('.last-active');
            if (last_active) {
                return last_active;
            }
            var result = this.control.querySelectorAll('.active');
            if (result) {
                return (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getTail)(result, direction);
            }
        }
        /**
         * Moves the caret to the specified index.
         *
         * The input must be moved by leaving it in place and moving the
         * siblings, due to the fact that focus cannot be restored once lost
         * on mobile webkit devices
         *
         */
        setCaret(new_pos) {
            this.caretPos = this.items.length;
        }
        /**
         * Return list of item dom elements
         *
         */
        controlChildren() {
            return Array.from(this.control.querySelectorAll('[data-ts-item]'));
        }
        /**
         * Disables user input on the control. Used while
         * items are being asynchronously created.
         */
        lock() {
            this.setLocked(true);
        }
        /**
         * Re-enables user input on the control.
         */
        unlock() {
            this.setLocked(false);
        }
        /**
         * Disable or enable user input on the control
         */
        setLocked(lock = this.isReadOnly || this.isDisabled) {
            this.isLocked = lock;
            this.refreshState();
        }
        /**
         * Disables user input on the control completely.
         * While disabled, it cannot receive focus.
         */
        disable() {
            this.setDisabled(true);
            this.close();
        }
        /**
         * Enables the control so that it can respond
         * to focus and user input.
         */
        enable() {
            this.setDisabled(false);
        }
        setDisabled(disabled) {
            this.focus_node.tabIndex = disabled ? -1 : this.tabIndex;
            this.isDisabled = disabled;
            this.input.disabled = disabled;
            this.control_input.disabled = disabled;
            this.setLocked();
        }
        setReadOnly(isReadOnly) {
            this.isReadOnly = isReadOnly;
            this.input.readOnly = isReadOnly;
            this.control_input.readOnly = isReadOnly;
            this.setLocked();
        }
        /**
         * Completely destroys the control and
         * unbinds all event listeners so that it can
         * be garbage collected.
         */
        destroy() {
            var self = this;
            var revertSettings = self.revertSettings;
            self.trigger('destroy');
            self.off();
            self.wrapper.remove();
            self.dropdown.remove();
            self.input.innerHTML = revertSettings.innerHTML;
            self.input.tabIndex = revertSettings.tabIndex;
            (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.removeClasses)(self.input, 'tomselected', 'ts-hidden-accessible');
            self._destroy();
            delete self.input.tomselect;
        }
        /**
         * A helper method for rendering "item" and
         * "option" templates, given the data.
         *
         */
        render(templateName, data) {
            var id, html;
            const self = this;
            if (typeof this.settings.render[templateName] !== 'function') {
                return null;
            }
            // render markup
            html = self.settings.render[templateName].call(this, data, _utils_js__WEBPACK_IMPORTED_MODULE_7__.escape_html);
            if (!html) {
                return null;
            }
            html = (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.getDom)(html);
            // add mandatory attributes
            if (templateName === 'option' || templateName === 'option_create') {
                if (data[self.settings.disabledField]) {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'aria-disabled': 'true' });
                }
                else {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'data-selectable': '' });
                }
            }
            else if (templateName === 'optgroup') {
                id = data.group[self.settings.optgroupValueField];
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'data-group': id });
                if (data.group[self.settings.disabledField]) {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'data-disabled': '' });
                }
            }
            if (templateName === 'option' || templateName === 'item') {
                const value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.get_hash)(data[self.settings.valueField]);
                (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'data-value': value });
                // make sure we have some classes if a template is overwritten
                if (templateName === 'item') {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(html, self.settings.itemClass);
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, { 'data-ts-item': '' });
                }
                else {
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.addClasses)(html, self.settings.optionClass);
                    (0,_vanilla_js__WEBPACK_IMPORTED_MODULE_8__.setAttr)(html, {
                        role: 'option',
                        id: data.$id
                    });
                    // update cache
                    data.$div = html;
                    self.options[value] = data;
                }
            }
            return html;
        }
        /**
         * Type guarded rendering
         *
         */
        _render(templateName, data) {
            const html = this.render(templateName, data);
            if (html == null) {
                throw 'HTMLElement expected';
            }
            return html;
        }
        /**
         * Clears the render cache for a template. If
         * no template is given, clears all render
         * caches.
         *
         */
        clearCache() {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.iterate)(this.options, (option) => {
                if (option.$div) {
                    option.$div.remove();
                    delete option.$div;
                }
            });
        }
        /**
         * Removes a value from item and option caches
         *
         */
        uncacheValue(value) {
            const option_el = this.getOption(value);
            if (option_el)
                option_el.remove();
        }
        /**
         * Determines whether or not to display the
         * create item prompt, given a user input.
         *
         */
        canCreate(input) {
            return this.settings.create && (input.length > 0) && this.settings.createFilter.call(this, input);
        }
        /**
         * Wraps this.`method` so that `new_fn` can be invoked 'before', 'after', or 'instead' of the original method
         *
         * this.hook('instead','onKeyDown',function( arg1, arg2 ...){
         *
         * });
         */
        hook(when, method, new_fn) {
            var self = this;
            var orig_method = self[method];
            self[method] = function () {
                var result, result_new;
                if (when === 'after') {
                    result = orig_method.apply(self, arguments);
                }
                result_new = new_fn.apply(self, arguments);
                if (when === 'instead') {
                    return result_new;
                }
                if (when === 'before') {
                    result = orig_method.apply(self, arguments);
                }
                return result;
            };
        }
    }
    ;
    //# sourceMappingURL=tom-select.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/utils.js":
    /*!***************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/utils.js ***!
      \***************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   addEvent: () => (/* binding */ addEvent),
    /* harmony export */   addSlashes: () => (/* binding */ addSlashes),
    /* harmony export */   append: () => (/* binding */ append),
    /* harmony export */   debounce_events: () => (/* binding */ debounce_events),
    /* harmony export */   escape_html: () => (/* binding */ escape_html),
    /* harmony export */   getId: () => (/* binding */ getId),
    /* harmony export */   getSelection: () => (/* binding */ getSelection),
    /* harmony export */   get_hash: () => (/* binding */ get_hash),
    /* harmony export */   hash_key: () => (/* binding */ hash_key),
    /* harmony export */   isKeyDown: () => (/* binding */ isKeyDown),
    /* harmony export */   iterate: () => (/* binding */ iterate),
    /* harmony export */   loadDebounce: () => (/* binding */ loadDebounce),
    /* harmony export */   preventDefault: () => (/* binding */ preventDefault),
    /* harmony export */   timeout: () => (/* binding */ timeout)
    /* harmony export */ });
    /**
     * Converts a scalar to its best string representation
     * for hash keys and HTML attribute values.
     *
     * Transformations:
     *   'str'     -> 'str'
     *   null      -> ''
     *   undefined -> ''
     *   true      -> '1'
     *   false     -> '0'
     *   0         -> '0'
     *   1         -> '1'
     *
     */
    const hash_key = (value) => {
        if (typeof value === 'undefined' || value === null)
            return null;
        return get_hash(value);
    };
    const get_hash = (value) => {
        if (typeof value === 'boolean')
            return value ? '1' : '0';
        return value + '';
    };
    /**
     * Escapes a string for use within HTML.
     *
     */
    const escape_html = (str) => {
        return (str + '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    /**
     * use setTimeout if timeout > 0
     */
    const timeout = (fn, timeout) => {
        if (timeout > 0) {
            return window.setTimeout(fn, timeout);
        }
        fn.call(null);
        return null;
    };
    /**
     * Debounce the user provided load function
     *
     */
    const loadDebounce = (fn, delay) => {
        var timeout;
        return function (value, callback) {
            var self = this;
            if (timeout) {
                self.loading = Math.max(self.loading - 1, 0);
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                timeout = null;
                self.loadedSearches[value] = true;
                fn.call(self, value, callback);
            }, delay);
        };
    };
    /**
     * Debounce all fired events types listed in `types`
     * while executing the provided `fn`.
     *
     */
    const debounce_events = (self, types, fn) => {
        var type;
        var trigger = self.trigger;
        var event_args = {};
        // override trigger method
        self.trigger = function () {
            var type = arguments[0];
            if (types.indexOf(type) !== -1) {
                event_args[type] = arguments;
            }
            else {
                return trigger.apply(self, arguments);
            }
        };
        // invoke provided function
        fn.apply(self, []);
        self.trigger = trigger;
        // trigger queued events
        for (type of types) {
            if (type in event_args) {
                trigger.apply(self, event_args[type]);
            }
        }
    };
    /**
     * Determines the current selection within a text input control.
     * Returns an object containing:
     *   - start
     *   - length
     *
     * Note: "selectionStart, selectionEnd ... apply only to inputs of types text, search, URL, tel and password"
     * 	- https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
     */
    const getSelection = (input) => {
        return {
            start: input.selectionStart || 0,
            length: (input.selectionEnd || 0) - (input.selectionStart || 0),
        };
    };
    /**
     * Prevent default
     *
     */
    const preventDefault = (evt, stop = false) => {
        if (evt) {
            evt.preventDefault();
            if (stop) {
                evt.stopPropagation();
            }
        }
    };
    /**
     * Add event helper
     *
     */
    const addEvent = (target, type, callback, options) => {
        target.addEventListener(type, callback, options);
    };
    /**
     * Return true if the requested key is down
     * Will return false if more than one control character is pressed ( when [ctrl+shift+a] != [ctrl+a] )
     * The current evt may not always set ( eg calling advanceSelection() )
     *
     */
    const isKeyDown = (key_name, evt) => {
        if (!evt) {
            return false;
        }
        if (!evt[key_name]) {
            return false;
        }
        var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);
        if (count === 1) {
            return true;
        }
        return false;
    };
    /**
     * Get the id of an element
     * If the id attribute is not set, set the attribute with the given id
     *
     */
    const getId = (el, id) => {
        const existing_id = el.getAttribute('id');
        if (existing_id) {
            return existing_id;
        }
        el.setAttribute('id', id);
        return id;
    };
    /**
     * Returns a string with backslashes added before characters that need to be escaped.
     */
    const addSlashes = (str) => {
        return str.replace(/[\\"']/g, '\\$&');
    };
    /**
     *
     */
    const append = (parent, node) => {
        if (node)
            parent.append(node);
    };
    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * iterate(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     */
    const iterate = (object, callback) => {
        if (Array.isArray(object)) {
            object.forEach(callback);
        }
        else {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback(object[key], key);
                }
            }
        }
    };
    //# sourceMappingURL=utils.js.map
    
    /***/ }),
    
    /***/ "./node_modules/tom-select/dist/esm/vanilla.js":
    /*!*****************************************************!*\
      !*** ./node_modules/tom-select/dist/esm/vanilla.js ***!
      \*****************************************************/
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   addClasses: () => (/* binding */ addClasses),
    /* harmony export */   applyCSS: () => (/* binding */ applyCSS),
    /* harmony export */   castAsArray: () => (/* binding */ castAsArray),
    /* harmony export */   classesArray: () => (/* binding */ classesArray),
    /* harmony export */   escapeQuery: () => (/* binding */ escapeQuery),
    /* harmony export */   getDom: () => (/* binding */ getDom),
    /* harmony export */   getTail: () => (/* binding */ getTail),
    /* harmony export */   isEmptyObject: () => (/* binding */ isEmptyObject),
    /* harmony export */   isHtmlString: () => (/* binding */ isHtmlString),
    /* harmony export */   nodeIndex: () => (/* binding */ nodeIndex),
    /* harmony export */   parentMatch: () => (/* binding */ parentMatch),
    /* harmony export */   removeClasses: () => (/* binding */ removeClasses),
    /* harmony export */   replaceNode: () => (/* binding */ replaceNode),
    /* harmony export */   setAttr: () => (/* binding */ setAttr),
    /* harmony export */   triggerEvent: () => (/* binding */ triggerEvent)
    /* harmony export */ });
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/tom-select/dist/esm/utils.js");
    
    /**
     * Return a dom element from either a dom query string, jQuery object, a dom element or html string
     * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
     *
     * param query should be {}
     */
    const getDom = (query) => {
        if (query.jquery) {
            return query[0];
        }
        if (query instanceof HTMLElement) {
            return query;
        }
        if (isHtmlString(query)) {
            var tpl = document.createElement('template');
            tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result
            return tpl.content.firstChild;
        }
        return document.querySelector(query);
    };
    const isHtmlString = (arg) => {
        if (typeof arg === 'string' && arg.indexOf('<') > -1) {
            return true;
        }
        return false;
    };
    const escapeQuery = (query) => {
        return query.replace(/['"\\]/g, '\\$&');
    };
    /**
     * Dispatch an event
     *
     */
    const triggerEvent = (dom_el, event_name) => {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(event_name, true, false);
        dom_el.dispatchEvent(event);
    };
    /**
     * Apply CSS rules to a dom element
     *
     */
    const applyCSS = (dom_el, css) => {
        Object.assign(dom_el.style, css);
    };
    /**
     * Add css classes
     *
     */
    const addClasses = (elmts, ...classes) => {
        var norm_classes = classesArray(classes);
        elmts = castAsArray(elmts);
        elmts.map(el => {
            norm_classes.map(cls => {
                el.classList.add(cls);
            });
        });
    };
    /**
     * Remove css classes
     *
     */
    const removeClasses = (elmts, ...classes) => {
        var norm_classes = classesArray(classes);
        elmts = castAsArray(elmts);
        elmts.map(el => {
            norm_classes.map(cls => {
                el.classList.remove(cls);
            });
        });
    };
    /**
     * Return arguments
     *
     */
    const classesArray = (args) => {
        var classes = [];
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(args, (_classes) => {
            if (typeof _classes === 'string') {
                _classes = _classes.trim().split(/[\t\n\f\r\s]/);
            }
            if (Array.isArray(_classes)) {
                classes = classes.concat(_classes);
            }
        });
        return classes.filter(Boolean);
    };
    /**
     * Create an array from arg if it's not already an array
     *
     */
    const castAsArray = (arg) => {
        if (!Array.isArray(arg)) {
            arg = [arg];
        }
        return arg;
    };
    /**
     * Get the closest node to the evt.target matching the selector
     * Stops at wrapper
     *
     */
    const parentMatch = (target, selector, wrapper) => {
        if (wrapper && !wrapper.contains(target)) {
            return;
        }
        while (target && target.matches) {
            if (target.matches(selector)) {
                return target;
            }
            target = target.parentNode;
        }
    };
    /**
     * Get the first or last item from an array
     *
     * > 0 - right (last)
     * <= 0 - left (first)
     *
     */
    const getTail = (list, direction = 0) => {
        if (direction > 0) {
            return list[list.length - 1];
        }
        return list[0];
    };
    /**
     * Return true if an object is empty
     *
     */
    const isEmptyObject = (obj) => {
        return (Object.keys(obj).length === 0);
    };
    /**
     * Get the index of an element amongst sibling nodes of the same type
     *
     */
    const nodeIndex = (el, amongst) => {
        if (!el)
            return -1;
        amongst = amongst || el.nodeName;
        var i = 0;
        while (el = el.previousElementSibling) {
            if (el.matches(amongst)) {
                i++;
            }
        }
        return i;
    };
    /**
     * Set attributes of an element
     *
     */
    const setAttr = (el, attrs) => {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.iterate)(attrs, (val, attr) => {
            if (val == null) {
                el.removeAttribute(attr);
            }
            else {
                el.setAttribute(attr, '' + val);
            }
        });
    };
    /**
     * Replace a node
     */
    const replaceNode = (existing, replacement) => {
        if (existing.parentNode)
            existing.parentNode.replaceChild(replacement, existing);
    };
    //# sourceMappingURL=vanilla.js.map
    
    /***/ })
    
    /******/ 	});
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /************************************************************************/
    /******/ 	/* webpack/runtime/compat get default export */
    /******/ 	(() => {
    /******/ 		// getDefaultExport function for compatibility with non-harmony modules
    /******/ 		__webpack_require__.n = (module) => {
    /******/ 			var getter = module && module.__esModule ?
    /******/ 				() => (module['default']) :
    /******/ 				() => (module);
    /******/ 			__webpack_require__.d(getter, { a: getter });
    /******/ 			return getter;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/define property getters */
    /******/ 	(() => {
    /******/ 		// define getter functions for harmony exports
    /******/ 		__webpack_require__.d = (exports, definition) => {
    /******/ 			for(var key in definition) {
    /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
    /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    /******/ 				}
    /******/ 			}
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
    /******/ 	(() => {
    /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/make namespace object */
    /******/ 	(() => {
    /******/ 		// define __esModule on exports
    /******/ 		__webpack_require__.r = (exports) => {
    /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 			}
    /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/publicPath */
    /******/ 	(() => {
    /******/ 		__webpack_require__.p = "/build/shop/";
    /******/ 	})();
    /******/ 	
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
    (() => {
    "use strict";
    /*!*********************************************************************!*\
      !*** ./node_modules/@sylius-ui/shop/Resources/assets/entrypoint.js ***!
      \*********************************************************************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/main.scss */ "./node_modules/@sylius-ui/shop/Resources/assets/styles/main.scss");
    /* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./node_modules/@sylius-ui/shop/Resources/assets/app.js");
    /* harmony import */ var _scripts_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/bootstrap */ "./node_modules/@sylius-ui/shop/Resources/assets/scripts/bootstrap.js");
    /* harmony import */ var _scripts_spotlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scripts/spotlight */ "./node_modules/@sylius-ui/shop/Resources/assets/scripts/spotlight.js");
    /*
     * This file is part of the Sylius package.
     *
     * (c) Sylius Sp. z o.o.
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */
    
    
    
    
    
    
    
    
    const imagesContext = __webpack_require__("./node_modules/@sylius-ui/shop/Resources/assets/images sync recursive \\.(jpg%7Cjpeg%7Cpng%7Csvg%7Cgif%7Cwebp)$");
    imagesContext.keys().forEach(imagesContext);
    
    })();
    
    /******/ })()
    ;
