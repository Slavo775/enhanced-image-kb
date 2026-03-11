import oe, { useMemo as se, useRef as z, useState as q, useEffect as $, useCallback as he } from "react";
var G = { exports: {} }, Z = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ae;
function Ee() {
  if (ae) return Z;
  ae = 1;
  var r = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function s(a, c, i) {
    var S = null;
    if (i !== void 0 && (S = "" + i), c.key !== void 0 && (S = "" + c.key), "key" in c) {
      i = {};
      for (var f in c)
        f !== "key" && (i[f] = c[f]);
    } else i = c;
    return c = i.ref, {
      $$typeof: r,
      type: a,
      key: S,
      ref: c !== void 0 ? c : null,
      props: i
    };
  }
  return Z.Fragment = o, Z.jsx = s, Z.jsxs = s, Z;
}
var V = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ce;
function Re() {
  return ce || (ce = 1, process.env.NODE_ENV !== "production" && function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === h ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case O:
          return "Fragment";
        case x:
          return "Profiler";
        case P:
          return "StrictMode";
        case W:
          return "Suspense";
        case X:
          return "SuspenseList";
        case v:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case _:
            return "Portal";
          case U:
            return (e.displayName || "Context") + ".Provider";
          case L:
            return (e._context.displayName || "Context") + ".Consumer";
          case N:
            var d = e.render;
            return e = e.displayName, e || (e = d.displayName || d.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case m:
            return d = e.displayName || null, d !== null ? d : r(e.type) || "Memo";
          case u:
            d = e._payload, e = e._init;
            try {
              return r(e(d));
            } catch {
            }
        }
      return null;
    }
    function o(e) {
      return "" + e;
    }
    function s(e) {
      try {
        o(e);
        var d = !1;
      } catch {
        d = !0;
      }
      if (d) {
        d = console;
        var w = d.error, T = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return w.call(
          d,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), o(e);
      }
    }
    function a(e) {
      if (e === O) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === u)
        return "<...>";
      try {
        var d = r(e);
        return d ? "<" + d + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function c() {
      var e = b.A;
      return e === null ? null : e.getOwner();
    }
    function i() {
      return Error("react-stack-top-frame");
    }
    function S(e) {
      if (k.call(e, "key")) {
        var d = Object.getOwnPropertyDescriptor(e, "key").get;
        if (d && d.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function f(e, d) {
      function w() {
        A || (A = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          d
        ));
      }
      w.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: w,
        configurable: !0
      });
    }
    function E() {
      var e = r(this.type);
      return j[e] || (j[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function g(e, d, w, T, Y, I, te, re) {
      return w = I.ref, e = {
        $$typeof: C,
        type: e,
        key: d,
        props: I,
        _owner: Y
      }, (w !== void 0 ? w : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: E
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
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: te
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: re
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function l(e, d, w, T, Y, I, te, re) {
      var F = d.children;
      if (F !== void 0)
        if (T)
          if (y(F)) {
            for (T = 0; T < F.length; T++)
              p(F[T]);
            Object.freeze && Object.freeze(F);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else p(F);
      if (k.call(d, "key")) {
        F = r(e);
        var B = Object.keys(d).filter(function(be) {
          return be !== "key";
        });
        T = 0 < B.length ? "{key: someKey, " + B.join(": ..., ") + ": ...}" : "{key: someKey}", t[F + T] || (B = 0 < B.length ? "{" + B.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          T,
          F,
          B,
          F
        ), t[F + T] = !0);
      }
      if (F = null, w !== void 0 && (s(w), F = "" + w), S(d) && (s(d.key), F = "" + d.key), "key" in d) {
        w = {};
        for (var ne in d)
          ne !== "key" && (w[ne] = d[ne]);
      } else w = d;
      return F && f(
        w,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), g(
        e,
        F,
        I,
        Y,
        c(),
        w,
        te,
        re
      );
    }
    function p(e) {
      typeof e == "object" && e !== null && e.$$typeof === C && e._store && (e._store.validated = 1);
    }
    var R = oe, C = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), P = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), L = Symbol.for("react.consumer"), U = Symbol.for("react.context"), N = Symbol.for("react.forward_ref"), W = Symbol.for("react.suspense"), X = Symbol.for("react.suspense_list"), m = Symbol.for("react.memo"), u = Symbol.for("react.lazy"), v = Symbol.for("react.activity"), h = Symbol.for("react.client.reference"), b = R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, k = Object.prototype.hasOwnProperty, y = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    R = {
      "react-stack-bottom-frame": function(e) {
        return e();
      }
    };
    var A, j = {}, D = R["react-stack-bottom-frame"].bind(
      R,
      i
    )(), n = M(a(i)), t = {};
    V.Fragment = O, V.jsx = function(e, d, w, T, Y) {
      var I = 1e4 > b.recentlyCreatedOwnerStacks++;
      return l(
        e,
        d,
        w,
        !1,
        T,
        Y,
        I ? Error("react-stack-top-frame") : D,
        I ? M(a(e)) : n
      );
    }, V.jsxs = function(e, d, w, T, Y) {
      var I = 1e4 > b.recentlyCreatedOwnerStacks++;
      return l(
        e,
        d,
        w,
        !0,
        T,
        Y,
        I ? Error("react-stack-top-frame") : D,
        I ? M(a(e)) : n
      );
    };
  }()), V;
}
var ie;
function ke() {
  return ie || (ie = 1, process.env.NODE_ENV === "production" ? G.exports = Ee() : G.exports = Re()), G.exports;
}
var K = ke();
const ue = (r) => {
  let o;
  const s = /* @__PURE__ */ new Set(), a = (g, l) => {
    const p = typeof g == "function" ? g(o) : g;
    if (!Object.is(p, o)) {
      const R = o;
      o = l ?? (typeof p != "object" || p === null) ? p : Object.assign({}, o, p), s.forEach((C) => C(o, R));
    }
  }, c = () => o, f = { setState: a, getState: c, getInitialState: () => E, subscribe: (g) => (s.add(g), () => s.delete(g)) }, E = o = r(a, c, f);
  return f;
}, me = (r) => r ? ue(r) : ue, Te = (r) => r;
function Se(r, o = Te) {
  const s = oe.useSyncExternalStore(
    r.subscribe,
    () => o(r.getState()),
    () => o(r.getInitialState())
  );
  return oe.useDebugValue(s), s;
}
const le = (r) => {
  const o = me(r), s = (a) => Se(o, a);
  return Object.assign(s, o), s;
}, Q = (r) => r ? le(r) : le, Me = Q((r) => ({
  canvases: {},
  addCanvas: (o, s) => r((a) => a.canvases[s] ? a : {
    canvases: {
      ...a.canvases,
      [s]: o
    }
  }),
  updateCanvas: (o, s) => r((a) => ({
    canvases: {
      ...a.canvases,
      [s]: o
    }
  }))
})), ge = (r) => {
  const { canvases: o, updateCanvas: s, addCanvas: a } = Me(), c = se(() => o[r], [o]);
  return { canvas: c, setZoom: (l) => {
    c && s({ ...c, zoom: l }, r);
  }, setRotation: (l) => {
    c && s({ ...c, rotation: l }, r);
  }, setBrightness: (l) => {
    c && s({ ...c, brightness: l }, r);
  }, setContrast: (l) => {
    c && s({ ...c, contrast: l }, r);
  }, initCanvas: (l) => {
    a(l, r);
  } };
}, ve = 10, pe = 500, xe = 0.1, Ce = 0.3, _e = 10;
var de = (r, o, s) => (c, i) => ({
  pastStates: s?.pastStates || [],
  futureStates: s?.futureStates || [],
  undo: (S = 1) => {
    if (i().pastStates.length) {
      const f = s?.partialize?.(o()) || o(), E = i().pastStates.splice(-S, S), g = E.shift();
      r(g), c({
        pastStates: i().pastStates,
        futureStates: i().futureStates.concat(
          s?.diff?.(f, g) || f,
          E.reverse()
        )
      });
    }
  },
  redo: (S = 1) => {
    if (i().futureStates.length) {
      const f = s?.partialize?.(o()) || o(), E = i().futureStates.splice(-S, S), g = E.shift();
      r(g), c({
        pastStates: i().pastStates.concat(
          s?.diff?.(f, g) || f,
          E.reverse()
        ),
        futureStates: i().futureStates
      });
    }
  },
  clear: () => c({ pastStates: [], futureStates: [] }),
  isTracking: !0,
  pause: () => c({ isTracking: !1 }),
  resume: () => c({ isTracking: !0 }),
  setOnSave: (S) => c({ _onSave: S }),
  // Internal properties
  _onSave: s?.onSave,
  _handleSet: (S, f, E, g) => {
    s?.limit && i().pastStates.length >= s?.limit && i().pastStates.shift(), i()._onSave?.(S, E), c({
      pastStates: i().pastStates.concat(g || S),
      futureStates: []
    });
  }
}), Ae = (r, o) => (a, c, i) => {
  i.temporal = me(
    o?.wrapTemporal?.(de(a, c, o)) || de(a, c, o)
  );
  const S = o?.handleSet?.(
    i.temporal.getState()._handleSet
  ) || i.temporal.getState()._handleSet, f = (g) => {
    if (!i.temporal.getState().isTracking) return;
    const l = o?.partialize?.(c()) || c(), p = o?.diff?.(g, l);
    // If the user has provided a diff function but nothing has been changed, deltaState will be null
    p === null || // If the user has provided an equality function, use it
    o?.equality?.(g, l) || S(
      g,
      void 0,
      l,
      p
    );
  }, E = i.setState;
  return i.setState = (...g) => {
    const l = o?.partialize?.(c()) || c();
    E(...g), f(l);
  }, r(
    // Modify the set function to call the userlandSet function
    (...g) => {
      const l = o?.partialize?.(c()) || c();
      a(...g), f(l);
    },
    c,
    i
  );
};
const H = Q()(
  Ae(
    (r) => ({
      stickers: void 0,
      selectedSticker: void 0,
      addSticker: (o, s) => r((a) => {
        const c = a.stickers?.[s]?.stickers || [];
        return {
          stickers: {
            ...a.stickers,
            [s]: {
              stickers: [...c, o]
            }
          }
        };
      }),
      updateSticker: (o, s) => r((a) => {
        const i = (a.stickers?.[s]?.stickers || []).map(
          (S) => S.id === o.id ? o : S
        );
        return {
          stickers: {
            ...a.stickers,
            [s]: {
              stickers: i
            }
          }
        };
      }),
      updateAll: (o, s) => r((a) => ({
        stickers: {
          ...a.stickers,
          [s]: {
            stickers: o
          }
        }
      })),
      removeSticker: (o, s) => r((a) => {
        const i = (a.stickers?.[s]?.stickers || []).filter(
          (f) => f.id !== o
        ), S = { ...a.selectedSticker };
        return S?.[s] === o && (S[s] = void 0), {
          stickers: {
            ...a.stickers,
            [s]: {
              stickers: i
            }
          },
          selectedSticker: S
        };
      }),
      setSelectedSticker: (o, s) => r((a) => ({
        selectedSticker: {
          ...a.selectedSticker,
          [o]: s
        }
      }))
    }),
    {
      // Track only stickers — selection changes don't pollute undo history
      partialize: (r) => ({ stickers: r.stickers }),
      limit: 50
    }
  )
), fe = (r) => Se(H.temporal, r);
let J = null;
const ee = (r) => {
  const {
    stickers: o,
    selectedSticker: s,
    addSticker: a,
    removeSticker: c,
    setSelectedSticker: i,
    updateSticker: S,
    updateAll: f
  } = H(), E = fe((u) => u.pastStates.length > 0), g = fe((u) => u.futureStates.length > 0), l = () => H.temporal.getState().undo(), p = () => H.temporal.getState().redo(), R = () => H.temporal.getState().pause(), C = () => H.temporal.getState().resume(), _ = z(void 0), O = se(() => o?.[r]?.stickers, [o]), P = se(
    () => s?.[r],
    [s]
  );
  _.current = P;
  function x(u) {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(u)))}`;
  }
  return {
    stickers: O,
    selectedSticker: P,
    selectedStickerRef: _,
    addSticker: async (u) => {
      let v = "", h = 100, b = 100;
      if (typeof u == "string")
        if (v = u, v.startsWith("data:image/svg+xml"))
          try {
            const y = atob(v.split(",")[1]), A = new DOMParser().parseFromString(y, "image/svg+xml").querySelector("svg"), j = A?.getAttribute("width"), D = A?.getAttribute("height"), n = A?.getAttribute("viewBox");
            if (j && D)
              h = parseFloat(j), b = parseFloat(D);
            else if (n) {
              const [, , t, e] = n.split(" ").map(Number);
              h = t, b = e;
            }
          } catch (y) {
            console.error("[useStickers] Failed to parse base64 SVG:", y);
          }
        else if (u.includes("<svg"))
          try {
            v = x(u);
            const M = new DOMParser().parseFromString(u, "image/svg+xml").querySelector("svg"), A = M?.getAttribute("width"), j = M?.getAttribute("height"), D = M?.getAttribute("viewBox");
            if (A && j)
              h = parseFloat(A), b = parseFloat(j);
            else if (D) {
              const [, , n, t] = D.split(" ").map(Number);
              h = n, b = t;
            }
          } catch (y) {
            console.error("[useStickers] Failed to parse SVG string:", y);
          }
        else {
          const y = await Oe(v);
          h = y.width, b = y.height;
        }
      const k = {
        id: (/* @__PURE__ */ new Date()).toISOString(),
        type: "sticker",
        src: v,
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: h,
        height: b
      };
      a(k, r);
    },
    addMentionSticker: (u) => {
      if (!u.trim()) return;
      const v = `@${u.trim()}`, h = 20, b = h + 18, k = v.length * h * 0.58 + 28;
      a(
        {
          id: (/* @__PURE__ */ new Date()).toISOString(),
          type: "mention",
          src: u.trim(),
          x: Math.random() * 200,
          y: Math.random() * 200,
          width: k,
          height: b
        },
        r
      );
    },
    addLocationSticker: (u) => {
      if (!u.trim()) return;
      const v = 18, h = v + 18, b = h * 0.18, k = h / 2, y = u.trim().length * v * 0.55 + k * 2 + b * 4 + 8;
      a(
        {
          id: (/* @__PURE__ */ new Date()).toISOString(),
          type: "location",
          src: u.trim(),
          x: Math.random() * 200,
          y: Math.random() * 200,
          width: y,
          height: h
        },
        r
      );
    },
    removeSticker: (u) => c(u, r),
    setSelectedSticker: (u) => i(r, u),
    updateSticker: (u) => S(u, r),
    updateAllStickers: (u) => f(u, r),
    undo: l,
    redo: p,
    canUndo: E,
    canRedo: g,
    pauseHistory: R,
    resumeHistory: C,
    copySelectedSticker: () => {
      const u = _.current;
      if (!u) return;
      const v = O?.find((h) => h.id === u);
      v && (J = v);
    },
    pasteSticker: () => {
      J && a(
        {
          ...J,
          id: (/* @__PURE__ */ new Date()).toISOString(),
          x: J.x + 15,
          y: J.y + 15
        },
        r
      );
    },
    duplicateSelectedSticker: () => {
      const u = _.current;
      if (!u) return;
      const v = O?.find((h) => h.id === u);
      v && a(
        { ...v, id: (/* @__PURE__ */ new Date()).toISOString(), x: v.x + 15, y: v.y + 15 },
        r
      );
    }
  };
};
function Oe(r) {
  return new Promise((o, s) => {
    const a = new Image();
    a.onload = () => o({ width: a.width, height: a.height }), a.onerror = s, a.src = r;
  });
}
function Pe(r, o, s) {
  const {
    stickers: a,
    selectedSticker: c,
    setSelectedSticker: i,
    updateAllStickers: S,
    pauseHistory: f,
    resumeHistory: E
  } = ee(o), [g, l] = q(null), [p, R] = q(null), [C, _] = q(null), O = z({ x: 0, y: 0 }), P = z({ x: 0, y: 0 }), x = z({
    width: 0,
    height: 0
  }), L = (m, u) => {
    if (a)
      for (let v = a.length - 1; v >= 0; v--) {
        const h = a[v];
        if (m >= h.x && m <= h.x + h.width && u >= h.y && u <= h.y + h.height)
          return h;
      }
  }, U = (m, u, v, h = 10) => {
    const b = {
      tl: { x: m.x, y: m.y },
      tr: { x: m.x + m.width, y: m.y },
      bl: { x: m.x, y: m.y + m.height },
      br: { x: m.x + m.width, y: m.y + m.height }
    };
    for (const k in b) {
      if (!k) continue;
      const y = b[k].x, M = b[k].y;
      if (Math.abs(u - y) <= h && Math.abs(v - M) <= h)
        return k;
    }
    return null;
  }, N = (m, u) => {
    f();
    const v = a?.find((b) => b.id === c);
    if (v) {
      const b = U(v, m, u);
      if (b) {
        R(v.id), _(b), P.current = { x: m, y: u }, x.current = {
          width: v.width,
          height: v.height
        }, s?.(!0);
        return;
      }
    }
    const h = L(m, u);
    h ? (l(h.id), O.current = { x: m - h.x, y: u - h.y }, s?.(!0), i?.(h.id)) : i?.(void 0);
  }, W = (m, u) => {
    if (p && C) {
      const h = m - P.current.x, b = u - P.current.y, k = a?.map((y) => {
        if (y.id !== p) return y;
        let M = x.current.width, A = x.current.height;
        switch (C) {
          case "tl": {
            const j = x.current.width - h, D = x.current.height - b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "tr": {
            const j = x.current.width + h, D = x.current.height - b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "bl": {
            const j = x.current.width - h, D = x.current.height + b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "br": {
            const j = x.current.width + h, D = x.current.height + b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
        }
        return M = Math.max(10, M), A = Math.max(10, A), {
          ...y,
          width: M,
          height: A
        };
      });
      k && S?.(k);
      return;
    }
    if (!g) return;
    const v = a?.map(
      (h) => h.id === g ? {
        ...h,
        x: m - O.current.x,
        y: u - O.current.y
      } : h
    );
    v && S?.(v);
  }, X = () => {
    E(), l(null), R(null), _(null), s?.(!1);
  };
  $(() => {
    const m = r.current;
    if (!m) return;
    const u = (v) => {
      const h = m.getBoundingClientRect(), b = v.clientX - h.left, k = v.clientY - h.top, y = a?.find((M) => M.id === c);
      if (y) {
        const M = U(y, b, k);
        if (M) {
          const A = {
            tl: "nwse-resize",
            br: "nwse-resize",
            tr: "nesw-resize",
            bl: "nesw-resize"
          };
          m.style.cursor = A[M];
          return;
        }
      }
      m.style.cursor = g || p ? "grabbing" : "default";
    };
    return m.addEventListener("mousemove", u), () => {
      m.removeEventListener("mousemove", u), m.style.cursor = "default";
    };
  }, [r, a, i, g, p]), $(() => {
    const m = r.current;
    if (!m) return;
    const u = (k) => {
      const y = m.getBoundingClientRect();
      N(k.clientX - y.left, k.clientY - y.top);
    }, v = (k) => {
      if (!g && !p) return;
      const y = m.getBoundingClientRect();
      W(k.clientX - y.left, k.clientY - y.top);
    }, h = (k) => {
      if (k.touches.length !== 1) return;
      const y = m.getBoundingClientRect(), M = k.touches[0];
      N(M.clientX - y.left, M.clientY - y.top);
    }, b = (k) => {
      if (k.touches.length !== 1 || !g && !p) return;
      const y = m.getBoundingClientRect(), M = k.touches[0];
      W(M.clientX - y.left, M.clientY - y.top);
    };
    return m.addEventListener("mousedown", u), window.addEventListener("mousemove", v), window.addEventListener("mouseup", X), m.addEventListener("touchstart", h, { passive: !1 }), window.addEventListener("touchmove", b, { passive: !1 }), window.addEventListener("touchend", X), () => {
      m.removeEventListener("mousedown", u), window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", X), m.removeEventListener("touchstart", h), window.removeEventListener("touchmove", b), window.removeEventListener("touchend", X);
    };
  }, [
    r,
    g,
    p,
    C,
    a,
    S,
    s,
    i
  ]);
}
const we = Q((r) => ({
  canvasRefs: {},
  setCanvasRef: (o, s) => r((a) => ({
    canvasRefs: { ...a.canvasRefs, [o]: s }
  }))
})), ye = Q(() => {
  const r = { current: null };
  return {
    finalImageRef: r,
    setFinalImage: (o) => {
      r.current = o;
    },
    getFinalImage: () => r.current
  };
});
function De({ canvasId: r }) {
  const { canvasRefs: o } = we(), s = z(null), [a, c] = q({ x: 0, y: 0 }), [i, S] = q(!1), f = z(null), E = z(null), g = z(null), { stickers: l, selectedSticker: p } = ee(r), {
    canvas: { image: R, cropHeight: C, cropWidth: _, rotation: O, zoom: P, brightness: x, contrast: L },
    setZoom: U
  } = ge(r), N = he(() => {
    E.current !== null && cancelAnimationFrame(E.current), E.current = requestAnimationFrame(() => {
      E.current = null, g.current?.();
    });
  }, []), W = (n, t, e) => Math.min(Math.max(n, t), e), X = (n) => {
    if (!f.current || i) return;
    const t = P / 100, e = f.current.width * t, d = f.current.height * t, w = Math.max(0, (e - _) / 2), T = Math.max(0, (d - C) / 2), Y = W(n.x, -w, w), I = W(n.y, -T, T);
    c({ x: Y, y: I });
  };
  $(() => {
    if (!R) return;
    const n = new Image();
    return n.onload = () => {
      f.current = n, N();
    }, n.onerror = () => {
      console.error("[useCanvasCrop] Failed to load image:", R.slice(0, 80));
    }, n.src = R, () => {
      n.onload = null, n.onerror = null;
    };
  }, [R]), $(() => (N(), () => {
    E.current !== null && (cancelAnimationFrame(E.current), E.current = null);
  }), [P, a, O, l, p, x, L]);
  const m = (n, t, e) => {
    const d = _e;
    n.save(), n.fillStyle = "#007bff", n.strokeStyle = "#fff", n.lineWidth = 2, n.beginPath(), n.rect(t - d / 2, e - d / 2, d, d), n.fill(), n.stroke(), n.restore();
  }, u = z({}), v = () => {
    const n = s.current ?? o[r].current, t = n?.getContext("2d");
    if (!n || !t || !f.current) return;
    n.width = _, n.height = C, t.clearRect(0, 0, _, C), t.save();
    const e = P / 100;
    return t.translate(a.x + _ / 2, a.y + C / 2), t.rotate(O * Math.PI / 180), t.scale(e, e), t.filter = `brightness(${(x ?? 100) / 100}) contrast(${(L ?? 100) / 100})`, t.drawImage(
      f.current,
      -f.current.width / 2,
      -f.current.height / 2
    ), t.filter = "none", t.restore(), t;
  }, h = (n, t) => {
    let e = u.current[t.src];
    if (!e) {
      e = new Image(), e.src = t.src, u.current[t.src] = e, e.onload = () => N();
      return;
    }
    e.complete && n.drawImage(
      e,
      t.x,
      t.y,
      t.width,
      t.height
    );
  }, b = (n, t) => {
    n.font = `${t.height}px sans-serif`, n.textAlign = "left", n.textBaseline = "top", n.fillText(t.src, t.x, t.y);
  }, k = (n, t, e, d, w, T) => {
    n.beginPath(), n.moveTo(t + T, e), n.lineTo(t + d - T, e), n.quadraticCurveTo(t + d, e, t + d, e + T), n.lineTo(t + d, e + w - T), n.quadraticCurveTo(t + d, e + w, t + d - T, e + w), n.lineTo(t + T, e + w), n.quadraticCurveTo(t, e + w, t, e + w - T), n.lineTo(t, e + T), n.quadraticCurveTo(t, e, t + T, e), n.closePath();
  }, y = (n, t) => {
    const e = `@${t.src}`, d = Math.round(t.height * 0.52), w = t.height / 2;
    n.save(), n.fillStyle = "rgba(0,0,0,0.65)", k(n, t.x, t.y, t.width, t.height, w), n.fill(), n.fillStyle = "#ffffff", n.font = `bold ${d}px sans-serif`, n.textAlign = "center", n.textBaseline = "middle", n.fillText(e, t.x + t.width / 2, t.y + t.height / 2), n.restore();
  }, M = (n, t) => {
    const e = Math.round(t.height * 0.48), d = t.height / 2, w = t.height * 0.18, T = t.x + d, Y = t.y + t.height / 2;
    n.save(), n.fillStyle = "rgba(0,0,0,0.65)", k(n, t.x, t.y, t.width, t.height, d), n.fill(), n.fillStyle = "#ff4444", n.beginPath(), n.arc(T, Y, w, 0, Math.PI * 2), n.fill(), n.fillStyle = "#ffffff", n.font = `bold ${e}px sans-serif`, n.textAlign = "left", n.textBaseline = "middle", n.fillText(t.src, T + w * 2, Y), n.restore();
  }, A = (n, t) => {
    n.strokeStyle = "#007bff", n.lineWidth = 2, n.strokeRect(t.x, t.y, t.width, t.height), m(n, t.x, t.y), m(n, t.x + t.width, t.y), m(n, t.x, t.y + t.height), m(
      n,
      t.x + t.width,
      t.y + t.height
    );
  }, j = (n) => {
    const t = n.toDataURL();
    return ye.getState().setFinalImage({ dataUrl: t, metaData: { stickers: l ?? [] } }), { dataUrl: t, metaData: { stickers: l } };
  }, D = () => {
    const n = s ?? o[r], t = v();
    if (!(!t || !n.current))
      return l?.forEach((e) => {
        switch (e.type) {
          case "mention":
            y(t, e);
            break;
          case "location":
            M(t, e);
            break;
          case "emoji":
            b(t, e);
            break;
          default:
            h(t, e);
        }
        e.id === p && A(t, e);
      }), j(n.current);
  };
  return g.current = D, Pe(
    s ?? o[r],
    r,
    S
  ), {
    canvasRef: s,
    clamp: W,
    setCurrentZoom: U,
    currentZoom: P,
    setPosition: X,
    position: a,
    drawCanvas: D
  };
}
function je(r, o) {
  const s = z(!1), a = z({ x: 0, y: 0 });
  return {
    onMouseDown: (f) => {
      s.current = !0, a.current = {
        x: f.clientX - o.x,
        y: f.clientY - o.y
      };
    },
    onMouseMove: (f) => {
      s.current && r(
        f.clientX - a.current.x,
        f.clientY - a.current.y
      );
    },
    onMouseUp: () => {
      s.current = !1;
    }
  };
}
function ze(r, o, s, a, c) {
  const i = z(!1), S = z({ x: 0, y: 0 }), f = z(null);
  return {
    onTouchStart: (p) => {
      if (p.touches.length === 1) {
        const R = p.touches[0];
        i.current = !0, S.current = {
          x: R.clientX - o.x,
          y: R.clientY - o.y
        };
      } else if (p.touches.length === 2) {
        const [R, C] = Array.from(p.touches), _ = Math.hypot(C.clientX - R.clientX, C.clientY - R.clientY);
        f.current = _;
      }
    },
    onTouchMove: (p) => {
      if (p.preventDefault(), p.touches.length === 1 && i.current) {
        const R = p.touches[0];
        r(
          R.clientX - S.current.x,
          R.clientY - S.current.y
        );
      } else if (p.touches.length === 2) {
        const [R, C] = Array.from(p.touches), _ = Math.hypot(C.clientX - R.clientX, C.clientY - R.clientY);
        if (f.current != null) {
          const P = (_ - f.current) * Ce;
          s(c(a + P, ve, pe));
        }
        f.current = _;
      }
    },
    onTouchEnd: () => {
      i.current = !1, f.current = null;
    }
  };
}
function Fe(r) {
  const {
    selectedStickerRef: o,
    removeSticker: s,
    setSelectedSticker: a,
    undo: c,
    redo: i,
    copySelectedSticker: S,
    pasteSticker: f,
    duplicateSelectedSticker: E
  } = ee(r);
  $(() => {
    const g = (l) => {
      const p = l.metaKey || l.ctrlKey, R = l.target.tagName;
      if (!(R === "INPUT" || R === "TEXTAREA")) {
        if (p && l.key === "z" && !l.shiftKey) {
          l.preventDefault(), c();
          return;
        }
        if (p && l.key === "z" && l.shiftKey || p && l.key === "y") {
          l.preventDefault(), i();
          return;
        }
        if (p && l.key === "c") {
          S();
          return;
        }
        if (p && l.key === "v") {
          f();
          return;
        }
        if (p && l.key === "d") {
          l.preventDefault(), E();
          return;
        }
        if (l.key === "Delete" || l.key === "Backspace") {
          const C = o.current;
          C && (l.preventDefault(), s(C));
          return;
        }
        if (l.key === "Escape") {
          a(void 0);
          return;
        }
      }
    };
    return window.addEventListener("keydown", g), () => window.removeEventListener("keydown", g);
  }, [
    c,
    i,
    s,
    a,
    S,
    f,
    E,
    o
  ]);
}
function Le({ id: r }) {
  const {
    canvasRef: o,
    clamp: s,
    setCurrentZoom: a,
    currentZoom: c,
    setPosition: i,
    position: S
  } = De({
    canvasId: r
  }), { onMouseDown: f, onMouseMove: E, onMouseUp: g } = je(
    (x, L) => i({ x, y: L }),
    S
  ), { onTouchStart: l, onTouchMove: p, onTouchEnd: R } = ze(
    (x, L) => i({ x, y: L }),
    S,
    a,
    c,
    s
  ), C = z(c);
  C.current = c;
  const _ = z(null), O = z(0), P = he((x) => {
    x.preventDefault(), O.current += -x.deltaY * xe, _.current === null && (_.current = requestAnimationFrame(() => {
      _.current = null;
      const L = C.current + O.current;
      a(Math.min(Math.max(L, ve), pe)), O.current = 0;
    }));
  }, [a]);
  return $(() => {
    const x = o.current;
    if (x)
      return x.addEventListener("wheel", P, { passive: !1 }), () => {
        x.removeEventListener("wheel", P), _.current !== null && cancelAnimationFrame(_.current);
      };
  }, [o, P]), $(() => {
    we.getState().setCanvasRef(r, o);
  }, [r]), Fe(r), /* @__PURE__ */ K.jsx(
    "canvas",
    {
      ref: o,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: f,
      onMouseMove: E,
      onMouseUp: g,
      onMouseLeave: g,
      onTouchStart: l,
      onTouchMove: p,
      onTouchEnd: R
    }
  );
}
function Ie({
  id: r,
  image: o,
  cropWidth: s,
  cropHeight: a,
  zoom: c,
  rotation: i,
  brightness: S = 100,
  contrast: f = 100
}) {
  const { initCanvas: E } = ge(r), [g, l] = q(!1);
  return $(() => {
    E({
      image: o,
      zoom: c,
      cropHeight: a,
      cropWidth: s,
      rotation: i,
      brightness: S,
      contrast: f
    }), l(!0);
  }, []), /* @__PURE__ */ K.jsx(K.Fragment, { children: g && /* @__PURE__ */ K.jsx(Le, { id: r }) });
}
const Ne = (r) => {
  const { setSelectedSticker: o } = ee(r);
  return { exportFinalImage: async () => (o(void 0), await new Promise((c) => setTimeout(c, 50)), ye.getState().getFinalImage()) };
};
export {
  Ie as EnhancedImage,
  Ne as useImageExporter,
  ee as useStickers
};
