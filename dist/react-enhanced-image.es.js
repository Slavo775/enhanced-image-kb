import K, { useMemo as ee, useState as F, useRef as j, useEffect as X } from "react";
var Z = { exports: {} }, U = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oe;
function fe() {
  if (oe) return U;
  oe = 1;
  var r = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function c(s, d, m) {
    var g = null;
    if (m !== void 0 && (g = "" + m), d.key !== void 0 && (g = "" + d.key), "key" in d) {
      m = {};
      for (var i in d)
        i !== "key" && (m[i] = d[i]);
    } else m = d;
    return d = m.ref, {
      $$typeof: r,
      type: s,
      key: g,
      ref: d !== void 0 ? d : null,
      props: m
    };
  }
  return U.Fragment = o, U.jsx = c, U.jsxs = c, U;
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
var se;
function he() {
  return se || (se = 1, process.env.NODE_ENV !== "production" && function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === n ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case R:
          return "Fragment";
        case I:
          return "Profiler";
        case O:
          return "StrictMode";
        case u:
          return "Suspense";
        case y:
          return "SuspenseList";
        case b:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case S:
            return "Portal";
          case N:
            return (e.displayName || "Context") + ".Provider";
          case D:
            return (e._context.displayName || "Context") + ".Consumer";
          case L:
            var f = e.render;
            return e = e.displayName, e || (e = f.displayName || f.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case E:
            return f = e.displayName || null, f !== null ? f : r(e.type) || "Memo";
          case h:
            f = e._payload, e = e._init;
            try {
              return r(e(f));
            } catch {
            }
        }
      return null;
    }
    function o(e) {
      return "" + e;
    }
    function c(e) {
      try {
        o(e);
        var f = !1;
      } catch {
        f = !0;
      }
      if (f) {
        f = console;
        var k = f.error, T = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return k.call(
          f,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), o(e);
      }
    }
    function s(e) {
      if (e === R) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === h)
        return "<...>";
      try {
        var f = r(e);
        return f ? "<" + f + ">" : "<...>";
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
    function g(e) {
      if (a.call(e, "key")) {
        var f = Object.getOwnPropertyDescriptor(e, "key").get;
        if (f && f.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function i(e, f) {
      function k() {
        P || (P = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          f
        ));
      }
      k.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: k,
        configurable: !0
      });
    }
    function w() {
      var e = r(this.type);
      return B[e] || (B[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function p(e, f, k, T, z, Y, q, G) {
      return k = Y.ref, e = {
        $$typeof: x,
        type: e,
        key: f,
        props: Y,
        _owner: z
      }, (k !== void 0 ? k : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: w
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
        value: q
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: G
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function C(e, f, k, T, z, Y, q, G) {
      var _ = f.children;
      if (_ !== void 0)
        if (T)
          if (M(_)) {
            for (T = 0; T < _.length; T++)
              l(_[T]);
            Object.freeze && Object.freeze(_);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else l(_);
      if (a.call(f, "key")) {
        _ = r(e);
        var W = Object.keys(f).filter(function(de) {
          return de !== "key";
        });
        T = 0 < W.length ? "{key: someKey, " + W.join(": ..., ") + ": ...}" : "{key: someKey}", ne[_ + T] || (W = 0 < W.length ? "{" + W.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          T,
          _,
          W,
          _
        ), ne[_ + T] = !0);
      }
      if (_ = null, k !== void 0 && (c(k), _ = "" + k), g(f) && (c(f.key), _ = "" + f.key), "key" in f) {
        k = {};
        for (var Q in f)
          Q !== "key" && (k[Q] = f[Q]);
      } else k = f;
      return _ && i(
        k,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), p(
        e,
        _,
        Y,
        z,
        d(),
        k,
        q,
        G
      );
    }
    function l(e) {
      typeof e == "object" && e !== null && e.$$typeof === x && e._store && (e._store.validated = 1);
    }
    var v = K, x = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), I = Symbol.for("react.profiler"), D = Symbol.for("react.consumer"), N = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), y = Symbol.for("react.suspense_list"), E = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), n = Symbol.for("react.client.reference"), t = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, a = Object.prototype.hasOwnProperty, M = Array.isArray, A = console.createTask ? console.createTask : function() {
      return null;
    };
    v = {
      "react-stack-bottom-frame": function(e) {
        return e();
      }
    };
    var P, B = {}, H = v["react-stack-bottom-frame"].bind(
      v,
      m
    )(), re = A(s(m)), ne = {};
    $.Fragment = R, $.jsx = function(e, f, k, T, z) {
      var Y = 1e4 > t.recentlyCreatedOwnerStacks++;
      return C(
        e,
        f,
        k,
        !1,
        T,
        z,
        Y ? Error("react-stack-top-frame") : H,
        Y ? A(s(e)) : re
      );
    }, $.jsxs = function(e, f, k, T, z) {
      var Y = 1e4 > t.recentlyCreatedOwnerStacks++;
      return C(
        e,
        f,
        k,
        !0,
        T,
        z,
        Y ? Error("react-stack-top-frame") : H,
        Y ? A(s(e)) : re
      );
    };
  }()), $;
}
var ce;
function me() {
  return ce || (ce = 1, process.env.NODE_ENV === "production" ? Z.exports = fe() : Z.exports = he()), Z.exports;
}
var J = me();
const ae = (r) => {
  let o;
  const c = /* @__PURE__ */ new Set(), s = (p, C) => {
    const l = typeof p == "function" ? p(o) : p;
    if (!Object.is(l, o)) {
      const v = o;
      o = C ?? (typeof l != "object" || l === null) ? l : Object.assign({}, o, l), c.forEach((x) => x(o, v));
    }
  }, d = () => o, i = { setState: s, getState: d, getInitialState: () => w, subscribe: (p) => (c.add(p), () => c.delete(p)) }, w = o = r(s, d, i);
  return i;
}, ge = (r) => r ? ae(r) : ae, ve = (r) => r;
function Se(r, o = ve) {
  const c = K.useSyncExternalStore(
    r.subscribe,
    () => o(r.getState()),
    () => o(r.getInitialState())
  );
  return K.useDebugValue(c), c;
}
const ie = (r) => {
  const o = ge(r), c = (s) => Se(o, s);
  return Object.assign(c, o), c;
}, V = (r) => r ? ie(r) : ie, we = V((r) => ({
  canvases: {},
  addCanvas: (o, c) => r((s) => s.canvases[c] ? s : {
    canvases: {
      ...s.canvases,
      [c]: o
    }
  }),
  updateCanvas: (o, c) => r((s) => ({
    canvases: {
      ...s.canvases,
      [c]: o
    }
  }))
})), ue = (r) => {
  const { canvases: o, updateCanvas: c, addCanvas: s } = we(), d = ee(() => o[r], [o]);
  return { canvas: d, setZoom: (w) => {
    d && c({ ...d, zoom: w }, r);
  }, setRotation: (w) => {
    d && c({ ...d, rotation: w }, r);
  }, initCanvas: (w) => {
    console.log("init", w, r), s(w, r);
  } };
}, pe = V((r) => ({
  stickers: void 0,
  selectedSticker: void 0,
  addSticker: (o, c) => r((s) => {
    const d = s.stickers?.[c]?.stickers || [];
    return {
      stickers: {
        ...s.stickers,
        [c]: {
          stickers: [...d, o]
        }
      }
    };
  }),
  updateSticker: (o, c) => r((s) => {
    const m = (s.stickers?.[c]?.stickers || []).map(
      (g) => g.id === o.id ? o : g
    );
    return {
      stickers: {
        ...s.stickers,
        [c]: {
          stickers: m
        }
      }
    };
  }),
  updateAll: (o, c) => r((s) => ({
    stickers: {
      ...s.stickers,
      [c]: {
        stickers: o
      }
    }
  })),
  removeSticker: (o, c) => r((s) => {
    const m = (s.stickers?.[c]?.stickers || []).filter(
      (i) => i.id !== o
    ), g = { ...s.selectedSticker };
    return g?.[c] === o && (g[c] = void 0), {
      stickers: {
        ...s.stickers,
        [c]: {
          stickers: m
        }
      },
      selectedSticker: g
    };
  }),
  setSelectedSticker: (o, c) => r((s) => ({
    selectedSticker: {
      ...s.selectedSticker,
      [o]: c
    }
  }))
})), le = (r) => {
  const {
    stickers: o,
    selectedSticker: c,
    addSticker: s,
    removeSticker: d,
    setSelectedSticker: m,
    updateSticker: g,
    updateAll: i
  } = pe(), w = ee(() => o?.[r]?.stickers, [o]), p = ee(
    () => c?.[r],
    [c]
  );
  return {
    stickers: w,
    selectedSticker: p,
    addSticker: async (l) => {
      const { width: v, height: x } = await Ee(l), S = {
        id: (/* @__PURE__ */ new Date()).toString(),
        type: "sticker",
        src: l,
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: v,
        height: x
      };
      s(S, r);
    },
    removeSticker: (l) => d(l, r),
    setSelectedSticker: (l) => m(r, l),
    updateSticker: (l) => g(l, r),
    updateAllStickers: (l) => i(l, r)
  };
};
function Ee(r) {
  return new Promise((o, c) => {
    const s = new Image();
    s.onload = () => o({ width: s.width, height: s.height }), s.onerror = c, s.src = r;
  });
}
function be(r, o, c) {
  const {
    stickers: s,
    selectedSticker: d,
    setSelectedSticker: m,
    updateAllStickers: g
  } = le(o), [i, w] = F(null), [p, C] = F(null), [l, v] = F(null), x = j({ x: 0, y: 0 }), S = j({ x: 0, y: 0 }), R = j({
    width: 0,
    height: 0
  }), O = (u, y) => {
    if (s)
      for (let E = s.length - 1; E >= 0; E--) {
        const h = s[E];
        if (u >= h.x && u <= h.x + h.width && y >= h.y && y <= h.y + h.height)
          return h;
      }
  }, I = (u, y, E, h = 10) => {
    const b = {
      tl: { x: u.x, y: u.y },
      tr: { x: u.x + u.width, y: u.y },
      bl: { x: u.x, y: u.y + u.height },
      br: { x: u.x + u.width, y: u.y + u.height }
    };
    for (const n in b) {
      if (!n) continue;
      const t = b[n].x, a = b[n].y;
      if (Math.abs(y - t) <= h && Math.abs(E - a) <= h)
        return n;
    }
    return null;
  }, D = (u, y) => {
    const E = s?.find((b) => b.id === d);
    if (E) {
      const b = I(E, u, y);
      if (b) {
        C(E.id), v(b), S.current = { x: u, y }, R.current = {
          width: E.width,
          height: E.height
        }, c?.(!0);
        return;
      }
    }
    const h = O(u, y);
    h ? (w(h.id), x.current = { x: u - h.x, y: y - h.y }, c?.(!0), m?.(h.id)) : m?.(void 0);
  }, N = (u, y) => {
    if (p && l) {
      const h = u - S.current.x, b = y - S.current.y, n = s?.map((t) => {
        if (t.id !== p) return t;
        let a = R.current.width, M = R.current.height;
        switch (l) {
          case "tl": {
            const A = R.current.width - h, P = R.current.height - b;
            a = Math.max(A, 10), M = Math.max(P, 10);
            break;
          }
          case "tr": {
            const A = R.current.width + h, P = R.current.height - b;
            a = Math.max(A, 10), M = Math.max(P, 10);
            break;
          }
          case "bl": {
            const A = R.current.width - h, P = R.current.height + b;
            a = Math.max(A, 10), M = Math.max(P, 10);
            break;
          }
          case "br": {
            const A = R.current.width + h, P = R.current.height + b;
            a = Math.max(A, 10), M = Math.max(P, 10);
            break;
          }
        }
        return a = Math.max(10, a), M = Math.max(10, M), {
          ...t,
          width: a,
          height: M
        };
      });
      n && g?.(n);
      return;
    }
    if (!i) return;
    const E = s?.map(
      (h) => h.id === i ? {
        ...h,
        x: u - x.current.x,
        y: y - x.current.y
      } : h
    );
    E && g?.(E);
  }, L = () => {
    w(null), C(null), v(null), c?.(!1);
  };
  X(() => {
    const u = r.current;
    if (!u) return;
    const y = (E) => {
      const h = u.getBoundingClientRect(), b = E.clientX - h.left, n = E.clientY - h.top, t = s?.find((a) => a.id === d);
      if (t) {
        const a = I(t, b, n);
        if (a) {
          const M = {
            tl: "nwse-resize",
            br: "nwse-resize",
            tr: "nesw-resize",
            bl: "nesw-resize"
          };
          u.style.cursor = M[a];
          return;
        }
      }
      u.style.cursor = i || p ? "grabbing" : "default";
    };
    return u.addEventListener("mousemove", y), () => {
      u.removeEventListener("mousemove", y), u.style.cursor = "default";
    };
  }, [r, s, m, i, p]), X(() => {
    const u = r.current;
    if (!u) return;
    const y = (n) => {
      const t = u.getBoundingClientRect();
      D(n.clientX - t.left, n.clientY - t.top);
    }, E = (n) => {
      if (!i && !p) return;
      const t = u.getBoundingClientRect();
      N(n.clientX - t.left, n.clientY - t.top);
    }, h = (n) => {
      if (n.touches.length !== 1) return;
      const t = u.getBoundingClientRect(), a = n.touches[0];
      D(a.clientX - t.left, a.clientY - t.top);
    }, b = (n) => {
      if (n.touches.length !== 1 || !i && !p) return;
      const t = u.getBoundingClientRect(), a = n.touches[0];
      N(a.clientX - t.left, a.clientY - t.top);
    };
    return u.addEventListener("mousedown", y), window.addEventListener("mousemove", E), window.addEventListener("mouseup", L), u.addEventListener("touchstart", h, { passive: !1 }), window.addEventListener("touchmove", b, { passive: !1 }), window.addEventListener("touchend", L), () => {
      u.removeEventListener("mousedown", y), window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", L), u.removeEventListener("touchstart", h), window.removeEventListener("touchmove", b), window.removeEventListener("touchend", L);
    };
  }, [
    r,
    i,
    p,
    l,
    s,
    g,
    c,
    m
  ]);
}
const te = V(() => ({
  canvasRefs: {},
  setCanvasRef: (r, o) => {
    te.getState().canvasRefs[r] = o;
  }
})), Re = V(() => {
  const r = { current: null };
  return {
    finalImageRef: r,
    setFinalImage: (o) => {
      r.current = o;
    },
    getFinalImage: () => r.current
  };
});
function ke({ canvasId: r }) {
  const { canvasRefs: o } = te(), c = j(null), [s, d] = F({ x: 0, y: 0 }), [m, g] = F(!1), i = j(null), { stickers: w, selectedSticker: p } = le(r), {
    canvas: { image: C, cropHeight: l, cropWidth: v, rotation: x, zoom: S },
    setZoom: R
  } = ue(r), O = (n, t, a) => Math.min(Math.max(n, t), a), I = (n) => {
    if (!i.current || m) return;
    const t = S / 100, a = i.current.width * t, M = i.current.height * t, A = Math.max(0, (a - v) / 2), P = Math.max(0, (M - l) / 2), B = O(n.x, -A, A), H = O(n.y, -P, P);
    d({ x: B, y: H });
  };
  X(() => {
    const n = new Image();
    n.onload = () => {
      i.current = n, b();
    }, n.src = C;
  }, [C, S, s, x, w, p]);
  const D = (n, t, a) => {
    n.save(), n.fillStyle = "#007bff", n.strokeStyle = "#fff", n.lineWidth = 2, n.beginPath(), n.rect(t - 10 / 2, a - 10 / 2, 10, 10), n.fill(), n.stroke(), n.restore();
  }, N = j({}), L = () => {
    const n = c.current ?? o[r].current, t = n?.getContext("2d");
    if (!n || !t || !i.current) return;
    n.width = v, n.height = l, t.clearRect(0, 0, v, l), t.save();
    const a = S / 100;
    return t.translate(s.x + v / 2, s.y + l / 2), t.rotate(x * Math.PI / 180), t.scale(a, a), t.drawImage(
      i.current,
      -i.current.width / 2,
      -i.current.height / 2
    ), t.restore(), t;
  }, u = (n, t) => {
    let a = N.current[t.src];
    if (!a) {
      a = new Image(), a.src = t.src, N.current[t.src] = a, a.onload = () => b();
      return;
    }
    a.complete && n.drawImage(
      a,
      t.x,
      t.y,
      t.width,
      t.height
    );
  }, y = (n, t) => {
    n.font = `${t.height}px sans-serif`, n.textAlign = "left", n.textBaseline = "top", n.fillText(t.src, t.x, t.y);
  }, E = (n, t) => {
    n.strokeStyle = "#007bff", n.lineWidth = 2, n.strokeRect(t.x, t.y, t.width, t.height), D(n, t.x, t.y), D(n, t.x + t.width, t.y), D(n, t.x, t.y + t.height), D(
      n,
      t.x + t.width,
      t.y + t.height
    );
  }, h = (n) => {
    const t = n.toDataURL();
    return Re.getState().setFinalImage({ dataUrl: t, metaData: { stickers: w ?? [] } }), { dataUrl: t, metaData: { stickers: w } };
  }, b = () => {
    const n = c ?? o[r], t = L();
    if (!(!t || !n.current))
      return w?.forEach((a) => {
        a.src.startsWith("data:image") || a.src.startsWith("http") ? u(t, a) : y(t, a), a.id === p && E(t, a);
      }), h(n.current);
  };
  return be(
    c ?? o[r],
    r,
    g
  ), {
    canvasRef: c,
    clamp: O,
    setCurrentZoom: R,
    currentZoom: S,
    setPosition: I,
    position: s,
    drawCanvas: b
  };
}
function xe(r, o) {
  const c = j(!1), s = j({ x: 0, y: 0 });
  return {
    onMouseDown: (i) => {
      c.current = !0, s.current = {
        x: i.clientX - o.x,
        y: i.clientY - o.y
      };
    },
    onMouseMove: (i) => {
      c.current && r(
        i.clientX - s.current.x,
        i.clientY - s.current.y
      );
    },
    onMouseUp: () => {
      c.current = !1;
    }
  };
}
function ye(r, o, c, s, d) {
  const m = j(!1), g = j({ x: 0, y: 0 }), i = j(null);
  return {
    onTouchStart: (l) => {
      if (l.touches.length === 1) {
        const v = l.touches[0];
        m.current = !0, g.current = {
          x: v.clientX - o.x,
          y: v.clientY - o.y
        };
      } else if (l.touches.length === 2) {
        const [v, x] = Array.from(l.touches), S = Math.hypot(x.clientX - v.clientX, x.clientY - v.clientY);
        i.current = S;
      }
    },
    onTouchMove: (l) => {
      if (l.preventDefault(), l.touches.length === 1 && m.current) {
        const v = l.touches[0];
        r(
          v.clientX - g.current.x,
          v.clientY - g.current.y
        );
      } else if (l.touches.length === 2) {
        const [v, x] = Array.from(l.touches), S = Math.hypot(x.clientX - v.clientX, x.clientY - v.clientY);
        if (i.current != null) {
          const O = (S - i.current) * 0.3;
          c(d(s + O, 10, 500));
        }
        i.current = S;
      }
    },
    onTouchEnd: () => {
      m.current = !1, i.current = null;
    }
  };
}
function Te({ id: r }) {
  const {
    canvasRef: o,
    clamp: c,
    setCurrentZoom: s,
    currentZoom: d,
    setPosition: m,
    position: g
  } = ke({
    canvasId: r
  }), { onMouseDown: i, onMouseMove: w, onMouseUp: p } = xe(
    (S, R) => m({ x: S, y: R }),
    g
  ), { onTouchStart: C, onTouchMove: l, onTouchEnd: v } = ye(
    (S, R) => m({ x: S, y: R }),
    g,
    s,
    d,
    c
  ), x = (S) => {
    S.preventDefault();
    const O = -S.deltaY * 0.1;
    s(d + O);
  };
  return X(() => {
    const S = o.current;
    if (S)
      return S.addEventListener("wheel", x, { passive: !1 }), () => {
        S.removeEventListener("wheel", x);
      };
  }, [o, d]), X(() => {
    te.getState().setCanvasRef(r, o);
  }, [r]), /* @__PURE__ */ J.jsx(
    "canvas",
    {
      ref: o,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: i,
      onMouseMove: w,
      onMouseUp: p,
      onMouseLeave: p,
      onTouchStart: C,
      onTouchMove: l,
      onTouchEnd: v
    }
  );
}
const Ce = ({
  id: r,
  image: o,
  cropWidth: c,
  cropHeight: s,
  zoom: d,
  rotation: m
}) => {
  const { initCanvas: g } = ue(r), [i, w] = F(!1);
  return X(() => {
    g({
      image: o,
      zoom: d,
      cropHeight: s,
      cropWidth: c,
      rotation: m
    }), w(!0);
  }, []), /* @__PURE__ */ J.jsx(J.Fragment, { children: i && /* @__PURE__ */ J.jsx(Te, { id: r }) });
};
export {
  Ce as EnhancedImage,
  le as useStickers
};
