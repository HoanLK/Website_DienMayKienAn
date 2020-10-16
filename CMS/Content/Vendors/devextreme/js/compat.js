var n=require("preact/hooks"),t=require("preact");function e(n,t){for(var e in t)n[e]=t[e];return n}function r(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}var o=function(n){var t,e;function o(t){var e;return(e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=o).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,o.prototype.shouldComponentUpdate=function(n,t){return r(this.props,n)||r(this.state,t)},o}(t.Component);function u(n,e){function o(n){var t=this.props.ref,o=t==n.ref;return!o&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!o:r(this.props,n)}function u(e){return this.shouldComponentUpdate=o,t.createElement(n,e)}return u.prototype.isReactComponent=!0,u.displayName="Memo("+(n.displayName||n.name)+")",u.t=!0,u}var i=t.options.__b;t.options.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),i&&i(n)};var f="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function c(n){function t(t,r){var o=e({},t);return delete o.ref,n(o,"object"!=typeof(r=t.ref||r)||"current"in r?r:null)}return t.$$typeof=f,t.render=t,t.prototype.isReactComponent=t.t=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var l=function(n,e){return n?t.toChildArray(n).reduce(function(n,t,r){return n.concat(e(t,r))},[]):null},a={map:l,forEach:l,count:function(n){return n?t.toChildArray(n).length:0},only:function(n){if(1!==(n=t.toChildArray(n)).length)throw new Error("Children.only() expects only one child.");return n[0]},toArray:t.toChildArray},s=t.options.__e;function p(n){return n&&((n=e({},n)).__c=null,n.__k=n.__k&&n.__k.map(p)),n}function v(){this.__u=0,this.o=null,this.__b=null}function h(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function d(n){var e,r,o;function u(u){if(e||(e=n()).then(function(n){r=n.default||n},function(n){o=n}),o)throw o;if(!r)throw e;return t.createElement(r,u)}return u.displayName="Lazy",u.t=!0,u}function x(){this.i=null,this.l=null}t.options.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);s(n,t,e)},(v.prototype=new t.Component).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=h(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i())};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c()};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate()};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u)},v.prototype.render=function(n,e){return this.__b&&(this.__v.__k[0]=p(this.__b),this.__b=null),[t.createElement(t.Fragment,null,e.u?null:n.children),e.u&&n.fallback]};var m=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2]}};(x.prototype=new t.Component).u=function(n){var t=this,e=h(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),m(t,n,r)):o()};e?e(u):u()}},x.prototype.render=function(n){this.i=null,this.l=new Map;var e=t.toChildArray(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&e.reverse();for(var r=e.length;r--;)this.l.set(e[r],this.i=[1,0,this.i]);return n.children},x.prototype.componentDidUpdate=x.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){m(n,e,t)})};var y=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();function b(n){var e=this,r=n.container,o=t.createElement(y,{context:e.context},n.vnode);return e.s&&e.s!==r&&(e.p.parentNode&&e.s.removeChild(e.p),t.__u(e.v),e.h=!1),n.vnode?e.h?(r.__k=e.__k,t.render(o,r),e.__k=r.__k):(e.p=document.createTextNode(""),t.hydrate("",r),r.appendChild(e.p),e.h=!0,e.s=r,t.render(o,r,e.p),e.__k=e.p.__k):e.h&&(e.p.parentNode&&e.s.removeChild(e.p),t.__u(e.v)),e.v=o,e.componentWillUnmount=function(){e.p.parentNode&&e.s.removeChild(e.p),t.__u(e.v)},null}function S(n,e){return t.createElement(b,{vnode:n,container:e})}var w=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;t.Component.prototype.isReactComponent={};var g="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;function _(n,e,r){if(null==e.__k)for(;e.firstChild;)e.removeChild(e.firstChild);return t.render(n,e),"function"==typeof r&&r(),n?n.__c:null}function E(n,e,r){return t.hydrate(n,e),"function"==typeof r&&r(),n?n.__c:null}var A=t.options.event;function C(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n}})}t.options.event=function(n){A&&(n=A(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var k={configurable:!0,get:function(){return this.class}},N=t.options.vnode;function R(n){return t.createElement.bind(null,n)}function U(n){return!!n&&n.$$typeof===g}function F(n){return U(n)?t.cloneElement.apply(null,arguments):n}function M(n){return!!n.__k&&(t.render(null,n),!0)}function j(n){return n&&(n.base||1===n.nodeType&&n)||null}t.options.vnode=function(n){n.$$typeof=g;var e=n.type,r=n.props;if(e){if(r.class!=r.className&&(k.enumerable="className"in r,null!=r.className&&(r.class=r.className),Object.defineProperty(r,"className",k)),"function"!=typeof e){var o,u,i;for(i in r.defaultValue&&void 0!==r.value&&(r.value||0===r.value||(r.value=r.defaultValue),delete r.defaultValue),Array.isArray(r.value)&&r.multiple&&"select"===e&&(t.toChildArray(r.children).forEach(function(n){-1!=r.value.indexOf(n.props.value)&&(n.props.selected=!0)}),delete r.value),null!=r.value&&"textarea"===e&&(r.children=r.value,delete r.value),r)if(o=w.test(i))break;if(o)for(i in u=n.props={},r)u[w.test(i)?i.replace(/[A-Z0-9]/,"-$&").toLowerCase():i]=r[i]}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange])}}}(),"function"==typeof e&&!e.m&&e.prototype&&(C(e.prototype,"componentWillMount"),C(e.prototype,"componentWillReceiveProps"),C(e.prototype,"componentWillUpdate"),e.m=!0)}N&&N(n)};var O=function(n,t){return n(t)},L=t.Fragment,P={useState:n.useState,useReducer:n.useReducer,useEffect:n.useEffect,useLayoutEffect:n.useLayoutEffect,useRef:n.useRef,useImperativeHandle:n.useImperativeHandle,useMemo:n.useMemo,useCallback:n.useCallback,useContext:n.useContext,useDebugValue:n.useDebugValue,version:"16.8.0",Children:a,render:_,hydrate:E,unmountComponentAtNode:M,createPortal:S,createElement:t.createElement,createContext:t.createContext,createFactory:R,cloneElement:F,createRef:t.createRef,Fragment:t.Fragment,isValidElement:U,findDOMNode:j,Component:t.Component,PureComponent:o,memo:u,forwardRef:c,unstable_batchedUpdates:O,StrictMode:L,Suspense:v,SuspenseList:x,lazy:d};Object.keys(n).forEach(function(t){exports[t]=n[t]}),exports.createElement=t.createElement,exports.createContext=t.createContext,exports.createRef=t.createRef,exports.Fragment=t.Fragment,exports.Component=t.Component,exports.version="16.8.0",exports.Children=a,exports.render=_,exports.hydrate=E,exports.unmountComponentAtNode=M,exports.createPortal=S,exports.createFactory=R,exports.cloneElement=F,exports.isValidElement=U,exports.findDOMNode=j,exports.PureComponent=o,exports.memo=u,exports.forwardRef=c,exports.unstable_batchedUpdates=O,exports.StrictMode=L,exports.Suspense=v,exports.SuspenseList=x,exports.lazy=d,exports.default=P;
//# sourceMappingURL=compat.js.map
