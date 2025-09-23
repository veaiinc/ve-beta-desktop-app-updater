import {
  $,
  $o,
  $s,
  $t,
  Ar,
  At,
  Bo,
  Bs,
  Bt,
  Bt2,
  Ct,
  Do,
  Ds,
  Dt,
  Et,
  Fn,
  Fo,
  Fs,
  Ft,
  G,
  Gt,
  H,
  H2,
  Ho,
  Hs,
  Ht,
  I,
  Io,
  It,
  Jt,
  Ke,
  Kt,
  Lo,
  Lt,
  M,
  Mo,
  Mt,
  N,
  Nn,
  No,
  Ns,
  Nt,
  Ot,
  Pt,
  Q,
  Qt,
  Rt,
  T,
  Tt,
  Un,
  Uo,
  Us,
  Ut,
  Vo,
  Vs,
  Vt,
  W,
  Wn,
  Wo,
  Ws,
  Wt,
  Xt,
  Ye,
  Yo,
  Yt,
  Ze,
  Zo,
  Zt,
  _ as _2,
  _o,
  _s,
  _t,
  b,
  bs,
  bt,
  en,
  et,
  ht,
  j,
  jn,
  jo,
  js,
  jt,
  ko,
  kt,
  mt,
  nn,
  nt,
  pt,
  q,
  qt,
  sn,
  tn,
  tt,
  wt,
  xt,
  yt,
  z,
  zs,
  zt
} from "./chunk-WSOV3ETE.js";
import {
  ConnectionQuality,
  ConnectionState,
  RemoteAudioTrack,
  RemoteTrackPublication,
  RoomEvent,
  Track,
  VideoPresets,
  _,
  createLocalAudioTrack,
  createLocalTracks,
  createLocalVideoTrack,
  facingModeFromLocalTrack
} from "./chunk-3PEDPLGC.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@livekit/components-react/dist/prefabs.mjs
var e2 = __toESM(require_react(), 1);

