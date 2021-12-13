
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.44.2 */

    function create_fragment$s(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.44.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$b, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.44.2 */
    const file$q = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$q(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$q, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const address = 'svelte2/public/';
    var accountType = writable('');

    const fetchBase = async (url, params) => {
        let dat;
        await fetch("http://localhost/svelte2/public/backend/" + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        })
            .then((data) => data.json())
            .then((data) => {
                dat = data;
                // console.log(data);
            });
        return dat
    };
    const sortCars = (array, sortBy) => {
        console.log(sortBy);
        let sorted;
        if (sortBy == "byBrand") {
            sorted = array.sort((a, b) => {
                if (a.brand < b.brand) {
                    return -1;
                }
                if (a.brand > b.brand) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byModel") {
            sorted = array.sort((a, b) => {
                if (a.model < b.model) {
                    return -1;
                }
                if (a.model > b.model) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byYear") {
            sorted = array.sort((a, b) => {
                if (a.year < b.year) {
                    return -1;
                }
                if (a.year > b.year) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byStatus") {
            sorted = array.sort((a, b) => {
                if (a.status < b.status) {
                    return -1;
                }
                if (a.status > b.status) {
                    return 1;
                }
                return 0;
            });
        }
        else if (sortBy == "byPrice") {
            sorted = array.sort((a, b) => {
                if (a.price < b.price) {
                    return -1;
                }
                if (a.price > b.price) {
                    return 1;
                }
                return 0;
            });
        }
        return sorted
    };
    function syncHeight(el) {
        return writable(null, (set) => {
            if (!el) {
                return;
            }
            let ro = new ResizeObserver(() => el && set(el.offsetHeight));
            ro.observe(el);
            return () => ro.disconnect();
        });
    }

    /* src\structure\Header.svelte generated by Svelte v3.44.2 */
    const file$p = "src\\structure\\Header.svelte";

    // (99:56) 
    function create_if_block_2$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("My Reservations");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(99:56) ",
    		ctx
    	});

    	return block;
    }

    // (97:32) {#if acc != "user"}
    function create_if_block_1$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Reservations");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(97:32) {#if acc != \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (103:28) {#if acc == "admin"}
    function create_if_block$c(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "User Management";
    			attr_dev(button, "class", "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium");
    			add_location(button, file$p, 103, 32, 4718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(103:28) {#if acc == \\\"admin\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let main;
    	let nav;
    	let div6;
    	let div5;
    	let div0;
    	let button0;
    	let span;
    	let t1;
    	let svg0;
    	let path0;
    	let t2;
    	let svg1;
    	let path1;
    	let t3;
    	let div4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div3;
    	let div2;
    	let button1;
    	let t7;
    	let button2;
    	let t8;
    	let t9;
    	let button3;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*acc*/ ctx[0] != "user") return create_if_block_1$a;
    		if (/*acc*/ ctx[0] == "user") return create_if_block_2$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	let if_block1 = /*acc*/ ctx[0] == "admin" && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			span = element("span");
    			span.textContent = "Open main menu";
    			t1 = space();
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div4 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t4 = space();
    			img1 = element("img");
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Rent Car";
    			t7 = space();
    			button2 = element("button");
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Logout";
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$p, 21, 24, 990);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h16M4 18h16");
    			add_location(path0, file$p, 37, 28, 1620);
    			attr_dev(svg0, "class", "block h-6 w-6");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "aria-hidden", "true");
    			add_location(svg0, file$p, 29, 24, 1255);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path1, file$p, 59, 28, 2496);
    			attr_dev(svg1, "class", "hidden h-6 w-6");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "aria-hidden", "true");
    			add_location(svg1, file$p, 51, 24, 2130);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white");
    			attr_dev(button0, "aria-controls", "mobile-menu");
    			attr_dev(button0, "aria-expanded", "false");
    			add_location(button0, file$p, 15, 20, 592);
    			attr_dev(div0, "class", "absolute inset-y-0 left-0 flex items-center sm:hidden");
    			add_location(div0, file$p, 11, 16, 416);
    			attr_dev(img0, "class", "block lg:hidden h-8 w-auto");
    			if (!src_url_equal(img0.src, img0_src_value = "img/cars.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Workflow");
    			add_location(img0, file$p, 72, 24, 3078);
    			attr_dev(img1, "class", "hidden lg:block h-8 w-auto");
    			if (!src_url_equal(img1.src, img1_src_value = "img/cars.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Workflow");
    			add_location(img1, file$p, 77, 24, 3292);
    			attr_dev(div1, "class", "flex-shrink-0 flex items-center");
    			add_location(div1, file$p, 71, 20, 3007);
    			attr_dev(button1, "class", "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium");
    			attr_dev(button1, "aria-current", "page");
    			add_location(button1, file$p, 86, 28, 3784);
    			attr_dev(button2, "class", "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium");
    			add_location(button2, file$p, 92, 28, 4096);
    			attr_dev(button3, "href", "#");
    			attr_dev(button3, "class", "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium");
    			add_location(button3, file$p, 109, 28, 5103);
    			attr_dev(div2, "class", "flex space-x-4");
    			add_location(div2, file$p, 84, 24, 3593);
    			attr_dev(div3, "class", "hidden sm:block sm:ml-6");
    			add_location(div3, file$p, 83, 20, 3530);
    			attr_dev(div4, "class", "flex-1 flex items-center justify-center sm:items-stretch sm:justify-start");
    			add_location(div4, file$p, 68, 16, 2859);
    			attr_dev(div5, "class", "relative flex items-center justify-between h-16");
    			add_location(div5, file$p, 10, 12, 337);
    			attr_dev(div6, "class", "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8");
    			add_location(div6, file$p, 9, 8, 271);
    			attr_dev(nav, "class", "bg-gray-800");
    			add_location(nav, file$p, 8, 4, 236);
    			add_location(main, file$p, 6, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, button0);
    			append_dev(button0, span);
    			append_dev(button0, t1);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(button0, t2);
    			append_dev(button0, svg1);
    			append_dev(svg1, path1);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t4);
    			append_dev(div1, img1);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			append_dev(div2, t7);
    			append_dev(div2, button2);
    			if (if_block0) if_block0.m(button2, null);
    			append_dev(div2, t8);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t9);
    			append_dev(div2, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button1, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button2, null);
    				}
    			}

    			if (/*acc*/ ctx[0] == "admin") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					if_block1.m(div2, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { acc } = $$props;
    	const writable_props = ['acc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => navigate("home");
    	const click_handler_1 = () => navigate("myReservations");
    	const click_handler_2 = () => navigate("userManagement");

    	const click_handler_3 = async () => {
    		let res = await fetchBase("login.php", { logout: true });

    		if ("logout" in res && res.logout) {
    			window.location.href = `${window.location.origin}/${address}`;
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('acc' in $$props) $$invalidate(0, acc = $$props.acc);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		navigate,
    		fetchBase,
    		address,
    		acc
    	});

    	$$self.$inject_state = $$props => {
    		if ('acc' in $$props) $$invalidate(0, acc = $$props.acc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [acc, click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { acc: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*acc*/ ctx[0] === undefined && !('acc' in props)) {
    			console.warn("<Header> was created without expected prop 'acc'");
    		}
    	}

    	get acc() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set acc(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //Solar month of 31 days.
    const SOLAR_MONTH_OF_31_DAYS = [1, 3, 5, 7, 8, 10, 12];

    /**
     * The day of the week.
     * @param {Date} n
     * @returns {number}
     */
    function theDayOfTheWeek(n) {
      let d = new Date(n).getDay();

      return d === 0 ? 7 : d;
    }

    /**
     * Format date stamp.
     * @param {Date} n
     * @param {string} f
     * @returns {string}
     */
    function formatDatestamp(n, f) {
      let d = new Date(n);
      let ty = d.getFullYear();
      let tm = d.getMonth() + 1;
      let td = d.getDate();
      let th = d.getHours();
      let tmin = d.getMinutes();
      let tse = d.getSeconds();

      let r = `${ty}-${tm}-${td}`;
      if (isNaN(d)) {
        return ""
      }
      switch (f) {
        case "ISO8601":
          r = `${ty}-${tm}-${td}T${th}:${tmin}:${tse}Z`;
          break;
        case "mm-yyyy" :
          r = `${tm}-${ty}`;
          break;
        case "dd/mm/yy" :
          r = `${td}/${tm}/${ty.toString().slice(-2)}`;
          break;
        case "yyyy-mm-dd" :
          r = `${ty}-${tm}-${td}`;
          break;
        case "dd.mm.yyyy" :
          r = `${td}.${tm}.${ty}`;
          break;
        case "dd/mm/yyyy" :
          r = `${td}/${tm}/${ty}`;
          break;
        case "yyyy-mm-dd" :
          r = `${ty}-${tm}-${td}`;
          break;
        case "dd-mm-yy" :
          r = `${td}-${tm}-${ty.toString().slice(-2)}`;
          break;
        case "mm-dd-yy" :
          r = `${tm}-${td}-${ty.toString().slice(-2)}`;
          break;
        default:
          r = `${ty}-${tm}-${td}`;
          break;
      }
      return r;
    }

    /**
     * Test solar month of 31 days.
     * @param {number} m
     * @returns {boolean}
     */
    function testSolarMonthOf31Days(m) {
      return !!~SOLAR_MONTH_OF_31_DAYS.indexOf(m);
    }

    /**
     * Test leap year.
     * @param {number} y
     * @returns {boolean}
     */
    function testLeapYear(y) {
      return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }

    /**
     * Determine the number of days in the month.
     * @param {number} y
     * @param {number} m
     * @returns {number}
     */
    function testDaysInTheMonth(y, m) {
      let d = NaN;
      if (testLeapYear(y) && m === 2) {
        d = 29;
      } else if (m === 2) {
        d = 28;
      } else if (testSolarMonthOf31Days(m)) {
        d = 31;
      } else {
        d = 30;
      }
      return d;
    }

    /**
     * Get the year and month of the prev month.
     * @param {number} y
     * @param {number} m
     * @returns { [py:number, pm:number] }
     */
    function getPrevYearAndMonth(y, m) {
      let py = NaN;
      let pm = NaN;
      if (m !== 1) {
        pm = m - 1;
        py = y;
      } else {
        pm = 12;
        py = y - 1;
      }
      return [py, pm];
    }

    /**
     * Get the year and month of the next month.
     * @param {number} y
     * @param {number} m
     * @returns { [ny:number, nm:number] }
     */
    function getNextYearAndMonth(y, m) {
      let ny = NaN;
      let nm = NaN;
      if (m !== 12) {
        nm = m + 1;
        ny = y;
      } else {
        nm = 1;
        ny = y + 1;
      }
      return [ny, nm];
    }

    /**
     * Calculate how many weeks there are in this month
     * @param {Date} n
     * @returns { number }
     */
    function thisMonthHasManyWeek(n) {
      let td = new Date(n);
      let ty = td.getFullYear();
      let tm = td.getMonth() + 1;
      let dotw = theDayOfTheWeek(`${ty}-${tm}-1`);
      let days = testDaysInTheMonth(ty, tm);
      let firstWeekDays = 8 - dotw;
      let weekNum = Math.ceil((days - firstWeekDays) / 7 + 1);
      return weekNum;
    }

    /**
     * Get date data for the first week of the month
     * @param {Date} n
     * @returns { Array }
     */
    function getFirstWeekOfTheMonth(n) {
      let td = new Date(n);
      let ty = td.getFullYear();
      let tm = td.getMonth() + 1;
      let dotw = theDayOfTheWeek(`${ty}-${tm}-1`);
      let [py, pm] = getPrevYearAndMonth(ty, tm);
      let pmd = testDaysInTheMonth(py, pm);
      let firstWeekList = [];
      firstWeekList.length = 7;
      let i = 8 - dotw;
      let times = dotw - 2;
      for (let index = 0; index < firstWeekList.length; index++) {
        firstWeekList[index] = new Date(py == ty ? ty : ty - 1, tm == 1 ? 11 : tm, pmd - times);
        times--;
      }
      for (let j = 0; j < i; j++) {
        firstWeekList[7 - i + j] = new Date(ty, tm - 1, j + 1);
      }
      return firstWeekList;
    }

    /**
     * Get date data for the mid week of the month
     * @param {Date} n
     * @param {boolean} s
     * @returns { Array }
     */
    function getMidWeekOfTheMonth(n, s) {
      let td = new Date(+n + 24 * 60 * 60 * 1000);
      let ty = td.getFullYear();
      let tm = td.getMonth();
      let d = td.getDate();
      let midWeekList = [];
      midWeekList.length = 7;
      for (let index = 0; index < midWeekList.length; index++) {
        if (s && tm == 11) {
          midWeekList[index] = new Date(ty + 1, 1, d + index);
        } else {
          midWeekList[index] = new Date(ty, tm, d + index);
        }
      }
      return midWeekList;
    }

    /**
     * Get date data for the last week of the month
     * @param {Date} n
     * @returns { Array }
     */
    function getLastWeekOfTheMonth(n) {
      let td = new Date(+n + 24 * 60 * 60 * 1000);
      let ty = td.getFullYear();
      let tm = td.getMonth() + 1;
      let d = td.getDate();
      let [ny, nm] = getNextYearAndMonth(ty, tm);
      let lastWeekList = [];
      let cmd = testDaysInTheMonth(ty, tm);
      let times = cmd - d + 1;
      for (let index = 0; index < times; index++) {
        lastWeekList[index] = new Date(ty, tm - 1, d + index);
      }
      for (let index = 0; index < 7 - times; index++) {
        lastWeekList[+times + index] = new Date(ny == ty ? ty : ty + 1, nm == 1 ? 0 : tm, index + 1);
      }
      lastWeekList.length = 7;
      return lastWeekList;
    }

    /**
     * Get weekly data for the month of the specified date.
     * @param {Date} n
     * @returns { Array }
     */
    function getThisMonthData(n) {
      let td = new Date(n);
      let ty = td.getFullYear();
      let tm = td.getMonth() + 1;
      td.getDate();
      getNextYearAndMonth(ty, tm);
      let cmd = testDaysInTheMonth(ty, tm);
      //The first week
      let theFirstWeek = getFirstWeekOfTheMonth(n);
      //The second week
      let theSecondWeek = getMidWeekOfTheMonth(theFirstWeek[6]);
      //The third week
      let theThirdWeek = getMidWeekOfTheMonth(theSecondWeek[6]);
      //The fourth week
      let theFourthWeek = getMidWeekOfTheMonth(theThirdWeek[6]);
      //The fifth week
      let fifthWeek;
      let hasSixthWeek;
      switch (true) {
        case cmd - new Date(theFourthWeek[6]).getDate() === 7:
          fifthWeek = getLastWeekOfTheMonth(theFourthWeek[6]);
          hasSixthWeek = true;
          break;
        case cmd - new Date(theFourthWeek[6]).getDate() > 7:
          fifthWeek = getMidWeekOfTheMonth(theFourthWeek[6]);
          hasSixthWeek = true;
          break;
        default:
          fifthWeek = getLastWeekOfTheMonth(theFourthWeek[6]);
          hasSixthWeek = false;
          break;
      }
      //The sixth week
      let sixthWeek = hasSixthWeek ? getLastWeekOfTheMonth(fifthWeek[6]) : getMidWeekOfTheMonth(fifthWeek[6], tm !== 11);
      return [theFirstWeek, theSecondWeek, theThirdWeek, theFourthWeek, fifthWeek, sixthWeek];
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    var noun = {
      zh: {
        weekShortAbbreviation: ["一", "二", "三", "四", "五", "六", "日"],
        weekAbbreviation: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        weekFullName: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        monthAbbreviation: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        monthFullName: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        doneName: "完成",
        prevName: "上一页",
        nextName:"下一页"
      },
      es: {
        weekShortAbbreviation: ["L", "M", "W", "J", "V", "S", "D"],
        weekAbbreviation: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
        weekFullName: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        monthAbbreviation: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"],
        monthFullName: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Deciembre",
        ],
        today: "Hoy",
        doneName: "Listo",
        prevName: "Ant",
        nextName:"Sig"
      },
      en: {
        weekShortAbbreviation: ["M", "T", "W", "T", "F", "S", "S"],
        weekAbbreviation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        weekFullName: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        monthAbbreviation: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        monthFullName: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        today: "Today",
        doneName: "Done",
        prevName: "Prev",
        nextName:"Next"
      },
      ru: {
        weekShortAbbreviation: ["П", "В", "С", "Ч", "П", "С", "В"],
        weekAbbreviation: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        weekFullName: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
        monthAbbreviation: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        monthFullName: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        today: "Сегодня",
        doneName: "Готово",
        prevName: "Назад",
        nextName:"Вперед"
      },
      de: {
        weekShortAbbreviation: ["M", "D", "M", "D", "F", "S", "S"],
        weekAbbreviation: ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
        weekFullName: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
        monthAbbreviation: ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "July", "Aug", "Sept", "Okt", "Nov", "Dez"],
        monthFullName: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ],
        today: "Heute",
        doneName: "Übernehmen",
        prevName: "Früher",
        nextName:"Später"
      },
      it: {
        weekShortAbbreviation: ["L", "M", "M", "G", "V", "S", "D"],
        weekAbbreviation: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
        weekFullName: ["Lunedí", "Martedí", "Mercoledí", "Giovedí", "Venerdí", "Sabato", "Domenica"],
        monthAbbreviation: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        monthFullName: [
          "Gennaio",
          "Febbraio",
          "Marzo",
          "Aprile",
          "Maggio",
          "Giugno",
          "Luglio",
          "Agosto",
          "Settembre",
          "Ottobre",
          "Novembre",
          "Dicembre",
        ],
        today: "Oggi",
        doneName: "Fatto",
        prevName: "Prima",
        nextName:"Dopo"
      },
      el: {
      weekShortAbbreviation: ["Δ", "Τ", "Τ", "Π", ,"Π", "Σ", "Κ"],
      weekAbbreviation: ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"],
      weekFullName: ["Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"],
      monthAbbreviation: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαι", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
      monthFullName: [
        "Ιανουάριος",
        "Φεβρουάριος",
        "Μάρτιος",
        "Απρίλιος",
        "Μάιος",
        "Ιούνιος",
        "Ιούλιος",
        "Αύγουστος",
        "Σεπτέμβριος",
        "Οκτώβριος",
        "Νοέμβριος",
        "Δεκέμβριος",
      ],
      today: "Σήμερα",
      doneName: "Ολοκλήρωση",
      prevName: "Προηγ.",
      nextName:"Επόμ."
      },
      ro: {
        weekShortAbbreviation: ["L", "M", "M", "J", "V", "S", "D"],
        weekAbbreviation: ["Lun", "Mar", "Mie", "Joi", "Vin", "Sam", "Dum"],
        weekFullName: ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"],
        monthAbbreviation: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
        monthFullName: [
          "Ianuarie",
          "Februarie",
          "Martie",
          "Aprilie",
          "Mai",
          "Iunie",
          "Iulie",
          "August",
          "Septembrie",
          "Octombrie",
          "Noiembrie",
          "Decembrie",
        ],
        today: "Astazi",
        doneName: "Terminat",
        prevName: "Precedent",
        nextName:"Urmator"
      },
    };

    /* node_modules\praecox-datepicker\src\Selector\MonthTitle.svelte generated by Svelte v3.44.2 */
    const file$o = "node_modules\\praecox-datepicker\\src\\Selector\\MonthTitle.svelte";

    // (99:0) {:else}
    function create_else_block$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_intro;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*$praecoxCalendar*/ ctx[0].view === 'month') return create_if_block_4$3;
    		if (/*$praecoxCalendar*/ ctx[0].view === 'year') return create_if_block_5$3;
    		if (/*$praecoxCalendar*/ ctx[0].view === 'multi-years') return create_if_block_6$2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "month-title svelte-2x4pvy");
    			add_location(div0, file$o, 101, 6, 2938);
    			attr_dev(div1, "class", "titleBox svelte-2x4pvy");
    			add_location(div1, file$o, 100, 4, 2908);
    			attr_dev(div2, "class", "month-title-wrap svelte-2x4pvy");
    			add_location(div2, file$o, 99, 2, 2850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*switchView*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (local) {
    				if (!div0_intro) {
    					add_render_callback(() => {
    						div0_intro = create_in_transition(div0, fly, {
    							x: `${/*$praecoxCalendar*/ ctx[0].action == 'prev' ? -50 : 50}`,
    							duration: 300
    						});

    						div0_intro.start();
    					});
    				}
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(99:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:0) {#if $praecoxCalendar.flag}
    function create_if_block$b(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_intro;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*$praecoxCalendar*/ ctx[0].view === 'month') return create_if_block_1$9;
    		if (/*$praecoxCalendar*/ ctx[0].view === 'year') return create_if_block_2$6;
    		if (/*$praecoxCalendar*/ ctx[0].view === 'multi-years') return create_if_block_3$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "month-title svelte-2x4pvy");
    			add_location(div0, file$o, 85, 6, 2126);
    			attr_dev(div1, "class", "titleBox svelte-2x4pvy");
    			add_location(div1, file$o, 84, 4, 2096);
    			attr_dev(div2, "class", "month-title-wrap svelte-2x4pvy");
    			add_location(div2, file$o, 83, 2, 2038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*switchView*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (local) {
    				if (!div0_intro) {
    					add_render_callback(() => {
    						div0_intro = create_in_transition(div0, fly, {
    							x: `${/*$praecoxCalendar*/ ctx[0].action == 'prev' ? -50 : 50}`,
    							duration: 300
    						});

    						div0_intro.start();
    					});
    				}
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(83:0) {#if $praecoxCalendar.flag}",
    		ctx
    	});

    	return block;
    }

    // (109:58) 
    function create_if_block_6$2(ctx) {
    	let t_value = `${new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear()} - ${+new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + 11}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = `${new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear()} - ${+new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + 11}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(109:58) ",
    		ctx
    	});

    	return block;
    }

    // (107:51) 
    function create_if_block_5$3(ctx) {
    	let t_value = new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(107:51) ",
    		ctx
    	});

    	return block;
    }

    // (105:8) {#if $praecoxCalendar.view === 'month'}
    function create_if_block_4$3(ctx) {
    	let t_value = noun[/*$praecoxCalendar*/ ctx[0].lang][/*$praecoxCalendar*/ ctx[0].monthName][new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getMonth()] + '  ' + new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = noun[/*$praecoxCalendar*/ ctx[0].lang][/*$praecoxCalendar*/ ctx[0].monthName][new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getMonth()] + '  ' + new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(105:8) {#if $praecoxCalendar.view === 'month'}",
    		ctx
    	});

    	return block;
    }

    // (93:58) 
    function create_if_block_3$5(ctx) {
    	let t_value = `${new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear()} - ${+new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + 11}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = `${new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear()} - ${+new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + 11}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(93:58) ",
    		ctx
    	});

    	return block;
    }

    // (91:51) 
    function create_if_block_2$6(ctx) {
    	let t_value = new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(91:51) ",
    		ctx
    	});

    	return block;
    }

    // (89:8) {#if $praecoxCalendar.view === 'month'}
    function create_if_block_1$9(ctx) {
    	let t_value = noun[/*$praecoxCalendar*/ ctx[0].lang][/*$praecoxCalendar*/ ctx[0].monthName][new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getMonth()] + '  ' + new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$praecoxCalendar*/ 1 && t_value !== (t_value = noun[/*$praecoxCalendar*/ ctx[0].lang][/*$praecoxCalendar*/ ctx[0].monthName][new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getMonth()] + '  ' + new Date(/*$praecoxCalendar*/ ctx[0].viewDate).getFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(89:8) {#if $praecoxCalendar.view === 'month'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$praecoxCalendar*/ ctx[0].flag) return create_if_block$b;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MonthTitle', slots, []);
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(0, $praecoxCalendar = value));

    	function switchView() {
    		if ($praecoxCalendar.view === "month") {
    			set_store_value(praecoxCalendar, $praecoxCalendar.view = "year", $praecoxCalendar);
    		} else if ($praecoxCalendar.view === "year") {
    			set_store_value(praecoxCalendar, $praecoxCalendar.view = "multi-years", $praecoxCalendar);
    		} else if ($praecoxCalendar.view === "multi-years") {
    			set_store_value(praecoxCalendar, $praecoxCalendar.view = "month", $praecoxCalendar);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MonthTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		fly,
    		noun,
    		praecoxCalendar,
    		switchView,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendar' in $$props) $$invalidate(1, praecoxCalendar = $$props.praecoxCalendar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$praecoxCalendar, praecoxCalendar, switchView];
    }

    class MonthTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MonthTitle",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\@icons\ArrowBack.svelte generated by Svelte v3.44.2 */

    const file$n = "node_modules\\praecox-datepicker\\src\\@icons\\ArrowBack.svelte";

    // (18:29) 
    function create_if_block_1$8(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$n, 21, 8, 805);
    			attr_dev(path, "d", "M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0\r\n          0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0\r\n          .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23\r\n          1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z");
    			add_location(path, file$n, 22, 8, 887);
    			attr_dev(g0, "data-name", "arrow-back");
    			add_location(g0, file$n, 20, 6, 769);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$n, 19, 4, 738);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$n, 18, 2, 672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(18:29) ",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if pattern === 'outline'}
    function create_if_block$a(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$n, 8, 8, 222);
    			attr_dev(path, "d", "M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0\r\n          0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0\r\n          .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23\r\n          1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z");
    			add_location(path, file$n, 9, 8, 304);
    			attr_dev(g0, "data-name", "arrow-back");
    			add_location(g0, file$n, 7, 6, 186);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$n, 6, 4, 155);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$n, 5, 2, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(5:0) {#if pattern === 'outline'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*pattern*/ ctx[0] === 'outline') return create_if_block$a;
    		if (/*pattern*/ ctx[0] === 'fill') return create_if_block_1$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowBack', slots, []);
    	let { pattern = "outline" } = $$props;
    	const writable_props = ['pattern'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArrowBack> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	$$self.$capture_state = () => ({ pattern });

    	$$self.$inject_state = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pattern];
    }

    class ArrowBack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { pattern: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowBack",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get pattern() {
    		throw new Error("<ArrowBack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<ArrowBack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\Selector\Prev.svelte generated by Svelte v3.44.2 */
    const file$m = "node_modules\\praecox-datepicker\\src\\Selector\\Prev.svelte";

    function create_fragment$m(ctx) {
    	let div1;
    	let div0;
    	let iconarrowback;
    	let div1_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	iconarrowback = new ArrowBack({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(iconarrowback.$$.fragment);
    			attr_dev(div0, "class", "topButton svelte-jpbncl");
    			add_location(div0, file$m, 35, 2, 1105);
    			attr_dev(div1, "class", "" + (null_to_empty("prev-button") + " svelte-jpbncl"));
    			attr_dev(div1, "title", div1_title_value = noun[/*$praecoxCalendar*/ ctx[0].lang].prevName);
    			add_location(div1, file$m, 30, 0, 1002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(iconarrowback, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*prev*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$praecoxCalendar*/ 1 && div1_title_value !== (div1_title_value = noun[/*$praecoxCalendar*/ ctx[0].lang].prevName)) {
    				attr_dev(div1, "title", div1_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconarrowback.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconarrowback.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(iconarrowback);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Prev', slots, []);
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(0, $praecoxCalendar = value));

    	function prev() {
    		let nd = new Date($praecoxCalendar.viewDate);
    		let ty = nd.getFullYear();
    		let tm = nd.getMonth() + 1;
    		let td = nd.getDate();
    		let [py, pm] = getPrevYearAndMonth(ty, tm);

    		switch ($praecoxCalendar.view) {
    			case "month":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${py}-${pm}-${td}`, $praecoxCalendar);
    				$praecoxCalendar.reloadDisabled && $praecoxCalendar.reloadDisabled();
    				break;
    			case "year":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ty - 1}-${tm}-${td}`, $praecoxCalendar);
    				break;
    			case "multi-years":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ty - 9}-${tm}-${td}`, $praecoxCalendar);
    				break;
    		}

    		set_store_value(praecoxCalendar, $praecoxCalendar.action = "prev", $praecoxCalendar);
    		set_store_value(praecoxCalendar, $praecoxCalendar.flag = !$praecoxCalendar.flag, $praecoxCalendar);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Prev> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		IconArrowBack: ArrowBack,
    		getPrevYearAndMonth,
    		noun,
    		getContext,
    		praecoxCalendar,
    		prev,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendar' in $$props) $$invalidate(1, praecoxCalendar = $$props.praecoxCalendar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$praecoxCalendar, praecoxCalendar, prev];
    }

    class Prev extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prev",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\@icons\ArrowForward.svelte generated by Svelte v3.44.2 */

    const file$l = "node_modules\\praecox-datepicker\\src\\@icons\\ArrowForward.svelte";

    // (22:29) 
    function create_if_block_1$7(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(-90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$l, 25, 8, 864);
    			attr_dev(path, "d", "M5 13h11.86l-3.63 4.36a1 1 0 0 0 1.54 1.28l5-6a1.19 1.19 0 0 0\r\n          .09-.15c0-.05.05-.08.07-.13A1 1 0 0 0 20 12a1 1 0 0\r\n          0-.07-.36c0-.05-.05-.08-.07-.13a1.19 1.19 0 0 0-.09-.15l-5-6A1 1 0 0 0\r\n          14 5a1 1 0 0 0-.64.23 1 1 0 0 0-.13 1.41L16.86 11H5a1 1 0 0 0 0 2z");
    			add_location(path, file$l, 30, 8, 991);
    			attr_dev(g0, "data-name", "arrow-forward");
    			add_location(g0, file$l, 24, 6, 825);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$l, 23, 4, 794);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$l, 22, 2, 728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(22:29) ",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if pattern === 'outline'}
    function create_if_block$9(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(-90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$l, 8, 8, 225);
    			attr_dev(path, "d", "M5 13h11.86l-3.63 4.36a1 1 0 0 0 1.54 1.28l5-6a1.19 1.19 0 0 0\r\n          .09-.15c0-.05.05-.08.07-.13A1 1 0 0 0 20 12a1 1 0 0\r\n          0-.07-.36c0-.05-.05-.08-.07-.13a1.19 1.19 0 0 0-.09-.15l-5-6A1 1 0 0 0\r\n          14 5a1 1 0 0 0-.64.23 1 1 0 0 0-.13 1.41L16.86 11H5a1 1 0 0 0 0 2z");
    			add_location(path, file$l, 13, 8, 352);
    			attr_dev(g0, "data-name", "arrow-forward");
    			add_location(g0, file$l, 7, 6, 186);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$l, 6, 4, 155);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$l, 5, 2, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(5:0) {#if pattern === 'outline'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*pattern*/ ctx[0] === 'outline') return create_if_block$9;
    		if (/*pattern*/ ctx[0] === 'fill') return create_if_block_1$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowForward', slots, []);
    	let { pattern = "outline" } = $$props;
    	const writable_props = ['pattern'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArrowForward> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	$$self.$capture_state = () => ({ pattern });

    	$$self.$inject_state = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pattern];
    }

    class ArrowForward extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { pattern: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowForward",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get pattern() {
    		throw new Error("<ArrowForward>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<ArrowForward>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\Selector\Next.svelte generated by Svelte v3.44.2 */
    const file$k = "node_modules\\praecox-datepicker\\src\\Selector\\Next.svelte";

    function create_fragment$k(ctx) {
    	let div1;
    	let div0;
    	let iconarrowforward;
    	let div1_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	iconarrowforward = new ArrowForward({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(iconarrowforward.$$.fragment);
    			attr_dev(div0, "class", "topButton svelte-pnerpp");
    			add_location(div0, file$k, 35, 2, 1111);
    			attr_dev(div1, "class", "" + (null_to_empty("next-button") + " svelte-pnerpp"));
    			attr_dev(div1, "title", div1_title_value = noun[/*$praecoxCalendar*/ ctx[0].lang].nextName);
    			add_location(div1, file$k, 30, 0, 1008);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(iconarrowforward, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*next*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$praecoxCalendar*/ 1 && div1_title_value !== (div1_title_value = noun[/*$praecoxCalendar*/ ctx[0].lang].nextName)) {
    				attr_dev(div1, "title", div1_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconarrowforward.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconarrowforward.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(iconarrowforward);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Next', slots, []);
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(0, $praecoxCalendar = value));

    	function next() {
    		let nd = new Date($praecoxCalendar.viewDate);
    		let ty = nd.getFullYear();
    		let tm = nd.getMonth() + 1;
    		let td = nd.getDate();
    		let [ny, nm] = getNextYearAndMonth(ty, tm);

    		switch ($praecoxCalendar.view) {
    			case "month":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ny}-${nm}-${td}`, $praecoxCalendar);
    				$praecoxCalendar.reloadDisabled && $praecoxCalendar.reloadDisabled();
    				break;
    			case "year":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ty + 1}-${tm}-${td}`, $praecoxCalendar);
    				break;
    			case "multi-years":
    				set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ty + 9}-${tm}-${td}`, $praecoxCalendar);
    				break;
    		}

    		set_store_value(praecoxCalendar, $praecoxCalendar.action = "next", $praecoxCalendar);
    		set_store_value(praecoxCalendar, $praecoxCalendar.flag = !$praecoxCalendar.flag, $praecoxCalendar);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Next> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		IconArrowForward: ArrowForward,
    		getNextYearAndMonth,
    		noun,
    		getContext,
    		praecoxCalendar,
    		next,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendar' in $$props) $$invalidate(1, praecoxCalendar = $$props.praecoxCalendar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$praecoxCalendar, praecoxCalendar, next];
    }

    class Next extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Next",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\@icons\Checkmark.svelte generated by Svelte v3.44.2 */

    const file$j = "node_modules\\praecox-datepicker\\src\\@icons\\Checkmark.svelte";

    // (16:29) 
    function create_if_block_1$6(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$j, 19, 8, 631);
    			attr_dev(path, "d", "M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39\r\n          8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z");
    			add_location(path, file$j, 20, 8, 684);
    			attr_dev(g0, "data-name", "checkmark");
    			add_location(g0, file$j, 18, 6, 596);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$j, 17, 4, 565);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$j, 16, 2, 499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(16:29) ",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if pattern === 'outline'}
    function create_if_block$8(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$j, 8, 8, 221);
    			attr_dev(path, "d", "M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39\r\n          8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z");
    			add_location(path, file$j, 9, 8, 274);
    			attr_dev(g0, "data-name", "checkmark");
    			add_location(g0, file$j, 7, 6, 186);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$j, 6, 4, 155);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$j, 5, 2, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(5:0) {#if pattern === 'outline'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*pattern*/ ctx[0] === 'outline') return create_if_block$8;
    		if (/*pattern*/ ctx[0] === 'fill') return create_if_block_1$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkmark', slots, []);
    	let { pattern = "outline" } = $$props;
    	const writable_props = ['pattern'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkmark> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	$$self.$capture_state = () => ({ pattern });

    	$$self.$inject_state = $$props => {
    		if ('pattern' in $$props) $$invalidate(0, pattern = $$props.pattern);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pattern];
    }

    class Checkmark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { pattern: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkmark",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get pattern() {
    		throw new Error("<Checkmark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\Selector\FinishBtn.svelte generated by Svelte v3.44.2 */
    const file$i = "node_modules\\praecox-datepicker\\src\\Selector\\FinishBtn.svelte";

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let iconcheckmark;
    	let div1_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	iconcheckmark = new Checkmark({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(iconcheckmark.$$.fragment);
    			attr_dev(div0, "class", "topButton svelte-ddec51");
    			add_location(div0, file$i, 58, 2, 1315);
    			attr_dev(div1, "class", "" + (null_to_empty('finish-button') + " svelte-ddec51"));
    			attr_dev(div1, "title", div1_title_value = noun[/*$praecoxCalendarData*/ ctx[0].lang].doneName);
    			add_location(div1, file$i, 54, 0, 1201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(iconcheckmark, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*handleClick*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$praecoxCalendarData*/ 1 && div1_title_value !== (div1_title_value = noun[/*$praecoxCalendarData*/ ctx[0].lang].doneName)) {
    				attr_dev(div1, "title", div1_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconcheckmark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconcheckmark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(iconcheckmark);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $praecoxCalendarData;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FinishBtn', slots, []);
    	let praecoxCalendarData = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendarData, 'praecoxCalendarData');
    	component_subscribe($$self, praecoxCalendarData, value => $$invalidate(0, $praecoxCalendarData = value));

    	function handleClick() {
    		set_store_value(praecoxCalendarData, $praecoxCalendarData.pickerDone = true, $praecoxCalendarData);
    	}

    	onMount(() => {
    		set_store_value(praecoxCalendarData, $praecoxCalendarData.pickerDone = false, $praecoxCalendarData);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FinishBtn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		IconCheckmark: Checkmark,
    		getContext,
    		onMount,
    		noun,
    		praecoxCalendarData,
    		handleClick,
    		$praecoxCalendarData
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendarData' in $$props) $$invalidate(1, praecoxCalendarData = $$props.praecoxCalendarData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$praecoxCalendarData, praecoxCalendarData, handleClick];
    }

    class FinishBtn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FinishBtn",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\Selector\Selector.svelte generated by Svelte v3.44.2 */
    const file$h = "node_modules\\praecox-datepicker\\src\\Selector\\Selector.svelte";

    // (17:2) {#if $praecoxCalendarData.finishBtn}
    function create_if_block$7(ctx) {
    	let finishbtn;
    	let current;
    	finishbtn = new FinishBtn({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(finishbtn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(finishbtn, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(finishbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(finishbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(finishbtn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(17:2) {#if $praecoxCalendarData.finishBtn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let monthtitle;
    	let t0;
    	let prev;
    	let t1;
    	let next;
    	let t2;
    	let current;
    	monthtitle = new MonthTitle({ $$inline: true });
    	prev = new Prev({ $$inline: true });
    	next = new Next({ $$inline: true });
    	let if_block = /*$praecoxCalendarData*/ ctx[0].finishBtn && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(monthtitle.$$.fragment);
    			t0 = space();
    			create_component(prev.$$.fragment);
    			t1 = space();
    			create_component(next.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "header svelte-q2weg3");
    			add_location(div, file$h, 11, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(monthtitle, div, null);
    			append_dev(div, t0);
    			mount_component(prev, div, null);
    			append_dev(div, t1);
    			mount_component(next, div, null);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$praecoxCalendarData*/ ctx[0].finishBtn) {
    				if (if_block) {
    					if (dirty & /*$praecoxCalendarData*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(monthtitle.$$.fragment, local);
    			transition_in(prev.$$.fragment, local);
    			transition_in(next.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(monthtitle.$$.fragment, local);
    			transition_out(prev.$$.fragment, local);
    			transition_out(next.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(monthtitle);
    			destroy_component(prev);
    			destroy_component(next);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $praecoxCalendarData;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selector', slots, []);
    	let praecoxCalendarData = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendarData, 'praecoxCalendarData');
    	component_subscribe($$self, praecoxCalendarData, value => $$invalidate(0, $praecoxCalendarData = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Selector> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		MonthTitle,
    		Prev,
    		Next,
    		FinishBtn,
    		praecoxCalendarData,
    		$praecoxCalendarData
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendarData' in $$props) $$invalidate(1, praecoxCalendarData = $$props.praecoxCalendarData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$praecoxCalendarData, praecoxCalendarData];
    }

    class Selector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selector",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBodyHead.svelte generated by Svelte v3.44.2 */
    const file$g = "node_modules\\praecox-datepicker\\src\\body\\CalendarBodyHead.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (58:4) {#each weekNames as item}
    function create_each_block$7(ctx) {
    	let th;
    	let abbr;
    	let t0_value = /*item*/ ctx[3] + "";
    	let t0;
    	let abbr_title_value;
    	let t1;

    	const block = {
    		c: function create() {
    			th = element("th");
    			abbr = element("abbr");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(abbr, "class", "calendar-dayOfWeek svelte-z16wpd");
    			attr_dev(abbr, "title", abbr_title_value = /*item*/ ctx[3]);
    			add_location(abbr, file$g, 59, 8, 1476);
    			attr_dev(th, "role", "columnheader");
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "calendar-tableCell svelte-z16wpd");
    			add_location(th, file$g, 58, 6, 1403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, abbr);
    			append_dev(abbr, t0);
    			append_dev(th, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*weekNames*/ 1 && t0_value !== (t0_value = /*item*/ ctx[3] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*weekNames*/ 1 && abbr_title_value !== (abbr_title_value = /*item*/ ctx[3])) {
    				attr_dev(abbr, "title", abbr_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(58:4) {#each weekNames as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let thead;
    	let tr;
    	let each_value = /*weekNames*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr, "role", "row");
    			attr_dev(tr, "class", "calendar-week svelte-z16wpd");
    			add_location(tr, file$g, 56, 2, 1327);
    			attr_dev(thead, "role", "presentation");
    			add_location(thead, file$g, 55, 0, 1296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*weekNames*/ 1) {
    				each_value = /*weekNames*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let weekNames;
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBodyHead', slots, []);
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(2, $praecoxCalendar = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBodyHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		noun,
    		praecoxCalendar,
    		weekNames,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendar' in $$props) $$invalidate(1, praecoxCalendar = $$props.praecoxCalendar);
    		if ('weekNames' in $$props) $$invalidate(0, weekNames = $$props.weekNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$praecoxCalendar*/ 4) {
    			$$invalidate(0, weekNames = noun[$praecoxCalendar.lang][$praecoxCalendar.weekName]);
    		}
    	};

    	return [weekNames, praecoxCalendar, $praecoxCalendar];
    }

    class CalendarBodyHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBodyHead",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBodyDay.svelte generated by Svelte v3.44.2 */
    const file$f = "node_modules\\praecox-datepicker\\src\\body\\CalendarBodyDay.svelte";

    function create_fragment$f(ctx) {
    	let td;
    	let span;
    	let t;
    	let td_title_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t = text(/*dayLabel*/ ctx[12]);
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "calendar-date svelte-1x6ahh0");
    			toggle_class(span, "is-today", /*isToday*/ ctx[9]);
    			toggle_class(span, "is-selected", /*isSelected*/ ctx[0]);
    			toggle_class(span, "is-today-selected", /*isToday*/ ctx[9] && (/*isSelected*/ ctx[0] || /*isFreeSelected*/ ctx[4]));
    			toggle_class(span, "is-free-selected", /*isFreeSelected*/ ctx[4]);
    			toggle_class(span, "is-focused", /*isFocused*/ ctx[2]);
    			toggle_class(span, "is-disabled", /*disabled*/ ctx[3]);
    			toggle_class(span, "is-range-selection", /*isRangeSelection*/ ctx[6]);
    			toggle_class(span, "is-selection-start", /*isSelectionStart*/ ctx[7]);
    			toggle_class(span, "is-selection-end", /*isSelectionEnd*/ ctx[8]);
    			toggle_class(span, "calendar-outsideMonth", /*isOutsideMonth*/ ctx[10]);
    			toggle_class(span, "calendar-outsideMonth-disabled", /*isOutsideMonth*/ ctx[10] && /*disabled*/ ctx[3]);
    			toggle_class(span, "is-outsideMonth", /*isOutsideMonth*/ ctx[10]);
    			add_location(span, file$f, 389, 2, 10257);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "calendar-tableCell svelte-1x6ahh0");
    			attr_dev(td, "aria-disabled", /*disabled*/ ctx[3]);
    			attr_dev(td, "aria-selected", /*isSelected*/ ctx[0]);

    			attr_dev(td, "title", td_title_value = /*isToday*/ ctx[9]
    			? noun[/*$praecoxCalendar*/ ctx[5].lang].today + ' , ' + /*formatWeekName*/ ctx[14](/*day*/ ctx[1]) + ' , ' + formatDatestamp(/*day*/ ctx[1], 'yyyy-mm-dd')
    			: /*formatWeekName*/ ctx[14](/*day*/ ctx[1]) + ' , ' + formatDatestamp(/*day*/ ctx[1], 'yyyy-mm-dd'));

    			toggle_class(td, "calendar-weekend", /*isWeekend*/ ctx[11]);
    			add_location(td, file$f, 382, 0, 9907);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*pick*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dayLabel*/ 4096) set_data_dev(t, /*dayLabel*/ ctx[12]);

    			if (dirty & /*isToday*/ 512) {
    				toggle_class(span, "is-today", /*isToday*/ ctx[9]);
    			}

    			if (dirty & /*isSelected*/ 1) {
    				toggle_class(span, "is-selected", /*isSelected*/ ctx[0]);
    			}

    			if (dirty & /*isToday, isSelected, isFreeSelected*/ 529) {
    				toggle_class(span, "is-today-selected", /*isToday*/ ctx[9] && (/*isSelected*/ ctx[0] || /*isFreeSelected*/ ctx[4]));
    			}

    			if (dirty & /*isFreeSelected*/ 16) {
    				toggle_class(span, "is-free-selected", /*isFreeSelected*/ ctx[4]);
    			}

    			if (dirty & /*isFocused*/ 4) {
    				toggle_class(span, "is-focused", /*isFocused*/ ctx[2]);
    			}

    			if (dirty & /*disabled*/ 8) {
    				toggle_class(span, "is-disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*isRangeSelection*/ 64) {
    				toggle_class(span, "is-range-selection", /*isRangeSelection*/ ctx[6]);
    			}

    			if (dirty & /*isSelectionStart*/ 128) {
    				toggle_class(span, "is-selection-start", /*isSelectionStart*/ ctx[7]);
    			}

    			if (dirty & /*isSelectionEnd*/ 256) {
    				toggle_class(span, "is-selection-end", /*isSelectionEnd*/ ctx[8]);
    			}

    			if (dirty & /*isOutsideMonth*/ 1024) {
    				toggle_class(span, "calendar-outsideMonth", /*isOutsideMonth*/ ctx[10]);
    			}

    			if (dirty & /*isOutsideMonth, disabled*/ 1032) {
    				toggle_class(span, "calendar-outsideMonth-disabled", /*isOutsideMonth*/ ctx[10] && /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*isOutsideMonth*/ 1024) {
    				toggle_class(span, "is-outsideMonth", /*isOutsideMonth*/ ctx[10]);
    			}

    			if (dirty & /*disabled*/ 8) {
    				attr_dev(td, "aria-disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*isSelected*/ 1) {
    				attr_dev(td, "aria-selected", /*isSelected*/ ctx[0]);
    			}

    			if (dirty & /*isToday, $praecoxCalendar, day*/ 546 && td_title_value !== (td_title_value = /*isToday*/ ctx[9]
    			? noun[/*$praecoxCalendar*/ ctx[5].lang].today + ' , ' + /*formatWeekName*/ ctx[14](/*day*/ ctx[1]) + ' , ' + formatDatestamp(/*day*/ ctx[1], 'yyyy-mm-dd')
    			: /*formatWeekName*/ ctx[14](/*day*/ ctx[1]) + ' , ' + formatDatestamp(/*day*/ ctx[1], 'yyyy-mm-dd'))) {
    				attr_dev(td, "title", td_title_value);
    			}

    			if (dirty & /*isWeekend*/ 2048) {
    				toggle_class(td, "calendar-weekend", /*isWeekend*/ ctx[11]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let dayLabel;
    	let isWeekend;
    	let isOutsideMonth;
    	let isToday;
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBodyDay', slots, []);
    	let { day = 1 } = $$props;
    	let { isSelected = false } = $$props;
    	let { isFocused = false } = $$props;
    	let { disabled = false } = $$props;
    	let { isFreeSelected = false } = $$props;
    	let isRangeSelection = false;
    	let isSelectionStart = false;
    	let isSelectionEnd = false;
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(5, $praecoxCalendar = value));

    	beforeUpdate(() => {
    		if ($praecoxCalendar.pickerMode == "single") {
    			$$invalidate(0, isSelected = new Date(day).getTime() == new Date($praecoxCalendar.selected).getTime());
    		}

    		if ($praecoxCalendar.pickerMode == "range") {
    			$$invalidate(6, [isRangeSelection, isSelectionStart, isSelectionEnd] = testSelectedRange(day), isRangeSelection, $$invalidate(7, isSelectionStart), $$invalidate(8, isSelectionEnd));
    			$$invalidate(0, isSelected = isRangeSelection);
    		}
    	});

    	function formatWeekName(n) {
    		let dotw = theDayOfTheWeek(n);
    		return noun[$praecoxCalendar.lang][`weekFullName`][dotw - 1];
    	}

    	function pick() {
    		if ($praecoxCalendar.pickerMode == "single") {
    			set_store_value(praecoxCalendar, $praecoxCalendar.selected = new Date(day).getTime(), $praecoxCalendar);
    		}

    		if ($praecoxCalendar.pickerMode == "range") {
    			if ($praecoxCalendar.reselected && $praecoxCalendar.selected[0] && $praecoxCalendar.selected[1] && $praecoxCalendar.selected[0] !== $praecoxCalendar.selected[1]) {
    				set_store_value(praecoxCalendar, $praecoxCalendar.selected = [], $praecoxCalendar);
    			} else {
    				set_store_value(praecoxCalendar, $praecoxCalendar.selected = rangePicker($praecoxCalendar.selected), $praecoxCalendar);
    			}
    		}

    		if ($praecoxCalendar.pickerMode == "free") {
    			freePicker(day);
    		}

    		set_store_value(praecoxCalendar, $praecoxCalendar.changed += 1, $praecoxCalendar);
    	}

    	function testSelectedRange(n) {
    		let i = new Date(n).getTime();
    		let startDate = new Date($praecoxCalendar.selected[0]).getTime();
    		let endDate = new Date($praecoxCalendar.selected[1]).getTime();
    		return [i >= startDate && i <= endDate, i == startDate, i == endDate];
    	}

    	function rangePicker(arr) {
    		let thisDate = new Date(day).getTime();
    		let startDate = new Date(arr[0]).getTime();
    		let endDate = new Date(arr[1]).getTime();

    		if (!endDate || !startDate || startDate == thisDate) {
    			startDate = thisDate;
    			endDate = thisDate;
    		} else {
    			if (thisDate > endDate) {
    				endDate = thisDate;
    			} else if (thisDate < startDate || thisDate > startDate) {
    				startDate = thisDate;
    			} else if (thisDate == endDate) {
    				startDate = thisDate;
    			}
    		}

    		return [startDate, endDate];
    	}

    	function freePicker(n) {
    		let _date = new Date(n).getTime();
    		let r = new Set($praecoxCalendar.selected);

    		if (r.has(_date)) {
    			r.delete(_date);
    			set_store_value(praecoxCalendar, $praecoxCalendar.selected = [...new Set(r)], $praecoxCalendar);
    		} else {
    			set_store_value(praecoxCalendar, $praecoxCalendar.selected = [...$praecoxCalendar.selected, _date], $praecoxCalendar);
    			set_store_value(praecoxCalendar, $praecoxCalendar.selected = $praecoxCalendar.selected.sort(), $praecoxCalendar);
    		}
    	}

    	const writable_props = ['day', 'isSelected', 'isFocused', 'disabled', 'isFreeSelected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBodyDay> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('day' in $$props) $$invalidate(1, day = $$props.day);
    		if ('isSelected' in $$props) $$invalidate(0, isSelected = $$props.isSelected);
    		if ('isFocused' in $$props) $$invalidate(2, isFocused = $$props.isFocused);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ('isFreeSelected' in $$props) $$invalidate(4, isFreeSelected = $$props.isFreeSelected);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		getContext,
    		formatDatestamp,
    		theDayOfTheWeek,
    		noun,
    		day,
    		isSelected,
    		isFocused,
    		disabled,
    		isFreeSelected,
    		isRangeSelection,
    		isSelectionStart,
    		isSelectionEnd,
    		praecoxCalendar,
    		formatWeekName,
    		pick,
    		testSelectedRange,
    		rangePicker,
    		freePicker,
    		isToday,
    		isOutsideMonth,
    		isWeekend,
    		dayLabel,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('day' in $$props) $$invalidate(1, day = $$props.day);
    		if ('isSelected' in $$props) $$invalidate(0, isSelected = $$props.isSelected);
    		if ('isFocused' in $$props) $$invalidate(2, isFocused = $$props.isFocused);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ('isFreeSelected' in $$props) $$invalidate(4, isFreeSelected = $$props.isFreeSelected);
    		if ('isRangeSelection' in $$props) $$invalidate(6, isRangeSelection = $$props.isRangeSelection);
    		if ('isSelectionStart' in $$props) $$invalidate(7, isSelectionStart = $$props.isSelectionStart);
    		if ('isSelectionEnd' in $$props) $$invalidate(8, isSelectionEnd = $$props.isSelectionEnd);
    		if ('praecoxCalendar' in $$props) $$invalidate(13, praecoxCalendar = $$props.praecoxCalendar);
    		if ('isToday' in $$props) $$invalidate(9, isToday = $$props.isToday);
    		if ('isOutsideMonth' in $$props) $$invalidate(10, isOutsideMonth = $$props.isOutsideMonth);
    		if ('isWeekend' in $$props) $$invalidate(11, isWeekend = $$props.isWeekend);
    		if ('dayLabel' in $$props) $$invalidate(12, dayLabel = $$props.dayLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*day*/ 2) {
    			$$invalidate(12, dayLabel = new Date(day).getDate());
    		}

    		if ($$self.$$.dirty & /*day*/ 2) {
    			$$invalidate(11, isWeekend = theDayOfTheWeek(day) === 6 || theDayOfTheWeek(day) === 7);
    		}

    		if ($$self.$$.dirty & /*$praecoxCalendar, day*/ 34) {
    			$$invalidate(10, isOutsideMonth = new Date($praecoxCalendar.viewDate).getMonth() != new Date(day).getMonth());
    		}

    		if ($$self.$$.dirty & /*$praecoxCalendar, day*/ 34) {
    			$$invalidate(9, isToday = new Date($praecoxCalendar.nowDate).getDate() == new Date(day).getDate() && new Date($praecoxCalendar.nowDate).getMonth() == new Date(day).getMonth() && new Date($praecoxCalendar.nowDate).getFullYear() == new Date(day).getFullYear());
    		}
    	};

    	return [
    		isSelected,
    		day,
    		isFocused,
    		disabled,
    		isFreeSelected,
    		$praecoxCalendar,
    		isRangeSelection,
    		isSelectionStart,
    		isSelectionEnd,
    		isToday,
    		isOutsideMonth,
    		isWeekend,
    		dayLabel,
    		praecoxCalendar,
    		formatWeekName,
    		pick
    	];
    }

    class CalendarBodyDay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			day: 1,
    			isSelected: 0,
    			isFocused: 2,
    			disabled: 3,
    			isFreeSelected: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBodyDay",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get day() {
    		throw new Error("<CalendarBodyDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set day(value) {
    		throw new Error("<CalendarBodyDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<CalendarBodyDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<CalendarBodyDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFocused() {
    		throw new Error("<CalendarBodyDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFocused(value) {
    		throw new Error("<CalendarBodyDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CalendarBodyDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CalendarBodyDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFreeSelected() {
    		throw new Error("<CalendarBodyDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFreeSelected(value) {
    		throw new Error("<CalendarBodyDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBodyWeek.svelte generated by Svelte v3.44.2 */
    const file$e = "node_modules\\praecox-datepicker\\src\\body\\CalendarBodyWeek.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (92:2) {#each week as item}
    function create_each_block$6(ctx) {
    	let calendarbodyday;
    	let current;

    	calendarbodyday = new CalendarBodyDay({
    			props: {
    				day: /*item*/ ctx[5],
    				isFreeSelected: /*testFreeSelected*/ ctx[3](/*item*/ ctx[5]),
    				isFocused: /*testMarked*/ ctx[4](/*item*/ ctx[5]),
    				disabled: filterDate(/*$praecoxCalendar*/ ctx[1].disabled, /*item*/ ctx[5])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(calendarbodyday.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendarbodyday, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const calendarbodyday_changes = {};
    			if (dirty & /*week*/ 1) calendarbodyday_changes.day = /*item*/ ctx[5];
    			if (dirty & /*week*/ 1) calendarbodyday_changes.isFreeSelected = /*testFreeSelected*/ ctx[3](/*item*/ ctx[5]);
    			if (dirty & /*week*/ 1) calendarbodyday_changes.isFocused = /*testMarked*/ ctx[4](/*item*/ ctx[5]);
    			if (dirty & /*$praecoxCalendar, week*/ 3) calendarbodyday_changes.disabled = filterDate(/*$praecoxCalendar*/ ctx[1].disabled, /*item*/ ctx[5]);
    			calendarbodyday.$set(calendarbodyday_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyday.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyday.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendarbodyday, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(92:2) {#each week as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let tr;
    	let current;
    	let each_value = /*week*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr, "role", "row");
    			attr_dev(tr, "class", "svelte-m150ez");
    			add_location(tr, file$e, 90, 0, 2568);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*week, testFreeSelected, testMarked, filterDate, $praecoxCalendar*/ 27) {
    				each_value = /*week*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function filterDate(arr, day) {
    	if (!arr) {
    		return;
    	}

    	let thisDate = setTimeToZero(new Date(day)).getTime();

    	if (typeof arr[0] === "object") {
    		for (let index = 0; index < arr.length; index++) {
    			let arrItem = arr[index];

    			if (arrItem.length === 2 && setTimeToZero(new Date(arrItem[0])).getTime() < setTimeToZero(new Date(arrItem[1])).getTime()) {
    				if (thisDate >= setTimeToZero(new Date(arrItem[0])).getTime() && thisDate <= setTimeToZero(new Date(arrItem[1])).getTime()) {
    					return true;
    				}
    			} else if (arrItem instanceof Date && setTimeToZero(arrItem).getTime() == thisDate) {
    				return true;
    			} else {
    				for (let i = 0; i < arrItem.length; i++) {
    					if (setTimeToZero(new Date(arrItem[i])).getTime() == thisDate) {
    						return true;
    					}
    				}
    			}
    		}
    	} else {
    		if (arr.length === 2 && setTimeToZero(new Date(arr[0])).getTime() < setTimeToZero(new Date(arr[1])).getTime()) {
    			if (thisDate >= setTimeToZero(new Date(arr[0])).getTime() && thisDate <= setTimeToZero(new Date(arr[1])).getTime()) {
    				return true;
    			}
    		}

    		for (let index = 0; index < arr.length; index++) {
    			if (setTimeToZero(new Date(arr[index])).getTime() == thisDate) {
    				return true;
    			}
    		}
    	}
    }

    function formatDateArray(arr) {
    	return arr.map(date => setTimeToZero(date).getTime());
    }

    function setTimeToZero(date) {
    	const d = new Date(date);
    	d.setHours(0);
    	d.setMinutes(0);
    	d.setSeconds(0);
    	d.setMilliseconds(0);
    	return d;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBodyWeek', slots, []);
    	let { week = [] } = $$props;
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(1, $praecoxCalendar = value));

    	function testFreeSelected(i) {
    		if ($praecoxCalendar.pickerMode == "free" && $praecoxCalendar.selected) {
    			let f = new Set(formatDateArray($praecoxCalendar.selected));
    			let td = new Date(i).getTime();

    			if (f.has(td)) {
    				return true;
    			}
    		}
    	}

    	function testMarked(i) {
    		if ($praecoxCalendar.focused) {
    			let f = new Set(formatDateArray($praecoxCalendar.focused));
    			let td = new Date(i).getTime();

    			if (f.has(td)) {
    				return true;
    			}
    		}
    	}

    	const writable_props = ['week'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBodyWeek> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('week' in $$props) $$invalidate(0, week = $$props.week);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		CalendarBodyDay,
    		week,
    		praecoxCalendar,
    		filterDate,
    		testFreeSelected,
    		testMarked,
    		formatDateArray,
    		setTimeToZero,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('week' in $$props) $$invalidate(0, week = $$props.week);
    		if ('praecoxCalendar' in $$props) $$invalidate(2, praecoxCalendar = $$props.praecoxCalendar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [week, $praecoxCalendar, praecoxCalendar, testFreeSelected, testMarked];
    }

    class CalendarBodyWeek extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { week: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBodyWeek",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get week() {
    		throw new Error("<CalendarBodyWeek>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set week(value) {
    		throw new Error("<CalendarBodyWeek>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBodyYear.svelte generated by Svelte v3.44.2 */
    const file$d = "node_modules\\praecox-datepicker\\src\\body\\CalendarBodyYear.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (27:4) {#if i < 3}
    function create_if_block_3$4(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[11] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1sfy43i");
    			toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			add_location(span, file$d, 28, 8, 864);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1sfy43i");
    			add_location(td, file$d, 27, 6, 805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*monthList*/ 4 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentMonth, currentYear*/ 3) {
    				toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(27:4) {#if i < 3}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#each monthList as item, i}
    function create_each_block_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[13] < 3 && create_if_block_3$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[13] < 3) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(26:2) {#each monthList as item, i}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if i >= 3 && i < 6}
    function create_if_block_2$5(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[11] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1sfy43i");
    			toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			add_location(span, file$d, 44, 8, 1227);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1sfy43i");
    			add_location(td, file$d, 43, 6, 1168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*monthList*/ 4 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentMonth, currentYear*/ 3) {
    				toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(43:4) {#if i >= 3 && i < 6}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#each monthList as item, i}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[13] >= 3 && /*i*/ ctx[13] < 6 && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[13] >= 3 && /*i*/ ctx[13] < 6) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(42:2) {#each monthList as item, i}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {#if i >= 6 && i < 9}
    function create_if_block_1$5(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[11] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[9](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1sfy43i");
    			toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			add_location(span, file$d, 59, 8, 1589);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1sfy43i");
    			add_location(td, file$d, 58, 6, 1530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*monthList*/ 4 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentMonth, currentYear*/ 3) {
    				toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(58:4) {#if i >= 6 && i < 9}",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#each monthList as item, i}
    function create_each_block_1$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[13] >= 6 && /*i*/ ctx[13] < 9 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[13] >= 6 && /*i*/ ctx[13] < 9) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(57:2) {#each monthList as item, i}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if i >= 9 && i < 12}
    function create_if_block$6(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[11] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[10](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1sfy43i");
    			toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			add_location(span, file$d, 74, 8, 1952);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1sfy43i");
    			add_location(td, file$d, 73, 6, 1893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*monthList*/ 4 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentMonth, currentYear*/ 3) {
    				toggle_class(span, "current-month", /*currentMonth*/ ctx[0] == /*i*/ ctx[13] && /*currentYear*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(73:4) {#if i >= 9 && i < 12}",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#each monthList as item, i}
    function create_each_block$5(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[13] >= 9 && /*i*/ ctx[13] < 12 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[13] >= 9 && /*i*/ ctx[13] < 12) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(72:2) {#each monthList as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let tr0;
    	let t0;
    	let tr1;
    	let t1;
    	let tr2;
    	let t2;
    	let tr3;
    	let each_value_3 = /*monthList*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*monthList*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*monthList*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*monthList*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tr0 = element("tr");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();
    			tr1 = element("tr");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			tr2 = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			tr3 = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr0, "role", "row");
    			attr_dev(tr0, "class", "svelte-1sfy43i");
    			add_location(tr0, file$d, 24, 0, 736);
    			attr_dev(tr1, "role", "row");
    			attr_dev(tr1, "class", "svelte-1sfy43i");
    			add_location(tr1, file$d, 40, 0, 1089);
    			attr_dev(tr2, "role", "row");
    			attr_dev(tr2, "class", "svelte-1sfy43i");
    			add_location(tr2, file$d, 55, 0, 1451);
    			attr_dev(tr3, "role", "row");
    			attr_dev(tr3, "class", "svelte-1sfy43i");
    			add_location(tr3, file$d, 70, 0, 1813);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr0, anchor);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(tr0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, tr1, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tr1, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, tr2, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr2, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, tr3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr3, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pickMonth, currentMonth, currentYear, monthList*/ 23) {
    				each_value_3 = /*monthList*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(tr0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty & /*pickMonth, currentMonth, currentYear, monthList*/ 23) {
    				each_value_2 = /*monthList*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tr1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*pickMonth, currentMonth, currentYear, monthList*/ 23) {
    				each_value_1 = /*monthList*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*pickMonth, currentMonth, currentYear, monthList*/ 23) {
    				each_value = /*monthList*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr0);
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(tr1);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tr2);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(tr3);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let monthList;
    	let currentYear;
    	let currentMonth;
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBodyYear', slots, []);
    	let { dateDate = [] } = $$props;
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(6, $praecoxCalendar = value));

    	function pickMonth(i) {
    		let d = new Date($praecoxCalendar.viewDate);
    		let ty = d.getFullYear();
    		let td = d.getDate();
    		set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${ty}-${i + 1}-${td}`, $praecoxCalendar);
    		$praecoxCalendar.reloadDisabled && $praecoxCalendar.reloadDisabled();
    		set_store_value(praecoxCalendar, $praecoxCalendar.view = "month", $praecoxCalendar);
    	}

    	const writable_props = ['dateDate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBodyYear> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => pickMonth(i);
    	const click_handler_1 = i => pickMonth(i);
    	const click_handler_2 = i => pickMonth(i);
    	const click_handler_3 = i => pickMonth(i);

    	$$self.$$set = $$props => {
    		if ('dateDate' in $$props) $$invalidate(5, dateDate = $$props.dateDate);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		noun,
    		dateDate,
    		praecoxCalendar,
    		pickMonth,
    		currentMonth,
    		currentYear,
    		monthList,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('dateDate' in $$props) $$invalidate(5, dateDate = $$props.dateDate);
    		if ('praecoxCalendar' in $$props) $$invalidate(3, praecoxCalendar = $$props.praecoxCalendar);
    		if ('currentMonth' in $$props) $$invalidate(0, currentMonth = $$props.currentMonth);
    		if ('currentYear' in $$props) $$invalidate(1, currentYear = $$props.currentYear);
    		if ('monthList' in $$props) $$invalidate(2, monthList = $$props.monthList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$praecoxCalendar*/ 64) {
    			$$invalidate(2, monthList = noun[$praecoxCalendar.lang][$praecoxCalendar.monthName]);
    		}

    		if ($$self.$$.dirty & /*dateDate, $praecoxCalendar*/ 96) {
    			$$invalidate(1, currentYear = new Date(dateDate).getFullYear() == new Date($praecoxCalendar.nowDate).getFullYear());
    		}

    		if ($$self.$$.dirty & /*$praecoxCalendar*/ 64) {
    			$$invalidate(0, currentMonth = new Date($praecoxCalendar.nowDate).getMonth());
    		}
    	};

    	return [
    		currentMonth,
    		currentYear,
    		monthList,
    		praecoxCalendar,
    		pickMonth,
    		dateDate,
    		$praecoxCalendar,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class CalendarBodyYear extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { dateDate: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBodyYear",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get dateDate() {
    		throw new Error("<CalendarBodyYear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateDate(value) {
    		throw new Error("<CalendarBodyYear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBodyMultiYears.svelte generated by Svelte v3.44.2 */
    const file$c = "node_modules\\praecox-datepicker\\src\\body\\CalendarBodyMultiYears.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (28:4) {#if _i < 3}
    function create_if_block_2$4(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*item*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1ghvxby");
    			toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			add_location(span, file$c, 29, 8, 862);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1ghvxby");
    			add_location(td, file$c, 28, 6, 800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*yearList*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Date, $praecoxCalendar, yearList*/ 3) {
    				toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(28:4) {#if _i < 3}",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#each yearList as item, _i}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = /*_i*/ ctx[10] < 3 && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*_i*/ ctx[10] < 3) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(27:2) {#each yearList as item, _i}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if _i >= 3 && _i < 6}
    function create_if_block_1$4(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[5](/*item*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1ghvxby");
    			toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			add_location(span, file$c, 46, 8, 1293);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1ghvxby");
    			add_location(td, file$c, 45, 6, 1231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*yearList*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Date, $praecoxCalendar, yearList*/ 3) {
    				toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(45:4) {#if _i >= 3 && _i < 6}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#each yearList as item, _i}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*_i*/ ctx[10] >= 3 && /*_i*/ ctx[10] < 6 && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*_i*/ ctx[10] >= 3 && /*_i*/ ctx[10] < 6) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(44:2) {#each yearList as item, _i}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if _i >= 6 && _i < 9}
    function create_if_block$5(ctx) {
    	let td;
    	let span;
    	let t0_value = /*item*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[6](/*item*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "role", "presentation");
    			attr_dev(span, "class", "praecox-Calendar-month svelte-1ghvxby");
    			toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			add_location(span, file$c, 63, 8, 1724);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-1ghvxby");
    			add_location(td, file$c, 62, 6, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t0);
    			append_dev(td, t1);

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*yearList*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Date, $praecoxCalendar, yearList*/ 3) {
    				toggle_class(span, "current-year", new Date(/*$praecoxCalendar*/ ctx[1].nowDate).getFullYear() === /*item*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(62:4) {#if _i >= 6 && _i < 9}",
    		ctx
    	});

    	return block;
    }

    // (61:2) {#each yearList as item, _i}
    function create_each_block$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*_i*/ ctx[10] >= 6 && /*_i*/ ctx[10] < 9 && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*_i*/ ctx[10] >= 6 && /*_i*/ ctx[10] < 9) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(61:2) {#each yearList as item, _i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let tr0;
    	let t0;
    	let tr1;
    	let t1;
    	let tr2;
    	let each_value_2 = /*yearList*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*yearList*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*yearList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tr0 = element("tr");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			tr1 = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			tr2 = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr0, "role", "row");
    			attr_dev(tr0, "class", "svelte-1ghvxby");
    			add_location(tr0, file$c, 25, 0, 727);
    			attr_dev(tr1, "role", "row");
    			attr_dev(tr1, "class", "svelte-1ghvxby");
    			add_location(tr1, file$c, 42, 0, 1147);
    			attr_dev(tr2, "role", "row");
    			attr_dev(tr2, "class", "svelte-1ghvxby");
    			add_location(tr2, file$c, 59, 0, 1578);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr0, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tr0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, tr1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr1, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, tr2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pickYear, yearList, Date, $praecoxCalendar*/ 11) {
    				each_value_2 = /*yearList*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tr0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*pickYear, yearList, Date, $praecoxCalendar*/ 11) {
    				each_value_1 = /*yearList*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*pickYear, yearList, Date, $praecoxCalendar*/ 11) {
    				each_value = /*yearList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr0);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(tr1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tr2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const showYearTotal = 9;

    function instance$c($$self, $$props, $$invalidate) {
    	let $praecoxCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBodyMultiYears', slots, []);
    	let praecoxCalendar = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendar, 'praecoxCalendar');
    	component_subscribe($$self, praecoxCalendar, value => $$invalidate(1, $praecoxCalendar = value));
    	let yearList = [];
    	let temporarilyArray = [];

    	onMount(() => {
    		let ty = new Date($praecoxCalendar.viewDate).getFullYear();
    		temporarilyArray.length = showYearTotal / 3;

    		for (let index = 0; index < showYearTotal; index++) {
    			$$invalidate(0, yearList[index] = ty + (-1 * ((showYearTotal - 1) / 2) + index), yearList);
    		}
    	});

    	function pickYear(i) {
    		let d = new Date($praecoxCalendar.viewDate);
    		let tm = d.getMonth() + 1;
    		let td = d.getDate();
    		set_store_value(praecoxCalendar, $praecoxCalendar.viewDate = `${i}-${tm}-${td}`, $praecoxCalendar);
    		set_store_value(praecoxCalendar, $praecoxCalendar.view = "year", $praecoxCalendar);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBodyMultiYears> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => pickYear(item);
    	const click_handler_1 = item => pickYear(item);
    	const click_handler_2 = item => pickYear(item);

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		praecoxCalendar,
    		yearList,
    		showYearTotal,
    		temporarilyArray,
    		pickYear,
    		$praecoxCalendar
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendar' in $$props) $$invalidate(2, praecoxCalendar = $$props.praecoxCalendar);
    		if ('yearList' in $$props) $$invalidate(0, yearList = $$props.yearList);
    		if ('temporarilyArray' in $$props) temporarilyArray = $$props.temporarilyArray;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		yearList,
    		$praecoxCalendar,
    		praecoxCalendar,
    		pickYear,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class CalendarBodyMultiYears extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBodyMultiYears",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules\praecox-datepicker\src\body\CalendarBody.svelte generated by Svelte v3.44.2 */
    const file$b = "node_modules\\praecox-datepicker\\src\\body\\CalendarBody.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (117:55) 
    function create_if_block_4$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*$praecoxCalendarData*/ ctx[0].flag) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(117:55) ",
    		ctx
    	});

    	return block;
    }

    // (97:48) 
    function create_if_block_2$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3$3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$praecoxCalendarData*/ ctx[0].flag) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(97:48) ",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if $praecoxCalendarData.view == 'month'}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$praecoxCalendarData*/ ctx[0].flag) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(71:2) {#if $praecoxCalendarData.view == 'month'}",
    		ctx
    	});

    	return block;
    }

    // (127:4) {:else}
    function create_else_block_2(ctx) {
    	let table;
    	let tbody;
    	let calendarbodymultiyears;
    	let table_intro;
    	let current;
    	calendarbodymultiyears = new CalendarBodyMultiYears({ $$inline: true });

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");
    			create_component(calendarbodymultiyears.$$.fragment);
    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 131, 8, 3825);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 127, 6, 3641);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			mount_component(calendarbodymultiyears, tbody, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodymultiyears.$$.fragment, local);

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodymultiyears.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodymultiyears);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(127:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:4) {#if $praecoxCalendarData.flag}
    function create_if_block_5$2(ctx) {
    	let table;
    	let tbody;
    	let calendarbodymultiyears;
    	let table_intro;
    	let current;
    	calendarbodymultiyears = new CalendarBodyMultiYears({ $$inline: true });

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");
    			create_component(calendarbodymultiyears.$$.fragment);
    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 122, 8, 3526);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 118, 6, 3342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			mount_component(calendarbodymultiyears, tbody, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodymultiyears.$$.fragment, local);

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodymultiyears.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodymultiyears);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(118:4) {#if $praecoxCalendarData.flag}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {:else}
    function create_else_block_1(ctx) {
    	let table;
    	let tbody;
    	let calendarbodyyear;
    	let table_intro;
    	let current;

    	calendarbodyyear = new CalendarBodyYear({
    			props: {
    				dateDate: /*$praecoxCalendarData*/ ctx[0].viewDate
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");
    			create_component(calendarbodyyear.$$.fragment);
    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 111, 8, 3102);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 107, 6, 2918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			mount_component(calendarbodyyear, tbody, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const calendarbodyyear_changes = {};
    			if (dirty & /*$praecoxCalendarData*/ 1) calendarbodyyear_changes.dateDate = /*$praecoxCalendarData*/ ctx[0].viewDate;
    			calendarbodyyear.$set(calendarbodyyear_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyyear.$$.fragment, local);

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyyear.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodyyear);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(107:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (98:4) {#if $praecoxCalendarData.flag}
    function create_if_block_3$3(ctx) {
    	let table;
    	let tbody;
    	let calendarbodyyear;
    	let table_intro;
    	let current;

    	calendarbodyyear = new CalendarBodyYear({
    			props: {
    				dateDate: /*$praecoxCalendarData*/ ctx[0].viewDate
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");
    			create_component(calendarbodyyear.$$.fragment);
    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 102, 8, 2768);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 98, 6, 2584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			mount_component(calendarbodyyear, tbody, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const calendarbodyyear_changes = {};
    			if (dirty & /*$praecoxCalendarData*/ 1) calendarbodyyear_changes.dateDate = /*$praecoxCalendarData*/ ctx[0].viewDate;
    			calendarbodyyear.$set(calendarbodyyear_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyyear.$$.fragment, local);

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyyear.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodyyear);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(98:4) {#if $praecoxCalendarData.flag}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {:else}
    function create_else_block$2(ctx) {
    	let table;
    	let calendarbodyhead;
    	let t;
    	let tbody;
    	let table_intro;
    	let current;
    	calendarbodyhead = new CalendarBodyHead({ $$inline: true });
    	let each_value_1 = /*monthData*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			create_component(calendarbodyhead.$$.fragment);
    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 89, 8, 2321);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 84, 6, 2108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			mount_component(calendarbodyhead, table, null);
    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*monthData*/ 2) {
    				each_value_1 = /*monthData*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyhead.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyhead.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodyhead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(84:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#if $praecoxCalendarData.flag}
    function create_if_block_1$3(ctx) {
    	let table;
    	let calendarbodyhead;
    	let t;
    	let tbody;
    	let table_intro;
    	let current;
    	calendarbodyhead = new CalendarBodyHead({ $$inline: true });
    	let each_value = /*monthData*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			create_component(calendarbodyhead.$$.fragment);
    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tbody, "role", "presentation");
    			attr_dev(tbody, "class", "svelte-1w13sn1");
    			add_location(tbody, file$b, 77, 8, 1928);
    			attr_dev(table, "role", "presentation");
    			attr_dev(table, "class", "praecox-calendar-body svelte-1w13sn1");
    			add_location(table, file$b, 72, 6, 1715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			mount_component(calendarbodyhead, table, null);
    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*monthData*/ 2) {
    				each_value = /*monthData*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyhead.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (local) {
    				if (!table_intro) {
    					add_render_callback(() => {
    						table_intro = create_in_transition(table, fly, {
    							x: `${/*$praecoxCalendarData*/ ctx[0].action == 'prev'
							? -200
							: 200}`,
    							duration: 300
    						});

    						table_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyhead.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(calendarbodyhead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(72:4) {#if $praecoxCalendarData.flag}",
    		ctx
    	});

    	return block;
    }

    // (91:10) {#each monthData as item, i}
    function create_each_block_1$1(ctx) {
    	let calendarbodyweek;
    	let current;

    	calendarbodyweek = new CalendarBodyWeek({
    			props: { week: /*item*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(calendarbodyweek.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendarbodyweek, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const calendarbodyweek_changes = {};
    			if (dirty & /*monthData*/ 2) calendarbodyweek_changes.week = /*item*/ ctx[3];
    			calendarbodyweek.$set(calendarbodyweek_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyweek.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyweek.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendarbodyweek, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(91:10) {#each monthData as item, i}",
    		ctx
    	});

    	return block;
    }

    // (79:10) {#each monthData as item, i}
    function create_each_block$3(ctx) {
    	let calendarbodyweek;
    	let current;

    	calendarbodyweek = new CalendarBodyWeek({
    			props: { week: /*item*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(calendarbodyweek.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendarbodyweek, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const calendarbodyweek_changes = {};
    			if (dirty & /*monthData*/ 2) calendarbodyweek_changes.week = /*item*/ ctx[3];
    			calendarbodyweek.$set(calendarbodyweek_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarbodyweek.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarbodyweek.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendarbodyweek, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(79:10) {#each monthData as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_2$3, create_if_block_4$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$praecoxCalendarData*/ ctx[0].view == 'month') return 0;
    		if (/*$praecoxCalendarData*/ ctx[0].view == 'year') return 1;
    		if (/*$praecoxCalendarData*/ ctx[0].view == 'multi-years') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "calendar-body svelte-1w13sn1");
    			attr_dev(div, "role", "grid");
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "aria-readonly", "true");
    			attr_dev(div, "aria-disabled", "false");
    			add_location(div, file$b, 64, 0, 1522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let monthData;
    	let $praecoxCalendarData;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarBody', slots, []);
    	let praecoxCalendarData = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendarData, 'praecoxCalendarData');
    	component_subscribe($$self, praecoxCalendarData, value => $$invalidate(0, $praecoxCalendarData = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarBody> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CalendarBodyHead,
    		CalendarBodyWeek,
    		CalendarBodyYear,
    		CalendarBodyMultiYears,
    		getThisMonthData,
    		getContext,
    		fly,
    		praecoxCalendarData,
    		monthData,
    		$praecoxCalendarData
    	});

    	$$self.$inject_state = $$props => {
    		if ('praecoxCalendarData' in $$props) $$invalidate(2, praecoxCalendarData = $$props.praecoxCalendarData);
    		if ('monthData' in $$props) $$invalidate(1, monthData = $$props.monthData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$praecoxCalendarData*/ 1) {
    			$$invalidate(1, monthData = getThisMonthData($praecoxCalendarData.viewDate));
    		}
    	};

    	return [$praecoxCalendarData, monthData, praecoxCalendarData];
    }

    class CalendarBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarBody",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    //Safari Date function polyfill
    !(function (_Date) {
      function standardizeArgs(args) {
        if (args.length === 1 && typeof args[0] === "string" && isNaN(_Date.parse(args[0]))) {
          args[0] = args[0].replace(/-/g, "/");
        }
        return Array.prototype.slice.call(args);
      }

      function $Date() {
        if (this instanceof $Date) {
          return new (Function.prototype.bind.apply(_Date, [null].concat(standardizeArgs(arguments))))();
        }
        return _Date();
      }
      $Date.prototype = _Date.prototype;

      $Date.now = _Date.now;
      $Date.UTC = _Date.UTC;
      $Date.parse = function () {
        return _Date.parse.apply(_Date, standardizeArgs(arguments));
      };

      Date = $Date;
    })(Date);

    /* node_modules\praecox-datepicker\src\Calendar.svelte generated by Svelte v3.44.2 */
    const file$a = "node_modules\\praecox-datepicker\\src\\Calendar.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let calendarheader;
    	let t;
    	let calendarbody;
    	let div1_class_value;
    	let current;
    	calendarheader = new Selector({ $$inline: true });
    	calendarbody = new CalendarBody({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(calendarheader.$$.fragment);
    			t = space();
    			create_component(calendarbody.$$.fragment);
    			attr_dev(div0, "class", "calendar-wrap");
    			add_location(div0, file$a, 166, 2, 4120);
    			attr_dev(div1, "class", div1_class_value = "calendar calendar-" + /*theme*/ ctx[0] + " svelte-p7dasp");
    			add_location(div1, file$a, 165, 0, 4077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(calendarheader, div0, null);
    			append_dev(div0, t);
    			mount_component(calendarbody, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*theme*/ 1 && div1_class_value !== (div1_class_value = "calendar calendar-" + /*theme*/ ctx[0] + " svelte-p7dasp")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarheader.$$.fragment, local);
    			transition_in(calendarbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarheader.$$.fragment, local);
    			transition_out(calendarbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(calendarheader);
    			destroy_component(calendarbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $praecoxCalendarData;
    	let $praecoxCalendarConfig;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	const dispatch = createEventDispatcher();
    	let changed = 0;
    	let { nowDate = new Date() } = $$props;
    	let { lang = "en" } = $$props;
    	let { viewDate = nowDate } = $$props;
    	let { pickerRule = "single" } = $$props;
    	let { disabled = [] } = $$props;
    	let { selected = [] } = $$props;
    	let { marked = [] } = $$props;
    	let { weekNameMode = "weekAbbreviation" } = $$props;
    	let { monthNameMode = "monthFullName" } = $$props;
    	let { theme = "light" } = $$props;
    	let { reSelected = false } = $$props;
    	let { pickerDone = false } = $$props;
    	let { reloadDisabled = undefined } = $$props;
    	let { finishBtn = true } = $$props;

    	const praecoxCalendarData = writable({
    		nowDate: [],
    		viewDate,
    		action: "next",
    		flag: false,
    		view: "month",
    		monthName: monthNameMode,
    		weekName: weekNameMode,
    		lang,
    		theme,
    		pickerMode: pickerRule,
    		reselected: reSelected,
    		disabled,
    		selected,
    		focused: marked,
    		pickerDone,
    		finishBtn,
    		changed,
    		reloadDisabled: () => {
    			if (typeof reloadDisabled == "function") {
    				set_store_value(praecoxCalendarData, $praecoxCalendarData.disabled = reloadDisabled(getThisMonthData($praecoxCalendarData.viewDate).flat()), $praecoxCalendarData);
    			}
    		}
    	});

    	validate_store(praecoxCalendarData, 'praecoxCalendarData');
    	component_subscribe($$self, praecoxCalendarData, value => $$invalidate(17, $praecoxCalendarData = value));
    	$praecoxCalendarData.reloadDisabled();
    	setContext("praecoxCalendarData", praecoxCalendarData);
    	let praecoxCalendarConfig = getContext("praecoxCalendarData");
    	validate_store(praecoxCalendarConfig, 'praecoxCalendarConfig');
    	component_subscribe($$self, praecoxCalendarConfig, value => $$invalidate(18, $praecoxCalendarConfig = value));

    	beforeUpdate(() => {
    		set_store_value(praecoxCalendarConfig, $praecoxCalendarConfig.nowDate = nowDate, $praecoxCalendarConfig);
    		$$invalidate(3, selected = $praecoxCalendarConfig.selected);
    		$$invalidate(4, pickerDone = $praecoxCalendarConfig.pickerDone);
    	});

    	const writable_props = [
    		'nowDate',
    		'lang',
    		'viewDate',
    		'pickerRule',
    		'disabled',
    		'selected',
    		'marked',
    		'weekNameMode',
    		'monthNameMode',
    		'theme',
    		'reSelected',
    		'pickerDone',
    		'reloadDisabled',
    		'finishBtn'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('nowDate' in $$props) $$invalidate(5, nowDate = $$props.nowDate);
    		if ('lang' in $$props) $$invalidate(6, lang = $$props.lang);
    		if ('viewDate' in $$props) $$invalidate(7, viewDate = $$props.viewDate);
    		if ('pickerRule' in $$props) $$invalidate(8, pickerRule = $$props.pickerRule);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('marked' in $$props) $$invalidate(10, marked = $$props.marked);
    		if ('weekNameMode' in $$props) $$invalidate(11, weekNameMode = $$props.weekNameMode);
    		if ('monthNameMode' in $$props) $$invalidate(12, monthNameMode = $$props.monthNameMode);
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('reSelected' in $$props) $$invalidate(13, reSelected = $$props.reSelected);
    		if ('pickerDone' in $$props) $$invalidate(4, pickerDone = $$props.pickerDone);
    		if ('reloadDisabled' in $$props) $$invalidate(14, reloadDisabled = $$props.reloadDisabled);
    		if ('finishBtn' in $$props) $$invalidate(15, finishBtn = $$props.finishBtn);
    	};

    	$$self.$capture_state = () => ({
    		formatDatestamp,
    		getNextYearAndMonth,
    		getPrevYearAndMonth,
    		getThisMonthData,
    		testDaysInTheMonth,
    		testLeapYear,
    		testSolarMonthOf31Days,
    		thisMonthHasManyWeek,
    		theDayOfTheWeek,
    		setContext,
    		getContext,
    		beforeUpdate,
    		writable,
    		CalendarHeader: Selector,
    		CalendarBody,
    		createEventDispatcher,
    		dispatch,
    		changed,
    		nowDate,
    		lang,
    		viewDate,
    		pickerRule,
    		disabled,
    		selected,
    		marked,
    		weekNameMode,
    		monthNameMode,
    		theme,
    		reSelected,
    		pickerDone,
    		reloadDisabled,
    		finishBtn,
    		praecoxCalendarData,
    		praecoxCalendarConfig,
    		$praecoxCalendarData,
    		$praecoxCalendarConfig
    	});

    	$$self.$inject_state = $$props => {
    		if ('changed' in $$props) $$invalidate(16, changed = $$props.changed);
    		if ('nowDate' in $$props) $$invalidate(5, nowDate = $$props.nowDate);
    		if ('lang' in $$props) $$invalidate(6, lang = $$props.lang);
    		if ('viewDate' in $$props) $$invalidate(7, viewDate = $$props.viewDate);
    		if ('pickerRule' in $$props) $$invalidate(8, pickerRule = $$props.pickerRule);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('marked' in $$props) $$invalidate(10, marked = $$props.marked);
    		if ('weekNameMode' in $$props) $$invalidate(11, weekNameMode = $$props.weekNameMode);
    		if ('monthNameMode' in $$props) $$invalidate(12, monthNameMode = $$props.monthNameMode);
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('reSelected' in $$props) $$invalidate(13, reSelected = $$props.reSelected);
    		if ('pickerDone' in $$props) $$invalidate(4, pickerDone = $$props.pickerDone);
    		if ('reloadDisabled' in $$props) $$invalidate(14, reloadDisabled = $$props.reloadDisabled);
    		if ('finishBtn' in $$props) $$invalidate(15, finishBtn = $$props.finishBtn);
    		if ('praecoxCalendarConfig' in $$props) $$invalidate(2, praecoxCalendarConfig = $$props.praecoxCalendarConfig);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$praecoxCalendarData, changed*/ 196608) {
    			if ($praecoxCalendarData.changed > changed) {
    				$$invalidate(16, changed = $praecoxCalendarData.changed);
    				dispatch("change", $praecoxCalendarData.selected);
    			}
    		}
    	};

    	return [
    		theme,
    		praecoxCalendarData,
    		praecoxCalendarConfig,
    		selected,
    		pickerDone,
    		nowDate,
    		lang,
    		viewDate,
    		pickerRule,
    		disabled,
    		marked,
    		weekNameMode,
    		monthNameMode,
    		reSelected,
    		reloadDisabled,
    		finishBtn,
    		changed,
    		$praecoxCalendarData
    	];
    }

    class Calendar$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			nowDate: 5,
    			lang: 6,
    			viewDate: 7,
    			pickerRule: 8,
    			disabled: 9,
    			selected: 3,
    			marked: 10,
    			weekNameMode: 11,
    			monthNameMode: 12,
    			theme: 0,
    			reSelected: 13,
    			pickerDone: 4,
    			reloadDisabled: 14,
    			finishBtn: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get nowDate() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nowDate(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lang() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewDate() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewDate(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pickerRule() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pickerRule(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marked() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marked(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weekNameMode() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weekNameMode(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get monthNameMode() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set monthNameMode(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reSelected() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reSelected(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pickerDone() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pickerDone(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reloadDisabled() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reloadDisabled(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get finishBtn() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set finishBtn(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src\structure\Calendar.svelte generated by Svelte v3.44.2 */

    const { console: console_1$5 } = globals;
    const file$9 = "src\\structure\\Calendar.svelte";

    // (165:8) {:else}
    function create_else_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "You have selected a date:";
    			add_location(span, file$9, 165, 12, 5741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(165:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (159:68) 
    function create_if_block_3$2(ctx) {
    	let span;
    	let t0;
    	let t1_value = constructDay(new Date(/*selected*/ ctx[1][0])) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("You have selected a date: ");
    			t1 = text(t1_value);
    			add_location(span, file$9, 159, 12, 5562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected*/ 2 && t1_value !== (t1_value = constructDay(new Date(/*selected*/ ctx[1][0])) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(159:68) ",
    		ctx
    	});

    	return block;
    }

    // (154:8) {#if selected[0] !== selected[1] && selected.length > 0}
    function create_if_block_2$2(ctx) {
    	let span;
    	let t0;
    	let t1_value = constructDay(new Date(/*selected*/ ctx[1][0])) + "";
    	let t1;
    	let t2;
    	let t3_value = constructDay(new Date(/*selected*/ ctx[1][1])) + "";
    	let t3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("You have selected a date: ");
    			t1 = text(t1_value);
    			t2 = text("\r\n                -- ");
    			t3 = text(t3_value);
    			add_location(span, file$9, 154, 12, 5312);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected*/ 2 && t1_value !== (t1_value = constructDay(new Date(/*selected*/ ctx[1][0])) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*selected*/ 2 && t3_value !== (t3_value = constructDay(new Date(/*selected*/ ctx[1][1])) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(154:8) {#if selected[0] !== selected[1] && selected.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (168:8) {#if selected.length > 0 && acceptShow && !showDatePicker}
    function create_if_block_1$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Send Request For Car";
    			attr_dev(button, "class", "svelte-1r6p099");
    			add_location(button, file$9, 168, 12, 5877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*sendRequest*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(168:8) {#if selected.length > 0 && acceptShow && !showDatePicker}",
    		ctx
    	});

    	return block;
    }

    // (178:16) {#if showDatePicker}
    function create_if_block$3(ctx) {
    	let div;
    	let datepicker;
    	let updating_selected;
    	let updating_pickerDone;
    	let current;

    	function datepicker_selected_binding(value) {
    		/*datepicker_selected_binding*/ ctx[18](value);
    	}

    	function datepicker_pickerDone_binding(value) {
    		/*datepicker_pickerDone_binding*/ ctx[19](value);
    	}

    	let datepicker_props = {
    		theme: "dark",
    		pickerRule: "range",
    		viewDate: /*selected*/ ctx[1][0],
    		reSelected: true,
    		disabled: /*disabled*/ ctx[6],
    		marked: /*marked*/ ctx[9]
    	};

    	if (/*selected*/ ctx[1] !== void 0) {
    		datepicker_props.selected = /*selected*/ ctx[1];
    	}

    	if (/*pickerDone*/ ctx[2] !== void 0) {
    		datepicker_props.pickerDone = /*pickerDone*/ ctx[2];
    	}

    	datepicker = new Calendar$1({ props: datepicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker, 'selected', datepicker_selected_binding));
    	binding_callbacks.push(() => bind(datepicker, 'pickerDone', datepicker_pickerDone_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(datepicker.$$.fragment);
    			add_location(div, file$9, 178, 20, 6275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(datepicker, div, null);
    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const datepicker_changes = {};
    			if (dirty & /*selected*/ 2) datepicker_changes.viewDate = /*selected*/ ctx[1][0];
    			if (dirty & /*disabled*/ 64) datepicker_changes.disabled = /*disabled*/ ctx[6];

    			if (!updating_selected && dirty & /*selected*/ 2) {
    				updating_selected = true;
    				datepicker_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_pickerDone && dirty & /*pickerDone*/ 4) {
    				updating_pickerDone = true;
    				datepicker_changes.pickerDone = /*pickerDone*/ ctx[2];
    				add_flush_callback(() => updating_pickerDone = false);
    			}

    			datepicker.$set(datepicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datepicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datepicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(datepicker);
    			/*div_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(178:16) {#if showDatePicker}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div3;
    	let div2;
    	let t0;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let t7;
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[1][0] !== /*selected*/ ctx[1][1] && /*selected*/ ctx[1].length > 0) return create_if_block_2$2;
    		if (/*selected*/ ctx[1][0] == /*selected*/ ctx[1][1] && /*selected*/ ctx[1].length > 0) return create_if_block_3$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*selected*/ ctx[1].length > 0 && /*acceptShow*/ ctx[3] && !/*showDatePicker*/ ctx[5] && create_if_block_1$2(ctx);
    	let if_block2 = /*showDatePicker*/ ctx[5] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			t0 = text("Price: ");
    			t1 = text(/*price*/ ctx[4]);
    			t2 = text("zł ");
    			br = element("br");
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			button = element("button");
    			button.textContent = "Open Calendar";
    			t7 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block2) if_block2.c();
    			add_location(br, file$9, 152, 25, 5226);
    			attr_dev(button, "class", "svelte-1r6p099");
    			add_location(button, file$9, 170, 8, 5962);
    			attr_dev(div0, "class", "view svelte-1r6p099");
    			set_style(div0, "overflow", "hidden");
    			set_style(div0, "height", /*$heightSpring*/ ctx[8] + "px");
    			add_location(div0, file$9, 172, 12, 6059);
    			attr_dev(div1, "class", "view svelte-1r6p099");
    			add_location(div1, file$9, 171, 8, 6027);
    			attr_dev(div2, "class", "inner");
    			add_location(div2, file$9, 151, 4, 5180);
    			attr_dev(div3, "class", "box");
    			add_location(div3, file$9, 150, 0, 5157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, t0);
    			append_dev(div2, t1);
    			append_dev(div2, t2);
    			append_dev(div2, br);
    			append_dev(div2, t3);
    			if_block0.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t5);
    			append_dev(div2, button);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block2) if_block2.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*hanldBtnClick*/ ctx[11], false, false, false),
    					listen_dev(div0, "click", /*getResult*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*price*/ 16) set_data_dev(t1, /*price*/ ctx[4]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, t4);
    				}
    			}

    			if (/*selected*/ ctx[1].length > 0 && /*acceptShow*/ ctx[3] && !/*showDatePicker*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div2, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*showDatePicker*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*showDatePicker*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$heightSpring*/ 256) {
    				set_style(div0, "height", /*$heightSpring*/ ctx[8] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function findCommonElement(array1, array2) {
    	for (let i = 0; i < array1.length; i++) {
    		for (let j = 0; j < array2.length; j++) {
    			if (array1[i] === array2[j]) {
    				return true;
    			}
    		}
    	}

    	// Return if no common element exist
    	return false;
    }

    function constructDay(day) {
    	return day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let heightStore;

    	let $heightStore,
    		$$unsubscribe_heightStore = noop,
    		$$subscribe_heightStore = () => ($$unsubscribe_heightStore(), $$unsubscribe_heightStore = subscribe(heightStore, $$value => $$invalidate(17, $heightStore = $$value)), heightStore);

    	let $heightSpring;
    	$$self.$$.on_destroy.push(() => $$unsubscribe_heightStore());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	let { car } = $$props;
    	let { dateUnable } = $$props;
    	let { carsList } = $$props;
    	let selected = [];
    	let pickerDone = false;
    	let marked = [];
    	let el;
    	let acceptShow = false;
    	let price = 0;
    	const heightSpring = spring(0, { stiffness: 0.1, damping: 0.8 });
    	validate_store(heightSpring, 'heightSpring');
    	component_subscribe($$self, heightSpring, value => $$invalidate(8, $heightSpring = value));

    	var getDaysArray = function (s, e) {
    		for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    			a.push(new Date(d));
    		}

    		return a;
    	};

    	//     var daylist = getDaysArray(new Date("2018-05-01"),new Date("2018-07-01"));
    	// daylist.map((v)=>v.toISOString().slice(0,10))
    	let showDatePicker = false;

    	let disabled = [];

    	onMount(() => {
    		let day1 = new Date();
    		day1.setTime(day1.getTime() - 48 * 30 * 60 * 60 * 1000);
    		let threeDaysAgo = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    		var daylist = getDaysArray(new Date(threeDaysAgo), new Date());
    		daylist = daylist.map(v => v.toISOString().slice(0, 10));
    		$$invalidate(6, disabled = [...daylist]);
    		$$invalidate(1, selected = []);

    		if (dateUnable.length > 0) {
    			dateUnable.forEach(item => {
    				let distance = getDaysArray(new Date(item.startDay), new Date(item.endDay));
    				distance = distance.map(v => v.toISOString().slice(0, 10));
    				distance.forEach(item2 => disabled.push(item2));
    				distance.forEach(item2 => marked.push(item2));
    			});
    		}
    	}); // console.log(disabled);

    	function hanldBtnClick() {
    		$$invalidate(5, showDatePicker = !showDatePicker);
    	}

    	function getResult() {
    		$$invalidate(3, acceptShow = false);
    		$$invalidate(4, price = 0);

    		if (selected[0] !== selected[1]) {
    			let day = constructDay(new Date(selected[0]));
    			let day1 = constructDay(new Date(selected[1]));

    			if (!(selected[0] < new Date().getTime() || selected[1] < new Date().getTime())) {
    				console.log(day, day1);
    				let distance = getDaysArray(new Date(day), new Date(day1));
    				distance = distance.map(v => v.toISOString().slice(0, 10));
    				let bool = findCommonElement(distance, disabled);

    				if (bool) {
    					alert("The days you have chosen are already ready!");
    					$$invalidate(1, selected[0] = selected[1], selected);
    					console.log(selected);
    				} else {
    					$$invalidate(4, price = distance.length * car.price);
    					$$invalidate(3, acceptShow = true);
    				}
    			} else {
    				alert("Unable to select a date in the past");
    				$$invalidate(1, selected[0] = new Date().getTime(), selected);
    				$$invalidate(1, selected[1] = new Date().getTime(), selected);
    			}
    		} else if (selected[0] === selected[1]) {
    			if (!(selected[0] < new Date().getTime())) {
    				console.log(disabled);

    				if (!disabled.includes(constructDay(new Date(selected[0])))) {
    					$$invalidate(3, acceptShow = true);
    					$$invalidate(4, price = car.price);
    				}
    			}
    		}

    		if (selected.length == 0) {
    			return;
    		}

    		if (pickerDone) {
    			$$invalidate(5, showDatePicker = false);
    		}
    	}

    	async function sendRequest() {
    		let dataToPost = {
    			car,
    			dateRequest: {
    				start: constructDay(new Date(selected[0])),
    				end: constructDay(new Date(selected[1]))
    			}
    		};

    		let request = await fetchBase("carListReservation.php", dataToPost);

    		if (typeof request.query == "boolean" && request.query) {
    			console.log(carsList);
    			$$invalidate(14, carsList = await request.allcars);
    			console.log(carsList);
    			window.location.href = `${window.location.origin}/${address}`;
    		} else {
    			console.warn(request.query);
    		}

    		$$invalidate(1, selected[0] = new Date().getTime(), selected);
    		$$invalidate(1, selected[1] = new Date().getTime(), selected);
    	}

    	const writable_props = ['car', 'dateUnable', 'carsList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	function datepicker_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	function datepicker_pickerDone_binding(value) {
    		pickerDone = value;
    		$$invalidate(2, pickerDone);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('car' in $$props) $$invalidate(15, car = $$props.car);
    		if ('dateUnable' in $$props) $$invalidate(16, dateUnable = $$props.dateUnable);
    		if ('carsList' in $$props) $$invalidate(14, carsList = $$props.carsList);
    	};

    	$$self.$capture_state = () => ({
    		DatePicker: Calendar$1,
    		onMount,
    		createEventDispatcher,
    		fetchBase,
    		address,
    		syncHeight,
    		spring,
    		car,
    		dateUnable,
    		carsList,
    		selected,
    		pickerDone,
    		marked,
    		el,
    		acceptShow,
    		price,
    		heightSpring,
    		getDaysArray,
    		showDatePicker,
    		disabled,
    		findCommonElement,
    		constructDay,
    		hanldBtnClick,
    		getResult,
    		sendRequest,
    		heightStore,
    		$heightStore,
    		$heightSpring
    	});

    	$$self.$inject_state = $$props => {
    		if ('car' in $$props) $$invalidate(15, car = $$props.car);
    		if ('dateUnable' in $$props) $$invalidate(16, dateUnable = $$props.dateUnable);
    		if ('carsList' in $$props) $$invalidate(14, carsList = $$props.carsList);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('pickerDone' in $$props) $$invalidate(2, pickerDone = $$props.pickerDone);
    		if ('marked' in $$props) $$invalidate(9, marked = $$props.marked);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('acceptShow' in $$props) $$invalidate(3, acceptShow = $$props.acceptShow);
    		if ('price' in $$props) $$invalidate(4, price = $$props.price);
    		if ('getDaysArray' in $$props) getDaysArray = $$props.getDaysArray;
    		if ('showDatePicker' in $$props) $$invalidate(5, showDatePicker = $$props.showDatePicker);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('heightStore' in $$props) $$subscribe_heightStore($$invalidate(7, heightStore = $$props.heightStore));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*el*/ 1) {
    			$$subscribe_heightStore($$invalidate(7, heightStore = syncHeight(el)));
    		}

    		if ($$self.$$.dirty & /*$heightStore*/ 131072) {
    			heightSpring.set(open ? $heightStore || 0 : 0);
    		}
    	};

    	return [
    		el,
    		selected,
    		pickerDone,
    		acceptShow,
    		price,
    		showDatePicker,
    		disabled,
    		heightStore,
    		$heightSpring,
    		marked,
    		heightSpring,
    		hanldBtnClick,
    		getResult,
    		sendRequest,
    		carsList,
    		car,
    		dateUnable,
    		$heightStore,
    		datepicker_selected_binding,
    		datepicker_pickerDone_binding,
    		div_binding
    	];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { car: 15, dateUnable: 16, carsList: 14 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*car*/ ctx[15] === undefined && !('car' in props)) {
    			console_1$5.warn("<Calendar> was created without expected prop 'car'");
    		}

    		if (/*dateUnable*/ ctx[16] === undefined && !('dateUnable' in props)) {
    			console_1$5.warn("<Calendar> was created without expected prop 'dateUnable'");
    		}

    		if (/*carsList*/ ctx[14] === undefined && !('carsList' in props)) {
    			console_1$5.warn("<Calendar> was created without expected prop 'carsList'");
    		}
    	}

    	get car() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set car(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateUnable() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateUnable(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get carsList() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set carsList(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\structure\table\TdCell.svelte generated by Svelte v3.44.2 */

    const file$8 = "src\\structure\\table\\TdCell.svelte";

    function create_fragment$8(ctx) {
    	let td;
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			div = element("div");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(div, "class", "text-sm text-gray-900");
    			add_location(div, file$8, 5, 4, 113);
    			attr_dev(td, "class", "px-6 py-4 whitespace-nowrap text-sm text-gray-500");
    			add_location(td, file$8, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TdCell', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TdCell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class TdCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TdCell",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<TdCell> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<TdCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TdCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\structure\RentTable.svelte generated by Svelte v3.44.2 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\structure\\RentTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (89:28) {#if all.length != 0}
    function create_if_block$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*all*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[4];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*all*/ 1) {
    				each_value = /*all*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(89:28) {#if all.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (90:32) {#each all as item, i (item)}
    function create_each_block$2(key_1, ctx) {
    	let tr;
    	let td0;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let tdcell0;
    	let t1;
    	let tdcell1;
    	let t2;
    	let tdcell2;
    	let t3;
    	let tdcell3;
    	let t4;
    	let td1;
    	let calendar;
    	let t5;
    	let current;

    	tdcell0 = new TdCell({
    			props: { name: /*item*/ ctx[4].brand },
    			$$inline: true
    		});

    	tdcell1 = new TdCell({
    			props: { name: /*item*/ ctx[4].model },
    			$$inline: true
    		});

    	tdcell2 = new TdCell({
    			props: { name: /*item*/ ctx[4].year },
    			$$inline: true
    		});

    	tdcell3 = new TdCell({
    			props: { name: /*item*/ ctx[4].price + "zł" },
    			$$inline: true
    		});

    	calendar = new Calendar({
    			props: {
    				carsList: /*item*/ ctx[4].all,
    				car: {
    					brand: /*item*/ ctx[4].brand,
    					model: /*item*/ ctx[4].model,
    					year: /*item*/ ctx[4].year,
    					price: /*item*/ ctx[4].price
    				},
    				dateUnable: [.../*all*/ ctx[0][/*i*/ ctx[6]].busy]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			create_component(tdcell0.$$.fragment);
    			t1 = space();
    			create_component(tdcell1.$$.fragment);
    			t2 = space();
    			create_component(tdcell2.$$.fragment);
    			t3 = space();
    			create_component(tdcell3.$$.fragment);
    			t4 = space();
    			td1 = element("td");
    			create_component(calendar.$$.fragment);
    			t5 = space();
    			attr_dev(img, "class", "h-20 w-50 rounded-full");
    			if (!src_url_equal(img.src, img_src_value = "img/" + /*item*/ ctx[4].brand + "_" + /*item*/ ctx[4].model + "_" + /*item*/ ctx[4].year + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 96, 52, 4870);
    			attr_dev(div0, "class", "flex-shrink-0 h-20 w-20");
    			add_location(div0, file$7, 93, 48, 4676);
    			attr_dev(div1, "class", "flex items-center");
    			add_location(div1, file$7, 92, 44, 4595);
    			attr_dev(td0, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td0, file$7, 91, 40, 4509);
    			attr_dev(td1, "class", "calendar svelte-1ouxq1y");
    			add_location(td1, file$7, 109, 40, 5676);
    			add_location(tr, file$7, 90, 36, 4463);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(tr, t0);
    			mount_component(tdcell0, tr, null);
    			append_dev(tr, t1);
    			mount_component(tdcell1, tr, null);
    			append_dev(tr, t2);
    			mount_component(tdcell2, tr, null);
    			append_dev(tr, t3);
    			mount_component(tdcell3, tr, null);
    			append_dev(tr, t4);
    			append_dev(tr, td1);
    			mount_component(calendar, td1, null);
    			append_dev(tr, t5);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*all*/ 1 && !src_url_equal(img.src, img_src_value = "img/" + /*item*/ ctx[4].brand + "_" + /*item*/ ctx[4].model + "_" + /*item*/ ctx[4].year + ".jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const tdcell0_changes = {};
    			if (dirty & /*all*/ 1) tdcell0_changes.name = /*item*/ ctx[4].brand;
    			tdcell0.$set(tdcell0_changes);
    			const tdcell1_changes = {};
    			if (dirty & /*all*/ 1) tdcell1_changes.name = /*item*/ ctx[4].model;
    			tdcell1.$set(tdcell1_changes);
    			const tdcell2_changes = {};
    			if (dirty & /*all*/ 1) tdcell2_changes.name = /*item*/ ctx[4].year;
    			tdcell2.$set(tdcell2_changes);
    			const tdcell3_changes = {};
    			if (dirty & /*all*/ 1) tdcell3_changes.name = /*item*/ ctx[4].price + "zł";
    			tdcell3.$set(tdcell3_changes);
    			const calendar_changes = {};
    			if (dirty & /*all*/ 1) calendar_changes.carsList = /*item*/ ctx[4].all;

    			if (dirty & /*all*/ 1) calendar_changes.car = {
    				brand: /*item*/ ctx[4].brand,
    				model: /*item*/ ctx[4].model,
    				year: /*item*/ ctx[4].year,
    				price: /*item*/ ctx[4].price
    			};

    			if (dirty & /*all*/ 1) calendar_changes.dateUnable = [.../*all*/ ctx[0][/*i*/ ctx[6]].busy];
    			calendar.$set(calendar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tdcell0.$$.fragment, local);
    			transition_in(tdcell1.$$.fragment, local);
    			transition_in(tdcell2.$$.fragment, local);
    			transition_in(tdcell3.$$.fragment, local);
    			transition_in(calendar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tdcell0.$$.fragment, local);
    			transition_out(tdcell1.$$.fragment, local);
    			transition_out(tdcell2.$$.fragment, local);
    			transition_out(tdcell3.$$.fragment, local);
    			transition_out(calendar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(tdcell0);
    			destroy_component(tdcell1);
    			destroy_component(tdcell2);
    			destroy_component(tdcell3);
    			destroy_component(calendar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(90:32) {#each all as item, i (item)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t10;
    	let div0;
    	let t11;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t16;
    	let tbody;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*all*/ ctx[0].length != 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Car";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Brand";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Model";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Year";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Price for one day";
    			t9 = space();
    			th5 = element("th");
    			t10 = text("Calendary\r\n                                    ");
    			div0 = element("div");
    			t11 = text("Sort option:\r\n                                        ");
    			select = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "By Brand";
    			option2 = element("option");
    			option2.textContent = "By Model";
    			option3 = element("option");
    			option3.textContent = "By Year";
    			option4 = element("option");
    			option4.textContent = "By Price";
    			t16 = space();
    			tbody = element("tbody");
    			if (if_block) if_block.c();
    			attr_dev(th0, "scope", "col");
    			attr_dev(th0, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th0, file$7, 28, 32, 1007);
    			attr_dev(th1, "scope", "col");
    			attr_dev(th1, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th1, file$7, 34, 32, 1332);
    			attr_dev(th2, "scope", "col");
    			attr_dev(th2, "class", "px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th2, file$7, 40, 32, 1659);
    			attr_dev(th3, "scope", "col");
    			attr_dev(th3, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th3, file$7, 46, 32, 1986);
    			attr_dev(th4, "scope", "col");
    			attr_dev(th4, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th4, file$7, 52, 32, 2312);
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.disabled = true;
    			add_location(option0, file$7, 69, 44, 3275);
    			option1.__value = "byBrand";
    			option1.value = option1.__value;
    			add_location(option1, file$7, 70, 44, 3349);
    			option2.__value = "byModel";
    			option2.value = option2.__value;
    			add_location(option2, file$7, 73, 44, 3532);
    			option3.__value = "byYear";
    			option3.value = option3.__value;
    			add_location(option3, file$7, 76, 44, 3715);
    			option4.__value = "byPrice";
    			option4.value = option4.__value;
    			add_location(option4, file$7, 79, 44, 3896);
    			if (/*sortBy*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file$7, 65, 40, 3050);
    			add_location(div0, file$7, 63, 36, 2949);
    			attr_dev(th5, "scope", "col");
    			attr_dev(th5, "class", "text-left text-xs font-medium text-gray-500 uppercase tracking-wider insideJoke svelte-1ouxq1y");
    			add_location(th5, file$7, 58, 32, 2651);
    			add_location(tr, file$7, 27, 28, 969);
    			attr_dev(thead, "class", "bg-gray-50");
    			add_location(thead, file$7, 26, 24, 913);
    			attr_dev(tbody, "class", "bg-white divide-y divide-gray-200");
    			add_location(tbody, file$7, 87, 24, 4262);
    			attr_dev(table, "class", "min-w-full divide-y divide-gray-200");
    			add_location(table, file$7, 25, 20, 836);
    			attr_dev(div1, "class", "shadow overflow-hidden border-b border-gray-200 sm:rounded-lg");
    			add_location(div1, file$7, 22, 16, 700);
    			attr_dev(div2, "class", "py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 concon2 svelte-1ouxq1y");
    			add_location(div2, file$7, 19, 12, 572);
    			attr_dev(div3, "class", "-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 concon svelte-1ouxq1y");
    			add_location(div3, file$7, 18, 8, 498);
    			attr_dev(div4, "class", "flex flex-col");
    			add_location(div4, file$7, 17, 4, 461);
    			add_location(main, file$7, 16, 0, 449);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			append_dev(th5, div0);
    			append_dev(div0, t11);
    			append_dev(div0, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			select_option(select, /*sortBy*/ ctx[1]);
    			append_dev(table, t16);
    			append_dev(table, tbody);
    			if (if_block) if_block.m(tbody, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[3]),
    					listen_dev(select, "change", /*change*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sortBy*/ 2) {
    				select_option(select, /*sortBy*/ ctx[1]);
    			}

    			if (/*all*/ ctx[0].length != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*all*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(tbody, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RentTable', slots, []);
    	let { all = [] } = $$props;
    	let sortBy = "";

    	let change = () => {
    		let sorted = sortCars(all, sortBy);
    		console.log(sorted);
    		$$invalidate(0, all = [...sorted]);
    	};

    	const writable_props = ['all'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<RentTable> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		sortBy = select_value(this);
    		$$invalidate(1, sortBy);
    	}

    	$$self.$$set = $$props => {
    		if ('all' in $$props) $$invalidate(0, all = $$props.all);
    	};

    	$$self.$capture_state = () => ({
    		Calendar,
    		onMount,
    		createEventDispatcher,
    		sortCars,
    		TdCell,
    		App,
    		all,
    		sortBy,
    		change
    	});

    	$$self.$inject_state = $$props => {
    		if ('all' in $$props) $$invalidate(0, all = $$props.all);
    		if ('sortBy' in $$props) $$invalidate(1, sortBy = $$props.sortBy);
    		if ('change' in $$props) $$invalidate(2, change = $$props.change);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [all, sortBy, change, select_change_handler];
    }

    class RentTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { all: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RentTable",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get all() {
    		throw new Error("<RentTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set all(value) {
    		throw new Error("<RentTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\home.svelte generated by Svelte v3.44.2 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\home.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let header;
    	let t;
    	let renttable;
    	let current;

    	header = new Header({
    			props: { acc: /*acType*/ ctx[1] },
    			$$inline: true
    		});

    	const renttable_spread_levels = [/*carList*/ ctx[0]];
    	let renttable_props = {};

    	for (let i = 0; i < renttable_spread_levels.length; i += 1) {
    		renttable_props = assign(renttable_props, renttable_spread_levels[i]);
    	}

    	renttable = new RentTable({ props: renttable_props, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(renttable.$$.fragment);
    			add_location(main, file$6, 24, 0, 660);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);
    			mount_component(renttable, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*acType*/ 2) header_changes.acc = /*acType*/ ctx[1];
    			header.$set(header_changes);

    			const renttable_changes = (dirty & /*carList*/ 1)
    			? get_spread_update(renttable_spread_levels, [get_spread_object(/*carList*/ ctx[0])])
    			: {};

    			renttable.$set(renttable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(renttable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(renttable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(renttable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let carList = { all: [] };

    	onMount(async () => {
    		let request = await fetchBase("carListReservation.php", { allCarList: true });
    		$$invalidate(0, carList.all = await request.allcars, carList);
    		console.log(carList);
    	});

    	let acType;
    	accountType.subscribe(val => $$invalidate(1, acType = val));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		navigate,
    		Header,
    		accountType,
    		fetchBase,
    		address,
    		RentTable,
    		onMount,
    		carList,
    		acType
    	});

    	$$self.$inject_state = $$props => {
    		if ('carList' in $$props) $$invalidate(0, carList = $$props.carList);
    		if ('acType' in $$props) $$invalidate(1, acType = $$props.acType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [carList, acType];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\accountsOperations\Login.svelte generated by Svelte v3.44.2 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\accountsOperations\\Login.svelte";

    // (57:20) <Link                          to={newAddress}                          class="font-medium text-indigo-600 hover:text-indigo-500"                      >
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Register");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(57:20) <Link                          to={newAddress}                          class=\\\"font-medium text-indigo-600 hover:text-indigo-500\\\"                      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let div6;
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t2;
    	let p;
    	let t3;
    	let link;
    	let t4;
    	let form;
    	let input0;
    	let t5;
    	let div3;
    	let div1;
    	let label0;
    	let t7;
    	let input1;
    	let t8;
    	let div2;
    	let label1;
    	let t10;
    	let input2;
    	let t11;
    	let div4;
    	let button;
    	let span;
    	let svg;
    	let path;
    	let t12;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: /*newAddress*/ ctx[0],
    				class: "font-medium text-indigo-600 hover:text-indigo-500",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Sign in to your account";
    			t2 = space();
    			p = element("p");
    			t3 = text("Or\r\n                    \r\n                    ");
    			create_component(link.$$.fragment);
    			t4 = space();
    			form = element("form");
    			input0 = element("input");
    			t5 = space();
    			div3 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email address";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			div4 = element("div");
    			button = element("button");
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t12 = text("\r\n                        Sign in");
    			attr_dev(img, "class", "mx-auto h-12 w-auto");
    			if (!src_url_equal(img.src, img_src_value = "https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Workflow");
    			add_location(img, file$5, 43, 16, 1388);
    			attr_dev(h2, "class", "mt-6 text-center text-3xl font-extrabold text-gray-900");
    			add_location(h2, file$5, 48, 16, 1604);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600");
    			add_location(p, file$5, 53, 16, 1796);
    			add_location(div0, file$5, 42, 12, 1365);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			input0.value = "true";
    			add_location(input0, file$5, 65, 16, 2313);
    			attr_dev(label0, "for", "email-address");
    			attr_dev(label0, "class", "sr-only");
    			add_location(label0, file$5, 68, 24, 2482);
    			attr_dev(input1, "id", "email-address");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "autocomplete", "email");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Email address");
    			add_location(input1, file$5, 71, 24, 2628);
    			add_location(div1, file$5, 67, 20, 2451);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "sr-only");
    			add_location(label1, file$5, 83, 24, 3324);
    			attr_dev(input2, "id", "password");
    			attr_dev(input2, "name", "password");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "autocomplete", "current-password");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$5, 84, 24, 3404);
    			add_location(div2, file$5, 82, 20, 3293);
    			attr_dev(div3, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div3, file$5, 66, 16, 2383);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$5, 113, 32, 5091);
    			attr_dev(svg, "class", "h-5 w-5 text-indigo-500 group-hover:text-indigo-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$5, 106, 28, 4703);
    			attr_dev(span, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span, file$5, 102, 24, 4484);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$5, 98, 20, 4128);
    			add_location(div4, file$5, 97, 16, 4101);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			add_location(form, file$5, 64, 12, 2230);
    			attr_dev(div5, "class", "max-w-md w-full space-y-8");
    			add_location(div5, file$5, 41, 8, 1312);
    			attr_dev(div6, "class", "min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div6, file$5, 38, 4, 1203);
    			add_location(main, file$5, 37, 0, 1191);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h2);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			mount_component(link, p, null);
    			append_dev(div5, t4);
    			append_dev(div5, form);
    			append_dev(form, input0);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*email*/ ctx[1]);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t10);
    			append_dev(div2, input2);
    			set_input_value(input2, /*password*/ ctx[2]);
    			append_dev(form, t11);
    			append_dev(form, div4);
    			append_dev(div4, button);
    			append_dev(button, span);
    			append_dev(span, svg);
    			append_dev(svg, path);
    			append_dev(button, t12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*validate*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (dirty & /*email*/ 2 && input1.value !== /*email*/ ctx[1]) {
    				set_input_value(input1, /*email*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input2.value !== /*password*/ ctx[2]) {
    				set_input_value(input2, /*password*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const newAddress = address + "register";

    	window.addEventListener("DOMContentLoaded", async event => {
    		console.log("DOM fully loaded and parsed");
    		await loadPage();
    	});

    	let email;
    	let password;

    	let validate = async () => {
    		let data = await fetchBase("login.php", { email, passwd: password });
    		console.log(data);
    		if ("logged" in data && data.logged) loadPage(); else if ("logged" in data && data.logged) alert("Login failed!");
    		if ("emailInBase" in data && !data.emailInBase) alert("Email address doesn't exist in base");
    		if ("message" in data && data.message) alert(data.message);
    	};

    	let loadPage = async () => {
    		let data = await fetchBase("main.php", { openPage: true });

    		if ("exist" in data && data.exist) {
    			accountType.set(data.accountType);
    			navigate("home");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(1, email);
    	}

    	function input2_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		navigate,
    		address,
    		accountType,
    		fetchBase,
    		newAddress,
    		email,
    		password,
    		validate,
    		loadPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('validate' in $$props) $$invalidate(3, validate = $$props.validate);
    		if ('loadPage' in $$props) loadPage = $$props.loadPage;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newAddress,
    		email,
    		password,
    		validate,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { newAddress: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get newAddress() {
    		return this.$$.ctx[0];
    	}

    	set newAddress(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\accountsOperations\Register.svelte generated by Svelte v3.44.2 */
    const file$4 = "src\\accountsOperations\\Register.svelte";

    // (44:20) <Link                          to={newAddress}                          class="font-medium text-indigo-600 hover:text-indigo-500"                      >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(44:20) <Link                          to={newAddress}                          class=\\\"font-medium text-indigo-600 hover:text-indigo-500\\\"                      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div7;
    	let div6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t2;
    	let p;
    	let t3;
    	let link;
    	let t4;
    	let form;
    	let input0;
    	let t5;
    	let div4;
    	let div1;
    	let label0;
    	let t7;
    	let input1;
    	let t8;
    	let div2;
    	let label1;
    	let t10;
    	let input2;
    	let t11;
    	let div3;
    	let label2;
    	let t13;
    	let input3;
    	let t14;
    	let div5;
    	let button;
    	let span;
    	let svg;
    	let path;
    	let t15;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: /*newAddress*/ ctx[0],
    				class: "font-medium text-indigo-600 hover:text-indigo-500",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div7 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Register your account";
    			t2 = space();
    			p = element("p");
    			t3 = text("Or\r\n                    \r\n                    ");
    			create_component(link.$$.fragment);
    			t4 = space();
    			form = element("form");
    			input0 = element("input");
    			t5 = space();
    			div4 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Email address";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Password";
    			t13 = space();
    			input3 = element("input");
    			t14 = space();
    			div5 = element("div");
    			button = element("button");
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t15 = text("\r\n                        Sign up");
    			attr_dev(img, "class", "mx-auto h-12 w-auto");
    			if (!src_url_equal(img.src, img_src_value = "https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Workflow");
    			add_location(img, file$4, 30, 16, 1076);
    			attr_dev(h2, "class", "mt-6 text-center text-3xl font-extrabold text-gray-900");
    			add_location(h2, file$4, 35, 16, 1292);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600");
    			add_location(p, file$4, 40, 16, 1482);
    			add_location(div0, file$4, 29, 12, 1053);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			input0.value = "true";
    			add_location(input0, file$4, 52, 16, 1981);
    			attr_dev(label0, "for", "username");
    			attr_dev(label0, "class", "sr-only");
    			add_location(label0, file$4, 55, 24, 2150);
    			attr_dev(input1, "id", "username");
    			attr_dev(input1, "name", "username");
    			attr_dev(input1, "type", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Username");
    			add_location(input1, file$4, 56, 24, 2230);
    			add_location(div1, file$4, 54, 20, 2119);
    			attr_dev(label1, "for", "email-address");
    			attr_dev(label1, "class", "sr-only");
    			add_location(label1, file$4, 66, 24, 2820);
    			attr_dev(input2, "id", "email-address");
    			attr_dev(input2, "name", "email");
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "autocomplete", "email");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Email address");
    			add_location(input2, file$4, 69, 24, 2966);
    			add_location(div2, file$4, 65, 20, 2789);
    			attr_dev(label2, "for", "password");
    			attr_dev(label2, "class", "sr-only");
    			add_location(label2, file$4, 80, 24, 3614);
    			attr_dev(input3, "id", "password");
    			attr_dev(input3, "name", "password");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "autocomplete", "current-password");
    			input3.required = true;
    			attr_dev(input3, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input3, "placeholder", "Password");
    			add_location(input3, file$4, 81, 24, 3694);
    			add_location(div3, file$4, 79, 20, 3583);
    			attr_dev(div4, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div4, file$4, 53, 16, 2051);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$4, 109, 32, 5330);
    			attr_dev(svg, "class", "h-5 w-5 text-indigo-500 group-hover:text-indigo-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$4, 102, 28, 4942);
    			attr_dev(span, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span, file$4, 98, 24, 4723);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$4, 94, 20, 4367);
    			add_location(div5, file$4, 93, 16, 4340);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			add_location(form, file$4, 51, 12, 1913);
    			attr_dev(div6, "class", "max-w-md w-full space-y-8");
    			add_location(div6, file$4, 28, 8, 1000);
    			attr_dev(div7, "class", "min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div7, file$4, 25, 4, 891);
    			add_location(main, file$4, 24, 0, 879);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h2);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			mount_component(link, p, null);
    			append_dev(div6, t4);
    			append_dev(div6, form);
    			append_dev(form, input0);
    			append_dev(form, t5);
    			append_dev(form, div4);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			append_dev(div4, t8);
    			append_dev(div4, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t10);
    			append_dev(div2, input2);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t13);
    			append_dev(div3, input3);
    			append_dev(form, t14);
    			append_dev(form, div5);
    			append_dev(div5, button);
    			append_dev(button, span);
    			append_dev(span, svg);
    			append_dev(svg, path);
    			append_dev(button, t15);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*validate*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	const newAddress = address + "";

    	async function validate(e) {
    		e.preventDefault();

    		let res = await fetchBase("register.php", {
    			email: document.getElementById("email-address").value,
    			username: document.getElementById("username").value,
    			passwd: document.getElementById("password").value
    		});

    		if ("registered" in res && res.registered) {
    			window.location.href = `${window.location.origin}/${address}`;
    		} else if (registered in res && !res.registered) {
    			alert("Error while registering!");
    		}

    		if ("emailExist" in res && res.emailExist) {
    			alert("Email already exists");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		address,
    		fetchBase,
    		newAddress,
    		validate
    	});

    	return [newAddress, validate];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { newAddress: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get newAddress() {
    		return this.$$.ctx[0];
    	}

    	set newAddress(value) {
    		throw new Error("<Register>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*
     * QRious v4.0.2
     * Copyright (C) 2017 Alasdair Mercer
     * Copyright (C) 2010 Tom Zerucha
     *
     * This program is free software: you can redistribute it and/or modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     *
     * This program is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     *
     * You should have received a copy of the GNU General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     */

    var qrcode = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
      }(commonjsGlobal, (function () {  
        /*
         * Copyright (C) 2017 Alasdair Mercer, !ninja
         *
         * Permission is hereby granted, free of charge, to any person obtaining a copy
         * of this software and associated documentation files (the "Software"), to deal
         * in the Software without restriction, including without limitation the rights
         * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         * copies of the Software, and to permit persons to whom the Software is
         * furnished to do so, subject to the following conditions:
         *
         * The above copyright notice and this permission notice shall be included in all
         * copies or substantial portions of the Software.
         *
         * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
         * SOFTWARE.
         */
      
        /**
         * A bare-bones constructor for surrogate prototype swapping.
         *
         * @private
         * @constructor
         */
        var Constructor = /* istanbul ignore next */ function() {};
        /**
         * A reference to <code>Object.prototype.hasOwnProperty</code>.
         *
         * @private
         * @type {Function}
         */
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        /**
         * A reference to <code>Array.prototype.slice</code>.
         *
         * @private
         * @type {Function}
         */
        var slice = Array.prototype.slice;
      
        /**
         * Creates an object which inherits the given <code>prototype</code>.
         *
         * Optionally, the created object can be extended further with the specified <code>properties</code>.
         *
         * @param {Object} prototype - the prototype to be inherited by the created object
         * @param {Object} [properties] - the optional properties to be extended by the created object
         * @return {Object} The newly created object.
         * @private
         */
        function createObject(prototype, properties) {
          var result;
          /* istanbul ignore next */
          if (typeof Object.create === 'function') {
            result = Object.create(prototype);
          } else {
            Constructor.prototype = prototype;
            result = new Constructor();
            Constructor.prototype = null;
          }
      
          if (properties) {
            extendObject(true, result, properties);
          }
      
          return result;
        }
      
        /**
         * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
         * <code>statics</code> provided.
         *
         * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
         * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
         * instead. The class name may also be used string representation for instances of the child constructor (via
         * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
         *
         * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
         * constructor which only calls the super constructor will be used instead.
         *
         * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
         *
         * @param {string} [name=this.class_] - the class name to be used for the child constructor
         * @param {Function} [constructor] - the constructor for the child
         * @param {Object} [prototype] - the prototype properties to be defined for the child
         * @param {Object} [statics] - the static properties to be defined for the child
         * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
         * @public
         */
        function extend(name, constructor, prototype, statics) {
          var superConstructor = this;
      
          if (typeof name !== 'string') {
            statics = prototype;
            prototype = constructor;
            constructor = name;
            name = null;
          }
      
          if (typeof constructor !== 'function') {
            statics = prototype;
            prototype = constructor;
            constructor = function() {
              return superConstructor.apply(this, arguments);
            };
          }
      
          extendObject(false, constructor, superConstructor, statics);
      
          constructor.prototype = createObject(superConstructor.prototype, prototype);
          constructor.prototype.constructor = constructor;
      
          constructor.class_ = name || superConstructor.class_;
          constructor.super_ = superConstructor;
      
          return constructor;
        }
      
        /**
         * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
         *
         * if any source is <code>null</code> it will be ignored.
         *
         * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
         * <code>target</code>; otherwise <code>false</code>
         * @param {Object} target - the target object which should be extended
         * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
         * @return {void}
         * @private
         */
        function extendObject(own, target, sources) {
          sources = slice.call(arguments, 2);
      
          var property;
          var source;
      
          for (var i = 0, length = sources.length; i < length; i++) {
            source = sources[i];
      
            for (property in source) {
              if (!own || hasOwnProperty.call(source, property)) {
                target[property] = source[property];
              }
            }
          }
        }
      
        var extend_1 = extend;
      
        /**
         * The base class from which all others should extend.
         *
         * @public
         * @constructor
         */
        function Nevis() {}
        Nevis.class_ = 'Nevis';
        Nevis.super_ = Object;
      
        /**
         * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
         * <code>statics</code> provided.
         *
         * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
         * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
         * instead. The class name may also be used string representation for instances of the child constructor (via
         * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
         *
         * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
         * constructor which only calls the super constructor will be used instead.
         *
         * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
         *
         * @param {string} [name=this.class_] - the class name to be used for the child constructor
         * @param {Function} [constructor] - the constructor for the child
         * @param {Object} [prototype] - the prototype properties to be defined for the child
         * @param {Object} [statics] - the static properties to be defined for the child
         * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
         * @public
         * @static
         * @memberof Nevis
         */
        Nevis.extend = extend_1;
      
        var nevis = Nevis;
      
        var lite = nevis;
      
        /**
         * Responsible for rendering a QR code {@link Frame} on a specific type of element.
         *
         * A renderer may be dependant on the rendering of another element, so the ordering of their execution is important.
         *
         * The rendering of a element can be deferred by disabling the renderer initially, however, any attempt get the element
         * from the renderer will result in it being immediately enabled and the element being rendered.
         *
         * @param {QRious} qrious - the {@link QRious} instance to be used
         * @param {*} element - the element onto which the QR code is to be rendered
         * @param {boolean} [enabled] - <code>true</code> this {@link Renderer} is enabled; otherwise <code>false</code>.
         * @public
         * @class
         * @extends Nevis
         */
        var Renderer = lite.extend(function(qrious, element, enabled) {
          /**
           * The {@link QRious} instance.
           *
           * @protected
           * @type {QRious}
           * @memberof Renderer#
           */
          this.qrious = qrious;
      
          /**
           * The element onto which this {@link Renderer} is rendering the QR code.
           *
           * @protected
           * @type {*}
           * @memberof Renderer#
           */
          this.element = element;
          this.element.qrious = qrious;
      
          /**
           * Whether this {@link Renderer} is enabled.
           *
           * @protected
           * @type {boolean}
           * @memberof Renderer#
           */
          this.enabled = Boolean(enabled);
        }, {
      
          /**
           * Draws the specified QR code <code>frame</code> on the underlying element.
           *
           * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
           *
           * @param {Frame} frame - the {@link Frame} to be drawn
           * @return {void}
           * @protected
           * @abstract
           * @memberof Renderer#
           */
          draw: function(frame) {},
      
          /**
           * Returns the element onto which this {@link Renderer} is rendering the QR code.
           *
           * If this method is called while this {@link Renderer} is disabled, it will be immediately enabled and rendered
           * before the element is returned.
           *
           * @return {*} The element.
           * @public
           * @memberof Renderer#
           */
          getElement: function() {
            if (!this.enabled) {
              this.enabled = true;
              this.render();
            }
      
            return this.element;
          },
      
          /**
           * Calculates the size (in pixel units) to represent an individual module within the QR code based on the
           * <code>frame</code> provided.
           *
           * Any configured padding will be excluded from the returned size.
           *
           * The returned value will be at least one, even in cases where the size of the QR code does not fit its contents.
           * This is done so that the inevitable clipping is handled more gracefully since this way at least something is
           * displayed instead of just a blank space filled by the background color.
           *
           * @param {Frame} frame - the {@link Frame} from which the module size is to be derived
           * @return {number} The pixel size for each module in the QR code which will be no less than one.
           * @protected
           * @memberof Renderer#
           */
          getModuleSize: function(frame) {
            var qrious = this.qrious;
            var padding = qrious.padding || 0;
            var pixels = Math.floor((qrious.size - (padding * 2)) / frame.width);
      
            return Math.max(1, pixels);
          },

          /**
           * Renders a QR code on the underlying element based on the <code>frame</code> provided.
           *
           * @param {Frame} frame - the {@link Frame} to be rendered
           * @return {void}
           * @public
           * @memberof Renderer#
           */
          render: function(frame) {
            if (this.enabled) {
              this.resize();
              this.reset();
              this.draw(frame);
            }
          },
      
          /**
           * Resets the underlying element, effectively clearing any previously rendered QR code.
           *
           * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
           *
           * @return {void}
           * @protected
           * @abstract
           * @memberof Renderer#
           */
          reset: function() {},
      
          /**
           * Ensures that the size of the underlying element matches that defined on the associated {@link QRious} instance.
           *
           * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
           *
           * @return {void}
           * @protected
           * @abstract
           * @memberof Renderer#
           */
          resize: function() {}
      
        });
      
        var Renderer_1 = Renderer;
      
        /**
         * An implementation of {@link Renderer} for working with <code>canvas</code> elements.
         *
         * @public
         * @class
         * @extends Renderer
         */
        var CanvasRenderer = Renderer_1.extend({
      
          /**
           * @override
           */
          draw: function(frame) {
            var i, j;
            var qrious = this.qrious;
            var moduleSize = this.getModuleSize(frame);
            var offset = parseInt((this.element.width-(frame.width * moduleSize)) / 2);
            var context = this.element.getContext('2d');
      
            context.fillStyle = qrious.foreground;
            context.globalAlpha = qrious.foregroundAlpha;
      
            for (i = 0; i < frame.width; i++) {
              for (j = 0; j < frame.width; j++) {
                if (frame.buffer[(j * frame.width) + i]) {
                  context.fillRect((moduleSize * i) + offset, (moduleSize * j) + offset, moduleSize, moduleSize);
                }
              }
            }
          },
      
          /**
           * @override
           */
          reset: function() {
            var qrious = this.qrious;
            var context = this.element.getContext('2d');
            var size = qrious.size;
      
            context.lineWidth = 1;
            context.clearRect(0, 0, size, size);
            context.fillStyle = qrious.background;
            context.globalAlpha = qrious.backgroundAlpha;
            context.fillRect(0, 0, size, size);
          },
      
          /**
           * @override
           */
          resize: function() {
            var element = this.element;
      
            element.width = element.height = this.qrious.size;
          }
      
        });
      
        var CanvasRenderer_1 = CanvasRenderer;
      
        /* eslint no-multi-spaces: "off" */
      
      
      
        /**
         * Contains alignment pattern information.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var Alignment = lite.extend(null, {
      
          /**
           * The alignment pattern block.
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof Alignment
           */
          BLOCK: [
            0,  11, 15, 19, 23, 27, 31,
            16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
            26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
          ]
      
        });
      
        var Alignment_1 = Alignment;
      
        /* eslint no-multi-spaces: "off" */
      
      
      
        /**
         * Contains error correction information.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var ErrorCorrection = lite.extend(null, {
      
          /**
           * The error correction blocks.
           *
           * There are four elements per version. The first two indicate the number of blocks, then the data width, and finally
           * the ECC width.
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof ErrorCorrection
           */
          BLOCKS: [
            1,  0,  19,  7,     1,  0,  16,  10,    1,  0,  13,  13,    1,  0,  9,   17,
            1,  0,  34,  10,    1,  0,  28,  16,    1,  0,  22,  22,    1,  0,  16,  28,
            1,  0,  55,  15,    1,  0,  44,  26,    2,  0,  17,  18,    2,  0,  13,  22,
            1,  0,  80,  20,    2,  0,  32,  18,    2,  0,  24,  26,    4,  0,  9,   16,
            1,  0,  108, 26,    2,  0,  43,  24,    2,  2,  15,  18,    2,  2,  11,  22,
            2,  0,  68,  18,    4,  0,  27,  16,    4,  0,  19,  24,    4,  0,  15,  28,
            2,  0,  78,  20,    4,  0,  31,  18,    2,  4,  14,  18,    4,  1,  13,  26,
            2,  0,  97,  24,    2,  2,  38,  22,    4,  2,  18,  22,    4,  2,  14,  26,
            2,  0,  116, 30,    3,  2,  36,  22,    4,  4,  16,  20,    4,  4,  12,  24,
            2,  2,  68,  18,    4,  1,  43,  26,    6,  2,  19,  24,    6,  2,  15,  28,
            4,  0,  81,  20,    1,  4,  50,  30,    4,  4,  22,  28,    3,  8,  12,  24,
            2,  2,  92,  24,    6,  2,  36,  22,    4,  6,  20,  26,    7,  4,  14,  28,
            4,  0,  107, 26,    8,  1,  37,  22,    8,  4,  20,  24,    12, 4,  11,  22,
            3,  1,  115, 30,    4,  5,  40,  24,    11, 5,  16,  20,    11, 5,  12,  24,
            5,  1,  87,  22,    5,  5,  41,  24,    5,  7,  24,  30,    11, 7,  12,  24,
            5,  1,  98,  24,    7,  3,  45,  28,    15, 2,  19,  24,    3,  13, 15,  30,
            1,  5,  107, 28,    10, 1,  46,  28,    1,  15, 22,  28,    2,  17, 14,  28,
            5,  1,  120, 30,    9,  4,  43,  26,    17, 1,  22,  28,    2,  19, 14,  28,
            3,  4,  113, 28,    3,  11, 44,  26,    17, 4,  21,  26,    9,  16, 13,  26,
            3,  5,  107, 28,    3,  13, 41,  26,    15, 5,  24,  30,    15, 10, 15,  28,
            4,  4,  116, 28,    17, 0,  42,  26,    17, 6,  22,  28,    19, 6,  16,  30,
            2,  7,  111, 28,    17, 0,  46,  28,    7,  16, 24,  30,    34, 0,  13,  24,
            4,  5,  121, 30,    4,  14, 47,  28,    11, 14, 24,  30,    16, 14, 15,  30,
            6,  4,  117, 30,    6,  14, 45,  28,    11, 16, 24,  30,    30, 2,  16,  30,
            8,  4,  106, 26,    8,  13, 47,  28,    7,  22, 24,  30,    22, 13, 15,  30,
            10, 2,  114, 28,    19, 4,  46,  28,    28, 6,  22,  28,    33, 4,  16,  30,
            8,  4,  122, 30,    22, 3,  45,  28,    8,  26, 23,  30,    12, 28, 15,  30,
            3,  10, 117, 30,    3,  23, 45,  28,    4,  31, 24,  30,    11, 31, 15,  30,
            7,  7,  116, 30,    21, 7,  45,  28,    1,  37, 23,  30,    19, 26, 15,  30,
            5,  10, 115, 30,    19, 10, 47,  28,    15, 25, 24,  30,    23, 25, 15,  30,
            13, 3,  115, 30,    2,  29, 46,  28,    42, 1,  24,  30,    23, 28, 15,  30,
            17, 0,  115, 30,    10, 23, 46,  28,    10, 35, 24,  30,    19, 35, 15,  30,
            17, 1,  115, 30,    14, 21, 46,  28,    29, 19, 24,  30,    11, 46, 15,  30,
            13, 6,  115, 30,    14, 23, 46,  28,    44, 7,  24,  30,    59, 1,  16,  30,
            12, 7,  121, 30,    12, 26, 47,  28,    39, 14, 24,  30,    22, 41, 15,  30,
            6,  14, 121, 30,    6,  34, 47,  28,    46, 10, 24,  30,    2,  64, 15,  30,
            17, 4,  122, 30,    29, 14, 46,  28,    49, 10, 24,  30,    24, 46, 15,  30,
            4,  18, 122, 30,    13, 32, 46,  28,    48, 14, 24,  30,    42, 32, 15,  30,
            20, 4,  117, 30,    40, 7,  47,  28,    43, 22, 24,  30,    10, 67, 15,  30,
            19, 6,  118, 30,    18, 31, 47,  28,    34, 34, 24,  30,    20, 61, 15,  30
          ],
      
          /**
           * The final format bits with mask (level << 3 | mask).
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof ErrorCorrection
           */
          FINAL_FORMAT: [
            // L
            0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
            // M
            0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
            // Q
            0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
            // H
            0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
          ],
      
          /**
           * A map of human-readable ECC levels.
           *
           * @public
           * @static
           * @type {Object.<string, number>}
           * @memberof ErrorCorrection
           */
          LEVELS: {
            L: 1,
            M: 2,
            Q: 3,
            H: 4
          }
      
        });
      
        var ErrorCorrection_1 = ErrorCorrection;
      
        /**
         * Contains Galois field information.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var Galois = lite.extend(null, {
      
          /**
           * The Galois field exponent table.
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof Galois
           */
          EXPONENT: [
            0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
            0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
            0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
            0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
            0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
            0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
            0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
            0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
            0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
            0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
            0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
            0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
            0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
            0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
            0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
            0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
          ],
      
          /**
           * The Galois field log table.
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof Galois
           */
          LOG: [
            0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
            0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
            0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
            0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
            0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
            0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
            0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
            0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
            0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
            0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
            0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
            0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
            0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
            0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
            0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
            0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
          ]
      
        });
      
        var Galois_1 = Galois;
      
        /**
         * Contains version pattern information.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var Version = lite.extend(null, {
      
          /**
           * The version pattern block.
           *
           * @public
           * @static
           * @type {number[]}
           * @memberof Version
           */
          BLOCK: [
            0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532,
            0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5,
            0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69
          ]
      
        });
      
        var Version_1 = Version;
      
        /**
         * Generates information for a QR code frame based on a specific value to be encoded.
         *
         * @param {Frame~Options} options - the options to be used
         * @public
         * @class
         * @extends Nevis
         */
        var Frame = lite.extend(function(options) {
          var dataBlock, eccBlock, index, neccBlock1, neccBlock2;
          var valueLength = options.value.length;
      
          this._badness = [];
          this._level = ErrorCorrection_1.LEVELS[options.level];
          this._polynomial = [];
          this._value = options.value;
          this._version = 0;
          this._stringBuffer = [];
      
          while (this._version < 40) {
            this._version++;
      
            index = ((this._level - 1) * 4) + ((this._version - 1) * 16);
      
            neccBlock1 = ErrorCorrection_1.BLOCKS[index++];
            neccBlock2 = ErrorCorrection_1.BLOCKS[index++];
            dataBlock = ErrorCorrection_1.BLOCKS[index++];
            eccBlock = ErrorCorrection_1.BLOCKS[index];
      
            index = (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + (this._version <= 9);
      
            if (valueLength <= index) {
              break;
            }
          }
      
          this._dataBlock = dataBlock;
          this._eccBlock = eccBlock;
          this._neccBlock1 = neccBlock1;
          this._neccBlock2 = neccBlock2;
      
          /**
           * The data width is based on version.
           *
           * @public
           * @type {number}
           * @memberof Frame#
           */
          // FIXME: Ensure that it fits instead of being truncated.
          var width = this.width = 17 + (4 * this._version);
      
          /**
           * The image buffer.
           *
           * @public
           * @type {number[]}
           * @memberof Frame#
           */
          this.buffer = Frame._createArray(width * width);
      
          this._ecc = Frame._createArray(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
          this._mask = Frame._createArray(((width * (width + 1)) + 1) / 2);
      
          this._insertFinders();
          this._insertAlignments();
      
          // Insert single foreground cell.
          this.buffer[8 + (width * (width - 8))] = 1;
      
          this._insertTimingGap();
          this._reverseMask();
          this._insertTimingRowAndColumn();
          this._insertVersion();
          this._syncMask();
          this._convertBitStream(valueLength);
          this._calculatePolynomial();
          this._appendEccToData();
          this._interleaveBlocks();
          this._pack();
          this._finish();
        }, {
      
          _addAlignment: function(x, y) {
            var i;
            var buffer = this.buffer;
            var width = this.width;
      
            buffer[x + (width * y)] = 1;
      
            for (i = -2; i < 2; i++) {
              buffer[x + i + (width * (y - 2))] = 1;
              buffer[x - 2 + (width * (y + i + 1))] = 1;
              buffer[x + 2 + (width * (y + i))] = 1;
              buffer[x + i + 1 + (width * (y + 2))] = 1;
            }
      
            for (i = 0; i < 2; i++) {
              this._setMask(x - 1, y + i);
              this._setMask(x + 1, y - i);
              this._setMask(x - i, y - 1);
              this._setMask(x + i, y + 1);
            }
          },
      
          _appendData: function(data, dataLength, ecc, eccLength) {
            var bit, i, j;
            var polynomial = this._polynomial;
            var stringBuffer = this._stringBuffer;
      
            for (i = 0; i < eccLength; i++) {
              stringBuffer[ecc + i] = 0;
            }
      
            for (i = 0; i < dataLength; i++) {
              bit = Galois_1.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];
      
              if (bit !== 255) {
                for (j = 1; j < eccLength; j++) {
                  stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
                    Galois_1.EXPONENT[Frame._modN(bit + polynomial[eccLength - j])];
                }
              } else {
                for (j = ecc; j < ecc + eccLength; j++) {
                  stringBuffer[j] = stringBuffer[j + 1];
                }
              }
      
              stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois_1.EXPONENT[Frame._modN(bit + polynomial[0])];
            }
          },
      
          _appendEccToData: function() {
            var i;
            var data = 0;
            var dataBlock = this._dataBlock;
            var ecc = this._calculateMaxLength();
            var eccBlock = this._eccBlock;
      
            for (i = 0; i < this._neccBlock1; i++) {
              this._appendData(data, dataBlock, ecc, eccBlock);
      
              data += dataBlock;
              ecc += eccBlock;
            }
      
            for (i = 0; i < this._neccBlock2; i++) {
              this._appendData(data, dataBlock + 1, ecc, eccBlock);
      
              data += dataBlock + 1;
              ecc += eccBlock;
            }
          },
      
          _applyMask: function(mask) {
            var r3x, r3y, x, y;
            var buffer = this.buffer;
            var width = this.width;
      
            switch (mask) {
            case 0:
              for (y = 0; y < width; y++) {
                for (x = 0; x < width; x++) {
                  if (!((x + y) & 1) && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 1:
              for (y = 0; y < width; y++) {
                for (x = 0; x < width; x++) {
                  if (!(y & 1) && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 2:
              for (y = 0; y < width; y++) {
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                  }
      
                  if (!r3x && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 3:
              for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y === 3) {
                  r3y = 0;
                }
      
                for (r3x = r3y, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                  }
      
                  if (!r3x && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 4:
              for (y = 0; y < width; y++) {
                for (r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                    r3y = !r3y;
                  }
      
                  if (!r3y && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 5:
              for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y === 3) {
                  r3y = 0;
                }
      
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                  }
      
                  if (!((x & y & 1) + !(!r3x | !r3y)) && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 6:
              for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y === 3) {
                  r3y = 0;
                }
      
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                  }
      
                  if (!((x & y & 1) + (r3x && r3x === r3y) & 1) && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            case 7:
              for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y === 3) {
                  r3y = 0;
                }
      
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                  if (r3x === 3) {
                    r3x = 0;
                  }
      
                  if (!((r3x && r3x === r3y) + (x + y & 1) & 1) && !this._isMasked(x, y)) {
                    buffer[x + (y * width)] ^= 1;
                  }
                }
              }
      
              break;
            }
          },
      
          _calculateMaxLength: function() {
            return (this._dataBlock * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
          },
      
          _calculatePolynomial: function() {
            var i, j;
            var eccBlock = this._eccBlock;
            var polynomial = this._polynomial;
      
            polynomial[0] = 1;
      
            for (i = 0; i < eccBlock; i++) {
              polynomial[i + 1] = 1;
      
              for (j = i; j > 0; j--) {
                polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
                  Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[j]] + i)] : polynomial[j - 1];
              }
      
              polynomial[0] = Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[0]] + i)];
            }
      
            // Use logs for generator polynomial to save calculation step.
            for (i = 0; i <= eccBlock; i++) {
              polynomial[i] = Galois_1.LOG[polynomial[i]];
            }
          },
      
          _checkBadness: function() {
            var b, b1, h, x, y;
            var bad = 0;
            var badness = this._badness;
            var buffer = this.buffer;
            var width = this.width;
      
            // Blocks of same colour.
            for (y = 0; y < width - 1; y++) {
              for (x = 0; x < width - 1; x++) {
                // All foreground colour.
                if ((buffer[x + (width * y)] &&
                  buffer[x + 1 + (width * y)] &&
                  buffer[x + (width * (y + 1))] &&
                  buffer[x + 1 + (width * (y + 1))]) ||
                  // All background colour.
                  !(buffer[x + (width * y)] ||
                  buffer[x + 1 + (width * y)] ||
                  buffer[x + (width * (y + 1))] ||
                  buffer[x + 1 + (width * (y + 1))])) {
                  bad += Frame.N2;
                }
              }
            }
      
            var bw = 0;
      
            // X runs.
            for (y = 0; y < width; y++) {
              h = 0;
      
              badness[0] = 0;
      
              for (b = 0, x = 0; x < width; x++) {
                b1 = buffer[x + (width * y)];
      
                if (b === b1) {
                  badness[h]++;
                } else {
                  badness[++h] = 1;
                }
      
                b = b1;
                bw += b ? 1 : -1;
              }
      
              bad += this._getBadness(h);
            }
      
            if (bw < 0) {
              bw = -bw;
            }
      
            var count = 0;
            var big = bw;
            big += big << 2;
            big <<= 1;
      
            while (big > width * width) {
              big -= width * width;
              count++;
            }
      
            bad += count * Frame.N4;
      
            // Y runs.
            for (x = 0; x < width; x++) {
              h = 0;
      
              badness[0] = 0;
      
              for (b = 0, y = 0; y < width; y++) {
                b1 = buffer[x + (width * y)];
      
                if (b === b1) {
                  badness[h]++;
                } else {
                  badness[++h] = 1;
                }
      
                b = b1;
              }
      
              bad += this._getBadness(h);
            }
      
            return bad;
          },
      
          _convertBitStream: function(length) {
            var bit, i;
            var ecc = this._ecc;
            var version = this._version;
      
            // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
            for (i = 0; i < length; i++) {
              ecc[i] = this._value.charCodeAt(i);
            }
      
            var stringBuffer = this._stringBuffer = ecc.slice();
            var maxLength = this._calculateMaxLength();
      
            if (length >= maxLength - 2) {
              length = maxLength - 2;
      
              if (version > 9) {
                length--;
              }
            }
      
            // Shift and re-pack to insert length prefix.
            var index = length;
      
            if (version > 9) {
              stringBuffer[index + 2] = 0;
              stringBuffer[index + 3] = 0;
      
              while (index--) {
                bit = stringBuffer[index];
      
                stringBuffer[index + 3] |= 255 & (bit << 4);
                stringBuffer[index + 2] = bit >> 4;
              }
      
              stringBuffer[2] |= 255 & (length << 4);
              stringBuffer[1] = length >> 4;
              stringBuffer[0] = 0x40 | (length >> 12);
            } else {
              stringBuffer[index + 1] = 0;
              stringBuffer[index + 2] = 0;
      
              while (index--) {
                bit = stringBuffer[index];
      
                stringBuffer[index + 2] |= 255 & (bit << 4);
                stringBuffer[index + 1] = bit >> 4;
              }
      
              stringBuffer[1] |= 255 & (length << 4);
              stringBuffer[0] = 0x40 | (length >> 4);
            }
      
            // Fill to end with pad pattern.
            index = length + 3 - (version < 10);
      
            while (index < maxLength) {
              stringBuffer[index++] = 0xec;
              stringBuffer[index++] = 0x11;
            }
          },
      
          _getBadness: function(length) {
            var i;
            var badRuns = 0;
            var badness = this._badness;
      
            for (i = 0; i <= length; i++) {
              if (badness[i] >= 5) {
                badRuns += Frame.N1 + badness[i] - 5;
              }
            }
      
            // FBFFFBF as in finder.
            for (i = 3; i < length - 1; i += 2) {
              if (badness[i - 2] === badness[i + 2] &&
                badness[i + 2] === badness[i - 1] &&
                badness[i - 1] === badness[i + 1] &&
                badness[i - 1] * 3 === badness[i] &&
                // Background around the foreground pattern? Not part of the specs.
                (badness[i - 3] === 0 || i + 3 > length ||
                badness[i - 3] * 3 >= badness[i] * 4 ||
                badness[i + 3] * 3 >= badness[i] * 4)) {
                badRuns += Frame.N3;
              }
            }
      
            return badRuns;
          },
      
          _finish: function() {
            // Save pre-mask copy of frame.
            this._stringBuffer = this.buffer.slice();
      
            var currentMask, i;
            var bit = 0;
            var mask = 30000;
      
            /*
             * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
             * a better one since they get more complex and take longer.
             */
            for (i = 0; i < 8; i++) {
              // Returns foreground-background imbalance.
              this._applyMask(i);
      
              currentMask = this._checkBadness();
      
              // Is current mask better than previous best?
              if (currentMask < mask) {
                mask = currentMask;
                bit = i;
              }
      
              // Don't increment "i" to a void redoing mask.
              if (bit === 7) {
                break;
              }
      
              // Reset for next pass.
              this.buffer = this._stringBuffer.slice();
            }
      
            // Redo best mask as none were "good enough" (i.e. last wasn't bit).
            if (bit !== i) {
              this._applyMask(bit);
            }
      
            // Add in final mask/ECC level bytes.
            mask = ErrorCorrection_1.FINAL_FORMAT[bit + (this._level - 1 << 3)];
      
            var buffer = this.buffer;
            var width = this.width;
      
            // Low byte.
            for (i = 0; i < 8; i++, mask >>= 1) {
              if (mask & 1) {
                buffer[width - 1 - i + (width * 8)] = 1;
      
                if (i < 6) {
                  buffer[8 + (width * i)] = 1;
                } else {
                  buffer[8 + (width * (i + 1))] = 1;
                }
              }
            }
      
            // High byte.
            for (i = 0; i < 7; i++, mask >>= 1) {
              if (mask & 1) {
                buffer[8 + (width * (width - 7 + i))] = 1;
      
                if (i) {
                  buffer[6 - i + (width * 8)] = 1;
                } else {
                  buffer[7 + (width * 8)] = 1;
                }
              }
            }
          },
      
          _interleaveBlocks: function() {
            var i, j;
            var dataBlock = this._dataBlock;
            var ecc = this._ecc;
            var eccBlock = this._eccBlock;
            var k = 0;
            var maxLength = this._calculateMaxLength();
            var neccBlock1 = this._neccBlock1;
            var neccBlock2 = this._neccBlock2;
            var stringBuffer = this._stringBuffer;
      
            for (i = 0; i < dataBlock; i++) {
              for (j = 0; j < neccBlock1; j++) {
                ecc[k++] = stringBuffer[i + (j * dataBlock)];
              }
      
              for (j = 0; j < neccBlock2; j++) {
                ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
              }
            }
      
            for (j = 0; j < neccBlock2; j++) {
              ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
            }
      
            for (i = 0; i < eccBlock; i++) {
              for (j = 0; j < neccBlock1 + neccBlock2; j++) {
                ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
              }
            }
      
            this._stringBuffer = ecc;
          },
      
          _insertAlignments: function() {
            var i, x, y;
            var version = this._version;
            var width = this.width;
      
            if (version > 1) {
              i = Alignment_1.BLOCK[version];
              y = width - 7;
      
              for (;;) {
                x = width - 7;
      
                while (x > i - 3) {
                  this._addAlignment(x, y);
      
                  if (x < i) {
                    break;
                  }
      
                  x -= i;
                }
      
                if (y <= i + 9) {
                  break;
                }
      
                y -= i;
      
                this._addAlignment(6, y);
                this._addAlignment(y, 6);
              }
            }
          },
      
          _insertFinders: function() {
            var i, j, x, y;
            var buffer = this.buffer;
            var width = this.width;
      
            for (i = 0; i < 3; i++) {
              j = 0;
              y = 0;
      
              if (i === 1) {
                j = width - 7;
              }
              if (i === 2) {
                y = width - 7;
              }
      
              buffer[y + 3 + (width * (j + 3))] = 1;
      
              for (x = 0; x < 6; x++) {
                buffer[y + x + (width * j)] = 1;
                buffer[y + (width * (j + x + 1))] = 1;
                buffer[y + 6 + (width * (j + x))] = 1;
                buffer[y + x + 1 + (width * (j + 6))] = 1;
              }
      
              for (x = 1; x < 5; x++) {
                this._setMask(y + x, j + 1);
                this._setMask(y + 1, j + x + 1);
                this._setMask(y + 5, j + x);
                this._setMask(y + x + 1, j + 5);
              }
      
              for (x = 2; x < 4; x++) {
                buffer[y + x + (width * (j + 2))] = 1;
                buffer[y + 2 + (width * (j + x + 1))] = 1;
                buffer[y + 4 + (width * (j + x))] = 1;
                buffer[y + x + 1 + (width * (j + 4))] = 1;
              }
            }
          },
      
          _insertTimingGap: function() {
            var x, y;
            var width = this.width;
      
            for (y = 0; y < 7; y++) {
              this._setMask(7, y);
              this._setMask(width - 8, y);
              this._setMask(7, y + width - 7);
            }
      
            for (x = 0; x < 8; x++) {
              this._setMask(x, 7);
              this._setMask(x + width - 8, 7);
              this._setMask(x, width - 8);
            }
          },
      
          _insertTimingRowAndColumn: function() {
            var x;
            var buffer = this.buffer;
            var width = this.width;
      
            for (x = 0; x < width - 14; x++) {
              if (x & 1) {
                this._setMask(8 + x, 6);
                this._setMask(6, 8 + x);
              } else {
                buffer[8 + x + (width * 6)] = 1;
                buffer[6 + (width * (8 + x))] = 1;
              }
            }
          },
      
          _insertVersion: function() {
            var i, j, x, y;
            var buffer = this.buffer;
            var version = this._version;
            var width = this.width;
      
            if (version > 6) {
              i = Version_1.BLOCK[version - 7];
              j = 17;
      
              for (x = 0; x < 6; x++) {
                for (y = 0; y < 3; y++, j--) {
                  if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
                    buffer[5 - x + (width * (2 - y + width - 11))] = 1;
                    buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
                  } else {
                    this._setMask(5 - x, 2 - y + width - 11);
                    this._setMask(2 - y + width - 11, 5 - x);
                  }
                }
              }
            }
          },
      
          _isMasked: function(x, y) {
            var bit = Frame._getMaskBit(x, y);
      
            return this._mask[bit] === 1;
          },
      
          _pack: function() {
            var bit, i, j;
            var k = 1;
            var v = 1;
            var width = this.width;
            var x = width - 1;
            var y = width - 1;
      
            // Interleaved data and ECC codes.
            var length = ((this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
      
            for (i = 0; i < length; i++) {
              bit = this._stringBuffer[i];
      
              for (j = 0; j < 8; j++, bit <<= 1) {
                if (0x80 & bit) {
                  this.buffer[x + (width * y)] = 1;
                }
      
                // Find next fill position.
                do {
                  if (v) {
                    x--;
                  } else {
                    x++;
      
                    if (k) {
                      if (y !== 0) {
                        y--;
                      } else {
                        x -= 2;
                        k = !k;
      
                        if (x === 6) {
                          x--;
                          y = 9;
                        }
                      }
                    } else if (y !== width - 1) {
                      y++;
                    } else {
                      x -= 2;
                      k = !k;
      
                      if (x === 6) {
                        x--;
                        y -= 8;
                      }
                    }
                  }
      
                  v = !v;
                } while (this._isMasked(x, y));
              }
            }
          },
      
          _reverseMask: function() {
            var x, y;
            var width = this.width;
      
            for (x = 0; x < 9; x++) {
              this._setMask(x, 8);
            }
      
            for (x = 0; x < 8; x++) {
              this._setMask(x + width - 8, 8);
              this._setMask(8, x);
            }
      
            for (y = 0; y < 7; y++) {
              this._setMask(8, y + width - 7);
            }
          },
      
          _setMask: function(x, y) {
            var bit = Frame._getMaskBit(x, y);
      
            this._mask[bit] = 1;
          },
      
          _syncMask: function() {
            var x, y;
            var width = this.width;
      
            for (y = 0; y < width; y++) {
              for (x = 0; x <= y; x++) {
                if (this.buffer[x + (width * y)]) {
                  this._setMask(x, y);
                }
              }
            }
          }
      
        }, {
      
          _createArray: function(length) {
            var i;
            var array = [];
      
            for (i = 0; i < length; i++) {
              array[i] = 0;
            }
      
            return array;
          },
      
          _getMaskBit: function(x, y) {
            var bit;
      
            if (x > y) {
              bit = x;
              x = y;
              y = bit;
            }
      
            bit = y;
            bit += y * y;
            bit >>= 1;
            bit += x;
      
            return bit;
          },
      
          _modN: function(x) {
            while (x >= 255) {
              x -= 255;
              x = (x >> 8) + (x & 255);
            }
      
            return x;
          },
      
          // *Badness* coefficients.
          N1: 3,
          N2: 3,
          N3: 40,
          N4: 10
      
        });
      
        var Frame_1 = Frame;
      
        /**
         * The options used by {@link Frame}.
         *
         * @typedef {Object} Frame~Options
         * @property {string} level - The ECC level to be used.
         * @property {string} value - The value to be encoded.
         */
      
        /**
         * An implementation of {@link Renderer} for working with <code>img</code> elements.
         *
         * This depends on {@link CanvasRenderer} being executed first as this implementation simply applies the data URL from
         * the rendered <code>canvas</code> element as the <code>src</code> for the <code>img</code> element being rendered.
         *
         * @public
         * @class
         * @extends Renderer
         */
        var ImageRenderer = Renderer_1.extend({
      
          /**
           * @override
           */
          draw: function() {
            this.element.src = this.qrious.toDataURL();
          },
      
          /**
           * @override
           */
          reset: function() {
            this.element.src = '';
          },
      
          /**
           * @override
           */
          resize: function() {
            var element = this.element;
      
            element.width = element.height = this.qrious.size;
          }
      
        });
      
        var ImageRenderer_1 = ImageRenderer;
      
        /**
         * Defines an available option while also configuring how values are applied to the target object.
         *
         * Optionally, a default value can be specified as well a value transformer for greater control over how the option
         * value is applied.
         *
         * If no value transformer is specified, then any specified option will be applied directly. All values are maintained
         * on the target object itself as a field using the option name prefixed with a single underscore.
         *
         * When an option is specified as modifiable, the {@link OptionManager} will be required to include a setter for the
         * property that is defined on the target object that uses the option name.
         *
         * @param {string} name - the name to be used
         * @param {boolean} [modifiable] - <code>true</code> if the property defined on target objects should include a setter;
         * otherwise <code>false</code>
         * @param {*} [defaultValue] - the default value to be used
         * @param {Option~ValueTransformer} [valueTransformer] - the value transformer to be used
         * @public
         * @class
         * @extends Nevis
         */
        var Option = lite.extend(function(name, modifiable, defaultValue, valueTransformer) {
          /**
           * The name for this {@link Option}.
           *
           * @public
           * @type {string}
           * @memberof Option#
           */
          this.name = name;
      
          /**
           * Whether a setter should be included on the property defined on target objects for this {@link Option}.
           *
           * @public
           * @type {boolean}
           * @memberof Option#
           */
          this.modifiable = Boolean(modifiable);
      
          /**
           * The default value for this {@link Option}.
           *
           * @public
           * @type {*}
           * @memberof Option#
           */
          this.defaultValue = defaultValue;
      
          this._valueTransformer = valueTransformer;
        }, {
      
          /**
           * Transforms the specified <code>value</code> so that it can be applied for this {@link Option}.
           *
           * If a value transformer has been specified for this {@link Option}, it will be called upon to transform
           * <code>value</code>. Otherwise, <code>value</code> will be returned directly.
           *
           * @param {*} value - the value to be transformed
           * @return {*} The transformed value or <code>value</code> if no value transformer is specified.
           * @public
           * @memberof Option#
           */
          transform: function(value) {
            var transformer = this._valueTransformer;
            if (typeof transformer === 'function') {
              return transformer(value, this);
            }
      
            return value;
          }
      
        });
      
        var Option_1 = Option;
      
        /**
         * Returns a transformed value for the specified <code>value</code> to be applied for the <code>option</code> provided.
         *
         * @callback Option~ValueTransformer
         * @param {*} value - the value to be transformed
         * @param {Option} option - the {@link Option} for which <code>value</code> is being transformed
         * @return {*} The transform value.
         */
      
        /**
         * Contains utility methods that are useful throughout the library.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var Utilities = lite.extend(null, {
      
          /**
           * Returns the absolute value of a given number.
           *
           * This method is simply a convenient shorthand for <code>Math.abs</code> while ensuring that nulls are returned as
           * <code>null</code> instead of zero.
           *
           * @param {number} value - the number whose absolute value is to be returned
           * @return {number} The absolute value of <code>value</code> or <code>null</code> if <code>value</code> is
           * <code>null</code>.
           * @public
           * @static
           * @memberof Utilities
           */
          abs: function(value) {
            return value != null ? Math.abs(value) : null;
          },
      
          /**
           * Returns whether the specified <code>object</code> has a property with the specified <code>name</code> as an own
           * (not inherited) property.
           *
           * @param {Object} object - the object on which the property is to be checked
           * @param {string} name - the name of the property to be checked
           * @return {boolean} <code>true</code> if <code>object</code> has an own property with <code>name</code>.
           * @public
           * @static
           * @memberof Utilities
           */
          hasOwn: function(object, name) {
            return Object.prototype.hasOwnProperty.call(object, name);
          },
      
          /**
           * A non-operation method that does absolutely nothing.
           *
           * @return {void}
           * @public
           * @static
           * @memberof Utilities
           */
          noop: function() {},
      
          /**
           * Transforms the specified <code>string</code> to upper case while remaining null-safe.
           *
           * @param {string} string - the string to be transformed to upper case
           * @return {string} <code>string</code> transformed to upper case if <code>string</code> is not <code>null</code>.
           * @public
           * @static
           * @memberof Utilities
           */
          toUpperCase: function(string) {
            return string != null ? string.toUpperCase() : null;
          }
      
        });
      
        var Utilities_1 = Utilities;
      
        /**
         * Manages multiple {@link Option} instances that are intended to be used by multiple implementations.
         *
         * Although the option definitions are shared between targets, the values are maintained on the targets themselves.
         *
         * @param {Option[]} options - the options to be used
         * @public
         * @class
         * @extends Nevis
         */
        var OptionManager = lite.extend(function(options) {
          /**
           * The available options for this {@link OptionManager}.
           *
           * @public
           * @type {Object.<string, Option>}
           * @memberof OptionManager#
           */
          this.options = {};
      
          options.forEach(function(option) {
            this.options[option.name] = option;
          }, this);
        }, {
      
          /**
           * Returns whether an option with the specified <code>name</code> is available.
           *
           * @param {string} name - the name of the {@link Option} whose existence is to be checked
           * @return {boolean} <code>true</code> if an {@link Option} exists with <code>name</code>; otherwise
           * <code>false</code>.
           * @public
           * @memberof OptionManager#
           */
          exists: function(name) {
            return this.options[name] != null;
          },
      
          /**
           * Returns the value of the option with the specified <code>name</code> on the <code>target</code> object provided.
           *
           * @param {string} name - the name of the {@link Option} whose value on <code>target</code> is to be returned
           * @param {Object} target - the object from which the value of the named {@link Option} is to be returned
           * @return {*} The value of the {@link Option} with <code>name</code> on <code>target</code>.
           * @public
           * @memberof OptionManager#
           */
          get: function(name, target) {
            return OptionManager._get(this.options[name], target);
          },
      
          /**
           * Returns a copy of all of the available options on the <code>target</code> object provided.
           *
           * @param {Object} target - the object from which the option name/value pairs are to be returned
           * @return {Object.<string, *>} A hash containing the name/value pairs of all options on <code>target</code>.
           * @public
           * @memberof OptionManager#
           */
          getAll: function(target) {
            var name;
            var options = this.options;
            var result = {};
      
            for (name in options) {
              if (Utilities_1.hasOwn(options, name)) {
                result[name] = OptionManager._get(options[name], target);
              }
            }
      
            return result;
          },
      
          /**
           * Initializes the available options for the <code>target</code> object provided and then applies the initial values
           * within the speciifed <code>options</code>.
           *
           * This method will throw an error if any of the names within <code>options</code> does not match an available option.
           *
           * This involves setting the default values and defining properties for all of the available options on
           * <code>target</code> before finally calling {@link OptionMananger#setAll} with <code>options</code> and
           * <code>target</code>. Any options that are configured to be modifiable will have a setter included in their defined
           * property that will allow its corresponding value to be modified.
           *
           * If a change handler is specified, it will be called whenever the value changes on <code>target</code> for a
           * modifiable option, but only when done so via the defined property's setter.
           *
           * @param {Object.<string, *>} options - the name/value pairs of the initial options to be set
           * @param {Object} target - the object on which the options are to be initialized
           * @param {Function} [changeHandler] - the function to be called whenever the value of an modifiable option changes on
           * <code>target</code>
           * @return {void}
           * @throws {Error} If <code>options</code> contains an invalid option name.
           * @public
           * @memberof OptionManager#
           */
          init: function(options, target, changeHandler) {
            if (typeof changeHandler !== 'function') {
              changeHandler = Utilities_1.noop;
            }
      
            var name, option;
      
            for (name in this.options) {
              if (Utilities_1.hasOwn(this.options, name)) {
                option = this.options[name];
      
                OptionManager._set(option, option.defaultValue, target);
                OptionManager._createAccessor(option, target, changeHandler);
              }
            }
      
            this._setAll(options, target, true);
          },
      
          /**
           * Sets the value of the option with the specified <code>name</code> on the <code>target</code> object provided to
           * <code>value</code>.
           *
           * This method will throw an error if <code>name</code> does not match an available option or matches an option that
           * cannot be modified.
           *
           * If <code>value</code> is <code>null</code> and the {@link Option} has a default value configured, then that default
           * value will be used instead. If the {@link Option} also has a value transformer configured, it will be used to
           * transform whichever value was determined to be used.
           *
           * This method returns whether the value of the underlying field on <code>target</code> was changed as a result.
           *
           * @param {string} name - the name of the {@link Option} whose value is to be set
           * @param {*} value - the value to be set for the named {@link Option} on <code>target</code>
           * @param {Object} target - the object on which <code>value</code> is to be set for the named {@link Option}
           * @return {boolean} <code>true</code> if the underlying field on <code>target</code> was changed; otherwise
           * <code>false</code>.
           * @throws {Error} If <code>name</code> is invalid or is for an option that cannot be modified.
           * @public
           * @memberof OptionManager#
           */
          set: function(name, value, target) {
            return this._set(name, value, target);
          },
      
          /**
           * Sets all of the specified <code>options</code> on the <code>target</code> object provided to their corresponding
           * values.
           *
           * This method will throw an error if any of the names within <code>options</code> does not match an available option
           * or matches an option that cannot be modified.
           *
           * If any value within <code>options</code> is <code>null</code> and the corresponding {@link Option} has a default
           * value configured, then that default value will be used instead. If an {@link Option} also has a value transformer
           * configured, it will be used to transform whichever value was determined to be used.
           *
           * This method returns whether the value for any of the underlying fields on <code>target</code> were changed as a
           * result.
           *
           * @param {Object.<string, *>} options - the name/value pairs of options to be set
           * @param {Object} target - the object on which the options are to be set
           * @return {boolean} <code>true</code> if any of the underlying fields on <code>target</code> were changed; otherwise
           * <code>false</code>.
           * @throws {Error} If <code>options</code> contains an invalid option name or an option that cannot be modiifed.
           * @public
           * @memberof OptionManager#
           */
          setAll: function(options, target) {
            return this._setAll(options, target);
          },
      
          _set: function(name, value, target, allowUnmodifiable) {
            var option = this.options[name];
            if (!option) {
              throw new Error('Invalid option: ' + name);
            }
            if (!option.modifiable && !allowUnmodifiable) {
              throw new Error('Option cannot be modified: ' + name);
            }
      
            return OptionManager._set(option, value, target);
          },
      
          _setAll: function(options, target, allowUnmodifiable) {
            if (!options) {
              return false;
            }
      
            var name;
            var changed = false;
      
            for (name in options) {
              if (Utilities_1.hasOwn(options, name) && this._set(name, options[name], target, allowUnmodifiable)) {
                changed = true;
              }
            }
      
            return changed;
          }
      
        }, {
      
          _createAccessor: function(option, target, changeHandler) {
            var descriptor = {
              get: function() {
                return OptionManager._get(option, target);
              }
            };
      
            if (option.modifiable) {
              descriptor.set = function(value) {
                if (OptionManager._set(option, value, target)) {
                  changeHandler(value, option);
                }
              };
            }
      
            Object.defineProperty(target, option.name, descriptor);
          },
      
          _get: function(option, target) {
            return target['_' + option.name];
          },
      
          _set: function(option, value, target) {
            var fieldName = '_' + option.name;
            var oldValue = target[fieldName];
            var newValue = option.transform(value != null ? value : option.defaultValue);
      
            target[fieldName] = newValue;
      
            return newValue !== oldValue;
          }
      
        });
      
        var OptionManager_1 = OptionManager;
      
        /**
         * Called whenever the value of a modifiable {@link Option} is changed on a target object via the defined property's
         * setter.
         *
         * @callback OptionManager~ChangeHandler
         * @param {*} value - the new value for <code>option</code> on the target object
         * @param {Option} option - the modifable {@link Option} whose value has changed on the target object.
         * @return {void}
         */
      
        /**
         * A basic manager for {@link Service} implementations that are mapped to simple names.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var ServiceManager = lite.extend(function() {
          this._services = {};
        }, {
      
          /**
           * Returns the {@link Service} being managed with the specified <code>name</code>.
           *
           * @param {string} name - the name of the {@link Service} to be returned
           * @return {Service} The {@link Service} is being managed with <code>name</code>.
           * @throws {Error} If no {@link Service} is being managed with <code>name</code>.
           * @public
           * @memberof ServiceManager#
           */
          getService: function(name) {
            var service = this._services[name];
            if (!service) {
              throw new Error('Service is not being managed with name: ' + name);
            }
      
            return service;
          },
      
          /**
           * Sets the {@link Service} implementation to be managed for the specified <code>name</code> to the
           * <code>service</code> provided.
           *
           * @param {string} name - the name of the {@link Service} to be managed with <code>name</code>
           * @param {Service} service - the {@link Service} implementation to be managed
           * @return {void}
           * @throws {Error} If a {@link Service} is already being managed with the same <code>name</code>.
           * @public
           * @memberof ServiceManager#
           */
          setService: function(name, service) {
            if (this._services[name]) {
              throw new Error('Service is already managed with name: ' + name);
            }
      
            if (service) {
              this._services[name] = service;
            }
          }
      
        });
      
        var ServiceManager_1 = ServiceManager;
      
        var optionManager = new OptionManager_1([
          new Option_1('background', true, 'white'),
          new Option_1('backgroundAlpha', true, 1, Utilities_1.abs),
          new Option_1('element'),
          new Option_1('foreground', true, 'black'),
          new Option_1('foregroundAlpha', true, 1, Utilities_1.abs),
          new Option_1('level', true, 'L', Utilities_1.toUpperCase),
          new Option_1('mime', true, 'image/png'),
          new Option_1('padding', true, null, Utilities_1.abs),
          new Option_1('size', true, 100, Utilities_1.abs),
          new Option_1('value', true, '')
        ]);
        var serviceManager = new ServiceManager_1();
      
        /**
         * Enables configuration of a QR code generator which uses HTML5 <code>canvas</code> for rendering.
         *
         * @param {QRious~Options} [options] - the options to be used
         * @throws {Error} If any <code>options</code> are invalid.
         * @public
         * @class
         * @extends Nevis
         */
        var QRious = lite.extend(function(options) {
          optionManager.init(options, this, this.update.bind(this));
      
          var element = optionManager.get('element', this);
          var elementService = serviceManager.getService('element');
          var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
          var image = element && elementService.isImage(element) ? element : elementService.createImage();
      
          this._canvasRenderer = new CanvasRenderer_1(this, canvas, true);
          this._imageRenderer = new ImageRenderer_1(this, image, image === element);
      
          this.update();
        }, {
      
          /**
           * Returns all of the options configured for this {@link QRious}.
           *
           * Any changes made to the returned object will not be reflected in the options themselves or their corresponding
           * underlying fields.
           *
           * @return {Object.<string, *>} A copy of the applied options.
           * @public
           * @memberof QRious#
           */
          get: function() {
            return optionManager.getAll(this);
          },
      
          /**
           * Sets all of the specified <code>options</code> and automatically updates this {@link QRious} if any of the
           * underlying fields are changed as a result.
           *
           * This is the preferred method for updating multiple options at one time to avoid unnecessary updates between
           * changes.
           *
           * @param {QRious~Options} options - the options to be set
           * @return {void}
           * @throws {Error} If any <code>options</code> are invalid or cannot be modified.
           * @public
           * @memberof QRious#
           */
          set: function(options) {
            if (optionManager.setAll(options, this)) {
              this.update();
            }
          },
      
          /**
           * Returns the image data URI for the generated QR code using the <code>mime</code> provided.
           *
           * @param {string} [mime] - the MIME type for the image
           * @return {string} The image data URI for the QR code.
           * @public
           * @memberof QRious#
           */
          toDataURL: function(mime) {
            return this.canvas.toDataURL(mime || this.mime);
          },
      
          /**
           * Updates this {@link QRious} by generating a new {@link Frame} and re-rendering the QR code.
           *
           * @return {void}
           * @protected
           * @memberof QRious#
           */
          update: function() {
            var frame = new Frame_1({
              level: this.level,
              value: this.value
            });
      
            this._canvasRenderer.render(frame);
            this._imageRenderer.render(frame);
          }
      
        }, {
      
          /**
           * Configures the <code>service</code> provided to be used by all {@link QRious} instances.
           *
           * @param {Service} service - the {@link Service} to be configured
           * @return {void}
           * @throws {Error} If a {@link Service} has already been configured with the same name.
           * @public
           * @static
           * @memberof QRious
           */
          use: function(service) {
            serviceManager.setService(service.getName(), service);
          }
      
        });
      
        Object.defineProperties(QRious.prototype, {
      
          canvas: {
            /**
             * Returns the <code>canvas</code> element being used to render the QR code for this {@link QRious}.
             *
             * @return {*} The <code>canvas</code> element.
             * @public
             * @memberof QRious#
             * @alias canvas
             */
            get: function() {
              return this._canvasRenderer.getElement();
            }
          },
      
          image: {
            /**
             * Returns the <code>img</code> element being used to render the QR code for this {@link QRious}.
             *
             * @return {*} The <code>img</code> element.
             * @public
             * @memberof QRious#
             * @alias image
             */
            get: function() {
              return this._imageRenderer.getElement();
            }
          }
      
        });
      
        var QRious_1$2 = QRious;
      
        /**
         * The options used by {@link QRious}.
         *
         * @typedef {Object} QRious~Options
         * @property {string} [background="white"] - The background color to be applied to the QR code.
         * @property {number} [backgroundAlpha=1] - The background alpha to be applied to the QR code.
         * @property {*} [element] - The element to be used to render the QR code which may either be an <code>canvas</code> or
         * <code>img</code>. The element(s) will be created if needed.
         * @property {string} [foreground="black"] - The foreground color to be applied to the QR code.
         * @property {number} [foregroundAlpha=1] - The foreground alpha to be applied to the QR code.
         * @property {string} [level="L"] - The error correction level to be applied to the QR code.
         * @property {string} [mime="image/png"] - The MIME type to be used to render the image for the QR code.
         * @property {number} [padding] - The padding for the QR code in pixels.
         * @property {number} [size=100] - The size of the QR code in pixels.
         * @property {string} [value=""] - The value to be encoded within the QR code.
         */
      
        var index = QRious_1$2;
      
        /**
         * Defines a service contract that must be met by all implementations.
         *
         * @public
         * @class
         * @extends Nevis
         */
        var Service = lite.extend({
      
          /**
           * Returns the name of this {@link Service}.
           *
           * @return {string} The service name.
           * @public
           * @abstract
           * @memberof Service#
           */
          getName: function() {}
      
        });
      
        var Service_1 = Service;
      
        /**
         * A service for working with elements.
         *
         * @public
         * @class
         * @extends Service
         */
        var ElementService = Service_1.extend({
      
          /**
           * Creates an instance of a canvas element.
           *
           * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
           *
           * @return {*} The newly created canvas element.
           * @public
           * @abstract
           * @memberof ElementService#
           */
          createCanvas: function() {},
      
          /**
           * Creates an instance of a image element.
           *
           * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
           *
           * @return {*} The newly created image element.
           * @public
           * @abstract
           * @memberof ElementService#
           */
          createImage: function() {},
      
          /**
           * @override
           */
          getName: function() {
            return 'element';
          },
      
          /**
           * Returns whether the specified <code>element</code> is a canvas.
           *
           * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
           *
           * @param {*} element - the element to be checked
           * @return {boolean} <code>true</code> if <code>element</code> is a canvas; otherwise <code>false</code>.
           * @public
           * @abstract
           * @memberof ElementService#
           */
          isCanvas: function(element) {},
      
          /**
           * Returns whether the specified <code>element</code> is an image.
           *
           * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
           *
           * @param {*} element - the element to be checked
           * @return {boolean} <code>true</code> if <code>element</code> is an image; otherwise <code>false</code>.
           * @public
           * @abstract
           * @memberof ElementService#
           */
          isImage: function(element) {}
      
        });
      
        var ElementService_1 = ElementService;
      
        /**
         * An implementation of {@link ElementService} intended for use within a browser environment.
         *
         * @public
         * @class
         * @extends ElementService
         */
        var BrowserElementService = ElementService_1.extend({
      
          /**
           * @override
           */
          createCanvas: function() {
            return document.createElement('canvas');
          },
      
          /**
           * @override
           */
          createImage: function() {
            return document.createElement('img');
          },
      
          /**
           * @override
           */
          isCanvas: function(element) {
            return element instanceof HTMLCanvasElement;
          },
      
          /**
           * @override
           */
          isImage: function(element) {
            return element instanceof HTMLImageElement;
          }
      
        });
      
        var BrowserElementService_1 = BrowserElementService;
      
        index.use(new BrowserElementService_1());
      
        var QRious_1 = index;
      
        return QRious_1;
      
      })));
    });

    /* node_modules\svelte-qrcode\src\lib\index.svelte generated by Svelte v3.44.2 */
    const file$3 = "node_modules\\svelte-qrcode\\src\\lib\\index.svelte";

    function create_fragment$3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*value*/ ctx[0]);
    			attr_dev(img, "class", /*className*/ ctx[1]);
    			add_location(img, file$3, 41, 0, 681);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image*/ 4 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*value*/ 1) {
    				attr_dev(img, "alt", /*value*/ ctx[0]);
    			}

    			if (dirty & /*className*/ 2) {
    				attr_dev(img, "class", /*className*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lib', slots, []);
    	const QRcode = new qrcode();
    	let { errorCorrection = "L" } = $$props;
    	let { background = "#fff" } = $$props;
    	let { color = "#000" } = $$props;
    	let { size = "200" } = $$props;
    	let { value = "" } = $$props;
    	let { padding = 0 } = $$props;
    	let { className = "qrcode" } = $$props;
    	let image = '';

    	function generateQrCode() {
    		QRcode.set({
    			background,
    			foreground: color,
    			level: errorCorrection,
    			padding,
    			size,
    			value
    		});

    		$$invalidate(2, image = QRcode.toDataURL('image/jpeg'));
    	}

    	onMount(() => {
    		generateQrCode();
    	});

    	const writable_props = [
    		'errorCorrection',
    		'background',
    		'color',
    		'size',
    		'value',
    		'padding',
    		'className'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lib> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('errorCorrection' in $$props) $$invalidate(3, errorCorrection = $$props.errorCorrection);
    		if ('background' in $$props) $$invalidate(4, background = $$props.background);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('size' in $$props) $$invalidate(6, size = $$props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('padding' in $$props) $$invalidate(7, padding = $$props.padding);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		QrCode: qrcode,
    		QRcode,
    		errorCorrection,
    		background,
    		color,
    		size,
    		value,
    		padding,
    		className,
    		image,
    		generateQrCode
    	});

    	$$self.$inject_state = $$props => {
    		if ('errorCorrection' in $$props) $$invalidate(3, errorCorrection = $$props.errorCorrection);
    		if ('background' in $$props) $$invalidate(4, background = $$props.background);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('size' in $$props) $$invalidate(6, size = $$props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('padding' in $$props) $$invalidate(7, padding = $$props.padding);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('image' in $$props) $$invalidate(2, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			{
    				if (value) {
    					generateQrCode();
    				}
    			}
    		}
    	};

    	return [value, className, image, errorCorrection, background, color, size, padding];
    }

    class Lib extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			errorCorrection: 3,
    			background: 4,
    			color: 5,
    			size: 6,
    			value: 0,
    			padding: 7,
    			className: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lib",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get errorCorrection() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorCorrection(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\structure\MyReservations.svelte generated by Svelte v3.44.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\structure\\MyReservations.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].brand;
    	child_ctx[15] = list[i].model;
    	child_ctx[16] = list[i].year;
    	child_ctx[17] = list[i].price;
    	child_ctx[18] = list[i].startDay;
    	child_ctx[19] = list[i].endDay;
    	child_ctx[20] = list[i].status;
    	child_ctx[21] = list[i].username;
    	child_ctx[22] = list[i].email;
    	child_ctx[24] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].brand;
    	child_ctx[15] = list[i].model;
    	child_ctx[16] = list[i].year;
    	child_ctx[17] = list[i].price;
    	child_ctx[18] = list[i].startDay;
    	child_ctx[19] = list[i].endDay;
    	child_ctx[20] = list[i].status;
    	child_ctx[21] = list[i].username;
    	child_ctx[22] = list[i].email;
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (113:4) {#if !hidden}
    function create_if_block_10(ctx) {
    	let div;
    	let qrcode;
    	let updating_value;
    	let current;

    	function qrcode_value_binding(value) {
    		/*qrcode_value_binding*/ ctx[11](value);
    	}

    	let qrcode_props = { size: "1000" };

    	if (/*qrCode*/ ctx[6] !== void 0) {
    		qrcode_props.value = /*qrCode*/ ctx[6];
    	}

    	qrcode = new Lib({ props: qrcode_props, $$inline: true });
    	binding_callbacks.push(() => bind(qrcode, 'value', qrcode_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(qrcode.$$.fragment);
    			attr_dev(div, "id", "qrCode");
    			attr_dev(div, "class", "svelte-1hogg76");
    			add_location(div, file$2, 113, 8, 3606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(qrcode, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const qrcode_changes = {};

    			if (!updating_value && dirty & /*qrCode*/ 64) {
    				updating_value = true;
    				qrcode_changes.value = /*qrCode*/ ctx[6];
    				add_flush_callback(() => updating_value = false);
    			}

    			qrcode.$set(qrcode_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qrcode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qrcode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(qrcode);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(113:4) {#if !hidden}",
    		ctx
    	});

    	return block;
    }

    // (163:32) {#if acType != "user"}
    function create_if_block_9(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			th.textContent = "Username - Email";
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th, file$2, 163, 36, 6266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(163:32) {#if acType != \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (200:28) {#if myReservations.length != 0}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*myReservations*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleReservation, myReservations, acType, showQRCode*/ 1541) {
    				each_value_1 = /*myReservations*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(200:28) {#if myReservations.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (225:40) {#if acType != "user"}
    function create_if_block_8$1(ctx) {
    	let th;
    	let t0_value = /*username*/ ctx[21] + "";
    	let t0;
    	let t1;
    	let t2_value = /*email*/ ctx[22] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = text(" - ");
    			t2 = text(t2_value);
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th, file$2, 225, 44, 9931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			append_dev(th, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*myReservations*/ 1 && t0_value !== (t0_value = /*username*/ ctx[21] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*myReservations*/ 1 && t2_value !== (t2_value = /*email*/ ctx[22] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(225:40) {#if acType != \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (240:40) {#if status != "canceled"}
    function create_if_block_2$1(ctx) {
    	let td;
    	let t0;
    	let t1;
    	let if_block0 = /*acType*/ ctx[2] != "user" && create_if_block_5$1(ctx);
    	let if_block1 = /*status*/ ctx[20] == "confirmed" && create_if_block_4$1(ctx);
    	let if_block2 = /*acType*/ ctx[2] == "user" && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(td, "class", "px-6 py-4 text-gray-500");
    			add_location(td, file$2, 240, 44, 10889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block0) if_block0.m(td, null);
    			append_dev(td, t0);
    			if (if_block1) if_block1.m(td, null);
    			append_dev(td, t1);
    			if (if_block2) if_block2.m(td, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*acType*/ ctx[2] != "user") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(td, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*status*/ ctx[20] == "confirmed") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					if_block1.m(td, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*acType*/ ctx[2] == "user") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$1(ctx);
    					if_block2.c();
    					if_block2.m(td, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(240:40) {#if status != \\\"canceled\\\"}",
    		ctx
    	});

    	return block;
    }

    // (242:48) {#if acType != "user"}
    function create_if_block_5$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*status*/ ctx[20] != "confirmed" && create_if_block_7$1(ctx);
    	let if_block1 = /*status*/ ctx[20] != "unconfirmed" && create_if_block_6$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*status*/ ctx[20] != "confirmed") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*status*/ ctx[20] != "unconfirmed") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(242:48) {#if acType != \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (243:52) {#if status != "confirmed"}
    function create_if_block_7$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Accept Reservation";
    			attr_dev(button, "class", "text-gray-900");
    			add_location(button, file$2, 243, 56, 11136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "accept"))) /*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "accept").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(243:52) {#if status != \\\"confirmed\\\"}",
    		ctx
    	});

    	return block;
    }

    // (259:52) {#if status != "unconfirmed"}
    function create_if_block_6$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Refuse Reservation";
    			attr_dev(button, "class", "text-gray-900");
    			add_location(button, file$2, 259, 56, 12225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "refuse"))) /*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "refuse").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(259:52) {#if status != \\\"unconfirmed\\\"}",
    		ctx
    	});

    	return block;
    }

    // (275:48) {#if status == "confirmed"}
    function create_if_block_4$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "showQRCode";
    			add_location(button, file$2, 275, 52, 13357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*showQRCode*/ ctx[10](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19]))) /*showQRCode*/ ctx[10](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(275:48) {#if status == \\\"confirmed\\\"}",
    		ctx
    	});

    	return block;
    }

    // (286:48) {#if acType == "user"}
    function create_if_block_3$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Cancel Reservation";
    			attr_dev(button, "class", "text-gray-900");
    			add_location(button, file$2, 286, 52, 14100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "cancel"))) /*handleReservation*/ ctx[9](/*brand*/ ctx[14], /*model*/ ctx[15], /*year*/ ctx[16], /*startDay*/ ctx[18], /*endDay*/ ctx[19], "cancel").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(286:48) {#if acType == \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (201:32) {#each myReservations as { brand, model, year, price, startDay, endDay, status, username, email }
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let tdcell0;
    	let t1;
    	let tdcell1;
    	let t2;
    	let tdcell2;
    	let t3;
    	let tdcell3;
    	let t4;
    	let tdcell4;
    	let t5;
    	let t6;
    	let td1;
    	let div2;
    	let t7_value = /*status*/ ctx[20] + "";
    	let t7;
    	let t8;
    	let t9;
    	let current;

    	tdcell0 = new TdCell({
    			props: { name: /*brand*/ ctx[14] },
    			$$inline: true
    		});

    	tdcell1 = new TdCell({
    			props: { name: /*model*/ ctx[15] },
    			$$inline: true
    		});

    	tdcell2 = new TdCell({
    			props: { name: /*year*/ ctx[16] },
    			$$inline: true
    		});

    	tdcell3 = new TdCell({
    			props: { name: /*price*/ ctx[17] + "zł" },
    			$$inline: true
    		});

    	tdcell4 = new TdCell({
    			props: {
    				name: /*startDay*/ ctx[18] + " ---- " + /*endDay*/ ctx[19]
    			},
    			$$inline: true
    		});

    	let if_block0 = /*acType*/ ctx[2] != "user" && create_if_block_8$1(ctx);
    	let if_block1 = /*status*/ ctx[20] != "canceled" && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			create_component(tdcell0.$$.fragment);
    			t1 = space();
    			create_component(tdcell1.$$.fragment);
    			t2 = space();
    			create_component(tdcell2.$$.fragment);
    			t3 = space();
    			create_component(tdcell3.$$.fragment);
    			t4 = space();
    			create_component(tdcell4.$$.fragment);
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			td1 = element("td");
    			div2 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			attr_dev(img, "class", "h-20 w-50 rounded-full");
    			if (!src_url_equal(img.src, img_src_value = "img/" + /*brand*/ ctx[14] + "_" + /*model*/ ctx[15] + "_" + /*year*/ ctx[16] + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 207, 52, 8916);
    			attr_dev(div0, "class", "flex-shrink-0 h-20 w-20");
    			add_location(div0, file$2, 204, 48, 8722);
    			attr_dev(div1, "class", "flex items-center");
    			add_location(div1, file$2, 203, 44, 8641);
    			attr_dev(td0, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td0, file$2, 202, 40, 8555);
    			attr_dev(div2, "class", "text-sm text-gray-900");
    			add_location(div2, file$2, 235, 44, 10583);
    			attr_dev(td1, "class", "px-6 py-4 whitespace-nowrap text-sm text-gray-500");
    			add_location(td1, file$2, 232, 40, 10388);
    			add_location(tr, file$2, 201, 36, 8509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(tr, t0);
    			mount_component(tdcell0, tr, null);
    			append_dev(tr, t1);
    			mount_component(tdcell1, tr, null);
    			append_dev(tr, t2);
    			mount_component(tdcell2, tr, null);
    			append_dev(tr, t3);
    			mount_component(tdcell3, tr, null);
    			append_dev(tr, t4);
    			mount_component(tdcell4, tr, null);
    			append_dev(tr, t5);
    			if (if_block0) if_block0.m(tr, null);
    			append_dev(tr, t6);
    			append_dev(tr, td1);
    			append_dev(td1, div2);
    			append_dev(div2, t7);
    			append_dev(tr, t8);
    			if (if_block1) if_block1.m(tr, null);
    			append_dev(tr, t9);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*myReservations*/ 1 && !src_url_equal(img.src, img_src_value = "img/" + /*brand*/ ctx[14] + "_" + /*model*/ ctx[15] + "_" + /*year*/ ctx[16] + ".jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const tdcell0_changes = {};
    			if (dirty & /*myReservations*/ 1) tdcell0_changes.name = /*brand*/ ctx[14];
    			tdcell0.$set(tdcell0_changes);
    			const tdcell1_changes = {};
    			if (dirty & /*myReservations*/ 1) tdcell1_changes.name = /*model*/ ctx[15];
    			tdcell1.$set(tdcell1_changes);
    			const tdcell2_changes = {};
    			if (dirty & /*myReservations*/ 1) tdcell2_changes.name = /*year*/ ctx[16];
    			tdcell2.$set(tdcell2_changes);
    			const tdcell3_changes = {};
    			if (dirty & /*myReservations*/ 1) tdcell3_changes.name = /*price*/ ctx[17] + "zł";
    			tdcell3.$set(tdcell3_changes);
    			const tdcell4_changes = {};
    			if (dirty & /*myReservations*/ 1) tdcell4_changes.name = /*startDay*/ ctx[18] + " ---- " + /*endDay*/ ctx[19];
    			tdcell4.$set(tdcell4_changes);

    			if (/*acType*/ ctx[2] != "user") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8$1(ctx);
    					if_block0.c();
    					if_block0.m(tr, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*myReservations*/ 1) && t7_value !== (t7_value = /*status*/ ctx[20] + "")) set_data_dev(t7, t7_value);

    			if (/*status*/ ctx[20] != "canceled") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(tr, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tdcell0.$$.fragment, local);
    			transition_in(tdcell1.$$.fragment, local);
    			transition_in(tdcell2.$$.fragment, local);
    			transition_in(tdcell3.$$.fragment, local);
    			transition_in(tdcell4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tdcell0.$$.fragment, local);
    			transition_out(tdcell1.$$.fragment, local);
    			transition_out(tdcell2.$$.fragment, local);
    			transition_out(tdcell3.$$.fragment, local);
    			transition_out(tdcell4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(tdcell0);
    			destroy_component(tdcell1);
    			destroy_component(tdcell2);
    			destroy_component(tdcell3);
    			destroy_component(tdcell4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(201:32) {#each myReservations as { brand, model, year, price, startDay, endDay, status, username, email }",
    		ctx
    	});

    	return block;
    }

    // (308:24) {#if archives.length != 0}
    function create_if_block$1(ctx) {
    	let tbody;
    	let tr;
    	let td0;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3;
    	let td3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let td7;
    	let t8;
    	let th;
    	let t9;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*archives*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			tr = element("tr");
    			td0 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Archives";
    			t1 = space();
    			td1 = element("td");
    			t2 = space();
    			td2 = element("td");
    			t3 = space();
    			td3 = element("td");
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			td7 = element("td");
    			t8 = space();
    			th = element("th");
    			t9 = text("Sort option:\r\n                                        ");
    			select = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "By Brand";
    			option2 = element("option");
    			option2.textContent = "By Model";
    			option3 = element("option");
    			option3.textContent = "By Year";
    			option4 = element("option");
    			option4.textContent = "By Status";
    			t14 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$2, 315, 48, 15799);
    			attr_dev(div0, "class", "flex-shrink-0 h-20 w-20 hei svelte-1hogg76");
    			add_location(div0, file$2, 312, 44, 15613);
    			attr_dev(div1, "class", "flex items-center");
    			add_location(div1, file$2, 311, 40, 15536);
    			attr_dev(td0, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td0, file$2, 310, 36, 15454);
    			add_location(td1, file$2, 319, 36, 15997);
    			add_location(td2, file$2, 320, 36, 16041);
    			add_location(td3, file$2, 321, 36, 16085);
    			add_location(td4, file$2, 322, 36, 16129);
    			add_location(td5, file$2, 323, 36, 16173);
    			add_location(td6, file$2, 324, 36, 16217);
    			add_location(td7, file$2, 325, 36, 16261);
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.disabled = true;
    			add_location(option0, file$2, 335, 44, 16863);
    			option1.__value = "byBrand";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 336, 44, 16937);
    			option2.__value = "byModel";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 339, 44, 17120);
    			option3.__value = "byYear";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 342, 44, 17303);
    			option4.__value = "byStatus";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 345, 44, 17484);
    			if (/*sortByArchives*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[13].call(select));
    			add_location(select, file$2, 331, 40, 16624);
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th, file$2, 326, 36, 16305);
    			add_location(tr, file$2, 309, 32, 15412);
    			attr_dev(tbody, "class", "bg-white divide-y divide-gray-200");
    			add_location(tbody, file$2, 308, 28, 15329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr);
    			append_dev(tr, td0);
    			append_dev(td0, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(tr, t3);
    			append_dev(tr, td3);
    			append_dev(tr, t4);
    			append_dev(tr, td4);
    			append_dev(tr, t5);
    			append_dev(tr, td5);
    			append_dev(tr, t6);
    			append_dev(tr, td6);
    			append_dev(tr, t7);
    			append_dev(tr, td7);
    			append_dev(tr, t8);
    			append_dev(tr, th);
    			append_dev(th, t9);
    			append_dev(th, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			select_option(select, /*sortByArchives*/ ctx[4]);
    			append_dev(tbody, t14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[13]),
    					listen_dev(select, "change", /*sortArchives*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sortByArchives*/ 16) {
    				select_option(select, /*sortByArchives*/ ctx[4]);
    			}

    			if (dirty & /*archives*/ 2) {
    				each_value = /*archives*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(308:24) {#if archives.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (352:32) {#each archives as { brand, model, year, price, startDay, endDay, status, username, email }
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let tdcell0;
    	let t1;
    	let tdcell1;
    	let t2;
    	let tdcell2;
    	let t3;
    	let tdcell3;
    	let t4;
    	let tdcell4;
    	let t5;
    	let th;
    	let t6_value = /*username*/ ctx[21] + "";
    	let t6;
    	let t7;
    	let t8_value = /*email*/ ctx[22] + "";
    	let t8;
    	let t9;
    	let td1;
    	let div2;
    	let t10_value = /*status*/ ctx[20] + "";
    	let t10;
    	let t11;
    	let current;

    	tdcell0 = new TdCell({
    			props: { name: /*brand*/ ctx[14] },
    			$$inline: true
    		});

    	tdcell1 = new TdCell({
    			props: { name: /*model*/ ctx[15] },
    			$$inline: true
    		});

    	tdcell2 = new TdCell({
    			props: { name: /*year*/ ctx[16] },
    			$$inline: true
    		});

    	tdcell3 = new TdCell({
    			props: { name: /*price*/ ctx[17] + "zł" },
    			$$inline: true
    		});

    	tdcell4 = new TdCell({
    			props: {
    				name: /*startDay*/ ctx[18] + " ---- " + /*endDay*/ ctx[19]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			create_component(tdcell0.$$.fragment);
    			t1 = space();
    			create_component(tdcell1.$$.fragment);
    			t2 = space();
    			create_component(tdcell2.$$.fragment);
    			t3 = space();
    			create_component(tdcell3.$$.fragment);
    			t4 = space();
    			create_component(tdcell4.$$.fragment);
    			t5 = space();
    			th = element("th");
    			t6 = text(t6_value);
    			t7 = text(" - ");
    			t8 = text(t8_value);
    			t9 = space();
    			td1 = element("td");
    			div2 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			attr_dev(img, "class", "h-20 w-50 rounded-full");
    			if (!src_url_equal(img.src, img_src_value = "img/" + /*brand*/ ctx[14] + "_" + /*model*/ ctx[15] + "_" + /*year*/ ctx[16] + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 358, 52, 18330);
    			attr_dev(div0, "class", "flex-shrink-0 h-20 w-20");
    			add_location(div0, file$2, 355, 48, 18136);
    			attr_dev(div1, "class", "flex items-center");
    			add_location(div1, file$2, 354, 44, 18055);
    			attr_dev(td0, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td0, file$2, 353, 40, 17969);
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th, file$2, 374, 40, 19275);
    			attr_dev(div2, "class", "text-sm text-gray-900");
    			add_location(div2, file$2, 383, 44, 19860);
    			attr_dev(td1, "class", "px-6 py-4 whitespace-nowrap text-sm text-gray-500");
    			add_location(td1, file$2, 380, 40, 19665);
    			add_location(tr, file$2, 352, 36, 17923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(tr, t0);
    			mount_component(tdcell0, tr, null);
    			append_dev(tr, t1);
    			mount_component(tdcell1, tr, null);
    			append_dev(tr, t2);
    			mount_component(tdcell2, tr, null);
    			append_dev(tr, t3);
    			mount_component(tdcell3, tr, null);
    			append_dev(tr, t4);
    			mount_component(tdcell4, tr, null);
    			append_dev(tr, t5);
    			append_dev(tr, th);
    			append_dev(th, t6);
    			append_dev(th, t7);
    			append_dev(th, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td1);
    			append_dev(td1, div2);
    			append_dev(div2, t10);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*archives*/ 2 && !src_url_equal(img.src, img_src_value = "img/" + /*brand*/ ctx[14] + "_" + /*model*/ ctx[15] + "_" + /*year*/ ctx[16] + ".jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const tdcell0_changes = {};
    			if (dirty & /*archives*/ 2) tdcell0_changes.name = /*brand*/ ctx[14];
    			tdcell0.$set(tdcell0_changes);
    			const tdcell1_changes = {};
    			if (dirty & /*archives*/ 2) tdcell1_changes.name = /*model*/ ctx[15];
    			tdcell1.$set(tdcell1_changes);
    			const tdcell2_changes = {};
    			if (dirty & /*archives*/ 2) tdcell2_changes.name = /*year*/ ctx[16];
    			tdcell2.$set(tdcell2_changes);
    			const tdcell3_changes = {};
    			if (dirty & /*archives*/ 2) tdcell3_changes.name = /*price*/ ctx[17] + "zł";
    			tdcell3.$set(tdcell3_changes);
    			const tdcell4_changes = {};
    			if (dirty & /*archives*/ 2) tdcell4_changes.name = /*startDay*/ ctx[18] + " ---- " + /*endDay*/ ctx[19];
    			tdcell4.$set(tdcell4_changes);
    			if ((!current || dirty & /*archives*/ 2) && t6_value !== (t6_value = /*username*/ ctx[21] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*archives*/ 2) && t8_value !== (t8_value = /*email*/ ctx[22] + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*archives*/ 2) && t10_value !== (t10_value = /*status*/ ctx[20] + "")) set_data_dev(t10, t10_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tdcell0.$$.fragment, local);
    			transition_in(tdcell1.$$.fragment, local);
    			transition_in(tdcell2.$$.fragment, local);
    			transition_in(tdcell3.$$.fragment, local);
    			transition_in(tdcell4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tdcell0.$$.fragment, local);
    			transition_out(tdcell1.$$.fragment, local);
    			transition_out(tdcell2.$$.fragment, local);
    			transition_out(tdcell3.$$.fragment, local);
    			transition_out(tdcell4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(tdcell0);
    			destroy_component(tdcell1);
    			destroy_component(tdcell2);
    			destroy_component(tdcell3);
    			destroy_component(tdcell4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(352:32) {#each archives as { brand, model, year, price, startDay, endDay, status, username, email }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let header;
    	let t0;
    	let t1;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let th5;
    	let t13;
    	let t14;
    	let th6;
    	let t16;
    	let th7;
    	let t17;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t22;
    	let tbody;
    	let t23;
    	let current;
    	let mounted;
    	let dispose;

    	header = new Header({
    			props: { acc: /*acType*/ ctx[2] },
    			$$inline: true
    		});

    	let if_block0 = !/*hidden*/ ctx[5] && create_if_block_10(ctx);
    	let if_block1 = /*acType*/ ctx[2] != "user" && create_if_block_9(ctx);
    	let if_block2 = /*myReservations*/ ctx[0].length != 0 && create_if_block_1$1(ctx);
    	let if_block3 = /*archives*/ ctx[1].length != 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Car";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Brand";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Model";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Year";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Price for days";
    			t11 = space();
    			th5 = element("th");
    			th5.textContent = "Rent Time";
    			t13 = space();
    			if (if_block1) if_block1.c();
    			t14 = space();
    			th6 = element("th");
    			th6.textContent = "Status of application";
    			t16 = space();
    			th7 = element("th");
    			t17 = text("Sort option:\r\n                                    ");
    			select = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "By Brand";
    			option2 = element("option");
    			option2.textContent = "By Model";
    			option3 = element("option");
    			option3.textContent = "By Year";
    			option4 = element("option");
    			option4.textContent = "By Status";
    			t22 = space();
    			tbody = element("tbody");
    			if (if_block2) if_block2.c();
    			t23 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(th0, "scope", "col");
    			attr_dev(th0, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th0, file$2, 126, 32, 4234);
    			attr_dev(th1, "scope", "col");
    			attr_dev(th1, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th1, file$2, 132, 32, 4559);
    			attr_dev(th2, "scope", "col");
    			attr_dev(th2, "class", "px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th2, file$2, 138, 32, 4886);
    			attr_dev(th3, "scope", "col");
    			attr_dev(th3, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th3, file$2, 144, 32, 5213);
    			attr_dev(th4, "scope", "col");
    			attr_dev(th4, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th4, file$2, 150, 32, 5539);
    			attr_dev(th5, "scope", "col");
    			attr_dev(th5, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th5, file$2, 156, 32, 5875);
    			attr_dev(th6, "scope", "col");
    			attr_dev(th6, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th6, file$2, 170, 32, 6663);
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.disabled = true;
    			add_location(option0, file$2, 185, 40, 7512);
    			option1.__value = "byBrand";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 186, 40, 7582);
    			option2.__value = "byModel";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 188, 40, 7707);
    			option3.__value = "byYear";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 190, 40, 7832);
    			option4.__value = "byStatus";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 191, 40, 7913);
    			if (/*sortBy*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$2, 181, 36, 7305);
    			attr_dev(th7, "scope", "col");
    			attr_dev(th7, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th7, file$2, 176, 32, 7006);
    			add_location(tr, file$2, 125, 28, 4196);
    			attr_dev(thead, "class", "bg-gray-50");
    			add_location(thead, file$2, 124, 24, 4140);
    			attr_dev(tbody, "class", "bg-white divide-y divide-gray-200");
    			add_location(tbody, file$2, 198, 24, 8225);
    			attr_dev(table, "class", "min-w-full divide-y divide-gray-200");
    			add_location(table, file$2, 123, 20, 4063);
    			attr_dev(div0, "class", "shadow overflow-hidden border-b border-gray-200 sm:rounded-lg");
    			add_location(div0, file$2, 120, 16, 3927);
    			attr_dev(div1, "class", "py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 concon2 svelte-1hogg76");
    			add_location(div1, file$2, 117, 12, 3799);
    			attr_dev(div2, "class", "-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 concon svelte-1hogg76");
    			add_location(div2, file$2, 116, 8, 3725);
    			attr_dev(div3, "class", "flex flex-col");
    			add_location(div3, file$2, 115, 4, 3688);
    			add_location(main, file$2, 110, 0, 3542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(tr, t11);
    			append_dev(tr, th5);
    			append_dev(tr, t13);
    			if (if_block1) if_block1.m(tr, null);
    			append_dev(tr, t14);
    			append_dev(tr, th6);
    			append_dev(tr, t16);
    			append_dev(tr, th7);
    			append_dev(th7, t17);
    			append_dev(th7, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			select_option(select, /*sortBy*/ ctx[3]);
    			append_dev(table, t22);
    			append_dev(table, tbody);
    			if (if_block2) if_block2.m(tbody, null);
    			append_dev(table, t23);
    			if (if_block3) if_block3.m(table, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12]),
    					listen_dev(select, "change", /*sort*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*acType*/ 4) header_changes.acc = /*acType*/ ctx[2];
    			header.$set(header_changes);

    			if (!/*hidden*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*hidden*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*acType*/ ctx[2] != "user") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(tr, t14);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*sortBy*/ 8) {
    				select_option(select, /*sortBy*/ ctx[3]);
    			}

    			if (/*myReservations*/ ctx[0].length != 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*myReservations*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(tbody, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*archives*/ ctx[1].length != 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*archives*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(table, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyReservations', slots, []);
    	let myReservations = [];
    	let archives = [];
    	let acType;
    	accountType.subscribe(val => $$invalidate(2, acType = val));

    	onMount(async () => {
    		console.log(acType);

    		if (acType == "user") {
    			let myRes = await fetchBase("carListReservation.php", { getMyReservations: true });
    			$$invalidate(0, myReservations = myRes.myReservations);
    			console.log(myReservations);
    		} else if (acType == "moderator" || acType == "admin") {
    			let myRes = await fetchBase("carListReservation.php", { getAllreservations: true });
    			$$invalidate(0, myReservations = myRes.myReservations);
    			$$invalidate(1, archives = myRes.archives);
    			console.log(myReservations);
    		}
    	});

    	let sortBy = "";
    	let sortByArchives = "";

    	let sort = () => {
    		let sorted = sortCars(myReservations, sortBy);
    		$$invalidate(0, myReservations = [...sorted]);
    	};

    	let sortArchives = () => {
    		let sorted = sortCars(archives, sortByArchives);
    		$$invalidate(1, archives = [...sorted]);
    	};

    	let handleReservation = async (brand, model, year, startDay, endDay, status) => {
    		console.log(brand, model, year, startDay, endDay);
    		let params = { brand, model, year, startDay, endDay };

    		let index = myReservations.indexOf(myReservations.filter(a => {
    			return a.brand == brand && a.model == model && a.year == year && a.startDay == startDay && a.endDay == endDay;
    		})[0]);

    		let res = await fetchBase("carListReservation.php", { car: params, status });

    		if ("query" in res && res.query) {
    			if (status == "accept") {
    				$$invalidate(0, myReservations[index].status = "confirmed", myReservations);
    				$$invalidate(0, myReservations[index].hashCode = res.hash, myReservations);
    			}

    			if (status == "refuse") {
    				$$invalidate(0, myReservations[index].status = "unconfirmed", myReservations);
    			}

    			if (status == "cancel") {
    				$$invalidate(0, myReservations[index].status = "canceled", myReservations);
    			}
    		} else {
    			console.warn(query);
    		}

    		console.log(myReservations);
    	};

    	let hidden = true;
    	let qrCode = "";

    	let showQRCode = (brand, model, year, startDay, endDay) => {
    		let index = myReservations.indexOf(myReservations.filter(a => {
    			return a.brand == brand && a.model == model && a.year == year && a.startDay == startDay && a.endDay == endDay;
    		})[0]);

    		if (qrCode !== myReservations[index].hashCode) {
    			$$invalidate(6, qrCode = myReservations[index].hashCode);
    			$$invalidate(5, hidden = false);
    		} else {
    			$$invalidate(5, hidden = !hidden);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MyReservations> was created with unknown prop '${key}'`);
    	});

    	function qrcode_value_binding(value) {
    		qrCode = value;
    		$$invalidate(6, qrCode);
    	}

    	function select_change_handler() {
    		sortBy = select_value(this);
    		$$invalidate(3, sortBy);
    	}

    	function select_change_handler_1() {
    		sortByArchives = select_value(this);
    		$$invalidate(4, sortByArchives);
    	}

    	$$self.$capture_state = () => ({
    		accountType,
    		fetchBase,
    		address,
    		sortCars,
    		onMount,
    		createEventDispatcher,
    		QrCode: Lib,
    		TdCell,
    		Header,
    		myReservations,
    		archives,
    		acType,
    		sortBy,
    		sortByArchives,
    		sort,
    		sortArchives,
    		handleReservation,
    		hidden,
    		qrCode,
    		showQRCode
    	});

    	$$self.$inject_state = $$props => {
    		if ('myReservations' in $$props) $$invalidate(0, myReservations = $$props.myReservations);
    		if ('archives' in $$props) $$invalidate(1, archives = $$props.archives);
    		if ('acType' in $$props) $$invalidate(2, acType = $$props.acType);
    		if ('sortBy' in $$props) $$invalidate(3, sortBy = $$props.sortBy);
    		if ('sortByArchives' in $$props) $$invalidate(4, sortByArchives = $$props.sortByArchives);
    		if ('sort' in $$props) $$invalidate(7, sort = $$props.sort);
    		if ('sortArchives' in $$props) $$invalidate(8, sortArchives = $$props.sortArchives);
    		if ('handleReservation' in $$props) $$invalidate(9, handleReservation = $$props.handleReservation);
    		if ('hidden' in $$props) $$invalidate(5, hidden = $$props.hidden);
    		if ('qrCode' in $$props) $$invalidate(6, qrCode = $$props.qrCode);
    		if ('showQRCode' in $$props) $$invalidate(10, showQRCode = $$props.showQRCode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		myReservations,
    		archives,
    		acType,
    		sortBy,
    		sortByArchives,
    		hidden,
    		qrCode,
    		sort,
    		sortArchives,
    		handleReservation,
    		showQRCode,
    		qrcode_value_binding,
    		select_change_handler,
    		select_change_handler_1
    	];
    }

    class MyReservations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyReservations",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\structure\UserManagement.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file$1 = "src\\structure\\UserManagement.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i].username;
    	child_ctx[10] = list[i].type;
    	child_ctx[11] = list[i].email;
    	child_ctx[12] = list[i].accepted;
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (188:28) {#if accounts.length != 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*accounts*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleAcceptation, accounts, selected, select*/ 106) {
    				each_value = /*accounts*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(188:28) {#if accounts.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (214:91) 
    function create_if_block_6(ctx) {
    	let select_1;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[10] == "user") return create_if_block_7;
    		if (/*type*/ ctx[10] == "moderator") return create_if_block_8;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[8](/*username*/ ctx[9], /*email*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			select_1 = element("select");
    			if (if_block) if_block.c();
    			add_location(select_1, file$1, 214, 52, 9143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select_1, anchor);
    			if (if_block) if_block.m(select_1, null);

    			if (!mounted) {
    				dispose = listen_dev(select_1, "change", change_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(select_1, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select_1);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(214:91) ",
    		ctx
    	});

    	return block;
    }

    // (208:48) {#if type == "admin"}
    function create_if_block_5(ctx) {
    	let select_1;
    	let option;

    	const block = {
    		c: function create() {
    			select_1 = element("select");
    			option = element("option");
    			option.textContent = "Admin";
    			option.__value = "admin";
    			option.value = option.__value;
    			add_location(option, file$1, 209, 56, 8777);
    			select_1.disabled = true;
    			add_location(select_1, file$1, 208, 52, 8702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select_1, anchor);
    			append_dev(select_1, option);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(208:48) {#if type == \\\"admin\\\"}",
    		ctx
    	});

    	return block;
    }

    // (233:86) 
    function create_if_block_8(ctx) {
    	let option0;
    	let option1;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "Moderator";
    			option1 = element("option");
    			option1.textContent = "user";
    			option0.__value = "moderator";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 233, 60, 10536);
    			option1.__value = "user";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 237, 60, 10835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(233:86) ",
    		ctx
    	});

    	return block;
    }

    // (225:56) {#if type == "user"}
    function create_if_block_7(ctx) {
    	let option0;
    	let option1;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "User";
    			option1 = element("option");
    			option1.textContent = "Moderator";
    			option0.__value = "user";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 225, 60, 9925);
    			option1.__value = "moderator";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 228, 60, 10149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(225:56) {#if type == \\\"user\\\"}",
    		ctx
    	});

    	return block;
    }

    // (252:48) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Not Accepted");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(252:48) {:else}",
    		ctx
    	});

    	return block;
    }

    // (250:48) {#if accepted != 0}
    function create_if_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Accepted");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(250:48) {#if accepted != 0}",
    		ctx
    	});

    	return block;
    }

    // (261:48) {#if type != "admin"}
    function create_if_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*accepted*/ ctx[12] == 0) return create_if_block_2;
    		if (/*accepted*/ ctx[12] == 1) return create_if_block_3;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(261:48) {#if type != \\\"admin\\\"}",
    		ctx
    	});

    	return block;
    }

    // (272:76) 
    function create_if_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Disaccept";
    			attr_dev(button, "class", "text-gray-900 svelte-ox7xbw");
    			add_location(button, file$1, 272, 56, 13179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleAcceptation*/ ctx[5](/*username*/ ctx[9], /*email*/ ctx[11], /*type*/ ctx[10], "notAccepted"))) /*handleAcceptation*/ ctx[5](/*username*/ ctx[9], /*email*/ ctx[11], /*type*/ ctx[10], "notAccepted").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(272:76) ",
    		ctx
    	});

    	return block;
    }

    // (262:52) {#if accepted == 0}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Accept";
    			attr_dev(button, "class", "text-gray-900 svelte-ox7xbw");
    			add_location(button, file$1, 262, 56, 12431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleAcceptation*/ ctx[5](/*username*/ ctx[9], /*email*/ ctx[11], /*type*/ ctx[10], "accepted"))) /*handleAcceptation*/ ctx[5](/*username*/ ctx[9], /*email*/ ctx[11], /*type*/ ctx[10], "accepted").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(262:52) {#if accepted == 0}",
    		ctx
    	});

    	return block;
    }

    // (189:32) {#each accounts as { username, type, email, accepted }
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let div0;
    	let t0;
    	let t1;
    	let td1;
    	let div1;
    	let t2_value = /*username*/ ctx[9] + "";
    	let t2;
    	let t3;
    	let td2;
    	let div2;
    	let t4_value = /*email*/ ctx[11] + "";
    	let t4;
    	let t5;
    	let td3;
    	let div3;
    	let t6;
    	let td4;
    	let div4;
    	let t7;
    	let td5;
    	let div5;
    	let t8;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[10] == "admin") return create_if_block_5;
    		if (/*type*/ ctx[10] != "admin" && /*accepted*/ ctx[12] == 1) return create_if_block_6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*accepted*/ ctx[12] != 0) return create_if_block_4;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	let if_block2 = /*type*/ ctx[10] != "admin" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div0 = element("div");
    			t0 = text(/*i*/ ctx[14]);
    			t1 = space();
    			td1 = element("td");
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			td4 = element("td");
    			div4 = element("div");
    			if_block1.c();
    			t7 = space();
    			td5 = element("td");
    			div5 = element("div");
    			if (if_block2) if_block2.c();
    			t8 = space();
    			attr_dev(div0, "class", "text-sm text-gray-900");
    			add_location(div0, file$1, 191, 44, 7586);
    			attr_dev(td0, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td0, file$1, 190, 40, 7500);
    			attr_dev(div1, "class", "text-sm text-gray-900");
    			add_location(div1, file$1, 196, 44, 7901);
    			attr_dev(td1, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td1, file$1, 195, 40, 7815);
    			attr_dev(div2, "class", "text-sm text-gray-900");
    			add_location(div2, file$1, 201, 44, 8223);
    			attr_dev(td2, "class", "px-6 py-4 whitespace-nowrap");
    			add_location(td2, file$1, 200, 40, 8137);
    			attr_dev(div3, "class", "text-sm text-gray-900");
    			add_location(div3, file$1, 206, 44, 8542);
    			attr_dev(td3, "class", "px-2 py-4 whitespace-nowrap");
    			add_location(td3, file$1, 205, 40, 8456);
    			attr_dev(div4, "class", "text-sm text-gray-900");
    			add_location(div4, file$1, 248, 44, 11514);
    			attr_dev(td4, "class", "px-6 py-4 whitespace-nowrap text-sm text-gray-500");
    			add_location(td4, file$1, 245, 40, 11319);
    			attr_dev(div5, "class", "text-sm text-gray-900");
    			add_location(div5, file$1, 259, 44, 12194);
    			attr_dev(td5, "class", "px-6 py-4 whitespace-nowrap text-sm text-gray-500");
    			add_location(td5, file$1, 256, 40, 11999);
    			add_location(tr, file$1, 189, 36, 7454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div0);
    			append_dev(div0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, div1);
    			append_dev(div1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, div2);
    			append_dev(div2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, div4);
    			if_block1.m(div4, null);
    			append_dev(tr, t7);
    			append_dev(tr, td5);
    			append_dev(td5, div5);
    			if (if_block2) if_block2.m(div5, null);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*accounts*/ 2 && t2_value !== (t2_value = /*username*/ ctx[9] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*accounts*/ 2 && t4_value !== (t4_value = /*email*/ ctx[11] + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div3, null);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_2(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			}

    			if (/*type*/ ctx[10] != "admin") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div5, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(189:32) {#each accounts as { username, type, email, accepted }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let th4;
    	let t10;
    	let th5;
    	let t11;
    	let select_1;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t16;
    	let tbody;
    	let current;
    	let mounted;
    	let dispose;

    	header = new Header({
    			props: { acc: /*acType*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block = /*accounts*/ ctx[1].length != 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Nr.";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "Username";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "Email";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "Account type";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "Is Accepted?";
    			t10 = space();
    			th5 = element("th");
    			t11 = text("Sort option:\r\n                                    ");
    			select_1 = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "By username";
    			option2 = element("option");
    			option2.textContent = "By Email";
    			option3 = element("option");
    			option3.textContent = "By Acceptation";
    			option4 = element("option");
    			option4.textContent = "By Type";
    			t16 = space();
    			tbody = element("tbody");
    			if (if_block) if_block.c();
    			attr_dev(th0, "scope", "col");
    			attr_dev(th0, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th0, file$1, 133, 32, 4286);
    			attr_dev(th1, "scope", "col");
    			attr_dev(th1, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th1, file$1, 139, 32, 4611);
    			attr_dev(th2, "scope", "col");
    			attr_dev(th2, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th2, file$1, 145, 32, 4941);
    			attr_dev(th3, "scope", "col");
    			attr_dev(th3, "class", "px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th3, file$1, 151, 32, 5268);
    			attr_dev(th4, "scope", "col");
    			attr_dev(th4, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th4, file$1, 157, 32, 5602);
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.disabled = true;
    			add_location(option0, file$1, 172, 40, 6444);
    			option1.__value = "byUsername";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 173, 40, 6514);
    			option2.__value = "byEmail";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 176, 40, 6691);
    			option3.__value = "byAcceptation";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 178, 40, 6816);
    			option4.__value = "byType";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 181, 40, 6999);
    			if (/*sortBy*/ ctx[2] === void 0) add_render_callback(() => /*select_1_change_handler*/ ctx[7].call(select_1));
    			add_location(select_1, file$1, 168, 36, 6235);
    			attr_dev(th5, "scope", "col");
    			attr_dev(th5, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
    			add_location(th5, file$1, 163, 32, 5936);
    			add_location(tr, file$1, 132, 28, 4248);
    			attr_dev(thead, "class", "bg-gray-50");
    			add_location(thead, file$1, 131, 24, 4192);
    			attr_dev(tbody, "class", "bg-white divide-y divide-gray-200");
    			add_location(tbody, file$1, 186, 24, 7219);
    			attr_dev(table, "class", "min-w-full divide-y divide-gray-200");
    			add_location(table, file$1, 130, 20, 4115);
    			attr_dev(div0, "class", "shadow overflow-hidden border-b border-gray-200 sm:rounded-lg");
    			add_location(div0, file$1, 127, 16, 3979);
    			attr_dev(div1, "class", "py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 concon2");
    			add_location(div1, file$1, 124, 12, 3851);
    			attr_dev(div2, "class", "-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 concon");
    			add_location(div2, file$1, 123, 8, 3777);
    			attr_dev(div3, "class", "flex flex-col");
    			add_location(div3, file$1, 122, 4, 3740);
    			add_location(main, file$1, 119, 0, 3697);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			append_dev(tr, t10);
    			append_dev(tr, th5);
    			append_dev(th5, t11);
    			append_dev(th5, select_1);
    			append_dev(select_1, option0);
    			append_dev(select_1, option1);
    			append_dev(select_1, option2);
    			append_dev(select_1, option3);
    			append_dev(select_1, option4);
    			select_option(select_1, /*sortBy*/ ctx[2]);
    			append_dev(table, t16);
    			append_dev(table, tbody);
    			if (if_block) if_block.m(tbody, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select_1, "change", /*select_1_change_handler*/ ctx[7]),
    					listen_dev(select_1, "change", /*change*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*acType*/ 1) header_changes.acc = /*acType*/ ctx[0];
    			header.$set(header_changes);

    			if (dirty & /*sortBy*/ 4) {
    				select_option(select_1, /*sortBy*/ ctx[2]);
    			}

    			if (/*accounts*/ ctx[1].length != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserManagement', slots, []);
    	let acType;
    	accountType.subscribe(val => $$invalidate(0, acType = val));
    	let accounts = [];

    	onMount(async () => {
    		if (acType == "admin") {
    			let myRes = await fetchBase("main.php", { getUsers: true });
    			$$invalidate(1, accounts = myRes.users);
    		}
    	});

    	let sortBy = "";

    	let change = () => {
    		console.log(sortBy);
    		let sorted;

    		if (sortBy == "byUsername") {
    			sorted = accounts.sort((a, b) => {
    				if (a.username < b.username) {
    					return -1;
    				}

    				if (a.username > b.username) {
    					return 1;
    				}

    				return 0;
    			});
    		} else if (sortBy == "byEmail") {
    			sorted = accounts.sort((a, b) => {
    				if (a.email < b.email) {
    					return -1;
    				}

    				if (a.email > b.email) {
    					return 1;
    				}

    				return 0;
    			});
    		} else if (sortBy == "byAcceptation") {
    			sorted = accounts.sort((a, b) => {
    				if (a.accepted < b.accepted) {
    					return -1;
    				}

    				if (a.accepted > b.accepted) {
    					return 1;
    				}

    				return 0;
    			});
    		} else if (sortBy == "byType") {
    			sorted = accounts.sort((a, b) => {
    				if (a.type < b.type) {
    					return -1;
    				}

    				if (a.type > b.type) {
    					return 1;
    				}

    				return 0;
    			});
    		}

    		$$invalidate(1, accounts = [...sorted]);
    	};

    	let selected = { username: "", email: "" };

    	let handleAcceptation = async (username, email, type, status) => {
    		let res = await fetchBase("main.php", {
    			accountOperations: true,
    			operation: "acceptUser",
    			username,
    			email,
    			type,
    			status
    		});

    		let index = accounts.indexOf(accounts.filter(a => {
    			return a.username == username && a.email == email && a.type == type;
    		})[0]);

    		if ("query" in res && res.query) {
    			let x = 0;
    			if (status == "accepted") x = 1;
    			$$invalidate(1, accounts[index].accepted = x, accounts);
    			alert("Users Updated");
    		} else {
    			alert("Update didn't completed");
    		}
    	};

    	let select = async e => {
    		let paramToChange = {
    			accountOperations: true,
    			operation: "changeType",
    			username: selected.username,
    			email: selected.email,
    			type: e.target.value
    		};

    		let res = await fetchBase("main.php", paramToChange);

    		if ("query" in res && res.query) {
    			let index = accounts.indexOf(accounts.filter(a => {
    				return a.username == selected.username && a.email == selected.email;
    			})[0]);

    			$$invalidate(1, accounts[index].type = e.target.value, accounts);
    			alert("Users Updated");
    		} else {
    			alert("Update didn't completed");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<UserManagement> was created with unknown prop '${key}'`);
    	});

    	function select_1_change_handler() {
    		sortBy = select_value(this);
    		$$invalidate(2, sortBy);
    	}

    	const change_handler = (username, email, e) => {
    		$$invalidate(3, selected = { username, email });
    		select(e);
    	};

    	$$self.$capture_state = () => ({
    		accountType,
    		fetchBase,
    		address,
    		onMount,
    		createEventDispatcher,
    		Header,
    		acType,
    		accounts,
    		sortBy,
    		change,
    		selected,
    		handleAcceptation,
    		select
    	});

    	$$self.$inject_state = $$props => {
    		if ('acType' in $$props) $$invalidate(0, acType = $$props.acType);
    		if ('accounts' in $$props) $$invalidate(1, accounts = $$props.accounts);
    		if ('sortBy' in $$props) $$invalidate(2, sortBy = $$props.sortBy);
    		if ('change' in $$props) $$invalidate(4, change = $$props.change);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('handleAcceptation' in $$props) $$invalidate(5, handleAcceptation = $$props.handleAcceptation);
    		if ('select' in $$props) $$invalidate(6, select = $$props.select);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		acType,
    		accounts,
    		sortBy,
    		selected,
    		change,
    		handleAcceptation,
    		select,
    		select_1_change_handler,
    		change_handler
    	];
    }

    class UserManagement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserManagement",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    // (15:2) <Route path={address}>
    function create_default_slot_5(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(15:2) <Route path={address}>",
    		ctx
    	});

    	return block;
    }

    // (16:2) <Route path="{address}register">
    function create_default_slot_4(ctx) {
    	let register;
    	let current;
    	register = new Register({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(register.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(register, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(register.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(register.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(register, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(16:2) <Route path=\\\"{address}register\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:2) <Route path="{address}home" let:params>
    function create_default_slot_3(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(17:2) <Route path=\\\"{address}home\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <Route path="{address}myReservations">
    function create_default_slot_2(ctx) {
    	let myreservations;
    	let current;
    	myreservations = new MyReservations({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(myreservations.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(myreservations, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(myreservations.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(myreservations.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(myreservations, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(18:2) <Route path=\\\"{address}myReservations\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:2) <Route path="{address}userManagement">
    function create_default_slot_1(ctx) {
    	let usermanagement;
    	let current;
    	usermanagement = new UserManagement({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usermanagement.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usermanagement, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usermanagement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usermanagement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usermanagement, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(19:2) <Route path=\\\"{address}userManagement\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:0) <Router {url}>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let current;

    	route0 = new Route({
    			props: {
    				path: address,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "" + (address + "register"),
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "" + (address + "home"),
    				$$slots: {
    					default: [
    						create_default_slot_3,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "" + (address + "myReservations"),
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "" + (address + "userManagement"),
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			add_location(div, file, 13, 1, 434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			append_dev(div, t3);
    			mount_component(route4, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Home,
    		Login,
    		Register,
    		address,
    		MyReservations,
    		UserManagement,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
