import _e, { useState as V, useRef as X, useEffect as re } from "react";
var ne = { exports: {} }, K = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pe;
function Ae() {
  if (pe) return K;
  pe = 1;
  var b = Symbol.for("react.transitional.element"), v = Symbol.for("react.fragment");
  function M(A, x, d) {
    var g = null;
    if (d !== void 0 && (g = "" + d), x.key !== void 0 && (g = "" + x.key), "key" in x) {
      d = {};
      for (var m in x)
        m !== "key" && (d[m] = x[m]);
    } else d = x;
    return x = d.ref, {
      $$typeof: b,
      type: A,
      key: g,
      ref: x !== void 0 ? x : null,
      props: d
    };
  }
  return K.Fragment = v, K.jsx = M, K.jsxs = M, K;
}
var k = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Te;
function je() {
  return Te || (Te = 1, process.env.NODE_ENV !== "production" && function() {
    function b(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === oe ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case f:
          return "Fragment";
        case l:
          return "Portal";
        case T:
          return "Profiler";
        case u:
          return "StrictMode";
        case o:
          return "Suspense";
        case t:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case w:
            return (e.displayName || "Context") + ".Provider";
          case E:
            return (e._context.displayName || "Context") + ".Consumer";
          case h:
            var n = e.render;
            return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case c:
            return n = e.displayName || null, n !== null ? n : b(e.type) || "Memo";
          case G:
            n = e._payload, e = e._init;
            try {
              return b(e(n));
            } catch {
            }
        }
      return null;
    }
    function v(e) {
      return "" + e;
    }
    function M(e) {
      try {
        v(e);
        var n = !1;
      } catch {
        n = !0;
      }
      if (n) {
        n = console;
        var r = n.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return r.call(
          n,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          i
        ), v(e);
      }
    }
    function A() {
    }
    function x() {
      if (F === 0) {
        ie = console.log, fe = console.info, de = console.warn, he = console.error, ve = console.group, ge = console.groupCollapsed, me = console.groupEnd;
        var e = {
          configurable: !0,
          enumerable: !0,
          value: A,
          writable: !0
        };
        Object.defineProperties(console, {
          info: e,
          log: e,
          warn: e,
          error: e,
          group: e,
          groupCollapsed: e,
          groupEnd: e
        });
      }
      F++;
    }
    function d() {
      if (F--, F === 0) {
        var e = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: I({}, e, { value: ie }),
          info: I({}, e, { value: fe }),
          warn: I({}, e, { value: de }),
          error: I({}, e, { value: he }),
          group: I({}, e, { value: ve }),
          groupCollapsed: I({}, e, { value: ge }),
          groupEnd: I({}, e, { value: me })
        });
      }
      0 > F && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function g(e) {
      if (se === void 0)
        try {
          throw Error();
        } catch (r) {
          var n = r.stack.trim().match(/\n( *(at )?)/);
          se = n && n[1] || "", Ee = -1 < r.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < r.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + se + e + Ee;
    }
    function m(e, n) {
      if (!e || ue) return "";
      var r = ce.get(e);
      if (r !== void 0) return r;
      ue = !0, r = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var i = null;
      i = U.H, U.H = null, x();
      try {
        var O = {
          DetermineComponentFrameRoot: function() {
            try {
              if (n) {
                var q = function() {
                  throw Error();
                };
                if (Object.defineProperty(q.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(q, []);
                  } catch (H) {
                    var te = H;
                  }
                  Reflect.construct(e, [], q);
                } else {
                  try {
                    q.call();
                  } catch (H) {
                    te = H;
                  }
                  e.call(q.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (H) {
                  te = H;
                }
                (q = e()) && typeof q.catch == "function" && q.catch(function() {
                });
              }
            } catch (H) {
              if (H && te && typeof H.stack == "string")
                return [H.stack, te.stack];
            }
            return [null, null];
          }
        };
        O.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var R = Object.getOwnPropertyDescriptor(
          O.DetermineComponentFrameRoot,
          "name"
        );
        R && R.configurable && Object.defineProperty(
          O.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var s = O.DetermineComponentFrameRoot(), B = s[0], Z = s[1];
        if (B && Z) {
          var N = B.split(`
`), J = Z.split(`
`);
          for (s = R = 0; R < N.length && !N[R].includes(
            "DetermineComponentFrameRoot"
          ); )
            R++;
          for (; s < J.length && !J[s].includes(
            "DetermineComponentFrameRoot"
          ); )
            s++;
          if (R === N.length || s === J.length)
            for (R = N.length - 1, s = J.length - 1; 1 <= R && 0 <= s && N[R] !== J[s]; )
              s--;
          for (; 1 <= R && 0 <= s; R--, s--)
            if (N[R] !== J[s]) {
              if (R !== 1 || s !== 1)
                do
                  if (R--, s--, 0 > s || N[R] !== J[s]) {
                    var Q = `
` + N[R].replace(
                      " at new ",
                      " at "
                    );
                    return e.displayName && Q.includes("<anonymous>") && (Q = Q.replace("<anonymous>", e.displayName)), typeof e == "function" && ce.set(e, Q), Q;
                  }
                while (1 <= R && 0 <= s);
              break;
            }
        }
      } finally {
        ue = !1, U.H = i, d(), Error.prepareStackTrace = r;
      }
      return N = (N = e ? e.displayName || e.name : "") ? g(N) : "", typeof e == "function" && ce.set(e, N), N;
    }
    function _(e) {
      if (e == null) return "";
      if (typeof e == "function") {
        var n = e.prototype;
        return m(
          e,
          !(!n || !n.isReactComponent)
        );
      }
      if (typeof e == "string") return g(e);
      switch (e) {
        case o:
          return g("Suspense");
        case t:
          return g("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case h:
            return e = m(e.render, !1), e;
          case c:
            return _(e.type);
          case G:
            n = e._payload, e = e._init;
            try {
              return _(e(n));
            } catch {
            }
        }
      return "";
    }
    function Y() {
      var e = U.A;
      return e === null ? null : e.getOwner();
    }
    function z(e) {
      if (le.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function y(e, n) {
      function r() {
        we || (we = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          n
        ));
      }
      r.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: r,
        configurable: !0
      });
    }
    function C() {
      var e = b(this.type);
      return be[e] || (be[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function j(e, n, r, i, O, R) {
      return r = R.ref, e = {
        $$typeof: a,
        type: e,
        key: n,
        props: R,
        _owner: O
      }, (r !== void 0 ? r : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: C
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function p(e, n, r, i, O, R) {
      if (typeof e == "string" || typeof e == "function" || e === f || e === T || e === u || e === o || e === t || e === ee || typeof e == "object" && e !== null && (e.$$typeof === G || e.$$typeof === c || e.$$typeof === w || e.$$typeof === E || e.$$typeof === h || e.$$typeof === Ce || e.getModuleId !== void 0)) {
        var s = n.children;
        if (s !== void 0)
          if (i)
            if (ae(s)) {
              for (i = 0; i < s.length; i++)
                W(s[i], e);
              Object.freeze && Object.freeze(s);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else W(s, e);
      } else
        s = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? i = "null" : ae(e) ? i = "array" : e !== void 0 && e.$$typeof === a ? (i = "<" + (b(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : i = typeof e, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          i,
          s
        );
      if (le.call(n, "key")) {
        s = b(e);
        var B = Object.keys(n).filter(function(N) {
          return N !== "key";
        });
        i = 0 < B.length ? "{key: someKey, " + B.join(": ..., ") + ": ...}" : "{key: someKey}", ye[s + i] || (B = 0 < B.length ? "{" + B.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          i,
          s,
          B,
          s
        ), ye[s + i] = !0);
      }
      if (s = null, r !== void 0 && (M(r), s = "" + r), z(n) && (M(n.key), s = "" + n.key), "key" in n) {
        r = {};
        for (var Z in n)
          Z !== "key" && (r[Z] = n[Z]);
      } else r = n;
      return s && y(
        r,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), j(e, s, R, O, Y(), r);
    }
    function W(e, n) {
      if (typeof e == "object" && e && e.$$typeof !== Me) {
        if (ae(e))
          for (var r = 0; r < e.length; r++) {
            var i = e[r];
            P(i) && S(i, n);
          }
        else if (P(e))
          e._store && (e._store.validated = 1);
        else if (e === null || typeof e != "object" ? r = null : (r = D && e[D] || e["@@iterator"], r = typeof r == "function" ? r : null), typeof r == "function" && r !== e.entries && (r = r.call(e), r !== e))
          for (; !(e = r.next()).done; )
            P(e.value) && S(e.value, n);
      }
    }
    function P(e) {
      return typeof e == "object" && e !== null && e.$$typeof === a;
    }
    function S(e, n) {
      if (e._store && !e._store.validated && e.key == null && (e._store.validated = 1, n = L(n), !xe[n])) {
        xe[n] = !0;
        var r = "";
        e && e._owner != null && e._owner !== Y() && (r = null, typeof e._owner.tag == "number" ? r = b(e._owner.type) : typeof e._owner.name == "string" && (r = e._owner.name), r = " It was passed a child from " + r + ".");
        var i = U.getCurrentStack;
        U.getCurrentStack = function() {
          var O = _(e.type);
          return i && (O += i() || ""), O;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          n,
          r
        ), U.getCurrentStack = i;
      }
    }
    function L(e) {
      var n = "", r = Y();
      return r && (r = b(r.type)) && (n = `

Check the render method of \`` + r + "`."), n || (e = b(e)) && (n = `

Check the top-level render call using <` + e + ">."), n;
    }
    var $ = _e, a = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), E = Symbol.for("react.consumer"), w = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), o = Symbol.for("react.suspense"), t = Symbol.for("react.suspense_list"), c = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), ee = Symbol.for("react.offscreen"), D = Symbol.iterator, oe = Symbol.for("react.client.reference"), U = $.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = Object.prototype.hasOwnProperty, I = Object.assign, Ce = Symbol.for("react.client.reference"), ae = Array.isArray, F = 0, ie, fe, de, he, ve, ge, me;
    A.__reactDisabledLog = !0;
    var se, Ee, ue = !1, ce = new (typeof WeakMap == "function" ? WeakMap : Map)(), Me = Symbol.for("react.client.reference"), we, be = {}, ye = {}, xe = {};
    k.Fragment = f, k.jsx = function(e, n, r, i, O) {
      return p(e, n, r, !1, i, O);
    }, k.jsxs = function(e, n, r, i, O) {
      return p(e, n, r, !0, i, O);
    };
  }()), k;
}
var Re;
function Se() {
  return Re || (Re = 1, process.env.NODE_ENV === "production" ? ne.exports = Ae() : ne.exports = je()), ne.exports;
}
var Oe = Se();
function Ne(b, v, M, A, x, d) {
  const [g, m] = V(null), [_, Y] = V(null), [z, y] = V(null), C = X({ x: 0, y: 0 }), j = X({ x: 0, y: 0 }), p = X({
    width: 0,
    height: 0
  }), W = (a, l) => {
    for (let f = v.length - 1; f >= 0; f--) {
      const u = v[f];
      if (a >= u.x && a <= u.x + u.width && l >= u.y && l <= u.y + u.height)
        return u;
    }
  }, P = (a, l, f, u = 10) => {
    const T = {
      tl: { x: a.x, y: a.y },
      tr: { x: a.x + a.width, y: a.y },
      bl: { x: a.x, y: a.y + a.height },
      br: { x: a.x + a.width, y: a.y + a.height }
    };
    for (const E in T) {
      if (!E) continue;
      const w = T[E].x, h = T[E].y;
      if (Math.abs(l - w) <= u && Math.abs(f - h) <= u)
        return E;
    }
    return null;
  }, S = (a, l) => {
    if (d) {
      const u = v.find((T) => T.id === M);
      if (u) {
        const T = P(u, a, l);
        if (T) {
          Y(u.id), y(T), j.current = { x: a, y: l }, p.current = {
            width: u.width,
            height: u.height
          }, x?.(!0);
          return;
        }
      }
    }
    const f = W(a, l);
    f ? (m(f.id), C.current = { x: a - f.x, y: l - f.y }, x?.(!0), d?.(f.id)) : d?.(void 0);
  }, L = (a, l) => {
    if (_ && z) {
      const u = a - j.current.x, T = l - j.current.y, E = v.map((w) => {
        if (w.id !== _) return w;
        let h = p.current.width, o = p.current.height;
        switch (z) {
          case "tl": {
            const t = p.current.width - u, c = p.current.height - T;
            h = Math.max(t, 10), o = Math.max(c, 10);
            break;
          }
          case "tr": {
            const t = p.current.width + u, c = p.current.height - T;
            h = Math.max(t, 10), o = Math.max(c, 10);
            break;
          }
          case "bl": {
            const t = p.current.width - u, c = p.current.height + T;
            h = Math.max(t, 10), o = Math.max(c, 10);
            break;
          }
          case "br": {
            const t = p.current.width + u, c = p.current.height + T;
            h = Math.max(t, 10), o = Math.max(c, 10);
            break;
          }
        }
        return h = Math.max(10, h), o = Math.max(10, o), {
          ...w,
          width: h,
          height: o
        };
      });
      A?.(E);
      return;
    }
    if (!g) return;
    const f = v.map(
      (u) => u.id === g ? {
        ...u,
        x: a - C.current.x,
        y: l - C.current.y
      } : u
    );
    A?.(f);
  }, $ = () => {
    m(null), Y(null), y(null), x?.(!1);
  };
  re(() => {
    const a = b.current;
    if (!a) return;
    const l = (f) => {
      const u = a.getBoundingClientRect(), T = f.clientX - u.left, E = f.clientY - u.top;
      if (d) {
        const w = v.find((h) => h.id === M);
        if (w) {
          const h = P(w, T, E);
          if (h) {
            const o = {
              tl: "nwse-resize",
              br: "nwse-resize",
              tr: "nesw-resize",
              bl: "nesw-resize"
            };
            a.style.cursor = o[h];
            return;
          }
        }
      }
      a.style.cursor = g || _ ? "grabbing" : "default";
    };
    return a.addEventListener("mousemove", l), () => {
      a.removeEventListener("mousemove", l), a.style.cursor = "default";
    };
  }, [b, v, d, g, _]), re(() => {
    const a = b.current;
    if (!a) return;
    const l = (E) => {
      const w = a.getBoundingClientRect();
      S(E.clientX - w.left, E.clientY - w.top);
    }, f = (E) => {
      if (!g && !_) return;
      const w = a.getBoundingClientRect();
      L(E.clientX - w.left, E.clientY - w.top);
    }, u = (E) => {
      if (E.touches.length !== 1) return;
      const w = a.getBoundingClientRect(), h = E.touches[0];
      S(h.clientX - w.left, h.clientY - w.top);
    }, T = (E) => {
      if (E.touches.length !== 1 || !g && !_) return;
      const w = a.getBoundingClientRect(), h = E.touches[0];
      L(h.clientX - w.left, h.clientY - w.top);
    };
    return a.addEventListener("mousedown", l), window.addEventListener("mousemove", f), window.addEventListener("mouseup", $), a.addEventListener("touchstart", u, { passive: !1 }), window.addEventListener("touchmove", T, { passive: !1 }), window.addEventListener("touchend", $), () => {
      a.removeEventListener("mousedown", l), window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", $), a.removeEventListener("touchstart", u), window.removeEventListener("touchmove", T), window.removeEventListener("touchend", $);
    };
  }, [
    b,
    g,
    _,
    z,
    v,
    A,
    x,
    d
  ]);
}
function Ye({
  image: b,
  cropWidth: v,
  cropHeight: M,
  rotation: A,
  initialZoom: x,
  stickers: d,
  setOutputImage: g,
  onStickersChange: m
}) {
  const _ = X(null), [Y, z] = V({ x: 0, y: 0 }), [y, C] = V(x), [j, p] = V(!1), [W, P] = V(void 0), S = X(null), L = (o, t, c) => Math.min(Math.max(o, t), c), $ = (o) => {
    if (!S.current || j) return;
    const t = y / 100, c = S.current.width * t, G = S.current.height * t, ee = Math.max(0, (c - v) / 2), D = Math.max(0, (G - M) / 2), oe = L(o.x, -ee, ee), U = L(o.y, -D, D);
    z({ x: oe, y: U });
  };
  re(() => {
    const o = new Image();
    o.onload = () => {
      S.current = o, h();
    }, o.src = b;
  }, [b, y, Y, A, d, W]);
  const a = (o, t, c) => {
    o.save(), o.fillStyle = "#007bff", o.strokeStyle = "#fff", o.lineWidth = 2, o.beginPath(), o.rect(t - 10 / 2, c - 10 / 2, 10, 10), o.fill(), o.stroke(), o.restore();
  }, l = X({}), f = () => {
    const o = _.current, t = o?.getContext("2d");
    if (!o || !t || !S.current) return;
    o.width = v, o.height = M, t.clearRect(0, 0, v, M), t.save();
    const c = y / 100;
    return t.translate(Y.x + v / 2, Y.y + M / 2), t.rotate(A * Math.PI / 180), t.scale(c, c), t.drawImage(
      S.current,
      -S.current.width / 2,
      -S.current.height / 2
    ), t.restore(), t;
  }, u = (o, t) => {
    let c = l.current[t.src];
    if (!c) {
      c = new Image(), c.src = t.src, l.current[t.src] = c, c.onload = () => h();
      return;
    }
    c.complete && o.drawImage(
      c,
      t.x,
      t.y,
      t.width,
      t.height
    );
  }, T = (o, t) => {
    o.font = `${t.height}px sans-serif`, o.textAlign = "left", o.textBaseline = "top", o.fillText(t.src, t.x, t.y);
  }, E = (o, t) => {
    o.strokeStyle = "#007bff", o.lineWidth = 2, o.strokeRect(t.x, t.y, t.width, t.height), a(o, t.x, t.y), a(o, t.x + t.width, t.y), a(o, t.x, t.y + t.height), a(
      o,
      t.x + t.width,
      t.y + t.height
    );
  }, w = (o) => {
    const t = o.toDataURL();
    g?.(t, d);
  }, h = () => {
    const o = _.current, t = f();
    !t || !o || (d.forEach((c) => {
      c.src.startsWith("data:image") || c.src.startsWith("http") ? u(t, c) : T(t, c), c.id === W && E(t, c);
    }), g && w(o));
  };
  return Ne(
    _,
    d,
    W,
    m,
    p,
    P
  ), {
    canvasRef: _,
    clamp: L,
    setCurrentZoom: C,
    currentZoom: y,
    setPosition: $,
    position: Y
  };
}
function Pe(b, v) {
  const M = X(!1), A = X({ x: 0, y: 0 });
  return {
    onMouseDown: (m) => {
      M.current = !0, A.current = {
        x: m.clientX - v.x,
        y: m.clientY - v.y
      };
    },
    onMouseMove: (m) => {
      M.current && b(
        m.clientX - A.current.x,
        m.clientY - A.current.y
      );
    },
    onMouseUp: () => {
      M.current = !1;
    }
  };
}
function ze(b, v, M, A, x) {
  const d = X(!1), g = X({ x: 0, y: 0 }), m = X(null);
  return {
    onTouchStart: (y) => {
      if (y.touches.length === 1) {
        const C = y.touches[0];
        d.current = !0, g.current = {
          x: C.clientX - v.x,
          y: C.clientY - v.y
        };
      } else if (y.touches.length === 2) {
        const [C, j] = Array.from(y.touches), p = Math.hypot(j.clientX - C.clientX, j.clientY - C.clientY);
        m.current = p;
      }
    },
    onTouchMove: (y) => {
      if (y.preventDefault(), y.touches.length === 1 && d.current) {
        const C = y.touches[0];
        b(
          C.clientX - g.current.x,
          C.clientY - g.current.y
        );
      } else if (y.touches.length === 2) {
        const [C, j] = Array.from(y.touches), p = Math.hypot(j.clientX - C.clientX, j.clientY - C.clientY);
        if (m.current != null) {
          const P = (p - m.current) * 0.3;
          M(x(A + P, 10, 500));
        }
        m.current = p;
      }
    },
    onTouchEnd: () => {
      d.current = !1, m.current = null;
    }
  };
}
function Xe({
  image: b,
  cropWidth: v,
  cropHeight: M,
  zoom: A,
  rotation: x,
  setOutputImage: d,
  stickers: g,
  onStickersChange: m
}) {
  const {
    canvasRef: _,
    clamp: Y,
    setCurrentZoom: z,
    currentZoom: y,
    setPosition: C,
    position: j
  } = Ye({
    image: b,
    cropWidth: v,
    cropHeight: M,
    rotation: x,
    initialZoom: A,
    setOutputImage: d,
    stickers: g,
    onStickersChange: m
  }), { onMouseDown: p, onMouseMove: W, onMouseUp: P } = Pe(
    (l, f) => C({ x: l, y: f }),
    j
  ), { onTouchStart: S, onTouchMove: L, onTouchEnd: $ } = ze(
    (l, f) => C({ x: l, y: f }),
    j,
    z,
    y,
    Y
  ), a = (l) => {
    l.preventDefault();
    const u = -l.deltaY * 0.1;
    z(y + u);
  };
  return re(() => {
    const l = _.current;
    if (l)
      return l.addEventListener("wheel", a, { passive: !1 }), () => {
        l.removeEventListener("wheel", a);
      };
  }, [_, y]), /* @__PURE__ */ Oe.jsx(
    "canvas",
    {
      ref: _,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: p,
      onMouseMove: W,
      onMouseUp: P,
      onMouseLeave: P,
      onTouchStart: S,
      onTouchMove: L,
      onTouchEnd: $
    }
  );
}
export {
  Xe as ImageCanvas
};