// node_modules/@livekit/components-react/dist/components-BeK2vIib.mjs
var e = __toESM(require_react(), 1);
var import_react = __toESM(require_react(), 1);
var aa = e.forwardRef(
  function(n, a) {
    const { buttonProps: r } = yt(n);
    return e.createElement("button", { ref: a, ...r }, n.children);
  }
);
var na = e.forwardRef(
  function({ room: n, ...a }, r) {
    const c = I(n);
    return e.createElement("div", { ref: r, ...a }, c);
  }
);
var ra = e.forwardRef(
  function(n, a) {
    const { mergedProps: r } = Jt({ props: n });
    return e.createElement("button", { ref: a, ...r }, n.children);
  }
);
var ca = e.forwardRef(
  function(n, a) {
    const { buttonProps: r } = Tt(n);
    return e.createElement("button", { ref: a, ...r }, n.children);
  }
);
var gt = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentColor", ...t }, e.createElement("path", { d: "M1.354.646a.5.5 0 1 0-.708.708l14 14a.5.5 0 0 0 .708-.708L11 10.293V4.5A1.5 1.5 0 0 0 9.5 3H3.707zM0 4.5a1.5 1.5 0 0 1 .943-1.393l9.532 9.533c-.262.224-.603.36-.975.36h-8A1.5 1.5 0 0 1 0 11.5z" }), e.createElement("path", { d: "m15.2 3.6-2.8 2.1a1 1 0 0 0-.4.8v3a1 1 0 0 0 .4.8l2.8 2.1a.5.5 0 0 0 .8-.4V4a.5.5 0 0 0-.8-.4z" }));
var vt = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentColor", ...t }, e.createElement("path", { d: "M0 4.5A1.5 1.5 0 0 1 1.5 3h8A1.5 1.5 0 0 1 11 4.5v7A1.5 1.5 0 0 1 9.5 13h-8A1.5 1.5 0 0 1 0 11.5zM15.2 3.6l-2.8 2.1a1 1 0 0 0-.4.8v3a1 1 0 0 0 .4.8l2.8 2.1a.5.5 0 0 0 .8-.4V4a.5.5 0 0 0-.8-.4z" }));
var la = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", ...t }, e.createElement(
  "path",
  {
    fill: "#FFF",
    d: "M4.99 3.99a1 1 0 0 0-.697 1.717L10.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 1 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 0 0-.727-1.717 1 1 0 0 0-.687.303L12 10.586 5.707 4.293a1 1 0 0 0-.717-.303z"
  }
));
var sa = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 18, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M0 2.75A2.75 2.75 0 0 1 2.75 0h10.5A2.75 2.75 0 0 1 16 2.75v13.594a.75.75 0 0 1-1.234.572l-3.691-3.12a1.25 1.25 0 0 0-.807-.296H2.75A2.75 2.75 0 0 1 0 10.75v-8ZM2.75 1.5c-.69 0-1.25.56-1.25 1.25v8c0 .69.56 1.25 1.25 1.25h7.518c.65 0 1.279.23 1.775.65l2.457 2.077V2.75c0-.69-.56-1.25-1.25-1.25H2.75Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M3 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Z",
    clipRule: "evenodd"
  }
));
var ie = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentcolor",
    fillRule: "evenodd",
    d: "M5.293 2.293a1 1 0 0 1 1.414 0l4.823 4.823a1.25 1.25 0 0 1 0 1.768l-4.823 4.823a1 1 0 0 1-1.414-1.414L9.586 8 5.293 3.707a1 1 0 0 1 0-1.414z",
    clipRule: "evenodd"
  }
));
var Et2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement("g", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5 }, e.createElement("path", { d: "M10 1.75h4.25m0 0V6m0-4.25L9 7M6 14.25H1.75m0 0V10m0 4.25L7 9" })));
var ia = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentcolor",
    fillRule: "evenodd",
    d: "M8.961.894C8.875-.298 7.125-.298 7.04.894c-.066.912-1.246 1.228-1.76.472-.67-.99-2.186-.115-1.664.96.399.824-.465 1.688-1.288 1.289-1.076-.522-1.95.994-.961 1.665.756.513.44 1.693-.472 1.759-1.192.086-1.192 1.836 0 1.922.912.066 1.228 1.246.472 1.76-.99.67-.115 2.186.96 1.664.824-.399 1.688.465 1.289 1.288-.522 1.076.994 1.95 1.665.961.513-.756 1.693-.44 1.759.472.086 1.192 1.836 1.192 1.922 0 .066-.912 1.246-1.228 1.76-.472.67.99 2.186.115 1.664-.96-.399-.824.465-1.688 1.288-1.289 1.076.522 1.95-.994.961-1.665-.756-.513-.44-1.693.472-1.759 1.192-.086 1.192-1.836 0-1.922-.912-.066-1.228-1.246-.472-1.76.99-.67.115-2.186-.96-1.664-.824.399-1.688-.465-1.289-1.288.522-1.076-.994-1.95-1.665-.961-.513.756-1.693.44-1.759-.472ZM8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10Z",
    clipRule: "evenodd"
  }
));
var oa = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M2 2.75A2.75 2.75 0 0 1 4.75 0h6.5A2.75 2.75 0 0 1 14 2.75v10.5A2.75 2.75 0 0 1 11.25 16h-6.5A2.75 2.75 0 0 1 2 13.25v-.5a.75.75 0 0 1 1.5 0v.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V2.75c0-.69-.56-1.25-1.25-1.25h-6.5c-.69 0-1.25.56-1.25 1.25v.5a.75.75 0 0 1-1.5 0v-.5Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M8.78 7.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H1.75a.75.75 0 0 1 0-1.5h4.69l-.97-.97a.75.75 0 0 1 1.06-1.06l2.25 2.25Z",
    clipRule: "evenodd"
  }
));
var pt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentcolor",
    fillRule: "evenodd",
    d: "M4 6.104V4a4 4 0 1 1 8 0v2.104c1.154.326 2 1.387 2 2.646v4.5A2.75 2.75 0 0 1 11.25 16h-6.5A2.75 2.75 0 0 1 2 13.25v-4.5c0-1.259.846-2.32 2-2.646ZM5.5 4a2.5 2.5 0 0 1 5 0v2h-5V4Z",
    clipRule: "evenodd"
  }
));
var wt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentColor", ...t }, e.createElement("path", { d: "M12.227 11.52a5.477 5.477 0 0 0 1.246-2.97.5.5 0 0 0-.995-.1 4.478 4.478 0 0 1-.962 2.359l-1.07-1.07C10.794 9.247 11 8.647 11 8V3a3 3 0 0 0-6 0v1.293L1.354.646a.5.5 0 1 0-.708.708l14 14a.5.5 0 0 0 .708-.708zM8 12.5c.683 0 1.33-.152 1.911-.425l.743.743c-.649.359-1.378.59-2.154.66V15h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2v-1.522a5.502 5.502 0 0 1-4.973-4.929.5.5 0 0 1 .995-.098A4.5 4.5 0 0 0 8 12.5z" }), e.createElement("path", { d: "M8.743 10.907 5 7.164V8a3 3 0 0 0 3.743 2.907z" }));
var kt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentColor", ...t }, e.createElement(
  "path",
  {
    fillRule: "evenodd",
    d: "M2.975 8.002a.5.5 0 0 1 .547.449 4.5 4.5 0 0 0 8.956 0 .5.5 0 1 1 .995.098A5.502 5.502 0 0 1 8.5 13.478V15h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2v-1.522a5.502 5.502 0 0 1-4.973-4.929.5.5 0 0 1 .448-.547z",
    clipRule: "evenodd"
  }
), e.createElement("path", { d: "M5 3a3 3 0 1 1 6 0v5a3 3 0 0 1-6 0z" }));
var Rt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentcolor", ...t }, e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-6a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-6a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }));
var Mt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentcolor", ...t }, e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("g", { opacity: 0.25 }, e.createElement("path", { d: "M12 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M12 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" })));
var yt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentcolor", ...t }, e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("g", { opacity: 0.25 }, e.createElement("path", { d: "M6 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M6 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm6-6a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" }), e.createElement("path", { d: "M12 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" })));
var bt2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "currentColor", ...t }, e.createElement("g", { opacity: 0.25 }, e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4Zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-9Zm6-6a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V.5Z" }), e.createElement("path", { d: "M0 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4Zm6-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-9Zm6-6a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V.5Z" })));
var Me = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M0 2.75A2.75 2.75 0 0 1 2.75 0h14.5A2.75 2.75 0 0 1 20 2.75v10.5A2.75 2.75 0 0 1 17.25 16H2.75A2.75 2.75 0 0 1 0 13.25V2.75ZM2.75 1.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V2.75c0-.69-.56-1.25-1.25-1.25H2.75Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M9.47 4.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v4.69a.75.75 0 0 1-1.5 0V6.56l-.97.97a.75.75 0 0 1-1.06-1.06l2.25-2.25Z",
    clipRule: "evenodd"
  }
));
var St = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 16, fill: "none", ...t }, e.createElement("g", { fill: "currentColor" }, e.createElement("path", { d: "M7.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L10 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L11.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L10 6.94z" }), e.createElement(
  "path",
  {
    fillRule: "evenodd",
    d: "M2.75 0A2.75 2.75 0 0 0 0 2.75v10.5A2.75 2.75 0 0 0 2.75 16h14.5A2.75 2.75 0 0 0 20 13.25V2.75A2.75 2.75 0 0 0 17.25 0zM1.5 2.75c0-.69.56-1.25 1.25-1.25h14.5c.69 0 1.25.56 1.25 1.25v10.5c0 .69-.56 1.25-1.25 1.25H2.75c-.69 0-1.25-.56-1.25-1.25z",
    clipRule: "evenodd"
  }
)));
var oe = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M8 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M8 12a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 12Z",
    clipRule: "evenodd",
    opacity: 0.7
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M12 1.072a.75.75 0 0 1 .274 1.024l-1.25 2.165a.75.75 0 0 1-1.299-.75l1.25-2.165A.75.75 0 0 1 12 1.072Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M6 11.464a.75.75 0 0 1 .274 1.025l-1.25 2.165a.75.75 0 0 1-1.299-.75l1.25-2.165A.75.75 0 0 1 6 11.464Z",
    clipRule: "evenodd",
    opacity: 0.6
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M14.928 4a.75.75 0 0 1-.274 1.025l-2.165 1.25a.75.75 0 1 1-.75-1.3l2.165-1.25A.75.75 0 0 1 14.928 4Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M4.536 10a.75.75 0 0 1-.275 1.024l-2.165 1.25a.75.75 0 0 1-.75-1.298l2.165-1.25A.75.75 0 0 1 4.536 10Z",
    clipRule: "evenodd",
    opacity: 0.5
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M16 8a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h2.5A.75.75 0 0 1 16 8Z",
    clipRule: "evenodd"
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M4 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h2.5A.75.75 0 0 1 4 8Z",
    clipRule: "evenodd",
    opacity: 0.4
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M14.928 12a.75.75 0 0 1-1.024.274l-2.165-1.25a.75.75 0 0 1 .75-1.299l2.165 1.25A.75.75 0 0 1 14.928 12Z",
    clipRule: "evenodd",
    opacity: 0.9
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M4.536 6a.75.75 0 0 1-1.025.275l-2.165-1.25a.75.75 0 1 1 .75-1.3l2.165 1.25A.75.75 0 0 1 4.536 6Z",
    clipRule: "evenodd",
    opacity: 0.3
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M12 14.928a.75.75 0 0 1-1.024-.274l-1.25-2.165a.75.75 0 0 1 1.298-.75l1.25 2.165A.75.75 0 0 1 12 14.928Z",
    clipRule: "evenodd",
    opacity: 0.8
  }
), e.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M6 4.536a.75.75 0 0 1-1.024-.275l-1.25-2.165a.75.75 0 1 1 1.299-.75l1.25 2.165A.75.75 0 0 1 6 4.536Z",
    clipRule: "evenodd",
    opacity: 0.2
  }
));
var Ct2 = (t) => e.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...t }, e.createElement("g", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5 }, e.createElement("path", { d: "M13.25 7H9m0 0V2.75M9 7l5.25-5.25M2.75 9H7m0 0v4.25M7 9l-5.25 5.25" })));
var It2 = e.forwardRef(
  function({ trackRef: n, ...a }, r) {
    const c = Un(), { mergedProps: s, inFocus: o } = Et({
      trackRef: n ?? c,
      props: a
    });
    return e.createElement(Nn.Consumer, null, (l) => l !== void 0 && e.createElement("button", { ref: r, ...s }, a.children ? a.children : o ? e.createElement(Ct2, null) : e.createElement(Et2, null)));
  }
);
var ua = e.forwardRef(
  function({
    kind: n,
    initialSelection: a,
    onActiveDeviceChange: r,
    onDeviceListChange: c,
    onDeviceSelectError: s,
    exactMatch: o,
    track: l,
    requestPermissions: i,
    onError: u,
    ...d
  }, g) {
    const f = _o(), w = e.useCallback(
      (E) => {
        f && f.emit(RoomEvent.MediaDevicesError, E), u == null || u(E);
      },
      [f, u]
    ), { devices: p, activeDeviceId: m, setActiveMediaDevice: v, className: b2 } = Ct({
      kind: n,
      room: f,
      track: l,
      requestPermissions: i,
      onError: w
    });
    e.useEffect(() => {
      a !== void 0 && v(a);
    }, [v]), e.useEffect(() => {
      typeof c == "function" && c(p);
    }, [c, p]), e.useEffect(() => {
      m && m !== "" && (r == null || r(m));
    }, [m]);
    const C = async (E) => {
      try {
        await v(E, { exact: o ?? true });
      } catch (k) {
        if (k instanceof Error)
          s == null || s(k);
        else
          throw k;
      }
    }, T2 = e.useMemo(
      () => G(d, { className: b2 }, { className: "lk-list" }),
      [b2, d]
    ), A = !!p.find((E) => E.label.toLowerCase().startsWith("default"));
    function h(E, k, I2) {
      return E === k || !A && I2 === 0 && k === "default";
    }
    return e.createElement("ul", { ref: g, ...T2 }, p.map((E, k) => e.createElement(
      "li",
      {
        key: E.deviceId,
        id: E.deviceId,
        "data-lk-active": h(E.deviceId, m, k),
        "aria-selected": h(E.deviceId, m, k),
        role: "option"
      },
      e.createElement("button", { className: "lk-button", onClick: () => C(E.deviceId) }, E.label)
    )));
  }
);
var da = e.forwardRef(
  function({ label: n = "Allow Audio", ...a }, r) {
    const c = Vs(), { mergedProps: s } = zt({ room: c, props: a });
    return e.createElement("button", { ref: r, ...s }, n);
  }
);
var ma = e.forwardRef(
  function({ label: n, ...a }, r) {
    const c = Vs(), { mergedProps: s, canPlayAudio: o } = zt({ room: c, props: a }), { mergedProps: l, canPlayVideo: i } = Ut({ room: c, props: s }), { style: u, ...d } = l;
    return u.display = o && i ? "none" : "block", e.createElement("button", { ref: r, style: u, ...d }, n ?? `Start ${o ? "Video" : "Audio"}`);
  }
);
function ye(t, n) {
  switch (t) {
    case Track.Source.Microphone:
      return n ? e.createElement(kt2, null) : e.createElement(wt2, null);
    case Track.Source.Camera:
      return n ? e.createElement(vt, null) : e.createElement(gt, null);
    case Track.Source.ScreenShare:
      return n ? e.createElement(St, null) : e.createElement(Me, null);
    default:
      return;
  }
}
function xt2(t) {
  switch (t) {
    case ConnectionQuality.Excellent:
      return e.createElement(Rt2, null);
    case ConnectionQuality.Good:
      return e.createElement(Mt2, null);
    case ConnectionQuality.Poor:
      return e.createElement(yt2, null);
    default:
      return e.createElement(bt2, null);
  }
}
var fa = e.forwardRef(function({ showIcon: n, ...a }, r) {
  const { buttonProps: c, enabled: s } = Gt(a), [o, l] = e.useState(false);
  return e.useEffect(() => {
    l(true);
  }, []), o && e.createElement("button", { ref: r, ...c }, (n ?? true) && ye(a.source, s), a.children);
});
var be = e.forwardRef(function(n, a) {
  const { className: r, quality: c } = Pt(n), s = e.useMemo(() => ({ ...G(n, { className: r }), "data-lk-quality": c }), [c, n, r]);
  return e.createElement("div", { ref: a, ...s }, n.children ?? xt2(c));
});
var K = e.forwardRef(
  function({ participant: n, ...a }, r) {
    const c = Bs(n), { className: s, infoObserver: o } = e.useMemo(() => bs(c), [c]), { identity: l, name: i } = b(o, {
      name: c.name,
      identity: c.identity,
      metadata: c.metadata
    }), u = e.useMemo(() => G(a, { className: s, "data-lk-participant-name": i }), [a, s, i]);
    return e.createElement("span", { ref: r, ...u }, i !== "" ? i : l, a.children);
  }
);
var Se = e.forwardRef(
  function({ trackRef: n, show: a = "always", ...r }, c) {
    const { className: s, isMuted: o } = Wt(n), l = a === "always" || a === "muted" && o || a === "unmuted" && !o, i = e.useMemo(
      () => G(r, {
        className: s
      }),
      [s, r]
    );
    return l ? e.createElement("div", { ref: c, ...i, "data-lk-muted": o }, r.children ?? ye(n.source, !o)) : null;
  }
);
var Pt2 = (t) => e.createElement(
  "svg",
  {
    width: 320,
    height: 320,
    viewBox: "0 0 320 320",
    preserveAspectRatio: "xMidYMid meet",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t
  },
  e.createElement(
    "path",
    {
      d: "M160 180C204.182 180 240 144.183 240 100C240 55.8172 204.182 20 160 20C115.817 20 79.9997 55.8172 79.9997 100C79.9997 144.183 115.817 180 160 180Z",
      fill: "white",
      fillOpacity: 0.25
    }
  ),
  e.createElement(
    "path",
    {
      d: "M97.6542 194.614C103.267 191.818 109.841 192.481 115.519 195.141C129.025 201.466 144.1 205 159.999 205C175.899 205 190.973 201.466 204.48 195.141C210.158 192.481 216.732 191.818 222.345 194.614C262.703 214.719 291.985 253.736 298.591 300.062C300.15 310.997 291.045 320 280 320H39.9997C28.954 320 19.8495 310.997 21.4087 300.062C28.014 253.736 57.2966 214.72 97.6542 194.614Z",
      fill: "white",
      fillOpacity: 0.25
    }
  )
);
function Ce(t, n = {}) {
  const [a, r] = e.useState(Bt(t)), [c, s] = e.useState(a == null ? void 0 : a.isMuted), [o, l] = e.useState(a == null ? void 0 : a.isSubscribed), [i, u] = e.useState(a == null ? void 0 : a.track), [d, g] = e.useState("landscape"), f = e.useRef(), { className: w, trackObserver: p } = e.useMemo(() => Zo(t), [
    t.participant.sid ?? t.participant.identity,
    t.source,
    j(t) && t.publication.trackSid
  ]);
  return e.useEffect(() => {
    const m = p.subscribe((v) => {
      _2.debug("update track", v), r(v), s(v == null ? void 0 : v.isMuted), l(v == null ? void 0 : v.isSubscribed), u(v == null ? void 0 : v.track);
    });
    return () => m == null ? void 0 : m.unsubscribe();
  }, [p]), e.useEffect(() => {
    var m, v;
    return i && (f.current && i.detach(f.current), (m = n.element) != null && m.current && !(t.participant.isLocal && (i == null ? void 0 : i.kind) === "audio") && i.attach(n.element.current)), f.current = (v = n.element) == null ? void 0 : v.current, () => {
      f.current && (i == null || i.detach(f.current));
    };
  }, [i, n.element]), e.useEffect(() => {
    var m, v;
    if (typeof ((m = a == null ? void 0 : a.dimensions) == null ? void 0 : m.width) == "number" && typeof ((v = a == null ? void 0 : a.dimensions) == null ? void 0 : v.height) == "number") {
      const b2 = a.dimensions.width > a.dimensions.height ? "landscape" : "portrait";
      g(b2);
    }
  }, [a]), {
    publication: a,
    isMuted: c,
    isSubscribed: o,
    track: i,
    elementProps: G(n.props, {
      className: w,
      "data-lk-local-participant": t.participant.isLocal,
      "data-lk-source": a == null ? void 0 : a.source,
      ...(a == null ? void 0 : a.kind) === "video" && { "data-lk-orientation": d }
    })
  };
}
var Y;
var ue;
function Tt2() {
  if (ue) return Y;
  ue = 1;
  var t = "Expected a function", n = NaN, a = "[object Symbol]", r = /^\s+|\s+$/g, c = /^[-+]0x[0-9a-f]+$/i, s = /^0b[01]+$/i, o = /^0o[0-7]+$/i, l = parseInt, i = typeof Mo == "object" && Mo && Mo.Object === Object && Mo, u = typeof self == "object" && self && self.Object === Object && self, d = i || u || Function("return this")(), g = Object.prototype, f = g.toString, w = Math.max, p = Math.min, m = function() {
    return d.Date.now();
  };
  function v(h, E, k) {
    var I2, V, O2, N2, M2, P, F = 0, re = false, Z = false, D = true;
    if (typeof h != "function")
      throw new TypeError(t);
    E = A(E) || 0, b2(k) && (re = !!k.leading, Z = "maxWait" in k, O2 = Z ? w(A(k.maxWait) || 0, E) : O2, D = "trailing" in k ? !!k.trailing : D);
    function U(R) {
      var x = I2, H3 = V;
      return I2 = V = void 0, F = R, N2 = h.apply(H3, x), N2;
    }
    function Pe(R) {
      return F = R, M2 = setTimeout(W3, E), re ? U(R) : N2;
    }
    function Te(R) {
      var x = R - P, H3 = R - F, se = E - x;
      return Z ? p(se, O2 - H3) : se;
    }
    function ce(R) {
      var x = R - P, H3 = R - F;
      return P === void 0 || x >= E || x < 0 || Z && H3 >= O2;
    }
    function W3() {
      var R = m();
      if (ce(R))
        return le(R);
      M2 = setTimeout(W3, Te(R));
    }
    function le(R) {
      return M2 = void 0, D && I2 ? U(R) : (I2 = V = void 0, N2);
    }
    function Ae() {
      M2 !== void 0 && clearTimeout(M2), F = 0, I2 = P = V = M2 = void 0;
    }
    function Ne() {
      return M2 === void 0 ? N2 : le(m());
    }
    function G2() {
      var R = m(), x = ce(R);
      if (I2 = arguments, V = this, P = R, x) {
        if (M2 === void 0)
          return Pe(P);
        if (Z)
          return M2 = setTimeout(W3, E), U(P);
      }
      return M2 === void 0 && (M2 = setTimeout(W3, E)), N2;
    }
    return G2.cancel = Ae, G2.flush = Ne, G2;
  }
  function b2(h) {
    var E = typeof h;
    return !!h && (E == "object" || E == "function");
  }
  function C(h) {
    return !!h && typeof h == "object";
  }
  function T2(h) {
    return typeof h == "symbol" || C(h) && f.call(h) == a;
  }
  function A(h) {
    if (typeof h == "number")
      return h;
    if (T2(h))
      return n;
    if (b2(h)) {
      var E = typeof h.valueOf == "function" ? h.valueOf() : h;
      h = b2(E) ? E + "" : E;
    }
    if (typeof h != "string")
      return h === 0 ? h : +h;
    h = h.replace(r, "");
    var k = s.test(h);
    return k || o.test(h) ? l(h.slice(2), k ? 2 : 8) : c.test(h) ? n : +h;
  }
  return Y = v, Y;
}
var At2 = Tt2();
var de = Ar(At2);
function Nt2(t) {
  const n = (0, import_react.useRef)(t);
  n.current = t, (0, import_react.useEffect)(
    () => () => {
      n.current();
    },
    []
  );
}
function Lt2(t, n = 500, a) {
  const r = (0, import_react.useRef)();
  Nt2(() => {
    r.current && r.current.cancel();
  });
  const c = (0, import_react.useMemo)(() => {
    const s = de(t, n, a), o = (...l) => s(...l);
    return o.cancel = () => {
      s.cancel();
    }, o.isPending = () => !!r.current, o.flush = () => s.flush(), o;
  }, [t, n, a]);
  return (0, import_react.useEffect)(() => {
    r.current = de(t, n, a);
  }, [t, n, a]), c;
}
function zt2(t, n, a) {
  const r = (u, d) => u === d, c = t instanceof Function ? t() : t, [s, o] = (0, import_react.useState)(c), l = (0, import_react.useRef)(c), i = Lt2(
    o,
    n,
    a
  );
  return r(l.current, c) || (i(c), l.current = c), [s, i];
}
function Vt2({
  threshold: t = 0,
  root: n = null,
  rootMargin: a = "0%",
  freezeOnceVisible: r = false,
  initialIsIntersecting: c = false,
  onChange: s
} = {}) {
  var o;
  const [l, i] = (0, import_react.useState)(null), [u, d] = (0, import_react.useState)(() => ({
    isIntersecting: c,
    entry: void 0
  })), g = (0, import_react.useRef)();
  g.current = s;
  const f = ((o = u.entry) == null ? void 0 : o.isIntersecting) && r;
  (0, import_react.useEffect)(() => {
    if (!l || !("IntersectionObserver" in window) || f)
      return;
    const m = new IntersectionObserver(
      (v) => {
        const b2 = Array.isArray(m.thresholds) ? m.thresholds : [m.thresholds];
        v.forEach((C) => {
          const T2 = C.isIntersecting && b2.some((A) => C.intersectionRatio >= A);
          d({ isIntersecting: T2, entry: C }), g.current && g.current(T2, C);
        });
      },
      { threshold: t, root: n, rootMargin: a }
    );
    return m.observe(l), () => {
      m.disconnect();
    };
  }, [
    l,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(t),
    n,
    a,
    f,
    r
  ]);
  const w = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    var m;
    !l && ((m = u.entry) != null && m.target) && !r && !f && w.current !== u.entry.target && (w.current = u.entry.target, d({ isIntersecting: c, entry: void 0 }));
  }, [l, u.entry, r, f, c]);
  const p = [
    i,
    !!u.isIntersecting,
    u.entry
  ];
  return p.ref = p[0], p.isIntersecting = p[1], p.entry = p[2], p;
}
var Ft2 = e.forwardRef(
  function({
    onTrackClick: n,
    onClick: a,
    onSubscriptionStatusChanged: r,
    trackRef: c,
    manageSubscription: s,
    ...o
  }, l) {
    const i = js(c), u = e.useRef(null);
    e.useImperativeHandle(l, () => u.current);
    const d = Vt2({ root: u.current }), [g] = zt2(d, 3e3);
    e.useEffect(() => {
      s && i.publication instanceof RemoteTrackPublication && (g == null ? void 0 : g.isIntersecting) === false && (d == null ? void 0 : d.isIntersecting) === false && i.publication.setSubscribed(false);
    }, [g, i, s]), e.useEffect(() => {
      s && i.publication instanceof RemoteTrackPublication && (d == null ? void 0 : d.isIntersecting) === true && i.publication.setSubscribed(true);
    }, [d, i, s]);
    const {
      elementProps: f,
      publication: w,
      isSubscribed: p
    } = Ce(i, {
      element: u,
      props: o
    });
    e.useEffect(() => {
      r == null || r(!!p);
    }, [p, r]);
    const m = (v) => {
      a == null || a(v), n == null || n({ participant: i == null ? void 0 : i.participant, track: w });
    };
    return e.createElement("video", { ref: u, ...f, muted: true, onClick: m });
  }
);
var ne = e.forwardRef(
  function({ trackRef: n, onSubscriptionStatusChanged: a, volume: r, ...c }, s) {
    const o = js(n), l = e.useRef(null);
    e.useImperativeHandle(s, () => l.current);
    const {
      elementProps: i,
      isSubscribed: u,
      track: d,
      publication: g
    } = Ce(o, {
      element: l,
      props: c
    });
    return e.useEffect(() => {
      a == null || a(!!u);
    }, [u, a]), e.useEffect(() => {
      d === void 0 || r === void 0 || (d instanceof RemoteAudioTrack ? d.setVolume(r) : _2.warn("Volume can only be set on remote audio tracks."));
    }, [r, d]), e.useEffect(() => {
      g === void 0 || c.muted === void 0 || (g instanceof RemoteTrackPublication ? g.setEnabled(!c.muted) : _2.warn("Can only call setEnabled on remote track publications."));
    }, [c.muted, g, d]), e.createElement("audio", { ref: l, ...i });
  }
);
function Zt2(t) {
  const n = !!Lo();
  return t.participant && !n ? e.createElement(jn.Provider, { value: t.participant }, t.children) : e.createElement(e.Fragment, null, t.children);
}
function Ht2(t) {
  const n = !!Un();
  return t.trackRef && !n ? e.createElement(Fn.Provider, { value: t.trackRef }, t.children) : e.createElement(e.Fragment, null, t.children);
}
var Bt3 = e.forwardRef(
  function({
    trackRef: n,
    children: a,
    onParticipantClick: r,
    disableSpeakingIndicator: c,
    ...s
  }, o) {
    var w, p;
    const l = js(n), { elementProps: i } = Rt({
      htmlProps: s,
      disableSpeakingIndicator: c,
      onParticipantClick: r,
      trackRef: l
    }), u = Xt(l.participant), d = ko(), g = (w = zs()) == null ? void 0 : w.autoSubscription, f = e.useCallback(
      (m) => {
        l.source && !m && d && d.pin.dispatch && $o(l, d.pin.state) && d.pin.dispatch({ msg: "clear_pin" });
      },
      [l, d]
    );
    return e.createElement("div", { ref: o, style: { position: "relative" }, ...i }, e.createElement(Ht2, { trackRef: l }, e.createElement(Zt2, { participant: l.participant }, a ?? e.createElement(e.Fragment, null, j(l) && (((p = l.publication) == null ? void 0 : p.kind) === "video" || l.source === Track.Source.Camera || l.source === Track.Source.ScreenShare) ? e.createElement(
      Ft2,
      {
        trackRef: l,
        onSubscriptionStatusChanged: f,
        manageSubscription: g
      }
    ) : j(l) && e.createElement(
      ne,
      {
        trackRef: l,
        onSubscriptionStatusChanged: f
      }
    ), e.createElement("div", { className: "lk-participant-placeholder" }, e.createElement(Pt2, null)), e.createElement("div", { className: "lk-participant-metadata" }, e.createElement("div", { className: "lk-participant-metadata-item" }, l.source === Track.Source.Camera ? e.createElement(e.Fragment, null, u && e.createElement(pt2, { style: { marginRight: "0.25rem" } }), e.createElement(
      Se,
      {
        trackRef: {
          participant: l.participant,
          source: Track.Source.Microphone
        },
        show: "muted"
      }
    ), e.createElement(K, null)) : e.createElement(e.Fragment, null, e.createElement(Me, { style: { marginRight: "0.25rem" } }), e.createElement(K, null, "'s screen"))), e.createElement(be, { className: "lk-participant-metadata-item" }))), e.createElement(It2, { trackRef: l }))));
  }
);
function ha(t) {
  const n = G(t, { className: "lk-focus-layout" });
  return e.createElement("div", { ...n }, t.children);
}
function ga({ trackRef: t, ...n }) {
  return e.createElement(Bt3, { trackRef: t, ...n });
}
function Ie({ tracks: t, ...n }) {
  return e.createElement(e.Fragment, null, t.map((a) => e.createElement(
    Fn.Provider,
    {
      value: a,
      key: N(a)
    },
    H(n.children)
  )));
}
function jt2({
  totalPageCount: t,
  nextPage: n,
  prevPage: a,
  currentPage: r,
  pagesContainer: c
}) {
  const [s, o] = e.useState(false);
  return e.useEffect(() => {
    let l;
    return c && (l = _s(c.current, 2e3).subscribe(
      o
    )), () => {
      l && l.unsubscribe();
    };
  }, [c]), e.createElement("div", { className: "lk-pagination-control", "data-lk-user-interaction": s }, e.createElement("button", { className: "lk-button", onClick: a }, e.createElement(ie, null)), e.createElement("span", { className: "lk-pagination-count" }, `${r} of ${t}`), e.createElement("button", { className: "lk-button", onClick: n }, e.createElement(ie, null)));
}
var _t2 = e.forwardRef(
  function({ totalPageCount: n, currentPage: a }, r) {
    const c = new Array(n).fill("").map((s, o) => o + 1 === a ? e.createElement("span", { "data-lk-active": true, key: o }) : e.createElement("span", { key: o }));
    return e.createElement("div", { ref: r, className: "lk-pagination-indicator" }, c);
  }
);
function va({ tracks: t, ...n }) {
  const a = e.createRef(), r = e.useMemo(
    () => G(n, { className: "lk-grid-layout" }),
    [n]
  ), { layout: c } = wt(a, t.length), s = Ot(c.maxTiles, t);
  return qt(a, {
    onLeftSwipe: s.nextPage,
    onRightSwipe: s.prevPage
  }), e.createElement("div", { ref: a, "data-lk-pagination": s.totalPageCount > 1, ...r }, e.createElement(Ie, { tracks: s.tracks }, n.children), t.length > c.maxTiles && e.createElement(e.Fragment, null, e.createElement(
    _t2,
    {
      totalPageCount: s.totalPageCount,
      currentPage: s.currentPage
    }
  ), e.createElement(jt2, { pagesContainer: a, ...s })));
}
var Ot2 = 130;
var Wt2 = 140;
var me = 1;
var xe = 16 / 10;
var qt2 = (1 - xe) * -1;
function Ea({ tracks: t, orientation: n, ...a }) {
  const r = e.useRef(null), [c, s] = e.useState(0), { width: o, height: l } = Ye(r), i = n || (l >= o ? "vertical" : "horizontal"), u = i === "vertical" ? Math.max(o * qt2, Ot2) : Math.max(l * xe, Wt2), d = No(), g = Math.max(i === "vertical" ? (l - d) / u : (o - d) / u, me);
  let f = Math.round(g);
  Math.abs(g - c) < 0.5 ? f = Math.round(c) : c !== g && s(g);
  const w = tt(t, f);
  return e.useLayoutEffect(() => {
    r.current && (r.current.dataset.lkOrientation = i, r.current.style.setProperty("--lk-max-visible-tiles", f.toString()));
  }, [f, i]), e.createElement("aside", { key: i, className: "lk-carousel", ref: r, ...a }, e.createElement(Ie, { tracks: w }, a.children));
}
function pa({
  value: t,
  onPinChange: n,
  onWidgetChange: a,
  children: r
}) {
  const c = Fs(t);
  return e.useEffect(() => {
    _2.debug("PinState Updated", { state: c.pin.state }), n && c.pin.state && n(c.pin.state);
  }, [c.pin.state, n]), e.useEffect(() => {
    _2.debug("Widget Updated", { widgetState: c.widget.state }), a && c.widget.state && a(c.widget.state);
  }, [a, c.widget.state]), e.createElement(Nn.Provider, { value: c }, r);
}
var wa = e.forwardRef(
  function({ trackRef: n, ...a }, r) {
    const d = js(n), g = Zt(d, { bands: 7, loPass: 300 });
    return e.createElement(
      "svg",
      {
        ref: r,
        width: "100%",
        height: "100%",
        viewBox: "0 0 200 90",
        ...a,
        className: "lk-audio-visualizer"
      },
      e.createElement("rect", { x: "0", y: "0", width: "100%", height: "100%" }),
      e.createElement(
        "g",
        {
          style: {
            transform: `translate(${(200 - 7 * 10) / 2}px, 0)`
          }
        },
        g.map((f, w) => e.createElement(
          "rect",
          {
            key: w,
            x: w * 10,
            y: 90 / 2 - f * 50 / 2,
            width: 6,
            height: f * 50
          }
        ))
      )
    );
  }
);
function ka({ participants: t, ...n }) {
  return e.createElement(e.Fragment, null, t.map((a) => e.createElement(jn.Provider, { value: a, key: a.identity }, H(n.children))));
}
function Ra({ volume: t, muted: n }) {
  const a = Qt(
    [Track.Source.Microphone, Track.Source.ScreenShareAudio, Track.Source.Unknown],
    {
      updateOnlyOn: [],
      onlySubscribed: true
    }
  ).filter((r) => !r.participant.isLocal && r.publication.kind === Track.Kind.Audio);
  return e.createElement("div", { style: { display: "none" } }, a.map((r) => e.createElement(
    ne,
    {
      key: N(r),
      trackRef: r,
      volume: t,
      muted: n
    }
  )));
}
var Ma = e.forwardRef(function({ childrenPosition: n = "before", children: a, ...r }, c) {
  const { name: s } = _t();
  return e.createElement("span", { ref: c, ...r }, n === "before" && a, s, n === "after" && a);
});
function $t2(t) {
  const n = e.useMemo(() => G(t, { className: "lk-toast" }), [t]);
  return e.createElement("div", { ...n }, t.children);
}
var Dt2 = (t) => {
  const n = [];
  for (let a = 0; a < t; a++)
    n.push([a, t - 1 - a]);
  return n;
};
var fe = (t) => [[Math.floor(t / 2)], [-1]];
var Ut2 = (t, n, a) => {
  const [r, c] = (0, import_react.useState)(0), [s, o] = (0, import_react.useState)([[]]);
  (0, import_react.useEffect)(() => {
    if (t === "thinking")
      o(fe(n));
    else if (t === "connecting" || t === "initializing") {
      const i = [...Dt2(n)];
      o(i);
    } else o(t === "listening" ? fe(n) : t === void 0 || t === "speaking" ? [new Array(n).fill(0).map((i, u) => u)] : [[]]);
    c(0);
  }, [t, n]);
  const l = (0, import_react.useRef)(null);
  return (0, import_react.useEffect)(() => {
    let i = performance.now();
    const u = (d) => {
      d - i >= a && (c((f) => f + 1), i = d), l.current = requestAnimationFrame(u);
    };
    return l.current = requestAnimationFrame(u), () => {
      l.current !== null && cancelAnimationFrame(l.current);
    };
  }, [a, n, t, s.length]), s[r % s.length];
};
var Gt2 = /* @__PURE__ */ new Map([
  ["connecting", 2e3],
  ["initializing", 2e3],
  ["listening", 500],
  ["thinking", 150]
]);
var Qt2 = (t, n) => {
  if (t === void 0)
    return 1e3;
  let a = Gt2.get(t);
  if (a)
    switch (t) {
      case "connecting":
        a /= n;
        break;
    }
  return a;
};
var Xt2 = e.forwardRef(
  function({ state: n, options: a, barCount: r = 15, trackRef: c, children: s, ...o }, l) {
    const i = G(o, { className: "lk-audio-bar-visualizer" });
    let u = Un();
    c && (u = c);
    const d = Zt(u, {
      bands: r,
      loPass: 100,
      hiPass: 200
    }), g = (a == null ? void 0 : a.minHeight) ?? 20, f = (a == null ? void 0 : a.maxHeight) ?? 100, w = Ut2(
      n,
      r,
      Qt2(n, r) ?? 100
    );
    return e.createElement("div", { ref: l, ...i, "data-lk-va-state": n }, d.map(
      (p, m) => s ? H(s, {
        "data-lk-highlighted": w.includes(m),
        "data-lk-bar-index": m,
        className: "lk-audio-bar",
        style: { height: `${Math.min(f, Math.max(g, p * 100 + 5))}%` }
      }) : e.createElement(
        "span",
        {
          key: m,
          "data-lk-highlighted": w.includes(m),
          "data-lk-bar-index": m,
          className: `lk-audio-bar ${w.includes(m) && "lk-highlighted"}`,
          style: {
            // TODO transform animations would be more performant, however the border-radius gets distorted when using scale transforms. a 9-slice approach (or 3 in this case) could work
            // transform: `scale(1, ${Math.min(maxHeight, Math.max(minHeight, volume))}`,
            height: `${Math.min(f, Math.max(g, p * 100 + 5))}%`
          }
        }
      )
    ));
  }
);
var ya = e.forwardRef(
  function({
    children: n,
    disableSpeakingIndicator: a,
    onParticipantClick: r,
    trackRef: c,
    ...s
  }, o) {
    const l = js(c), { elementProps: i } = Rt({
      trackRef: l,
      htmlProps: s,
      disableSpeakingIndicator: a,
      onParticipantClick: r
    });
    return e.createElement("div", { ref: o, style: { position: "relative", minHeight: "160px" }, ...i }, e.createElement(Fn.Provider, { value: l }, n ?? e.createElement(e.Fragment, null, j(l) && e.createElement(ne, { trackRef: l }), e.createElement(Xt2, { barCount: 7, options: { minHeight: 8 } }), e.createElement("div", { className: "lk-participant-metadata" }, e.createElement("div", { className: "lk-participant-metadata-item" }, e.createElement(Se, { trackRef: l }), e.createElement(K, null)), e.createElement(be, { className: "lk-participant-metadata-item" })))));
  }
);
function ba(t) {
  const [n, a] = e.useState(void 0), r = I(t.room);
  return e.useEffect(() => {
    switch (r) {
      case ConnectionState.Reconnecting:
        a(
          e.createElement(e.Fragment, null, e.createElement(oe, { className: "lk-spinner" }), " Reconnecting")
        );
        break;
      case ConnectionState.Connecting:
        a(
          e.createElement(e.Fragment, null, e.createElement(oe, { className: "lk-spinner" }), " Connecting")
        );
        break;
      case ConnectionState.Disconnected:
        a(e.createElement(e.Fragment, null, "Disconnected"));
        break;
      default:
        a(void 0);
        break;
    }
  }, [r]), n ? e.createElement($t2, { className: "lk-toast-connection-state" }, n) : e.createElement(e.Fragment, null);
}
var Sa = e.forwardRef(
  function({ entry: n, hideName: a = false, hideTimestamp: r = false, messageFormatter: c, ...s }, o) {
    var f, w, p, m;
    const l = e.useMemo(() => c ? c(n.message) : n.message, [n.message, c]), i = !!n.editTimestamp, u = new Date(n.timestamp), d = typeof navigator < "u" ? navigator.language : "en-US", g = ((f = n.from) == null ? void 0 : f.name) ?? ((w = n.from) == null ? void 0 : w.identity);
    return e.createElement(
      "li",
      {
        ref: o,
        className: "lk-chat-entry",
        title: u.toLocaleTimeString(d, { timeStyle: "full" }),
        "data-lk-message-origin": (p = n.from) != null && p.isLocal ? "local" : "remote",
        ...s
      },
      (!r || !a || i) && e.createElement("span", { className: "lk-meta-data" }, !a && e.createElement("strong", { className: "lk-participant-name" }, g), (!r || i) && e.createElement("span", { className: "lk-timestamp" }, i && "edited ", u.toLocaleTimeString(d, { timeStyle: "short" }))),
      e.createElement("span", { className: "lk-message-body" }, l),
      e.createElement("span", { className: "lk-message-attachements" }, (m = n.attachedFiles) == null ? void 0 : m.map(
        (v) => v.type.startsWith("image/") && e.createElement(
          "img",
          {
            style: { maxWidth: "300px", maxHeight: "300px" },
            key: v.name,
            src: URL.createObjectURL(v),
            alt: v.name
          }
        )
      ))
    );
  }
);
function Ca(t) {
  return Bo(t, Wo()).map((n, a) => {
    if (typeof n == "string")
      return n;
    {
      const r = n.content.toString(), c = n.type === "url" ? /^http(s?):\/\//.test(r) ? r : `https://${r}` : `mailto:${r}`;
      return e.createElement("a", { className: "lk-chat-link", key: a, href: c, target: "_blank", rel: "noreferrer" }, r);
    }
  });
}

