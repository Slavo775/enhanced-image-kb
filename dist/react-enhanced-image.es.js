import ve, { useMemo as oe, useRef as z, useState as q, useEffect as $, useCallback as le } from "react";
import { create as Q, createStore as pe, useStore as we } from "zustand";
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
var se;
function ye() {
  if (se) return Z;
  se = 1;
  var n = Symbol.for("react.transitional.element"), a = Symbol.for("react.fragment");
  function s(o, c, i) {
    var S = null;
    if (i !== void 0 && (S = "" + i), c.key !== void 0 && (S = "" + c.key), "key" in c) {
      i = {};
      for (var h in c)
        h !== "key" && (i[h] = c[h]);
    } else i = c;
    return c = i.ref, {
      $$typeof: n,
      type: o,
      key: S,
      ref: c !== void 0 ? c : null,
      props: i
    };
  }
  return Z.Fragment = a, Z.jsx = s, Z.jsxs = s, Z;
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
var ae;
function be() {
  return ae || (ae = 1, process.env.NODE_ENV !== "production" && function() {
    function n(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === f ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case O:
          return "Fragment";
        case C:
          return "Profiler";
        case P:
          return "StrictMode";
        case W:
          return "Suspense";
        case X:
          return "SuspenseList";
        case g:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case x:
            return "Portal";
          case U:
            return (e.displayName || "Context") + ".Provider";
          case L:
            return (e._context.displayName || "Context") + ".Consumer";
          case I:
            var l = e.render;
            return e = e.displayName, e || (e = l.displayName || l.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case m:
            return l = e.displayName || null, l !== null ? l : n(e.type) || "Memo";
          case u:
            l = e._payload, e = e._init;
            try {
              return n(e(l));
            } catch {
            }
        }
      return null;
    }
    function a(e) {
      return "" + e;
    }
    function s(e) {
      try {
        a(e);
        var l = !1;
      } catch {
        l = !0;
      }
      if (l) {
        l = console;
        var w = l.error, R = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return w.call(
          l,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          R
        ), a(e);
      }
    }
    function o(e) {
      if (e === O) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === u)
        return "<...>";
      try {
        var l = n(e);
        return l ? "<" + l + ">" : "<...>";
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
        var l = Object.getOwnPropertyDescriptor(e, "key").get;
        if (l && l.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function h(e, l) {
      function w() {
        A || (A = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          l
        ));
      }
      w.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: w,
        configurable: !0
      });
    }
    function E() {
      var e = n(this.type);
      return j[e] || (j[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function v(e, l, w, R, Y, N, te, re) {
      return w = N.ref, e = {
        $$typeof: _,
        type: e,
        key: l,
        props: N,
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
    function d(e, l, w, R, Y, N, te, re) {
      var F = l.children;
      if (F !== void 0)
        if (R)
          if (y(F)) {
            for (R = 0; R < F.length; R++)
              p(F[R]);
            Object.freeze && Object.freeze(F);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else p(F);
      if (k.call(l, "key")) {
        F = n(e);
        var B = Object.keys(l).filter(function(ge) {
          return ge !== "key";
        });
        R = 0 < B.length ? "{key: someKey, " + B.join(": ..., ") + ": ...}" : "{key: someKey}", t[F + R] || (B = 0 < B.length ? "{" + B.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          R,
          F,
          B,
          F
        ), t[F + R] = !0);
      }
      if (F = null, w !== void 0 && (s(w), F = "" + w), S(l) && (s(l.key), F = "" + l.key), "key" in l) {
        w = {};
        for (var ne in l)
          ne !== "key" && (w[ne] = l[ne]);
      } else w = l;
      return F && h(
        w,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), v(
        e,
        F,
        N,
        Y,
        c(),
        w,
        te,
        re
      );
    }
    function p(e) {
      typeof e == "object" && e !== null && e.$$typeof === _ && e._store && (e._store.validated = 1);
    }
    var T = ve, _ = Symbol.for("react.transitional.element"), x = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), P = Symbol.for("react.strict_mode"), C = Symbol.for("react.profiler"), L = Symbol.for("react.consumer"), U = Symbol.for("react.context"), I = Symbol.for("react.forward_ref"), W = Symbol.for("react.suspense"), X = Symbol.for("react.suspense_list"), m = Symbol.for("react.memo"), u = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), f = Symbol.for("react.client.reference"), b = T.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, k = Object.prototype.hasOwnProperty, y = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    T = {
      "react-stack-bottom-frame": function(e) {
        return e();
      }
    };
    var A, j = {}, D = T["react-stack-bottom-frame"].bind(
      T,
      i
    )(), r = M(o(i)), t = {};
    V.Fragment = O, V.jsx = function(e, l, w, R, Y) {
      var N = 1e4 > b.recentlyCreatedOwnerStacks++;
      return d(
        e,
        l,
        w,
        !1,
        R,
        Y,
        N ? Error("react-stack-top-frame") : D,
        N ? M(o(e)) : r
      );
    }, V.jsxs = function(e, l, w, R, Y) {
      var N = 1e4 > b.recentlyCreatedOwnerStacks++;
      return d(
        e,
        l,
        w,
        !0,
        R,
        Y,
        N ? Error("react-stack-top-frame") : D,
        N ? M(o(e)) : r
      );
    };
  }()), V;
}
var ce;
function ke() {
  return ce || (ce = 1, process.env.NODE_ENV === "production" ? G.exports = ye() : G.exports = be()), G.exports;
}
var K = ke();
const Ee = Q((n) => ({
  canvases: {},
  addCanvas: (a, s) => n((o) => o.canvases[s] ? o : {
    canvases: {
      ...o.canvases,
      [s]: a
    }
  }),
  updateCanvas: (a, s) => n((o) => ({
    canvases: {
      ...o.canvases,
      [s]: a
    }
  }))
})), de = (n) => {
  const { canvases: a, updateCanvas: s, addCanvas: o } = Ee(), c = oe(() => a[n], [a]);
  return { canvas: c, setZoom: (d) => {
    c && s({ ...c, zoom: d }, n);
  }, setRotation: (d) => {
    c && s({ ...c, rotation: d }, n);
  }, setBrightness: (d) => {
    c && s({ ...c, brightness: d }, n);
  }, setContrast: (d) => {
    c && s({ ...c, contrast: d }, n);
  }, initCanvas: (d) => {
    o(d, n);
  } };
}, fe = 10, he = 500, Re = 0.1, Te = 0.3, Me = 10;
var ie = (n, a, s) => (c, i) => ({
  pastStates: s?.pastStates || [],
  futureStates: s?.futureStates || [],
  undo: (S = 1) => {
    if (i().pastStates.length) {
      const h = s?.partialize?.(a()) || a(), E = i().pastStates.splice(-S, S), v = E.shift();
      n(v), c({
        pastStates: i().pastStates,
        futureStates: i().futureStates.concat(
          s?.diff?.(h, v) || h,
          E.reverse()
        )
      });
    }
  },
  redo: (S = 1) => {
    if (i().futureStates.length) {
      const h = s?.partialize?.(a()) || a(), E = i().futureStates.splice(-S, S), v = E.shift();
      n(v), c({
        pastStates: i().pastStates.concat(
          s?.diff?.(h, v) || h,
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
  _handleSet: (S, h, E, v) => {
    s?.limit && i().pastStates.length >= s?.limit && i().pastStates.shift(), i()._onSave?.(S, E), c({
      pastStates: i().pastStates.concat(v || S),
      futureStates: []
    });
  }
}), Ce = (n, a) => (o, c, i) => {
  i.temporal = pe(
    a?.wrapTemporal?.(ie(o, c, a)) || ie(o, c, a)
  );
  const S = a?.handleSet?.(
    i.temporal.getState()._handleSet
  ) || i.temporal.getState()._handleSet, h = (v) => {
    if (!i.temporal.getState().isTracking) return;
    const d = a?.partialize?.(c()) || c(), p = a?.diff?.(v, d);
    // If the user has provided a diff function but nothing has been changed, deltaState will be null
    p === null || // If the user has provided an equality function, use it
    a?.equality?.(v, d) || S(
      v,
      void 0,
      d,
      p
    );
  }, E = i.setState;
  return i.setState = (...v) => {
    const d = a?.partialize?.(c()) || c();
    E(...v), h(d);
  }, n(
    // Modify the set function to call the userlandSet function
    (...v) => {
      const d = a?.partialize?.(c()) || c();
      o(...v), h(d);
    },
    c,
    i
  );
};
const H = Q()(
  Ce(
    (n) => ({
      stickers: void 0,
      selectedSticker: void 0,
      addSticker: (a, s) => n((o) => {
        const c = o.stickers?.[s]?.stickers || [];
        return {
          stickers: {
            ...o.stickers,
            [s]: {
              stickers: [...c, a]
            }
          }
        };
      }),
      updateSticker: (a, s) => n((o) => {
        const i = (o.stickers?.[s]?.stickers || []).map(
          (S) => S.id === a.id ? a : S
        );
        return {
          stickers: {
            ...o.stickers,
            [s]: {
              stickers: i
            }
          }
        };
      }),
      updateAll: (a, s) => n((o) => ({
        stickers: {
          ...o.stickers,
          [s]: {
            stickers: a
          }
        }
      })),
      removeSticker: (a, s) => n((o) => {
        const i = (o.stickers?.[s]?.stickers || []).filter(
          (h) => h.id !== a
        ), S = { ...o.selectedSticker };
        return S?.[s] === a && (S[s] = void 0), {
          stickers: {
            ...o.stickers,
            [s]: {
              stickers: i
            }
          },
          selectedSticker: S
        };
      }),
      setSelectedSticker: (a, s) => n((o) => ({
        selectedSticker: {
          ...o.selectedSticker,
          [a]: s
        }
      }))
    }),
    {
      // Track only stickers — selection changes don't pollute undo history
      partialize: (n) => ({ stickers: n.stickers }),
      limit: 50
    }
  )
), ue = (n) => we(H.temporal, n);
let J = null;
const ee = (n) => {
  const {
    stickers: a,
    selectedSticker: s,
    addSticker: o,
    removeSticker: c,
    setSelectedSticker: i,
    updateSticker: S,
    updateAll: h
  } = H(), E = ue((u) => u.pastStates.length > 0), v = ue((u) => u.futureStates.length > 0), d = () => H.temporal.getState().undo(), p = () => H.temporal.getState().redo(), T = () => H.temporal.getState().pause(), _ = () => H.temporal.getState().resume(), x = z(void 0), O = oe(() => a?.[n]?.stickers, [a]), P = oe(
    () => s?.[n],
    [s]
  );
  x.current = P;
  function C(u) {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(u)))}`;
  }
  return {
    stickers: O,
    selectedSticker: P,
    selectedStickerRef: x,
    addSticker: async (u) => {
      let g = "", f = 100, b = 100;
      if (typeof u == "string")
        if (g = u, g.startsWith("data:image/svg+xml"))
          try {
            const y = atob(g.split(",")[1]), A = new DOMParser().parseFromString(y, "image/svg+xml").querySelector("svg"), j = A?.getAttribute("width"), D = A?.getAttribute("height"), r = A?.getAttribute("viewBox");
            if (j && D)
              f = parseFloat(j), b = parseFloat(D);
            else if (r) {
              const [, , t, e] = r.split(" ").map(Number);
              f = t, b = e;
            }
          } catch (y) {
            console.error("[useStickers] Failed to parse base64 SVG:", y);
          }
        else if (u.includes("<svg"))
          try {
            g = C(u);
            const M = new DOMParser().parseFromString(u, "image/svg+xml").querySelector("svg"), A = M?.getAttribute("width"), j = M?.getAttribute("height"), D = M?.getAttribute("viewBox");
            if (A && j)
              f = parseFloat(A), b = parseFloat(j);
            else if (D) {
              const [, , r, t] = D.split(" ").map(Number);
              f = r, b = t;
            }
          } catch (y) {
            console.error("[useStickers] Failed to parse SVG string:", y);
          }
        else {
          const y = await _e(g);
          f = y.width, b = y.height;
        }
      const k = {
        id: (/* @__PURE__ */ new Date()).toISOString(),
        type: "sticker",
        src: g,
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: f,
        height: b
      };
      o(k, n);
    },
    addMentionSticker: (u) => {
      if (!u.trim()) return;
      const g = `@${u.trim()}`, f = 20, b = f + 18, k = g.length * f * 0.58 + 28;
      o(
        {
          id: (/* @__PURE__ */ new Date()).toISOString(),
          type: "mention",
          src: u.trim(),
          x: Math.random() * 200,
          y: Math.random() * 200,
          width: k,
          height: b
        },
        n
      );
    },
    addLocationSticker: (u) => {
      if (!u.trim()) return;
      const g = 18, f = g + 18, b = f * 0.18, k = f / 2, y = u.trim().length * g * 0.55 + k * 2 + b * 4 + 8;
      o(
        {
          id: (/* @__PURE__ */ new Date()).toISOString(),
          type: "location",
          src: u.trim(),
          x: Math.random() * 200,
          y: Math.random() * 200,
          width: y,
          height: f
        },
        n
      );
    },
    removeSticker: (u) => c(u, n),
    setSelectedSticker: (u) => i(n, u),
    updateSticker: (u) => S(u, n),
    updateAllStickers: (u) => h(u, n),
    undo: d,
    redo: p,
    canUndo: E,
    canRedo: v,
    pauseHistory: T,
    resumeHistory: _,
    copySelectedSticker: () => {
      const u = x.current;
      if (!u) return;
      const g = O?.find((f) => f.id === u);
      g && (J = g);
    },
    pasteSticker: () => {
      J && o(
        {
          ...J,
          id: (/* @__PURE__ */ new Date()).toISOString(),
          x: J.x + 15,
          y: J.y + 15
        },
        n
      );
    },
    duplicateSelectedSticker: () => {
      const u = x.current;
      if (!u) return;
      const g = O?.find((f) => f.id === u);
      g && o(
        { ...g, id: (/* @__PURE__ */ new Date()).toISOString(), x: g.x + 15, y: g.y + 15 },
        n
      );
    }
  };
};
function _e(n) {
  return new Promise((a, s) => {
    const o = new Image();
    o.onload = () => a({ width: o.width, height: o.height }), o.onerror = s, o.src = n;
  });
}
function xe(n, a, s) {
  const {
    stickers: o,
    selectedSticker: c,
    setSelectedSticker: i,
    updateAllStickers: S,
    pauseHistory: h,
    resumeHistory: E
  } = ee(a), [v, d] = q(null), [p, T] = q(null), [_, x] = q(null), O = z({ x: 0, y: 0 }), P = z({ x: 0, y: 0 }), C = z({
    width: 0,
    height: 0
  }), L = (m, u) => {
    if (o)
      for (let g = o.length - 1; g >= 0; g--) {
        const f = o[g];
        if (m >= f.x && m <= f.x + f.width && u >= f.y && u <= f.y + f.height)
          return f;
      }
  }, U = (m, u, g, f = 10) => {
    const b = {
      tl: { x: m.x, y: m.y },
      tr: { x: m.x + m.width, y: m.y },
      bl: { x: m.x, y: m.y + m.height },
      br: { x: m.x + m.width, y: m.y + m.height }
    };
    for (const k in b) {
      if (!k) continue;
      const y = b[k].x, M = b[k].y;
      if (Math.abs(u - y) <= f && Math.abs(g - M) <= f)
        return k;
    }
    return null;
  }, I = (m, u) => {
    h();
    const g = o?.find((b) => b.id === c);
    if (g) {
      const b = U(g, m, u);
      if (b) {
        T(g.id), x(b), P.current = { x: m, y: u }, C.current = {
          width: g.width,
          height: g.height
        }, s?.(!0);
        return;
      }
    }
    const f = L(m, u);
    f ? (d(f.id), O.current = { x: m - f.x, y: u - f.y }, s?.(!0), i?.(f.id)) : i?.(void 0);
  }, W = (m, u) => {
    if (p && _) {
      const f = m - P.current.x, b = u - P.current.y, k = o?.map((y) => {
        if (y.id !== p) return y;
        let M = C.current.width, A = C.current.height;
        switch (_) {
          case "tl": {
            const j = C.current.width - f, D = C.current.height - b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "tr": {
            const j = C.current.width + f, D = C.current.height - b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "bl": {
            const j = C.current.width - f, D = C.current.height + b;
            M = Math.max(j, 10), A = Math.max(D, 10);
            break;
          }
          case "br": {
            const j = C.current.width + f, D = C.current.height + b;
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
    if (!v) return;
    const g = o?.map(
      (f) => f.id === v ? {
        ...f,
        x: m - O.current.x,
        y: u - O.current.y
      } : f
    );
    g && S?.(g);
  }, X = () => {
    E(), d(null), T(null), x(null), s?.(!1);
  };
  $(() => {
    const m = n.current;
    if (!m) return;
    const u = (g) => {
      const f = m.getBoundingClientRect(), b = g.clientX - f.left, k = g.clientY - f.top, y = o?.find((M) => M.id === c);
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
      m.style.cursor = v || p ? "grabbing" : "default";
    };
    return m.addEventListener("mousemove", u), () => {
      m.removeEventListener("mousemove", u), m.style.cursor = "default";
    };
  }, [n, o, i, v, p]), $(() => {
    const m = n.current;
    if (!m) return;
    const u = (k) => {
      const y = m.getBoundingClientRect();
      I(k.clientX - y.left, k.clientY - y.top);
    }, g = (k) => {
      if (!v && !p) return;
      const y = m.getBoundingClientRect();
      W(k.clientX - y.left, k.clientY - y.top);
    }, f = (k) => {
      if (k.touches.length !== 1) return;
      const y = m.getBoundingClientRect(), M = k.touches[0];
      I(M.clientX - y.left, M.clientY - y.top);
    }, b = (k) => {
      if (k.touches.length !== 1 || !v && !p) return;
      const y = m.getBoundingClientRect(), M = k.touches[0];
      W(M.clientX - y.left, M.clientY - y.top);
    };
    return m.addEventListener("mousedown", u), window.addEventListener("mousemove", g), window.addEventListener("mouseup", X), m.addEventListener("touchstart", f, { passive: !1 }), window.addEventListener("touchmove", b, { passive: !1 }), window.addEventListener("touchend", X), () => {
      m.removeEventListener("mousedown", u), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", X), m.removeEventListener("touchstart", f), window.removeEventListener("touchmove", b), window.removeEventListener("touchend", X);
    };
  }, [
    n,
    v,
    p,
    _,
    o,
    S,
    s,
    i
  ]);
}
const me = Q((n) => ({
  canvasRefs: {},
  setCanvasRef: (a, s) => n((o) => ({
    canvasRefs: { ...o.canvasRefs, [a]: s }
  }))
})), Se = Q(() => {
  const n = { current: null };
  return {
    finalImageRef: n,
    setFinalImage: (a) => {
      n.current = a;
    },
    getFinalImage: () => n.current
  };
});
function Ae({ canvasId: n }) {
  const { canvasRefs: a } = me(), s = z(null), [o, c] = q({ x: 0, y: 0 }), [i, S] = q(!1), h = z(null), E = z(null), v = z(null), { stickers: d, selectedSticker: p } = ee(n), {
    canvas: { image: T, cropHeight: _, cropWidth: x, rotation: O, zoom: P, brightness: C, contrast: L },
    setZoom: U
  } = de(n), I = le(() => {
    E.current !== null && cancelAnimationFrame(E.current), E.current = requestAnimationFrame(() => {
      E.current = null, v.current?.();
    });
  }, []), W = (r, t, e) => Math.min(Math.max(r, t), e), X = (r) => {
    if (!h.current || i) return;
    const t = P / 100, e = h.current.width * t, l = h.current.height * t, w = Math.max(0, (e - x) / 2), R = Math.max(0, (l - _) / 2), Y = W(r.x, -w, w), N = W(r.y, -R, R);
    c({ x: Y, y: N });
  };
  $(() => {
    if (!T) return;
    const r = new Image();
    return r.onload = () => {
      h.current = r, I();
    }, r.onerror = () => {
      console.error("[useCanvasCrop] Failed to load image:", T.slice(0, 80));
    }, r.src = T, () => {
      r.onload = null, r.onerror = null;
    };
  }, [T]), $(() => (I(), () => {
    E.current !== null && (cancelAnimationFrame(E.current), E.current = null);
  }), [P, o, O, d, p, C, L]);
  const m = (r, t, e) => {
    const l = Me;
    r.save(), r.fillStyle = "#007bff", r.strokeStyle = "#fff", r.lineWidth = 2, r.beginPath(), r.rect(t - l / 2, e - l / 2, l, l), r.fill(), r.stroke(), r.restore();
  }, u = z({}), g = () => {
    const r = s.current ?? a[n].current, t = r?.getContext("2d");
    if (!r || !t || !h.current) return;
    r.width = x, r.height = _, t.clearRect(0, 0, x, _), t.save();
    const e = P / 100;
    return t.translate(o.x + x / 2, o.y + _ / 2), t.rotate(O * Math.PI / 180), t.scale(e, e), t.filter = `brightness(${(C ?? 100) / 100}) contrast(${(L ?? 100) / 100})`, t.drawImage(
      h.current,
      -h.current.width / 2,
      -h.current.height / 2
    ), t.filter = "none", t.restore(), t;
  }, f = (r, t) => {
    let e = u.current[t.src];
    if (!e) {
      e = new Image(), e.src = t.src, u.current[t.src] = e, e.onload = () => I();
      return;
    }
    e.complete && r.drawImage(
      e,
      t.x,
      t.y,
      t.width,
      t.height
    );
  }, b = (r, t) => {
    r.font = `${t.height}px sans-serif`, r.textAlign = "left", r.textBaseline = "top", r.fillText(t.src, t.x, t.y);
  }, k = (r, t, e, l, w, R) => {
    r.beginPath(), r.moveTo(t + R, e), r.lineTo(t + l - R, e), r.quadraticCurveTo(t + l, e, t + l, e + R), r.lineTo(t + l, e + w - R), r.quadraticCurveTo(t + l, e + w, t + l - R, e + w), r.lineTo(t + R, e + w), r.quadraticCurveTo(t, e + w, t, e + w - R), r.lineTo(t, e + R), r.quadraticCurveTo(t, e, t + R, e), r.closePath();
  }, y = (r, t) => {
    const e = `@${t.src}`, l = Math.round(t.height * 0.52), w = t.height / 2;
    r.save(), r.fillStyle = "rgba(0,0,0,0.65)", k(r, t.x, t.y, t.width, t.height, w), r.fill(), r.fillStyle = "#ffffff", r.font = `bold ${l}px sans-serif`, r.textAlign = "center", r.textBaseline = "middle", r.fillText(e, t.x + t.width / 2, t.y + t.height / 2), r.restore();
  }, M = (r, t) => {
    const e = Math.round(t.height * 0.48), l = t.height / 2, w = t.height * 0.18, R = t.x + l, Y = t.y + t.height / 2;
    r.save(), r.fillStyle = "rgba(0,0,0,0.65)", k(r, t.x, t.y, t.width, t.height, l), r.fill(), r.fillStyle = "#ff4444", r.beginPath(), r.arc(R, Y, w, 0, Math.PI * 2), r.fill(), r.fillStyle = "#ffffff", r.font = `bold ${e}px sans-serif`, r.textAlign = "left", r.textBaseline = "middle", r.fillText(t.src, R + w * 2, Y), r.restore();
  }, A = (r, t) => {
    r.strokeStyle = "#007bff", r.lineWidth = 2, r.strokeRect(t.x, t.y, t.width, t.height), m(r, t.x, t.y), m(r, t.x + t.width, t.y), m(r, t.x, t.y + t.height), m(
      r,
      t.x + t.width,
      t.y + t.height
    );
  }, j = (r) => {
    const t = r.toDataURL();
    return Se.getState().setFinalImage({ dataUrl: t, metaData: { stickers: d ?? [] } }), { dataUrl: t, metaData: { stickers: d } };
  }, D = () => {
    const r = s ?? a[n], t = g();
    if (!(!t || !r.current))
      return d?.forEach((e) => {
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
            f(t, e);
        }
        e.id === p && A(t, e);
      }), j(r.current);
  };
  return v.current = D, xe(
    s ?? a[n],
    n,
    S
  ), {
    canvasRef: s,
    clamp: W,
    setCurrentZoom: U,
    currentZoom: P,
    setPosition: X,
    position: o,
    drawCanvas: D
  };
}
function Oe(n, a) {
  const s = z(!1), o = z({ x: 0, y: 0 });
  return {
    onMouseDown: (h) => {
      s.current = !0, o.current = {
        x: h.clientX - a.x,
        y: h.clientY - a.y
      };
    },
    onMouseMove: (h) => {
      s.current && n(
        h.clientX - o.current.x,
        h.clientY - o.current.y
      );
    },
    onMouseUp: () => {
      s.current = !1;
    }
  };
}
function Pe(n, a, s, o, c) {
  const i = z(!1), S = z({ x: 0, y: 0 }), h = z(null);
  return {
    onTouchStart: (p) => {
      if (p.touches.length === 1) {
        const T = p.touches[0];
        i.current = !0, S.current = {
          x: T.clientX - a.x,
          y: T.clientY - a.y
        };
      } else if (p.touches.length === 2) {
        const [T, _] = Array.from(p.touches), x = Math.hypot(_.clientX - T.clientX, _.clientY - T.clientY);
        h.current = x;
      }
    },
    onTouchMove: (p) => {
      if (p.preventDefault(), p.touches.length === 1 && i.current) {
        const T = p.touches[0];
        n(
          T.clientX - S.current.x,
          T.clientY - S.current.y
        );
      } else if (p.touches.length === 2) {
        const [T, _] = Array.from(p.touches), x = Math.hypot(_.clientX - T.clientX, _.clientY - T.clientY);
        if (h.current != null) {
          const P = (x - h.current) * Te;
          s(c(o + P, fe, he));
        }
        h.current = x;
      }
    },
    onTouchEnd: () => {
      i.current = !1, h.current = null;
    }
  };
}
function De(n) {
  const {
    selectedStickerRef: a,
    removeSticker: s,
    setSelectedSticker: o,
    undo: c,
    redo: i,
    copySelectedSticker: S,
    pasteSticker: h,
    duplicateSelectedSticker: E
  } = ee(n);
  $(() => {
    const v = (d) => {
      const p = d.metaKey || d.ctrlKey, T = d.target.tagName;
      if (!(T === "INPUT" || T === "TEXTAREA")) {
        if (p && d.key === "z" && !d.shiftKey) {
          d.preventDefault(), c();
          return;
        }
        if (p && d.key === "z" && d.shiftKey || p && d.key === "y") {
          d.preventDefault(), i();
          return;
        }
        if (p && d.key === "c") {
          S();
          return;
        }
        if (p && d.key === "v") {
          h();
          return;
        }
        if (p && d.key === "d") {
          d.preventDefault(), E();
          return;
        }
        if (d.key === "Delete" || d.key === "Backspace") {
          const _ = a.current;
          _ && (d.preventDefault(), s(_));
          return;
        }
        if (d.key === "Escape") {
          o(void 0);
          return;
        }
      }
    };
    return window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v);
  }, [
    c,
    i,
    s,
    o,
    S,
    h,
    E,
    a
  ]);
}
function je({ id: n }) {
  const {
    canvasRef: a,
    clamp: s,
    setCurrentZoom: o,
    currentZoom: c,
    setPosition: i,
    position: S
  } = Ae({
    canvasId: n
  }), { onMouseDown: h, onMouseMove: E, onMouseUp: v } = Oe(
    (C, L) => i({ x: C, y: L }),
    S
  ), { onTouchStart: d, onTouchMove: p, onTouchEnd: T } = Pe(
    (C, L) => i({ x: C, y: L }),
    S,
    o,
    c,
    s
  ), _ = z(c);
  _.current = c;
  const x = z(null), O = z(0), P = le((C) => {
    C.preventDefault(), O.current += -C.deltaY * Re, x.current === null && (x.current = requestAnimationFrame(() => {
      x.current = null;
      const L = _.current + O.current;
      o(Math.min(Math.max(L, fe), he)), O.current = 0;
    }));
  }, [o]);
  return $(() => {
    const C = a.current;
    if (C)
      return C.addEventListener("wheel", P, { passive: !1 }), () => {
        C.removeEventListener("wheel", P), x.current !== null && cancelAnimationFrame(x.current);
      };
  }, [a, P]), $(() => {
    me.getState().setCanvasRef(n, a);
  }, [n]), De(n), /* @__PURE__ */ K.jsx(
    "canvas",
    {
      ref: a,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: h,
      onMouseMove: E,
      onMouseUp: v,
      onMouseLeave: v,
      onTouchStart: d,
      onTouchMove: p,
      onTouchEnd: T
    }
  );
}
function Le({
  id: n,
  image: a,
  cropWidth: s,
  cropHeight: o,
  zoom: c,
  rotation: i,
  brightness: S = 100,
  contrast: h = 100
}) {
  const { initCanvas: E } = de(n), [v, d] = q(!1);
  return $(() => {
    E({
      image: a,
      zoom: c,
      cropHeight: o,
      cropWidth: s,
      rotation: i,
      brightness: S,
      contrast: h
    }), d(!0);
  }, []), /* @__PURE__ */ K.jsx(K.Fragment, { children: v && /* @__PURE__ */ K.jsx(je, { id: n }) });
}
const Ye = (n) => {
  const { setSelectedSticker: a } = ee(n);
  return { exportFinalImage: async () => (a(void 0), await new Promise((c) => setTimeout(c, 50)), Se.getState().getFinalImage()) };
};
export {
  Le as EnhancedImage,
  Ye as useImageExporter,
  ee as useStickers
};
