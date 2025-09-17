import {
  _,
  et
} from "./chunk-WSOV3ETE.js";
import {
  LocalAudioTrack
} from "./chunk-3PEDPLGC.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@livekit/components-react/dist/krisp.mjs
var i = __toESM(require_react(), 1);
function K(l = {}) {
  const [o, u] = i.useState(false), [p, a] = i.useState(false), [d, n] = i.useState(false);
  let e = et().microphoneTrack;
  const [s, k] = i.useState();
  l.trackRef && (e = l.trackRef.publication);
  const m = i.useCallback(async (t) => {
    if (t) {
      const { KrispNoiseFilter: r, isKrispNoiseFilterSupported: c } = await import("./@livekit_krisp-noise-filter.js");
      if (!c()) {
        _.warn("LiveKit-Krisp noise filter is not supported in this browser");
        return;
      }
      s || k(r(l.filterOptions));
    }
    u((r) => (r !== t && a(true), t));
  }, []);
  return i.useEffect(() => {
    var t;
    if (e && e.track instanceof LocalAudioTrack && s) {
      const r = e.track.getProcessor();
      r && r.name === "livekit-noise-filter" ? (a(true), r.setEnabled(o).finally(() => {
        a(false), n(o);
      })) : !r && o && (a(true), (t = e == null ? void 0 : e.track) == null || t.setProcessor(s).then(() => s.setEnabled(o)).then(() => {
        n(true);
      }).catch((c) => {
        n(false), _.error("Krisp hook: error enabling filter", c);
      }).finally(() => {
        a(false);
      }));
    }
  }, [o, e, s]), {
    setNoiseFilterEnabled: m,
    isNoiseFilterEnabled: d,
    isNoiseFilterPending: p,
    processor: s
  };
}
export {
  K as useKrispNoiseFilter
};
//# sourceMappingURL=@livekit_components-react_krisp.js.map
