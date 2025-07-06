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
var se;
function he() {
  if (se) return U;
  se = 1;
  var t = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function c(n, l, m) {
    var g = null;
    if (m !== void 0 && (g = "" + m), l.key !== void 0 && (g = "" + l.key), "key" in l) {
      m = {};
      for (var i in l)
        i !== "key" && (m[i] = l[i]);
    } else m = l;
    return l = m.ref, {
      $$typeof: t,
      type: n,
      key: g,
      ref: l !== void 0 ? l : null,
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
var ce;
function me() {
  return ce || (ce = 1, process.env.NODE_ENV !== "production" && function() {
    function t(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === s ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case R:
          return "Fragment";
        case N:
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
          case I:
            return (e.displayName || "Context") + ".Provider";
          case D:
            return (e._context.displayName || "Context") + ".Consumer";
          case L:
            var f = e.render;
            return e = e.displayName, e || (e = f.displayName || f.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case E:
            return f = e.displayName || null, f !== null ? f : t(e.type) || "Memo";
          case h:
            f = e._payload, e = e._init;
            try {
              return t(e(f));
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
        var x = f.error, T = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return x.call(
          f,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), o(e);
      }
    }
    function n(e) {
      if (e === R) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === h)
        return "<...>";
      try {
        var f = t(e);
        return f ? "<" + f + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function l() {
      var e = r.A;
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
      function x() {
        P || (P = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          f
        ));
      }
      x.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: x,
        configurable: !0
      });
    }
    function w() {
      var e = t(this.type);
      return B[e] || (B[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function p(e, f, x, T, z, Y, q, G) {
      return x = Y.ref, e = {
        $$typeof: k,
        type: e,
        key: f,
        props: Y,
        _owner: z
      }, (x !== void 0 ? x : null) !== null ? Object.defineProperty(e, "ref", {
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
    function C(e, f, x, T, z, Y, q, G) {
      var _ = f.children;
      if (_ !== void 0)
        if (T)
          if (M(_)) {
            for (T = 0; T < _.length; T++)
              d(_[T]);
            Object.freeze && Object.freeze(_);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else d(_);
      if (a.call(f, "key")) {
        _ = t(e);
        var W = Object.keys(f).filter(function(fe) {
          return fe !== "key";
        });
        T = 0 < W.length ? "{key: someKey, " + W.join(": ..., ") + ": ...}" : "{key: someKey}", oe[_ + T] || (W = 0 < W.length ? "{" + W.join(": ..., ") + ": ...}" : "{}", console.error(
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
        ), oe[_ + T] = !0);
      }
      if (_ = null, x !== void 0 && (c(x), _ = "" + x), g(f) && (c(f.key), _ = "" + f.key), "key" in f) {
        x = {};
        for (var Q in f)
          Q !== "key" && (x[Q] = f[Q]);
      } else x = f;
      return _ && i(
        x,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), p(
        e,
        _,
        Y,
        z,
        l(),
        x,
        q,
        G
      );
    }
    function d(e) {
      typeof e == "object" && e !== null && e.$$typeof === k && e._store && (e._store.validated = 1);
    }
    var v = K, k = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), D = Symbol.for("react.consumer"), I = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), y = Symbol.for("react.suspense_list"), E = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), s = Symbol.for("react.client.reference"), r = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, a = Object.prototype.hasOwnProperty, M = Array.isArray, A = console.createTask ? console.createTask : function() {
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
    )(), ne = A(n(m)), oe = {};
    $.Fragment = R, $.jsx = function(e, f, x, T, z) {
      var Y = 1e4 > r.recentlyCreatedOwnerStacks++;
      return C(
        e,
        f,
        x,
        !1,
        T,
        z,
        Y ? Error("react-stack-top-frame") : H,
        Y ? A(n(e)) : ne
      );
    }, $.jsxs = function(e, f, x, T, z) {
      var Y = 1e4 > r.recentlyCreatedOwnerStacks++;
      return C(
        e,
        f,
        x,
        !0,
        T,
        z,
        Y ? Error("react-stack-top-frame") : H,
        Y ? A(n(e)) : ne
      );
    };
  }()), $;
}
var ae;
function ge() {
  return ae || (ae = 1, process.env.NODE_ENV === "production" ? Z.exports = he() : Z.exports = me()), Z.exports;
}
var J = ge();
const ie = (t) => {
  let o;
  const c = /* @__PURE__ */ new Set(), n = (p, C) => {
    const d = typeof p == "function" ? p(o) : p;
    if (!Object.is(d, o)) {
      const v = o;
      o = C ?? (typeof d != "object" || d === null) ? d : Object.assign({}, o, d), c.forEach((k) => k(o, v));
    }
  }, l = () => o, i = { setState: n, getState: l, getInitialState: () => w, subscribe: (p) => (c.add(p), () => c.delete(p)) }, w = o = t(n, l, i);
  return i;
}, ve = (t) => t ? ie(t) : ie, Se = (t) => t;
function we(t, o = Se) {
  const c = K.useSyncExternalStore(
    t.subscribe,
    () => o(t.getState()),
    () => o(t.getInitialState())
  );
  return K.useDebugValue(c), c;
}
const ue = (t) => {
  const o = ve(t), c = (n) => we(o, n);
  return Object.assign(c, o), c;
}, V = (t) => t ? ue(t) : ue, pe = V((t) => ({
  canvases: {},
  addCanvas: (o, c) => t((n) => n.canvases[c] ? n : {
    canvases: {
      ...n.canvases,
      [c]: o
    }
  }),
  updateCanvas: (o, c) => t((n) => ({
    canvases: {
      ...n.canvases,
      [c]: o
    }
  }))
})), le = (t) => {
  const { canvases: o, updateCanvas: c, addCanvas: n } = pe(), l = ee(() => o[t], [o]);
  return { canvas: l, setZoom: (w) => {
    l && c({ ...l, zoom: w }, t);
  }, setRotation: (w) => {
    l && c({ ...l, rotation: w }, t);
  }, initCanvas: (w) => {
    console.log("init", w, t), n(w, t);
  } };
}, Ee = V((t) => ({
  stickers: void 0,
  selectedSticker: void 0,
  addSticker: (o, c) => t((n) => {
    const l = n.stickers?.[c]?.stickers || [];
    return {
      stickers: {
        ...n.stickers,
        [c]: {
          stickers: [...l, o]
        }
      }
    };
  }),
  updateSticker: (o, c) => t((n) => {
    const m = (n.stickers?.[c]?.stickers || []).map(
      (g) => g.id === o.id ? o : g
    );
    return {
      stickers: {
        ...n.stickers,
        [c]: {
          stickers: m
        }
      }
    };
  }),
  updateAll: (o, c) => t((n) => ({
    stickers: {
      ...n.stickers,
      [c]: {
        stickers: o
      }
    }
  })),
  removeSticker: (o, c) => t((n) => {
    const m = (n.stickers?.[c]?.stickers || []).filter(
      (i) => i.id !== o
    ), g = { ...n.selectedSticker };
    return g?.[c] === o && (g[c] = void 0), {
      stickers: {
        ...n.stickers,
        [c]: {
          stickers: m
        }
      },
      selectedSticker: g
    };
  }),
  setSelectedSticker: (o, c) => t((n) => ({
    selectedSticker: {
      ...n.selectedSticker,
      [o]: c
    }
  }))
})), te = (t) => {
  const {
    stickers: o,
    selectedSticker: c,
    addSticker: n,
    removeSticker: l,
    setSelectedSticker: m,
    updateSticker: g,
    updateAll: i
  } = Ee(), w = ee(() => o?.[t]?.stickers, [o]), p = ee(
    () => c?.[t],
    [c]
  );
  return {
    stickers: w,
    selectedSticker: p,
    addSticker: async (d) => {
      const { width: v, height: k } = await be(d), S = {
        id: (/* @__PURE__ */ new Date()).toString(),
        type: "sticker",
        src: d,
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: v,
        height: k
      };
      n(S, t);
    },
    removeSticker: (d) => l(d, t),
    setSelectedSticker: (d) => m(t, d),
    updateSticker: (d) => g(d, t),
    updateAllStickers: (d) => i(d, t)
  };
};
function be(t) {
  return new Promise((o, c) => {
    const n = new Image();
    n.onload = () => o({ width: n.width, height: n.height }), n.onerror = c, n.src = t;
  });
}
function Re(t, o, c) {
  const {
    stickers: n,
    selectedSticker: l,
    setSelectedSticker: m,
    updateAllStickers: g
  } = te(o), [i, w] = F(null), [p, C] = F(null), [d, v] = F(null), k = j({ x: 0, y: 0 }), S = j({ x: 0, y: 0 }), R = j({
    width: 0,
    height: 0
  }), O = (u, y) => {
    if (n)
      for (let E = n.length - 1; E >= 0; E--) {
        const h = n[E];
        if (u >= h.x && u <= h.x + h.width && y >= h.y && y <= h.y + h.height)
          return h;
      }
  }, N = (u, y, E, h = 10) => {
    const b = {
      tl: { x: u.x, y: u.y },
      tr: { x: u.x + u.width, y: u.y },
      bl: { x: u.x, y: u.y + u.height },
      br: { x: u.x + u.width, y: u.y + u.height }
    };
    for (const s in b) {
      if (!s) continue;
      const r = b[s].x, a = b[s].y;
      if (Math.abs(y - r) <= h && Math.abs(E - a) <= h)
        return s;
    }
    return null;
  }, D = (u, y) => {
    const E = n?.find((b) => b.id === l);
    if (E) {
      const b = N(E, u, y);
      if (b) {
        C(E.id), v(b), S.current = { x: u, y }, R.current = {
          width: E.width,
          height: E.height
        }, c?.(!0);
        return;
      }
    }
    const h = O(u, y);
    h ? (w(h.id), k.current = { x: u - h.x, y: y - h.y }, c?.(!0), m?.(h.id)) : m?.(void 0);
  }, I = (u, y) => {
    if (p && d) {
      const h = u - S.current.x, b = y - S.current.y, s = n?.map((r) => {
        if (r.id !== p) return r;
        let a = R.current.width, M = R.current.height;
        switch (d) {
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
          ...r,
          width: a,
          height: M
        };
      });
      s && g?.(s);
      return;
    }
    if (!i) return;
    const E = n?.map(
      (h) => h.id === i ? {
        ...h,
        x: u - k.current.x,
        y: y - k.current.y
      } : h
    );
    E && g?.(E);
  }, L = () => {
    w(null), C(null), v(null), c?.(!1);
  };
  X(() => {
    const u = t.current;
    if (!u) return;
    const y = (E) => {
      const h = u.getBoundingClientRect(), b = E.clientX - h.left, s = E.clientY - h.top, r = n?.find((a) => a.id === l);
      if (r) {
        const a = N(r, b, s);
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
  }, [t, n, m, i, p]), X(() => {
    const u = t.current;
    if (!u) return;
    const y = (s) => {
      const r = u.getBoundingClientRect();
      D(s.clientX - r.left, s.clientY - r.top);
    }, E = (s) => {
      if (!i && !p) return;
      const r = u.getBoundingClientRect();
      I(s.clientX - r.left, s.clientY - r.top);
    }, h = (s) => {
      if (s.touches.length !== 1) return;
      const r = u.getBoundingClientRect(), a = s.touches[0];
      D(a.clientX - r.left, a.clientY - r.top);
    }, b = (s) => {
      if (s.touches.length !== 1 || !i && !p) return;
      const r = u.getBoundingClientRect(), a = s.touches[0];
      I(a.clientX - r.left, a.clientY - r.top);
    };
    return u.addEventListener("mousedown", y), window.addEventListener("mousemove", E), window.addEventListener("mouseup", L), u.addEventListener("touchstart", h, { passive: !1 }), window.addEventListener("touchmove", b, { passive: !1 }), window.addEventListener("touchend", L), () => {
      u.removeEventListener("mousedown", y), window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", L), u.removeEventListener("touchstart", h), window.removeEventListener("touchmove", b), window.removeEventListener("touchend", L);
    };
  }, [
    t,
    i,
    p,
    d,
    n,
    g,
    c,
    m
  ]);
}
const re = V(() => ({
  canvasRefs: {},
  setCanvasRef: (t, o) => {
    re.getState().canvasRefs[t] = o;
  }
})), de = V(() => {
  const t = { current: null };
  return {
    finalImageRef: t,
    setFinalImage: (o) => {
      t.current = o;
    },
    getFinalImage: () => t.current
  };
});
function xe({ canvasId: t }) {
  const { canvasRefs: o } = re(), c = j(null), [n, l] = F({ x: 0, y: 0 }), [m, g] = F(!1), i = j(null), { stickers: w, selectedSticker: p } = te(t), {
    canvas: { image: C, cropHeight: d, cropWidth: v, rotation: k, zoom: S },
    setZoom: R
  } = le(t), O = (s, r, a) => Math.min(Math.max(s, r), a), N = (s) => {
    if (!i.current || m) return;
    const r = S / 100, a = i.current.width * r, M = i.current.height * r, A = Math.max(0, (a - v) / 2), P = Math.max(0, (M - d) / 2), B = O(s.x, -A, A), H = O(s.y, -P, P);
    l({ x: B, y: H });
  };
  X(() => {
    const s = new Image();
    s.onload = () => {
      i.current = s, b();
    }, s.src = C;
  }, [C, S, n, k, w, p]);
  const D = (s, r, a) => {
    s.save(), s.fillStyle = "#007bff", s.strokeStyle = "#fff", s.lineWidth = 2, s.beginPath(), s.rect(r - 10 / 2, a - 10 / 2, 10, 10), s.fill(), s.stroke(), s.restore();
  }, I = j({}), L = () => {
    const s = c.current ?? o[t].current, r = s?.getContext("2d");
    if (!s || !r || !i.current) return;
    s.width = v, s.height = d, r.clearRect(0, 0, v, d), r.save();
    const a = S / 100;
    return r.translate(n.x + v / 2, n.y + d / 2), r.rotate(k * Math.PI / 180), r.scale(a, a), r.drawImage(
      i.current,
      -i.current.width / 2,
      -i.current.height / 2
    ), r.restore(), r;
  }, u = (s, r) => {
    let a = I.current[r.src];
    if (!a) {
      a = new Image(), a.src = r.src, I.current[r.src] = a, a.onload = () => b();
      return;
    }
    a.complete && s.drawImage(
      a,
      r.x,
      r.y,
      r.width,
      r.height
    );
  }, y = (s, r) => {
    s.font = `${r.height}px sans-serif`, s.textAlign = "left", s.textBaseline = "top", s.fillText(r.src, r.x, r.y);
  }, E = (s, r) => {
    s.strokeStyle = "#007bff", s.lineWidth = 2, s.strokeRect(r.x, r.y, r.width, r.height), D(s, r.x, r.y), D(s, r.x + r.width, r.y), D(s, r.x, r.y + r.height), D(
      s,
      r.x + r.width,
      r.y + r.height
    );
  }, h = (s) => {
    const r = s.toDataURL();
    return de.getState().setFinalImage({ dataUrl: r, metaData: { stickers: w ?? [] } }), { dataUrl: r, metaData: { stickers: w } };
  }, b = () => {
    const s = c ?? o[t], r = L();
    if (!(!r || !s.current))
      return w?.forEach((a) => {
        a.src.startsWith("data:image") || a.src.startsWith("http") ? u(r, a) : y(r, a), a.id === p && E(r, a);
      }), h(s.current);
  };
  return Re(
    c ?? o[t],
    t,
    g
  ), {
    canvasRef: c,
    clamp: O,
    setCurrentZoom: R,
    currentZoom: S,
    setPosition: N,
    position: n,
    drawCanvas: b
  };
}
function ke(t, o) {
  const c = j(!1), n = j({ x: 0, y: 0 });
  return {
    onMouseDown: (i) => {
      c.current = !0, n.current = {
        x: i.clientX - o.x,
        y: i.clientY - o.y
      };
    },
    onMouseMove: (i) => {
      c.current && t(
        i.clientX - n.current.x,
        i.clientY - n.current.y
      );
    },
    onMouseUp: () => {
      c.current = !1;
    }
  };
}
function ye(t, o, c, n, l) {
  const m = j(!1), g = j({ x: 0, y: 0 }), i = j(null);
  return {
    onTouchStart: (d) => {
      if (d.touches.length === 1) {
        const v = d.touches[0];
        m.current = !0, g.current = {
          x: v.clientX - o.x,
          y: v.clientY - o.y
        };
      } else if (d.touches.length === 2) {
        const [v, k] = Array.from(d.touches), S = Math.hypot(k.clientX - v.clientX, k.clientY - v.clientY);
        i.current = S;
      }
    },
    onTouchMove: (d) => {
      if (d.preventDefault(), d.touches.length === 1 && m.current) {
        const v = d.touches[0];
        t(
          v.clientX - g.current.x,
          v.clientY - g.current.y
        );
      } else if (d.touches.length === 2) {
        const [v, k] = Array.from(d.touches), S = Math.hypot(k.clientX - v.clientX, k.clientY - v.clientY);
        if (i.current != null) {
          const O = (S - i.current) * 0.3;
          c(l(n + O, 10, 500));
        }
        i.current = S;
      }
    },
    onTouchEnd: () => {
      m.current = !1, i.current = null;
    }
  };
}
function Te({ id: t }) {
  const {
    canvasRef: o,
    clamp: c,
    setCurrentZoom: n,
    currentZoom: l,
    setPosition: m,
    position: g
  } = xe({
    canvasId: t
  }), { onMouseDown: i, onMouseMove: w, onMouseUp: p } = ke(
    (S, R) => m({ x: S, y: R }),
    g
  ), { onTouchStart: C, onTouchMove: d, onTouchEnd: v } = ye(
    (S, R) => m({ x: S, y: R }),
    g,
    n,
    l,
    c
  ), k = (S) => {
    S.preventDefault();
    const O = -S.deltaY * 0.1;
    n(l + O);
  };
  return X(() => {
    const S = o.current;
    if (S)
      return S.addEventListener("wheel", k, { passive: !1 }), () => {
        S.removeEventListener("wheel", k);
      };
  }, [o, l]), X(() => {
    re.getState().setCanvasRef(t, o);
  }, [t]), /* @__PURE__ */ J.jsx(
    "canvas",
    {
      ref: o,
      style: { touchAction: "none", cursor: "grab" },
      onMouseDown: i,
      onMouseMove: w,
      onMouseUp: p,
      onMouseLeave: p,
      onTouchStart: C,
      onTouchMove: d,
      onTouchEnd: v
    }
  );
}
function Ce({
  id: t,
  image: o,
  cropWidth: c,
  cropHeight: n,
  zoom: l,
  rotation: m
}) {
  const { initCanvas: g } = le(t), [i, w] = F(!1);
  return X(() => {
    g({
      image: o,
      zoom: l,
      cropHeight: n,
      cropWidth: c,
      rotation: m
    }), w(!0);
  }, []), /* @__PURE__ */ J.jsx(J.Fragment, { children: i && /* @__PURE__ */ J.jsx(Te, { id: t }) });
}
const Me = (t) => {
  const { setSelectedSticker: o } = te(t);
  return { exportFinalImage: async () => {
    o(void 0), console.log("haloooo"), await new Promise((l) => setTimeout(l, 50));
    const n = de.getState().getFinalImage();
    return console.log(n), n;
  } };
};
export {
  Ce as EnhancedImage,
  Me as useImageExporter,
  te as useStickers
};
