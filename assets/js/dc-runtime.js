/*
 * Santosha page runtime.
 * Each page keeps its layout as a <template id="tpl"> written in the design file's markup:
 *   <x-import component-from-global-scope="Santosha.Button" href="...">  → a Santosha component
 *   {{name}}                                                             → a value from renderVals()
 *   <sc-for list="{{items}}" as="item">                                  → repeat for each item
 * This file turns that template into React elements and re-renders when the page's state changes.
 */
(function () {
  'use strict';
  var h = React.createElement;

  function DCLogic() { this.props = {}; this.state = {}; }
  DCLogic.prototype.setState = function (update) {
    var next = typeof update === 'function' ? update(this.state, this.props) : update;
    this.state = Object.assign({}, this.state, next);
    if (this.__update) this.__update();
  };
  window.DCLogic = DCLogic;

  var ATTR = {
    'class': 'className', 'for': 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
    autocomplete: 'autoComplete', playsinline: 'playsInline', autoplay: 'autoPlay', srcset: 'srcSet',
    crossorigin: 'crossOrigin', datetime: 'dateTime', colspan: 'colSpan', rowspan: 'rowSpan', novalidate: 'noValidate',
    onclick: 'onClick', onsubmit: 'onSubmit', onchange: 'onChange', oninput: 'onInput', onkeydown: 'onKeyDown'
  };
  var BOOL = ['controls', 'muted', 'loop', 'playsinline', 'autoplay', 'hidden', 'disabled', 'required', 'checked', 'open', 'novalidate', 'multiple', 'readonly'];
  var VOID = ['img', 'input', 'br', 'hr', 'source', 'track', 'meta', 'link', 'col', 'wbr'];

  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
  function styleObj(s) {
    var o = {};
    s.split(';').forEach(function (d) {
      var i = d.indexOf(':'); if (i < 0) return;
      var k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (!k) return;
      o[k.indexOf('--') === 0 ? k : camel(k)] = v;
    });
    return o;
  }
  function lookup(path, vals, scope) {
    path = path.trim();
    var parts = path.split('.'), root;
    if (scope && Object.prototype.hasOwnProperty.call(scope, parts[0])) { root = scope; }
    else { root = vals; }
    return parts.reduce(function (o, k) { return o == null ? o : o[k]; }, root);
  }
  var WHOLE = /^\{\{(.+)\}\}$/, PART = /\{\{(.+?)\}\}/g;
  function value(v, vals, scope) {
    var m = v.match(WHOLE);
    if (m) return lookup(m[1], vals, scope);
    return v.replace(PART, function (_, p) { var r = lookup(p, vals, scope); return r == null ? '' : r; });
  }

  function convert(node, key, vals, scope) {
    if (node.nodeType === 3) {
      var t = node.textContent;
      if (t.trim() === '' && t.indexOf('\n') >= 0) return null;
      return t.replace(PART, function (_, p) { var r = lookup(p, vals, scope); return r == null ? '' : r; });
    }
    if (node.nodeType !== 1) return null;
    var tag = node.tagName.toLowerCase();

    if (tag === 'sc-for') {
      var list = value(node.getAttribute('list'), vals, scope) || [];
      var as = node.getAttribute('as');
      var out = [];
      list.forEach(function (item, i) {
        var s2 = Object.assign({}, scope || {}); s2[as] = item; s2.$index = i;
        Array.prototype.forEach.call(node.childNodes, function (c, j) {
          var r = convert(c, key + '-' + i + '-' + j, vals, s2);
          if (r !== null && typeof r !== 'string') out.push(r);
        });
      });
      return h(React.Fragment, { key: key }, out);
    }

    var kids = [];
    Array.prototype.forEach.call(node.childNodes, function (c, i) {
      var r = convert(c, i, vals, scope); if (r !== null) kids.push(r);
    });
    var props = { key: key };

    if (tag === 'x-import') {
      var C = window;
      node.getAttribute('component-from-global-scope').split('.').forEach(function (p) { C = C[p]; });
      Array.prototype.forEach.call(node.attributes, function (a) {
        if (a.name === 'component-from-global-scope') return;
        if (a.name === 'style') { props.style = styleObj(a.value); return; }
        props[camel(a.name)] = value(a.value, vals, scope);
      });
      return h.apply(null, [C, props].concat(kids));
    }

    Array.prototype.forEach.call(node.attributes, function (a) {
      var name = a.name, v;
      if (name === 'style') { props.style = styleObj(a.value); return; }
      v = value(a.value, vals, scope);
      if (BOOL.indexOf(name) >= 0 && v === '') v = true;
      if (ATTR[name]) name = ATTR[name];
      else if (name.indexOf('aria-') !== 0 && name.indexOf('data-') !== 0) name = camel(name);
      props[name] = v;
    });
    if (props.hidden === false) delete props.hidden;
    return VOID.indexOf(tag) >= 0 ? h(tag, props) : h.apply(null, [tag, props].concat(kids));
  }

  window.mountDC = function (Component) {
    var inst = new Component();
    var tpl = document.getElementById('tpl').content;
    function Page() {
      var force = React.useReducer(function (x) { return x + 1; }, 0)[1];
      inst.__update = force;
      React.useEffect(function () {
        if (location.hash.length > 1) {
          var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (el) requestAnimationFrame(function () { el.scrollIntoView(); });
        }
      }, []);
      var vals = inst.renderVals();
      var roots = [];
      Array.prototype.forEach.call(tpl.childNodes, function (c, i) {
        var r = convert(c, i, vals, null);
        if (r !== null && typeof r !== 'string') roots.push(r);
      });
      return h(React.Fragment, null, roots);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(h(Page));
  };
})();