// node_modules/@livekit/components-react/dist/prefabs.mjs
function ee({
  messageFormatter: o,
  messageDecoder: d,
  messageEncoder: l,
  channelTopic: n,
  ...E
}) {
  const p = e2.useRef(null), m = e2.useRef(null), u = e2.useMemo(() => ({ messageDecoder: d, messageEncoder: l, channelTopic: n }), [d, l, n]), { chatMessages: s, send: I2, isSending: t } = Ht(u), h = ko(), r = e2.useRef(0);
  async function v(c) {
    c.preventDefault(), m.current && m.current.value.trim() !== "" && (await I2(m.current.value), m.current.value = "", m.current.focus());
  }
  return e2.useEffect(() => {
    var c;
    p && ((c = p.current) == null || c.scrollTo({ top: p.current.scrollHeight }));
  }, [p, s]), e2.useEffect(() => {
    var i, g, a, C, S;
    if (!h || s.length === 0)
      return;
    if ((i = h.widget.state) != null && i.showChat && s.length > 0 && r.current !== ((g = s[s.length - 1]) == null ? void 0 : g.timestamp)) {
      r.current = (a = s[s.length - 1]) == null ? void 0 : a.timestamp;
      return;
    }
    const c = s.filter(
      (A) => !r.current || A.timestamp > r.current
    ).length, { widget: f } = h;
    c > 0 && ((C = f.state) == null ? void 0 : C.unreadMessages) !== c && ((S = f.dispatch) == null || S.call(f, { msg: "unread_msg", count: c }));
  }, [s, h == null ? void 0 : h.widget]), e2.createElement("div", { ...E, className: "lk-chat" }, e2.createElement("div", { className: "lk-chat-header" }, "Messages", h && e2.createElement(ra, { className: "lk-close-button" }, e2.createElement(la, null))), e2.createElement("ul", { className: "lk-list lk-chat-messages", ref: p }, E.children ? s.map(
    (c, f) => H(E.children, {
      entry: c,
      key: c.id ?? f,
      messageFormatter: o
    })
  ) : s.map((c, f, i) => {
    const g = f >= 1 && i[f - 1].from === c.from, a = f >= 1 && c.timestamp - i[f - 1].timestamp < 6e4;
    return e2.createElement(
      Sa,
      {
        key: c.id ?? f,
        hideName: g,
        hideTimestamp: g === false ? false : a,
        entry: c,
        messageFormatter: o
      }
    );
  })), e2.createElement("form", { className: "lk-chat-form", onSubmit: v }, e2.createElement(
    "input",
    {
      className: "lk-form-control lk-chat-form-input",
      disabled: t,
      ref: m,
      type: "text",
      placeholder: "Enter a message...",
      onInput: (c) => c.stopPropagation(),
      onKeyDown: (c) => c.stopPropagation(),
      onKeyUp: (c) => c.stopPropagation()
    }
  ), e2.createElement("button", { type: "submit", className: "lk-button lk-chat-form-button", disabled: t }, "Send")));
}
function O({
  kind: o,
  initialSelection: d,
  onActiveDeviceChange: l,
  tracks: n,
  requestPermissions: E = false,
  ...p
}) {
  const [m, u] = e2.useState(false), [s, I2] = e2.useState([]), [t, h] = e2.useState(true), [r, v] = e2.useState(E), c = (a, C) => {
    _2.debug("handle device change"), u(false), l == null || l(a, C);
  }, f = e2.useRef(null), i = e2.useRef(null);
  e2.useLayoutEffect(() => {
    m && v(true);
  }, [m]), e2.useLayoutEffect(() => {
    let a;
    return f.current && i.current && (s || t) && (a = Uo(f.current, i.current, (C, S) => {
      i.current && Object.assign(i.current.style, { left: `${C}px`, top: `${S}px` });
    })), h(false), () => {
      a == null || a();
    };
  }, [f, i, s, t]);
  const g = e2.useCallback(
    (a) => {
      i.current && a.target !== f.current && m && jo(i.current, a) && u(false);
    },
    [m, i, f]
  );
  return e2.useEffect(() => (document.addEventListener("click", g), () => {
    document.removeEventListener("click", g);
  }), [g]), e2.createElement(e2.Fragment, null, e2.createElement(
    "button",
    {
      className: "lk-button lk-button-menu",
      "aria-pressed": m,
      ...p,
      onClick: () => u(!m),
      ref: f
    },
    p.children
  ), !p.disabled && e2.createElement(
    "div",
    {
      className: "lk-device-menu",
      ref: i,
      style: { visibility: m ? "visible" : "hidden" }
    },
    o ? e2.createElement(
      ua,
      {
        initialSelection: d,
        onActiveDeviceChange: (a) => c(o, a),
        onDeviceListChange: I2,
        kind: o,
        track: n == null ? void 0 : n[o],
        requestPermissions: r
      }
    ) : e2.createElement(e2.Fragment, null, e2.createElement("div", { className: "lk-device-menu-heading" }, "Audio inputs"), e2.createElement(
      ua,
      {
        kind: "audioinput",
        onActiveDeviceChange: (a) => c("audioinput", a),
        onDeviceListChange: I2,
        track: n == null ? void 0 : n.audioinput,
        requestPermissions: r
      }
    ), e2.createElement("div", { className: "lk-device-menu-heading" }, "Video inputs"), e2.createElement(
      ua,
      {
        kind: "videoinput",
        onActiveDeviceChange: (a) => c("videoinput", a),
        onDeviceListChange: I2,
        track: n == null ? void 0 : n.videoinput,
        requestPermissions: r
      }
    ))
  ));
}
function W2() {
  e2.useEffect(() => {
    Q();
  }, []);
}
function Ke2(o, d) {
  const [l, n] = e2.useState(), E = e2.useMemo(() => new _(), []);
  return e2.useEffect(() => {
    let p = false, m = [];
    return E.lock().then(async (u) => {
      try {
        (o.audio || o.video) && (m = await createLocalTracks(o), p ? m.forEach((s) => s.stop()) : n(m));
      } catch (s) {
        d && s instanceof Error ? d(s) : _2.error(s);
      } finally {
        u();
      }
    }), () => {
      p = true, m.forEach((u) => {
        u.stop();
      });
    };
  }, [JSON.stringify(o, T), d, E]), l;
}
function Ze2(o, d, l) {
  const [n, E] = e2.useState(null), [p, m] = e2.useState(false), u = It({ kind: l }), [s, I2] = e2.useState(
    void 0
  ), [t, h] = e2.useState(), [r, v] = e2.useState(d);
  e2.useEffect(() => {
    v(d);
  }, [d]);
  const c = async (g, a) => {
    try {
      const C = a === "videoinput" ? await createLocalVideoTrack({
        deviceId: g,
        resolution: VideoPresets.h720.resolution
      }) : await createLocalAudioTrack({ deviceId: g }), S = await C.getDeviceId(false);
      S && g !== S && (i.current = S, v(S)), h(C);
    } catch (C) {
      C instanceof Error && E(C);
    }
  }, f = async (g, a) => {
    await g.setDeviceId(a), i.current = a;
  }, i = e2.useRef(r);
  return e2.useEffect(() => {
    o && !t && !n && !p && (_2.debug("creating track", l), m(true), c(r, l).finally(() => {
      m(false);
    }));
  }, [o, t, n, p]), e2.useEffect(() => {
    t && (o ? s != null && s.deviceId && i.current !== (s == null ? void 0 : s.deviceId) ? (_2.debug(`switching ${l} device from`, i.current, s.deviceId), f(t, s.deviceId)) : (_2.debug(`unmuting local ${l} track`), t.unmute()) : (_2.debug(`muting ${l} track`), t.mute().then(() => _2.debug(t.mediaStreamTrack))));
  }, [t, s, o, l]), e2.useEffect(() => () => {
    t && (_2.debug(`stopping local ${l} track`), t.stop(), t.mute());
  }, []), e2.useEffect(() => {
    I2(u == null ? void 0 : u.find((g) => g.deviceId === r));
  }, [r, u]), {
    selectedDevice: s,
    localTrack: t,
    deviceError: n
  };
}
function et2({
  defaults: o = {},
  onValidate: d,
  onSubmit: l,
  onError: n,
  debug: E,
  joinLabel: p = "Join Room",
  micLabel: m = "Microphone",
  camLabel: u = "Camera",
  userLabel: s = "Username",
  persistUserChoices: I2 = true,
  videoProcessor: t,
  ...h
}) {
  const {
    userChoices: r,
    saveAudioInputDeviceId: v,
    saveAudioInputEnabled: c,
    saveVideoInputDeviceId: f,
    saveVideoInputEnabled: i,
    saveUsername: g
  } = jt({
    defaults: o,
    preventSave: !I2,
    preventLoad: !I2
  }), [a, C] = e2.useState(r), [S, A] = e2.useState(a.audioEnabled), [w, L2] = e2.useState(a.videoEnabled), [T2, $2] = e2.useState(a.audioDeviceId), [k, N2] = e2.useState(a.videoDeviceId), [V, ae] = e2.useState(a.username);
  e2.useEffect(() => {
    c(S);
  }, [S, c]), e2.useEffect(() => {
    i(w);
  }, [w, i]), e2.useEffect(() => {
    v(T2);
  }, [T2, v]), e2.useEffect(() => {
    f(k);
  }, [k, f]), e2.useEffect(() => {
    g(V);
  }, [V, g]);
  const D = Ke2(
    {
      audio: S ? { deviceId: r.audioDeviceId } : false,
      video: w ? { deviceId: r.videoDeviceId, processor: t } : false
    },
    n
  ), U = e2.useRef(null), M2 = e2.useMemo(
    () => D == null ? void 0 : D.filter((b2) => b2.kind === Track.Kind.Video)[0],
    [D]
  ), ne2 = e2.useMemo(() => {
    if (M2) {
      const { facingMode: b2 } = facingModeFromLocalTrack(M2);
      return b2;
    } else
      return "undefined";
  }, [M2]), j2 = e2.useMemo(
    () => D == null ? void 0 : D.filter((b2) => b2.kind === Track.Kind.Audio)[0],
    [D]
  );
  e2.useEffect(() => (U.current && M2 && (M2.unmute(), M2.attach(U.current)), () => {
    M2 == null || M2.detach();
  }), [M2]);
  const [se, ce] = e2.useState(), _3 = e2.useCallback(
    (b2) => typeof d == "function" ? d(b2) : b2.username !== "",
    [d]
  );
  e2.useEffect(() => {
    const b2 = {
      username: V,
      videoEnabled: w,
      videoDeviceId: k,
      audioEnabled: S,
      audioDeviceId: T2
    };
    C(b2), ce(_3(b2));
  }, [V, w, _3, S, T2, k]);
  function re(b2) {
    b2.preventDefault(), _3(a) ? typeof l == "function" && l(a) : _2.warn("Validation failed with: ", a);
  }
  return W2(), e2.createElement("div", { className: "lk-prejoin", ...h }, e2.createElement("div", { className: "lk-video-container" }, M2 && e2.createElement("video", { ref: U, width: "1280", height: "720", "data-lk-facing-mode": ne2 }), (!M2 || !w) && e2.createElement("div", { className: "lk-camera-off-note" }, e2.createElement(Pt2, null))), e2.createElement("div", { className: "lk-button-group-container" }, e2.createElement("div", { className: "lk-button-group audio" }, e2.createElement(
    fa,
    {
      initialState: S,
      source: Track.Source.Microphone,
      onChange: (b2) => A(b2)
    },
    m
  ), e2.createElement("div", { className: "lk-button-group-menu" }, e2.createElement(
    O,
    {
      initialSelection: T2,
      kind: "audioinput",
      disabled: !j2,
      tracks: { audioinput: j2 },
      onActiveDeviceChange: (b2, F) => $2(F)
    }
  ))), e2.createElement("div", { className: "lk-button-group video" }, e2.createElement(
    fa,
    {
      initialState: w,
      source: Track.Source.Camera,
      onChange: (b2) => L2(b2)
    },
    u
  ), e2.createElement("div", { className: "lk-button-group-menu" }, e2.createElement(
    O,
    {
      initialSelection: k,
      kind: "videoinput",
      disabled: !M2,
      tracks: { videoinput: M2 },
      onActiveDeviceChange: (b2, F) => N2(F)
    }
  )))), e2.createElement("form", { className: "lk-username-container" }, e2.createElement(
    "input",
    {
      className: "lk-form-control",
      id: "username",
      name: "username",
      type: "text",
      defaultValue: V,
      placeholder: s,
      onChange: (b2) => ae(b2.target.value),
      autoComplete: "off"
    }
  ), e2.createElement(
    "button",
    {
      className: "lk-button lk-join-button",
      type: "submit",
      onClick: re,
      disabled: !se
    },
    p
  )), E && e2.createElement(e2.Fragment, null, e2.createElement("strong", null, "User Choices:"), e2.createElement("ul", { className: "lk-list", style: { overflow: "hidden", maxWidth: "15rem" } }, e2.createElement("li", null, "Username: ", `${a.username}`), e2.createElement("li", null, "Video Enabled: ", `${a.videoEnabled}`), e2.createElement("li", null, "Audio Enabled: ", `${a.audioEnabled}`), e2.createElement("li", null, "Video Device: ", `${a.videoDeviceId}`), e2.createElement("li", null, "Audio Device: ", `${a.audioDeviceId}`))));
}
function Ge({ props: o }) {
  const { dispatch: d, state: l } = Ds().widget, n = "lk-button lk-settings-toggle";
  return { mergedProps: e2.useMemo(() => M(o, {
    className: n,
    onClick: () => {
      d && d({ msg: "toggle_settings" });
    },
    "aria-pressed": l != null && l.showSettings ? "true" : "false"
  }), [o, n, d, l]) };
}
var Je = e2.forwardRef(
  function(d, l) {
    const { mergedProps: n } = Ge({ props: d });
    return e2.createElement("button", { ref: l, ...n }, d.children);
  }
);
function te({
  variation: o,
  controls: d,
  saveUserChoices: l = true,
  onDeviceError: n,
  ...E
}) {
  var $2;
  const [p, m] = e2.useState(false), u = ko();
  e2.useEffect(() => {
    var k, N2;
    ((k = u == null ? void 0 : u.widget.state) == null ? void 0 : k.showChat) !== void 0 && m((N2 = u == null ? void 0 : u.widget.state) == null ? void 0 : N2.showChat);
  }, [($2 = u == null ? void 0 : u.widget.state) == null ? void 0 : $2.showChat]);
  const I2 = ht(`(max-width: ${p ? 1e3 : 760}px)`) ? "minimal" : "verbose";
  o ?? (o = I2);
  const t = { leave: true, ...d }, h = At();
  h ? (t.camera ?? (t.camera = h.canPublish), t.microphone ?? (t.microphone = h.canPublish), t.screenShare ?? (t.screenShare = h.canPublish), t.chat ?? (t.chat = h.canPublishData && (d == null ? void 0 : d.chat))) : (t.camera = false, t.chat = false, t.microphone = false, t.screenShare = false);
  const r = e2.useMemo(
    () => o === "minimal" || o === "verbose",
    [o]
  ), v = e2.useMemo(
    () => o === "textOnly" || o === "verbose",
    [o]
  ), c = Yo(), [f, i] = e2.useState(false), g = e2.useCallback(
    (k) => {
      i(k);
    },
    [i]
  ), a = G({ className: "lk-control-bar" }, E), {
    saveAudioInputEnabled: C,
    saveVideoInputEnabled: S,
    saveAudioInputDeviceId: A,
    saveVideoInputDeviceId: w
  } = jt({ preventSave: !l }), L2 = e2.useCallback(
    (k, N2) => N2 ? C(k) : null,
    [C]
  ), T2 = e2.useCallback(
    (k, N2) => N2 ? S(k) : null,
    [S]
  );
  return e2.createElement("div", { ...a }, t.microphone && e2.createElement("div", { className: "lk-button-group" }, e2.createElement(
    fa,
    {
      source: Track.Source.Microphone,
      showIcon: r,
      onChange: L2,
      onDeviceError: (k) => n == null ? void 0 : n({ source: Track.Source.Microphone, error: k })
    },
    v && "Microphone"
  ), e2.createElement("div", { className: "lk-button-group-menu" }, e2.createElement(
    O,
    {
      kind: "audioinput",
      onActiveDeviceChange: (k, N2) => A(N2 ?? "default")
    }
  ))), t.camera && e2.createElement("div", { className: "lk-button-group" }, e2.createElement(
    fa,
    {
      source: Track.Source.Camera,
      showIcon: r,
      onChange: T2,
      onDeviceError: (k) => n == null ? void 0 : n({ source: Track.Source.Camera, error: k })
    },
    v && "Camera"
  ), e2.createElement("div", { className: "lk-button-group-menu" }, e2.createElement(
    O,
    {
      kind: "videoinput",
      onActiveDeviceChange: (k, N2) => w(N2 ?? "default")
    }
  ))), t.screenShare && c && e2.createElement(
    fa,
    {
      source: Track.Source.ScreenShare,
      captureOptions: { audio: true, selfBrowserSurface: "include" },
      showIcon: r,
      onChange: g,
      onDeviceError: (k) => n == null ? void 0 : n({ source: Track.Source.ScreenShare, error: k })
    },
    v && (f ? "Stop screen share" : "Share screen")
  ), t.chat && e2.createElement(ra, null, r && e2.createElement(sa, null), v && "Chat"), t.settings && e2.createElement(Je, null, r && e2.createElement(ia, null), v && "Settings"), t.leave && e2.createElement(ca, null, r && e2.createElement(oa, null), v && "Leave"), e2.createElement(ma, null));
}
function tt2({
  chatMessageFormatter: o,
  chatMessageDecoder: d,
  chatMessageEncoder: l,
  SettingsComponent: n,
  ...E
}) {
  var c, f;
  const [p, m] = e2.useState({
    showChat: false,
    unreadMessages: 0,
    showSettings: false
  }), u = e2.useRef(null), s = Qt(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false }
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false }
  ), I2 = (i) => {
    _2.debug("updating widget state", i), m(i);
  }, t = Ns(), h = s.filter(j).filter((i) => i.publication.source === Track.Source.ScreenShare), r = (c = Ft(t)) == null ? void 0 : c[0], v = s.filter((i) => !Do(i, r));
  return e2.useEffect(() => {
    var i, g, a, C, S, A;
    if (h.some((w) => w.publication.isSubscribed) && u.current === null ? (_2.debug("Auto set screen share focus:", { newScreenShareTrack: h[0] }), (g = (i = t.pin).dispatch) == null || g.call(i, { msg: "set_pin", trackReference: h[0] }), u.current = h[0]) : u.current && !h.some(
      (w) => {
        var L2, T2;
        return w.publication.trackSid === ((T2 = (L2 = u.current) == null ? void 0 : L2.publication) == null ? void 0 : T2.trackSid);
      }
    ) && (_2.debug("Auto clearing screen share focus."), (C = (a = t.pin).dispatch) == null || C.call(a, { msg: "clear_pin" }), u.current = null), r && !j(r)) {
      const w = s.find(
        (L2) => L2.participant.identity === r.participant.identity && L2.source === r.source
      );
      w !== r && j(w) && ((A = (S = t.pin).dispatch) == null || A.call(S, { msg: "set_pin", trackReference: w }));
    }
  }, [
    h.map((i) => `${i.publication.trackSid}_${i.publication.isSubscribed}`).join(),
    (f = r == null ? void 0 : r.publication) == null ? void 0 : f.trackSid,
    s
  ]), W2(), e2.createElement("div", { className: "lk-video-conference", ...E }, Fo() && e2.createElement(
    pa,
    {
      value: t,
      onWidgetChange: I2
    },
    e2.createElement("div", { className: "lk-video-conference-inner" }, r ? e2.createElement("div", { className: "lk-focus-layout-wrapper" }, e2.createElement(ha, null, e2.createElement(Ea, { tracks: v }, e2.createElement(Bt3, null)), r && e2.createElement(ga, { trackRef: r }))) : e2.createElement("div", { className: "lk-grid-layout-wrapper" }, e2.createElement(va, { tracks: s }, e2.createElement(Bt3, null))), e2.createElement(te, { controls: { chat: true, settings: !!n } })),
    e2.createElement(
      ee,
      {
        style: { display: p.showChat ? "grid" : "none" },
        messageFormatter: o,
        messageEncoder: l,
        messageDecoder: d
      }
    ),
    n && e2.createElement(
      "div",
      {
        className: "lk-settings-menu-modal",
        style: { display: p.showSettings ? "block" : "none" }
      },
      e2.createElement(n, null)
    )
  ), e2.createElement(Ra, null), e2.createElement(ba, null));
}
function at({ ...o }) {
  const [d, l] = e2.useState({
    showChat: false,
    unreadMessages: 0
  }), n = Qt([Track.Source.Microphone]);
  return W2(), e2.createElement(pa, { onWidgetChange: l }, e2.createElement("div", { className: "lk-audio-conference", ...o }, e2.createElement("div", { className: "lk-audio-conference-stage" }, e2.createElement(Ie, { tracks: n }, e2.createElement(ya, null))), e2.createElement(
    te,
    {
      controls: { microphone: true, screenShare: false, camera: false, chat: true }
    }
  ), d.showChat && e2.createElement(ee, null)));
}
function nt2({
  controls: o,
  saveUserChoices: d = true,
  onDeviceError: l,
  ...n
}) {
  const E = { leave: true, microphone: true, ...o }, p = At(), { microphoneTrack: m, localParticipant: u } = et(), s = e2.useMemo(() => ({
    participant: u,
    source: Track.Source.Microphone,
    publication: m
  }), [u, m]);
  p ? E.microphone ?? (E.microphone = p.canPublish) : E.microphone = false;
  const I2 = G({ className: "lk-agent-control-bar" }, n), { saveAudioInputEnabled: t, saveAudioInputDeviceId: h } = jt({
    preventSave: !d
  }), r = e2.useCallback(
    (v, c) => {
      c && t(v);
    },
    [t]
  );
  return e2.createElement("div", { ...I2 }, E.microphone && e2.createElement("div", { className: "lk-button-group" }, e2.createElement(
    fa,
    {
      source: Track.Source.Microphone,
      showIcon: true,
      onChange: r,
      onDeviceError: (v) => l == null ? void 0 : l({ source: Track.Source.Microphone, error: v })
    },
    e2.createElement(Xt2, { trackRef: s, barCount: 7, options: { minHeight: 5 } })
  ), e2.createElement("div", { className: "lk-button-group-menu" }, e2.createElement(
    O,
    {
      kind: "audioinput",
      onActiveDeviceChange: (v, c) => h(c ?? "default")
    }
  ))), E.leave && e2.createElement(ca, null, "Disconnect"), e2.createElement(ma, null));
}
export {
  at as AudioConference,
  ne as AudioTrack,
  wa as AudioVisualizer,
  Xt2 as BarVisualizer,
  gt as CameraDisabledIcon,
  vt as CameraIcon,
  Ea as CarouselLayout,
  ee as Chat,
  la as ChatCloseIcon,
  Sa as ChatEntry,
  sa as ChatIcon,
  ra as ChatToggle,
  ie as Chevron,
  aa as ClearPinButton,
  be as ConnectionQualityIndicator,
  na as ConnectionState,
  ba as ConnectionStateToast,
  te as ControlBar,
  ca as DisconnectButton,
  ga as FocusLayout,
  ha as FocusLayoutContainer,
  It2 as FocusToggle,
  Et2 as FocusToggleIcon,
  ia as GearIcon,
  va as GridLayout,
  Io as LKFeatureContext,
  Nn as LayoutContext,
  pa as LayoutContextProvider,
  oa as LeaveIcon,
  W as LiveKitRoom,
  pt2 as LockLockedIcon,
  O as MediaDeviceMenu,
  ua as MediaDeviceSelect,
  wt2 as MicDisabledIcon,
  kt2 as MicIcon,
  ya as ParticipantAudioTile,
  jn as ParticipantContext,
  Zt2 as ParticipantContextIfNeeded,
  ka as ParticipantLoop,
  K as ParticipantName,
  Pt2 as ParticipantPlaceholder,
  Bt3 as ParticipantTile,
  et2 as PreJoin,
  Rt2 as QualityExcellentIcon,
  Mt2 as QualityGoodIcon,
  yt2 as QualityPoorIcon,
  bt2 as QualityUnknownIcon,
  Ra as RoomAudioRenderer,
  Wn as RoomContext,
  Ma as RoomName,
  Me as ScreenShareIcon,
  St as ScreenShareStopIcon,
  oe as SpinnerIcon,
  da as StartAudio,
  ma as StartMediaButton,
  $t2 as Toast,
  Ie as TrackLoop,
  Se as TrackMutedIndicator,
  Fn as TrackRefContext,
  Ht2 as TrackRefContextIfNeeded,
  fa as TrackToggle,
  Ct2 as UnfocusToggleIcon,
  tt2 as VideoConference,
  Ft2 as VideoTrack,
  nt2 as VoiceAssistantControlBar,
  Ca as formatChatMessageLinks,
  j as isTrackReference,
  Ho as setLogExtension,
  Vo as setLogLevel,
  Mt as useAudioPlayback,
  Kt as useAudioWaveform,
  Ht as useChat,
  Jt as useChatToggle,
  yt as useClearPinButton,
  Pt as useConnectionQualityIndicator,
  I as useConnectionState,
  Ns as useCreateLayoutContext,
  kt as useDataChannel,
  Tt as useDisconnectButton,
  Fs as useEnsureCreateLayoutContext,
  $s as useEnsureLayoutContext,
  Bs as useEnsureParticipant,
  Hs as useEnsureRoom,
  js as useEnsureTrackRef,
  Ze as useFacingMode,
  zs as useFeatureContext,
  Et as useFocusToggle,
  wt as useGridLayout,
  Xt as useIsEncrypted,
  z as useIsMuted,
  nn as useIsRecording,
  Ke as useIsSpeaking,
  Ds as useLayoutContext,
  $ as useLiveKitRoom,
  et as useLocalParticipant,
  At as useLocalParticipantPermissions,
  ko as useMaybeLayoutContext,
  Lo as useMaybeParticipantContext,
  _o as useMaybeRoomContext,
  Un as useMaybeTrackRefContext,
  Ct as useMediaDeviceSelect,
  It as useMediaDevices,
  Zt as useMultibandTrackVolume,
  Ot as usePagination,
  en as useParticipantAttribute,
  bt as useParticipantAttributes,
  Ws as useParticipantContext,
  Dt as useParticipantInfo,
  Lt as useParticipantPermissions,
  Rt as useParticipantTile,
  q as useParticipantTracks,
  Nt as useParticipants,
  jt as usePersistentUserChoices,
  Ft as usePinnedTracks,
  Ze2 as usePreviewDevice,
  Ke2 as usePreviewTracks,
  Vt as useRemoteParticipant,
  H2 as useRemoteParticipants,
  Vs as useRoomContext,
  _t as useRoomInfo,
  Bt2 as useSortedParticipants,
  nt as useSpeakingParticipants,
  zt as useStartAudio,
  Ut as useStartVideo,
  qt as useSwipe,
  mt as useTextStream,
  xt as useToken,
  $t as useTrackByName,
  Wt as useTrackMutedIndicator,
  Us as useTrackRefContext,
  Gt as useTrackToggle,
  pt as useTrackTranscription,
  Yt as useTrackVolume,
  Qt as useTracks,
  sn as useTranscriptions,
  tt as useVisualStableUpdate,
  tn as useVoiceAssistant
};
//# sourceMappingURL=@livekit_components-react.js.map
