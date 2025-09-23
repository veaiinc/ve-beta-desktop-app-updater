import {
  ConnectionQuality,
  ConnectionState,
  LocalTrackPublication,
  LogLevel,
  MediaDeviceFailure,
  ParticipantEvent,
  ParticipantInfo_Kind,
  Room,
  RoomEvent,
  Track,
  TrackEvent,
  compareVersions,
  createAudioAnalyser,
  facingModeFromLocalTrack,
  setLogExtension,
  setLogLevel
} from "./chunk-3PEDPLGC.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@livekit/components-react/dist/contexts-Cm1aSBTs.mjs
var R = __toESM(require_react(), 1);
var De = Math.min;
var se = Math.max;
var $e = Math.round;
var Le = Math.floor;
var G = (e) => ({
  x: e,
  y: e
});
var Yn = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var qn = {
  start: "end",
  end: "start"
};
function Et(e, t, n) {
  return se(e, De(t, n));
}
function He(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ae(e) {
  return e.split("-")[0];
}
function ze(e) {
  return e.split("-")[1];
}
function qt(e) {
  return e === "x" ? "y" : "x";
}
function Kt(e) {
  return e === "y" ? "height" : "width";
}
function he(e) {
  return ["top", "bottom"].includes(ae(e)) ? "y" : "x";
}
function Gt(e) {
  return qt(he(e));
}
function Kn(e, t, n) {
  n === void 0 && (n = false);
  const r2 = ze(e), i2 = Gt(e), o = Kt(i2);
  let s = i2 === "x" ? r2 === (n ? "end" : "start") ? "right" : "left" : r2 === "start" ? "bottom" : "top";
  return t.reference[o] > t.floating[o] && (s = Ne(s)), [s, Ne(s)];
}
function Gn(e) {
  const t = Ne(e);
  return [it(e), t, it(t)];
}
function it(e) {
  return e.replace(/start|end/g, (t) => qn[t]);
}
function Qn(e, t, n) {
  const r2 = ["left", "right"], i2 = ["right", "left"], o = ["top", "bottom"], s = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? i2 : r2 : t ? r2 : i2;
    case "left":
    case "right":
      return t ? o : s;
    default:
      return [];
  }
}
function Jn(e, t, n, r2) {
  const i2 = ze(e);
  let o = Qn(ae(e), n === "start", r2);
  return i2 && (o = o.map((s) => s + "-" + i2), t && (o = o.concat(o.map(it)))), o;
}
function Ne(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Yn[t]);
}
function Xn(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Zn(e) {
  return typeof e != "number" ? Xn(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Fe(e) {
  const {
    x: t,
    y: n,
    width: r2,
    height: i2
  } = e;
  return {
    width: r2,
    height: i2,
    top: n,
    left: t,
    right: t + r2,
    bottom: n + i2,
    x: t,
    y: n
  };
}
function Ct(e, t, n) {
  let {
    reference: r2,
    floating: i2
  } = e;
  const o = he(t), s = Gt(t), a = Kt(s), c = ae(t), u = o === "y", l = r2.x + r2.width / 2 - i2.width / 2, f = r2.y + r2.height / 2 - i2.height / 2, v = r2[a] / 2 - i2[a] / 2;
  let d;
  switch (c) {
    case "top":
      d = {
        x: l,
        y: r2.y - i2.height
      };
      break;
    case "bottom":
      d = {
        x: l,
        y: r2.y + r2.height
      };
      break;
    case "right":
      d = {
        x: r2.x + r2.width,
        y: f
      };
      break;
    case "left":
      d = {
        x: r2.x - i2.width,
        y: f
      };
      break;
    default:
      d = {
        x: r2.x,
        y: r2.y
      };
  }
  switch (ze(t)) {
    case "start":
      d[s] -= v * (n && u ? -1 : 1);
      break;
    case "end":
      d[s] += v * (n && u ? -1 : 1);
      break;
  }
  return d;
}
var er = async (e, t, n) => {
  const {
    placement: r2 = "bottom",
    strategy: i2 = "absolute",
    middleware: o = [],
    platform: s
  } = n, a = o.filter(Boolean), c = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let u = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: i2
  }), {
    x: l,
    y: f
  } = Ct(u, r2, c), v = r2, d = {}, m = 0;
  for (let p = 0; p < a.length; p++) {
    const {
      name: g,
      fn: h
    } = a[p], {
      x,
      y: E,
      data: P,
      reset: b2
    } = await h({
      x: l,
      y: f,
      initialPlacement: r2,
      placement: v,
      strategy: i2,
      middlewareData: d,
      rects: u,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    l = x ?? l, f = E ?? f, d = {
      ...d,
      [g]: {
        ...d[g],
        ...P
      }
    }, b2 && m <= 50 && (m++, typeof b2 == "object" && (b2.placement && (v = b2.placement), b2.rects && (u = b2.rects === true ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: i2
    }) : b2.rects), {
      x: l,
      y: f
    } = Ct(u, v, c)), p = -1);
  }
  return {
    x: l,
    y: f,
    placement: v,
    strategy: i2,
    middlewareData: d
  };
};
async function Qt(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r2,
    y: i2,
    platform: o,
    rects: s,
    elements: a,
    strategy: c
  } = e, {
    boundary: u = "clippingAncestors",
    rootBoundary: l = "viewport",
    elementContext: f = "floating",
    altBoundary: v = false,
    padding: d = 0
  } = He(t, e), m = Zn(d), g = a[v ? f === "floating" ? "reference" : "floating" : f], h = Fe(await o.getClippingRect({
    element: (n = await (o.isElement == null ? void 0 : o.isElement(g))) == null || n ? g : g.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: l,
    strategy: c
  })), x = f === "floating" ? {
    x: r2,
    y: i2,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, E = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), P = await (o.isElement == null ? void 0 : o.isElement(E)) ? await (o.getScale == null ? void 0 : o.getScale(E)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, b2 = Fe(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: x,
    offsetParent: E,
    strategy: c
  }) : x);
  return {
    top: (h.top - b2.top + m.top) / P.y,
    bottom: (b2.bottom - h.bottom + m.bottom) / P.y,
    left: (h.left - b2.left + m.left) / P.x,
    right: (b2.right - h.right + m.right) / P.x
  };
}
var tr = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r2;
      const {
        placement: i2,
        middlewareData: o,
        rects: s,
        initialPlacement: a,
        platform: c,
        elements: u
      } = t, {
        mainAxis: l = true,
        crossAxis: f = true,
        fallbackPlacements: v,
        fallbackStrategy: d = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: p = true,
        ...g
      } = He(e, t);
      if ((n = o.arrow) != null && n.alignmentOffset)
        return {};
      const h = ae(i2), x = he(a), E = ae(a) === a, P = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)), b2 = v || (E || !p ? [Ne(a)] : Gn(a)), S = m !== "none";
      !v && S && b2.push(...Jn(a, p, m, P));
      const C = [a, ...b2], $2 = await Qt(t, g), I3 = [];
      let z2 = ((r2 = o.flip) == null ? void 0 : r2.overflows) || [];
      if (l && I3.push($2[h]), f) {
        const K = Kn(i2, s, P);
        I3.push($2[K[0]], $2[K[1]]);
      }
      if (z2 = [...z2, {
        placement: i2,
        overflows: I3
      }], !I3.every((K) => K <= 0)) {
        var T2, L2;
        const K = (((T2 = o.flip) == null ? void 0 : T2.index) || 0) + 1, ke = C[K];
        if (ke)
          return {
            data: {
              index: K,
              overflows: z2
            },
            reset: {
              placement: ke
            }
          };
        let xe = (L2 = z2.filter((fe) => fe.overflows[0] <= 0).sort((fe, te) => fe.overflows[1] - te.overflows[1])[0]) == null ? void 0 : L2.placement;
        if (!xe)
          switch (d) {
            case "bestFit": {
              var oe;
              const fe = (oe = z2.filter((te) => {
                if (S) {
                  const ne = he(te.placement);
                  return ne === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ne === "y";
                }
                return true;
              }).map((te) => [te.placement, te.overflows.filter((ne) => ne > 0).reduce((ne, Bn) => ne + Bn, 0)]).sort((te, ne) => te[1] - ne[1])[0]) == null ? void 0 : oe[0];
              fe && (xe = fe);
              break;
            }
            case "initialPlacement":
              xe = a;
              break;
          }
        if (i2 !== xe)
          return {
            reset: {
              placement: xe
            }
          };
      }
      return {};
    }
  };
};
async function nr(e, t) {
  const {
    placement: n,
    platform: r2,
    elements: i2
  } = e, o = await (r2.isRTL == null ? void 0 : r2.isRTL(i2.floating)), s = ae(n), a = ze(n), c = he(n) === "y", u = ["left", "top"].includes(s) ? -1 : 1, l = o && c ? -1 : 1, f = He(t, e);
  let {
    mainAxis: v,
    crossAxis: d,
    alignmentAxis: m
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: f.mainAxis || 0,
    crossAxis: f.crossAxis || 0,
    alignmentAxis: f.alignmentAxis
  };
  return a && typeof m == "number" && (d = a === "end" ? m * -1 : m), c ? {
    x: d * l,
    y: v * u
  } : {
    x: v * u,
    y: d * l
  };
}
var rr = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r2;
      const {
        x: i2,
        y: o,
        placement: s,
        middlewareData: a
      } = t, c = await nr(t, e);
      return s === ((n = a.offset) == null ? void 0 : n.placement) && (r2 = a.arrow) != null && r2.alignmentOffset ? {} : {
        x: i2 + c.x,
        y: o + c.y,
        data: {
          ...c,
          placement: s
        }
      };
    }
  };
};
var ir = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r2,
        placement: i2
      } = t, {
        mainAxis: o = true,
        crossAxis: s = false,
        limiter: a = {
          fn: (g) => {
            let {
              x: h,
              y: x
            } = g;
            return {
              x: h,
              y: x
            };
          }
        },
        ...c
      } = He(e, t), u = {
        x: n,
        y: r2
      }, l = await Qt(t, c), f = he(ae(i2)), v = qt(f);
      let d = u[v], m = u[f];
      if (o) {
        const g = v === "y" ? "top" : "left", h = v === "y" ? "bottom" : "right", x = d + l[g], E = d - l[h];
        d = Et(x, d, E);
      }
      if (s) {
        const g = f === "y" ? "top" : "left", h = f === "y" ? "bottom" : "right", x = m + l[g], E = m - l[h];
        m = Et(x, m, E);
      }
      const p = a.fn({
        ...t,
        [v]: d,
        [f]: m
      });
      return {
        ...p,
        data: {
          x: p.x - n,
          y: p.y - r2,
          enabled: {
            [v]: o,
            [f]: s
          }
        }
      };
    }
  };
};
function Ye() {
  return typeof window < "u";
}
function be(e) {
  return Jt(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function U(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function J(e) {
  var t;
  return (t = (Jt(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Jt(e) {
  return Ye() ? e instanceof Node || e instanceof U(e).Node : false;
}
function Y(e) {
  return Ye() ? e instanceof Element || e instanceof U(e).Element : false;
}
function Q(e) {
  return Ye() ? e instanceof HTMLElement || e instanceof U(e).HTMLElement : false;
}
function Pt(e) {
  return !Ye() || typeof ShadowRoot > "u" ? false : e instanceof ShadowRoot || e instanceof U(e).ShadowRoot;
}
function Ae(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r2,
    display: i2
  } = q(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r2 + n) && !["inline", "contents"].includes(i2);
}
function or(e) {
  return ["table", "td", "th"].includes(be(e));
}
function qe(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return false;
    }
  });
}
function ft(e) {
  const t = dt(), n = Y(e) ? q(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((r2) => n[r2] ? n[r2] !== "none" : false) || (n.containerType ? n.containerType !== "normal" : false) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : false) || !t && (n.filter ? n.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((r2) => (n.willChange || "").includes(r2)) || ["paint", "layout", "strict", "content"].some((r2) => (n.contain || "").includes(r2));
}
function sr(e) {
  let t = ie(e);
  for (; Q(t) && !ve(t); ) {
    if (ft(t))
      return t;
    if (qe(t))
      return null;
    t = ie(t);
  }
  return null;
}
function dt() {
  return typeof CSS > "u" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter", "none");
}
function ve(e) {
  return ["html", "body", "#document"].includes(be(e));
}
function q(e) {
  return U(e).getComputedStyle(e);
}
function Ke(e) {
  return Y(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function ie(e) {
  if (be(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Pt(e) && e.host || // Fallback.
    J(e)
  );
  return Pt(t) ? t.host : t;
}
function Xt(e) {
  const t = ie(e);
  return ve(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Q(t) && Ae(t) ? t : Xt(t);
}
function Ee(e, t, n) {
  var r2;
  t === void 0 && (t = []), n === void 0 && (n = true);
  const i2 = Xt(e), o = i2 === ((r2 = e.ownerDocument) == null ? void 0 : r2.body), s = U(i2);
  if (o) {
    const a = ot(s);
    return t.concat(s, s.visualViewport || [], Ae(i2) ? i2 : [], a && n ? Ee(a) : []);
  }
  return t.concat(i2, Ee(i2, [], n));
}
function ot(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Zt(e) {
  const t = q(e);
  let n = parseFloat(t.width) || 0, r2 = parseFloat(t.height) || 0;
  const i2 = Q(e), o = i2 ? e.offsetWidth : n, s = i2 ? e.offsetHeight : r2, a = $e(n) !== o || $e(r2) !== s;
  return a && (n = o, r2 = s), {
    width: n,
    height: r2,
    $: a
  };
}
function pt(e) {
  return Y(e) ? e : e.contextElement;
}
function de(e) {
  const t = pt(e);
  if (!Q(t))
    return G(1);
  const n = t.getBoundingClientRect(), {
    width: r2,
    height: i2,
    $: o
  } = Zt(t);
  let s = (o ? $e(n.width) : n.width) / r2, a = (o ? $e(n.height) : n.height) / i2;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
var ar = G(0);
function en(e) {
  const t = U(e);
  return !dt() || !t.visualViewport ? ar : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function cr(e, t, n) {
  return t === void 0 && (t = false), !n || t && n !== U(e) ? false : t;
}
function ce(e, t, n, r2) {
  t === void 0 && (t = false), n === void 0 && (n = false);
  const i2 = e.getBoundingClientRect(), o = pt(e);
  let s = G(1);
  t && (r2 ? Y(r2) && (s = de(r2)) : s = de(e));
  const a = cr(o, n, r2) ? en(o) : G(0);
  let c = (i2.left + a.x) / s.x, u = (i2.top + a.y) / s.y, l = i2.width / s.x, f = i2.height / s.y;
  if (o) {
    const v = U(o), d = r2 && Y(r2) ? U(r2) : r2;
    let m = v, p = ot(m);
    for (; p && r2 && d !== m; ) {
      const g = de(p), h = p.getBoundingClientRect(), x = q(p), E = h.left + (p.clientLeft + parseFloat(x.paddingLeft)) * g.x, P = h.top + (p.clientTop + parseFloat(x.paddingTop)) * g.y;
      c *= g.x, u *= g.y, l *= g.x, f *= g.y, c += E, u += P, m = U(p), p = ot(m);
    }
  }
  return Fe({
    width: l,
    height: f,
    x: c,
    y: u
  });
}
function ht(e, t) {
  const n = Ke(e).scrollLeft;
  return t ? t.left + n : ce(J(e)).left + n;
}
function tn(e, t, n) {
  n === void 0 && (n = false);
  const r2 = e.getBoundingClientRect(), i2 = r2.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    ht(e, r2)
  )), o = r2.top + t.scrollTop;
  return {
    x: i2,
    y: o
  };
}
function ur(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r2,
    strategy: i2
  } = e;
  const o = i2 === "fixed", s = J(r2), a = t ? qe(t.floating) : false;
  if (r2 === s || a && o)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = G(1);
  const l = G(0), f = Q(r2);
  if ((f || !f && !o) && ((be(r2) !== "body" || Ae(s)) && (c = Ke(r2)), Q(r2))) {
    const d = ce(r2);
    u = de(r2), l.x = d.x + r2.clientLeft, l.y = d.y + r2.clientTop;
  }
  const v = s && !f && !o ? tn(s, c, true) : G(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - c.scrollLeft * u.x + l.x + v.x,
    y: n.y * u.y - c.scrollTop * u.y + l.y + v.y
  };
}
function lr(e) {
  return Array.from(e.getClientRects());
}
function fr(e) {
  const t = J(e), n = Ke(e), r2 = e.ownerDocument.body, i2 = se(t.scrollWidth, t.clientWidth, r2.scrollWidth, r2.clientWidth), o = se(t.scrollHeight, t.clientHeight, r2.scrollHeight, r2.clientHeight);
  let s = -n.scrollLeft + ht(e);
  const a = -n.scrollTop;
  return q(r2).direction === "rtl" && (s += se(t.clientWidth, r2.clientWidth) - i2), {
    width: i2,
    height: o,
    x: s,
    y: a
  };
}
function dr(e, t) {
  const n = U(e), r2 = J(e), i2 = n.visualViewport;
  let o = r2.clientWidth, s = r2.clientHeight, a = 0, c = 0;
  if (i2) {
    o = i2.width, s = i2.height;
    const u = dt();
    (!u || u && t === "fixed") && (a = i2.offsetLeft, c = i2.offsetTop);
  }
  return {
    width: o,
    height: s,
    x: a,
    y: c
  };
}
function pr(e, t) {
  const n = ce(e, true, t === "fixed"), r2 = n.top + e.clientTop, i2 = n.left + e.clientLeft, o = Q(e) ? de(e) : G(1), s = e.clientWidth * o.x, a = e.clientHeight * o.y, c = i2 * o.x, u = r2 * o.y;
  return {
    width: s,
    height: a,
    x: c,
    y: u
  };
}
function At(e, t, n) {
  let r2;
  if (t === "viewport")
    r2 = dr(e, n);
  else if (t === "document")
    r2 = fr(J(e));
  else if (Y(t))
    r2 = pr(t, n);
  else {
    const i2 = en(e);
    r2 = {
      x: t.x - i2.x,
      y: t.y - i2.y,
      width: t.width,
      height: t.height
    };
  }
  return Fe(r2);
}
function nn(e, t) {
  const n = ie(e);
  return n === t || !Y(n) || ve(n) ? false : q(n).position === "fixed" || nn(n, t);
}
function hr(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r2 = Ee(e, [], false).filter((a) => Y(a) && be(a) !== "body"), i2 = null;
  const o = q(e).position === "fixed";
  let s = o ? ie(e) : e;
  for (; Y(s) && !ve(s); ) {
    const a = q(s), c = ft(s);
    !c && a.position === "fixed" && (i2 = null), (o ? !c && !i2 : !c && a.position === "static" && !!i2 && ["absolute", "fixed"].includes(i2.position) || Ae(s) && !c && nn(e, s)) ? r2 = r2.filter((l) => l !== s) : i2 = a, s = ie(s);
  }
  return t.set(e, r2), r2;
}
function vr(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r2,
    strategy: i2
  } = e;
  const s = [...n === "clippingAncestors" ? qe(t) ? [] : hr(t, this._c) : [].concat(n), r2], a = s[0], c = s.reduce((u, l) => {
    const f = At(t, l, i2);
    return u.top = se(f.top, u.top), u.right = De(f.right, u.right), u.bottom = De(f.bottom, u.bottom), u.left = se(f.left, u.left), u;
  }, At(t, a, i2));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function mr(e) {
  const {
    width: t,
    height: n
  } = Zt(e);
  return {
    width: t,
    height: n
  };
}
function gr(e, t, n) {
  const r2 = Q(t), i2 = J(t), o = n === "fixed", s = ce(e, true, o, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = G(0);
  if (r2 || !r2 && !o)
    if ((be(t) !== "body" || Ae(i2)) && (a = Ke(t)), r2) {
      const v = ce(t, true, o, t);
      c.x = v.x + t.clientLeft, c.y = v.y + t.clientTop;
    } else i2 && (c.x = ht(i2));
  const u = i2 && !r2 && !o ? tn(i2, a) : G(0), l = s.left + a.scrollLeft - c.x - u.x, f = s.top + a.scrollTop - c.y - u.y;
  return {
    x: l,
    y: f,
    width: s.width,
    height: s.height
  };
}
function Xe(e) {
  return q(e).position === "static";
}
function Ot(e, t) {
  if (!Q(e) || q(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return J(e) === n && (n = n.ownerDocument.body), n;
}
function rn(e, t) {
  const n = U(e);
  if (qe(e))
    return n;
  if (!Q(e)) {
    let i2 = ie(e);
    for (; i2 && !ve(i2); ) {
      if (Y(i2) && !Xe(i2))
        return i2;
      i2 = ie(i2);
    }
    return n;
  }
  let r2 = Ot(e, t);
  for (; r2 && or(r2) && Xe(r2); )
    r2 = Ot(r2, t);
  return r2 && ve(r2) && Xe(r2) && !ft(r2) ? n : r2 || sr(e) || n;
}
var br = async function(e) {
  const t = this.getOffsetParent || rn, n = this.getDimensions, r2 = await n(e.floating);
  return {
    reference: gr(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r2.width,
      height: r2.height
    }
  };
};
function yr(e) {
  return q(e).direction === "rtl";
}
var wr = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ur,
  getDocumentElement: J,
  getClippingRect: vr,
  getOffsetParent: rn,
  getElementRects: br,
  getClientRects: lr,
  getDimensions: mr,
  getScale: de,
  isElement: Y,
  isRTL: yr
};
function on(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function xr(e, t) {
  let n = null, r2;
  const i2 = J(e);
  function o() {
    var a;
    clearTimeout(r2), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, c) {
    a === void 0 && (a = false), c === void 0 && (c = 1), o();
    const u = e.getBoundingClientRect(), {
      left: l,
      top: f,
      width: v,
      height: d
    } = u;
    if (a || t(), !v || !d)
      return;
    const m = Le(f), p = Le(i2.clientWidth - (l + v)), g = Le(i2.clientHeight - (f + d)), h = Le(l), E = {
      rootMargin: -m + "px " + -p + "px " + -g + "px " + -h + "px",
      threshold: se(0, De(1, c)) || 1
    };
    let P = true;
    function b2(S) {
      const C = S[0].intersectionRatio;
      if (C !== c) {
        if (!P)
          return s();
        C ? s(false, C) : r2 = setTimeout(() => {
          s(false, 1e-7);
        }, 1e3);
      }
      C === 1 && !on(u, e.getBoundingClientRect()) && s(), P = false;
    }
    try {
      n = new IntersectionObserver(b2, {
        ...E,
        // Handle <iframe>s
        root: i2.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(b2, E);
    }
    n.observe(e);
  }
  return s(true), o;
}
function Sr(e, t, n, r2) {
  r2 === void 0 && (r2 = {});
  const {
    ancestorScroll: i2 = true,
    ancestorResize: o = true,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: c = false
  } = r2, u = pt(e), l = i2 || o ? [...u ? Ee(u) : [], ...Ee(t)] : [];
  l.forEach((h) => {
    i2 && h.addEventListener("scroll", n, {
      passive: true
    }), o && h.addEventListener("resize", n);
  });
  const f = u && a ? xr(u, n) : null;
  let v = -1, d = null;
  s && (d = new ResizeObserver((h) => {
    let [x] = h;
    x && x.target === u && d && (d.unobserve(t), cancelAnimationFrame(v), v = requestAnimationFrame(() => {
      var E;
      (E = d) == null || E.observe(t);
    })), n();
  }), u && !c && d.observe(u), d.observe(t));
  let m, p = c ? ce(e) : null;
  c && g();
  function g() {
    const h = ce(e);
    p && !on(p, h) && n(), p = h, m = requestAnimationFrame(g);
  }
  return n(), () => {
    var h;
    l.forEach((x) => {
      i2 && x.removeEventListener("scroll", n), o && x.removeEventListener("resize", n);
    }), f == null || f(), (h = d) == null || h.disconnect(), d = null, c && cancelAnimationFrame(m);
  };
}
var Tr = rr;
var Er = ir;
var Cr = tr;
var Pr = (e, t, n) => {
  const r2 = /* @__PURE__ */ new Map(), i2 = {
    platform: wr,
    ...n
  }, o = {
    ...i2.platform,
    _c: r2
  };
  return er(e, t, {
    ...i2,
    platform: o
  });
};
var Mo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ar(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Re = { exports: {} };
var Or = Re.exports;
var kt;
function kr() {
  return kt || (kt = 1, function(e) {
    (function(t, n) {
      e.exports ? e.exports = n() : t.log = n();
    })(Or, function() {
      var t = function() {
      }, n = "undefined", r2 = typeof window !== n && typeof window.navigator !== n && /Trident\/|MSIE /.test(window.navigator.userAgent), i2 = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
      ], o = {}, s = null;
      function a(p, g) {
        var h = p[g];
        if (typeof h.bind == "function")
          return h.bind(p);
        try {
          return Function.prototype.bind.call(h, p);
        } catch {
          return function() {
            return Function.prototype.apply.apply(h, [p, arguments]);
          };
        }
      }
      function c() {
        console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
      }
      function u(p) {
        return p === "debug" && (p = "log"), typeof console === n ? false : p === "trace" && r2 ? c : console[p] !== void 0 ? a(console, p) : console.log !== void 0 ? a(console, "log") : t;
      }
      function l() {
        for (var p = this.getLevel(), g = 0; g < i2.length; g++) {
          var h = i2[g];
          this[h] = g < p ? t : this.methodFactory(h, p, this.name);
        }
        if (this.log = this.debug, typeof console === n && p < this.levels.SILENT)
          return "No console available for logging";
      }
      function f(p) {
        return function() {
          typeof console !== n && (l.call(this), this[p].apply(this, arguments));
        };
      }
      function v(p, g, h) {
        return u(p) || f.apply(this, arguments);
      }
      function d(p, g) {
        var h = this, x, E, P, b2 = "loglevel";
        typeof p == "string" ? b2 += ":" + p : typeof p == "symbol" && (b2 = void 0);
        function S(T2) {
          var L2 = (i2[T2] || "silent").toUpperCase();
          if (!(typeof window === n || !b2)) {
            try {
              window.localStorage[b2] = L2;
              return;
            } catch {
            }
            try {
              window.document.cookie = encodeURIComponent(b2) + "=" + L2 + ";";
            } catch {
            }
          }
        }
        function C() {
          var T2;
          if (!(typeof window === n || !b2)) {
            try {
              T2 = window.localStorage[b2];
            } catch {
            }
            if (typeof T2 === n)
              try {
                var L2 = window.document.cookie, oe = encodeURIComponent(b2), K = L2.indexOf(oe + "=");
                K !== -1 && (T2 = /^([^;]+)/.exec(
                  L2.slice(K + oe.length + 1)
                )[1]);
              } catch {
              }
            return h.levels[T2] === void 0 && (T2 = void 0), T2;
          }
        }
        function $2() {
          if (!(typeof window === n || !b2)) {
            try {
              window.localStorage.removeItem(b2);
            } catch {
            }
            try {
              window.document.cookie = encodeURIComponent(b2) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            } catch {
            }
          }
        }
        function I3(T2) {
          var L2 = T2;
          if (typeof L2 == "string" && h.levels[L2.toUpperCase()] !== void 0 && (L2 = h.levels[L2.toUpperCase()]), typeof L2 == "number" && L2 >= 0 && L2 <= h.levels.SILENT)
            return L2;
          throw new TypeError("log.setLevel() called with invalid level: " + T2);
        }
        h.name = p, h.levels = {
          TRACE: 0,
          DEBUG: 1,
          INFO: 2,
          WARN: 3,
          ERROR: 4,
          SILENT: 5
        }, h.methodFactory = g || v, h.getLevel = function() {
          return P ?? E ?? x;
        }, h.setLevel = function(T2, L2) {
          return P = I3(T2), L2 !== false && S(P), l.call(h);
        }, h.setDefaultLevel = function(T2) {
          E = I3(T2), C() || h.setLevel(T2, false);
        }, h.resetLevel = function() {
          P = null, $2(), l.call(h);
        }, h.enableAll = function(T2) {
          h.setLevel(h.levels.TRACE, T2);
        }, h.disableAll = function(T2) {
          h.setLevel(h.levels.SILENT, T2);
        }, h.rebuild = function() {
          if (s !== h && (x = I3(s.getLevel())), l.call(h), s === h)
            for (var T2 in o)
              o[T2].rebuild();
        }, x = I3(
          s ? s.getLevel() : "WARN"
        );
        var z2 = C();
        z2 != null && (P = I3(z2)), l.call(h);
      }
      s = new d(), s.getLogger = function(g) {
        if (typeof g != "symbol" && typeof g != "string" || g === "")
          throw new TypeError("You must supply a name when creating a logger.");
        var h = o[g];
        return h || (h = o[g] = new d(
          g,
          s.methodFactory
        )), h;
      };
      var m = typeof window !== n ? window.log : void 0;
      return s.noConflict = function() {
        return typeof window !== n && window.log === s && (window.log = m), s;
      }, s.getLoggers = function() {
        return o;
      }, s.default = s, s;
    });
  }(Re)), Re.exports;
}
var Lr = kr();
var _r = Ar(Lr);
var st = function(e, t) {
  return st = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r2) {
    n.__proto__ = r2;
  } || function(n, r2) {
    for (var i2 in r2) Object.prototype.hasOwnProperty.call(r2, i2) && (n[i2] = r2[i2]);
  }, st(e, t);
};
function ee(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  st(e, t);
  function n() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
}
function Ir(e, t, n, r2) {
  function i2(o) {
    return o instanceof n ? o : new n(function(s) {
      s(o);
    });
  }
  return new (n || (n = Promise))(function(o, s) {
    function a(l) {
      try {
        u(r2.next(l));
      } catch (f) {
        s(f);
      }
    }
    function c(l) {
      try {
        u(r2.throw(l));
      } catch (f) {
        s(f);
      }
    }
    function u(l) {
      l.done ? o(l.value) : i2(l.value).then(a, c);
    }
    u((r2 = r2.apply(e, t || [])).next());
  });
}
function sn(e, t) {
  var n = { label: 0, sent: function() {
    if (o[0] & 1) throw o[1];
    return o[1];
  }, trys: [], ops: [] }, r2, i2, o, s = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return s.next = a(0), s.throw = a(1), s.return = a(2), typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(u) {
    return function(l) {
      return c([u, l]);
    };
  }
  function c(u) {
    if (r2) throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, u[0] && (n = 0)), n; ) try {
      if (r2 = 1, i2 && (o = u[0] & 2 ? i2.return : u[0] ? i2.throw || ((o = i2.return) && o.call(i2), 0) : i2.next) && !(o = o.call(i2, u[1])).done) return o;
      switch (i2 = 0, o && (u = [u[0] & 2, o.value]), u[0]) {
        case 0:
        case 1:
          o = u;
          break;
        case 4:
          return n.label++, { value: u[1], done: false };
        case 5:
          n.label++, i2 = u[1], u = [0];
          continue;
        case 7:
          u = n.ops.pop(), n.trys.pop();
          continue;
        default:
          if (o = n.trys, !(o = o.length > 0 && o[o.length - 1]) && (u[0] === 6 || u[0] === 2)) {
            n = 0;
            continue;
          }
          if (u[0] === 3 && (!o || u[1] > o[0] && u[1] < o[3])) {
            n.label = u[1];
            break;
          }
          if (u[0] === 6 && n.label < o[1]) {
            n.label = o[1], o = u;
            break;
          }
          if (o && n.label < o[2]) {
            n.label = o[2], n.ops.push(u);
            break;
          }
          o[2] && n.ops.pop(), n.trys.pop();
          continue;
      }
      u = t.call(e, n);
    } catch (l) {
      u = [6, l], i2 = 0;
    } finally {
      r2 = o = 0;
    }
    if (u[0] & 5) throw u[1];
    return { value: u[0] ? u[1] : void 0, done: true };
  }
}
function me(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r2 = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number") return {
    next: function() {
      return e && r2 >= e.length && (e = void 0), { value: e && e[r2++], done: !e };
    }
  };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function ue(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var r2 = n.call(e), i2, o = [], s;
  try {
    for (; (t === void 0 || t-- > 0) && !(i2 = r2.next()).done; ) o.push(i2.value);
  } catch (a) {
    s = { error: a };
  } finally {
    try {
      i2 && !i2.done && (n = r2.return) && n.call(r2);
    } finally {
      if (s) throw s.error;
    }
  }
  return o;
}
function ge(e, t, n) {
  if (n || arguments.length === 2) for (var r2 = 0, i2 = t.length, o; r2 < i2; r2++)
    (o || !(r2 in t)) && (o || (o = Array.prototype.slice.call(t, 0, r2)), o[r2] = t[r2]);
  return e.concat(o || Array.prototype.slice.call(t));
}
function pe(e) {
  return this instanceof pe ? (this.v = e, this) : new pe(e);
}
function Rr(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r2 = n.apply(e, t || []), i2, o = [];
  return i2 = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), i2[Symbol.asyncIterator] = function() {
    return this;
  }, i2;
  function s(d) {
    return function(m) {
      return Promise.resolve(m).then(d, f);
    };
  }
  function a(d, m) {
    r2[d] && (i2[d] = function(p) {
      return new Promise(function(g, h) {
        o.push([d, p, g, h]) > 1 || c(d, p);
      });
    }, m && (i2[d] = m(i2[d])));
  }
  function c(d, m) {
    try {
      u(r2[d](m));
    } catch (p) {
      v(o[0][3], p);
    }
  }
  function u(d) {
    d.value instanceof pe ? Promise.resolve(d.value.v).then(l, f) : v(o[0][2], d);
  }
  function l(d) {
    c("next", d);
  }
  function f(d) {
    c("throw", d);
  }
  function v(d, m) {
    d(m), o.shift(), o.length && c(o[0][0], o[0][1]);
  }
}
function Mr(e) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator], n;
  return t ? t.call(e) : (e = typeof me == "function" ? me(e) : e[Symbol.iterator](), n = {}, r2("next"), r2("throw"), r2("return"), n[Symbol.asyncIterator] = function() {
    return this;
  }, n);
  function r2(o) {
    n[o] = e[o] && function(s) {
      return new Promise(function(a, c) {
        s = e[o](s), i2(a, c, s.done, s.value);
      });
    };
  }
  function i2(o, s, a, c) {
    Promise.resolve(c).then(function(u) {
      o({ value: u, done: a });
    }, s);
  }
}
function A(e) {
  return typeof e == "function";
}
function vt(e) {
  var t = function(r2) {
    Error.call(r2), r2.stack = new Error().stack;
  }, n = e(t);
  return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
}
var Ze = vt(function(e) {
  return function(n) {
    e(this), this.message = n ? n.length + ` errors occurred during unsubscription:
` + n.map(function(r2, i2) {
      return i2 + 1 + ") " + r2.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = n;
  };
});
function Ue(e, t) {
  if (e) {
    var n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var Oe = function() {
  function e(t) {
    this.initialTeardown = t, this.closed = false, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var t, n, r2, i2, o;
    if (!this.closed) {
      this.closed = true;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var a = me(s), c = a.next(); !c.done; c = a.next()) {
              var u = c.value;
              u.remove(this);
            }
          } catch (p) {
            t = { error: p };
          } finally {
            try {
              c && !c.done && (n = a.return) && n.call(a);
            } finally {
              if (t) throw t.error;
            }
          }
        else
          s.remove(this);
      var l = this.initialTeardown;
      if (A(l))
        try {
          l();
        } catch (p) {
          o = p instanceof Ze ? p.errors : [p];
        }
      var f = this._finalizers;
      if (f) {
        this._finalizers = null;
        try {
          for (var v = me(f), d = v.next(); !d.done; d = v.next()) {
            var m = d.value;
            try {
              Lt(m);
            } catch (p) {
              o = o ?? [], p instanceof Ze ? o = ge(ge([], ue(o)), ue(p.errors)) : o.push(p);
            }
          }
        } catch (p) {
          r2 = { error: p };
        } finally {
          try {
            d && !d.done && (i2 = v.return) && i2.call(v);
          } finally {
            if (r2) throw r2.error;
          }
        }
      }
      if (o)
        throw new Ze(o);
    }
  }, e.prototype.add = function(t) {
    var n;
    if (t && t !== this)
      if (this.closed)
        Lt(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this))
            return;
          t._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }, e.prototype._hasParent = function(t) {
    var n = this._parentage;
    return n === t || Array.isArray(n) && n.includes(t);
  }, e.prototype._addParent = function(t) {
    var n = this._parentage;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }, e.prototype._removeParent = function(t) {
    var n = this._parentage;
    n === t ? this._parentage = null : Array.isArray(n) && Ue(n, t);
  }, e.prototype.remove = function(t) {
    var n = this._finalizers;
    n && Ue(n, t), t instanceof e && t._removeParent(this);
  }, e.EMPTY = function() {
    var t = new e();
    return t.closed = true, t;
  }(), e;
}();
var an = Oe.EMPTY;
function cn(e) {
  return e instanceof Oe || e && "closed" in e && A(e.remove) && A(e.add) && A(e.unsubscribe);
}
function Lt(e) {
  A(e) ? e() : e.unsubscribe();
}
var Dr = {
  Promise: void 0
};
var $r = {
  setTimeout: function(e, t) {
    for (var n = [], r2 = 2; r2 < arguments.length; r2++)
      n[r2 - 2] = arguments[r2];
    return setTimeout.apply(void 0, ge([e, t], ue(n)));
  },
  clearTimeout: function(e) {
    return clearTimeout(e);
  },
  delegate: void 0
};
function un(e) {
  $r.setTimeout(function() {
    throw e;
  });
}
function je() {
}
function Me(e) {
  e();
}
var mt = function(e) {
  ee(t, e);
  function t(n) {
    var r2 = e.call(this) || this;
    return r2.isStopped = false, n ? (r2.destination = n, cn(n) && n.add(r2)) : r2.destination = Ur, r2;
  }
  return t.create = function(n, r2, i2) {
    return new Ce(n, r2, i2);
  }, t.prototype.next = function(n) {
    this.isStopped || this._next(n);
  }, t.prototype.error = function(n) {
    this.isStopped || (this.isStopped = true, this._error(n));
  }, t.prototype.complete = function() {
    this.isStopped || (this.isStopped = true, this._complete());
  }, t.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = true, e.prototype.unsubscribe.call(this), this.destination = null);
  }, t.prototype._next = function(n) {
    this.destination.next(n);
  }, t.prototype._error = function(n) {
    try {
      this.destination.error(n);
    } finally {
      this.unsubscribe();
    }
  }, t.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, t;
}(Oe);
var Nr = function() {
  function e(t) {
    this.partialObserver = t;
  }
  return e.prototype.next = function(t) {
    var n = this.partialObserver;
    if (n.next)
      try {
        n.next(t);
      } catch (r2) {
        _e(r2);
      }
  }, e.prototype.error = function(t) {
    var n = this.partialObserver;
    if (n.error)
      try {
        n.error(t);
      } catch (r2) {
        _e(r2);
      }
    else
      _e(t);
  }, e.prototype.complete = function() {
    var t = this.partialObserver;
    if (t.complete)
      try {
        t.complete();
      } catch (n) {
        _e(n);
      }
  }, e;
}();
var Ce = function(e) {
  ee(t, e);
  function t(n, r2, i2) {
    var o = e.call(this) || this, s;
    return A(n) || !n ? s = {
      next: n ?? void 0,
      error: r2 ?? void 0,
      complete: i2 ?? void 0
    } : s = n, o.destination = new Nr(s), o;
  }
  return t;
}(mt);
function _e(e) {
  un(e);
}
function Fr(e) {
  throw e;
}
var Ur = {
  closed: true,
  next: je,
  error: Fr,
  complete: je
};
var gt = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function bt(e) {
  return e;
}
function jr(e) {
  return e.length === 0 ? bt : e.length === 1 ? e[0] : function(n) {
    return e.reduce(function(r2, i2) {
      return i2(r2);
    }, n);
  };
}
var k = function() {
  function e(t) {
    t && (this._subscribe = t);
  }
  return e.prototype.lift = function(t) {
    var n = new e();
    return n.source = this, n.operator = t, n;
  }, e.prototype.subscribe = function(t, n, r2) {
    var i2 = this, o = Br(t) ? t : new Ce(t, n, r2);
    return Me(function() {
      var s = i2, a = s.operator, c = s.source;
      o.add(a ? a.call(o, c) : c ? i2._subscribe(o) : i2._trySubscribe(o));
    }), o;
  }, e.prototype._trySubscribe = function(t) {
    try {
      return this._subscribe(t);
    } catch (n) {
      t.error(n);
    }
  }, e.prototype.forEach = function(t, n) {
    var r2 = this;
    return n = _t(n), new n(function(i2, o) {
      var s = new Ce({
        next: function(a) {
          try {
            t(a);
          } catch (c) {
            o(c), s.unsubscribe();
          }
        },
        error: o,
        complete: i2
      });
      r2.subscribe(s);
    });
  }, e.prototype._subscribe = function(t) {
    var n;
    return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t);
  }, e.prototype[gt] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    return jr(t)(this);
  }, e.prototype.toPromise = function(t) {
    var n = this;
    return t = _t(t), new t(function(r2, i2) {
      var o;
      n.subscribe(function(s) {
        return o = s;
      }, function(s) {
        return i2(s);
      }, function() {
        return r2(o);
      });
    });
  }, e.create = function(t) {
    return new e(t);
  }, e;
}();
function _t(e) {
  var t;
  return (t = e ?? Dr.Promise) !== null && t !== void 0 ? t : Promise;
}
function Wr(e) {
  return e && A(e.next) && A(e.error) && A(e.complete);
}
function Br(e) {
  return e && e instanceof mt || Wr(e) && cn(e);
}
function Vr(e) {
  return A(e == null ? void 0 : e.lift);
}
function B(e) {
  return function(t) {
    if (Vr(t))
      return t.lift(function(n) {
        try {
          return e(n, this);
        } catch (r2) {
          this.error(r2);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function W(e, t, n, r2, i2) {
  return new Hr(e, t, n, r2, i2);
}
var Hr = function(e) {
  ee(t, e);
  function t(n, r2, i2, o, s, a) {
    var c = e.call(this, n) || this;
    return c.onFinalize = s, c.shouldUnsubscribe = a, c._next = r2 ? function(u) {
      try {
        r2(u);
      } catch (l) {
        n.error(l);
      }
    } : e.prototype._next, c._error = o ? function(u) {
      try {
        o(u);
      } catch (l) {
        n.error(l);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, c._complete = i2 ? function() {
      try {
        i2();
      } catch (u) {
        n.error(u);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, c;
  }
  return t.prototype.unsubscribe = function() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var r2 = this.closed;
      e.prototype.unsubscribe.call(this), !r2 && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }, t;
}(mt);
var zr = vt(function(e) {
  return function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
});
var Z = function(e) {
  ee(t, e);
  function t() {
    var n = e.call(this) || this;
    return n.closed = false, n.currentObservers = null, n.observers = [], n.isStopped = false, n.hasError = false, n.thrownError = null, n;
  }
  return t.prototype.lift = function(n) {
    var r2 = new It(this, this);
    return r2.operator = n, r2;
  }, t.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new zr();
  }, t.prototype.next = function(n) {
    var r2 = this;
    Me(function() {
      var i2, o;
      if (r2._throwIfClosed(), !r2.isStopped) {
        r2.currentObservers || (r2.currentObservers = Array.from(r2.observers));
        try {
          for (var s = me(r2.currentObservers), a = s.next(); !a.done; a = s.next()) {
            var c = a.value;
            c.next(n);
          }
        } catch (u) {
          i2 = { error: u };
        } finally {
          try {
            a && !a.done && (o = s.return) && o.call(s);
          } finally {
            if (i2) throw i2.error;
          }
        }
      }
    });
  }, t.prototype.error = function(n) {
    var r2 = this;
    Me(function() {
      if (r2._throwIfClosed(), !r2.isStopped) {
        r2.hasError = r2.isStopped = true, r2.thrownError = n;
        for (var i2 = r2.observers; i2.length; )
          i2.shift().error(n);
      }
    });
  }, t.prototype.complete = function() {
    var n = this;
    Me(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.isStopped = true;
        for (var r2 = n.observers; r2.length; )
          r2.shift().complete();
      }
    });
  }, t.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true, this.observers = this.currentObservers = null;
  }, Object.defineProperty(t.prototype, "observed", {
    get: function() {
      var n;
      return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
    },
    enumerable: false,
    configurable: true
  }), t.prototype._trySubscribe = function(n) {
    return this._throwIfClosed(), e.prototype._trySubscribe.call(this, n);
  }, t.prototype._subscribe = function(n) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
  }, t.prototype._innerSubscribe = function(n) {
    var r2 = this, i2 = this, o = i2.hasError, s = i2.isStopped, a = i2.observers;
    return o || s ? an : (this.currentObservers = null, a.push(n), new Oe(function() {
      r2.currentObservers = null, Ue(a, n);
    }));
  }, t.prototype._checkFinalizedStatuses = function(n) {
    var r2 = this, i2 = r2.hasError, o = r2.thrownError, s = r2.isStopped;
    i2 ? n.error(o) : s && n.complete();
  }, t.prototype.asObservable = function() {
    var n = new k();
    return n.source = this, n;
  }, t.create = function(n, r2) {
    return new It(n, r2);
  }, t;
}(k);
var It = function(e) {
  ee(t, e);
  function t(n, r2) {
    var i2 = e.call(this) || this;
    return i2.destination = n, i2.source = r2, i2;
  }
  return t.prototype.next = function(n) {
    var r2, i2;
    (i2 = (r2 = this.destination) === null || r2 === void 0 ? void 0 : r2.next) === null || i2 === void 0 || i2.call(r2, n);
  }, t.prototype.error = function(n) {
    var r2, i2;
    (i2 = (r2 = this.destination) === null || r2 === void 0 ? void 0 : r2.error) === null || i2 === void 0 || i2.call(r2, n);
  }, t.prototype.complete = function() {
    var n, r2;
    (r2 = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null || r2 === void 0 || r2.call(n);
  }, t.prototype._subscribe = function(n) {
    var r2, i2;
    return (i2 = (r2 = this.source) === null || r2 === void 0 ? void 0 : r2.subscribe(n)) !== null && i2 !== void 0 ? i2 : an;
  }, t;
}(Z);
var ln = function(e) {
  ee(t, e);
  function t(n) {
    var r2 = e.call(this) || this;
    return r2._value = n, r2;
  }
  return Object.defineProperty(t.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  }), t.prototype._subscribe = function(n) {
    var r2 = e.prototype._subscribe.call(this, n);
    return !r2.closed && n.next(this._value), r2;
  }, t.prototype.getValue = function() {
    var n = this, r2 = n.hasError, i2 = n.thrownError, o = n._value;
    if (r2)
      throw i2;
    return this._throwIfClosed(), o;
  }, t.prototype.next = function(n) {
    e.prototype.next.call(this, this._value = n);
  }, t;
}(Z);
var Yr = {
  now: function() {
    return Date.now();
  }
};
var qr = function(e) {
  ee(t, e);
  function t(n, r2) {
    return e.call(this) || this;
  }
  return t.prototype.schedule = function(n, r2) {
    return this;
  }, t;
}(Oe);
var Rt = {
  setInterval: function(e, t) {
    for (var n = [], r2 = 2; r2 < arguments.length; r2++)
      n[r2 - 2] = arguments[r2];
    return setInterval.apply(void 0, ge([e, t], ue(n)));
  },
  clearInterval: function(e) {
    return clearInterval(e);
  },
  delegate: void 0
};
var Kr = function(e) {
  ee(t, e);
  function t(n, r2) {
    var i2 = e.call(this, n, r2) || this;
    return i2.scheduler = n, i2.work = r2, i2.pending = false, i2;
  }
  return t.prototype.schedule = function(n, r2) {
    var i2;
    if (r2 === void 0 && (r2 = 0), this.closed)
      return this;
    this.state = n;
    var o = this.id, s = this.scheduler;
    return o != null && (this.id = this.recycleAsyncId(s, o, r2)), this.pending = true, this.delay = r2, this.id = (i2 = this.id) !== null && i2 !== void 0 ? i2 : this.requestAsyncId(s, this.id, r2), this;
  }, t.prototype.requestAsyncId = function(n, r2, i2) {
    return i2 === void 0 && (i2 = 0), Rt.setInterval(n.flush.bind(n, this), i2);
  }, t.prototype.recycleAsyncId = function(n, r2, i2) {
    if (i2 === void 0 && (i2 = 0), i2 != null && this.delay === i2 && this.pending === false)
      return r2;
    r2 != null && Rt.clearInterval(r2);
  }, t.prototype.execute = function(n, r2) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = false;
    var i2 = this._execute(n, r2);
    if (i2)
      return i2;
    this.pending === false && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, t.prototype._execute = function(n, r2) {
    var i2 = false, o;
    try {
      this.work(n);
    } catch (s) {
      i2 = true, o = s || new Error("Scheduled action threw falsy error");
    }
    if (i2)
      return this.unsubscribe(), o;
  }, t.prototype.unsubscribe = function() {
    if (!this.closed) {
      var n = this, r2 = n.id, i2 = n.scheduler, o = i2.actions;
      this.work = this.state = this.scheduler = null, this.pending = false, Ue(o, this), r2 != null && (this.id = this.recycleAsyncId(i2, r2, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, t;
}(qr);
var Mt = function() {
  function e(t, n) {
    n === void 0 && (n = e.now), this.schedulerActionCtor = t, this.now = n;
  }
  return e.prototype.schedule = function(t, n, r2) {
    return n === void 0 && (n = 0), new this.schedulerActionCtor(this, t).schedule(r2, n);
  }, e.now = Yr.now, e;
}();
var Gr = function(e) {
  ee(t, e);
  function t(n, r2) {
    r2 === void 0 && (r2 = Mt.now);
    var i2 = e.call(this, n, r2) || this;
    return i2.actions = [], i2._active = false, i2;
  }
  return t.prototype.flush = function(n) {
    var r2 = this.actions;
    if (this._active) {
      r2.push(n);
      return;
    }
    var i2;
    this._active = true;
    do
      if (i2 = n.execute(n.state, n.delay))
        break;
    while (n = r2.shift());
    if (this._active = false, i2) {
      for (; n = r2.shift(); )
        n.unsubscribe();
      throw i2;
    }
  }, t;
}(Mt);
var Qr = new Gr(Kr);
function Jr(e) {
  return e && A(e.schedule);
}
function Xr(e) {
  return e[e.length - 1];
}
function yt(e) {
  return Jr(Xr(e)) ? e.pop() : void 0;
}
var wt = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function fn(e) {
  return A(e == null ? void 0 : e.then);
}
function dn(e) {
  return A(e[gt]);
}
function pn(e) {
  return Symbol.asyncIterator && A(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function hn(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Zr() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var vn = Zr();
function mn(e) {
  return A(e == null ? void 0 : e[vn]);
}
function gn(e) {
  return Rr(this, arguments, function() {
    var n, r2, i2, o;
    return sn(this, function(s) {
      switch (s.label) {
        case 0:
          n = e.getReader(), s.label = 1;
        case 1:
          s.trys.push([1, , 9, 10]), s.label = 2;
        case 2:
          return [4, pe(n.read())];
        case 3:
          return r2 = s.sent(), i2 = r2.value, o = r2.done, o ? [4, pe(void 0)] : [3, 5];
        case 4:
          return [2, s.sent()];
        case 5:
          return [4, pe(i2)];
        case 6:
          return [4, s.sent()];
        case 7:
          return s.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return n.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function bn(e) {
  return A(e == null ? void 0 : e.getReader);
}
function H(e) {
  if (e instanceof k)
    return e;
  if (e != null) {
    if (dn(e))
      return ei(e);
    if (wt(e))
      return ti(e);
    if (fn(e))
      return ni(e);
    if (pn(e))
      return yn(e);
    if (mn(e))
      return ri(e);
    if (bn(e))
      return ii(e);
  }
  throw hn(e);
}
function ei(e) {
  return new k(function(t) {
    var n = e[gt]();
    if (A(n.subscribe))
      return n.subscribe(t);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function ti(e) {
  return new k(function(t) {
    for (var n = 0; n < e.length && !t.closed; n++)
      t.next(e[n]);
    t.complete();
  });
}
function ni(e) {
  return new k(function(t) {
    e.then(function(n) {
      t.closed || (t.next(n), t.complete());
    }, function(n) {
      return t.error(n);
    }).then(null, un);
  });
}
function ri(e) {
  return new k(function(t) {
    var n, r2;
    try {
      for (var i2 = me(e), o = i2.next(); !o.done; o = i2.next()) {
        var s = o.value;
        if (t.next(s), t.closed)
          return;
      }
    } catch (a) {
      n = { error: a };
    } finally {
      try {
        o && !o.done && (r2 = i2.return) && r2.call(i2);
      } finally {
        if (n) throw n.error;
      }
    }
    t.complete();
  });
}
function yn(e) {
  return new k(function(t) {
    oi(e, t).catch(function(n) {
      return t.error(n);
    });
  });
}
function ii(e) {
  return yn(gn(e));
}
function oi(e, t) {
  var n, r2, i2, o;
  return Ir(this, void 0, void 0, function() {
    var s, a;
    return sn(this, function(c) {
      switch (c.label) {
        case 0:
          c.trys.push([0, 5, 6, 11]), n = Mr(e), c.label = 1;
        case 1:
          return [4, n.next()];
        case 2:
          if (r2 = c.sent(), !!r2.done) return [3, 4];
          if (s = r2.value, t.next(s), t.closed)
            return [2];
          c.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return a = c.sent(), i2 = { error: a }, [3, 11];
        case 6:
          return c.trys.push([6, , 9, 10]), r2 && !r2.done && (o = n.return) ? [4, o.call(n)] : [3, 8];
        case 7:
          c.sent(), c.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (i2) throw i2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return t.complete(), [2];
      }
    });
  });
}
function re(e, t, n, r2, i2) {
  r2 === void 0 && (r2 = 0), i2 === void 0 && (i2 = false);
  var o = t.schedule(function() {
    n(), i2 ? e.add(this.schedule(null, r2)) : this.unsubscribe();
  }, r2);
  if (e.add(o), !i2)
    return o;
}
function wn(e, t) {
  return t === void 0 && (t = 0), B(function(n, r2) {
    n.subscribe(W(r2, function(i2) {
      return re(r2, e, function() {
        return r2.next(i2);
      }, t);
    }, function() {
      return re(r2, e, function() {
        return r2.complete();
      }, t);
    }, function(i2) {
      return re(r2, e, function() {
        return r2.error(i2);
      }, t);
    }));
  });
}
function xn(e, t) {
  return t === void 0 && (t = 0), B(function(n, r2) {
    r2.add(e.schedule(function() {
      return n.subscribe(r2);
    }, t));
  });
}
function si(e, t) {
  return H(e).pipe(xn(t), wn(t));
}
function ai(e, t) {
  return H(e).pipe(xn(t), wn(t));
}
function ci(e, t) {
  return new k(function(n) {
    var r2 = 0;
    return t.schedule(function() {
      r2 === e.length ? n.complete() : (n.next(e[r2++]), n.closed || this.schedule());
    });
  });
}
function ui(e, t) {
  return new k(function(n) {
    var r2;
    return re(n, t, function() {
      r2 = e[vn](), re(n, t, function() {
        var i2, o, s;
        try {
          i2 = r2.next(), o = i2.value, s = i2.done;
        } catch (a) {
          n.error(a);
          return;
        }
        s ? n.complete() : n.next(o);
      }, 0, true);
    }), function() {
      return A(r2 == null ? void 0 : r2.return) && r2.return();
    };
  });
}
function Sn(e, t) {
  if (!e)
    throw new Error("Iterable cannot be null");
  return new k(function(n) {
    re(n, t, function() {
      var r2 = e[Symbol.asyncIterator]();
      re(n, t, function() {
        r2.next().then(function(i2) {
          i2.done ? n.complete() : n.next(i2.value);
        });
      }, 0, true);
    });
  });
}
function li(e, t) {
  return Sn(gn(e), t);
}
function fi(e, t) {
  if (e != null) {
    if (dn(e))
      return si(e, t);
    if (wt(e))
      return ci(e, t);
    if (fn(e))
      return ai(e, t);
    if (pn(e))
      return Sn(e, t);
    if (mn(e))
      return ui(e, t);
    if (bn(e))
      return li(e, t);
  }
  throw hn(e);
}
function Ge(e, t) {
  return t ? fi(e, t) : H(e);
}
function Dt() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  var n = yt(e);
  return Ge(e, n);
}
function di(e) {
  return e instanceof Date && !isNaN(e);
}
var pi = vt(function(e) {
  return function(n) {
    n === void 0 && (n = null), e(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = n;
  };
});
function hi(e, t) {
  var n = di(e) ? { first: e } : typeof e == "number" ? { each: e } : e, r2 = n.first, i2 = n.each, o = n.with, s = o === void 0 ? vi : o, a = n.scheduler, c = a === void 0 ? Qr : a, u = n.meta, l = u === void 0 ? null : u;
  if (r2 == null && i2 == null)
    throw new TypeError("No timeout provided.");
  return B(function(f, v) {
    var d, m, p = null, g = 0, h = function(x) {
      m = re(v, c, function() {
        try {
          d.unsubscribe(), H(s({
            meta: l,
            lastValue: p,
            seen: g
          })).subscribe(v);
        } catch (E) {
          v.error(E);
        }
      }, x);
    };
    d = f.subscribe(W(v, function(x) {
      m == null || m.unsubscribe(), g++, v.next(p = x), i2 > 0 && h(i2);
    }, void 0, void 0, function() {
      m != null && m.closed || m == null || m.unsubscribe(), p = null;
    })), !g && h(r2 != null ? typeof r2 == "number" ? r2 : +r2 - c.now() : i2);
  });
}
function vi(e) {
  throw new pi(e);
}
function O(e, t) {
  return B(function(n, r2) {
    var i2 = 0;
    n.subscribe(W(r2, function(o) {
      r2.next(e.call(t, o, i2++));
    }));
  });
}
var mi = Array.isArray;
function gi(e, t) {
  return mi(t) ? e.apply(void 0, ge([], ue(t))) : e(t);
}
function bi(e) {
  return O(function(t) {
    return gi(e, t);
  });
}
function yi(e, t, n, r2, i2, o, s, a) {
  var c = [], u = 0, l = 0, f = false, v = function() {
    f && !c.length && !u && t.complete();
  }, d = function(p) {
    return u < r2 ? m(p) : c.push(p);
  }, m = function(p) {
    u++;
    var g = false;
    H(n(p, l++)).subscribe(W(t, function(h) {
      t.next(h);
    }, function() {
      g = true;
    }, void 0, function() {
      if (g)
        try {
          u--;
          for (var h = function() {
            var x = c.shift();
            s || m(x);
          }; c.length && u < r2; )
            h();
          v();
        } catch (x) {
          t.error(x);
        }
    }));
  };
  return e.subscribe(W(t, d, function() {
    f = true, v();
  })), function() {
  };
}
function xt(e, t, n) {
  return n === void 0 && (n = 1 / 0), A(t) ? xt(function(r2, i2) {
    return O(function(o, s) {
      return t(r2, o, i2, s);
    })(H(e(r2, i2)));
  }, n) : (typeof t == "number" && (n = t), B(function(r2, i2) {
    return yi(r2, i2, e, n);
  }));
}
function wi(e) {
  return xt(bt, e);
}
function xi() {
  return wi(1);
}
function We() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  return xi()(Ge(e, yt(e)));
}
var Si = ["addListener", "removeListener"];
var Ti = ["addEventListener", "removeEventListener"];
var Ei = ["on", "off"];
function at(e, t, n, r2) {
  if (A(n) && (r2 = n, n = void 0), r2)
    return at(e, t, n).pipe(bi(r2));
  var i2 = ue(Ai(e) ? Ti.map(function(a) {
    return function(c) {
      return e[a](t, c, n);
    };
  }) : Ci(e) ? Si.map($t(e, t)) : Pi(e) ? Ei.map($t(e, t)) : [], 2), o = i2[0], s = i2[1];
  if (!o && wt(e))
    return xt(function(a) {
      return at(a, t, n);
    })(H(e));
  if (!o)
    throw new TypeError("Invalid event target");
  return new k(function(a) {
    var c = function() {
      for (var u = [], l = 0; l < arguments.length; l++)
        u[l] = arguments[l];
      return a.next(1 < u.length ? u : u[0]);
    };
    return o(c), function() {
      return s(c);
    };
  });
}
function $t(e, t) {
  return function(n) {
    return function(r2) {
      return e[n](t, r2);
    };
  };
}
function Ci(e) {
  return A(e.addListener) && A(e.removeListener);
}
function Pi(e) {
  return A(e.on) && A(e.off);
}
function Ai(e) {
  return A(e.addEventListener) && A(e.removeEventListener);
}
function Qe(e, t) {
  return B(function(n, r2) {
    var i2 = 0;
    n.subscribe(W(r2, function(o) {
      return e.call(t, o, i2++) && r2.next(o);
    }));
  });
}
function Oi(e, t, n, r2, i2) {
  return function(o, s) {
    var a = n, c = t, u = 0;
    o.subscribe(W(s, function(l) {
      var f = u++;
      c = a ? e(c, l, f) : (a = true, l), s.next(c);
    }, i2));
  };
}
function ki(e, t) {
  return t === void 0 && (t = bt), e = e ?? Li, B(function(n, r2) {
    var i2, o = true;
    n.subscribe(W(r2, function(s) {
      var a = t(s);
      (o || !e(i2, a)) && (o = false, i2 = a, r2.next(s));
    }));
  });
}
function Li(e, t) {
  return e === t;
}
function ct(e, t) {
  return B(Oi(e, t, arguments.length >= 2, true));
}
function _i(e) {
  e === void 0 && (e = {});
  var t = e.connector, n = t === void 0 ? function() {
    return new Z();
  } : t, r2 = e.resetOnError, i2 = r2 === void 0 ? true : r2, o = e.resetOnComplete, s = o === void 0 ? true : o, a = e.resetOnRefCountZero, c = a === void 0 ? true : a;
  return function(u) {
    var l, f, v, d = 0, m = false, p = false, g = function() {
      f == null || f.unsubscribe(), f = void 0;
    }, h = function() {
      g(), l = v = void 0, m = p = false;
    }, x = function() {
      var E = l;
      h(), E == null || E.unsubscribe();
    };
    return B(function(E, P) {
      d++, !p && !m && g();
      var b2 = v = v ?? n();
      P.add(function() {
        d--, d === 0 && !p && !m && (f = et(x, c));
      }), b2.subscribe(P), !l && d > 0 && (l = new Ce({
        next: function(S) {
          return b2.next(S);
        },
        error: function(S) {
          p = true, g(), f = et(h, i2, S), b2.error(S);
        },
        complete: function() {
          m = true, g(), f = et(h, s), b2.complete();
        }
      }), H(E).subscribe(l));
    })(u);
  };
}
function et(e, t) {
  for (var n = [], r2 = 2; r2 < arguments.length; r2++)
    n[r2 - 2] = arguments[r2];
  if (t === true) {
    e();
    return;
  }
  if (t !== false) {
    var i2 = new Ce({
      next: function() {
        i2.unsubscribe(), e();
      }
    });
    return H(t.apply(void 0, ge([], ue(n)))).subscribe(i2);
  }
}
function Ii(e) {
  return B(function(t, n) {
    var r2 = false, i2 = W(n, function() {
      i2 == null || i2.unsubscribe(), r2 = true;
    }, je);
    H(e).subscribe(i2), t.subscribe(W(n, function(o) {
      return r2 && n.next(o);
    }));
  });
}
function D() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  var n = yt(e);
  return B(function(r2, i2) {
    (n ? We(e, r2, n) : We(e, r2)).subscribe(i2);
  });
}
function Tn(e, t) {
  return B(function(n, r2) {
    var i2 = null, o = 0, s = false, a = function() {
      return s && !i2 && r2.complete();
    };
    n.subscribe(W(r2, function(c) {
      i2 == null || i2.unsubscribe();
      var u = 0, l = o++;
      H(e(c, l)).subscribe(i2 = W(r2, function(f) {
        return r2.next(t ? t(c, f, l, u++) : f);
      }, function() {
        i2 = null, a();
      }));
    }, function() {
      s = true, a();
    }));
  });
}
function Nt(e) {
  return B(function(t, n) {
    H(e).subscribe(W(n, function() {
      return n.complete();
    }, je)), !n.closed && t.subscribe(n);
  });
}
var Ri = Object.defineProperty;
var Mi = Object.defineProperties;
var Di = Object.getOwnPropertyDescriptors;
var Ft = Object.getOwnPropertySymbols;
var $i = Object.prototype.hasOwnProperty;
var Ni = Object.prototype.propertyIsEnumerable;
var Ut = (e, t, n) => t in e ? Ri(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var X = (e, t) => {
  for (var n in t || (t = {}))
    $i.call(t, n) && Ut(e, n, t[n]);
  if (Ft)
    for (var n of Ft(t))
      Ni.call(t, n) && Ut(e, n, t[n]);
  return e;
};
var Te = (e, t) => Mi(e, Di(t));
var V = (e, t, n) => new Promise((r2, i2) => {
  var o = (c) => {
    try {
      a(n.next(c));
    } catch (u) {
      i2(u);
    }
  }, s = (c) => {
    try {
      a(n.throw(c));
    } catch (u) {
      i2(u);
    }
  }, a = (c) => c.done ? r2(c.value) : Promise.resolve(c.value).then(o, s);
  a((n = n.apply(e, t)).next());
});
var En = "lk";
function j(e) {
  return typeof e > "u" ? false : Fi(e) || Ui(e);
}
function Fi(e) {
  var t;
  return e ? e.hasOwnProperty("participant") && e.hasOwnProperty("source") && e.hasOwnProperty("track") && typeof ((t = e.publication) == null ? void 0 : t.track) < "u" : false;
}
function Ui(e) {
  return e ? e.hasOwnProperty("participant") && e.hasOwnProperty("source") && e.hasOwnProperty("publication") && typeof e.publication < "u" : false;
}
function Pe(e) {
  return e ? e.hasOwnProperty("participant") && e.hasOwnProperty("source") && typeof e.publication > "u" : false;
}
function N(e) {
  if (typeof e == "string" || typeof e == "number")
    return `${e}`;
  if (Pe(e))
    return `${e.participant.identity}_${e.source}_placeholder`;
  if (j(e))
    return `${e.participant.identity}_${e.publication.source}_${e.publication.trackSid}`;
  throw new Error(`Can't generate a id for the given track reference: ${e}`);
}
function Do(e, t) {
  return e === void 0 || t === void 0 ? false : j(e) && j(t) ? e.publication.trackSid === t.publication.trackSid : N(e) === N(t);
}
function $o(e, t) {
  return typeof t > "u" ? false : j(e) ? t.some(
    (n) => n.participant.identity === e.participant.identity && j(n) && n.publication.trackSid === e.publication.trackSid
  ) : Pe(e) ? t.some(
    (n) => n.participant.identity === e.participant.identity && Pe(n) && n.source === e.source
  ) : false;
}
function ji(e, t) {
  return Pe(e) && j(t) && t.participant.identity === e.participant.identity && t.source === e.source;
}
function No() {
  const e = document.createElement("p");
  e.style.width = "100%", e.style.height = "200px";
  const t = document.createElement("div");
  t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.visibility = "hidden", t.style.width = "200px", t.style.height = "150px", t.style.overflow = "hidden", t.appendChild(e), document.body.appendChild(t);
  const n = e.offsetWidth;
  t.style.overflow = "scroll";
  let r2 = e.offsetWidth;
  return n === r2 && (r2 = t.clientWidth), document.body.removeChild(t), n - r2;
}
function Fo() {
  return typeof document < "u";
}
function Wi(e) {
  e = X({}, e);
  const t = "(?:(?:[a-z]+:)?//)?", n = "(?:\\S+(?::\\S*)?@)?", r2 = new RegExp(
    "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}",
    "g"
  ).source, u = `(?:${t}|www\\.)${n}(?:localhost|${r2}|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#][^\\s"]*)?`;
  return e.exact ? new RegExp(`(?:^${u}$)`, "i") : new RegExp(u, "ig");
}
var jt = "[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*";
function Bi({ exact: e } = {}) {
  return e ? new RegExp(`^${jt}$`) : new RegExp(jt, "g");
}
function Uo(e, t, n) {
  return Sr(e, t, () => V(this, null, function* () {
    const { x: i2, y: o } = yield Pr(e, t, {
      placement: "top",
      middleware: [Tr(6), Cr(), Er({ padding: 5 })]
    });
    n == null || n(i2, o);
  }));
}
function jo(e, t) {
  return !e.contains(t.target);
}
var Wo = () => ({
  email: Bi(),
  url: Wi({})
});
function Bo(e, t) {
  const n = Object.entries(t).map(
    ([o, s], a) => Array.from(e.matchAll(s)).map(({ index: c, 0: u }) => ({
      type: o,
      weight: a,
      content: u,
      index: c ?? 0
    }))
  ).flat().sort((o, s) => {
    const a = o.index - s.index;
    return a !== 0 ? a : o.weight - s.weight;
  }).filter(({ index: o }, s, a) => {
    if (s === 0) return true;
    const c = a[s - 1];
    return c.index + c.content.length <= o;
  }), r2 = [];
  let i2 = 0;
  for (const { type: o, content: s, index: a } of n)
    a > i2 && r2.push(e.substring(i2, a)), r2.push({ type: o, content: s }), i2 = a + s.length;
  return e.length > i2 && r2.push(e.substring(i2)), r2;
}
var Vi = [
  RoomEvent.ConnectionStateChanged,
  RoomEvent.RoomMetadataChanged,
  RoomEvent.ActiveSpeakersChanged,
  RoomEvent.ConnectionQualityChanged,
  RoomEvent.ParticipantConnected,
  RoomEvent.ParticipantDisconnected,
  RoomEvent.ParticipantPermissionsChanged,
  RoomEvent.ParticipantMetadataChanged,
  RoomEvent.ParticipantNameChanged,
  RoomEvent.ParticipantAttributesChanged,
  RoomEvent.TrackMuted,
  RoomEvent.TrackUnmuted,
  RoomEvent.TrackPublished,
  RoomEvent.TrackUnpublished,
  RoomEvent.TrackStreamStateChanged,
  RoomEvent.TrackSubscriptionFailed,
  RoomEvent.TrackSubscriptionPermissionChanged,
  RoomEvent.TrackSubscriptionStatusChanged
];
var Cn = [
  ...Vi,
  RoomEvent.LocalTrackPublished,
  RoomEvent.LocalTrackUnpublished
];
var Hi = [
  ParticipantEvent.TrackPublished,
  ParticipantEvent.TrackUnpublished,
  ParticipantEvent.TrackMuted,
  ParticipantEvent.TrackUnmuted,
  ParticipantEvent.TrackStreamStateChanged,
  ParticipantEvent.TrackSubscribed,
  ParticipantEvent.TrackUnsubscribed,
  ParticipantEvent.TrackSubscriptionPermissionChanged,
  ParticipantEvent.TrackSubscriptionFailed,
  ParticipantEvent.LocalTrackPublished,
  ParticipantEvent.LocalTrackUnpublished
];
var zi = [
  ParticipantEvent.ConnectionQualityChanged,
  ParticipantEvent.IsSpeakingChanged,
  ParticipantEvent.ParticipantMetadataChanged,
  ParticipantEvent.ParticipantPermissionsChanged,
  ParticipantEvent.TrackMuted,
  ParticipantEvent.TrackUnmuted,
  ParticipantEvent.TrackPublished,
  ParticipantEvent.TrackUnpublished,
  ParticipantEvent.TrackStreamStateChanged,
  ParticipantEvent.TrackSubscriptionFailed,
  ParticipantEvent.TrackSubscriptionPermissionChanged,
  ParticipantEvent.TrackSubscriptionStatusChanged
];
var Pn = [
  ...zi,
  ParticipantEvent.LocalTrackPublished,
  ParticipantEvent.LocalTrackUnpublished
];
var _ = _r.getLogger("lk-components-js");
_.setDefaultLevel("WARN");
function Vo(e, t = {}) {
  var n;
  _.setLevel(e), setLogLevel((n = t.liveKitClientLogLevel) != null ? n : e);
}
function Ho(e, t = {}) {
  var n;
  const r2 = _.methodFactory;
  _.methodFactory = (i2, o, s) => {
    const a = r2(i2, o, s), c = LogLevel[i2], u = c >= o && c < LogLevel.silent;
    return (l, f) => {
      f ? a(l, f) : a(l), u && e(c, l, f);
    };
  }, _.setLevel(_.getLevel()), setLogExtension((n = t.liveKitClientLogExtension) != null ? n : e);
}
var zo = [
  {
    columns: 1,
    rows: 1
  },
  {
    columns: 1,
    rows: 2,
    orientation: "portrait"
  },
  {
    columns: 2,
    rows: 1,
    orientation: "landscape"
  },
  {
    columns: 2,
    rows: 2,
    minWidth: 560
  },
  {
    columns: 3,
    rows: 3,
    minWidth: 700
  },
  {
    columns: 4,
    rows: 4,
    minWidth: 960
  },
  {
    columns: 5,
    rows: 5,
    minWidth: 1100
  }
];
function Yi(e, t, n, r2) {
  if (e.length < 1)
    throw new Error("At least one grid layout definition must be provided.");
  const i2 = qi(e);
  if (n <= 0 || r2 <= 0)
    return i2[0];
  let o = 0;
  const s = n / r2 > 1 ? "landscape" : "portrait";
  let a = i2.find((c, u, l) => {
    o = u;
    const f = l.findIndex((v, d) => {
      const m = !v.orientation || v.orientation === s, p = d > u, g = v.maxTiles === c.maxTiles;
      return p && g && m;
    }) !== -1;
    return c.maxTiles >= t && !f;
  });
  if (a === void 0)
    if (a = i2[i2.length - 1], a)
      _.warn(
        `No layout found for: participantCount: ${t}, width/height: ${n}/${r2} fallback to biggest available layout (${a}).`
      );
    else
      throw new Error("No layout or fallback layout found.");
  if ((n < a.minWidth || r2 < a.minHeight) && o > 0) {
    const c = i2[o - 1];
    a = Yi(
      i2.slice(0, o),
      c.maxTiles,
      n,
      r2
    );
  }
  return a;
}
function qi(e) {
  return [...e].map((t) => {
    var n, r2;
    return {
      name: `${t.columns}x${t.rows}`,
      columns: t.columns,
      rows: t.rows,
      maxTiles: t.columns * t.rows,
      minWidth: (n = t.minWidth) != null ? n : 0,
      minHeight: (r2 = t.minHeight) != null ? r2 : 0,
      orientation: t.orientation
    };
  }).sort((t, n) => t.maxTiles !== n.maxTiles ? t.maxTiles - n.maxTiles : t.minWidth !== 0 || n.minWidth !== 0 ? t.minWidth - n.minWidth : t.minHeight !== 0 || n.minHeight !== 0 ? t.minHeight - n.minHeight : 0);
}
function Yo() {
  return typeof navigator < "u" && navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
}
function qo(e, t) {
  var n;
  return Te(X({}, e), {
    receivedAtMediaTimestamp: (n = t.rtpTimestamp) != null ? n : 0,
    receivedAt: t.timestamp
  });
}
function Ko(e, t, n) {
  return [...e, ...t].reduceRight((r2, i2) => (r2.find((o) => o.id === i2.id) || r2.unshift(i2), r2), []).slice(0 - n);
}
var An = [];
var On = {
  showChat: false,
  unreadMessages: 0,
  showSettings: false
};
function Ki(e) {
  return typeof e == "object";
}
function Go(e) {
  return Array.isArray(e) && e.filter(Ki).length > 0;
}
function kn(e, t) {
  return t.audioLevel - e.audioLevel;
}
function Ln(e, t) {
  return e.isSpeaking === t.isSpeaking ? 0 : e.isSpeaking ? -1 : 1;
}
function _n(e, t) {
  var n, r2, i2, o;
  return e.lastSpokeAt !== void 0 || t.lastSpokeAt !== void 0 ? ((r2 = (n = t.lastSpokeAt) == null ? void 0 : n.getTime()) != null ? r2 : 0) - ((o = (i2 = e.lastSpokeAt) == null ? void 0 : i2.getTime()) != null ? o : 0) : 0;
}
function Be(e, t) {
  var n, r2, i2, o;
  return ((r2 = (n = e.joinedAt) == null ? void 0 : n.getTime()) != null ? r2 : 0) - ((o = (i2 = t.joinedAt) == null ? void 0 : i2.getTime()) != null ? o : 0);
}
function Gi(e, t) {
  return j(e) ? j(t) ? 0 : -1 : j(t) ? 1 : 0;
}
function Qi(e, t) {
  const n = e.participant.isCameraEnabled, r2 = t.participant.isCameraEnabled;
  return n !== r2 ? n ? -1 : 1 : 0;
}
function Qo(e) {
  const t = [], n = [], r2 = [], i2 = [];
  e.forEach((a) => {
    a.participant.isLocal && a.source === Track.Source.Camera ? t.push(a) : a.source === Track.Source.ScreenShare ? n.push(a) : a.source === Track.Source.Camera ? r2.push(a) : i2.push(a);
  });
  const o = Ji(n), s = Xi(r2);
  return [...t, ...o, ...s, ...i2];
}
function Ji(e) {
  const t = [], n = [];
  return e.forEach((i2) => {
    i2.participant.isLocal ? t.push(i2) : n.push(i2);
  }), t.sort((i2, o) => Be(i2.participant, o.participant)), n.sort((i2, o) => Be(i2.participant, o.participant)), [...n, ...t];
}
function Xi(e) {
  const t = [], n = [];
  return e.forEach((r2) => {
    r2.participant.isLocal ? t.push(r2) : n.push(r2);
  }), n.sort((r2, i2) => r2.participant.isSpeaking && i2.participant.isSpeaking ? kn(r2.participant, i2.participant) : r2.participant.isSpeaking !== i2.participant.isSpeaking ? Ln(r2.participant, i2.participant) : r2.participant.lastSpokeAt !== i2.participant.lastSpokeAt ? _n(r2.participant, i2.participant) : j(r2) !== j(i2) ? Gi(r2, i2) : r2.participant.isCameraEnabled !== i2.participant.isCameraEnabled ? Qi(r2, i2) : Be(r2.participant, i2.participant)), [...t, ...n];
}
function Jo(e) {
  const t = [...e];
  t.sort((r2, i2) => {
    if (r2.isSpeaking && i2.isSpeaking)
      return kn(r2, i2);
    if (r2.isSpeaking !== i2.isSpeaking)
      return Ln(r2, i2);
    if (r2.lastSpokeAt !== i2.lastSpokeAt)
      return _n(r2, i2);
    const o = r2.videoTrackPublications.size > 0, s = i2.videoTrackPublications.size > 0;
    return o !== s ? o ? -1 : 1 : Be(r2, i2);
  });
  const n = t.find((r2) => r2.isLocal);
  if (n) {
    const r2 = t.indexOf(n);
    r2 >= 0 && (t.splice(r2, 1), t.length > 0 ? t.splice(0, 0, n) : t.push(n));
  }
  return t;
}
function Zi(e, t) {
  return e.reduce(
    (n, r2, i2) => i2 % t === 0 ? [...n, [r2]] : [...n.slice(0, -1), [...n.slice(-1)[0], r2]],
    []
  );
}
function Wt(e, t) {
  const n = Math.max(e.length, t.length);
  return new Array(n).fill([]).map((r2, i2) => [e[i2], t[i2]]);
}
function Ve(e, t, n) {
  return e.filter((r2) => !t.map((i2) => n(i2)).includes(n(r2)));
}
function ut(e) {
  return e.map((t) => typeof t == "string" || typeof t == "number" ? `${t}` : N(t));
}
function eo(e, t) {
  return {
    dropped: Ve(e, t, N),
    added: Ve(t, e, N)
  };
}
function to(e) {
  return e.added.length !== 0 || e.dropped.length !== 0;
}
function lt(e, t) {
  const n = t.findIndex(
    (r2) => N(r2) === N(e)
  );
  if (n === -1)
    throw new Error(
      `Element not part of the array: ${N(
        e
      )} not in ${ut(t)}`
    );
  return n;
}
function no(e, t, n) {
  const r2 = lt(e, n), i2 = lt(t, n);
  return n.splice(r2, 1, t), n.splice(i2, 1, e), n;
}
function ro(e, t) {
  const n = lt(e, t);
  return t.splice(n, 1), t;
}
function io(e, t) {
  return [...t, e];
}
function tt(e, t) {
  return Zi(e, t);
}
function Xo(e, t, n) {
  let r2 = oo(e, t);
  if (r2.length < t.length) {
    const s = Ve(t, r2, N);
    r2 = [...r2, ...s];
  }
  const i2 = tt(r2, n), o = tt(t, n);
  if (Wt(i2, o).forEach(([s, a], c) => {
    if (s && a) {
      const u = tt(r2, n)[c], l = eo(u, a);
      to(l) && (_.debug(
        `Detected visual changes on page: ${c}, current: ${ut(
          s
        )}, next: ${ut(a)}`,
        { changes: l }
      ), l.added.length === l.dropped.length && Wt(l.added, l.dropped).forEach(([f, v]) => {
        if (f && v)
          r2 = no(f, v, r2);
        else
          throw new Error(
            `For a swap action we need a addition and a removal one is missing: ${f}, ${v}`
          );
      }), l.added.length === 0 && l.dropped.length > 0 && l.dropped.forEach((f) => {
        r2 = ro(f, r2);
      }), l.added.length > 0 && l.dropped.length === 0 && l.added.forEach((f) => {
        r2 = io(f, r2);
      }));
    }
  }), r2.length > t.length) {
    const s = Ve(r2, t, N);
    r2 = r2.filter(
      (a) => !s.map(N).includes(N(a))
    );
  }
  return r2;
}
function oo(e, t) {
  return e.map((n) => {
    const r2 = t.find(
      (i2) => (
        // If the IDs match or ..
        N(n) === N(i2) || // ... if the current item is a placeholder and the new item is the track reference can replace it.
        typeof n != "number" && Pe(n) && j(i2) && ji(n, i2)
      )
    );
    return r2 ?? n;
  });
}
function F(e) {
  return `${En}-${e}`;
}
function Zo(e) {
  const t = Bt(e), n = In(e.participant).pipe(
    O(() => Bt(e)),
    D(t)
  );
  return { className: F(
    e.source === Track.Source.Camera || e.source === Track.Source.ScreenShare ? "participant-media-video" : "participant-media-audio"
  ), trackObserver: n };
}
function Bt(e) {
  if (j(e))
    return e.publication;
  {
    const { source: t, name: n, participant: r2 } = e;
    if (t && n)
      return r2.getTrackPublications().find((i2) => i2.source === t && i2.trackName === n);
    if (n)
      return r2.getTrackPublicationByName(n);
    if (t)
      return r2.getTrackPublication(t);
    throw new Error("At least one of source and name needs to be defined");
  }
}
function le(e, ...t) {
  return new k((r2) => {
    const i2 = () => {
      r2.next(e);
    };
    return t.forEach((s) => {
      e.on(s, i2);
    }), () => {
      t.forEach((s) => {
        e.off(s, i2);
      });
    };
  }).pipe(D(e));
}
function ye(e, t) {
  return new k((r2) => {
    const i2 = (...s) => {
      r2.next(s);
    };
    return e.on(t, i2), () => {
      e.off(t, i2);
    };
  });
}
function es(e) {
  return ye(e, RoomEvent.ConnectionStateChanged).pipe(
    O(([t]) => t),
    D(e.state)
  );
}
function ts(e) {
  return le(
    e,
    RoomEvent.RoomMetadataChanged,
    RoomEvent.ConnectionStateChanged
  ).pipe(
    O((n) => ({ name: n.name, metadata: n.metadata }))
  );
}
function ns(e) {
  return ye(e, RoomEvent.ActiveSpeakersChanged).pipe(
    O(([t]) => t)
  );
}
function rs(e, t, n = true) {
  const r2 = new k((o) => {
    Room.getLocalDevices(e, n).then((s) => {
      o.next(s), o.complete();
    }).catch((s) => {
      t == null || t(s), o.next([]), o.complete();
    });
  }), i2 = new k((o) => {
    var s;
    const a = () => V(this, null, function* () {
      try {
        const c = yield Room.getLocalDevices(e, n);
        o.next(c);
      } catch (c) {
        t == null || t(c);
      }
    });
    if (typeof window < "u") {
      if (!window.isSecureContext)
        throw new Error(
          "Accessing media devices is available only in secure contexts (HTTPS and localhost), in some or all supporting browsers. See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices"
        );
      (s = navigator == null ? void 0 : navigator.mediaDevices) == null || s.addEventListener("devicechange", a);
    }
    return () => {
      var c;
      (c = navigator == null ? void 0 : navigator.mediaDevices) == null || c.removeEventListener("devicechange", a);
    };
  });
  return We(r2, i2);
}
function so(e) {
  return ye(e, RoomEvent.DataReceived);
}
function ao(e) {
  return le(e, RoomEvent.AudioPlaybackStatusChanged).pipe(
    O((n) => ({ canPlayAudio: n.canPlaybackAudio }))
  );
}
function co(e) {
  return le(e, RoomEvent.VideoPlaybackStatusChanged).pipe(
    O((n) => ({ canPlayVideo: n.canPlaybackVideo }))
  );
}
function uo(e, t) {
  return ye(e, RoomEvent.ActiveDeviceChanged).pipe(
    Qe(([n]) => n === t),
    O(([n, r2]) => (_.debug("activeDeviceObservable | RoomEvent.ActiveDeviceChanged", { kind: n, deviceId: r2 }), r2))
  );
}
function is(e, t) {
  return ye(e, RoomEvent.ParticipantEncryptionStatusChanged).pipe(
    Qe(
      ([, n]) => (t == null ? void 0 : t.identity) === (n == null ? void 0 : n.identity) || !n && (t == null ? void 0 : t.identity) === e.localParticipant.identity
    ),
    O(([n]) => n),
    D(
      t != null && t.isLocal ? t.isE2EEEnabled : !!(t != null && t.isEncrypted)
    )
  );
}
function os(e) {
  return ye(e, RoomEvent.RecordingStatusChanged).pipe(
    O(([t]) => t),
    D(e.isRecording)
  );
}
function we(e, ...t) {
  return new k((r2) => {
    const i2 = () => {
      r2.next(e);
    };
    return t.forEach((s) => {
      e.on(s, i2);
    }), () => {
      t.forEach((s) => {
        e.off(s, i2);
      });
    };
  }).pipe(D(e));
}
function In(e) {
  return we(
    e,
    ParticipantEvent.TrackMuted,
    ParticipantEvent.TrackUnmuted,
    ParticipantEvent.ParticipantPermissionsChanged,
    // ParticipantEvent.IsSpeakingChanged,
    ParticipantEvent.TrackPublished,
    ParticipantEvent.TrackUnpublished,
    ParticipantEvent.LocalTrackPublished,
    ParticipantEvent.LocalTrackUnpublished,
    ParticipantEvent.MediaDevicesError,
    ParticipantEvent.TrackSubscriptionStatusChanged
    // ParticipantEvent.ConnectionQualityChanged,
  ).pipe(
    O((n) => {
      const { isMicrophoneEnabled: r2, isCameraEnabled: i2, isScreenShareEnabled: o } = n, s = n.getTrackPublication(Track.Source.Microphone), a = n.getTrackPublication(Track.Source.Camera);
      return {
        isCameraEnabled: i2,
        isMicrophoneEnabled: r2,
        isScreenShareEnabled: o,
        cameraTrack: a,
        microphoneTrack: s,
        participant: n
      };
    })
  );
}
function lo(e) {
  return e ? we(
    e,
    ParticipantEvent.ParticipantMetadataChanged,
    ParticipantEvent.ParticipantNameChanged
  ).pipe(
    O(({ name: n, identity: r2, metadata: i2 }) => ({
      name: n,
      identity: r2,
      metadata: i2
    })),
    D({
      name: e.name,
      identity: e.identity,
      metadata: e.metadata
    })
  ) : void 0;
}
function fo(e) {
  return Je(
    e,
    ParticipantEvent.ConnectionQualityChanged
  ).pipe(
    O(([n]) => n),
    D(e.connectionQuality)
  );
}
function Je(e, t) {
  return new k((r2) => {
    const i2 = (...s) => {
      r2.next(s);
    };
    return e.on(t, i2), () => {
      e.off(t, i2);
    };
  });
}
function po(e) {
  var t, n, r2, i2;
  return we(
    e.participant,
    ParticipantEvent.TrackMuted,
    ParticipantEvent.TrackUnmuted,
    ParticipantEvent.TrackSubscribed,
    ParticipantEvent.TrackUnsubscribed,
    ParticipantEvent.LocalTrackPublished,
    ParticipantEvent.LocalTrackUnpublished
  ).pipe(
    O((o) => {
      var s, a;
      const c = (s = e.publication) != null ? s : o.getTrackPublication(e.source);
      return (a = c == null ? void 0 : c.isMuted) != null ? a : true;
    }),
    D(
      (i2 = (r2 = (t = e.publication) == null ? void 0 : t.isMuted) != null ? r2 : (n = e.participant.getTrackPublication(e.source)) == null ? void 0 : n.isMuted) != null ? i2 : true
    )
  );
}
function ss(e) {
  return Je(e, ParticipantEvent.IsSpeakingChanged).pipe(
    O(([t]) => t)
  );
}
function as(e, t = {}) {
  var n;
  let r2;
  const i2 = new k((c) => (r2 = c, () => a.unsubscribe())).pipe(D(Array.from(e.remoteParticipants.values()))), o = (n = t.additionalRoomEvents) != null ? n : Cn, s = Array.from(
    /* @__PURE__ */ new Set([
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.ConnectionStateChanged,
      ...o
    ])
  ), a = le(e, ...s).subscribe(
    (c) => r2 == null ? void 0 : r2.next(Array.from(c.remoteParticipants.values()))
  );
  return e.remoteParticipants.size > 0 && (r2 == null || r2.next(Array.from(e.remoteParticipants.values()))), i2;
}
function cs(e, t, n = {}) {
  var r2;
  const i2 = (r2 = n.additionalEvents) != null ? r2 : Pn;
  return le(
    e,
    RoomEvent.ParticipantConnected,
    RoomEvent.ParticipantDisconnected,
    RoomEvent.ConnectionStateChanged
  ).pipe(
    Tn((s) => {
      const a = s.getParticipantByIdentity(t);
      return a ? we(a, ...i2) : new k((c) => c.next(void 0));
    }),
    D(e.getParticipantByIdentity(t))
  );
}
function us(e) {
  return Je(
    e,
    ParticipantEvent.ParticipantPermissionsChanged
  ).pipe(
    O(() => e.permissions),
    D(e.permissions)
  );
}
function ls(e, { kind: t, identity: n }, r2 = {}) {
  var i2;
  const o = (i2 = r2.additionalEvents) != null ? i2 : Pn, s = (c) => {
    let u = true;
    return t && (u = u && c.kind === t), n && (u = u && c.identity === n), u;
  };
  return le(
    e,
    RoomEvent.ParticipantConnected,
    RoomEvent.ParticipantDisconnected,
    RoomEvent.ConnectionStateChanged
  ).pipe(
    Tn((c) => {
      const u = Array.from(c.remoteParticipants.values()).find(
        (l) => s(l)
      );
      return u ? we(u, ...o) : new k((l) => l.next(void 0));
    }),
    D(Array.from(e.remoteParticipants.values()).find((c) => s(c)))
  );
}
function fs(e) {
  return typeof e > "u" ? new k() : Je(e, ParticipantEvent.AttributesChanged).pipe(
    O(([t]) => ({
      changed: t,
      attributes: e.attributes
    })),
    D({ changed: e.attributes, attributes: e.attributes })
  );
}
function ds(e, t, n, r2, i2) {
  const { localParticipant: o } = t, s = (f, v) => {
    let d = false;
    switch (f) {
      case Track.Source.Camera:
        d = v.isCameraEnabled;
        break;
      case Track.Source.Microphone:
        d = v.isMicrophoneEnabled;
        break;
      case Track.Source.ScreenShare:
        d = v.isScreenShareEnabled;
        break;
    }
    return d;
  }, a = In(o).pipe(
    O((f) => s(e, f.participant)),
    D(s(e, o))
  ), c = new Z(), u = (f, v) => V(this, null, function* () {
    try {
      switch (v ?? (v = n), c.next(true), e) {
        case Track.Source.Camera:
          return yield o.setCameraEnabled(
            f ?? !o.isCameraEnabled,
            v,
            r2
          ), o.isCameraEnabled;
        case Track.Source.Microphone:
          return yield o.setMicrophoneEnabled(
            f ?? !o.isMicrophoneEnabled,
            v,
            r2
          ), o.isMicrophoneEnabled;
        case Track.Source.ScreenShare:
          return yield o.setScreenShareEnabled(
            f ?? !o.isScreenShareEnabled,
            v,
            r2
          ), o.isScreenShareEnabled;
        default:
          throw new TypeError("Tried to toggle unsupported source");
      }
    } catch (d) {
      if (i2 && d instanceof Error) {
        i2 == null || i2(d);
        return;
      } else
        throw d;
    } finally {
      c.next(false);
    }
  });
  return {
    className: F("button"),
    toggle: u,
    enabledObserver: a,
    pendingObserver: c.asObservable()
  };
}
function ps() {
  let e = false;
  const t = new Z(), n = new Z(), r2 = (o) => V(this, null, function* () {
    n.next(true), e = o ?? !e, t.next(e), n.next(false);
  });
  return {
    className: F("button"),
    toggle: r2,
    enabledObserver: t.asObservable(),
    pendingObserver: n.asObservable()
  };
}
function hs(e, t, n) {
  const r2 = new ln(void 0), i2 = uo(t, e), o = (a, ...c) => V(this, [a, ...c], function* (u, l = {}) {
    var f, v, d;
    if (t) {
      _.debug(`Switching active device of kind "${e}" with id ${u}.`), yield t.switchActiveDevice(e, u, l.exact);
      const m = (f = t.getActiveDevice(e)) != null ? f : u;
      m !== u && u !== "default" && _.info(
        `We tried to select the device with id (${u}), but the browser decided to select the device with id (${m}) instead.`
      );
      let p;
      e === "audioinput" ? p = (v = t.localParticipant.getTrackPublication(Track.Source.Microphone)) == null ? void 0 : v.track : e === "videoinput" && (p = (d = t.localParticipant.getTrackPublication(Track.Source.Camera)) == null ? void 0 : d.track);
      const g = u === "default" && !p || u === "default" && (p == null ? void 0 : p.mediaStreamTrack.label.startsWith("Default"));
      r2.next(g ? u : m);
    }
  });
  return {
    className: F("media-device-select"),
    activeDeviceObservable: i2,
    setActiveMediaDevice: o
  };
}
function vs(e) {
  const t = (r2) => {
    e.disconnect(r2);
  };
  return { className: F("disconnect-button"), disconnect: t };
}
function ms(e) {
  const t = F("connection-quality"), n = fo(e);
  return { className: t, connectionQualityObserver: n };
}
function gs(e) {
  let t = "track-muted-indicator-camera";
  switch (e.source) {
    case Track.Source.Camera:
      t = "track-muted-indicator-camera";
      break;
    case Track.Source.Microphone:
      t = "track-muted-indicator-microphone";
      break;
  }
  const n = F(t), r2 = po(e);
  return { className: n, mediaMutedObserver: r2 };
}
function bs(e) {
  return { className: "lk-participant-name", infoObserver: lo(e) };
}
function ys() {
  return {
    className: F("participant-tile")
  };
}
var ho = {
  CHAT: "lk.chat",
  TRANSCRIPTION: "lk.transcription"
};
var vo = {
  CHAT: "lk-chat-topic"
};
function Rn(e, t) {
  return V(this, arguments, function* (n, r2, i2 = {}) {
    const { reliable: o, destinationIdentities: s, topic: a } = i2;
    yield n.publishData(r2, {
      destinationIdentities: s,
      topic: a,
      reliable: o
    });
  });
}
function mo(e, t, n) {
  const r2 = Array.isArray(t) ? t : [t], i2 = so(e).pipe(
    Qe(
      ([, , , c]) => t === void 0 || c !== void 0 && r2.includes(c)
    ),
    O(([c, u, , l]) => {
      const f = {
        payload: c,
        topic: l,
        from: u
      };
      return n == null || n(f), f;
    })
  );
  let o;
  const s = new k((c) => {
    o = c;
  });
  return { messageObservable: i2, isSendingObservable: s, send: (c, ...u) => V(this, [c, ...u], function* (l, f = {}) {
    o.next(true);
    try {
      yield Rn(e.localParticipant, l, X({ topic: r2[0] }, f));
    } finally {
      o.next(false);
    }
  }) };
}
var Ie = /* @__PURE__ */ new WeakMap();
function go(e) {
  return e.ignoreLegacy == true;
}
var bo = (e) => JSON.parse(new TextDecoder().decode(e));
var yo = (e) => new TextEncoder().encode(JSON.stringify(e));
function ws(e, t) {
  var n, r2, i2, o, s, a;
  const c = () => {
    var b2, S, C;
    return ((b2 = e.serverInfo) == null ? void 0 : b2.edition) === 1 || !!((S = e.serverInfo) != null && S.version) && compareVersions((C = e.serverInfo) == null ? void 0 : C.version, "1.8.2") > 0;
  }, u = new Z(), l = (n = t == null ? void 0 : t.channelTopic) != null ? n : ho.CHAT, f = (r2 = t == null ? void 0 : t.channelTopic) != null ? r2 : vo.CHAT;
  let v = false;
  Ie.has(e) || (v = true);
  const d = (i2 = Ie.get(e)) != null ? i2 : /* @__PURE__ */ new Map(), m = (o = d.get(l)) != null ? o : new Z();
  d.set(l, m), Ie.set(e, d);
  const p = (s = t == null ? void 0 : t.messageDecoder) != null ? s : bo;
  if (v) {
    e.registerTextStreamHandler(l, (S, C) => V(this, null, function* () {
      const { id: $2, timestamp: I3 } = S.info;
      Ge(S).pipe(
        ct((T2, L2) => T2 + L2),
        O((T2) => ({
          id: $2,
          timestamp: I3,
          message: T2,
          from: e.getParticipantByIdentity(C.identity)
          // editTimestamp: type === 'update' ? timestamp : undefined,
        }))
      ).subscribe({
        next: (T2) => m.next(T2)
      });
    }));
    const { messageObservable: b2 } = mo(e, [f]);
    b2.pipe(
      O((S) => {
        const C = p(S.payload);
        return go(C) ? void 0 : Te(X({}, C), { from: S.from });
      }),
      Qe((S) => !!S),
      Nt(u)
    ).subscribe(m);
  }
  const g = m.pipe(
    ct((b2, S) => {
      if ("id" in S && b2.find((C) => {
        var $2, I3;
        return (($2 = C.from) == null ? void 0 : $2.identity) === ((I3 = S.from) == null ? void 0 : I3.identity) && C.id === S.id;
      })) {
        const C = b2.findIndex(($2) => $2.id === S.id);
        if (C > -1) {
          const $2 = b2[C];
          b2[C] = Te(X({}, S), {
            timestamp: $2.timestamp,
            editTimestamp: S.timestamp
          });
        }
        return [...b2];
      }
      return [...b2, S];
    }, []),
    Nt(u)
  ), h = new ln(false), x = (a = t == null ? void 0 : t.messageEncoder) != null ? a : yo, E = (b2, S) => V(this, null, function* () {
    var C;
    S || (S = {}), (C = S.topic) != null || (S.topic = l), h.next(true);
    try {
      const I3 = {
        id: (yield e.localParticipant.sendText(b2, S)).id,
        timestamp: Date.now(),
        message: b2,
        from: e.localParticipant,
        attachedFiles: S.attachments
      };
      m.next(I3);
      const z2 = x(Te(X({}, I3), {
        ignoreLegacy: c()
      }));
      try {
        yield Rn(e.localParticipant, z2, {
          reliable: true,
          topic: f
        });
      } catch (T2) {
        _.info("could not send message in legacy chat format", T2);
      }
      return I3;
    } finally {
      h.next(false);
    }
  });
  function P() {
    u.next(), u.complete(), m.complete(), Ie.delete(e), e.unregisterTextStreamHandler(l);
  }
  return e.once(RoomEvent.Disconnected, P), {
    messageObservable: g,
    isSendingObservable: h,
    send: E
  };
}
function xs() {
  const e = (n) => V(this, null, function* () {
    _.info("Start Audio for room: ", n), yield n.startAudio();
  });
  return { className: F("start-audio-button"), roomAudioPlaybackAllowedObservable: ao, handleStartAudioPlayback: e };
}
function Ss() {
  const e = (n) => V(this, null, function* () {
    _.info("Start Video for room: ", n), yield n.startVideo();
  });
  return { className: F("start-audio-button"), roomVideoPlaybackAllowedObservable: co, handleStartVideoPlayback: e };
}
function Ts() {
  return { className: [F("button"), F("chat-toggle")].join(" ") };
}
function Es() {
  return { className: [F("button"), F("focus-toggle-button")].join(" ") };
}
function Cs() {
  return { className: "lk-clear-pin-button lk-button" };
}
function Ps() {
  return { className: "lk-room-container" };
}
function Vt(e, t, n = true) {
  const i2 = [e.localParticipant, ...Array.from(e.remoteParticipants.values())], o = [];
  return i2.forEach((s) => {
    t.forEach((a) => {
      const c = Array.from(
        s.trackPublications.values()
      ).filter(
        (u) => u.source === a && // either return all or only the ones that are subscribed
        (!n || u.track)
      ).map((u) => ({
        participant: s,
        publication: u,
        source: u.source
      }));
      o.push(...c);
    });
  }), { trackReferences: o, participants: i2 };
}
function Ht(e, t, n = false) {
  const { sources: r2, kind: i2, name: o } = t;
  return Array.from(e.trackPublications.values()).filter(
    (a) => (!r2 || r2.includes(a.source)) && (!i2 || a.kind === i2) && (!o || a.trackName === o) && // either return all or only the ones that are subscribed
    (!n || a.track)
  ).map((a) => ({
    participant: e,
    publication: a,
    source: a.source
  }));
}
function As(e, t, n) {
  var r2, i2;
  const o = (r2 = n.additionalRoomEvents) != null ? r2 : Cn, s = (i2 = n.onlySubscribed) != null ? i2 : true, a = Array.from(
    (/* @__PURE__ */ new Set([
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.ConnectionStateChanged,
      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
      RoomEvent.TrackPublished,
      RoomEvent.TrackUnpublished,
      RoomEvent.TrackSubscriptionStatusChanged,
      ...o
    ])).values()
  );
  return le(e, ...a).pipe(
    O((u) => {
      const l = Vt(u, t, s);
      return _.debug(`TrackReference[] was updated. (length ${l.trackReferences.length})`, l), l;
    }),
    D(Vt(e, t, s))
  );
}
function Os(e, t) {
  return we(e, ...Hi).pipe(
    O((r2) => {
      const i2 = Ht(r2, t);
      return _.debug(`TrackReference[] was updated. (length ${i2.length})`, i2), i2;
    }),
    D(Ht(e, t))
  );
}
function Mn(e, t) {
  return new k((r2) => {
    const i2 = (...s) => {
      r2.next(s);
    };
    return e.on(t, i2), () => {
      e.off(t, i2);
    };
  });
}
function ks(e) {
  return Mn(e, TrackEvent.TranscriptionReceived);
}
function Ls(e) {
  return Mn(e, TrackEvent.TimeSyncUpdate).pipe(
    O(([t]) => t)
  );
}
function _s(e, t = 1e3) {
  if (e === null) return Dt(false);
  const n = at(e, "mousemove", { passive: true }).pipe(O(() => true)), r2 = n.pipe(
    hi({
      each: t,
      with: () => We(Dt(false), r2.pipe(Ii(n)))
    }),
    ki()
  );
  return r2;
}
function wo(e, t) {
  if (typeof localStorage > "u") {
    _.error("Local storage is not available.");
    return;
  }
  try {
    if (t) {
      const n = Object.fromEntries(
        Object.entries(t).filter(([, r2]) => r2 !== "")
      );
      localStorage.setItem(e, JSON.stringify(n));
    }
  } catch (n) {
    _.error(`Error setting item to local storage: ${n}`);
  }
}
function xo(e) {
  if (typeof localStorage > "u") {
    _.error("Local storage is not available.");
    return;
  }
  try {
    const t = localStorage.getItem(e);
    if (!t) {
      _.warn(`Item with key ${e} does not exist in local storage.`);
      return;
    }
    return JSON.parse(t);
  } catch (t) {
    _.error(`Error getting item from local storage: ${t}`);
    return;
  }
}
function So(e) {
  return {
    load: () => xo(e),
    save: (t) => wo(e, t)
  };
}
var To = `${En}-user-choices`;
var Se = {
  videoEnabled: true,
  audioEnabled: true,
  videoDeviceId: "default",
  audioDeviceId: "default",
  username: ""
};
var { load: Eo, save: Co } = So(To);
function Is(e, t = false) {
  t !== true && Co(e);
}
function Rs(e, t = false) {
  var n, r2, i2, o, s;
  const a = {
    videoEnabled: (n = e == null ? void 0 : e.videoEnabled) != null ? n : Se.videoEnabled,
    audioEnabled: (r2 = e == null ? void 0 : e.audioEnabled) != null ? r2 : Se.audioEnabled,
    videoDeviceId: (i2 = e == null ? void 0 : e.videoDeviceId) != null ? i2 : Se.videoDeviceId,
    audioDeviceId: (o = e == null ? void 0 : e.audioDeviceId) != null ? o : Se.audioDeviceId,
    username: (s = e == null ? void 0 : e.username) != null ? s : Se.username
  };
  if (t)
    return a;
  {
    const c = Eo();
    return X(X({}, a), c ?? {});
  }
}
var nt = null;
var rt = null;
var Po = 0;
function zt() {
  return nt || (nt = /* @__PURE__ */ new Map()), nt;
}
function Ao() {
  return rt || (rt = /* @__PURE__ */ new WeakMap()), rt;
}
function Oo(e, t) {
  const n = Ao();
  let r2 = n.get(e);
  return r2 || (r2 = `room_${Po++}`, n.set(e, r2)), `${r2}:${t}`;
}
function Ms(e, t) {
  const n = Oo(e, t), r2 = zt(), i2 = r2.get(n);
  if (i2)
    return i2;
  const o = new Z(), s = [], a = "lk.segment_id";
  e.registerTextStreamHandler(t, (u, l) => V(this, null, function* () {
    var f;
    const v = Ge(u).pipe(
      ct((m, p) => m + p, "")
    ), d = !!((f = u.info.attributes) != null && f[a]);
    v.subscribe((m) => {
      const p = s.findIndex(
        (g) => {
          var h, x;
          return g.streamInfo.id === u.info.id || d && ((h = g.streamInfo.attributes) == null ? void 0 : h[a]) === ((x = u.info.attributes) == null ? void 0 : x[a]);
        }
      );
      p !== -1 ? (s[p] = Te(X({}, s[p]), {
        text: m
      }), o.next([...s])) : (s.push({
        text: m,
        participantInfo: l,
        streamInfo: u.info
      }), o.next([...s]));
    });
  }));
  const c = o.asObservable().pipe(_i());
  return r2.set(n, c), e.once(RoomEvent.Disconnected, () => {
    e.unregisterTextStreamHandler(t), o.complete(), zt().delete(n);
  }), c;
}
function Dn(e, t) {
  if (t.msg === "show_chat")
    return { ...e, showChat: true, unreadMessages: 0 };
  if (t.msg === "hide_chat")
    return { ...e, showChat: false };
  if (t.msg === "toggle_chat") {
    const n = { ...e, showChat: !e.showChat };
    return n.showChat === true && (n.unreadMessages = 0), n;
  } else return t.msg === "unread_msg" ? { ...e, unreadMessages: t.count } : t.msg === "toggle_settings" ? { ...e, showSettings: !e.showSettings } : { ...e };
}
function $n(e, t) {
  return t.msg === "set_pin" ? [t.trackReference] : t.msg === "clear_pin" ? [] : { ...e };
}
var Nn = R.createContext(void 0);
function Ds() {
  const e = R.useContext(Nn);
  if (!e)
    throw Error("Tried to access LayoutContext context outside a LayoutContextProvider provider.");
  return e;
}
function $s(e) {
  const t = ko();
  if (e ?? (e = t), !e)
    throw Error("Tried to access LayoutContext context outside a LayoutContextProvider provider.");
  return e;
}
function Ns() {
  const [e, t] = R.useReducer($n, An), [n, r2] = R.useReducer(Dn, On);
  return {
    pin: { dispatch: t, state: e },
    widget: { dispatch: r2, state: n }
  };
}
function Fs(e) {
  const [t, n] = R.useReducer($n, An), [r2, i2] = R.useReducer(Dn, On);
  return e ?? {
    pin: { dispatch: n, state: t },
    widget: { dispatch: i2, state: r2 }
  };
}
function ko() {
  return R.useContext(Nn);
}
var Fn = R.createContext(
  void 0
);
function Us() {
  const e = R.useContext(Fn);
  if (!e)
    throw Error("tried to access track context outside of track context provider");
  return e;
}
function Un() {
  return R.useContext(Fn);
}
function js(e) {
  const t = Un(), n = e ?? t;
  if (!n)
    throw new Error(
      "No TrackRef, make sure you are inside a TrackRefContext or pass the TrackRef explicitly"
    );
  return n;
}
var jn = R.createContext(void 0);
function Ws() {
  const e = R.useContext(jn);
  if (!e)
    throw Error("tried to access participant context outside of participant context provider");
  return e;
}
function Lo() {
  return R.useContext(jn);
}
function Bs(e) {
  const t = Lo(), n = Un(), r2 = e ?? t ?? (n == null ? void 0 : n.participant);
  if (!r2)
    throw new Error(
      "No participant provided, make sure you are inside a participant context or pass the participant explicitly"
    );
  return r2;
}
var Wn = R.createContext(void 0);
function Vs() {
  const e = R.useContext(Wn);
  if (!e)
    throw Error("tried to access room context outside of livekit room component");
  return e;
}
function _o() {
  return R.useContext(Wn);
}
function Hs(e) {
  const t = _o(), n = e ?? t;
  if (!n)
    throw new Error(
      "No room provided, make sure you are inside a Room context or pass the room explicitly"
    );
  return n;
}
var Io = R.createContext(void 0);
function zs(e) {
  const t = R.useContext(Io);
  if (e === true) {
    if (t)
      return t;
    throw Error("tried to access feature context, but none is present");
  }
  return t;
}

// node_modules/@livekit/components-react/dist/room-889cObLb.mjs
var i = __toESM(require_react(), 1);
function L(n) {
  var e, o, t = "";
  if (typeof n == "string" || typeof n == "number") t += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var r2 = n.length;
    for (e = 0; e < r2; e++) n[e] && (o = L(n[e])) && (t && (t += " "), t += o);
  } else for (o in n) n[o] && (t && (t += " "), t += o);
  return t;
}
function A2() {
  for (var n, e, o = 0, t = "", r2 = arguments.length; o < r2; o++) (n = arguments[o]) && (e = L(n)) && (t && (t += " "), t += e);
  return t;
}
function I(...n) {
  return (...e) => {
    for (const o of n)
      if (typeof o == "function")
        try {
          o(...e);
        } catch (t) {
          console.error(t);
        }
  };
}
function M(...n) {
  const e = { ...n[0] };
  for (let o = 1; o < n.length; o++) {
    const t = n[o];
    for (const r2 in t) {
      const d = e[r2], a = t[r2];
      typeof d == "function" && typeof a == "function" && // This is a lot faster than a regex.
      r2[0] === "o" && r2[1] === "n" && r2.charCodeAt(2) >= /* 'A' */
      65 && r2.charCodeAt(2) <= /* 'Z' */
      90 ? e[r2] = I(d, a) : (r2 === "className" || r2 === "UNSAFE_className") && typeof d == "string" && typeof a == "string" ? e[r2] = A2(d, a) : e[r2] = a !== void 0 ? a : d;
    }
  }
  return e;
}
function J2(n) {
  return n !== void 0;
}
function G2(...n) {
  return M(...n.filter(J2));
}
function H2(n, e, o) {
  return i.Children.map(n, (t) => i.isValidElement(t) && i.Children.only(n) ? (t.props.className && (e ?? (e = {}), e.className = A2(t.props.className, e.className), e.style = { ...t.props.style, ...e.style }), i.cloneElement(t, { ...e, key: o })) : t);
}
function Q2(n) {
  var e, o;
  if (typeof window < "u" && typeof process < "u" && // eslint-disable-next-line turbo/no-undeclared-env-vars
  (((e = process == null ? void 0 : process.env) == null ? void 0 : e.NODE_ENV) === "dev" || // eslint-disable-next-line turbo/no-undeclared-env-vars
  ((o = process == null ? void 0 : process.env) == null ? void 0 : o.NODE_ENV) === "development")) {
    const t = document.querySelector(".lk-room-container");
    t && !getComputedStyle(t).getPropertyValue("--lk-has-imported-styles") && _.warn(
      "It looks like you're not using the `@livekit/components-styles package`. To render the UI with the default styling, please import it in your layout or page."
    );
  }
}
function T(n, e) {
  return n === "processor" && e && typeof e == "object" && "name" in e ? e.name : n === "e2ee" && e ? "e2ee-enabled" : e;
}
var q2 = {
  connect: true,
  audio: false,
  video: false
};
function $(n) {
  const {
    token: e,
    serverUrl: o,
    options: t,
    room: r2,
    connectOptions: d,
    connect: a,
    audio: p,
    video: y,
    screen: g,
    onConnected: v,
    onDisconnected: h,
    onError: c,
    onMediaDeviceFailure: b2,
    onEncryptionError: E,
    simulateParticipants: w,
    ...N2
  } = { ...q2, ...n };
  t && r2 && _.warn(
    "when using a manually created room, the options object will be ignored. set the desired options directly when creating the room instead."
  );
  const [s, O2] = i.useState(), C = i.useRef(a);
  i.useEffect(() => {
    O2(r2 ?? new Room(t));
  }, [r2, JSON.stringify(t, T)]);
  const F2 = i.useMemo(() => {
    const { className: m } = Ps();
    return M(N2, { className: m });
  }, [N2]);
  return i.useEffect(() => {
    if (!s) return;
    const m = () => {
      const f = s.localParticipant;
      _.debug("trying to publish local tracks"), Promise.all([
        f.setMicrophoneEnabled(!!p, typeof p != "boolean" ? p : void 0),
        f.setCameraEnabled(!!y, typeof y != "boolean" ? y : void 0),
        f.setScreenShareEnabled(!!g, typeof g != "boolean" ? g : void 0)
      ]).catch((R2) => {
        _.warn(R2), c == null || c(R2);
      });
    }, P = (f, R2) => {
      const K = MediaDeviceFailure.getFailure(f);
      b2 == null || b2(K, R2);
    }, S = (f) => {
      E == null || E(f);
    }, k2 = (f) => {
      h == null || h(f);
    }, D3 = () => {
      v == null || v();
    };
    return s.on(RoomEvent.SignalConnected, m).on(RoomEvent.MediaDevicesError, P).on(RoomEvent.EncryptionError, S).on(RoomEvent.Disconnected, k2).on(RoomEvent.Connected, D3), () => {
      s.off(RoomEvent.SignalConnected, m).off(RoomEvent.MediaDevicesError, P).off(RoomEvent.EncryptionError, S).off(RoomEvent.Disconnected, k2).off(RoomEvent.Connected, D3);
    };
  }, [
    s,
    p,
    y,
    g,
    c,
    E,
    b2,
    v,
    h
  ]), i.useEffect(() => {
    if (s) {
      if (w) {
        s.simulateParticipants({
          participants: {
            count: w
          },
          publish: {
            audio: true,
            useRealTracks: true
          }
        });
        return;
      }
      if (a) {
        if (C.current = true, _.debug("connecting"), !e) {
          _.debug("no token yet");
          return;
        }
        if (!o) {
          _.warn("no livekit url provided"), c == null || c(Error("no livekit url provided"));
          return;
        }
        s.connect(o, e, d).catch((m) => {
          _.warn(m), C.current === true && (c == null || c(m));
        });
      } else
        _.debug("disconnecting because connect is false"), C.current = false, s.disconnect();
    }
  }, [
    a,
    e,
    JSON.stringify(d),
    s,
    c,
    o,
    w
  ]), i.useEffect(() => {
    if (s)
      return () => {
        _.info("disconnecting on onmount"), s.disconnect();
      };
  }, [s]), { room: s, htmlProps: F2 };
}
var W2 = i.forwardRef(function(e, o) {
  const { room: t, htmlProps: r2 } = $(e);
  return i.createElement("div", { ref: o, ...r2 }, t && i.createElement(Wn.Provider, { value: t }, i.createElement(Io.Provider, { value: e.featureFlags }, e.children)));
});

// node_modules/@livekit/components-react/dist/hooks-OJtwh4jO.mjs
var r = __toESM(require_react(), 1);
var $e2 = (e) => {
  const t = r.useRef(e);
  return r.useEffect(() => {
    t.current = e;
  }), t;
};
function He2(e, t) {
  const n = Xe2(), a = $e2(t);
  return r.useLayoutEffect(() => {
    let s = false;
    const c = e.current;
    if (!c) return;
    function o(u, i2) {
      s || a.current(u, i2);
    }
    return n == null || n.subscribe(c, o), () => {
      s = true, n == null || n.unsubscribe(c, o);
    };
  }, [e.current, n, a]), n == null ? void 0 : n.observer;
}
function je2() {
  let e = false, t = [];
  const n = /* @__PURE__ */ new Map();
  if (typeof window > "u")
    return;
  const a = new ResizeObserver((s, c) => {
    t = t.concat(s), e || window.requestAnimationFrame(() => {
      const o = /* @__PURE__ */ new Set();
      for (let u = 0; u < t.length; u++) {
        if (o.has(t[u].target)) continue;
        o.add(t[u].target);
        const i2 = n.get(t[u].target);
        i2 == null || i2.forEach((d) => d(t[u], c));
      }
      t = [], e = false;
    }), e = true;
  });
  return {
    observer: a,
    subscribe(s, c) {
      a.observe(s);
      const o = n.get(s) ?? [];
      o.push(c), n.set(s, o);
    },
    unsubscribe(s, c) {
      const o = n.get(s) ?? [];
      if (o.length === 1) {
        a.unobserve(s), n.delete(s);
        return;
      }
      const u = o.indexOf(c);
      u !== -1 && o.splice(u, 1), n.set(s, o);
    }
  };
}
var D2;
var Xe2 = () => D2 || (D2 = je2());
var Ye2 = (e) => {
  const [t, n] = r.useState({ width: 0, height: 0 });
  r.useLayoutEffect(() => {
    if (e.current) {
      const { width: s, height: c } = e.current.getBoundingClientRect();
      n({ width: s, height: c });
    }
  }, [e.current]);
  const a = r.useCallback(
    (s) => n(s.contentRect),
    []
  );
  return He2(e, a), t;
};
function b(e, t, n = true) {
  const [a, s] = r.useState(t);
  return r.useEffect(() => {
    if (n && s(t), typeof window > "u" || !e) return;
    const c = e.subscribe(s);
    return () => c.unsubscribe();
  }, [e, n]), a;
}
function ht2(e) {
  const t = (c) => typeof window < "u" ? window.matchMedia(c).matches : false, [n, a] = r.useState(t(e));
  function s() {
    a(t(e));
  }
  return r.useEffect(() => {
    const c = window.matchMedia(e);
    return s(), c.addListener ? c.addListener(s) : c.addEventListener("change", s), () => {
      c.removeListener ? c.removeListener(s) : c.removeEventListener("change", s);
    };
  }, [e]), n;
}
function Mt2(e) {
  const t = Hs(e), n = r.useCallback(async () => {
    await t.startAudio();
  }, [t]), a = r.useMemo(
    () => ao(t),
    [t]
  ), { canPlayAudio: s } = b(a, {
    canPlayAudio: t.canPlaybackAudio
  });
  return { canPlayAudio: s, startAudio: n };
}
function yt2(e) {
  const { state: t, dispatch: n } = Ds().pin;
  return { buttonProps: r.useMemo(() => {
    const { className: s } = Cs();
    return M(e, {
      className: s,
      disabled: !(t != null && t.length),
      onClick: () => {
        n && n({ msg: "clear_pin" });
      }
    });
  }, [e, n, t]) };
}
function Pt2(e = {}) {
  const t = Bs(e.participant), { className: n, connectionQualityObserver: a } = r.useMemo(
    () => ms(t),
    [t]
  ), s = b(a, ConnectionQuality.Unknown);
  return { className: n, quality: s };
}
function I2(e) {
  const t = Hs(e), n = r.useMemo(() => es(t), [t]);
  return b(n, t.state);
}
function kt2(e, t) {
  const n = typeof e == "function" ? e : t, a = typeof e == "string" ? e : void 0, s = Vs(), { send: c, messageObservable: o, isSendingObservable: u } = r.useMemo(
    () => mo(s, a, n),
    [s, a, n]
  ), i2 = b(o, void 0), d = b(u, false);
  return {
    message: i2,
    send: c,
    isSending: d
  };
}
function Tt(e) {
  const t = Vs(), n = I2(t);
  return { buttonProps: r.useMemo(() => {
    const { className: s, disconnect: c } = vs(t);
    return M(e, {
      className: s,
      onClick: () => c(e.stopTracks ?? true),
      disabled: n === ConnectionState.Disconnected
    });
  }, [t, e, n]) };
}
function Ze2(e) {
  if (e.publication instanceof LocalTrackPublication) {
    const t = e.publication.track;
    if (t) {
      const { facingMode: n } = facingModeFromLocalTrack(t);
      return n;
    }
  }
  return "undefined";
}
function Et2({ trackRef: e, props: t }) {
  const n = js(e), a = ko(), { className: s } = r.useMemo(() => Es(), []), c = r.useMemo(() => $o(n, a == null ? void 0 : a.pin.state), [n, a == null ? void 0 : a.pin.state]);
  return { mergedProps: r.useMemo(
    () => M(t, {
      className: s,
      onClick: (u) => {
        var i2, d, f, l, p;
        (i2 = t.onClick) == null || i2.call(t, u), c ? (f = a == null ? void 0 : (d = a.pin).dispatch) == null || f.call(d, {
          msg: "clear_pin"
        }) : (p = a == null ? void 0 : (l = a.pin).dispatch) == null || p.call(l, {
          msg: "set_pin",
          trackReference: n
        });
      }
    }),
    [t, s, n, c, a == null ? void 0 : a.pin]
  ), inFocus: c };
}
function wt2(e, t, n = {}) {
  const a = n.gridLayouts ?? zo, { width: s, height: c } = Ye2(e), o = Yi(a, t, s, c);
  return r.useEffect(() => {
    e.current && o && (e.current.style.setProperty("--lk-col-count", o == null ? void 0 : o.columns.toString()), e.current.style.setProperty("--lk-row-count", o == null ? void 0 : o.rows.toString()));
  }, [e, o]), {
    layout: o,
    containerWidth: s,
    containerHeight: c
  };
}
function z(e, t = {}) {
  var u, i2;
  const n = typeof e == "string" ? t.participant : e.participant, a = Bs(n), s = typeof e == "string" ? { participant: a, source: e } : e, [c, o] = r.useState(
    !!((u = s.publication) != null && u.isMuted || (i2 = a.getTrackPublication(s.source)) != null && i2.isMuted)
  );
  return r.useEffect(() => {
    const d = po(s).subscribe(o);
    return () => d.unsubscribe();
  }, [N(s)]), c;
}
function Ke2(e) {
  const t = Bs(e), n = r.useMemo(() => ss(t), [t]);
  return b(n, t.isSpeaking);
}
function et2(e = {}) {
  const t = Hs(e.room), [n, a] = r.useState(t.localParticipant), [s, c] = r.useState(
    n.isMicrophoneEnabled
  ), [o, u] = r.useState(
    n.isMicrophoneEnabled
  ), [i2, d] = r.useState(
    n.lastMicrophoneError
  ), [f, l] = r.useState(n.lastCameraError), [p, S] = r.useState(
    n.isMicrophoneEnabled
  ), [g, m] = r.useState(
    void 0
  ), [y, h] = r.useState(void 0), P = (M2) => {
    u(M2.isCameraEnabled), c(M2.isMicrophoneEnabled), S(M2.isScreenShareEnabled), h(M2.cameraTrack), m(M2.microphoneTrack), d(M2.participant.lastMicrophoneError), l(M2.participant.lastCameraError), a(M2.participant);
  };
  return r.useEffect(() => {
    const M2 = In(t.localParticipant).subscribe(P);
    return () => M2.unsubscribe();
  }, [t]), {
    isMicrophoneEnabled: s,
    isScreenShareEnabled: p,
    isCameraEnabled: o,
    microphoneTrack: g,
    cameraTrack: y,
    lastMicrophoneError: i2,
    lastCameraError: f,
    localParticipant: n
  };
}
function At2() {
  const e = Vs(), t = r.useMemo(
    () => us(e.localParticipant),
    [e]
  );
  return b(t, e.localParticipant.permissions);
}
function Ct2({
  kind: e,
  room: t,
  track: n,
  requestPermissions: a,
  onError: s
}) {
  const c = _o(), o = r.useMemo(() => t ?? c ?? new Room(), [t, c]), u = r.useMemo(
    () => rs(e, s, a),
    [e, a, s]
  ), i2 = b(u, []), [d, f] = r.useState(
    (o == null ? void 0 : o.getActiveDevice(e)) ?? "default"
  ), { className: l, activeDeviceObservable: p, setActiveMediaDevice: S } = r.useMemo(
    () => hs(e, o),
    [e, o, n]
  );
  return r.useEffect(() => {
    const g = p.subscribe((m) => {
      m && (_.info("setCurrentDeviceId", m), f(m));
    });
    return () => {
      g == null || g.unsubscribe();
    };
  }, [p]), { devices: i2, className: l, activeDeviceId: d, setActiveMediaDevice: S };
}
function It2({
  kind: e,
  onError: t
}) {
  const n = r.useMemo(
    () => rs(e, t),
    [e, t]
  );
  return b(n, []);
}
function tt2(e, t, n = {}) {
  const a = r.useRef([]), s = r.useRef(-1), c = t !== s.current, o = typeof n.customSortFunction == "function" ? n.customSortFunction(e) : Qo(e);
  let u = [...o];
  if (c === false)
    try {
      u = Xo(a.current, o, t);
    } catch (i2) {
      _.error("Error while running updatePages(): ", i2);
    }
  return c ? a.current = o : a.current = u, s.current = t, u;
}
function Ot2(e, t) {
  const [n, a] = r.useState(1), s = Math.max(Math.ceil(t.length / e), 1);
  n > s && a(s);
  const c = n * e, o = c - e, u = (l) => {
    a((p) => l === "next" ? p === s ? p : p + 1 : p === 1 ? p : p - 1);
  }, i2 = (l) => {
    l > s ? a(s) : l < 1 ? a(1) : a(l);
  }, f = tt2(t, e).slice(o, c);
  return {
    totalPageCount: s,
    nextPage: () => u("next"),
    prevPage: () => u("previous"),
    setPage: i2,
    firstItemIndex: o,
    lastItemIndex: c,
    tracks: f,
    currentPage: n
  };
}
function Dt2(e = {}) {
  let t = Lo();
  e.participant && (t = e.participant);
  const n = r.useMemo(() => lo(t), [t]), { identity: a, name: s, metadata: c } = b(n, {
    name: t == null ? void 0 : t.name,
    identity: t == null ? void 0 : t.identity,
    metadata: t == null ? void 0 : t.metadata
  });
  return { identity: a, name: s, metadata: c };
}
function Lt2(e = {}) {
  const t = Bs(e.participant), n = r.useMemo(() => us(t), [t]);
  return b(n, t.permissions);
}
function Rt2({
  trackRef: e,
  onParticipantClick: t,
  disableSpeakingIndicator: n,
  htmlProps: a
}) {
  const s = js(e), c = r.useMemo(() => {
    const { className: p } = ys();
    return M(a, {
      className: p,
      onClick: (S) => {
        var g;
        if ((g = a.onClick) == null || g.call(a, S), typeof t == "function") {
          const m = s.publication ?? s.participant.getTrackPublication(s.source);
          t({ participant: s.participant, track: m });
        }
      }
    });
  }, [
    a,
    t,
    s.publication,
    s.source,
    s.participant
  ]), o = s.participant.getTrackPublication(Track.Source.Microphone), u = r.useMemo(() => ({
    participant: s.participant,
    source: Track.Source.Microphone,
    publication: o
  }), [o, s.participant]), i2 = z(s), d = z(u), f = Ke2(s.participant), l = Ze2(s);
  return {
    elementProps: {
      "data-lk-audio-muted": d,
      "data-lk-video-muted": i2,
      "data-lk-speaking": n === true ? false : f,
      "data-lk-local-participant": s.participant.isLocal,
      "data-lk-source": s.source,
      "data-lk-facing-mode": l,
      ...c
    }
  };
}
function H3(e = {}) {
  const t = Hs(e.room), [n, a] = r.useState([]);
  return r.useEffect(() => {
    const s = as(t, {
      additionalRoomEvents: e.updateOnlyOn
    }).subscribe(a);
    return () => s.unsubscribe();
  }, [t, JSON.stringify(e.updateOnlyOn)]), n;
}
function Nt2(e = {}) {
  const t = H3(e), { localParticipant: n } = et2(e);
  return r.useMemo(
    () => [n, ...t],
    [n, t]
  );
}
function Ft2(e) {
  return e = $s(e), r.useMemo(() => (e == null ? void 0 : e.pin.state) !== void 0 && e.pin.state.length >= 1 ? e.pin.state : [], [e.pin.state]);
}
function Vt2(e, t = {}) {
  const n = Vs(), [a] = r.useState(t.updateOnlyOn), s = r.useMemo(() => typeof e == "string" ? cs(n, e, {
    additionalEvents: a
  }) : ls(n, e, {
    additionalEvents: a
  }), [n, JSON.stringify(e), a]), [c, o] = r.useState({
    p: void 0
  });
  return r.useEffect(() => {
    const u = s.subscribe((i2) => o({ p: i2 }));
    return () => u.unsubscribe();
  }, [s]), c.p;
}
function _t2(e = {}) {
  const t = Hs(e.room), n = r.useMemo(() => ts(t), [t]), { name: a, metadata: s } = b(n, {
    name: t.name,
    metadata: t.metadata
  });
  return { name: a, metadata: s };
}
function nt2() {
  const e = Vs(), t = r.useMemo(() => ns(e), [e]);
  return b(t, e.activeSpeakers);
}
function Bt2(e) {
  const [t, n] = r.useState(
    Jo(e)
  ), a = nt2();
  return r.useEffect(() => {
    n(Jo(e));
  }, [a, e]), t;
}
function zt2({ room: e, props: t }) {
  const n = Hs(e), { className: a, roomAudioPlaybackAllowedObservable: s, handleStartAudioPlayback: c } = r.useMemo(
    () => xs(),
    []
  ), o = r.useMemo(
    () => s(n),
    [n, s]
  ), { canPlayAudio: u } = b(o, {
    canPlayAudio: n.canPlaybackAudio
  });
  return { mergedProps: r.useMemo(
    () => M(t, {
      className: a,
      onClick: () => {
        c(n);
      },
      style: { display: u ? "none" : "block" }
    }),
    [t, a, u, c, n]
  ), canPlayAudio: u };
}
function Ut2({ room: e, props: t }) {
  const n = Hs(e), { className: a, roomVideoPlaybackAllowedObservable: s, handleStartVideoPlayback: c } = r.useMemo(
    () => Ss(),
    []
  ), o = r.useMemo(
    () => s(n),
    [n, s]
  ), { canPlayVideo: u } = b(o, {
    canPlayVideo: n.canPlaybackVideo
  });
  return { mergedProps: r.useMemo(
    () => M(t, {
      className: a,
      onClick: () => {
        c(n);
      },
      style: { display: u ? "none" : "block" }
    }),
    [t, a, u, c, n]
  ), canPlayVideo: u };
}
function qt2(e, t = {}) {
  const n = r.useRef(null), a = r.useRef(null), s = t.minSwipeDistance ?? 50, c = (i2) => {
    a.current = null, n.current = i2.targetTouches[0].clientX;
  }, o = (i2) => {
    a.current = i2.targetTouches[0].clientX;
  }, u = r.useCallback(() => {
    if (!n.current || !a.current)
      return;
    const i2 = n.current - a.current, d = i2 > s, f = i2 < -s;
    d && t.onLeftSwipe && t.onLeftSwipe(), f && t.onRightSwipe && t.onRightSwipe();
  }, [s, t]);
  r.useEffect(() => {
    const i2 = e.current;
    return i2 && (i2.addEventListener("touchstart", c, { passive: true }), i2.addEventListener("touchmove", o, { passive: true }), i2.addEventListener("touchend", u, { passive: true })), () => {
      i2 && (i2.removeEventListener("touchstart", c), i2.removeEventListener("touchmove", o), i2.removeEventListener("touchend", u));
    };
  }, [e, u]);
}
function Jt2({ props: e }) {
  const { dispatch: t, state: n } = Ds().widget, { className: a } = r.useMemo(() => Ts(), []);
  return { mergedProps: r.useMemo(() => M(e, {
    className: a,
    onClick: () => {
      t && t({ msg: "toggle_chat" });
    },
    "aria-pressed": n != null && n.showChat ? "true" : "false",
    "data-lk-unread-msgs": n ? n.unreadMessages < 10 ? n.unreadMessages.toFixed(0) : "9+" : "0"
  }), [e, a, t, n]) };
}
function xt2(e, t, n = {}) {
  const [a, s] = r.useState(void 0);
  return r.useEffect(() => {
    var o;
    if (e === void 0)
      throw Error("token endpoint needs to be defined");
    if (((o = n.userInfo) == null ? void 0 : o.identity) === void 0)
      return;
    (async () => {
      _.debug("fetching token");
      const u = new URLSearchParams({ ...n.userInfo, roomName: t }), i2 = await fetch(`${e}?${u.toString()}`);
      if (!i2.ok) {
        _.error(
          `Could not fetch token. Server responded with status ${i2.status}: ${i2.statusText}`
        );
        return;
      }
      const { accessToken: d } = await i2.json();
      s(d);
    })();
  }, [e, t, JSON.stringify(n)]), a;
}
function Wt2(e) {
  var c, o;
  const t = js(e), { className: n, mediaMutedObserver: a } = r.useMemo(
    () => gs(t),
    [N(t)]
  );
  return { isMuted: b(
    a,
    !!((c = t.publication) != null && c.isMuted || (o = t.participant.getTrackPublication(t.source)) != null && o.isMuted)
  ), className: n };
}
function Gt2({
  source: e,
  onChange: t,
  initialState: n,
  captureOptions: a,
  publishOptions: s,
  onDeviceError: c,
  ...o
}) {
  var P;
  const u = _o(), i2 = (P = u == null ? void 0 : u.localParticipant) == null ? void 0 : P.getTrackPublication(e), d = r.useRef(false), { toggle: f, className: l, pendingObserver: p, enabledObserver: S } = r.useMemo(
    () => u ? ds(e, u, a, s, c) : ps(),
    [u, e, JSON.stringify(a), s]
  ), g = b(p, false), m = b(S, n ?? !!(i2 != null && i2.isEnabled));
  r.useEffect(() => {
    t == null || t(m, d.current), d.current = false;
  }, [m, t]), r.useEffect(() => {
    n !== void 0 && (_.debug("forcing initial toggle state", e, n), f(n));
  }, []);
  const y = r.useMemo(() => M(o, { className: l }), [o, l]), h = r.useCallback(
    (M2) => {
      var O2;
      d.current = true, f().catch(() => d.current = false), (O2 = o.onClick) == null || O2.call(o, M2);
    },
    [o, f]
  );
  return {
    toggle: f,
    enabled: m,
    pending: g,
    track: i2,
    buttonProps: {
      ...y,
      "aria-pressed": m,
      "data-lk-source": e,
      "data-lk-enabled": m,
      disabled: g,
      onClick: h
    }
  };
}
function Qt2(e = [
  Track.Source.Camera,
  Track.Source.Microphone,
  Track.Source.ScreenShare,
  Track.Source.ScreenShareAudio,
  Track.Source.Unknown
], t = {}) {
  const n = Hs(t.room), [a, s] = r.useState([]), [c, o] = r.useState([]), u = r.useMemo(() => e.map((d) => Ki(d) ? d.source : d), [JSON.stringify(e)]);
  return r.useEffect(() => {
    const d = As(n, u, {
      additionalRoomEvents: t.updateOnlyOn,
      onlySubscribed: t.onlySubscribed
    }).subscribe(({ trackReferences: f, participants: l }) => {
      _.debug("setting track bundles", f, l), s(f), o(l);
    });
    return () => d.unsubscribe();
  }, [
    n,
    JSON.stringify(t.onlySubscribed),
    JSON.stringify(t.updateOnlyOn),
    JSON.stringify(e)
  ]), r.useMemo(() => {
    if (Go(e)) {
      const d = at2(e, c), f = Array.from(a);
      return c.forEach((l) => {
        d.has(l.identity) && (d.get(l.identity) ?? []).forEach((S) => {
          if (a.find(
            ({ participant: m, publication: y }) => l.identity === m.identity && y.source === S
          ))
            return;
          _.debug(
            `Add ${S} placeholder for participant ${l.identity}.`
          );
          const g = {
            participant: l,
            source: S
          };
          f.push(g);
        });
      }), f;
    } else
      return a;
  }, [a, c, e]);
}
function st2(e, t) {
  const n = new Set(e);
  for (const a of t)
    n.delete(a);
  return n;
}
function at2(e, t) {
  const n = /* @__PURE__ */ new Map();
  if (Go(e)) {
    const a = e.filter((s) => s.withPlaceholder).map((s) => s.source);
    t.forEach((s) => {
      const c = s.getTrackPublications().map((u) => {
        var i2;
        return (i2 = u.track) == null ? void 0 : i2.source;
      }).filter((u) => u !== void 0), o = Array.from(
        st2(new Set(a), new Set(c))
      );
      o.length > 0 && n.set(s.identity, o);
    });
  }
  return n;
}
function rt2(e) {
  const [t, n] = r.useState(Bt(e)), { trackObserver: a } = r.useMemo(() => Zo(e), [e.participant.sid ?? e.participant.identity, e.source]);
  return r.useEffect(() => {
    const s = a.subscribe((c) => {
      n(c);
    });
    return () => s == null ? void 0 : s.unsubscribe();
  }, [a]), {
    participant: e.participant,
    source: e.source ?? Track.Source.Unknown,
    publication: t
  };
}
function $t2(e, t) {
  const n = Bs(t);
  return rt2({ name: e, participant: n });
}
function Ht2(e) {
  const t = Vs(), n = I2(t), a = r.useMemo(
    () => n === ConnectionState.Disconnected,
    [n]
  ), s = r.useMemo(
    () => ws(t, e),
    [t, e, a]
  ), c = b(s.isSendingObservable, false), o = b(s.messageObservable, []);
  return { send: s.send, chatMessages: o, isSending: c };
}
function jt2(e = {}) {
  const [t, n] = r.useState(
    Rs(e.defaults, e.preventLoad ?? false)
  ), a = r.useCallback((i2) => {
    n((d) => ({ ...d, audioEnabled: i2 }));
  }, []), s = r.useCallback((i2) => {
    n((d) => ({ ...d, videoEnabled: i2 }));
  }, []), c = r.useCallback((i2) => {
    n((d) => ({ ...d, audioDeviceId: i2 }));
  }, []), o = r.useCallback((i2) => {
    n((d) => ({ ...d, videoDeviceId: i2 }));
  }, []), u = r.useCallback((i2) => {
    n((d) => ({ ...d, username: i2 }));
  }, []);
  return r.useEffect(() => {
    Is(t, e.preventSave ?? false);
  }, [t, e.preventSave]), {
    userChoices: t,
    saveAudioInputEnabled: a,
    saveVideoInputEnabled: s,
    saveAudioInputDeviceId: c,
    saveVideoInputDeviceId: o,
    saveUsername: u
  };
}
function Xt2(e, t = {}) {
  const n = Bs(e), a = Hs(t.room), s = r.useMemo(() => is(a, n), [a, n]);
  return b(
    s,
    n.isLocal ? n.isE2EEEnabled : !!(n != null && n.isEncrypted)
  );
}
function Yt(e, t = { fftSize: 32, smoothingTimeConstant: 0 }) {
  const n = j(e) ? e.publication.track : e, [a, s] = r.useState(0);
  return r.useEffect(() => {
    if (!n || !n.mediaStream)
      return;
    const { cleanup: c, analyser: o } = createAudioAnalyser(n, t), u = o.frequencyBinCount, i2 = new Uint8Array(u), f = setInterval(() => {
      o.getByteFrequencyData(i2);
      let l = 0;
      for (let p = 0; p < i2.length; p++) {
        const S = i2[p];
        l += S * S;
      }
      s(Math.sqrt(l / i2.length) / 255);
    }, 1e3 / 30);
    return () => {
      c(), clearInterval(f);
    };
  }, [n, n == null ? void 0 : n.mediaStream, JSON.stringify(t)]), a;
}
var ct2 = (e) => {
  const t = (n) => {
    let c = 1 - Math.max(-100, Math.min(-10, n)) * -1 / 100;
    return c = Math.sqrt(c), c;
  };
  return e.map((n) => n === -1 / 0 ? 0 : t(n));
};
var ot2 = {
  bands: 5,
  loPass: 100,
  hiPass: 600,
  updateInterval: 32,
  analyserOptions: { fftSize: 2048 }
};
function Zt2(e, t = {}) {
  var o;
  const n = e instanceof Track ? e : (o = e == null ? void 0 : e.publication) == null ? void 0 : o.track, a = { ...ot2, ...t }, [s, c] = r.useState(
    new Array(a.bands).fill(0)
  );
  return r.useEffect(() => {
    if (!n || !(n != null && n.mediaStream))
      return;
    const { analyser: u, cleanup: i2 } = createAudioAnalyser(n, a.analyserOptions), d = u.frequencyBinCount, f = new Float32Array(d), p = setInterval(() => {
      u.getFloatFrequencyData(f);
      let S = new Float32Array(f.length);
      for (let h = 0; h < f.length; h++)
        S[h] = f[h];
      S = S.slice(t.loPass, t.hiPass);
      const g = ct2(S), m = Math.ceil(g.length / a.bands), y = [];
      for (let h = 0; h < a.bands; h++) {
        const P = g.slice(h * m, (h + 1) * m).reduce((M2, O2) => M2 += O2, 0);
        y.push(P / m);
      }
      c(y);
    }, a.updateInterval);
    return () => {
      i2(), clearInterval(p);
    };
  }, [n, n == null ? void 0 : n.mediaStream, JSON.stringify(t)]), s;
}
var it2 = {
  barCount: 120,
  volMultiplier: 5,
  updateInterval: 20
};
function Kt2(e, t = {}) {
  var f;
  const n = e instanceof Track ? e : (f = e == null ? void 0 : e.publication) == null ? void 0 : f.track, a = { ...it2, ...t }, s = r.useRef(new Float32Array()), c = r.useRef(performance.now()), o = r.useRef(0), [u, i2] = r.useState([]), d = r.useCallback((l) => {
    i2(
      Array.from(
        dt2(l, a.barCount).map((p) => Math.sqrt(p) * a.volMultiplier)
        // wave.slice(0, opts.barCount).map((v) => sigmoid(v * opts.volMultiplier, 0.08, 0.2)),
      )
    );
  }, []);
  return r.useEffect(() => {
    if (!n || !(n != null && n.mediaStream))
      return;
    const { analyser: l, cleanup: p } = createAudioAnalyser(n, {
      fftSize: U2(a.barCount)
    }), S = U2(a.barCount), g = new Float32Array(S), m = () => {
      if (y = requestAnimationFrame(m), l.getFloatTimeDomainData(g), s.current.map((h, P) => h + g[P]), o.current += 1, performance.now() - c.current >= a.updateInterval) {
        const h = g.map((P) => P / o.current);
        d(h), c.current = performance.now(), o.current = 0;
      }
    };
    let y = requestAnimationFrame(m);
    return () => {
      p(), cancelAnimationFrame(y);
    };
  }, [n, n == null ? void 0 : n.mediaStream, JSON.stringify(t), d]), {
    bars: u
  };
}
function U2(e) {
  return e < 32 ? 32 : ut2(e);
}
function ut2(e) {
  let t = 2;
  for (; e >>= 1; )
    t <<= 1;
  return t;
}
function dt2(e, t) {
  const n = Math.floor(e.length / t), a = new Float32Array(t);
  for (let s = 0; s < t; s++) {
    const c = n * s;
    let o = 0;
    for (let u = 0; u < n; u++)
      o = o + Math.abs(e[c + u]);
    a[s] = o / n;
  }
  return a;
}
function q3(e, t) {
  const n = Vs(), a = Lo(), s = t ? n.getParticipantByIdentity(t) : a, c = r.useMemo(
    () => s ? Os(s, { sources: e }) : void 0,
    [s == null ? void 0 : s.sid, s == null ? void 0 : s.identity, JSON.stringify(e)]
  );
  return b(c, []);
}
function lt2(e) {
  var n, a, s;
  const t = r.useMemo(
    () => {
      var c;
      return (c = e == null ? void 0 : e.publication) != null && c.track ? Ls(e == null ? void 0 : e.publication.track) : void 0;
    },
    [(n = e == null ? void 0 : e.publication) == null ? void 0 : n.track]
  );
  return b(t, {
    timestamp: Date.now(),
    rtpTimestamp: (s = (a = e == null ? void 0 : e.publication) == null ? void 0 : a.track) == null ? void 0 : s.rtpTimestamp
  });
}
var ft2 = {
  bufferSize: 100
  // maxAge: 2_000,
};
function pt2(e, t) {
  const n = { ...ft2, ...t }, [a, s] = r.useState([]), c = lt2(e), o = (u) => {
    var i2;
    (i2 = n.onTranscription) == null || i2.call(n, u), s(
      (d) => Ko(
        d,
        // when first receiving a segment, add the current media timestamp to it
        u.map((f) => qo(f, c)),
        n.bufferSize
      )
    );
  };
  return r.useEffect(() => {
    if (!(e != null && e.publication))
      return;
    const u = ks(e.publication).subscribe((i2) => {
      o(...i2);
    });
    return () => {
      u.unsubscribe();
    };
  }, [e && N(e), o]), { segments: a };
}
function bt2(e = {}) {
  const t = Lo(), n = e.participant ?? t, a = r.useMemo(
    // weird typescript constraint
    () => n ? fs(n) : fs(n),
    [n]
  );
  return b(a, {
    attributes: n == null ? void 0 : n.attributes
  });
}
function en2(e, t = {}) {
  const n = Bs(t.participant), [a, s] = r.useState(n.attributes[e]);
  return r.useEffect(() => {
    if (!n)
      return;
    const c = fs(n).subscribe((o) => {
      o.changed[e] !== void 0 && s(o.attributes[e]);
    });
    return () => {
      c.unsubscribe();
    };
  }, [n, e]), a;
}
var J3 = "lk.agent.state";
function tn2() {
  const e = H3(), t = e.find(
    (l) => l.kind === ParticipantInfo_Kind.AGENT && !("lk.publish_on_behalf" in l.attributes)
  ), n = e.find(
    (l) => l.kind === ParticipantInfo_Kind.AGENT && l.attributes["lk.publish_on_behalf"] === (t == null ? void 0 : t.identity)
  ), a = q3(
    [Track.Source.Microphone, Track.Source.Camera],
    t == null ? void 0 : t.identity
  ), s = q3(
    [Track.Source.Microphone, Track.Source.Camera],
    n == null ? void 0 : n.identity
  ), c = a.find((l) => l.source === Track.Source.Microphone) ?? s.find((l) => l.source === Track.Source.Microphone), o = a.find((l) => l.source === Track.Source.Camera) ?? s.find((l) => l.source === Track.Source.Camera), { segments: u } = pt2(c), i2 = I2(), { attributes: d } = bt2({ participant: t }), f = r.useMemo(() => i2 === ConnectionState.Disconnected ? "disconnected" : i2 === ConnectionState.Connecting || !t || !(d != null && d[J3]) ? "connecting" : d[J3], [d, t, i2]);
  return {
    agent: t,
    state: f,
    audioTrack: c,
    videoTrack: o,
    agentTranscriptions: u,
    agentAttributes: d
  };
}
function nn2(e) {
  const t = Hs(e), n = I2(t), a = r.useMemo(() => os(t), [t, n]);
  return b(a, t.isRecording);
}
function mt2(e) {
  const t = Vs(), a = I2(t) === ConnectionState.Disconnected, s = r.useMemo(() => Ms(t, e), [t, e]);
  return { textStreams: b(a ? void 0 : s, []) };
}
function sn2(e) {
  const { participantIdentities: t, trackSids: n } = e ?? {}, { textStreams: a } = mt2(ho.TRANSCRIPTION);
  return r.useMemo(
    () => a.filter(
      (c) => t ? t.includes(c.participantInfo.identity) : true
    ).filter(
      (c) => {
        var o;
        return n ? n.includes(((o = c.streamInfo.attributes) == null ? void 0 : o["lk.transcribed_track_id"]) ?? "") : true;
      }
    ),
    [a, t, n]
  );
}

export {
  Mo,
  Ar,
  j,
  N,
  Do,
  $o,
  No,
  Fo,
  Uo,
  jo,
  Wo,
  Bo,
  _,
  Vo,
  Ho,
  Yo,
  Zo,
  Bt,
  bs,
  _s,
  Nn,
  Ds,
  $s,
  Ns,
  Fs,
  ko,
  Fn,
  Us,
  Un,
  js,
  jn,
  Ws,
  Lo,
  Bs,
  Wn,
  Vs,
  _o,
  Hs,
  Io,
  zs,
  M,
  G2 as G,
  H2 as H,
  Q2 as Q,
  T,
  $,
  W2 as W,
  Ye2 as Ye,
  b,
  ht2 as ht,
  Mt2 as Mt,
  yt2 as yt,
  Pt2 as Pt,
  I2 as I,
  kt2 as kt,
  Tt,
  Ze2 as Ze,
  Et2 as Et,
  wt2 as wt,
  z,
  Ke2 as Ke,
  et2 as et,
  At2 as At,
  Ct2 as Ct,
  It2 as It,
  tt2 as tt,
  Ot2 as Ot,
  Dt2 as Dt,
  Lt2 as Lt,
  Rt2 as Rt,
  H3 as H2,
  Nt2 as Nt,
  Ft2 as Ft,
  Vt2 as Vt,
  _t2 as _t,
  nt2 as nt,
  Bt2,
  zt2 as zt,
  Ut2 as Ut,
  qt2 as qt,
  Jt2 as Jt,
  xt2 as xt,
  Wt2 as Wt,
  Gt2 as Gt,
  Qt2 as Qt,
  $t2 as $t,
  Ht2 as Ht,
  jt2 as jt,
  Xt2 as Xt,
  Yt,
  Zt2 as Zt,
  Kt2 as Kt,
  q3 as q,
  pt2 as pt,
  bt2 as bt,
  en2 as en,
  tn2 as tn,
  nn2 as nn,
  mt2 as mt,
  sn2 as sn
};
//# sourceMappingURL=chunk-WSOV3ETE.js.map
