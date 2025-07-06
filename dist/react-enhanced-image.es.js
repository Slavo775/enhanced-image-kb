import K, { useMemo as ee, useState as W, useRef as z, useEffect as X } from "react";
var q = { exports: {} }, U = {};
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
function he() {
  if (se) return U;
  se = 1;
  var r = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
  function c(o, d, m) {
    var v = null;
    if (m !== void 0 && (v = "" + m), d.key !== void 0 && (v = "" + d.key), "key" in d) {
      m = {};
      for (var u in d)
        u !== "key" && (m[u] = d[u]);
    } else m = d;
    return d = m.ref, {
      $$typeof: r,
      type: o,
      key: v,
      ref: d !== void 0 ? d : null,
      props: m
    };
  }
  return U.Fragment = n, U.jsx = c, U.jsxs = c, U;
}
var $ = {};
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
function me() {
  return ce || (ce = 1, process.env.NODE_ENV !== "production" && function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === s ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case S:
          return "Fragment";
        case I:
          return "Profiler";
        case Y:
          return "StrictMode";
        case a:
          return "Suspense";
        case E:
          return "SuspenseList";
        case y:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case g:
            return "Portal";
          case A:
            return (e.displayName || "Context") + ".Provider";
          case M:
            return (e._context.displayName || "Context") + ".Consumer";
          case P:
            var h = e.render;
            return e = e.displayName, e || (e = h.displayName || h.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case b:
            return h = e.displayName || null, h !== null ? h : r(e.type) || "Memo";
          case f:
            h = e._payload, e = e._init;
            try {
              return r(e(h));
            } catch {
            }
        }
      return null;
    }
    function n(e) {
      return "" + e;
    }
    function c(e) {
      try {
        n(e);
        var h = !1;
      } catch {
        h = !0;
      }
      if (h) {
        h = console;
        var k = h.error, _ = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return k.call(
          h,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          _
        ), n(e);
      }
    }
    function o(e) {
      if (e === S) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === f)
        return "<...>";
      try {
        var h = r(e);
        return h ? "<" + h + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function d() {
      var e = t.A;
      return e === null ? null : e.getOwner();
    }
    function m() {
      return Error("react-stack-top-frame");
    }
    function v(e) {
      if (i.call(e, "key")) {
        var h = Object.getOwnPropertyDescriptor(e, "key").get;
        if (h && h.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function u(e, h) {
      function k() {
        D || (D = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          h
        ));
      }
      k.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: k,
        configurable: !0
      });
    }
    function R() {
      var e = r(this.type);
      return B[e] || (B[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function x(e, h, k, _, N, L, V, G) {
      return k = L.ref, e = {
        $$typeof: p,
        type: e,
        key: h,
        props: L,
        _owner: N
      }, (k !== void 0 ? k : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: R
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
        value: V
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: G
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function T(e, h, k, _, N, L, V, G) {
      var C = h.children;
      if (C !== void 0)
        if (_)
          if (O(C)) {
            for (_ = 0; _ < C.length; _++)
              w(C[_]);
            Object.freeze && Object.freeze(C);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else w(C);
      if (i.call(h, "key")) {
        C = r(e);
        var F = Object.keys(h).filter(function(fe) {
          return fe !== "key";
        });
        _ = 0 < F.length ? "{key: someKey, " + F.join(": ..., ") + ": ...}" : "{key: someKey}", oe[C + _] || (F = 0 < F.length ? "{" + F.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          _,
          C,
          F,
          C
        ), oe[C + _] = !0);
      }
      if (C = null, k !== void 0 && (c(k), C = "" + k), v(h) && (c(h.key), C = "" + h.key), "key" in h) {
        k = {};
        for (var Q in h)
          Q !== "key" && (k[Q] = h[Q]);
      } else k = h;
      return C && u(
        k,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), x(
        e,
        C,
        L,
        N,
        d(),
        k,
        V,
        G
      );
    }
    function w(e) {
      typeof e == "object" && e !== null && e.$$typeof === p && e._store && (e._store.validated = 1);
    }
    var l = K, p = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), Y = Symbol.for("react.strict_mode"), I = Symbol.for("react.profiler"), M = Symbol.for("react.consumer"), A = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), a = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), b = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), y = Symbol.for("react.activity"), s = Symbol.for("react.client.reference"), t = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, i = Object.prototype.hasOwnProperty, O = Array.isArray, j = console.createTask ? console.createTask : function() {
      return null;
    };
    l = {
      "react-stack-bottom-frame": function(e) {
        return e();
      }
    };
    var D, B = {}, H = l["react-stack-bottom-frame"].bind(
      l,
      m
    )(), ne = j(o(m)), oe = {};
    $.Fragment = S, $.jsx = function(e, h, k, _, N) {
      var L = 1e4 > t.recentlyCreatedOwnerStacks++;
      return T(
        e,
        h,
        k,
        !1,
        _,
        N,
        L ? Error("react-stack-top-frame") : H,
        L ? j(o(e)) : ne
      );
    }, $.jsxs = function(e, h, k, _, N) {
      var L = 1e4 > t.recentlyCreatedOwnerStacks++;
      return T(
        e,
        h,
        k,
        !0,
        _,
        N,
        L ? Error("react-stack-top-frame") : H,
        L ? j(o(e)) : ne
      );
    };
  }()), $;
}
var ae;
function ge() {
  return ae || (ae = 1, process.env.NODE_ENV === "production" ? q.exports = he() : q.exports = me()), q.exports;
}
var Z = ge();
const ie = (r) => {
  let n;
  const c = /* @__PURE__ */ new Set(), o = (x, T) => {
    const w = typeof x == "function" ? x(n) : x;
    if (!Object.is(w, n)) {
      const l = n;
      n = T ?? (typeof w != "object" || w === null) ? w : Object.assign({}, n, w), c.forEach((p) => p(n, l));
    }
  }, d = () => n, u = { setState: o, getState: d, getInitialState: () => R, subscribe: (x) => (c.add(x), () => c.delete(x)) }, R = n = r(o, d, u);
  return u;
}, ve = (r) => r ? ie(r) : ie, we = (r) => r;
function Se(r, n = we) {
  const c = K.useSyncExternalStore(
    r.subscribe,
    () => n(r.getState()),
    () => n(r.getInitialState())
  );
  return K.useDebugValue(c), c;
}
const ue = (r) => {
  const n = ve(r), c = (o) => Se(n, o);
  return Object.assign(c, n), c;
}, J = (r) => r ? ue(r) : ue, pe = J((r) => ({
  canvases: {},
  addCanvas: (n, c) => r((o) => o.canvases[c] ? o : {
    canvases: {
      ...o.canvases,
      [c]: n
    }
  }),
  updateCanvas: (n, c) => r((o) => ({
    canvases: {
      ...o.canvases,
      [c]: n
    }
  }))
})), le = (r) => {
  const { canvases: n, updateCanvas: c, addCanvas: o } = pe(), d = ee(() => n[r], [n]);
  return { canvas: d, setZoom: (R) => {
    d && c({ ...d, zoom: R }, r);
  }, setRotation: (R) => {
    d && c({ ...d, rotation: R }, r);
  }, initCanvas: (R) => {
    o(R, r);
  } };
}, be = J((r) => ({
  stickers: void 0,
  selectedSticker: void 0,
  addSticker: (n, c) => r((o) => {
    const d = o.stickers?.[c]?.stickers || [];
    return {
      stickers: {
        ...o.stickers,
        [c]: {
          stickers: [...d, n]
        }
      }
    };
  }),
  updateSticker: (n, c) => r((o) => {
    const m = (o.stickers?.[c]?.stickers || []).map(
      (v) => v.id === n.id ? n : v
    );
    return {
      stickers: {
        ...o.stickers,
        [c]: {
          stickers: m
        }
      }
    };
  }),
  updateAll: (n, c) => r((o) => ({
    stickers: {
      ...o.stickers,
      [c]: {
        stickers: n
      }
    }
  })),
  removeSticker: (n, c) => r((o) => {
    const m = (o.stickers?.[c]?.stickers || []).filter(
      (u) => u.id !== n
    ), v = { ...o.selectedSticker };
    return v?.[c] === n && (v[c] = void 0), {
      stickers: {
        ...o.stickers,
        [c]: {
          stickers: m
        }
      },
      selectedSticker: v
    };
  }),
  setSelectedSticker: (n, c) => r((o) => ({
    selectedSticker: {
      ...o.selectedSticker,
      [n]: c
    }
  }))
})), te = (r) => {
  const {
    stickers: n,
    selectedSticker: c,
    addSticker: o,
    removeSticker: d,
    setSelectedSticker: m,
    updateSticker: v,
    updateAll: u
  } = be(), R = ee(() => n?.[r]?.stickers, [n]), x = ee(
    () => c?.[r],
    [c]
  );
  function T(l) {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(l)))}`;
  }
  return {
    stickers: R,
    selectedSticker: x,
    addSticker: async (l) => {
      let p = "", g = 100, S = 100;
      if (typeof l == "string")
        if (p = l, p.startsWith("data:image/svg+xml")) {
          const I = atob(p.split(",")[1]), A = new DOMParser().parseFromString(I, "image/svg+xml").querySelector("svg"), P = A?.getAttribute("width"), a = A?.getAttribute("height"), E = A?.getAttribute("viewBox");
          if (P && a)
            g = parseFloat(P), S = parseFloat(a);
          else if (E) {
            const [, , b, f] = E.split(" ").map(Number);
            g = b, S = f;
          }
        } else if (l.includes("<svg")) {
          p = T(l);
          const M = new DOMParser().parseFromString(l, "image/svg+xml").querySelector("svg"), A = M?.getAttribute("width"), P = M?.getAttribute("height"), a = M?.getAttribute("viewBox");
          if (A && P)
            g = parseFloat(A), S = parseFloat(P);
          else if (a) {
            const [, , E, b] = a.split(" ").map(Number);
            g = E, S = b;
          }
        } else {
          const I = await Ee(p);
          g = I.width, S = I.height;
        }
      const Y = {
        id: (/* @__PURE__ */ new Date()).toISOString(),
        type: "sticker",
        src: p,
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: g,
        height: S
      };
      o(Y, r);
    },
    removeSticker: (l) => d(l, r),
    setSelectedSticker: (l) => m(r, l),
    updateSticker: (l) => v(l, r),
    updateAllStickers: (l) => u(l, r)
  };
};
function Ee(r) {
  return new Promise((n, c) => {
    const o = new Image();
    o.onload = () => n({ width: o.width, height: o.height }), o.onerror = c, o.src = r;
  });
}
function xe(r, n, c) {
  const {
    stickers: o,
    selectedSticker: d,
    setSelectedSticker: m,
    updateAllStickers: v
  } = te(n), [u, R] = W(null), [x, T] = W(null), [w, l] = W(null), p = z({ x: 0, y: 0 }), g = z({ x: 0, y: 0 }), S = z({
    width: 0,
    height: 0
  }), Y = (a, E) => {
    if (o)
      for (let b = o.length - 1; b >= 0; b--) {
        const f = o[b];
        if (a >= f.x && a <= f.x + f.width && E >= f.y && E <= f.y + f.height)
          return f;
      }
  }, I = (a, E, b, f = 10) => {
    const y = {
      tl: { x: a.x, y: a.y },
      tr: { x: a.x + a.width, y: a.y },
      bl: { x: a.x, y: a.y + a.height },
      br: { x: a.x + a.width, y: a.y + a.height }
    };
    for (const s in y) {
      if (!s) continue;
      const t = y[s].x, i = y[s].y;
      if (Math.abs(E - t) <= f && Math.abs(b - i) <= f)
        return s;
    }
    return null;
  }, M = (a, E) => {
    const b = o?.find((y) => y.id === d);
    if (b) {
      const y = I(b, a, E);
      if (y) {
        T(b.id), l(y), g.current = { x: a, y: E }, S.current = {
          width: b.width,
          height: b.height
        }, c?.(!0);
        return;
      }
    }
    const f = Y(a, E);
    f ? (R(f.id), p.current = { x: a - f.x, y: E - f.y }, c?.(!0), m?.(f.id)) : m?.(void 0);
  }, A = (a, E) => {
    if (x && w) {
      const f = a - g.current.x, y = E - g.current.y, s = o?.map((t) => {
        if (t.id !== x) return t;
        let i = S.current.width, O = S.current.height;
        switch (w) {
          case "tl": {
            const j = S.current.width - f, D = S.current.height - y;
            i = Math.max(j, 10), O = Math.max(D, 10);
            break;
          }
          case "tr": {
            const j = S.current.width + f, D = S.current.height - y;
            i = Math.max(j, 10), O = Math.max(D, 10);
            break;
          }
          case "bl": {
            const j = S.current.width - f, D = S.current.height + y;
            i = Math.max(j, 10), O = Math.max(D, 10);
            break;
          }
          case "br": {
            const j = S.current.width + f, D = S.current.height + y;
            i = Math.max(j, 10), O = Math.max(D, 10);
            break;
          }
        }
        return i = Math.max(10, i), O = Math.max(10, O), {
          ...t,
          width: i,
          height: O
        };
      });
      s && v?.(s);
      return;
    }
    if (!u) return;
    const b = o?.map(
      (f) => f.id === u ? {
        ...f,
        x: a - p.current.x,
        y: E - p.current.y
      } : f
    );
    b && v?.(b);
  }, P = () => {
    R(null), T(null), l(null), c?.(!1);
  };
  X(() => {
    const a = r.current;
    if (!a) return;
    const E = (b) => {
      const f = a.getBoundingClientRect(), y = b.clientX - f.left, s = b.clientY - f.top, t = o?.find((i) => i.id === d);
      if (t) {
        const i = I(t, y, s);
        if (i) {
          const O = {
            tl: "nwse-resize",
            br: "nwse-resize",
            tr: "nesw-resize",
            bl: "nesw-resize"
          };
          a.style.cursor = O[i];
          return;
        }
      }
      a.style.cursor = u || x ? "grabbing" : "default";
    };
    return a.addEventListener("mousemove", E), () => {
      a.removeEventListener("mousemove", E), a.style.cursor = "default";
    };
  }, [r, o, m, u, x]), X(() => {
    const a = r.current;
    if (!a) return;
    const E = (s) => {
      const t = a.getBoundingClientRect();
      M(s.clientX - t.left, s.clientY - t.top);
    }, b = (s) => {
      if (!u && !x) return;
      const t = a.getBoundingClientRect();
      A(s.clientX - t.left, s.clientY - t.top);
    }, f = (s) => {
      if (s.touches.length !== 1) return;
      const t = a.getBoundingClientRect(), i = s.touches[0];
      M(i.clientX - t.left, i.clientY - t.top);
    }, y = (s) => {
      if (s.touches.length !== 1 || !u && !x) return;
      const t = a.getBoundingClientRect(), i = s.touches[0];
      A(i.clientX - t.left, i.clientY - t.top);
    };
    return a.addEventListener("mousedown", E), window.addEventListener("mousemove", b), window.addEventListener("mouseup", P), a.addEventListener("touchstart", f, { passive: !1 }), window.addEventListener("touchmove", y, { passive: !1 }), window.addEventListener("touchend", P), () => {
      a.removeEventListener("mousedown", E), window.removeEventListener("mousemove", b), window.removeEventListener("mouseup", P), a.removeEventListener("touchstart", f), window.removeEventListener("touchmove", y), window.removeEventListener("touchend", P);
    };
  }, [
    r,
    u,
    x,
    w,
    o,
    v,
    c,
    m
  ]);
}
const re = J(() => ({
  canvasRefs: {},
  setCanvasRef: (r, n) => {
    re.getState().canvasRefs[r] = n;
  }
})), de = J(() => {
  const r = { current: null };
  return {
    finalImageRef: r,
    setFinalImage: (n) => {
      r.current = n;
    },
    getFinalImage: () => r.current
  };
});
function Re({ canvasId: r }) {
  const { canvasRefs: n } = re(), c = z(null), [o, d] = W({ x: 0, y: 0 }), [m, v] = W(!1), u = z(null), { stickers: R, selectedSticker: x } = te(r), {
    canvas: { image: T, cropHeight: w, cropWidth: l, rotation: p, zoom: g },
    setZoom: S
  } = le(r), Y = (s, t, i) => Math.min(Math.max(s, t), i), I = (s) => {
    if (!u.current || m) return;
    const t = g / 100, i = u.current.width * t, O = u.current.height * t, j = Math.max(0, (i - l) / 2), D = Math.max(0, (O - w) / 2), B = Y(s.x, -j, j), H = Y(s.y, -D, D);
    d({ x: B, y: H });
  };
  X(() => {
    const s = new Image();
    s.onload = () => {
      u.current = s, y();
    }, s.src = T;
  }, [T, g, o, p, R, x]);
  const M = (s, t, i) => {
    s.save(), s.fillStyle = "#007bff", s.strokeStyle = "#fff", s.lineWidth = 2, s.beginPath(), s.rect(t - 10 / 2, i - 10 / 2, 10, 10), s.fill(), s.stroke(), s.restore();
  }, A = z({}), P = () => {
    const s = c.current ?? n[r].current, t = s?.getContext("2d");
    if (!s || !t || !u.current) return;
    s.width = l, s.height = w, t.clearRect(0, 0, l, w), t.save();
    const i = g / 100;
    return t.translate(o.x + l / 2, o.y + w / 2), t.rotate(p * Math.PI / 180), t.scale(i, i), t.drawImage(
      u.current,
      -u.current.width / 2,
      -u.current.height / 2
    ), t.restore(), t;
  }, a = (s, t) => {
    let i = A.current[t.src];
    if (!i) {
      i = new Image(), i.src = t.src, A.current[t.src] = i, i.onload = () => y();
      return;
    }
    i.complete && s.drawImage(
      i,
      t.x,
      t.y,
      t.width,
      t.height
    );
  }, E = (s, t) => {
    s.font = `${t.height}px sans-serif`, s.textAlign = "left", s.textBaseline = "top", s.fillText(t.src, t.x, t.y);
  }, b = (s, t) => {
    s.strokeStyle = "#007bff", s.lineWidth = 2, s.strokeRect(t.x, t.y, t.width, t.height), M(s, t.x, t.y), M(s, t.x + t.width, t.y), M(s, t.x, t.y + t.height), M(
      s,
      t.x + t.width,
      t.y + t.height
    );
  }, f = (s) => {
    const t = s.toDataURL();
    return de.getState().setFinalImage({ dataUrl: t, metaData: { stickers: R ?? [] } }), { dataUrl: t, metaData: { stickers: R } };
  }, y = () => {
    const s = c ?? n[r], t = P();
    if (!(!t || !s.current))
      return R?.forEach((i) => {
        i.src.startsWith("data:image") || i.src.startsWith("http") ? a(t, i) : E(t, i), i.id === x && b(t, i);
      }), f(s.current);
  };
  return xe(
    c ?? n[r],
    r,
    v
  ), {
    canvasRef: c,
    clamp: Y,
    setCurrentZoom: S,
    currentZoom: g,
    setPosition: I,
    position: o,
    drawCanvas: y
  };
}
function ye(r, n) {
  const c = z(!1), o = z({ x: 0, y: 0 });
  return {
    onMouseDown: (u) => {
      c.current = !0, o.current = {
        x: u.clientX - n.x,
        y: u.clientY - n.y
      };
    },
    onMouseMove: (u) => {
      c.current && r(
        u.clientX - o.current.x,
        u.clientY - o.current.y
      );
    },
    onMouseUp: () => {
      c.current = !1;
    }
  };
}
function ke(r, n, c, o, d) {
  const m = z(!1), v = z({ x: 0, y: 0 }), u = z(null);
  return {
    onTouchStart: (w) => {
      if (w.touches.length === 1) {
        const l = w.touches[0];
        m.current = !0, v.current = {
          x: l.clientX - n.x,
          y: l.clientY - n.y
        };
      } else if (w.touches.length === 2) {
        const [l, p] = Array.from(w.touches), g = Math.hypot(p.clientX - l.clientX, p.clientY - l.clientY);
        u.current = g;
      }
    },
    onTouchMove: (w) => {
      if (w.preventDefault(), w.touches.length === 1 && m.current) {
        const l = w.touches[0];
        r(
          l.clientX - v.current.x,
          l.clientY - v.current.y
        );
      } else if (w.touches.length === 2) {
        const [l, p] = Array.from(w.touches), g = Math.hypot(p.clientX - l.clientX, p.clientY - l.clientY);
        if (u.current != null) {
          const Y = (g - u.current) * 0.3;
          c(d(o + Y, 10, 500));
        }
        u.current = g;
      }
    },
    onTouchEnd: () => {
      m.current = !1, u.current = null;
    }
  };
}
function Te({ id: r }) {
  const {
    canvasRef: n,
    clamp: c,
    setCurrentZoom: o,
    currentZoom: d,
    setPosition: m,
    position: v
  } = Re({
    canvasId: r
  }), { onMouseDown: u, onMouseMove: R, onMouseUp: x } = ye(
    (g, S) => m({ x: g, y: S }),
    v
  ), { onTouchStart: T, onTouchMove: w, onTouchEnd: l } = ke(
    (g, S) => m({ x: g, y: S }),
    v,
    o,
    d,
    c
  ), p = (g) => {
    g.preventDefault();
    const Y = -g.deltaY * 0.1;
    o(d + Y);
  };
  return X(() => {
    const g = n.current;
    if (g)
      return g.addEventListener("wheel", p, { passive: !1 }), () => {
        g.removeEventListener("wheel", p);
      };
  }, [n, d]), X(() => {
    re.getState().setCanvasRef(r, n);
  }, [r]), /* @__PURE__ */ Z.jsx(
    "canvas",
    {
      ref: n,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: u,
      onMouseMove: R,
      onMouseUp: x,
      onMouseLeave: x,
      onTouchStart: T,
      onTouchMove: w,
      onTouchEnd: l
    }
  );
}
function Ce({
  id: r,
  image: n,
  cropWidth: c,
  cropHeight: o,
  zoom: d,
  rotation: m
}) {
  const { initCanvas: v } = le(r), [u, R] = W(!1);
  return X(() => {
    v({
      image: n,
      zoom: d,
      cropHeight: o,
      cropWidth: c,
      rotation: m
    }), R(!0);
  }, []), /* @__PURE__ */ Z.jsx(Z.Fragment, { children: u && /* @__PURE__ */ Z.jsx(Te, { id: r }) });
}
const Me = (r) => {
  const { setSelectedSticker: n } = te(r);
  return { exportFinalImage: async () => (n(void 0), await new Promise((d) => setTimeout(d, 50)), de.getState().getFinalImage()) };
};
export {
  Ce as EnhancedImage,
  Me as useImageExporter,
  te as useStickers
};
