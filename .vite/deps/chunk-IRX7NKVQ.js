import {
  flip,
  offset,
  shift,
  size,
  tabbable,
  useFloating
} from "./chunk-A7E4BFYW.js";
import {
  floor,
  getComputedStyle,
  getOverflowAncestors,
  getParentNode,
  getWindow,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isShadowRoot,
  isWebKit
} from "./chunk-6HZVNCF2.js";
import {
  require_client
} from "./chunk-NXCOKIIN.js";
import {
  arrow_default,
  computeStyles_default,
  eventListeners_default,
  flip_default,
  getNodeName,
  hide_default,
  isHTMLElement as isHTMLElement2,
  offset_default,
  popperGenerator,
  popperOffsets_default,
  preventOverflow_default
} from "./chunk-E35HUR62.js";
import {
  $s,
  Ac,
  As,
  Bc,
  De,
  Ec,
  Ee,
  Extension,
  Fr,
  G,
  Hs,
  Ic,
  In,
  J,
  Jn,
  Ln,
  Lr,
  Mark,
  Mc,
  NodeView,
  Nr,
  Pc,
  Plugin,
  PluginKey,
  Pn,
  Pt,
  Q,
  Qo,
  Tc,
  Te,
  Vc,
  Vt,
  Xr,
  Zo,
  _,
  _r,
  an,
  ar,
  cr,
  dr,
  ee,
  er,
  ft,
  getRenderedAttributes,
  getText,
  getTextSerializersFromSchema,
  isNodeSelection,
  isTextSelection,
  ke,
  lr,
  nt,
  ot,
  pn,
  posToDOMRect,
  qr,
  ra,
  rr,
  rt,
  sa,
  sn,
  sr,
  wc,
  xc,
  xe,
  z
} from "./chunk-IVUUA3PF.js";
import {
  require_jsx_runtime
} from "./chunk-UZNMMFWU.js";
import {
  require_react_dom
} from "./chunk-YRTHPB3T.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@blocknote/react/dist/blocknote-react.js
var import_react3 = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());

// node_modules/@floating-ui/react/dist/floating-ui.react.mjs
var React = __toESM(require_react(), 1);
var import_react = __toESM(require_react(), 1);

// node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs
function activeElement(doc) {
  let activeElement2 = doc.activeElement;
  while (((_activeElement = activeElement2) == null || (_activeElement = _activeElement.shadowRoot) == null ? void 0 : _activeElement.activeElement) != null) {
    var _activeElement;
    activeElement2 = activeElement2.shadowRoot.activeElement;
  }
  return activeElement2;
}
function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();
  if (parent.contains(child)) {
    return true;
  }
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getPlatform() {
  const uaData = navigator.userAgentData;
  if (uaData != null && uaData.platform) {
    return uaData.platform;
  }
  return navigator.platform;
}
function getUserAgent() {
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map((_ref) => {
      let {
        brand,
        version: version2
      } = _ref;
      return brand + "/" + version2;
    }).join(" ");
  }
  return navigator.userAgent;
}
function isVirtualPointerEvent(event) {
  if (isJSDOM()) return false;
  return !isAndroid() && event.width === 0 && event.height === 0 || isAndroid() && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "mouse" || // iOS VoiceOver returns 0.333• for width/height.
  event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "touch";
}
function isSafari() {
  return /apple/i.test(navigator.vendor);
}
function isAndroid() {
  const re2 = /android/i;
  return re2.test(getPlatform()) || re2.test(getUserAgent());
}
function isMac() {
  return getPlatform().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
}
function isJSDOM() {
  return getUserAgent().includes("jsdom/");
}
function isMouseLikePointerType(pointerType, strict) {
  const values = ["mouse", "pen"];
  if (!strict) {
    values.push("", void 0);
  }
  return values.includes(pointerType);
}
function isReactEvent(event) {
  return "nativeEvent" in event;
}
function isRootElement(element) {
  return element.matches("html,body");
}
function getDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}
function isEventTargetWithin(event, node) {
  if (node == null) {
    return false;
  }
  if ("composedPath" in event) {
    return event.composedPath().includes(node);
  }
  const e = event;
  return e.target != null && node.contains(e.target);
}
function getTarget(event) {
  if ("composedPath" in event) {
    return event.composedPath()[0];
  }
  return event.target;
}
var TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
function isTypeableElement(element) {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

// node_modules/@floating-ui/react/dist/floating-ui.react.mjs
var ReactDOM = __toESM(require_react_dom(), 1);
function useMergeRefs(refs) {
  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      });
    };
  }, refs);
}
var SafeReact = {
  ...React
};
var useInsertionEffect = SafeReact.useInsertionEffect;
var useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());
function useEffectEvent(callback) {
  const ref = React.useRef(() => {
    if (true) {
      throw new Error("Cannot call an event handler while rendering.");
    }
  });
  useSafeInsertionEffect(() => {
    ref.current = callback;
  });
  return React.useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current == null ? void 0 : ref.current(...args);
  }, []);
}
var ARROW_UP = "ArrowUp";
var ARROW_DOWN = "ArrowDown";
var ARROW_LEFT = "ArrowLeft";
var ARROW_RIGHT = "ArrowRight";
function isDifferentRow(index2, cols, prevRow) {
  return Math.floor(index2 / cols) !== prevRow;
}
function isIndexOutOfBounds(listRef, index2) {
  return index2 < 0 || index2 >= listRef.current.length;
}
function getMinIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    disabledIndices
  });
}
function getMaxIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices
  });
}
function findNonDisabledIndex(listRef, _temp) {
  let {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1
  } = _temp === void 0 ? {} : _temp;
  const list = listRef.current;
  let index2 = startingIndex;
  do {
    index2 += decrement ? -amount : amount;
  } while (index2 >= 0 && index2 <= list.length - 1 && isDisabled(list, index2, disabledIndices));
  return index2;
}
function getGridNavigatedIndex(elementsRef, _ref) {
  let {
    event,
    orientation,
    loop,
    rtl,
    cols,
    disabledIndices,
    minIndex,
    maxIndex,
    prevIndex,
    stopEvent: stop = false
  } = _ref;
  let nextIndex = prevIndex;
  if (event.key === ARROW_UP) {
    stop && stopEvent(event);
    if (prevIndex === -1) {
      nextIndex = maxIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: nextIndex,
        amount: cols,
        decrement: true,
        disabledIndices
      });
      if (loop && (prevIndex - cols < minIndex || nextIndex < 0)) {
        const col = prevIndex % cols;
        const maxCol = maxIndex % cols;
        const offset2 = maxIndex - (maxCol - col);
        if (maxCol === col) {
          nextIndex = maxIndex;
        } else {
          nextIndex = maxCol > col ? offset2 : offset2 - cols;
        }
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }
  if (event.key === ARROW_DOWN) {
    stop && stopEvent(event);
    if (prevIndex === -1) {
      nextIndex = minIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: prevIndex,
        amount: cols,
        disabledIndices
      });
      if (loop && prevIndex + cols > maxIndex) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex % cols - cols,
          amount: cols,
          disabledIndices
        });
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }
  if (orientation === "both") {
    const prevRow = floor(prevIndex / cols);
    if (event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT)) {
      stop && stopEvent(event);
      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex - prevIndex % cols - 1,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    if (event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT)) {
      stop && stopEvent(event);
      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          decrement: true,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex + (cols - prevIndex % cols),
            decrement: true,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex + (cols - prevIndex % cols),
          decrement: true,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    const lastRow = floor(maxIndex / cols) === prevRow;
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      if (loop && lastRow) {
        nextIndex = event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT) ? maxIndex : findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      } else {
        nextIndex = prevIndex;
      }
    }
  }
  return nextIndex;
}
function buildCellMap(sizes, cols, dense) {
  const cellMap = [];
  let startIndex = 0;
  sizes.forEach((_ref2, index2) => {
    let {
      width,
      height
    } = _ref2;
    if (width > cols) {
      if (true) {
        throw new Error("[Floating UI]: Invalid grid - item width at index " + index2 + " is greater than grid columns");
      }
    }
    let itemPlaced = false;
    if (dense) {
      startIndex = 0;
    }
    while (!itemPlaced) {
      const targetCells = [];
      for (let i2 = 0; i2 < width; i2++) {
        for (let j = 0; j < height; j++) {
          targetCells.push(startIndex + i2 + j * cols);
        }
      }
      if (startIndex % cols + width <= cols && targetCells.every((cell) => cellMap[cell] == null)) {
        targetCells.forEach((cell) => {
          cellMap[cell] = index2;
        });
        itemPlaced = true;
      } else {
        startIndex++;
      }
    }
  });
  return [...cellMap];
}
function getCellIndexOfCorner(index2, sizes, cellMap, cols, corner) {
  if (index2 === -1) return -1;
  const firstCellIndex = cellMap.indexOf(index2);
  const sizeItem = sizes[index2];
  switch (corner) {
    case "tl":
      return firstCellIndex;
    case "tr":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + sizeItem.width - 1;
    case "bl":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + (sizeItem.height - 1) * cols;
    case "br":
      return cellMap.lastIndexOf(index2);
  }
}
function getCellIndices(indices, cellMap) {
  return cellMap.flatMap((index2, cellIndex) => indices.includes(index2) ? [cellIndex] : []);
}
function isDisabled(list, index2, disabledIndices) {
  if (disabledIndices) {
    return disabledIndices.includes(index2);
  }
  const element = list[index2];
  return element == null || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
}
var index = typeof document !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
function sortByDocumentPosition(a, b2) {
  const position = a.compareDocumentPosition(b2);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
}
function areMapsEqual(map1, map2) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value] of map1.entries()) {
    if (value !== map2.get(key)) {
      return false;
    }
  }
  return true;
}
var FloatingListContext = React.createContext({
  register: () => {
  },
  unregister: () => {
  },
  map: /* @__PURE__ */ new Map(),
  elementsRef: {
    current: []
  }
});
function FloatingList(props) {
  const {
    children,
    elementsRef,
    labelsRef
  } = props;
  const [map, setMap] = React.useState(() => /* @__PURE__ */ new Map());
  const register = React.useCallback((node) => {
    setMap((prevMap) => new Map(prevMap).set(node, null));
  }, []);
  const unregister = React.useCallback((node) => {
    setMap((prevMap) => {
      const map2 = new Map(prevMap);
      map2.delete(node);
      return map2;
    });
  }, []);
  index(() => {
    const newMap = new Map(map);
    const nodes = Array.from(newMap.keys()).sort(sortByDocumentPosition);
    nodes.forEach((node, index2) => {
      newMap.set(node, index2);
    });
    if (!areMapsEqual(map, newMap)) {
      setMap(newMap);
    }
  }, [map]);
  return React.createElement(FloatingListContext.Provider, {
    value: React.useMemo(() => ({
      register,
      unregister,
      map,
      elementsRef,
      labelsRef
    }), [register, unregister, map, elementsRef, labelsRef])
  }, children);
}
function useListItem(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    label
  } = props;
  const {
    register,
    unregister,
    map,
    elementsRef,
    labelsRef
  } = React.useContext(FloatingListContext);
  const [index$1, setIndex] = React.useState(null);
  const componentRef = React.useRef(null);
  const ref = React.useCallback((node) => {
    componentRef.current = node;
    if (index$1 !== null) {
      elementsRef.current[index$1] = node;
      if (labelsRef) {
        var _node$textContent;
        const isLabelDefined = label !== void 0;
        labelsRef.current[index$1] = isLabelDefined ? label : (_node$textContent = node == null ? void 0 : node.textContent) != null ? _node$textContent : null;
      }
    }
  }, [index$1, elementsRef, labelsRef, label]);
  index(() => {
    const node = componentRef.current;
    if (node) {
      register(node);
      return () => {
        unregister(node);
      };
    }
  }, [register, unregister]);
  index(() => {
    const index2 = componentRef.current ? map.get(componentRef.current) : null;
    if (index2 != null) {
      setIndex(index2);
    }
  }, [map]);
  return React.useMemo(() => ({
    ref,
    index: index$1 == null ? -1 : index$1
  }), [index$1, ref]);
}
function renderJsx(render2, computedProps) {
  if (typeof render2 === "function") {
    return render2(computedProps);
  }
  if (render2) {
    return React.cloneElement(render2, computedProps);
  }
  return React.createElement("div", computedProps);
}
var CompositeContext = React.createContext({
  activeIndex: 0,
  onNavigate: () => {
  }
});
var horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
var verticalKeys = [ARROW_UP, ARROW_DOWN];
var allKeys = [...horizontalKeys, ...verticalKeys];
var Composite = React.forwardRef(function Composite2(props, forwardedRef) {
  const {
    render: render2,
    orientation = "both",
    loop = true,
    rtl = false,
    cols = 1,
    disabledIndices,
    activeIndex: externalActiveIndex,
    onNavigate: externalSetActiveIndex,
    itemSizes,
    dense = false,
    ...domProps
  } = props;
  const [internalActiveIndex, internalSetActiveIndex] = React.useState(0);
  const activeIndex = externalActiveIndex != null ? externalActiveIndex : internalActiveIndex;
  const onNavigate = useEffectEvent(externalSetActiveIndex != null ? externalSetActiveIndex : internalSetActiveIndex);
  const elementsRef = React.useRef([]);
  const renderElementProps = render2 && typeof render2 !== "function" ? render2.props : {};
  const contextValue = React.useMemo(() => ({
    activeIndex,
    onNavigate
  }), [activeIndex, onNavigate]);
  const isGrid = cols > 1;
  function handleKeyDown(event) {
    if (!allKeys.includes(event.key)) return;
    let nextIndex = activeIndex;
    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);
    const horizontalEndKey = rtl ? ARROW_LEFT : ARROW_RIGHT;
    const horizontalStartKey = rtl ? ARROW_RIGHT : ARROW_LEFT;
    if (isGrid) {
      const sizes = itemSizes || Array.from({
        length: elementsRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex((index2) => index2 != null && !isDisabled(elementsRef.current, index2, disabledIndices));
      const maxGridIndex = cellMap.reduce((foundIndex, index2, cellIndex) => index2 != null && !isDisabled(elementsRef.current, index2, disabledIndices) ? cellIndex : foundIndex, -1);
      const maybeNextIndex = cellMap[getGridNavigatedIndex({
        current: cellMap.map((itemIndex) => itemIndex ? elementsRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loop,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getCellIndices([...disabledIndices || elementsRef.current.map((_3, index2) => isDisabled(elementsRef.current, index2) ? index2 : void 0), void 0], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getCellIndexOfCorner(
          activeIndex > maxIndex ? minIndex : activeIndex,
          sizes,
          cellMap,
          cols,
          // use a corner matching the edge closest to the direction we're
          // moving in so we don't end up in the same item. Prefer
          // top/left over bottom/right.
          event.key === ARROW_DOWN ? "bl" : event.key === horizontalEndKey ? "tr" : "tl"
        )
      })];
      if (maybeNextIndex != null) {
        nextIndex = maybeNextIndex;
      }
    }
    const toEndKeys = {
      horizontal: [horizontalEndKey],
      vertical: [ARROW_DOWN],
      both: [horizontalEndKey, ARROW_DOWN]
    }[orientation];
    const toStartKeys = {
      horizontal: [horizontalStartKey],
      vertical: [ARROW_UP],
      both: [horizontalStartKey, ARROW_UP]
    }[orientation];
    const preventedKeys = isGrid ? allKeys : {
      horizontal: horizontalKeys,
      vertical: verticalKeys,
      both: allKeys
    }[orientation];
    if (nextIndex === activeIndex && [...toEndKeys, ...toStartKeys].includes(event.key)) {
      if (loop && nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (loop && nextIndex === minIndex && toStartKeys.includes(event.key)) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: nextIndex,
          decrement: toStartKeys.includes(event.key),
          disabledIndices
        });
      }
    }
    if (nextIndex !== activeIndex && !isIndexOutOfBounds(elementsRef, nextIndex)) {
      var _elementsRef$current$;
      event.stopPropagation();
      if (preventedKeys.includes(event.key)) {
        event.preventDefault();
      }
      onNavigate(nextIndex);
      (_elementsRef$current$ = elementsRef.current[nextIndex]) == null || _elementsRef$current$.focus();
    }
  }
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: forwardedRef,
    "aria-orientation": orientation === "both" ? void 0 : orientation,
    onKeyDown(e) {
      domProps.onKeyDown == null || domProps.onKeyDown(e);
      renderElementProps.onKeyDown == null || renderElementProps.onKeyDown(e);
      handleKeyDown(e);
    }
  };
  return React.createElement(CompositeContext.Provider, {
    value: contextValue
  }, React.createElement(FloatingList, {
    elementsRef
  }, renderJsx(render2, computedProps)));
});
var CompositeItem = React.forwardRef(function CompositeItem2(props, forwardedRef) {
  const {
    render: render2,
    ...domProps
  } = props;
  const renderElementProps = render2 && typeof render2 !== "function" ? render2.props : {};
  const {
    activeIndex,
    onNavigate
  } = React.useContext(CompositeContext);
  const {
    ref,
    index: index2
  } = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);
  const isActive = activeIndex === index2;
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: isActive ? 0 : -1,
    "data-active": isActive ? "" : void 0,
    onFocus(e) {
      domProps.onFocus == null || domProps.onFocus(e);
      renderElementProps.onFocus == null || renderElementProps.onFocus(e);
      onNavigate(index2);
    }
  };
  return renderJsx(render2, computedProps);
});
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var serverHandoffComplete = false;
var count = 0;
var genId = () => (
  // Ensure the id is unique with multiple independent versions of Floating UI
  // on <React 18
  "floating-ui-" + Math.random().toString(36).slice(2, 6) + count++
);
function useFloatingId() {
  const [id, setId] = React.useState(() => serverHandoffComplete ? genId() : void 0);
  index(() => {
    if (id == null) {
      setId(genId());
    }
  }, []);
  React.useEffect(() => {
    serverHandoffComplete = true;
  }, []);
  return id;
}
var useReactId = SafeReact.useId;
var useId = useReactId || useFloatingId;
var devMessageSet;
if (true) {
  devMessageSet = /* @__PURE__ */ new Set();
}
function warn() {
  var _devMessageSet;
  for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
    messages[_key] = arguments[_key];
  }
  const message = "Floating UI: " + messages.join(" ");
  if (!((_devMessageSet = devMessageSet) != null && _devMessageSet.has(message))) {
    var _devMessageSet2;
    (_devMessageSet2 = devMessageSet) == null || _devMessageSet2.add(message);
    console.warn(message);
  }
}
function error() {
  var _devMessageSet3;
  for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    messages[_key2] = arguments[_key2];
  }
  const message = "Floating UI: " + messages.join(" ");
  if (!((_devMessageSet3 = devMessageSet) != null && _devMessageSet3.has(message))) {
    var _devMessageSet4;
    (_devMessageSet4 = devMessageSet) == null || _devMessageSet4.add(message);
    console.error(message);
  }
}
var FloatingArrow = React.forwardRef(function FloatingArrow2(props, ref) {
  const {
    context: {
      placement,
      elements: {
        floating
      },
      middlewareData: {
        arrow: arrow2,
        shift: shift2
      }
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d,
    style: {
      transform,
      ...restStyle
    } = {},
    ...rest
  } = props;
  if (true) {
    if (!ref) {
      warn("The `ref` prop is required for `FloatingArrow`.");
    }
  }
  const clipPathId = useId();
  const [isRTL, setIsRTL] = React.useState(false);
  index(() => {
    if (!floating) return;
    const isRTL2 = getComputedStyle(floating).direction === "rtl";
    if (isRTL2) {
      setIsRTL(true);
    }
  }, [floating]);
  if (!floating) {
    return null;
  }
  const [side, alignment] = placement.split("-");
  const isVerticalSide = side === "top" || side === "bottom";
  let computedStaticOffset = staticOffset;
  if (isVerticalSide && shift2 != null && shift2.x || !isVerticalSide && shift2 != null && shift2.y) {
    computedStaticOffset = null;
  }
  const computedStrokeWidth = strokeWidth * 2;
  const halfStrokeWidth = computedStrokeWidth / 2;
  const svgX = width / 2 * (tipRadius / -8 + 1);
  const svgY = height / 2 * tipRadius / 4;
  const isCustomShape = !!d;
  const yOffsetProp = computedStaticOffset && alignment === "end" ? "bottom" : "top";
  let xOffsetProp = computedStaticOffset && alignment === "end" ? "right" : "left";
  if (computedStaticOffset && isRTL) {
    xOffsetProp = alignment === "end" ? "left" : "right";
  }
  const arrowX = (arrow2 == null ? void 0 : arrow2.x) != null ? computedStaticOffset || arrow2.x : "";
  const arrowY = (arrow2 == null ? void 0 : arrow2.y) != null ? computedStaticOffset || arrow2.y : "";
  const dValue = d || "M0,0" + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + " Z";
  const rotation = {
    top: isCustomShape ? "rotate(180deg)" : "",
    left: isCustomShape ? "rotate(90deg)" : "rotate(-90deg)",
    bottom: isCustomShape ? "" : "rotate(180deg)",
    right: isCustomShape ? "rotate(-90deg)" : "rotate(90deg)"
  }[side];
  return React.createElement("svg", _extends({}, rest, {
    "aria-hidden": true,
    ref,
    width: isCustomShape ? width : width + computedStrokeWidth,
    height: width,
    viewBox: "0 0 " + width + " " + (height > width ? height : width),
    style: {
      position: "absolute",
      pointerEvents: "none",
      [xOffsetProp]: arrowX,
      [yOffsetProp]: arrowY,
      [side]: isVerticalSide || isCustomShape ? "100%" : "calc(100% - " + computedStrokeWidth / 2 + "px)",
      transform: [rotation, transform].filter((t) => !!t).join(" "),
      ...restStyle
    }
  }), computedStrokeWidth > 0 && React.createElement("path", {
    clipPath: "url(#" + clipPathId + ")",
    fill: "none",
    stroke,
    strokeWidth: computedStrokeWidth + (d ? 0 : 1),
    d: dValue
  }), React.createElement("path", {
    stroke: computedStrokeWidth && !d ? rest.fill : "none",
    d: dValue
  }), React.createElement("clipPath", {
    id: clipPathId
  }, React.createElement("rect", {
    x: -halfStrokeWidth,
    y: halfStrokeWidth * (isCustomShape ? -1 : 1),
    width: width + computedStrokeWidth,
    height: width
  })));
});
function createPubSub() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event, data) {
      var _map$get;
      (_map$get = map.get(event)) == null || _map$get.forEach((handler) => handler(data));
    },
    on(event, listener) {
      map.set(event, [...map.get(event) || [], listener]);
    },
    off(event, listener) {
      var _map$get2;
      map.set(event, ((_map$get2 = map.get(event)) == null ? void 0 : _map$get2.filter((l) => l !== listener)) || []);
    }
  };
}
var FloatingNodeContext = React.createContext(null);
var FloatingTreeContext = React.createContext(null);
var useFloatingParentNodeId = () => {
  var _React$useContext;
  return ((_React$useContext = React.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
};
var useFloatingTree = () => React.useContext(FloatingTreeContext);
function createAttribute(name) {
  return "data-floating-ui-" + name;
}
function useLatestRef(value) {
  const ref = (0, import_react.useRef)(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}
var safePolygonIdentifier = createAttribute("safe-polygon");
function getDelay(value, prop, pointerType) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  return value == null ? void 0 : value[prop];
}
function useHover(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements
  } = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true
  } = props;
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const openRef = useLatestRef(open);
  const pointerTypeRef = React.useRef();
  const timeoutRef = React.useRef(-1);
  const handlerRef = React.useRef();
  const restTimeoutRef = React.useRef(-1);
  const blockMouseMoveRef = React.useRef(true);
  const performedPointerEventsMutationRef = React.useRef(false);
  const unbindMouseMoveRef = React.useRef(() => {
  });
  const restTimeoutPendingRef = React.useRef(false);
  const isHoverOpen = React.useCallback(() => {
    var _dataRef$current$open;
    const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
    return (type == null ? void 0 : type.includes("mouse")) && type !== "mousedown";
  }, [dataRef]);
  React.useEffect(() => {
    if (!enabled) return;
    function onOpenChange2(_ref) {
      let {
        open: open2
      } = _ref;
      if (!open2) {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }
    events.on("openchange", onOpenChange2);
    return () => {
      events.off("openchange", onOpenChange2);
    };
  }, [enabled, events]);
  React.useEffect(() => {
    if (!enabled) return;
    if (!handleCloseRef.current) return;
    if (!open) return;
    function onLeave(event) {
      if (isHoverOpen()) {
        onOpenChange(false, event, "hover");
      }
    }
    const html = getDocument(elements.floating).documentElement;
    html.addEventListener("mouseleave", onLeave);
    return () => {
      html.removeEventListener("mouseleave", onLeave);
    };
  }, [elements.floating, open, onOpenChange, enabled, handleCloseRef, isHoverOpen]);
  const closeWithDelay = React.useCallback(function(event, runElseBranch, reason) {
    if (runElseBranch === void 0) {
      runElseBranch = true;
    }
    if (reason === void 0) {
      reason = "hover";
    }
    const closeDelay = getDelay(delayRef.current, "close", pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => onOpenChange(false, event, reason), closeDelay);
    } else if (runElseBranch) {
      clearTimeout(timeoutRef.current);
      onOpenChange(false, event, reason);
    }
  }, [delayRef, onOpenChange]);
  const cleanupMouseMoveHandler = useEffectEvent(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = void 0;
  });
  const clearPointerEvents = useEffectEvent(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(elements.floating).body;
      body.style.pointerEvents = "";
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });
  const isClickLikeOpenEvent = useEffectEvent(() => {
    return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
  });
  React.useEffect(() => {
    if (!enabled) return;
    function onMouseEnter(event) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;
      if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && !getDelay(delayRef.current, "open")) {
        return;
      }
      const openDelay = getDelay(delayRef.current, "open", pointerTypeRef.current);
      if (openDelay) {
        timeoutRef.current = window.setTimeout(() => {
          if (!openRef.current) {
            onOpenChange(true, event, "hover");
          }
        }, openDelay);
      } else if (!open) {
        onOpenChange(true, event, "hover");
      }
    }
    function onMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      unbindMouseMoveRef.current();
      const doc = getDocument(elements.floating);
      clearTimeout(restTimeoutRef.current);
      restTimeoutPendingRef.current = false;
      if (handleCloseRef.current && dataRef.current.floatingContext) {
        if (!open) {
          clearTimeout(timeoutRef.current);
        }
        handlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event, true, "safe-polygon");
            }
          }
        });
        const handler = handlerRef.current;
        doc.addEventListener("mousemove", handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener("mousemove", handler);
        };
        return;
      }
      const shouldClose = pointerTypeRef.current === "touch" ? !contains(elements.floating, event.relatedTarget) : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }
    function onScrollMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      if (!dataRef.current.floatingContext) return;
      handleCloseRef.current == null || handleCloseRef.current({
        ...dataRef.current.floatingContext,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          if (!isClickLikeOpenEvent()) {
            closeWithDelay(event);
          }
        }
      })(event);
    }
    if (isElement(elements.domReference)) {
      var _elements$floating;
      const ref = elements.domReference;
      open && ref.addEventListener("mouseleave", onScrollMouseLeave);
      (_elements$floating = elements.floating) == null || _elements$floating.addEventListener("mouseleave", onScrollMouseLeave);
      move && ref.addEventListener("mousemove", onMouseEnter, {
        once: true
      });
      ref.addEventListener("mouseenter", onMouseEnter);
      ref.addEventListener("mouseleave", onMouseLeave);
      return () => {
        var _elements$floating2;
        open && ref.removeEventListener("mouseleave", onScrollMouseLeave);
        (_elements$floating2 = elements.floating) == null || _elements$floating2.removeEventListener("mouseleave", onScrollMouseLeave);
        move && ref.removeEventListener("mousemove", onMouseEnter);
        ref.removeEventListener("mouseenter", onMouseEnter);
        ref.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [elements, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, openRef, tree, delayRef, handleCloseRef, dataRef, isClickLikeOpenEvent]);
  index(() => {
    var _handleCloseRef$curre;
    if (!enabled) return;
    if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
      performedPointerEventsMutationRef.current = true;
      const floatingEl = elements.floating;
      if (isElement(elements.domReference) && floatingEl) {
        var _tree$nodesRef$curren;
        const body = getDocument(elements.floating).body;
        body.setAttribute(safePolygonIdentifier, "");
        const ref = elements.domReference;
        const parentFloating = tree == null || (_tree$nodesRef$curren = tree.nodesRef.current.find((node) => node.id === parentId)) == null || (_tree$nodesRef$curren = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren.elements.floating;
        if (parentFloating) {
          parentFloating.style.pointerEvents = "";
        }
        body.style.pointerEvents = "none";
        ref.style.pointerEvents = "auto";
        floatingEl.style.pointerEvents = "auto";
        return () => {
          body.style.pointerEvents = "";
          ref.style.pointerEvents = "";
          floatingEl.style.pointerEvents = "";
        };
      }
    }
  }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);
  index(() => {
    if (!open) {
      pointerTypeRef.current = void 0;
      restTimeoutPendingRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [enabled, elements.domReference, cleanupMouseMoveHandler, clearPointerEvents]);
  const reference = React.useMemo(() => {
    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }
    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const {
          nativeEvent
        } = event;
        function handleMouseMove() {
          if (!blockMouseMoveRef.current && !openRef.current) {
            onOpenChange(true, nativeEvent, "hover");
          }
        }
        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
          return;
        }
        if (open || restMs === 0) {
          return;
        }
        if (restTimeoutPendingRef.current && event.movementX ** 2 + event.movementY ** 2 < 2) {
          return;
        }
        clearTimeout(restTimeoutRef.current);
        if (pointerTypeRef.current === "touch") {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeoutRef.current = window.setTimeout(handleMouseMove, restMs);
        }
      }
    };
  }, [mouseOnly, onOpenChange, open, openRef, restMs]);
  const floating = React.useMemo(() => ({
    onMouseEnter() {
      clearTimeout(timeoutRef.current);
    },
    onMouseLeave(event) {
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event.nativeEvent, false);
      }
    }
  }), [closeWithDelay, isClickLikeOpenEvent]);
  return React.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}
var NOOP = () => {
};
var FloatingDelayGroupContext = React.createContext({
  delay: 0,
  initialDelay: 0,
  timeoutMs: 0,
  currentId: null,
  setCurrentId: NOOP,
  setState: NOOP,
  isInstantPhase: false
});
var useDelayGroupContext = () => React.useContext(FloatingDelayGroupContext);
function FloatingDelayGroup(props) {
  const {
    children,
    delay,
    timeoutMs = 0
  } = props;
  const [state, setState] = React.useReducer((prev, next) => ({
    ...prev,
    ...next
  }), {
    delay,
    timeoutMs,
    initialDelay: delay,
    currentId: null,
    isInstantPhase: false
  });
  const initialCurrentIdRef = React.useRef(null);
  const setCurrentId = React.useCallback((currentId) => {
    setState({
      currentId
    });
  }, []);
  index(() => {
    if (state.currentId) {
      if (initialCurrentIdRef.current === null) {
        initialCurrentIdRef.current = state.currentId;
      } else if (!state.isInstantPhase) {
        setState({
          isInstantPhase: true
        });
      }
    } else {
      if (state.isInstantPhase) {
        setState({
          isInstantPhase: false
        });
      }
      initialCurrentIdRef.current = null;
    }
  }, [state.currentId, state.isInstantPhase]);
  return React.createElement(FloatingDelayGroupContext.Provider, {
    value: React.useMemo(() => ({
      ...state,
      setState,
      setCurrentId
    }), [state, setCurrentId])
  }, children);
}
function useDelayGroup(context, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    open,
    onOpenChange,
    floatingId
  } = context;
  const {
    id: optionId,
    enabled = true
  } = options;
  const id = optionId != null ? optionId : floatingId;
  const groupContext = useDelayGroupContext();
  const {
    currentId,
    setCurrentId,
    initialDelay,
    setState,
    timeoutMs
  } = groupContext;
  index(() => {
    if (!enabled) return;
    if (!currentId) return;
    setState({
      delay: {
        open: 1,
        close: getDelay(initialDelay, "close")
      }
    });
    if (currentId !== id) {
      onOpenChange(false);
    }
  }, [enabled, id, onOpenChange, setState, currentId, initialDelay]);
  index(() => {
    function unset() {
      onOpenChange(false);
      setState({
        delay: initialDelay,
        currentId: null
      });
    }
    if (!enabled) return;
    if (!currentId) return;
    if (!open && currentId === id) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeout);
        };
      }
      unset();
    }
  }, [enabled, open, setState, currentId, id, onOpenChange, initialDelay, timeoutMs]);
  index(() => {
    if (!enabled) return;
    if (setCurrentId === NOOP || !open) return;
    setCurrentId(id);
  }, [enabled, open, setCurrentId, id]);
  return groupContext;
}
function getChildren(nodes, id) {
  let allChildren = nodes.filter((node) => {
    var _node$context;
    return node.parentId === id && ((_node$context = node.context) == null ? void 0 : _node$context.open);
  });
  let currentChildren = allChildren;
  while (currentChildren.length) {
    currentChildren = nodes.filter((node) => {
      var _currentChildren;
      return (_currentChildren = currentChildren) == null ? void 0 : _currentChildren.some((n) => {
        var _node$context2;
        return node.parentId === n.id && ((_node$context2 = node.context) == null ? void 0 : _node$context2.open);
      });
    });
    allChildren = allChildren.concat(currentChildren);
  }
  return allChildren;
}
var getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function getTabbableIn(container, direction) {
  const allTabbable = tabbable(container, getTabbableOptions());
  if (direction === "prev") {
    allTabbable.reverse();
  }
  const activeIndex = allTabbable.indexOf(activeElement(getDocument(container)));
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getNextTabbable() {
  return getTabbableIn(document.body, "next");
}
function getPreviousTabbable() {
  return getTabbableIn(document.body, "prev");
}
function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute("tabindex") || "";
    element.setAttribute("tabindex", "-1");
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll("[data-tabindex]");
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute("tabindex", tabindex);
    } else {
      element.removeAttribute("tabindex");
    }
  });
}
var HIDDEN_STYLES = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "fixed",
  whiteSpace: "nowrap",
  width: "1px",
  top: 0,
  left: 0
};
var timeoutId;
function setActiveElementOnTab(event) {
  if (event.key === "Tab") {
    event.target;
    clearTimeout(timeoutId);
  }
}
var FocusGuard = React.forwardRef(function FocusGuard2(props, ref) {
  const [role, setRole] = React.useState();
  index(() => {
    if (isSafari()) {
      setRole("button");
    }
    document.addEventListener("keydown", setActiveElementOnTab);
    return () => {
      document.removeEventListener("keydown", setActiveElementOnTab);
    };
  }, []);
  const restProps = {
    ref,
    tabIndex: 0,
    // Role is only for VoiceOver
    role,
    "aria-hidden": role ? void 0 : true,
    [createAttribute("focus-guard")]: "",
    style: HIDDEN_STYLES
  };
  return React.createElement("span", _extends({}, props, restProps));
});
var PortalContext = React.createContext(null);
var attr = createAttribute("portal");
function useFloatingPortalNode(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    id,
    root
  } = props;
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const [portalNode, setPortalNode] = React.useState(null);
  const portalNodeRef = React.useRef(null);
  index(() => {
    return () => {
      portalNode == null || portalNode.remove();
      queueMicrotask(() => {
        portalNodeRef.current = null;
      });
    };
  }, [portalNode]);
  index(() => {
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    const existingIdRoot = id ? document.getElementById(id) : null;
    if (!existingIdRoot) return;
    const subRoot = document.createElement("div");
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, "");
    existingIdRoot.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, uniqueId]);
  index(() => {
    if (root === null) return;
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    let container = root || (portalContext == null ? void 0 : portalContext.portalNode);
    if (container && !isElement(container)) container = container.current;
    container = container || document.body;
    let idWrapper = null;
    if (id) {
      idWrapper = document.createElement("div");
      idWrapper.id = id;
      container.appendChild(idWrapper);
    }
    const subRoot = document.createElement("div");
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, "");
    container = idWrapper || container;
    container.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, root, uniqueId, portalContext]);
  return portalNode;
}
function FloatingPortal(props) {
  const {
    children,
    id,
    root,
    preserveTabOrder = true
  } = props;
  const portalNode = useFloatingPortalNode({
    id,
    root
  });
  const [focusManagerState, setFocusManagerState] = React.useState(null);
  const beforeOutsideRef = React.useRef(null);
  const afterOutsideRef = React.useRef(null);
  const beforeInsideRef = React.useRef(null);
  const afterInsideRef = React.useRef(null);
  const modal = focusManagerState == null ? void 0 : focusManagerState.modal;
  const open = focusManagerState == null ? void 0 : focusManagerState.open;
  const shouldRenderGuards = (
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!focusManagerState && // Guards are only for non-modal focus management.
    !focusManagerState.modal && // Don't render if unmount is transitioning.
    focusManagerState.open && preserveTabOrder && !!(root || portalNode)
  );
  React.useEffect(() => {
    if (!portalNode || !preserveTabOrder || modal) {
      return;
    }
    function onFocus(event) {
      if (portalNode && isOutsideEvent(event)) {
        const focusing = event.type === "focusin";
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    portalNode.addEventListener("focusin", onFocus, true);
    portalNode.addEventListener("focusout", onFocus, true);
    return () => {
      portalNode.removeEventListener("focusin", onFocus, true);
      portalNode.removeEventListener("focusout", onFocus, true);
    };
  }, [portalNode, preserveTabOrder, modal]);
  React.useEffect(() => {
    if (!portalNode) return;
    if (open) return;
    enableFocusInside(portalNode);
  }, [open, portalNode]);
  return React.createElement(PortalContext.Provider, {
    value: React.useMemo(() => ({
      preserveTabOrder,
      beforeOutsideRef,
      afterOutsideRef,
      beforeInsideRef,
      afterInsideRef,
      portalNode,
      setFocusManagerState
    }), [preserveTabOrder, portalNode])
  }, shouldRenderGuards && portalNode && React.createElement(FocusGuard, {
    "data-type": "outside",
    ref: beforeOutsideRef,
    onFocus: (event) => {
      if (isOutsideEvent(event, portalNode)) {
        var _beforeInsideRef$curr;
        (_beforeInsideRef$curr = beforeInsideRef.current) == null || _beforeInsideRef$curr.focus();
      } else {
        const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        prevTabbable == null || prevTabbable.focus();
      }
    }
  }), shouldRenderGuards && portalNode && React.createElement("span", {
    "aria-owns": portalNode.id,
    style: HIDDEN_STYLES
  }), portalNode && ReactDOM.createPortal(children, portalNode), shouldRenderGuards && portalNode && React.createElement(FocusGuard, {
    "data-type": "outside",
    ref: afterOutsideRef,
    onFocus: (event) => {
      if (isOutsideEvent(event, portalNode)) {
        var _afterInsideRef$curre;
        (_afterInsideRef$curre = afterInsideRef.current) == null || _afterInsideRef$curre.focus();
      } else {
        const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        nextTabbable == null || nextTabbable.focus();
        (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false, event.nativeEvent, "focus-out"));
      }
    }
  }));
}
var usePortalContext = () => React.useContext(PortalContext);
var FOCUSABLE_ATTRIBUTE = "data-floating-ui-focusable";
var VisuallyHiddenDismiss = React.forwardRef(function VisuallyHiddenDismiss2(props, ref) {
  return React.createElement("button", _extends({}, props, {
    type: "button",
    ref,
    tabIndex: -1,
    style: HIDDEN_STYLES
  }));
});
var lockCount = 0;
function enableScrollLock() {
  const isIOS = /iP(hone|ad|od)|iOS/.test(getPlatform());
  const bodyStyle = document.body.style;
  const scrollbarX = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft;
  const paddingProp = scrollbarX ? "paddingLeft" : "paddingRight";
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollX = bodyStyle.left ? parseFloat(bodyStyle.left) : window.scrollX;
  const scrollY = bodyStyle.top ? parseFloat(bodyStyle.top) : window.scrollY;
  bodyStyle.overflow = "hidden";
  if (scrollbarWidth) {
    bodyStyle[paddingProp] = scrollbarWidth + "px";
  }
  if (isIOS) {
    var _window$visualViewpor, _window$visualViewpor2;
    const offsetLeft = ((_window$visualViewpor = window.visualViewport) == null ? void 0 : _window$visualViewpor.offsetLeft) || 0;
    const offsetTop = ((_window$visualViewpor2 = window.visualViewport) == null ? void 0 : _window$visualViewpor2.offsetTop) || 0;
    Object.assign(bodyStyle, {
      position: "fixed",
      top: -(scrollY - Math.floor(offsetTop)) + "px",
      left: -(scrollX - Math.floor(offsetLeft)) + "px",
      right: "0"
    });
  }
  return () => {
    Object.assign(bodyStyle, {
      overflow: "",
      [paddingProp]: ""
    });
    if (isIOS) {
      Object.assign(bodyStyle, {
        position: "",
        top: "",
        left: "",
        right: ""
      });
      window.scrollTo(scrollX, scrollY);
    }
  };
}
var cleanup = () => {
};
var FloatingOverlay = React.forwardRef(function FloatingOverlay2(props, ref) {
  const {
    lockScroll = false,
    ...rest
  } = props;
  index(() => {
    if (!lockScroll) return;
    lockCount++;
    if (lockCount === 1) {
      cleanup = enableScrollLock();
    }
    return () => {
      lockCount--;
      if (lockCount === 0) {
        cleanup();
      }
    };
  }, [lockScroll]);
  return React.createElement("div", _extends({
    ref
  }, rest, {
    style: {
      position: "fixed",
      overflow: "auto",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...rest.style
    }
  }));
});
var bubbleHandlerKeys = {
  pointerdown: "onPointerDown",
  mousedown: "onMouseDown",
  click: "onClick"
};
var captureHandlerKeys = {
  pointerdown: "onPointerDownCapture",
  mousedown: "onMouseDownCapture",
  click: "onClickCapture"
};
var normalizeProp = (normalizable) => {
  var _normalizable$escapeK, _normalizable$outside;
  return {
    escapeKey: typeof normalizable === "boolean" ? normalizable : (_normalizable$escapeK = normalizable == null ? void 0 : normalizable.escapeKey) != null ? _normalizable$escapeK : false,
    outsidePress: typeof normalizable === "boolean" ? normalizable : (_normalizable$outside = normalizable == null ? void 0 : normalizable.outsidePress) != null ? _normalizable$outside : true
  };
};
function useDismiss(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    elements,
    dataRef
  } = context;
  const {
    enabled = true,
    escapeKey = true,
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = "pointerdown",
    referencePress = false,
    referencePressEvent = "pointerdown",
    ancestorScroll = false,
    bubbles,
    capture
  } = props;
  const tree = useFloatingTree();
  const outsidePressFn = useEffectEvent(typeof unstable_outsidePress === "function" ? unstable_outsidePress : () => false);
  const outsidePress = typeof unstable_outsidePress === "function" ? outsidePressFn : unstable_outsidePress;
  const insideReactTreeRef = React.useRef(false);
  const endedOrStartedInsideRef = React.useRef(false);
  const {
    escapeKey: escapeKeyBubbles,
    outsidePress: outsidePressBubbles
  } = normalizeProp(bubbles);
  const {
    escapeKey: escapeKeyCapture,
    outsidePress: outsidePressCapture
  } = normalizeProp(capture);
  const isComposingRef = React.useRef(false);
  const closeOnEscapeKeyDown = useEffectEvent((event) => {
    var _dataRef$current$floa;
    if (!open || !enabled || !escapeKey || event.key !== "Escape") {
      return;
    }
    if (isComposingRef.current) {
      return;
    }
    const nodeId = (_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.nodeId;
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (!escapeKeyBubbles) {
      event.stopPropagation();
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach((child) => {
          var _child$context;
          if ((_child$context = child.context) != null && _child$context.open && !child.context.dataRef.current.__escapeKeyBubbles) {
            shouldDismiss = false;
            return;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
    }
    onOpenChange(false, isReactEvent(event) ? event.nativeEvent : event, "escape-key");
  });
  const closeOnEscapeKeyDownCapture = useEffectEvent((event) => {
    var _getTarget2;
    const callback = () => {
      var _getTarget;
      closeOnEscapeKeyDown(event);
      (_getTarget = getTarget(event)) == null || _getTarget.removeEventListener("keydown", callback);
    };
    (_getTarget2 = getTarget(event)) == null || _getTarget2.addEventListener("keydown", callback);
  });
  const closeOnPressOutside = useEffectEvent((event) => {
    var _dataRef$current$floa2;
    const insideReactTree = insideReactTreeRef.current;
    insideReactTreeRef.current = false;
    const endedOrStartedInside = endedOrStartedInsideRef.current;
    endedOrStartedInsideRef.current = false;
    if (outsidePressEvent === "click" && endedOrStartedInside) {
      return;
    }
    if (insideReactTree) {
      return;
    }
    if (typeof outsidePress === "function" && !outsidePress(event)) {
      return;
    }
    const target = getTarget(event);
    const inertSelector = "[" + createAttribute("inert") + "]";
    const markers = getDocument(elements.floating).querySelectorAll(inertSelector);
    let targetRootAncestor = isElement(target) ? target : null;
    while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
      const nextParent = getParentNode(targetRootAncestor);
      if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
        break;
      }
      targetRootAncestor = nextParent;
    }
    if (markers.length && isElement(target) && !isRootElement(target) && // Clicked on a direct ancestor (e.g. FloatingOverlay).
    !contains(target, elements.floating) && // If the target root element contains none of the markers, then the
    // element was injected after the floating element rendered.
    Array.from(markers).every((marker) => !contains(targetRootAncestor, marker))) {
      return;
    }
    if (isHTMLElement(target) && floating) {
      const canScrollX = target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
      const canScrollY = target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
      let xCond = canScrollY && event.offsetX > target.clientWidth;
      if (canScrollY) {
        const isRTL = getComputedStyle(target).direction === "rtl";
        if (isRTL) {
          xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
        }
      }
      if (xCond || canScrollX && event.offsetY > target.clientHeight) {
        return;
      }
    }
    const nodeId = (_dataRef$current$floa2 = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa2.nodeId;
    const targetIsInsideChildren = tree && getChildren(tree.nodesRef.current, nodeId).some((node) => {
      var _node$context;
      return isEventTargetWithin(event, (_node$context = node.context) == null ? void 0 : _node$context.elements.floating);
    });
    if (isEventTargetWithin(event, elements.floating) || isEventTargetWithin(event, elements.domReference) || targetIsInsideChildren) {
      return;
    }
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (children.length > 0) {
      let shouldDismiss = true;
      children.forEach((child) => {
        var _child$context2;
        if ((_child$context2 = child.context) != null && _child$context2.open && !child.context.dataRef.current.__outsidePressBubbles) {
          shouldDismiss = false;
          return;
        }
      });
      if (!shouldDismiss) {
        return;
      }
    }
    onOpenChange(false, event, "outside-press");
  });
  const closeOnPressOutsideCapture = useEffectEvent((event) => {
    var _getTarget4;
    const callback = () => {
      var _getTarget3;
      closeOnPressOutside(event);
      (_getTarget3 = getTarget(event)) == null || _getTarget3.removeEventListener(outsidePressEvent, callback);
    };
    (_getTarget4 = getTarget(event)) == null || _getTarget4.addEventListener(outsidePressEvent, callback);
  });
  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }
    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;
    let compositionTimeout = -1;
    function onScroll(event) {
      onOpenChange(false, event, "ancestor-scroll");
    }
    function handleCompositionStart() {
      window.clearTimeout(compositionTimeout);
      isComposingRef.current = true;
    }
    function handleCompositionEnd() {
      compositionTimeout = window.setTimeout(
        () => {
          isComposingRef.current = false;
        },
        // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
        // Only apply to WebKit for the test to remain 0ms.
        isWebKit() ? 5 : 0
      );
    }
    const doc = getDocument(elements.floating);
    if (escapeKey) {
      doc.addEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
      doc.addEventListener("compositionstart", handleCompositionStart);
      doc.addEventListener("compositionend", handleCompositionEnd);
    }
    outsidePress && doc.addEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
    let ancestors = [];
    if (ancestorScroll) {
      if (isElement(elements.domReference)) {
        ancestors = getOverflowAncestors(elements.domReference);
      }
      if (isElement(elements.floating)) {
        ancestors = ancestors.concat(getOverflowAncestors(elements.floating));
      }
      if (!isElement(elements.reference) && elements.reference && elements.reference.contextElement) {
        ancestors = ancestors.concat(getOverflowAncestors(elements.reference.contextElement));
      }
    }
    ancestors = ancestors.filter((ancestor) => {
      var _doc$defaultView;
      return ancestor !== ((_doc$defaultView = doc.defaultView) == null ? void 0 : _doc$defaultView.visualViewport);
    });
    ancestors.forEach((ancestor) => {
      ancestor.addEventListener("scroll", onScroll, {
        passive: true
      });
    });
    return () => {
      if (escapeKey) {
        doc.removeEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
        doc.removeEventListener("compositionstart", handleCompositionStart);
        doc.removeEventListener("compositionend", handleCompositionEnd);
      }
      outsidePress && doc.removeEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener("scroll", onScroll);
      });
      window.clearTimeout(compositionTimeout);
    };
  }, [dataRef, elements, escapeKey, outsidePress, outsidePressEvent, open, onOpenChange, ancestorScroll, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, escapeKeyCapture, closeOnEscapeKeyDownCapture, closeOnPressOutside, outsidePressCapture, closeOnPressOutsideCapture]);
  React.useEffect(() => {
    insideReactTreeRef.current = false;
  }, [outsidePress, outsidePressEvent]);
  const reference = React.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    [bubbleHandlerKeys[referencePressEvent]]: (event) => {
      if (referencePress) {
        onOpenChange(false, event.nativeEvent, "reference-press");
      }
    }
  }), [closeOnEscapeKeyDown, onOpenChange, referencePress, referencePressEvent]);
  const floating = React.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    onMouseDown() {
      endedOrStartedInsideRef.current = true;
    },
    onMouseUp() {
      endedOrStartedInsideRef.current = true;
    },
    [captureHandlerKeys[outsidePressEvent]]: () => {
      insideReactTreeRef.current = true;
    }
  }), [closeOnEscapeKeyDown, outsidePressEvent]);
  return React.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}
function useFloatingRootContext(options) {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp
  } = options;
  const floatingId = useId();
  const dataRef = React.useRef({});
  const [events] = React.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;
  if (true) {
    const optionDomReference = elementsProp.reference;
    if (optionDomReference && !isElement(optionDomReference)) {
      error("Cannot pass a virtual element to the `elements.reference` option,", "as it must be a real DOM element. Use `refs.setPositionReference()`", "instead.");
    }
  }
  const [positionReference, setPositionReference] = React.useState(elementsProp.reference);
  const onOpenChange = useEffectEvent((open2, event, reason) => {
    dataRef.current.openEvent = open2 ? event : void 0;
    events.emit("openchange", {
      open: open2,
      event,
      reason,
      nested
    });
    onOpenChangeProp == null || onOpenChangeProp(open2, event, reason);
  });
  const refs = React.useMemo(() => ({
    setPositionReference
  }), []);
  const elements = React.useMemo(() => ({
    reference: positionReference || elementsProp.reference || null,
    floating: elementsProp.floating || null,
    domReference: elementsProp.reference
  }), [positionReference, elementsProp.reference, elementsProp.floating]);
  return React.useMemo(() => ({
    dataRef,
    open,
    onOpenChange,
    elements,
    events,
    floatingId,
    refs
  }), [open, onOpenChange, elements, events, floatingId, refs]);
}
function useFloating2(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    nodeId
  } = options;
  const internalRootContext = useFloatingRootContext({
    ...options,
    elements: {
      reference: null,
      floating: null,
      ...options.elements
    }
  });
  const rootContext = options.rootContext || internalRootContext;
  const computedElements = rootContext.elements;
  const [_domReference, setDomReference] = React.useState(null);
  const [positionReference, _setPositionReference] = React.useState(null);
  const optionDomReference = computedElements == null ? void 0 : computedElements.domReference;
  const domReference = optionDomReference || _domReference;
  const domReferenceRef = React.useRef(null);
  const tree = useFloatingTree();
  index(() => {
    if (domReference) {
      domReferenceRef.current = domReference;
    }
  }, [domReference]);
  const position = useFloating({
    ...options,
    elements: {
      ...computedElements,
      ...positionReference && {
        reference: positionReference
      }
    }
  });
  const setPositionReference = React.useCallback((node) => {
    const computedPositionReference = isElement(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      contextElement: node
    } : node;
    _setPositionReference(computedPositionReference);
    position.refs.setReference(computedPositionReference);
  }, [position.refs]);
  const setReference = React.useCallback((node) => {
    if (isElement(node) || node === null) {
      domReferenceRef.current = node;
      setDomReference(node);
    }
    if (isElement(position.refs.reference.current) || position.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !isElement(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs]);
  const refs = React.useMemo(() => ({
    ...position.refs,
    setReference,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setPositionReference]);
  const elements = React.useMemo(() => ({
    ...position.elements,
    domReference
  }), [position.elements, domReference]);
  const context = React.useMemo(() => ({
    ...position,
    ...rootContext,
    refs,
    elements,
    nodeId
  }), [position, refs, elements, nodeId, rootContext]);
  index(() => {
    rootContext.dataRef.current.floatingContext = context;
    const node = tree == null ? void 0 : tree.nodesRef.current.find((node2) => node2.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return React.useMemo(() => ({
    ...position,
    context,
    refs,
    elements
  }), [position, refs, elements, context]);
}
function useFocus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    events,
    dataRef,
    elements
  } = context;
  const {
    enabled = true,
    visibleOnly = true
  } = props;
  const blockFocusRef = React.useRef(false);
  const timeoutRef = React.useRef();
  const keyboardModalityRef = React.useRef(true);
  React.useEffect(() => {
    if (!enabled) return;
    const win = getWindow(elements.domReference);
    function onBlur() {
      if (!open && isHTMLElement(elements.domReference) && elements.domReference === activeElement(getDocument(elements.domReference))) {
        blockFocusRef.current = true;
      }
    }
    function onKeyDown() {
      keyboardModalityRef.current = true;
    }
    win.addEventListener("blur", onBlur);
    win.addEventListener("keydown", onKeyDown, true);
    return () => {
      win.removeEventListener("blur", onBlur);
      win.removeEventListener("keydown", onKeyDown, true);
    };
  }, [elements.domReference, open, enabled]);
  React.useEffect(() => {
    if (!enabled) return;
    function onOpenChange2(_ref) {
      let {
        reason
      } = _ref;
      if (reason === "reference-press" || reason === "escape-key") {
        blockFocusRef.current = true;
      }
    }
    events.on("openchange", onOpenChange2);
    return () => {
      events.off("openchange", onOpenChange2);
    };
  }, [events, enabled]);
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  const reference = React.useMemo(() => ({
    onPointerDown(event) {
      if (isVirtualPointerEvent(event.nativeEvent)) return;
      keyboardModalityRef.current = false;
    },
    onMouseLeave() {
      blockFocusRef.current = false;
    },
    onFocus(event) {
      if (blockFocusRef.current) return;
      const target = getTarget(event.nativeEvent);
      if (visibleOnly && isElement(target)) {
        try {
          if (isSafari() && isMac()) throw Error();
          if (!target.matches(":focus-visible")) return;
        } catch (e) {
          if (!keyboardModalityRef.current && !isTypeableElement(target)) {
            return;
          }
        }
      }
      onOpenChange(true, event.nativeEvent, "focus");
    },
    onBlur(event) {
      blockFocusRef.current = false;
      const relatedTarget = event.relatedTarget;
      const nativeEvent = event.nativeEvent;
      const movedToFocusGuard = isElement(relatedTarget) && relatedTarget.hasAttribute(createAttribute("focus-guard")) && relatedTarget.getAttribute("data-type") === "outside";
      timeoutRef.current = window.setTimeout(() => {
        var _dataRef$current$floa;
        const activeEl = activeElement(elements.domReference ? elements.domReference.ownerDocument : document);
        if (!relatedTarget && activeEl === elements.domReference) return;
        if (contains((_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.refs.floating.current, activeEl) || contains(elements.domReference, activeEl) || movedToFocusGuard) {
          return;
        }
        onOpenChange(false, nativeEvent, "focus");
      });
    }
  }), [dataRef, elements.domReference, onOpenChange, visibleOnly]);
  return React.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}
var ACTIVE_KEY = "active";
var SELECTED_KEY = "selected";
function mergeProps(userProps, propsList, elementKey) {
  const map = /* @__PURE__ */ new Map();
  const isItem = elementKey === "item";
  let domUserProps = userProps;
  if (isItem && userProps) {
    const {
      [ACTIVE_KEY]: _3,
      [SELECTED_KEY]: __,
      ...validProps
    } = userProps;
    domUserProps = validProps;
  }
  return {
    ...elementKey === "floating" && {
      tabIndex: -1,
      [FOCUSABLE_ATTRIBUTE]: ""
    },
    ...domUserProps,
    ...propsList.map((value) => {
      const propsOrGetProps = value ? value[elementKey] : null;
      if (typeof propsOrGetProps === "function") {
        return userProps ? propsOrGetProps(userProps) : null;
      }
      return propsOrGetProps;
    }).concat(userProps).reduce((acc, props) => {
      if (!props) {
        return acc;
      }
      Object.entries(props).forEach((_ref) => {
        let [key, value] = _ref;
        if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
          return;
        }
        if (key.indexOf("on") === 0) {
          if (!map.has(key)) {
            map.set(key, []);
          }
          if (typeof value === "function") {
            var _map$get;
            (_map$get = map.get(key)) == null || _map$get.push(value);
            acc[key] = function() {
              var _map$get2;
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.map((fn) => fn(...args)).find((val) => val !== void 0);
            };
          }
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {})
  };
}
function useInteractions(propsList) {
  if (propsList === void 0) {
    propsList = [];
  }
  const referenceDeps = propsList.map((key) => key == null ? void 0 : key.reference);
  const floatingDeps = propsList.map((key) => key == null ? void 0 : key.floating);
  const itemDeps = propsList.map((key) => key == null ? void 0 : key.item);
  const getReferenceProps = React.useCallback(
    (userProps) => mergeProps(userProps, propsList, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    referenceDeps
  );
  const getFloatingProps = React.useCallback(
    (userProps) => mergeProps(userProps, propsList, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    floatingDeps
  );
  const getItemProps = React.useCallback(
    (userProps) => mergeProps(userProps, propsList, "item"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    itemDeps
  );
  return React.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps
  }), [getReferenceProps, getFloatingProps, getItemProps]);
}
var componentRoleToAriaRoleMap = /* @__PURE__ */ new Map([["select", "listbox"], ["combobox", "listbox"], ["label", false]]);
function useRole(context, props) {
  var _componentRoleToAriaR;
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    floatingId
  } = context;
  const {
    enabled = true,
    role = "dialog"
  } = props;
  const ariaRole = (_componentRoleToAriaR = componentRoleToAriaRoleMap.get(role)) != null ? _componentRoleToAriaR : role;
  const referenceId = useId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const reference = React.useMemo(() => {
    if (ariaRole === "tooltip" || role === "label") {
      return {
        ["aria-" + (role === "label" ? "labelledby" : "describedby")]: open ? floatingId : void 0
      };
    }
    return {
      "aria-expanded": open ? "true" : "false",
      "aria-haspopup": ariaRole === "alertdialog" ? "dialog" : ariaRole,
      "aria-controls": open ? floatingId : void 0,
      ...ariaRole === "listbox" && {
        role: "combobox"
      },
      ...ariaRole === "menu" && {
        id: referenceId
      },
      ...ariaRole === "menu" && isNested && {
        role: "menuitem"
      },
      ...role === "select" && {
        "aria-autocomplete": "none"
      },
      ...role === "combobox" && {
        "aria-autocomplete": "list"
      }
    };
  }, [ariaRole, floatingId, isNested, open, referenceId, role]);
  const floating = React.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...ariaRole && {
        role: ariaRole
      }
    };
    if (ariaRole === "tooltip" || role === "label") {
      return floatingProps;
    }
    return {
      ...floatingProps,
      ...ariaRole === "menu" && {
        "aria-labelledby": referenceId
      }
    };
  }, [ariaRole, floatingId, referenceId, role]);
  const item = React.useCallback((_ref) => {
    let {
      active,
      selected
    } = _ref;
    const commonProps = {
      role: "option",
      ...active && {
        id: floatingId + "-option"
      }
    };
    switch (role) {
      case "select":
        return {
          ...commonProps,
          "aria-selected": active && selected
        };
      case "combobox": {
        return {
          ...commonProps,
          ...active && {
            "aria-selected": true
          }
        };
      }
    }
    return {};
  }, [floatingId, role]);
  return React.useMemo(() => enabled ? {
    reference,
    floating,
    item
  } : {}, [enabled, reference, floating, item]);
}
var camelCaseToKebabCase = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
function execWithArgsOrReturn(valueOrFn, args) {
  return typeof valueOrFn === "function" ? valueOrFn(args) : valueOrFn;
}
function useDelayUnmount(open, durationMs) {
  const [isMounted, setIsMounted] = React.useState(open);
  if (open && !isMounted) {
    setIsMounted(true);
  }
  React.useEffect(() => {
    if (!open && isMounted) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);
      return () => clearTimeout(timeout);
    }
  }, [open, isMounted, durationMs]);
  return isMounted;
}
function useTransitionStatus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    elements: {
      floating
    }
  } = context;
  const {
    duration = 250
  } = props;
  const isNumberDuration = typeof duration === "number";
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [status, setStatus] = React.useState("unmounted");
  const isMounted = useDelayUnmount(open, closeDuration);
  if (!isMounted && status === "close") {
    setStatus("unmounted");
  }
  index(() => {
    if (!floating) return;
    if (open) {
      setStatus("initial");
      const frame = requestAnimationFrame(() => {
        setStatus("open");
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }
    setStatus("close");
  }, [open, floating]);
  return {
    isMounted,
    status
  };
}
function useTransitionStyles(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    initial: unstable_initial = {
      opacity: 0
    },
    open: unstable_open,
    close: unstable_close,
    common: unstable_common,
    duration = 250
  } = props;
  const placement = context.placement;
  const side = placement.split("-")[0];
  const fnArgs = React.useMemo(() => ({
    side,
    placement
  }), [side, placement]);
  const isNumberDuration = typeof duration === "number";
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [styles, setStyles] = React.useState(() => ({
    ...execWithArgsOrReturn(unstable_common, fnArgs),
    ...execWithArgsOrReturn(unstable_initial, fnArgs)
  }));
  const {
    isMounted,
    status
  } = useTransitionStatus(context, {
    duration
  });
  const initialRef = useLatestRef(unstable_initial);
  const openRef = useLatestRef(unstable_open);
  const closeRef = useLatestRef(unstable_close);
  const commonRef = useLatestRef(unstable_common);
  index(() => {
    const initialStyles = execWithArgsOrReturn(initialRef.current, fnArgs);
    const closeStyles = execWithArgsOrReturn(closeRef.current, fnArgs);
    const commonStyles = execWithArgsOrReturn(commonRef.current, fnArgs);
    const openStyles = execWithArgsOrReturn(openRef.current, fnArgs) || Object.keys(initialStyles).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    if (status === "initial") {
      setStyles((styles2) => ({
        transitionProperty: styles2.transitionProperty,
        ...commonStyles,
        ...initialStyles
      }));
    }
    if (status === "open") {
      setStyles({
        transitionProperty: Object.keys(openStyles).map(camelCaseToKebabCase).join(","),
        transitionDuration: openDuration + "ms",
        ...commonStyles,
        ...openStyles
      });
    }
    if (status === "close") {
      const styles2 = closeStyles || initialStyles;
      setStyles({
        transitionProperty: Object.keys(styles2).map(camelCaseToKebabCase).join(","),
        transitionDuration: closeDuration + "ms",
        ...commonStyles,
        ...styles2
      });
    }
  }, [closeDuration, closeRef, initialRef, openRef, commonRef, openDuration, status, fnArgs]);
  return {
    isMounted,
    styles
  };
}

// node_modules/@blocknote/react/dist/blocknote-react.js
var import_react_dom4 = __toESM(require_react_dom());

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement2(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement2(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper = popperGenerator({
  defaultModifiers
});

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers2 = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper2 = popperGenerator({
  defaultModifiers: defaultModifiers2
});

// node_modules/tippy.js/dist/tippy.esm.js
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
  return document.body;
};
function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index2, defaultValue) {
  if (Array.isArray(value)) {
    var v2 = value[index2];
    return v2 == null ? Array.isArray(defaultValue) ? defaultValue[index2] : defaultValue : v2;
  }
  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === "function" ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
  if (ms === 0) {
    return fn;
  }
  var timeout;
  return function(arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function(key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function(item, index2) {
    return arr.indexOf(item) === index2;
  });
}
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (obj[key] !== void 0) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
function div() {
  return document.createElement("div");
}
function isElement2(value) {
  return ["Element", "Fragment"].some(function(type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, "NodeList");
}
function isMouseEvent(value) {
  return isType(value, "MouseEvent");
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement2(value)) {
    return [value];
  }
  if (isNodeList(value)) {
    return arrayFrom(value);
  }
  if (Array.isArray(value)) {
    return value;
  }
  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function(el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function(el) {
    if (el) {
      el.setAttribute("data-state", state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;
  var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX, clientY = event.clientY;
  return popperTreeData.every(function(_ref) {
    var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;
    if (!offsetData) {
      return true;
    }
    var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
    var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
    box[method](event, listener);
  });
}
function actualContains(parent, child) {
  var target = child;
  while (target) {
    var _target$getRootNode;
    if (parent.contains(target)) {
      return true;
    }
    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }
  return false;
}
var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }
  currentInput.isTouch = true;
  if (window.performance) {
    document.addEventListener("mousemove", onDocumentMouseMove);
  }
}
function onDocumentMouseMove() {
  var now = performance.now();
  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener("mousemove", onDocumentMouseMove);
  }
  lastMouseMoveTime = now;
}
function onWindowBlur() {
  var activeElement2 = document.activeElement;
  if (isReferenceElement(activeElement2)) {
    var instance = activeElement2._tippy;
    if (activeElement2.blur && !instance.state.isVisible) {
      activeElement2.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener("blur", onWindowBlur);
}
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
var isIE11 = isBrowser ? (
  // @ts-ignore
  !!window.msCrypto
) : false;
function createMemoryLeakWarning(method) {
  var txt = method === "destroy" ? "n already-" : " ";
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, " ").replace(lineStartWithSpaces, "").trim();
}
function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c👷‍ This is a development-only message. It will be removed in production.\n  ");
}
function getFormattedMessage(message) {
  return [
    getDevMessage(message),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var visitedMessages;
if (true) {
  resetVisitedMessages();
}
function resetVisitedMessages() {
  visitedMessages = /* @__PURE__ */ new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;
    visitedMessages.add(message);
    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;
    visitedMessages.add(message);
    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === "[object Object]" && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ["tippy() was passed", "`" + String(targets) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" "));
  errorWhen(didPassPlainObject, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: "fade",
  arrow: true,
  content: "",
  inertia: false,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {
  },
  onBeforeUpdate: function onBeforeUpdate() {
  },
  onCreate: function onCreate() {
  },
  onDestroy: function onDestroy() {
  },
  onHidden: function onHidden() {
  },
  onHide: function onHide() {
  },
  onMount: function onMount() {
  },
  onShow: function onShow() {
  },
  onShown: function onShown() {
  },
  onTrigger: function onTrigger() {
  },
  onUntrigger: function onUntrigger() {
  },
  onClickOutside: function onClickOutside() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: "mouseenter focus",
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps2(partialProps) {
  if (true) {
    validateProps(partialProps, []);
  }
  var keys = Object.keys(partialProps);
  keys.forEach(function(key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps2 = plugins.reduce(function(acc, plugin) {
    var name = plugin.name, defaultValue = plugin.defaultValue;
    if (name) {
      var _name;
      acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }
    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps2);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function(acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || "").trim();
    if (!valueAsString) {
      return acc;
    }
    if (key === "content") {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }
    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
    content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }
  if (plugins === void 0) {
    plugins = [];
  }
  var keys = Object.keys(partialProps);
  keys.forEach(function(prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop);
    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function(plugin) {
        return plugin.name === prop;
      }).length === 0;
    }
    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", "\n\n", "All props: https://atomiks.github.io/tippyjs/v6/all-props/\n", "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var innerHTML = function innerHTML2() {
  return "innerHTML";
};
function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}
function createArrowElement(value) {
  var arrow2 = div();
  if (value === true) {
    arrow2.className = ARROW_CLASS;
  } else {
    arrow2.className = SVG_ARROW_CLASS;
    if (isElement2(value)) {
      arrow2.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow2, value);
    }
  }
  return arrow2;
}
function setContent(content, props) {
  if (isElement2(props.content)) {
    dangerouslySetInnerHTML(content, "");
    content.appendChild(props.content);
  } else if (typeof props.content !== "function") {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren2(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box,
    content: boxChildren.find(function(node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function(node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function(node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute("data-state", "hidden");
  box.setAttribute("tabindex", "-1");
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute("data-state", "hidden");
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);
  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren2(popper), box2 = _getChildren.box, content2 = _getChildren.content, arrow2 = _getChildren.arrow;
    if (nextProps.theme) {
      box2.setAttribute("data-theme", nextProps.theme);
    } else {
      box2.removeAttribute("data-theme");
    }
    if (typeof nextProps.animation === "string") {
      box2.setAttribute("data-animation", nextProps.animation);
    } else {
      box2.removeAttribute("data-animation");
    }
    if (nextProps.inertia) {
      box2.setAttribute("data-inertia", "");
    } else {
      box2.removeAttribute("data-inertia");
    }
    box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
    if (nextProps.role) {
      box2.setAttribute("role", nextProps.role);
    } else {
      box2.removeAttribute("role");
    }
    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content2, instance.props);
    }
    if (nextProps.arrow) {
      if (!arrow2) {
        box2.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box2.removeChild(arrow2);
        box2.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow2) {
      box2.removeChild(arrow2);
    }
  }
  return {
    popper,
    onUpdate
  };
}
render.$$tippy = true;
var idCounter = 1;
var mouseMoveListeners = [];
var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget;
  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id,
    reference,
    popper: div(),
    popperInstance,
    props,
    state,
    plugins,
    // methods
    clearDelayTimeouts,
    setProps,
    setContent: setContent2,
    show,
    hide: hide2,
    hideWithInteractivity,
    enable,
    disable,
    unmount,
    destroy
  };
  if (!props.render) {
    if (true) {
      errorWhen(true, "render() function has not been supplied.");
    }
    return instance;
  }
  var _props$render = props.render(instance), popper = _props$render.popper, onUpdate = _props$render.onUpdate;
  popper.setAttribute("data-tippy-root", "");
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function(plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute("aria-expanded");
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook("onCreate", [instance]);
  if (props.showOnCreate) {
    scheduleShow();
  }
  popper.addEventListener("mouseenter", function() {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener("mouseleave", function() {
    if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
      getDocument2().addEventListener("mousemove", debouncedOnMouseMove);
    }
  });
  return instance;
  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }
  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === "hold";
  }
  function getIsDefaultRenderFn() {
    var _instance$props$rende;
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }
  function getCurrentTarget() {
    return currentTarget || reference;
  }
  function getDocument2() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }
  function getDefaultTemplateChildren() {
    return getChildren2(popper);
  }
  function getDelay2(isShow) {
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
      return 0;
    }
    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }
  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }
    popper.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
    popper.style.zIndex = "" + instance.props.zIndex;
  }
  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }
    pluginsHooks.forEach(function(pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });
    if (shouldInvokePropsHook) {
      var _instance$props;
      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }
  function handleAriaContentAttribute() {
    var aria = instance.props.aria;
    if (!aria.content) {
      return;
    }
    var attr2 = "aria-" + aria.content;
    var id2 = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function(node) {
      var currentValue = node.getAttribute(attr2);
      if (instance.state.isVisible) {
        node.setAttribute(attr2, currentValue ? currentValue + " " + id2 : id2);
      } else {
        var nextValue = currentValue && currentValue.replace(id2, "").trim();
        if (nextValue) {
          node.setAttribute(attr2, nextValue);
        } else {
          node.removeAttribute(attr2);
        }
      }
    });
  }
  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function(node) {
      if (instance.props.interactive) {
        node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
      } else {
        node.removeAttribute("aria-expanded");
      }
    });
  }
  function cleanupInteractiveMouseListeners() {
    getDocument2().removeEventListener("mousemove", debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
      return listener !== debouncedOnMouseMove;
    });
  }
  function onDocumentPress(event) {
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === "mousedown") {
        return;
      }
    }
    var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    }
    if (normalizeToArray(instance.props.triggerTarget || reference).some(function(el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }
      if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
        return;
      }
    } else {
      invokeHook("onClickOutside", [instance, event]);
    }
    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide();
      didHideDueToDocumentMouseDown = true;
      setTimeout(function() {
        didHideDueToDocumentMouseDown = false;
      });
      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }
  function onTouchMove() {
    didTouchMove = true;
  }
  function onTouchStart() {
    didTouchMove = false;
  }
  function addDocumentPress() {
    var doc = getDocument2();
    doc.addEventListener("mousedown", onDocumentPress, true);
    doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function removeDocumentPress() {
    var doc = getDocument2();
    doc.removeEventListener("mousedown", onDocumentPress, true);
    doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function() {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }
  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }
  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;
    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, "remove", listener);
        callback();
      }
    }
    if (duration === 0) {
      return callback();
    }
    updateTransitionEndListener(box, "remove", currentTransitionEndListener);
    updateTransitionEndListener(box, "add", listener);
    currentTransitionEndListener = listener;
  }
  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function(node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node,
        eventType,
        handler,
        options
      });
    });
  }
  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on("touchstart", onTrigger2, {
        passive: true
      });
      on("touchend", onMouseLeave, {
        passive: true
      });
    }
    splitBySpaces(instance.props.trigger).forEach(function(eventType) {
      if (eventType === "manual") {
        return;
      }
      on(eventType, onTrigger2);
      switch (eventType) {
        case "mouseenter":
          on("mouseleave", onMouseLeave);
          break;
        case "focus":
          on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
          break;
        case "focusin":
          on("focusout", onBlurOrFocusOut);
          break;
      }
    });
  }
  function removeListeners() {
    listeners.forEach(function(_ref) {
      var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }
  function onTrigger2(event) {
    var _lastTriggerEvent;
    var shouldScheduleClickHide = false;
    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }
    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();
    if (!instance.state.isVisible && isMouseEvent(event)) {
      mouseMoveListeners.forEach(function(listener) {
        return listener(event);
      });
    }
    if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }
    if (event.type === "click") {
      isVisibleFromClick = !shouldScheduleClickHide;
    }
    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }
  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
    if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
      return;
    }
    var popperTreeData = getNestedPopperTree().concat(popper).map(function(popper2) {
      var _instance$popperInsta;
      var instance2 = popper2._tippy;
      var state2 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
      if (state2) {
        return {
          popperRect: popper2.getBoundingClientRect(),
          popperState: state2,
          props
        };
      }
      return null;
    }).filter(Boolean);
    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }
  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
    if (shouldBail) {
      return;
    }
    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }
    scheduleHide(event);
  }
  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
      return;
    }
    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }
    scheduleHide(event);
  }
  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
  }
  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset2 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
    var arrow2 = getIsDefaultRenderFn() ? getChildren2(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: "$$tippy",
      enabled: true,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function fn(_ref2) {
        var state2 = _ref2.state;
        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(attr2) {
            if (attr2 === "placement") {
              box.setAttribute("data-placement", state2.placement);
            } else {
              if (state2.attributes.popper["data-popper-" + attr2]) {
                box.setAttribute("data-" + attr2, "");
              } else {
                box.removeAttribute("data-" + attr2);
              }
            }
          });
          state2.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: "offset",
      options: {
        offset: offset2
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];
    if (getIsDefaultRenderFn() && arrow2) {
      modifiers.push({
        name: "arrow",
        options: {
          element: arrow2,
          padding: 3
        }
      });
    }
    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = createPopper2(computedReference, popper, Object.assign({}, popperOptions, {
      placement,
      onFirstUpdate,
      modifiers
    }));
  }
  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }
  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode;
    var node = getCurrentTarget();
    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    }
    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }
    instance.state.isMounted = true;
    createPopperInstance();
    if (true) {
      warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", "\n\n", "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", "\n\n", "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", "\n\n", "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
    }
  }
  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll("[data-tippy-root]"));
  }
  function scheduleShow(event) {
    instance.clearDelayTimeouts();
    if (event) {
      invokeHook("onTrigger", [instance, event]);
    }
    addDocumentPress();
    var delay = getDelay2(true);
    var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
    if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
      delay = touchDelay;
    }
    if (delay) {
      showTimeout = setTimeout(function() {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }
  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook("onUntrigger", [instance, event]);
    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    }
    if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }
    var delay = getDelay2(false);
    if (delay) {
      hideTimeout = setTimeout(function() {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      scheduleHideAnimationFrame = requestAnimationFrame(function() {
        instance.hide();
      });
    }
  }
  function enable() {
    instance.state.isEnabled = true;
  }
  function disable() {
    instance.hide();
    instance.state.isEnabled = false;
  }
  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }
  function setProps(partialProps) {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("setProps"));
    }
    if (instance.state.isDestroyed) {
      return;
    }
    invokeHook("onBeforeUpdate", [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();
    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    }
    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
        node.removeAttribute("aria-expanded");
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute("aria-expanded");
    }
    handleAriaExpandedAttribute();
    handleStyles();
    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }
    if (instance.popperInstance) {
      createPopperInstance();
      getNestedPopperTree().forEach(function(nestedPopper) {
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }
    invokeHook("onAfterUpdate", [instance, partialProps]);
  }
  function setContent2(content) {
    instance.setProps({
      content
    });
  }
  function show() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("show"));
    }
    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled2 = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
    if (isAlreadyVisible || isDestroyed || isDisabled2 || isTouchAndTouchDisabled) {
      return;
    }
    if (getCurrentTarget().hasAttribute("disabled")) {
      return;
    }
    invokeHook("onShow", [instance], false);
    if (instance.props.onShow(instance) === false) {
      return;
    }
    instance.state.isVisible = true;
    if (getIsDefaultRenderFn()) {
      popper.style.visibility = "visible";
    }
    handleStyles();
    addDocumentPress();
    if (!instance.state.isMounted) {
      popper.style.transition = "none";
    }
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
      setTransitionDuration([box, content], 0);
    }
    onFirstUpdate = function onFirstUpdate2() {
      var _instance$popperInsta2;
      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }
      ignoreOnFirstUpdate = true;
      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;
      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], "visible");
      }
      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance);
      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook("onMount", [instance]);
      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function() {
          instance.state.isShown = true;
          invokeHook("onShown", [instance]);
        });
      }
    };
    mount();
  }
  function hide2() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hide"));
    }
    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled2 = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
    if (isAlreadyHidden || isDestroyed || isDisabled2) {
      return;
    }
    invokeHook("onHide", [instance], false);
    if (instance.props.onHide(instance) === false) {
      return;
    }
    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;
    if (getIsDefaultRenderFn()) {
      popper.style.visibility = "hidden";
    }
    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], "hidden");
      }
    }
    handleAriaContentAttribute();
    handleAriaExpandedAttribute();
    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }
  function hideWithInteractivity(event) {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hideWithInteractivity"));
    }
    getDocument2().addEventListener("mousemove", debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }
  function unmount() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("unmount"));
    }
    if (instance.state.isVisible) {
      instance.hide();
    }
    if (!instance.state.isMounted) {
      return;
    }
    destroyPopperInstance();
    getNestedPopperTree().forEach(function(nestedPopper) {
      nestedPopper._tippy.unmount();
    });
    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }
    mountedInstances = mountedInstances.filter(function(i2) {
      return i2 !== instance;
    });
    instance.state.isMounted = false;
    invokeHook("onHidden", [instance]);
  }
  function destroy() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("destroy"));
    }
    if (instance.state.isDestroyed) {
      return;
    }
    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook("onDestroy", [instance]);
  }
}
function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }
  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  if (true) {
    validateTargets(targets);
    validateProps(optionalProps, plugins);
  }
  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins
  });
  var elements = getArrayOfElements(targets);
  if (true) {
    var isSingleContentElement = isElement2(passedProps.content);
    var isMoreThanOneReferenceElement = elements.length > 1;
    warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", "\n\n", "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", "\n\n", "1) content: element.innerHTML\n", "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var instances = elements.reduce(function(acc, reference) {
    var instance = reference && createTippy(reference, passedProps);
    if (instance) {
      acc.push(instance);
    }
    return acc;
  }, []);
  return isElement2(targets) ? instances[0] : instances;
}
tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var applyStylesModifier = Object.assign({}, applyStyles_default, {
  effect: function effect2(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
  }
});
tippy.setDefaultProps({
  render
});
var tippy_esm_default = tippy;

// node_modules/@tiptap/extension-bubble-menu/dist/index.js
var BubbleMenuView = class {
  constructor({ editor, element, view, tippyOptions = {}, updateDelay = 250, shouldShow }) {
    this.preventHide = false;
    this.shouldShow = ({ view: view2, state, from, to: to2 }) => {
      const { doc, selection } = state;
      const { empty } = selection;
      const isEmptyTextBlock = !doc.textBetween(from, to2).length && isTextSelection(state.selection);
      const isChildOfMenu = this.element.contains(document.activeElement);
      const hasEditorFocus = view2.hasFocus() || isChildOfMenu;
      if (!hasEditorFocus || empty || isEmptyTextBlock || !this.editor.isEditable) {
        return false;
      }
      return true;
    };
    this.mousedownHandler = () => {
      this.preventHide = true;
    };
    this.dragstartHandler = () => {
      this.hide();
    };
    this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    };
    this.blurHandler = ({ event }) => {
      var _a;
      if (this.preventHide) {
        this.preventHide = false;
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) === this.editor.view.dom) {
        return;
      }
      this.hide();
    };
    this.tippyBlurHandler = (event) => {
      this.blurHandler({ event });
    };
    this.handleDebouncedUpdate = (view2, oldState) => {
      const selectionChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.selection.eq(view2.state.selection));
      const docChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.doc.eq(view2.state.doc));
      if (!selectionChanged && !docChanged) {
        return;
      }
      if (this.updateDebounceTimer) {
        clearTimeout(this.updateDebounceTimer);
      }
      this.updateDebounceTimer = window.setTimeout(() => {
        this.updateHandler(view2, selectionChanged, docChanged, oldState);
      }, this.updateDelay);
    };
    this.updateHandler = (view2, selectionChanged, docChanged, oldState) => {
      var _a, _b, _c;
      const { state, composing } = view2;
      const { selection } = state;
      const isSame = !selectionChanged && !docChanged;
      if (composing || isSame) {
        return;
      }
      this.createTooltip();
      const { ranges } = selection;
      const from = Math.min(...ranges.map((range) => range.$from.pos));
      const to2 = Math.max(...ranges.map((range) => range.$to.pos));
      const shouldShow2 = (_a = this.shouldShow) === null || _a === void 0 ? void 0 : _a.call(this, {
        editor: this.editor,
        element: this.element,
        view: view2,
        state,
        oldState,
        from,
        to: to2
      });
      if (!shouldShow2) {
        this.hide();
        return;
      }
      (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.setProps({
        getReferenceClientRect: ((_c = this.tippyOptions) === null || _c === void 0 ? void 0 : _c.getReferenceClientRect) || (() => {
          if (isNodeSelection(state.selection)) {
            let node = view2.nodeDOM(from);
            if (node) {
              const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector("[data-node-view-wrapper]");
              if (nodeViewWrapper) {
                node = nodeViewWrapper.firstChild;
              }
              if (node) {
                return node.getBoundingClientRect();
              }
            }
          }
          return posToDOMRect(view2, from, to2);
        })
      });
      this.show();
    };
    this.editor = editor;
    this.element = element;
    this.view = view;
    this.updateDelay = updateDelay;
    if (shouldShow) {
      this.shouldShow = shouldShow;
    }
    this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.view.dom.addEventListener("dragstart", this.dragstartHandler);
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    this.element.remove();
    this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;
    if (this.tippy || !editorIsAttached) {
      return;
    }
    this.tippy = tippy_esm_default(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "top",
      hideOnClick: "toggle",
      ...this.tippyOptions
    });
    if (this.tippy.popper.firstChild) {
      this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler);
    }
  }
  update(view, oldState) {
    const { state } = view;
    const hasValidSelection = state.selection.from !== state.selection.to;
    if (this.updateDelay > 0 && hasValidSelection) {
      this.handleDebouncedUpdate(view, oldState);
      return;
    }
    const selectionChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.selection.eq(view.state.selection));
    const docChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.doc.eq(view.state.doc));
    this.updateHandler(view, selectionChanged, docChanged, oldState);
  }
  show() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
  }
  hide() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
  }
  destroy() {
    var _a, _b;
    if ((_a = this.tippy) === null || _a === void 0 ? void 0 : _a.popper.firstChild) {
      this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler);
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.destroy();
    this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.view.dom.removeEventListener("dragstart", this.dragstartHandler);
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
  }
};
var BubbleMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new BubbleMenuView({ view, ...options })
  });
};
var BubbleMenu = Extension.create({
  name: "bubbleMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "bubbleMenu",
      updateDelay: void 0,
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }
    return [
      BubbleMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow
      })
    ];
  }
});

// node_modules/@tiptap/react/dist/index.js
var import_react2 = __toESM(require_react());
var import_react_dom3 = __toESM(require_react_dom());

// node_modules/@tiptap/extension-floating-menu/dist/index.js
var FloatingMenuView = class {
  getTextContent(node) {
    return getText(node, { textSerializers: getTextSerializersFromSchema(this.editor.schema) });
  }
  constructor({ editor, element, view, tippyOptions = {}, shouldShow }) {
    this.preventHide = false;
    this.shouldShow = ({ view: view2, state }) => {
      const { selection } = state;
      const { $anchor, empty } = selection;
      const isRootDepth = $anchor.depth === 1;
      const isEmptyTextBlock = $anchor.parent.isTextblock && !$anchor.parent.type.spec.code && !$anchor.parent.textContent && $anchor.parent.childCount === 0 && !this.getTextContent($anchor.parent);
      if (!view2.hasFocus() || !empty || !isRootDepth || !isEmptyTextBlock || !this.editor.isEditable) {
        return false;
      }
      return true;
    };
    this.mousedownHandler = () => {
      this.preventHide = true;
    };
    this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    };
    this.blurHandler = ({ event }) => {
      var _a;
      if (this.preventHide) {
        this.preventHide = false;
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) === this.editor.view.dom) {
        return;
      }
      this.hide();
    };
    this.tippyBlurHandler = (event) => {
      this.blurHandler({ event });
    };
    this.editor = editor;
    this.element = element;
    this.view = view;
    if (shouldShow) {
      this.shouldShow = shouldShow;
    }
    this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    this.element.remove();
    this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;
    if (this.tippy || !editorIsAttached) {
      return;
    }
    this.tippy = tippy_esm_default(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "right",
      hideOnClick: "toggle",
      ...this.tippyOptions
    });
    if (this.tippy.popper.firstChild) {
      this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler);
    }
  }
  update(view, oldState) {
    var _a, _b, _c;
    const { state } = view;
    const { doc, selection } = state;
    const { from, to: to2 } = selection;
    const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);
    if (isSame) {
      return;
    }
    this.createTooltip();
    const shouldShow = (_a = this.shouldShow) === null || _a === void 0 ? void 0 : _a.call(this, {
      editor: this.editor,
      view,
      state,
      oldState
    });
    if (!shouldShow) {
      this.hide();
      return;
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.setProps({
      getReferenceClientRect: ((_c = this.tippyOptions) === null || _c === void 0 ? void 0 : _c.getReferenceClientRect) || (() => posToDOMRect(view, from, to2))
    });
    this.show();
  }
  show() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
  }
  hide() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
  }
  destroy() {
    var _a, _b;
    if ((_a = this.tippy) === null || _a === void 0 ? void 0 : _a.popper.firstChild) {
      this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler);
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.destroy();
    this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
  }
};
var FloatingMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new FloatingMenuView({ view, ...options })
  });
};
var FloatingMenu = Extension.create({
  name: "floatingMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "floatingMenu",
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }
    return [
      FloatingMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow
      })
    ];
  }
});

// node_modules/@tiptap/react/dist/index.js
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var shim = { exports: {} };
var useSyncExternalStoreShim_development = {};
var hasRequiredUseSyncExternalStoreShim_development;
function requireUseSyncExternalStoreShim_development() {
  if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
  hasRequiredUseSyncExternalStoreShim_development = 1;
  if (true) {
    (function() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React$1 = import_react2.default;
      var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error2(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      function is(x2, y2) {
        return x2 === y2 && (x2 !== 0 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var useState3 = React$1.useState, useEffect4 = React$1.useEffect, useLayoutEffect3 = React$1.useLayoutEffect, useDebugValue2 = React$1.useDebugValue;
      var didWarnOld18Alpha = false;
      var didWarnUncachedGetSnapshot = false;
      function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
        {
          if (!didWarnOld18Alpha) {
            if (React$1.startTransition !== void 0) {
              didWarnOld18Alpha = true;
              error2("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
            }
          }
        }
        var value = getSnapshot();
        {
          if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            if (!objectIs(value, cachedValue)) {
              error2("The result of getSnapshot should be cached to avoid an infinite loop");
              didWarnUncachedGetSnapshot = true;
            }
          }
        }
        var _useState = useState3({
          inst: {
            value,
            getSnapshot
          }
        }), inst = _useState[0].inst, forceUpdate = _useState[1];
        useLayoutEffect3(function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          if (checkIfSnapshotChanged(inst)) {
            forceUpdate({
              inst
            });
          }
        }, [subscribe, value, getSnapshot]);
        useEffect4(function() {
          if (checkIfSnapshotChanged(inst)) {
            forceUpdate({
              inst
            });
          }
          var handleStoreChange = function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          };
          return subscribe(handleStoreChange);
        }, [subscribe]);
        useDebugValue2(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        var prevValue = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(prevValue, nextValue);
        } catch (error3) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
        return getSnapshot();
      }
      var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
      var isServerEnvironment = !canUseDOM;
      var shim2 = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
      var useSyncExternalStore$2 = React$1.useSyncExternalStore !== void 0 ? React$1.useSyncExternalStore : shim2;
      useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
  return useSyncExternalStoreShim_development;
}
if (false) {
  shim.exports = requireUseSyncExternalStoreShim_production_min();
} else {
  shim.exports = requireUseSyncExternalStoreShim_development();
}
var shimExports = shim.exports;
var mergeRefs = (...refs) => {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
};
var Portals = ({ contentComponent }) => {
  const renderers = shimExports.useSyncExternalStore(contentComponent.subscribe, contentComponent.getSnapshot, contentComponent.getServerSnapshot);
  return import_react2.default.createElement(import_react2.default.Fragment, null, Object.values(renderers));
};
function getInstance() {
  const subscribers = /* @__PURE__ */ new Set();
  let renderers = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(callback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    getSnapshot() {
      return renderers;
    },
    getServerSnapshot() {
      return renderers;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(id, renderer) {
      renderers = {
        ...renderers,
        [id]: import_react_dom3.default.createPortal(renderer.reactElement, renderer.element, id)
      };
      subscribers.forEach((subscriber) => subscriber());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(id) {
      const nextRenderers = { ...renderers };
      delete nextRenderers[id];
      renderers = nextRenderers;
      subscribers.forEach((subscriber) => subscriber());
    }
  };
}
var PureEditorContent = class extends import_react2.default.Component {
  constructor(props) {
    var _a;
    super(props);
    this.editorContentRef = import_react2.default.createRef();
    this.initialized = false;
    this.state = {
      hasContentComponentInitialized: Boolean((_a = props.editor) === null || _a === void 0 ? void 0 : _a.contentComponent)
    };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  init() {
    const editor = this.props.editor;
    if (editor && !editor.isDestroyed && editor.options.element) {
      if (editor.contentComponent) {
        return;
      }
      const element = this.editorContentRef.current;
      element.append(...editor.options.element.childNodes);
      editor.setOptions({
        element
      });
      editor.contentComponent = getInstance();
      if (!this.state.hasContentComponentInitialized) {
        this.unsubscribeToContentComponent = editor.contentComponent.subscribe(() => {
          this.setState((prevState) => {
            if (!prevState.hasContentComponentInitialized) {
              return {
                hasContentComponentInitialized: true
              };
            }
            return prevState;
          });
          if (this.unsubscribeToContentComponent) {
            this.unsubscribeToContentComponent();
          }
        });
      }
      editor.createNodeViews();
      this.initialized = true;
    }
  }
  componentWillUnmount() {
    const editor = this.props.editor;
    if (!editor) {
      return;
    }
    this.initialized = false;
    if (!editor.isDestroyed) {
      editor.view.setProps({
        nodeViews: {}
      });
    }
    if (this.unsubscribeToContentComponent) {
      this.unsubscribeToContentComponent();
    }
    editor.contentComponent = null;
    if (!editor.options.element.firstChild) {
      return;
    }
    const newElement = document.createElement("div");
    newElement.append(...editor.options.element.childNodes);
    editor.setOptions({
      element: newElement
    });
  }
  render() {
    const { editor, innerRef, ...rest } = this.props;
    return import_react2.default.createElement(
      import_react2.default.Fragment,
      null,
      import_react2.default.createElement("div", { ref: mergeRefs(innerRef, this.editorContentRef), ...rest }),
      (editor === null || editor === void 0 ? void 0 : editor.contentComponent) && import_react2.default.createElement(Portals, { contentComponent: editor.contentComponent })
    );
  }
};
var EditorContentWithKey = (0, import_react2.forwardRef)((props, ref) => {
  const key = import_react2.default.useMemo(() => {
    return Math.floor(Math.random() * 4294967295).toString();
  }, [props.editor]);
  return import_react2.default.createElement(PureEditorContent, {
    key,
    innerRef: ref,
    ...props
  });
});
var EditorContent = import_react2.default.memo(EditorContentWithKey);
var react = function equal(a, b2) {
  if (a === b2) return true;
  if (a && b2 && typeof a == "object" && typeof b2 == "object") {
    if (a.constructor !== b2.constructor) return false;
    var length, i2, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; )
        if (!equal(a[i2], b2[i2])) return false;
      return true;
    }
    if (a instanceof Map && b2 instanceof Map) {
      if (a.size !== b2.size) return false;
      for (i2 of a.entries())
        if (!b2.has(i2[0])) return false;
      for (i2 of a.entries())
        if (!equal(i2[1], b2.get(i2[0]))) return false;
      return true;
    }
    if (a instanceof Set && b2 instanceof Set) {
      if (a.size !== b2.size) return false;
      for (i2 of a.entries())
        if (!b2.has(i2[0])) return false;
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b2)) {
      length = a.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; )
        if (a[i2] !== b2[i2]) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b2.source && a.flags === b2.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b2.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b2.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b2).length) return false;
    for (i2 = length; i2-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) return false;
    for (i2 = length; i2-- !== 0; ) {
      var key = keys[i2];
      if (key === "_owner" && a.$$typeof) {
        continue;
      }
      if (!equal(a[key], b2[key])) return false;
    }
    return true;
  }
  return a !== a && b2 !== b2;
};
var deepEqual = getDefaultExportFromCjs(react);
var withSelector = { exports: {} };
var withSelector_development = {};
var hasRequiredWithSelector_development;
function requireWithSelector_development() {
  if (hasRequiredWithSelector_development) return withSelector_development;
  hasRequiredWithSelector_development = 1;
  if (true) {
    (function() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React$1 = import_react2.default;
      var shim2 = shimExports;
      function is(x2, y2) {
        return x2 === y2 && (x2 !== 0 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var useSyncExternalStore = shim2.useSyncExternalStore;
      var useRef4 = React$1.useRef, useEffect4 = React$1.useEffect, useMemo2 = React$1.useMemo, useDebugValue2 = React$1.useDebugValue;
      function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef4(null);
        var inst;
        if (instRef.current === null) {
          inst = {
            hasValue: false,
            value: null
          };
          instRef.current = inst;
        } else {
          inst = instRef.current;
        }
        var _useMemo = useMemo2(function() {
          var hasMemo = false;
          var memoizedSnapshot;
          var memoizedSelection;
          var memoizedSelector = function(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = true;
              memoizedSnapshot = nextSnapshot;
              var _nextSelection = selector(nextSnapshot);
              if (isEqual !== void 0) {
                if (inst.hasValue) {
                  var currentSelection = inst.value;
                  if (isEqual(currentSelection, _nextSelection)) {
                    memoizedSelection = currentSelection;
                    return currentSelection;
                  }
                }
              }
              memoizedSelection = _nextSelection;
              return _nextSelection;
            }
            var prevSnapshot = memoizedSnapshot;
            var prevSelection = memoizedSelection;
            if (objectIs(prevSnapshot, nextSnapshot)) {
              return prevSelection;
            }
            var nextSelection = selector(nextSnapshot);
            if (isEqual !== void 0 && isEqual(prevSelection, nextSelection)) {
              return prevSelection;
            }
            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
          };
          var maybeGetServerSnapshot = getServerSnapshot === void 0 ? null : getServerSnapshot;
          var getSnapshotWithSelector = function() {
            return memoizedSelector(getSnapshot());
          };
          var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          };
          return [getSnapshotWithSelector, getServerSnapshotWithSelector];
        }, [getSnapshot, getServerSnapshot, selector, isEqual]), getSelection = _useMemo[0], getServerSelection = _useMemo[1];
        var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
        useEffect4(function() {
          inst.hasValue = true;
          inst.value = value;
        }, [value]);
        useDebugValue2(value);
        return value;
      }
      withSelector_development.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector;
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
  return withSelector_development;
}
if (false) {
  withSelector.exports = requireWithSelector_production_min();
} else {
  withSelector.exports = requireWithSelector_development();
}
var withSelectorExports = withSelector.exports;
var isSSR = typeof window === "undefined";
var isNext = isSSR || Boolean(typeof window !== "undefined" && window.next);
var EditorContext = (0, import_react2.createContext)({
  editor: null
});
var EditorConsumer = EditorContext.Consumer;
var ReactNodeViewContext = (0, import_react2.createContext)({
  onDragStart: void 0
});
var useReactNodeView = () => (0, import_react2.useContext)(ReactNodeViewContext);
var NodeViewWrapper = import_react2.default.forwardRef((props, ref) => {
  const { onDragStart } = useReactNodeView();
  const Tag = props.as || "div";
  return (
    // @ts-ignore
    import_react2.default.createElement(Tag, { ...props, ref, "data-node-view-wrapper": "", onDragStart, style: {
      whiteSpace: "normal",
      ...props.style
    } })
  );
});
function isClassComponent(Component) {
  return !!(typeof Component === "function" && Component.prototype && Component.prototype.isReactComponent);
}
function isForwardRefComponent(Component) {
  var _a;
  return !!(typeof Component === "object" && ((_a = Component.$$typeof) === null || _a === void 0 ? void 0 : _a.toString()) === "Symbol(react.forward_ref)");
}
function isReact19Plus() {
  try {
    if (import_react2.version) {
      const majorVersion = parseInt(import_react2.version.split(".")[0], 10);
      return majorVersion >= 19;
    }
  } catch {
  }
  return false;
}
var ReactRenderer = class {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(component, { editor, props = {}, as = "div", className = "" }) {
    this.ref = null;
    this.id = Math.floor(Math.random() * 4294967295).toString();
    this.component = component;
    this.editor = editor;
    this.props = props;
    this.element = document.createElement(as);
    this.element.classList.add("react-renderer");
    if (className) {
      this.element.classList.add(...className.split(" "));
    }
    if (this.editor.isInitialized) {
      (0, import_react_dom3.flushSync)(() => {
        this.render();
      });
    } else {
      this.render();
    }
  }
  /**
   * Render the React component.
   */
  render() {
    var _a;
    const Component = this.component;
    const props = this.props;
    const editor = this.editor;
    const isReact19 = isReact19Plus();
    const isClassComp = isClassComponent(Component);
    const isForwardRefComp = isForwardRefComponent(Component);
    const elementProps = { ...props };
    if (!elementProps.ref) {
      if (isReact19) {
        elementProps.ref = (ref) => {
          this.ref = ref;
        };
      } else if (isClassComp || isForwardRefComp) {
        elementProps.ref = (ref) => {
          this.ref = ref;
        };
      }
    }
    this.reactElement = import_react2.default.createElement(Component, { ...elementProps });
    (_a = editor === null || editor === void 0 ? void 0 : editor.contentComponent) === null || _a === void 0 ? void 0 : _a.setRenderer(this.id, this);
  }
  /**
   * Re-renders the React component with new props.
   */
  updateProps(props = {}) {
    this.props = {
      ...this.props,
      ...props
    };
    this.render();
  }
  /**
   * Destroy the React component.
   */
  destroy() {
    var _a;
    const editor = this.editor;
    (_a = editor === null || editor === void 0 ? void 0 : editor.contentComponent) === null || _a === void 0 ? void 0 : _a.removeRenderer(this.id);
  }
  /**
   * Update the attributes of the element that holds the React component.
   */
  updateAttributes(attributes) {
    Object.keys(attributes).forEach((key) => {
      this.element.setAttribute(key, attributes[key]);
    });
  }
};
var ReactNodeView = class extends NodeView {
  /**
   * Setup the React component.
   * Called on initialization.
   */
  mount() {
    const props = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: false,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
      ref: (0, import_react2.createRef)()
    };
    if (!this.component.displayName) {
      const capitalizeFirstChar = (string) => {
        return string.charAt(0).toUpperCase() + string.substring(1);
      };
      this.component.displayName = capitalizeFirstChar(this.extension.name);
    }
    const onDragStart = this.onDragStart.bind(this);
    const nodeViewContentRef = (element) => {
      if (element && this.contentDOMElement && element.firstChild !== this.contentDOMElement) {
        element.appendChild(this.contentDOMElement);
      }
    };
    const context = { onDragStart, nodeViewContentRef };
    const Component = this.component;
    const ReactNodeViewProvider = (0, import_react2.memo)((componentProps) => {
      return import_react2.default.createElement(ReactNodeViewContext.Provider, { value: context }, (0, import_react2.createElement)(Component, componentProps));
    });
    ReactNodeViewProvider.displayName = "ReactNodeView";
    if (this.node.isLeaf) {
      this.contentDOMElement = null;
    } else if (this.options.contentDOMElementTag) {
      this.contentDOMElement = document.createElement(this.options.contentDOMElementTag);
    } else {
      this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div");
    }
    if (this.contentDOMElement) {
      this.contentDOMElement.dataset.nodeViewContentReact = "";
      this.contentDOMElement.style.whiteSpace = "inherit";
    }
    let as = this.node.isInline ? "span" : "div";
    if (this.options.as) {
      as = this.options.as;
    }
    const { className = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
    this.renderer = new ReactRenderer(ReactNodeViewProvider, {
      editor: this.editor,
      props,
      as,
      className: `node-${this.node.type.name} ${className}`.trim()
    });
    this.editor.on("selectionUpdate", this.handleSelectionUpdate);
    this.updateElementAttributes();
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    var _a;
    if (this.renderer.element.firstElementChild && !((_a = this.renderer.element.firstElementChild) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-node-view-wrapper"))) {
      throw Error("Please use the NodeViewWrapper component for your node view.");
    }
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentDOMElement;
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    const { from, to: to2 } = this.editor.state.selection;
    const pos = this.getPos();
    if (typeof pos !== "number") {
      return;
    }
    if (from <= pos && to2 >= pos + this.node.nodeSize) {
      if (this.renderer.props.selected) {
        return;
      }
      this.selectNode();
    } else {
      if (!this.renderer.props.selected) {
        return;
      }
      this.deselectNode();
    }
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(node, decorations, innerDecorations) {
    const rerenderComponent = (props) => {
      this.renderer.updateProps(props);
      if (typeof this.options.attrs === "function") {
        this.updateElementAttributes();
      }
    };
    if (node.type !== this.node.type) {
      return false;
    }
    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;
      const oldInnerDecorations = this.innerDecorations;
      this.node = node;
      this.decorations = decorations;
      this.innerDecorations = innerDecorations;
      return this.options.update({
        oldNode,
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        oldInnerDecorations,
        innerDecorations,
        updateProps: () => rerenderComponent({ node, decorations, innerDecorations })
      });
    }
    if (node === this.node && this.decorations === decorations && this.innerDecorations === innerDecorations) {
      return true;
    }
    this.node = node;
    this.decorations = decorations;
    this.innerDecorations = innerDecorations;
    rerenderComponent({ node, decorations, innerDecorations });
    return true;
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: true
    });
    this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: false
    });
    this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  /**
   * Destroy the React component instance.
   */
  destroy() {
    this.renderer.destroy();
    this.editor.off("selectionUpdate", this.handleSelectionUpdate);
    this.contentDOMElement = null;
  }
  /**
   * Update the attributes of the top-level element that holds the React component.
   * Applying the attributes defined in the `attrs` option.
   */
  updateElementAttributes() {
    if (this.options.attrs) {
      let attrsObj = {};
      if (typeof this.options.attrs === "function") {
        const extensionAttributes = this.editor.extensionManager.attributes;
        const HTMLAttributes = getRenderedAttributes(this.node, extensionAttributes);
        attrsObj = this.options.attrs({ node: this.node, HTMLAttributes });
      } else {
        attrsObj = this.options.attrs;
      }
      this.renderer.updateAttributes(attrsObj);
    }
  }
};
function ReactNodeViewRenderer(component, options) {
  return (props) => {
    if (!props.editor.contentComponent) {
      return {};
    }
    return new ReactNodeView(component, props, options);
  };
}

// node_modules/@blocknote/react/dist/blocknote-react.js
var import_client = __toESM(require_client());
var Zt = Object.defineProperty;
var De2 = (e) => {
  throw TypeError(e);
};
var Ft = (e, t, n) => t in e ? Zt(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var L = (e, t, n) => Ft(e, typeof t != "symbol" ? t + "" : t, n);
var At = (e, t, n) => t.has(e) || De2("Cannot " + n);
var Ze = (e, t, n) => t.has(e) ? De2("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var ge = (e, t, n) => (At(e, t, "access private method"), n);
var dt = (0, import_react3.createContext)(void 0);
function D(e) {
  return (0, import_react3.useContext)(dt);
}
function b(e) {
  const t = D();
  if (!(t != null && t.editor))
    throw new Error(
      "useBlockNoteEditor was called outside of a BlockNoteContext provider or BlockNoteView component"
    );
  return t.editor;
}
function se(e, t, n) {
  const o = D();
  t || (t = o == null ? void 0 : o.editor), (0, import_react3.useEffect)(() => {
    if (!t)
      throw new Error(
        "'editor' is required, either from BlockNoteContext or as a function argument"
      );
    return t.onSelectionChange(e, n);
  }, [e, t, n]);
}
function Pn2(e, t) {
  const n = b();
  t = t || n;
  const [o, r] = (0, import_react3.useState)(() => {
    if (e)
      return t.getSelectionBoundingBox();
  }), l = (0, import_react3.useCallback)(() => {
    if (!e)
      return;
    const c = t.getSelectionBoundingBox();
    r(c);
  }, [t, e]);
  return se(l, t, true), (0, import_react3.useEffect)(() => {
    r(e ? t.getSelectionBoundingBox() : void 0);
  }, [e, t]), o;
}
function G2(e, t, n, o) {
  const { refs: r, update: l, context: c, floatingStyles: d } = useFloating2({
    open: e,
    ...o
  }), { isMounted: s, styles: a } = useTransitionStyles(c), u = useDismiss(c), { getReferenceProps: m, getFloatingProps: h } = useInteractions([u]);
  return (0, import_react3.useEffect)(() => {
    l();
  }, [t, l]), (0, import_react3.useEffect)(() => {
    t !== null && r.setReference({
      getBoundingClientRect: () => t
    });
  }, [t, r]), (0, import_react3.useMemo)(() => ({
    isMounted: s,
    ref: r.setFloating,
    setReference: r.setReference,
    style: {
      display: "flex",
      ...a,
      ...d,
      zIndex: n
    },
    getFloatingProps: h,
    getReferenceProps: m
  }), [
    d,
    s,
    r.setFloating,
    r.setReference,
    a,
    n,
    h,
    m
  ]);
}
function O(e) {
  const [t, n] = (0, import_react3.useState)();
  return (0, import_react3.useEffect)(() => e((o) => {
    n({ ...o });
  }), [e]), t;
}
var On = (0, import_react3.createContext)(
  void 0
);
function C() {
  return (0, import_react3.useContext)(On);
}
var de = (e = {}, t = []) => (0, import_react3.useMemo)(() => {
  const n = Jn.create(e);
  return window && (window.ProseMirror = n._tiptapEditor), n;
}, t);
var Oi = de;
function M() {
  return D().editor.dictionary;
}
function ue(e, t) {
  const n = D();
  t || (t = n == null ? void 0 : n.editor), (0, import_react3.useEffect)(() => {
    if (!t)
      throw new Error(
        "'editor' is required, either from BlockNoteContext or as a function argument"
      );
    return t.onChange(e);
  }, [e, t]);
}
var Le = (e) => {
  const [t, n] = (0, import_react3.useState)(false), [o, r] = (0, import_react3.useState)(e.editor.isEmpty), l = C();
  ue(() => {
    r(e.editor.isEmpty);
  }, e.editor);
  const c = (0, import_react3.useCallback)(() => {
    n(true);
  }, []), d = (0, import_react3.useCallback)(() => {
    n(false);
  }, []);
  return (0, import_react3.useEffect)(() => {
    e.editable && e.autoFocus && e.editor.focus();
  }, [e.autoFocus, e.editable, e.editor]), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(
      l.Comments.Editor,
      {
        autoFocus: e.autoFocus,
        className: "bn-comment-editor",
        editor: e.editor,
        onFocus: c,
        onBlur: d,
        editable: e.editable
      }
    ),
    e.actions && (0, import_jsx_runtime.jsx)("div", { className: "bn-comment-actions-wrapper", children: (0, import_jsx_runtime.jsx)(e.actions, { isFocused: t, isEmpty: o }) })
  ] });
};
var Dn = ee(
  G(
    In.paragraph.implementation.node.config
  ),
  // disable default props on paragraph (such as textalignment and colors)
  {}
);
var { textColor: Di, backgroundColor: Zi, ...Zn } = Ln;
var Ee2 = Te.create({
  blockSpecs: {
    paragraph: Dn
  },
  styleSpecs: Zn
});
function Fn() {
  const e = b();
  if (!e.comments)
    throw new Error("Comments plugin not found");
  const t = e.comments, n = C(), o = M(), r = de({
    trailingBlock: false,
    dictionary: {
      ...o,
      placeholders: {
        emptyDocument: o.placeholders.new_comment
      }
    },
    schema: Ee2,
    sideMenuDetection: "editor"
  });
  return (0, import_jsx_runtime.jsx)(n.Comments.Card, { className: "bn-thread", children: (0, import_jsx_runtime.jsx)(
    Le,
    {
      autoFocus: true,
      editable: true,
      editor: r,
      actions: ({ isEmpty: l }) => (0, import_jsx_runtime.jsx)(
        n.Generic.Toolbar.Root,
        {
          className: Q(
            "bn-action-toolbar",
            "bn-comment-actions"
          ),
          variant: "action-toolbar",
          children: (0, import_jsx_runtime.jsx)(
            n.Generic.Toolbar.Button,
            {
              className: "bn-button",
              mainTooltip: "Save",
              variant: "compact",
              isDisabled: l,
              onClick: async () => {
                await t.createThread({
                  initialComment: {
                    body: r.document
                  }
                }), t.stopPendingComment();
              },
              children: "Save"
            }
          )
        }
      )
    }
  ) });
}
var An = (e) => {
  const t = b();
  if (!t.comments)
    throw new Error(
      "FloatingComposerController can only be used when BlockNote editor has enabled comments"
    );
  const n = t.comments;
  (0, import_react3.useEffect)(() => {
    const u = n.onUpdate(
      (m) => t.setForceSelectionVisible(m.pendingComment)
    );
    return () => u();
  }, [n, t]);
  const o = O(n.onUpdate.bind(n)), r = Pn2(o == null ? void 0 : o.pendingComment), { isMounted: l, ref: c, style: d, getFloatingProps: s } = G2(
    (o == null ? void 0 : o.pendingComment) || false,
    r || null,
    5e3,
    {
      placement: "bottom",
      middleware: [offset(10), shift(), flip()],
      onOpenChange: (u) => {
        u || (n.stopPendingComment(), t.focus());
      },
      ...e.floatingOptions
    }
  );
  if (!l || !o)
    return null;
  const a = e.floatingComposer || Fn;
  return (0, import_jsx_runtime.jsx)("div", { ref: c, style: d, ...s(), children: (0, import_jsx_runtime.jsx)(a, {}) });
};
var ut = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var Ge = import_react3.default.createContext && import_react3.default.createContext(ut);
var Gn = ["attr", "size", "title"];
function Un(e, t) {
  if (e == null) return {};
  var n = zn(e, t), o, r;
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      o = l[r], !(t.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(e, o) && (n[o] = e[o]);
  }
  return n;
}
function zn(e, t) {
  if (e == null) return {};
  var n = {};
  for (var o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      if (t.indexOf(o) >= 0) continue;
      n[o] = e[o];
    }
  return n;
}
function oe() {
  return oe = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }, oe.apply(this, arguments);
}
function Ue(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function re(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ue(Object(n), true).forEach(function(o) {
      jn(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ue(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function jn(e, t, n) {
  return t = Wn(t), t in e ? Object.defineProperty(e, t, { value: n, enumerable: true, configurable: true, writable: true }) : e[t] = n, e;
}
function Wn(e) {
  var t = $n(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function $n(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (typeof o != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function mt(e) {
  return e && e.map((t, n) => import_react3.default.createElement(t.tag, re({
    key: n
  }, t.attr), mt(t.child)));
}
function k(e) {
  return (t) => import_react3.default.createElement(qn, oe({
    attr: re({}, e.attr)
  }, t), mt(e.child));
}
function qn(e) {
  var t = (n) => {
    var {
      attr: o,
      size: r,
      title: l
    } = e, c = Un(e, Gn), d = r || n.size || "1em", s;
    return n.className && (s = n.className), e.className && (s = (s ? s + " " : "") + e.className), import_react3.default.createElement("svg", oe({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, n.attr, o, c, {
      className: s,
      style: re(re({
        color: e.color || n.color
      }, n.style), e.style),
      height: d,
      width: d,
      xmlns: "http://www.w3.org/2000/svg"
    }), l && import_react3.default.createElement("title", null, l), e.children);
  };
  return Ge !== void 0 ? import_react3.default.createElement(Ge.Consumer, null, (n) => t(n)) : t(ut);
}
function Kn(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 7V11L2 6L8 1V5H13C17.4183 5 21 8.58172 21 13C21 17.4183 17.4183 21 13 21H4V19H13C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7H8Z" }, child: [] }] })(e);
}
function ht(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711Z" }, child: [] }] })(e);
}
function Xn(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M7.24264 17.9967H3V13.754L14.435 2.319C14.8256 1.92848 15.4587 1.92848 15.8492 2.319L18.6777 5.14743C19.0682 5.53795 19.0682 6.17112 18.6777 6.56164L7.24264 17.9967ZM3 19.9967H21V21.9967H3V19.9967Z" }, child: [] }] })(e);
}
function Yn(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z" }, child: [] }] })(e);
}
function Re(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 8L9.00319 2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8ZM10 4V9H5V20H19V4H10Z" }, child: [] }] })(e);
}
function Jn2(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM5 19H19V21H5V19ZM3 14H21V16H3V14ZM5 9H19V11H5V9Z" }, child: [] }] })(e);
}
function Qn(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM3 19H21V21H3V19ZM3 14H21V16H3V14ZM3 9H21V11H3V9Z" }, child: [] }] })(e);
}
function eo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM3 19H17V21H3V19ZM3 14H21V16H3V14ZM3 9H17V11H3V9Z" }, child: [] }] })(e);
}
function to(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM7 19H21V21H7V19ZM3 14H21V16H3V14ZM7 9H21V11H7V9Z" }, child: [] }] })(e);
}
function no(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z" }, child: [] }] })(e);
}
function oo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3.41436 5.99995L5.70726 3.70706L4.29304 2.29285L0.585938 5.99995L4.29304 9.70706L5.70726 8.29285L3.41436 5.99995ZM9.58594 5.99995L7.29304 3.70706L8.70726 2.29285L12.4144 5.99995L8.70726 9.70706L7.29304 8.29285L9.58594 5.99995ZM14.0002 2.99995H21.0002C21.5524 2.99995 22.0002 3.44767 22.0002 3.99995V20C22.0002 20.5522 21.5524 21 21.0002 21H3.00015C2.44787 21 2.00015 20.5522 2.00015 20V12H4.00015V19H20.0002V4.99995H14.0002V2.99995Z" }, child: [] }] })(e);
}
function ze(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M5.55397 22H3.3999L10.9999 3H12.9999L20.5999 22H18.4458L16.0458 16H7.95397L5.55397 22ZM8.75397 14H15.2458L11.9999 5.88517L8.75397 14Z" }, child: [] }] })(e);
}
function ft2(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z" }, child: [] }] })(e);
}
function gt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z" }, child: [] }] })(e);
}
function bt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z" }, child: [] }] })(e);
}
function ro(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM3 12.5L7 9V16L3 12.5Z" }, child: [] }] })(e);
}
function io(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM7 12.5L3 16V9L7 12.5Z" }, child: [] }] })(e);
}
function je(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 5H11V19H8V21H16V19H13V5H16V3H8V5ZM2 7C1.44772 7 1 7.44772 1 8V16C1 16.5523 1.44772 17 2 17H8V15H3V9H8V7H2ZM16 9H21V15H16V17H22C22.5523 17 23 16.5523 23 16V8C23 7.44772 22.5523 7 22 7H16V9Z" }, child: [] }] })(e);
}
function lo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z" }, child: [] }] })(e);
}
function co(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M17 17H22V19H19V22H17V17ZM7 7H2V5H5V2H7V7ZM18.364 15.5355L16.9497 14.1213L18.364 12.7071C20.3166 10.7545 20.3166 7.58866 18.364 5.63604C16.4113 3.68342 13.2455 3.68342 11.2929 5.63604L9.87868 7.05025L8.46447 5.63604L9.87868 4.22183C12.6123 1.48816 17.0445 1.48816 19.7782 4.22183C22.5118 6.9555 22.5118 11.3877 19.7782 14.1213L18.364 15.5355ZM15.5355 18.364L14.1213 19.7782C11.3877 22.5118 6.9555 22.5118 4.22183 19.7782C1.48816 17.0445 1.48816 12.6123 4.22183 9.87868L5.63604 8.46447L7.05025 9.87868L5.63604 11.2929C3.68342 13.2455 3.68342 16.4113 5.63604 18.364C7.58866 20.3166 10.7545 20.3166 12.7071 18.364L14.1213 16.9497L15.5355 18.364ZM14.8284 7.75736L16.2426 9.17157L9.17157 16.2426L7.75736 14.8284L14.8284 7.75736Z" }, child: [] }] })(e);
}
function Ct(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z" }, child: [] }] })(e);
}
function pt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z" }, child: [] }] })(e);
}
function kt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" }, child: [] }] })(e);
}
function wt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" }, child: [] }] })(e);
}
function ao(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V10.999H7V9L10 12L7 15V13H5V19H11V17H13V19H19V13H17V15L14 12L17 9V10.999H19V5H13V7H11V5ZM13 13V15H11V13H13ZM13 9V11H11V9H13Z" }, child: [] }] })(e);
}
function so(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20ZM19 11V5H13.001V7H15L12 10L9 7H11V5H5V11H7V13H5V19H11V17H9L12 14L15 17H13.001V19H19V13H17V11H19ZM11 13H9V11H11V13ZM15 13H13V11H15V13Z" }, child: [] }] })(e);
}
function vt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M21 4H3V6H21V4ZM21 11H8V13H21V11ZM21 18H8V20H21V18ZM5 11H3V20H5V11Z" }, child: [] }] })(e);
}
function uo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z" }, child: [] }] })(e);
}
function mo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M13 10V14H19V10H13ZM11 10H5V14H11V10ZM13 19H19V16H13V19ZM11 19V16H5V19H11ZM13 5V8H19V5H13ZM11 5H5V8H11V5ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z" }, child: [] }] })(e);
}
function _e(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M13 6V21H11V6H5V4H19V6H13Z" }, child: [] }] })(e);
}
function ho(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z" }, child: [] }] })(e);
}
function fo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 5V19H16V5H8ZM4 5V7H6V5H4ZM18 5V7H20V5H18ZM4 9V11H6V9H4ZM18 9V11H20V9H18ZM4 13V15H6V13H4ZM18 13V15H20V13H18ZM4 17V19H6V17H4ZM18 17V19H20V17H18Z" }, child: [] }] })(e);
}
function Ht(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M5 11.1005L7 9.1005L12.5 14.6005L16 11.1005L19 14.1005V5H5V11.1005ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7C16.3284 7 17 7.67157 17 8.5C17 9.32843 16.3284 10 15.5 10Z" }, child: [] }] })(e);
}
function go(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934L22.0007 13.3417C21.3749 13.1204 20.7015 13 20 13V5H4L4.001 19L13.2929 9.70715C13.6528 9.34604 14.22 9.31823 14.6123 9.62322L14.7065 9.70772L18.2521 13.2586C15.791 14.0069 14 16.2943 14 19C14 19.7015 14.1204 20.3749 14.3417 21.0007L2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z" }, child: [] }] })(e);
}
function bo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M20 3C20.5523 3 21 3.44772 21 4V5.757L19 7.757V5H5V13.1L9 9.1005L13.328 13.429L12.0012 14.7562L11.995 18.995L16.2414 19.0012L17.571 17.671L18.8995 19H19V16.242L21 14.242V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM21.7782 7.80761L23.1924 9.22183L15.4142 17L13.9979 16.9979L14 15.5858L21.7782 7.80761ZM15.5 7C16.3284 7 17 7.67157 17 8.5C17 9.32843 16.3284 10 15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7Z" }, child: [] }] })(e);
}
function Co(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M3 3.9934C3 3.44476 3.44495 3 3.9934 3H20.0066C20.5552 3 21 3.44495 21 3.9934V20.0066C21 20.5552 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5551 3 20.0066V3.9934ZM10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z" }, child: [] }] })(e);
}
function Mt(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z" }, child: [] }] })(e);
}
function po(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" }, child: [] }] })(e);
}
function ko(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" }, child: [] }] })(e);
}
function wo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z" }, child: [] }] })(e);
}
function vo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z" }, child: [] }] })(e);
}
function Ho(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9H19L12 16L5 9H10V3H14V9Z" }, child: [] }] })(e);
}
function Mo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V12L17.206 8.207L11.2071 14.2071L9.79289 12.7929L15.792 6.793L12 3H21Z" }, child: [] }] })(e);
}
function xo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" }, child: [] }] })(e);
}
function yo(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13H8ZM8 11C8.82843 11 9.5 10.3284 9.5 9.5C9.5 8.67157 8.82843 8 8 8C7.17157 8 6.5 8.67157 6.5 9.5C6.5 10.3284 7.17157 11 8 11ZM16 11C16.8284 11 17.5 10.3284 17.5 9.5C17.5 8.67157 16.8284 8 16 8C15.1716 8 14.5 8.67157 14.5 9.5C14.5 10.3284 15.1716 11 16 11Z" }, child: [] }] })(e);
}
function We(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM8 13H16C16 15.2091 14.2091 17 12 17C9.79086 17 8 15.2091 8 13ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z" }, child: [] }] })(e);
}
var te;
async function Bo() {
  return te || (te = (async () => {
    const [e, t] = await Promise.all([
      import("./module-S2M4ORNM.js"),
      // use a dynamic import to encourage bundle-splitting
      // and a smaller initial client bundle size
      import("./native-NE6NL44N.js")
    ]), n = "default" in e ? e.default : e, o = "default" in t ? t.default : t;
    return await n.init({ data: o }), { emojiMart: n, emojiData: o };
  })(), te);
}
function Vo(e) {
  const t = (0, import_react3.useRef)(null), n = (0, import_react3.useRef)(null);
  return n.current && n.current.update(e), (0, import_react3.useEffect)(() => ((async () => {
    const { emojiMart: o } = await Bo();
    n.current = new o.Picker({ ...e, ref: t });
  })(), () => {
    n.current = null;
  }), []), import_react3.default.createElement("div", { ref: t });
}
var $e = (e) => {
  const [t, n] = (0, import_react3.useState)(false), o = C(), r = D();
  return (0, import_jsx_runtime.jsxs)(o.Generic.Popover.Root, { opened: t, children: [
    (0, import_jsx_runtime.jsx)(o.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      "div",
      {
        onClick: (l) => {
          l.preventDefault(), l.stopPropagation(), n(!t);
        },
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        },
        children: e.children
      }
    ) }),
    (0, import_jsx_runtime.jsx)(o.Generic.Popover.Content, { variant: "panel-popover", children: (0, import_jsx_runtime.jsx)(
      Vo,
      {
        perLine: 7,
        onClickOutside: () => n(false),
        onEmojiSelect: (l) => {
          e.onEmojiSelect(l), n(false);
        },
        theme: r == null ? void 0 : r.colorSchemePreference
      }
    ) })
  ] });
};
function So(e, t) {
  return Ie(e, [t]).get(t);
}
function Ie(e, t) {
  const n = e.comments;
  if (!n)
    throw new Error("Comments plugin not found");
  const o = n.userStore, r = (0, import_react3.useCallback)(() => {
    const d = /* @__PURE__ */ new Map();
    for (const s of t) {
      const a = o.getUser(s);
      a && d.set(s, a);
    }
    return d;
  }, [o, t]), l = (0, import_react3.useMemo)(() => ({
    current: r()
  }), [r]), c = (0, import_react3.useCallback)(
    (d) => {
      const s = o.subscribe((a) => {
        l.current = r(), d();
      });
      return o.loadUsers(t), s;
    },
    [o, r, t, l]
  );
  return (0, import_react3.useSyncExternalStore)(c, () => l.current);
}
var To = (e) => {
  const t = C(), n = M(), o = b();
  if (!o.comments)
    throw new Error(
      "ReactionBadge must be used inside a BlockNote editor with comments enabled"
    );
  const r = e.comment.reactions.find(
    (s) => s.emoji === e.emoji
  );
  if (!r)
    throw new Error(
      "Trying to render reaction badge for non-existing reaction"
    );
  const [l, c] = (0, import_react3.useState)([]), d = Ie(o, l);
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Badge.Root,
    {
      className: Q("bn-badge", "bn-comment-reaction"),
      text: r.userIds.length.toString(),
      icon: r.emoji,
      isSelected: o.comments.threadStore.auth.canDeleteReaction(
        e.comment,
        r.emoji
      ),
      onClick: () => e.onReactionSelect(r.emoji),
      onMouseEnter: () => c(r.userIds),
      mainTooltip: n.comments.reactions.reacted_by,
      secondaryTooltip: `${Array.from(d.values()).map((s) => s.username).join(`
`)}`
    },
    r.emoji
  );
};
var Lo = ({
  comment: e,
  thread: t,
  showResolveButton: n
}) => {
  const o = M(), r = de(
    {
      initialContent: e.body,
      trailingBlock: false,
      dictionary: {
        ...o,
        placeholders: {
          emptyDocument: o.placeholders.edit_comment
        }
      },
      schema: Ee2,
      sideMenuDetection: "editor"
    },
    [e.body]
  ), l = C(), [c, d] = (0, import_react3.useState)(false), s = b();
  if (!s.comments)
    throw new Error("Comments plugin not found");
  const a = s.comments.threadStore, u = (0, import_react3.useCallback)(() => {
    d(true);
  }, []), m = (0, import_react3.useCallback)(() => {
    r.replaceBlocks(r.document, e.body), d(false);
  }, [r, e.body]), h = (0, import_react3.useCallback)(
    async (E) => {
      await a.updateComment({
        commentId: e.id,
        comment: {
          body: r.document
        },
        threadId: t.id
      }), d(false);
    },
    [e, t.id, r, a]
  ), f = (0, import_react3.useCallback)(async () => {
    await a.deleteComment({
      commentId: e.id,
      threadId: t.id
    });
  }, [e, t.id, a]), H = (0, import_react3.useCallback)(
    async (E) => {
      a.auth.canAddReaction(e, E) ? await a.addReaction({
        threadId: t.id,
        commentId: e.id,
        emoji: E
      }) : a.auth.canDeleteReaction(e, E) && await a.deleteReaction({
        threadId: t.id,
        commentId: e.id,
        emoji: E
      });
    },
    [a, e, t.id]
  ), p = (0, import_react3.useCallback)(async () => {
    await a.resolveThread({
      threadId: t.id
    });
  }, [t.id, a]), V = (0, import_react3.useCallback)(async () => {
    await a.unresolveThread({
      threadId: t.id
    });
  }, [t.id, a]), B = So(s, e.userId);
  if (!e.body)
    return null;
  let S;
  const I = a.auth.canAddReaction(e), z2 = a.auth.canDeleteComment(e), j = a.auth.canUpdateComment(e), Z = n && (t.resolved ? a.auth.canUnresolveThread(t) : a.auth.canResolveThread(t));
  c || (S = (0, import_jsx_runtime.jsxs)(
    l.Generic.Toolbar.Root,
    {
      className: Q("bn-action-toolbar", "bn-comment-actions"),
      variant: "action-toolbar",
      children: [
        I && (0, import_jsx_runtime.jsx)(
          $e,
          {
            onEmojiSelect: (E) => H(E.native),
            children: (0, import_jsx_runtime.jsx)(
              l.Generic.Toolbar.Button,
              {
                mainTooltip: o.comments.actions.add_reaction,
                variant: "compact",
                children: (0, import_jsx_runtime.jsx)(We, { size: 16 })
              },
              "add-reaction"
            )
          }
        ),
        Z && (t.resolved ? (0, import_jsx_runtime.jsx)(
          l.Generic.Toolbar.Button,
          {
            mainTooltip: "Re-open",
            variant: "compact",
            onClick: V,
            children: (0, import_jsx_runtime.jsx)(Kn, { size: 16 })
          },
          "reopen"
        ) : (0, import_jsx_runtime.jsx)(
          l.Generic.Toolbar.Button,
          {
            mainTooltip: o.comments.actions.resolve,
            variant: "compact",
            onClick: p,
            children: (0, import_jsx_runtime.jsx)(ko, { size: 16 })
          },
          "resolve"
        )),
        (z2 || j) && (0, import_jsx_runtime.jsxs)(l.Generic.Menu.Root, { position: "bottom-start", children: [
          (0, import_jsx_runtime.jsx)(l.Generic.Menu.Trigger, { children: (0, import_jsx_runtime.jsx)(
            l.Generic.Toolbar.Button,
            {
              mainTooltip: o.comments.actions.more_actions,
              variant: "compact",
              children: (0, import_jsx_runtime.jsx)(xo, { size: 16 })
            },
            "more-actions"
          ) }),
          (0, import_jsx_runtime.jsxs)(l.Generic.Menu.Dropdown, { className: "bn-menu-dropdown", children: [
            j && (0, import_jsx_runtime.jsx)(
              l.Generic.Menu.Item,
              {
                icon: (0, import_jsx_runtime.jsx)(Xn, {}),
                onClick: u,
                children: o.comments.actions.edit_comment
              },
              "edit-comment"
            ),
            z2 && (0, import_jsx_runtime.jsx)(
              l.Generic.Menu.Item,
              {
                icon: (0, import_jsx_runtime.jsx)(vo, {}),
                onClick: f,
                children: o.comments.actions.delete_comment
              },
              "delete-comment"
            )
          ] })
        ] })
      ]
    }
  ));
  const $ = e.createdAt.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric"
  });
  if (!e.body)
    throw new Error("soft deletes are not yet supported");
  return (0, import_jsx_runtime.jsx)(
    l.Comments.Comment,
    {
      authorInfo: B ?? "loading",
      timeString: $,
      edited: e.updatedAt.getTime() !== e.createdAt.getTime(),
      showActions: "hover",
      actions: S,
      className: "bn-thread-comment",
      children: (0, import_jsx_runtime.jsx)(
        Le,
        {
          autoFocus: c,
          editor: r,
          editable: c,
          actions: e.reactions.length > 0 || c ? ({ isEmpty: E }) => (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            e.reactions.length > 0 && !c && (0, import_jsx_runtime.jsxs)(
              l.Generic.Badge.Group,
              {
                className: Q(
                  "bn-badge-group",
                  "bn-comment-reactions"
                ),
                children: [
                  e.reactions.map((F) => (0, import_jsx_runtime.jsx)(
                    To,
                    {
                      comment: e,
                      emoji: F.emoji,
                      onReactionSelect: H
                    },
                    F.emoji
                  )),
                  (0, import_jsx_runtime.jsx)(
                    $e,
                    {
                      onEmojiSelect: (F) => H(F.native),
                      children: (0, import_jsx_runtime.jsx)(
                        l.Generic.Badge.Root,
                        {
                          className: Q(
                            "bn-badge",
                            "bn-comment-add-reaction"
                          ),
                          text: "+",
                          icon: (0, import_jsx_runtime.jsx)(We, { size: 16 }),
                          mainTooltip: o.comments.actions.add_reaction
                        }
                      )
                    }
                  )
                ]
              }
            ),
            c && (0, import_jsx_runtime.jsxs)(
              l.Generic.Toolbar.Root,
              {
                variant: "action-toolbar",
                className: Q(
                  "bn-action-toolbar",
                  "bn-comment-actions"
                ),
                children: [
                  (0, import_jsx_runtime.jsx)(
                    l.Generic.Toolbar.Button,
                    {
                      mainTooltip: "Save",
                      variant: "compact",
                      onClick: h,
                      isDisabled: E,
                      children: "Save"
                    }
                  ),
                  (0, import_jsx_runtime.jsx)(
                    l.Generic.Toolbar.Button,
                    {
                      className: "bn-button",
                      mainTooltip: "Cancel",
                      variant: "compact",
                      onClick: m,
                      children: "Cancel"
                    }
                  )
                ]
              }
            )
          ] }) : void 0
        }
      )
    }
  );
};
var Eo = ({
  thread: e,
  maxCommentsBeforeCollapse: t
}) => {
  const n = C(), o = M(), r = b(), l = Ie(r, e.resolvedBy ? [e.resolvedBy] : []), c = e.comments.map((d, s) => (0, import_jsx_runtime.jsx)(
    Lo,
    {
      thread: e,
      comment: d,
      showResolveButton: s === 0
    },
    d.id
  ));
  if (e.resolved && e.resolvedUpdatedAt && e.resolvedBy) {
    if (!l.get(e.resolvedBy))
      throw new Error(
        `User ${e.resolvedBy} resolved thread ${e.id}, but their data could not be found.`
      );
    const s = e.comments.findLastIndex(
      (a) => e.resolvedUpdatedAt.getTime() > a.createdAt.getTime()
    ) + 1;
    c.splice(
      s,
      0,
      (0, import_jsx_runtime.jsx)(
        n.Comments.Comment,
        {
          className: "bn-thread-comment",
          authorInfo: e.resolvedBy && l.get(e.resolvedBy) || "loading",
          timeString: e.resolvedUpdatedAt.toLocaleDateString(void 0, {
            month: "short",
            day: "numeric"
          }),
          edited: false,
          showActions: false,
          children: (0, import_jsx_runtime.jsx)("div", { className: "bn-resolved-text", children: o.comments.sidebar.marked_as_resolved })
        },
        "resolved-comment"
      )
    );
  }
  return t && c.length > t && c.splice(
    1,
    c.length - 2,
    (0, import_jsx_runtime.jsx)(
      n.Comments.ExpandSectionsPrompt,
      {
        className: "bn-thread-expand-prompt",
        children: o.comments.sidebar.more_replies(e.comments.length - 2)
      },
      "expand-prompt"
    )
  ), c;
};
var xt = ({
  thread: e,
  selected: t,
  referenceText: n,
  maxCommentsBeforeCollapse: o,
  onFocus: r,
  onBlur: l,
  tabIndex: c
}) => {
  const d = C(), s = M(), u = b().comments;
  if (!u)
    throw new Error("Comments plugin not found");
  const m = de({
    trailingBlock: false,
    dictionary: {
      ...s,
      placeholders: {
        emptyDocument: s.placeholders.comment_reply
      }
    },
    schema: Ee2,
    sideMenuDetection: "editor"
  }), h = (0, import_react3.useCallback)(async () => {
    await u.threadStore.addComment({
      comment: {
        body: m.document
      },
      threadId: e.id
    }), m.removeBlocks(m.document);
  }, [u, m, e.id]);
  return (0, import_jsx_runtime.jsxs)(
    d.Comments.Card,
    {
      className: "bn-thread",
      headerText: n,
      onFocus: r,
      onBlur: l,
      selected: t,
      tabIndex: c,
      children: [
        (0, import_jsx_runtime.jsx)(d.Comments.CardSection, { className: "bn-thread-comments", children: (0, import_jsx_runtime.jsx)(
          Eo,
          {
            thread: e,
            maxCommentsBeforeCollapse: t ? void 0 : o || 5
          }
        ) }),
        t && (0, import_jsx_runtime.jsx)(d.Comments.CardSection, { className: "bn-thread-composer", children: (0, import_jsx_runtime.jsx)(
          Le,
          {
            autoFocus: false,
            editable: true,
            editor: m,
            actions: ({ isEmpty: f }) => f ? null : (0, import_jsx_runtime.jsx)(
              d.Generic.Toolbar.Root,
              {
                variant: "action-toolbar",
                className: Q(
                  "bn-action-toolbar",
                  "bn-comment-actions"
                ),
                children: (0, import_jsx_runtime.jsx)(
                  d.Generic.Toolbar.Button,
                  {
                    mainTooltip: "Save",
                    variant: "compact",
                    isDisabled: f,
                    onClick: h,
                    children: "Save"
                  }
                )
              }
            )
          }
        ) })
      ]
    }
  );
};
function yt(e) {
  const t = e.comments;
  if (!t)
    throw new Error("Comments plugin not found");
  const n = t.threadStore, o = (0, import_react3.useRef)();
  o.current || (o.current = n.getThreads());
  const r = (0, import_react3.useCallback)(
    (l) => n.subscribe((c) => {
      o.current = c, l();
    }),
    [n]
  );
  return (0, import_react3.useSyncExternalStore)(r, () => o.current);
}
var Ro = (e) => {
  const t = b();
  if (!t.comments)
    throw new Error(
      "FloatingComposerController can only be used when BlockNote editor has enabled comments"
    );
  const n = O(
    t.comments.onUpdate.bind(t.comments)
  ), { isMounted: o, ref: r, style: l, getFloatingProps: c, setReference: d } = G2(!!(n != null && n.selectedThreadId), null, 5e3, {
    placement: "bottom",
    middleware: [offset(10), shift(), flip()],
    onOpenChange: (m) => {
      var h;
      m || ((h = t.comments) == null || h.selectThread(void 0), t.focus());
    },
    ...e.floatingOptions
  }), s = (0, import_react3.useCallback)(() => {
    var h;
    if (!(n != null && n.selectedThreadId))
      return;
    const m = (h = t.domElement) == null ? void 0 : h.querySelector(
      `[data-bn-thread-id="${n == null ? void 0 : n.selectedThreadId}"]`
    );
    m && d(m);
  }, [d, t, n == null ? void 0 : n.selectedThreadId]);
  (0, import_react3.useEffect)(() => {
    if (n != null && n.selectedThreadId)
      return t.onChange(() => {
        s();
      });
  }, [t, s, n == null ? void 0 : n.selectedThreadId]), (0, import_react3.useLayoutEffect)(s, [s]);
  const a = yt(t);
  if (!o || !n || !n.selectedThreadId)
    return null;
  const u = e.floatingThread || xt;
  return (0, import_jsx_runtime.jsx)("div", { ref: r, style: l, ...c(), children: (0, import_jsx_runtime.jsx)(
    u,
    {
      thread: a.get(n.selectedThreadId),
      selected: true
    }
  ) });
};
var _o = (e) => {
  const t = C(), n = M(), { block: o } = e, r = b(), [l, c] = (0, import_react3.useState)(""), d = (0, import_react3.useCallback)(
    (u) => {
      c(u.currentTarget.value);
    },
    []
  ), s = (0, import_react3.useCallback)(
    (u) => {
      u.key === "Enter" && (u.preventDefault(), r.updateBlock(o, {
        props: {
          name: wc(l),
          url: l
        }
      }));
    },
    [r, o, l]
  ), a = (0, import_react3.useCallback)(() => {
    r.updateBlock(o, {
      props: {
        name: wc(l),
        url: l
      }
    });
  }, [r, o, l]);
  return (0, import_jsx_runtime.jsxs)(t.FilePanel.TabPanel, { className: "bn-tab-panel", children: [
    (0, import_jsx_runtime.jsx)(
      t.FilePanel.TextInput,
      {
        className: "bn-text-input",
        placeholder: n.file_panel.embed.url_placeholder,
        value: l,
        onChange: d,
        onKeyDown: s,
        "data-test": "embed-input"
      }
    ),
    (0, import_jsx_runtime.jsx)(
      t.FilePanel.Button,
      {
        className: "bn-button",
        onClick: a,
        "data-test": "embed-input-button",
        children: n.file_panel.embed.embed_button[o.type] || n.file_panel.embed.embed_button.file
      }
    )
  ] });
};
var Io = (e) => {
  var m;
  const t = C(), n = M(), { block: o, setLoading: r } = e, l = b(), [c, d] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    c && setTimeout(() => {
      d(false);
    }, 3e3);
  }, [c]);
  const s = (0, import_react3.useCallback)(
    (h) => {
      if (h === null)
        return;
      async function f(H) {
        if (r(true), l.uploadFile !== void 0)
          try {
            let p = await l.uploadFile(H, o.id);
            typeof p == "string" && (p = {
              props: {
                name: H.name,
                url: p
              }
            }), l.updateBlock(o, p);
          } catch {
            d(true);
          } finally {
            r(false);
          }
      }
      f(h);
    },
    [o, l, r]
  ), a = l.schema.blockSchema[o.type], u = a.isFileBlock && ((m = a.fileBlockAccept) != null && m.length) ? a.fileBlockAccept.join(",") : "*/*";
  return (0, import_jsx_runtime.jsxs)(t.FilePanel.TabPanel, { className: "bn-tab-panel", children: [
    (0, import_jsx_runtime.jsx)(
      t.FilePanel.FileInput,
      {
        className: "bn-file-input",
        "data-test": "upload-input",
        accept: u,
        placeholder: n.file_panel.upload.file_placeholder[o.type] || n.file_panel.upload.file_placeholder.file,
        value: null,
        onChange: s
      }
    ),
    c && (0, import_jsx_runtime.jsx)("div", { className: "bn-error-text", children: n.file_panel.upload.upload_error })
  ] });
};
var Bt = (e) => {
  const t = C(), n = M(), o = b(), [r, l] = (0, import_react3.useState)(false), c = e.tabs ?? [
    ...o.uploadFile !== void 0 ? [
      {
        name: n.file_panel.upload.title,
        tabPanel: (0, import_jsx_runtime.jsx)(Io, { block: e.block, setLoading: l })
      }
    ] : [],
    {
      name: n.file_panel.embed.title,
      tabPanel: (0, import_jsx_runtime.jsx)(_o, { block: e.block })
    }
  ], [d, s] = (0, import_react3.useState)(
    e.defaultOpenTab || c[0].name
  );
  return (0, import_jsx_runtime.jsx)(
    t.FilePanel.Root,
    {
      className: "bn-panel",
      defaultOpenTab: d,
      openTab: d,
      setOpenTab: s,
      tabs: c,
      loading: r
    }
  );
};
var No = (e) => {
  const t = b();
  if (!t.filePanel)
    throw new Error(
      "FileToolbarController can only be used when BlockNote editor schema contains file block"
    );
  const n = O(
    t.filePanel.onUpdate.bind(t.filePanel)
  ), { isMounted: o, ref: r, style: l, getFloatingProps: c } = G2(
    (n == null ? void 0 : n.show) || false,
    (n == null ? void 0 : n.referencePos) || null,
    5e3,
    {
      placement: "bottom",
      middleware: [offset(10), flip()],
      onOpenChange: (m) => {
        m || (t.filePanel.closeMenu(), t.focus());
      },
      ...e.floatingOptions
    }
  );
  if (!o || !n)
    return null;
  const { show: d, referencePos: s, ...a } = n, u = e.filePanel || Bt;
  return (0, import_jsx_runtime.jsx)("div", { ref: r, style: l, ...c(), children: (0, import_jsx_runtime.jsx)(u, { ...a }) });
};
function U(e, t) {
  ue(e, t), se(e, t);
}
function Po(e) {
  return (t) => {
    e.forEach((n) => {
      typeof n == "function" ? n(t) : n != null && (n.current = t);
    });
  };
}
function _2(e) {
  const t = D();
  if (e || (e = t == null ? void 0 : t.editor), !e)
    throw new Error(
      "'editor' is required, either from BlockNoteContext or as a function argument"
    );
  const n = e, [o, r] = (0, import_react3.useState)(() => {
    var l;
    return ((l = n.getSelection()) == null ? void 0 : l.blocks) || [n.getTextCursorPosition().block];
  });
  return U(
    () => {
      var l;
      return r(
        ((l = n.getSelection()) == null ? void 0 : l.blocks) || [n.getTextCursorPosition().block]
      );
    },
    n
  ), o;
}
var Oo = {
  bold: no,
  italic: lo,
  underline: ho,
  strike: uo,
  code: Yn
};
function Do(e, t) {
  return e in t.schema.styleSchema && t.schema.styleSchema[e].type === e && t.schema.styleSchema[e].propSchema === "boolean";
}
var ne = (e) => {
  const t = M(), n = C(), o = b(), r = Do(
    e.basicTextStyle,
    o
  ), l = _2(o), [c, d] = (0, import_react3.useState)(
    e.basicTextStyle in o.getActiveStyles()
  );
  U(() => {
    r && d(e.basicTextStyle in o.getActiveStyles());
  }, o);
  const s = (m) => {
    if (o.focus(), !!r) {
      if (o.schema.styleSchema[m].propSchema !== "boolean")
        throw new Error("can only toggle boolean styles");
      o.toggleStyles({ [m]: true });
    }
  };
  if (!(0, import_react3.useMemo)(() => r ? !!l.find((m) => m.content !== void 0) : false, [r, l]) || !o.isEditable)
    return null;
  const u = Oo[e.basicTextStyle];
  return (0, import_jsx_runtime.jsx)(
    n.FormattingToolbar.Button,
    {
      className: "bn-button",
      "data-test": e.basicTextStyle,
      onClick: () => s(e.basicTextStyle),
      isSelected: c,
      label: t.formatting_toolbar[e.basicTextStyle].tooltip,
      mainTooltip: t.formatting_toolbar[e.basicTextStyle].tooltip,
      secondaryTooltip: J(
        t.formatting_toolbar[e.basicTextStyle].secondary_tooltip,
        t.generic.ctrl_shortcut
      ),
      icon: (0, import_jsx_runtime.jsx)(u, {})
    }
  );
};
var we = (e) => {
  const t = e.textColor || "default", n = e.backgroundColor || "default", o = e.size || 16, r = (0, import_react3.useMemo)(
    () => ({
      pointerEvents: "none",
      fontSize: (o * 0.75).toString() + "px",
      height: o.toString() + "px",
      lineHeight: o.toString() + "px",
      textAlign: "center",
      width: o.toString() + "px"
    }),
    [o]
  );
  return (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "bn-color-icon",
      "data-background-color": n,
      "data-text-color": t,
      style: r,
      children: "A"
    }
  );
};
var qe = [
  "default",
  "gray",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink"
];
var me = (e) => {
  const t = C(), n = M();
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(() => e.text ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      (0, import_jsx_runtime.jsx)(t.Generic.Menu.Label, { children: n.color_picker.text_title }),
      qe.map((l) => (0, import_jsx_runtime.jsx)(
        t.Generic.Menu.Item,
        {
          onClick: () => {
            e.onClick && e.onClick(), e.text.setColor(l);
          },
          "data-test": "text-color-" + l,
          icon: (0, import_jsx_runtime.jsx)(we, { textColor: l, size: e.iconSize }),
          checked: e.text.color === l,
          children: n.color_picker.colors[l]
        },
        "text-color-" + l
      ))
    ] }) : null, {}),
    (0, import_jsx_runtime.jsx)(() => e.background ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      (0, import_jsx_runtime.jsx)(t.Generic.Menu.Label, { children: n.color_picker.background_title }),
      qe.map((l) => (0, import_jsx_runtime.jsx)(
        t.Generic.Menu.Item,
        {
          onClick: () => {
            e.onClick && e.onClick(), e.background.setColor(l);
          },
          "data-test": "background-color-" + l,
          icon: (0, import_jsx_runtime.jsx)(we, { backgroundColor: l, size: e.iconSize }),
          checked: e.background.color === l,
          children: n.color_picker.colors[l]
        },
        "background-color-" + l
      ))
    ] }) : null, {})
  ] });
};
function Ke(e, t) {
  return `${e}Color` in t.schema.styleSchema && t.schema.styleSchema[`${e}Color`].type === `${e}Color` && t.schema.styleSchema[`${e}Color`].propSchema === "string";
}
var Zo2 = () => {
  const e = C(), t = M(), n = b(), o = Ke("text", n), r = Ke("background", n), l = _2(n), [c, d] = (0, import_react3.useState)(
    o && n.getActiveStyles().textColor || "default"
  ), [s, a] = (0, import_react3.useState)(
    r && n.getActiveStyles().backgroundColor || "default"
  );
  U(() => {
    o && d(n.getActiveStyles().textColor || "default"), r && a(
      n.getActiveStyles().backgroundColor || "default"
    );
  }, n);
  const u = (0, import_react3.useCallback)(
    (f) => {
      if (!o)
        throw Error(
          "Tried to set text color, but style does not exist in editor schema."
        );
      f === "default" ? n.removeStyles({ textColor: f }) : n.addStyles({ textColor: f }), setTimeout(() => {
        n.focus();
      });
    },
    [n, o]
  ), m = (0, import_react3.useCallback)(
    (f) => {
      if (!r)
        throw Error(
          "Tried to set background color, but style does not exist in editor schema."
        );
      f === "default" ? n.removeStyles({ backgroundColor: f }) : n.addStyles({ backgroundColor: f }), setTimeout(() => {
        n.focus();
      });
    },
    [r, n]
  );
  return !(0, import_react3.useMemo)(() => {
    if (!o && !r)
      return false;
    for (const f of l)
      if (f.content !== void 0)
        return true;
    return false;
  }, [r, l, o]) || !n.isEditable ? null : (0, import_jsx_runtime.jsxs)(e.Generic.Menu.Root, { children: [
    (0, import_jsx_runtime.jsx)(e.Generic.Menu.Trigger, { children: (0, import_jsx_runtime.jsx)(
      e.FormattingToolbar.Button,
      {
        className: "bn-button",
        "data-test": "colors",
        label: t.formatting_toolbar.colors.tooltip,
        mainTooltip: t.formatting_toolbar.colors.tooltip,
        icon: (0, import_jsx_runtime.jsx)(
          we,
          {
            textColor: c,
            backgroundColor: s,
            size: 20
          }
        )
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      e.Generic.Menu.Dropdown,
      {
        className: "bn-menu-dropdown bn-color-picker-dropdown",
        children: (0, import_jsx_runtime.jsx)(
          me,
          {
            text: o ? {
              color: c,
              setColor: u
            } : void 0,
            background: r ? {
              color: s,
              setColor: m
            } : void 0
          }
        )
      }
    )
  ] });
};
var Xe = (e) => {
  for (const t of ra)
    if (e.startsWith(t))
      return e;
  return `${sa}://${e}`;
};
var Vt2 = (e) => {
  const t = C(), n = M(), { url: o, text: r, editLink: l, showTextField: c } = e, [d, s] = (0, import_react3.useState)(o), [a, u] = (0, import_react3.useState)(r);
  (0, import_react3.useEffect)(() => {
    s(o), u(r);
  }, [r, o]);
  const m = (0, import_react3.useCallback)(
    (p) => {
      p.key === "Enter" && (p.preventDefault(), l(Xe(d), a));
    },
    [l, d, a]
  ), h = (0, import_react3.useCallback)(
    (p) => s(p.currentTarget.value),
    []
  ), f = (0, import_react3.useCallback)(
    (p) => u(p.currentTarget.value),
    []
  ), H = (0, import_react3.useCallback)(
    () => l(Xe(d), a),
    [l, d, a]
  );
  return (0, import_jsx_runtime.jsxs)(t.Generic.Form.Root, { children: [
    (0, import_jsx_runtime.jsx)(
      t.Generic.Form.TextInput,
      {
        className: "bn-text-input",
        name: "url",
        icon: (0, import_jsx_runtime.jsx)(Ct, {}),
        autoFocus: true,
        placeholder: n.link_toolbar.form.url_placeholder,
        value: d,
        onKeyDown: m,
        onChange: h,
        onSubmit: H
      }
    ),
    c !== false && (0, import_jsx_runtime.jsx)(
      t.Generic.Form.TextInput,
      {
        className: "bn-text-input",
        name: "title",
        icon: (0, import_jsx_runtime.jsx)(_e, {}),
        placeholder: n.link_toolbar.form.title_placeholder,
        value: a,
        onKeyDown: m,
        onChange: f,
        onSubmit: H
      }
    )
  ] });
};
function Fo(e) {
  return "link" in e.schema.inlineContentSchema && e.schema.inlineContentSchema.link === "link";
}
var Ao = () => {
  var H;
  const e = b(), t = C(), n = M(), o = Fo(e), r = _2(e), [l, c] = (0, import_react3.useState)(false), [d, s] = (0, import_react3.useState)(e.getSelectedLinkUrl() || ""), [a, u] = (0, import_react3.useState)(e.getSelectedText());
  U(() => {
    u(e.getSelectedText() || ""), s(e.getSelectedLinkUrl() || "");
  }, e), (0, import_react3.useEffect)(() => {
    var V;
    const p = (B) => {
      (B.ctrlKey || B.metaKey) && B.key === "k" && (c(true), B.preventDefault());
    };
    return (V = e.prosemirrorView) == null || V.dom.addEventListener("keydown", p), () => {
      var B;
      (B = e.prosemirrorView) == null || B.dom.removeEventListener("keydown", p);
    };
  }, [(H = e.prosemirrorView) == null ? void 0 : H.dom]);
  const m = (0, import_react3.useCallback)(
    (p) => {
      e.createLink(p), e.focus();
    },
    [e]
  ), h = e.transact(
    (p) => Vt(p.selection)
  );
  return !(0, import_react3.useMemo)(() => {
    if (!o)
      return false;
    for (const p of r)
      if (p.content === void 0)
        return false;
    return !h;
  }, [o, r, h]) || !("link" in e.schema.inlineContentSchema) || !e.isEditable ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Popover.Root, { opened: l, children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      t.FormattingToolbar.Button,
      {
        className: "bn-button",
        "data-test": "createLink",
        label: n.formatting_toolbar.link.tooltip,
        mainTooltip: n.formatting_toolbar.link.tooltip,
        secondaryTooltip: J(
          n.formatting_toolbar.link.secondary_tooltip,
          n.generic.ctrl_shortcut
        ),
        icon: (0, import_jsx_runtime.jsx)(Ct, {}),
        onClick: () => c(true)
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Popover.Content,
      {
        className: "bn-popover-content bn-form-popover",
        variant: "form-popover",
        children: (0, import_jsx_runtime.jsx)(
          Vt2,
          {
            url: d,
            text: a,
            editLink: m,
            showTextField: false
          }
        )
      }
    )
  ] });
};
var Go = () => {
  const e = M(), t = C(), n = b(), [o, r] = (0, import_react3.useState)(), l = _2(n), c = (0, import_react3.useMemo)(() => {
    if (l.length !== 1)
      return;
    const a = l[0];
    if (Bc(a, n))
      return r(a.props.caption), a;
  }, [n, l]), d = (0, import_react3.useCallback)(
    (a) => {
      c && a.key === "Enter" && (a.preventDefault(), n.updateBlock(c, {
        props: {
          caption: o
          // TODO
        }
      }));
    },
    [o, n, c]
  ), s = (0, import_react3.useCallback)(
    (a) => r(a.currentTarget.value),
    []
  );
  return !c || xc(c, n) || !n.isEditable ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Popover.Root, { children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      t.FormattingToolbar.Button,
      {
        className: "bn-button",
        label: e.formatting_toolbar.file_caption.tooltip,
        mainTooltip: e.formatting_toolbar.file_caption.tooltip,
        icon: (0, import_jsx_runtime.jsx)(je, {}),
        isSelected: c.props.caption !== ""
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Popover.Content,
      {
        className: "bn-popover-content bn-form-popover",
        variant: "form-popover",
        children: (0, import_jsx_runtime.jsx)(t.Generic.Form.Root, { children: (0, import_jsx_runtime.jsx)(
          t.Generic.Form.TextInput,
          {
            name: "file-caption",
            icon: (0, import_jsx_runtime.jsx)(je, {}),
            value: o || "",
            autoFocus: true,
            placeholder: e.formatting_toolbar.file_caption.input_placeholder,
            onKeyDown: d,
            onChange: s
          }
        ) })
      }
    )
  ] });
};
var Uo = () => {
  const e = M(), t = C(), n = b(), o = _2(n), r = (0, import_react3.useMemo)(() => {
    if (o.length !== 1)
      return;
    const c = o[0];
    if (Bc(c, n))
      return c;
  }, [n, o]), l = (0, import_react3.useCallback)(() => {
    n.focus(), n.removeBlocks([r]);
  }, [n, r]);
  return !r || xc(r, n) || !n.isEditable ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      label: e.formatting_toolbar.file_delete.tooltip[r.type] || e.formatting_toolbar.file_delete.tooltip.file,
      mainTooltip: e.formatting_toolbar.file_delete.tooltip[r.type] || e.formatting_toolbar.file_delete.tooltip.file,
      icon: (0, import_jsx_runtime.jsx)(wo, {}),
      onClick: l
    }
  );
};
var zo = () => {
  const e = M(), t = C(), n = b(), [o, r] = (0, import_react3.useState)(), l = _2(n), c = (0, import_react3.useMemo)(() => {
    if (l.length !== 1)
      return;
    const a = l[0];
    if (Bc(a, n))
      return r(a.props.name), a;
  }, [n, l]), d = (0, import_react3.useCallback)(
    (a) => {
      c && a.key === "Enter" && (a.preventDefault(), n.updateBlock(c, {
        props: {
          name: o
          // TODO
        }
      }));
    },
    [o, n, c]
  ), s = (0, import_react3.useCallback)(
    (a) => r(a.currentTarget.value),
    []
  );
  return !c || xc(c, n) || !n.isEditable ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Popover.Root, { children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      t.FormattingToolbar.Button,
      {
        className: "bn-button",
        label: e.formatting_toolbar.file_rename.tooltip[c.type] || e.formatting_toolbar.file_rename.tooltip.file,
        mainTooltip: e.formatting_toolbar.file_rename.tooltip[c.type] || e.formatting_toolbar.file_rename.tooltip.file,
        icon: (0, import_jsx_runtime.jsx)(ze, {})
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Popover.Content,
      {
        className: "bn-popover-content bn-form-popover",
        variant: "form-popover",
        children: (0, import_jsx_runtime.jsx)(t.Generic.Form.Root, { children: (0, import_jsx_runtime.jsx)(
          t.Generic.Form.TextInput,
          {
            name: "file-name",
            icon: (0, import_jsx_runtime.jsx)(ze, {}),
            value: o || "",
            autoFocus: true,
            placeholder: e.formatting_toolbar.file_rename.input_placeholder[c.type] || e.formatting_toolbar.file_rename.input_placeholder.file,
            onKeyDown: d,
            onChange: s
          }
        ) })
      }
    )
  ] });
};
var jo = () => {
  const e = M(), t = C(), n = b(), o = _2(n), [r, l] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    l(false);
  }, [o]);
  const c = o.length === 1 ? o[0] : void 0;
  return c === void 0 || !Bc(c, n) || !n.isEditable ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Popover.Root, { opened: r, position: "bottom", children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      t.FormattingToolbar.Button,
      {
        className: "bn-button",
        onClick: () => l(!r),
        isSelected: r,
        mainTooltip: e.formatting_toolbar.file_replace.tooltip[c.type] || e.formatting_toolbar.file_replace.tooltip.file,
        label: e.formatting_toolbar.file_replace.tooltip[c.type] || e.formatting_toolbar.file_replace.tooltip.file,
        icon: (0, import_jsx_runtime.jsx)(bo, {})
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Popover.Content,
      {
        className: "bn-popover-content bn-panel-popover",
        variant: "panel-popover",
        children: (0, import_jsx_runtime.jsx)(Bt, { block: c })
      }
    )
  ] });
};
var Wo = () => {
  const e = M(), t = C(), n = b(), o = _2(n), [r, l] = (0, import_react3.useState)(
    () => n.canNestBlock()
  );
  U(() => {
    l(n.canNestBlock());
  }, n);
  const c = (0, import_react3.useCallback)(() => {
    n.focus(), n.nestBlock();
  }, [n]);
  return !(0, import_react3.useMemo)(() => !o.find(
    (s) => n.schema.blockSchema[s.type].content !== "inline"
  ), [n.schema.blockSchema, o]) || !n.isEditable ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      "data-test": "nestBlock",
      onClick: c,
      isDisabled: !r,
      label: e.formatting_toolbar.nest.tooltip,
      mainTooltip: e.formatting_toolbar.nest.tooltip,
      secondaryTooltip: J(
        e.formatting_toolbar.nest.secondary_tooltip,
        e.generic.ctrl_shortcut
      ),
      icon: (0, import_jsx_runtime.jsx)(io, {})
    }
  );
};
var $o = () => {
  const e = M(), t = C(), n = b(), o = _2(n), [r, l] = (0, import_react3.useState)(
    () => n.canUnnestBlock()
  );
  U(() => {
    l(n.canUnnestBlock());
  }, n);
  const c = (0, import_react3.useCallback)(() => {
    n.focus(), n.unnestBlock();
  }, [n]);
  return !(0, import_react3.useMemo)(() => !o.find(
    (s) => n.schema.blockSchema[s.type].content !== "inline"
  ), [n.schema.blockSchema, o]) || !n.isEditable ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      "data-test": "unnestBlock",
      onClick: c,
      isDisabled: !r,
      label: e.formatting_toolbar.unnest.tooltip,
      mainTooltip: e.formatting_toolbar.unnest.tooltip,
      secondaryTooltip: J(
        e.formatting_toolbar.unnest.secondary_tooltip,
        e.generic.ctrl_shortcut
      ),
      icon: (0, import_jsx_runtime.jsx)(ro, {})
    }
  );
};
var qo = (e) => [
  {
    name: e.slash_menu.paragraph.title,
    type: "paragraph",
    icon: _e,
    isSelected: (t) => t.type === "paragraph"
  },
  {
    name: e.slash_menu.heading.title,
    type: "heading",
    props: { level: 1 },
    icon: ft2,
    isSelected: (t) => t.type === "heading" && "level" in t.props && t.props.level === 1
  },
  {
    name: e.slash_menu.heading_2.title,
    type: "heading",
    props: { level: 2 },
    icon: gt,
    isSelected: (t) => t.type === "heading" && "level" in t.props && t.props.level === 2
  },
  {
    name: e.slash_menu.heading_3.title,
    type: "heading",
    props: { level: 3 },
    icon: bt,
    isSelected: (t) => t.type === "heading" && "level" in t.props && t.props.level === 3
  },
  {
    name: e.slash_menu.quote.title,
    type: "quote",
    icon: vt,
    isSelected: (t) => t.type === "quote"
  },
  {
    name: e.slash_menu.bullet_list.title,
    type: "bulletListItem",
    icon: wt,
    isSelected: (t) => t.type === "bulletListItem"
  },
  {
    name: e.slash_menu.numbered_list.title,
    type: "numberedListItem",
    icon: kt,
    isSelected: (t) => t.type === "numberedListItem"
  },
  {
    name: e.slash_menu.check_list.title,
    type: "checkListItem",
    icon: pt,
    isSelected: (t) => t.type === "checkListItem"
  }
];
var Ko = (e) => {
  const t = C(), n = M(), o = b(), r = _2(o), [l, c] = (0, import_react3.useState)(o.getTextCursorPosition().block), d = (0, import_react3.useMemo)(() => (e.items || qo(n)).filter(
    (u) => u.type in o.schema.blockSchema
  ), [o, n, e.items]), s = (0, import_react3.useMemo)(
    () => d.find((u) => u.type === l.type) !== void 0,
    [l.type, d]
  ), a = (0, import_react3.useMemo)(() => {
    const u = (m) => {
      o.focus(), o.transact(() => {
        for (const h of r)
          o.updateBlock(h, {
            type: m.type,
            props: m.props
          });
      });
    };
    return d.map((m) => {
      const h = m.icon;
      return {
        text: m.name,
        icon: (0, import_jsx_runtime.jsx)(h, { size: 16 }),
        onClick: () => u(m),
        isSelected: m.isSelected(l)
      };
    });
  }, [l, d, o, r]);
  return U(() => {
    c(o.getTextCursorPosition().block);
  }, o), !s || !o.isEditable ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Select,
    {
      className: "bn-select",
      items: a
    }
  );
};
var Xo = () => {
  const e = M(), t = C(), n = b(), o = (0, import_react3.useCallback)(() => {
    var r;
    (r = n.comments) == null || r.startPendingComment(), n.formattingToolbar.closeMenu();
  }, [n]);
  return n.comments ? (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      label: e.formatting_toolbar.comment.tooltip,
      mainTooltip: e.formatting_toolbar.comment.tooltip,
      icon: (0, import_jsx_runtime.jsx)(ht, {}),
      onClick: o
    }
  ) : null;
};
var Yo = () => {
  const e = M(), t = C(), n = b(), o = (0, import_react3.useCallback)(() => {
    n._tiptapEditor.chain().focus().addPendingComment().run();
  }, [n]);
  return (
    // We manually check if a comment extension (like liveblocks) is installed
    // By adding default support for this, the user doesn't need to customize the formatting toolbar
    !n._tiptapEditor.commands.addPendingComment || !n.isEditable ? null : (0, import_jsx_runtime.jsx)(
      t.FormattingToolbar.Button,
      {
        className: "bn-button",
        label: e.formatting_toolbar.comment.tooltip,
        mainTooltip: e.formatting_toolbar.comment.tooltip,
        icon: (0, import_jsx_runtime.jsx)(ht, {}),
        onClick: o
      }
    )
  );
};
function ve(e, t) {
  try {
    const n = new URL(e, t);
    if (n.protocol !== "javascript:")
      return n.href;
  } catch {
  }
  return "#";
}
var Jo = () => {
  const e = M(), t = C(), n = b(), o = _2(n), r = (0, import_react3.useMemo)(() => {
    if (o.length !== 1)
      return;
    const c = o[0];
    if (Bc(c, n))
      return c;
  }, [n, o]), l = (0, import_react3.useCallback)(() => {
    r && r.props.url && (n.focus(), n.resolveFileUrl ? n.resolveFileUrl(r.props.url).then(
      (c) => window.open(ve(c, window.location.href))
    ) : window.open(ve(r.props.url, window.location.href)));
  }, [n, r]);
  return !r || xc(r, n) ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      label: e.formatting_toolbar.file_download.tooltip[r.type] || e.formatting_toolbar.file_download.tooltip.file,
      mainTooltip: e.formatting_toolbar.file_download.tooltip[r.type] || e.formatting_toolbar.file_download.tooltip.file,
      icon: (0, import_jsx_runtime.jsx)(Ho, {}),
      onClick: l
    }
  );
};
var Qo2 = () => {
  const e = M(), t = C(), n = b(), o = _2(n), r = (0, import_react3.useMemo)(() => {
    if (o.length !== 1)
      return;
    const c = o[0];
    if (Tc(c, n))
      return c;
  }, [n, o]), l = (0, import_react3.useCallback)(() => {
    r && n.updateBlock(r, {
      props: {
        showPreview: !r.props.showPreview
        // TODO
      }
    });
  }, [n, r]);
  return !r || xc(r, n) || !n.isEditable ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      label: "Toggle preview",
      mainTooltip: e.formatting_toolbar.file_preview_toggle.tooltip,
      icon: (0, import_jsx_runtime.jsx)(go, {}),
      isSelected: r.props.showPreview,
      onClick: l
    }
  );
};
var er2 = () => {
  const e = M(), t = C(), n = b(), o = _2(n), r = (0, import_react3.useMemo)(() => {
    var d;
    if (o.length !== 1)
      return;
    const c = o[0];
    if (c.type === "table")
      return (d = n.tableHandles) == null ? void 0 : d.getMergeDirection(c);
  }, [n, o]), l = (0, import_react3.useCallback)(() => {
    var c;
    (c = n.tableHandles) == null || c.mergeCells();
  }, [n]);
  return !n.isEditable || r === void 0 || !n.settings.tables.splitCells ? null : (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      label: e.formatting_toolbar.table_cell_merge.tooltip,
      mainTooltip: e.formatting_toolbar.table_cell_merge.tooltip,
      icon: r === "horizontal" ? (0, import_jsx_runtime.jsx)(ao, {}) : (0, import_jsx_runtime.jsx)(so, {}),
      onClick: l
    }
  );
};
var tr = {
  left: eo,
  center: Jn2,
  right: to,
  justify: Qn
};
var be = (e) => {
  const t = C(), n = M(), o = b(), r = _2(o), l = (0, import_react3.useMemo)(() => {
    var u;
    const a = r[0];
    if (Mc("textAlignment", a, o))
      return a.props.textAlignment;
    if (a.type === "table") {
      const m = (u = o.tableHandles) == null ? void 0 : u.getCellSelection();
      if (!m)
        return;
      const h = m.cells.map(
        ({ row: H, col: p }) => nt(
          a.content.rows[H].cells[p]
        ).props.textAlignment
      ), f = h[0];
      if (h.every((H) => H === f))
        return f;
    }
  }, [o, r]), c = (0, import_react3.useCallback)(
    (a) => {
      var u;
      o.focus();
      for (const m of r)
        if ($s("textAlignment", m.type, o))
          o.updateBlock(m, {
            props: { textAlignment: a }
          });
        else if (m.type === "table") {
          const h = (u = o.tableHandles) == null ? void 0 : u.getCellSelection();
          if (!h)
            continue;
          const f = m.content.rows.map(
            (H) => ({
              ...H,
              cells: H.cells.map((p) => nt(p))
            })
          );
          h.cells.forEach(({ row: H, col: p }) => {
            f[H].cells[p].props.textAlignment = a;
          }), o.updateBlock(m, {
            type: "table",
            content: {
              ...m.content,
              type: "tableContent",
              rows: f
            }
          }), o.setTextCursorPosition(m);
        }
    },
    [o, r]
  );
  if (!(0, import_react3.useMemo)(() => !!r.find(
    (a) => "textAlignment" in a.props || a.type === "table" && a.children
  ), [r]) || !o.isEditable)
    return null;
  const s = tr[e.textAlignment];
  return (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Button,
    {
      className: "bn-button",
      "data-test": `alignText${e.textAlignment.slice(0, 1).toUpperCase() + e.textAlignment.slice(1)}`,
      onClick: () => c(e.textAlignment),
      isSelected: l === e.textAlignment,
      label: n.formatting_toolbar[`align_${e.textAlignment}`].tooltip,
      mainTooltip: n.formatting_toolbar[`align_${e.textAlignment}`].tooltip,
      icon: (0, import_jsx_runtime.jsx)(s, {})
    }
  );
};
var nr = (e) => [
  (0, import_jsx_runtime.jsx)(Ko, { items: e }, "blockTypeSelect"),
  (0, import_jsx_runtime.jsx)(er2, {}, "tableCellMergeButton"),
  (0, import_jsx_runtime.jsx)(Go, {}, "fileCaptionButton"),
  (0, import_jsx_runtime.jsx)(jo, {}, "replaceFileButton"),
  (0, import_jsx_runtime.jsx)(zo, {}, "fileRenameButton"),
  (0, import_jsx_runtime.jsx)(Uo, {}, "fileDeleteButton"),
  (0, import_jsx_runtime.jsx)(Jo, {}, "fileDownloadButton"),
  (0, import_jsx_runtime.jsx)(Qo2, {}, "filePreviewButton"),
  (0, import_jsx_runtime.jsx)(ne, { basicTextStyle: "bold" }, "boldStyleButton"),
  (0, import_jsx_runtime.jsx)(ne, { basicTextStyle: "italic" }, "italicStyleButton"),
  (0, import_jsx_runtime.jsx)(
    ne,
    {
      basicTextStyle: "underline"
    },
    "underlineStyleButton"
  ),
  (0, import_jsx_runtime.jsx)(ne, { basicTextStyle: "strike" }, "strikeStyleButton"),
  (0, import_jsx_runtime.jsx)(be, { textAlignment: "left" }, "textAlignLeftButton"),
  (0, import_jsx_runtime.jsx)(be, { textAlignment: "center" }, "textAlignCenterButton"),
  (0, import_jsx_runtime.jsx)(be, { textAlignment: "right" }, "textAlignRightButton"),
  (0, import_jsx_runtime.jsx)(Zo2, {}, "colorStyleButton"),
  (0, import_jsx_runtime.jsx)(Wo, {}, "nestBlockButton"),
  (0, import_jsx_runtime.jsx)($o, {}, "unnestBlockButton"),
  (0, import_jsx_runtime.jsx)(Ao, {}, "createLinkButton"),
  (0, import_jsx_runtime.jsx)(Xo, {}, "addCommentButton"),
  (0, import_jsx_runtime.jsx)(Yo, {}, "addTiptapCommentButton")
];
var St = (e) => {
  const t = C();
  return (0, import_jsx_runtime.jsx)(
    t.FormattingToolbar.Root,
    {
      className: "bn-toolbar bn-formatting-toolbar",
      children: e.children || nr(e.blockTypeSelectItems)
    }
  );
};
var Ye = (e) => {
  switch (e) {
    case "left":
      return "top-start";
    case "center":
      return "top";
    case "right":
      return "top-end";
    default:
      return "top-start";
  }
};
var or = (e) => {
  const t = (0, import_react3.useRef)(null), n = b(), [o, r] = (0, import_react3.useState)(
    () => {
      const h = n.getTextCursorPosition().block;
      return "textAlignment" in h.props ? Ye(
        h.props.textAlignment
      ) : "top-start";
    }
  );
  U(() => {
    const h = n.getTextCursorPosition().block;
    "textAlignment" in h.props ? r(
      Ye(
        h.props.textAlignment
      )
    ) : r("top-start");
  }, n);
  const l = O(
    n.formattingToolbar.onUpdate.bind(n.formattingToolbar)
  ), { isMounted: c, ref: d, style: s, getFloatingProps: a } = G2(
    (l == null ? void 0 : l.show) || false,
    (l == null ? void 0 : l.referencePos) || null,
    3e3,
    {
      placement: o,
      middleware: [offset(10), shift(), flip()],
      onOpenChange: (h, f) => {
        h || (n.formattingToolbar.closeMenu(), n.focus());
      },
      ...e.floatingOptions
    }
  ), u = (0, import_react3.useMemo)(() => Po([t, d]), [t, d]);
  if (!c || !l)
    return null;
  if (!l.show && t.current)
    return (0, import_jsx_runtime.jsx)(
      "div",
      {
        ref: u,
        style: s,
        dangerouslySetInnerHTML: { __html: t.current.innerHTML }
      }
    );
  const m = e.formattingToolbar || St;
  return (0, import_jsx_runtime.jsx)("div", { ref: u, style: s, ...a(), children: (0, import_jsx_runtime.jsx)(m, {}) });
};
var rr2 = (e) => {
  const t = C(), n = M();
  return (0, import_jsx_runtime.jsx)(
    t.LinkToolbar.Button,
    {
      className: "bn-button",
      label: n.link_toolbar.delete.tooltip,
      mainTooltip: n.link_toolbar.delete.tooltip,
      isSelected: false,
      onClick: e.deleteLink,
      icon: (0, import_jsx_runtime.jsx)(co, {})
    }
  );
};
var ir = (e) => {
  const t = C(), n = M();
  return (0, import_jsx_runtime.jsxs)(t.Generic.Popover.Root, { children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Popover.Trigger, { children: (0, import_jsx_runtime.jsx)(
      t.LinkToolbar.Button,
      {
        className: "bn-button",
        mainTooltip: n.link_toolbar.edit.tooltip,
        isSelected: false,
        children: n.link_toolbar.edit.text
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Popover.Content,
      {
        className: "bn-popover-content bn-form-popover",
        variant: "form-popover",
        children: (0, import_jsx_runtime.jsx)(Vt2, { ...e })
      }
    )
  ] });
};
var lr2 = (e) => {
  const t = C(), n = M();
  return (0, import_jsx_runtime.jsx)(
    t.LinkToolbar.Button,
    {
      className: "bn-button",
      mainTooltip: n.link_toolbar.open.tooltip,
      label: n.link_toolbar.open.tooltip,
      isSelected: false,
      onClick: () => {
        window.open(ve(e.url, window.location.href), "_blank");
      },
      icon: (0, import_jsx_runtime.jsx)(Mo, {})
    }
  );
};
var cr2 = (e) => {
  const t = C();
  return e.children ? (0, import_jsx_runtime.jsx)(t.LinkToolbar.Root, { className: "bn-toolbar bn-link-toolbar", children: e.children }) : (0, import_jsx_runtime.jsxs)(
    t.LinkToolbar.Root,
    {
      className: "bn-toolbar bn-link-toolbar",
      onMouseEnter: e.stopHideTimer,
      onMouseLeave: e.startHideTimer,
      children: [
        (0, import_jsx_runtime.jsx)(
          ir,
          {
            url: e.url,
            text: e.text,
            editLink: e.editLink
          }
        ),
        (0, import_jsx_runtime.jsx)(lr2, { url: e.url }),
        (0, import_jsx_runtime.jsx)(rr2, { deleteLink: e.deleteLink })
      ]
    }
  );
};
var ar2 = (e) => {
  const t = b(), n = {
    deleteLink: t.linkToolbar.deleteLink,
    editLink: t.linkToolbar.editLink,
    startHideTimer: t.linkToolbar.startHideTimer,
    stopHideTimer: t.linkToolbar.stopHideTimer
  }, o = O(
    t.linkToolbar.onUpdate.bind(t.linkToolbar)
  ), { isMounted: r, ref: l, style: c, getFloatingProps: d } = G2(
    (o == null ? void 0 : o.show) || false,
    (o == null ? void 0 : o.referencePos) || null,
    4e3,
    {
      placement: "top-start",
      middleware: [offset(10), flip()],
      onOpenChange: (h) => {
        h || (t.linkToolbar.closeMenu(), t.focus());
      },
      ...e.floatingOptions
    }
  );
  if (!r || !o)
    return null;
  const { show: s, referencePos: a, ...u } = o, m = e.linkToolbar || cr2;
  return (0, import_jsx_runtime.jsx)("div", { ref: l, style: c, ...d(), children: (0, import_jsx_runtime.jsx)(m, { ...u, ...n }) });
};
function sr2(e) {
  return k({ attr: { viewBox: "0 0 1024 1024" }, child: [{ tag: "path", attr: { d: "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z" }, child: [] }, { tag: "path", attr: { d: "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z" }, child: [] }] })(e);
}
var dr2 = (e) => {
  const t = C(), n = M(), o = b(), r = (0, import_react3.useCallback)(() => {
    const l = e.block.content;
    if (l !== void 0 && Array.isArray(l) && l.length === 0)
      o.setTextCursorPosition(e.block), o.openSuggestionMenu("/");
    else {
      const d = o.insertBlocks(
        [{ type: "paragraph" }],
        e.block,
        "after"
      )[0];
      o.setTextCursorPosition(d), o.openSuggestionMenu("/");
    }
  }, [o, e.block]);
  return (0, import_jsx_runtime.jsx)(
    t.SideMenu.Button,
    {
      className: "bn-button",
      label: n.side_menu.add_block_label,
      icon: (0, import_jsx_runtime.jsx)(sr2, { size: 24, onClick: r, "data-test": "dragHandleAdd" })
    }
  );
};
function Tt(e) {
  return k({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }, child: [] }] })(e);
}
function ur(e) {
  return k({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "m7 10 5 5 5-5z" }, child: [] }] })(e);
}
var mr = (e) => {
  const t = C(), n = b();
  return !$s("textColor", e.block.type, n) && !$s("backgroundColor", e.block.type, n) ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Menu.Root, { position: "right", sub: true, children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { sub: true, children: (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Item,
      {
        className: "bn-menu-item",
        subTrigger: true,
        children: e.children
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Dropdown,
      {
        sub: true,
        className: "bn-menu-dropdown bn-color-picker-dropdown",
        children: (0, import_jsx_runtime.jsx)(
          me,
          {
            iconSize: 18,
            text: $s(
              "textColor",
              e.block.type,
              n
            ) && Mc("textColor", e.block, n) ? {
              color: e.block.props.textColor,
              setColor: (o) => n.updateBlock(e.block, {
                type: e.block.type,
                props: { textColor: o }
              })
            } : void 0,
            background: $s(
              "backgroundColor",
              e.block.type,
              n
            ) && Mc("backgroundColor", e.block, n) ? {
              color: e.block.props.backgroundColor,
              setColor: (o) => n.updateBlock(e.block, {
                props: { backgroundColor: o }
              })
            } : void 0
          }
        )
      }
    )
  ] });
};
var hr = (e) => {
  const t = C(), n = b();
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      className: "bn-menu-item",
      onClick: () => n.removeBlocks([e.block]),
      children: e.children
    }
  );
};
var fr = (e) => {
  const t = C(), n = b();
  if (e.block.type !== "table" || !n.settings.tables.headers)
    return null;
  const o = !!e.block.content.headerRows;
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      className: "bn-menu-item",
      checked: o,
      onClick: () => {
        const r = n.getBlock(e.block.id);
        r && n.updateBlock(r, {
          ...r,
          content: {
            ...r.content,
            headerRows: o ? void 0 : 1
          }
        });
      },
      children: e.children
    }
  );
};
var gr = (e) => {
  const t = C(), n = b();
  if (e.block.type !== "table" || !n.settings.tables.headers)
    return null;
  const o = !!e.block.content.headerCols;
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      className: "bn-menu-item",
      checked: o,
      onClick: () => {
        n.updateBlock(e.block, {
          type: "table",
          content: {
            ...e.block.content,
            type: "tableContent",
            headerCols: o ? void 0 : 1
          }
        });
      },
      children: e.children
    }
  );
};
var br = (e) => {
  const t = C(), n = M();
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Dropdown,
    {
      className: "bn-menu-dropdown bn-drag-handle-menu",
      children: e.children || (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        (0, import_jsx_runtime.jsx)(hr, { ...e, children: n.drag_handle.delete_menuitem }),
        (0, import_jsx_runtime.jsx)(mr, { ...e, children: n.drag_handle.colors_menuitem }),
        (0, import_jsx_runtime.jsx)(fr, { ...e, children: n.drag_handle.header_row_menuitem }),
        (0, import_jsx_runtime.jsx)(gr, { ...e, children: n.drag_handle.header_column_menuitem })
      ] })
    }
  );
};
var Cr = (e) => {
  const t = C(), n = M(), o = e.dragHandleMenu || br;
  return (0, import_jsx_runtime.jsxs)(
    t.Generic.Menu.Root,
    {
      onOpenChange: (r) => {
        r ? e.freezeMenu() : e.unfreezeMenu();
      },
      position: "left",
      children: [
        (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { children: (0, import_jsx_runtime.jsx)(
          t.SideMenu.Button,
          {
            label: n.side_menu.drag_handle_label,
            draggable: true,
            onDragStart: (r) => e.blockDragStart(r, e.block),
            onDragEnd: e.blockDragEnd,
            className: "bn-button",
            icon: (0, import_jsx_runtime.jsx)(Tt, { size: 24, "data-test": "dragHandle" })
          }
        ) }),
        (0, import_jsx_runtime.jsx)(o, { block: e.block, children: e.children })
      ]
    }
  );
};
var pr = (e) => {
  const t = C(), n = (0, import_react3.useMemo)(() => {
    const o = {
      "data-block-type": e.block.type
    };
    return e.block.type === "heading" && (o["data-level"] = e.block.props.level.toString()), e.editor.schema.blockSchema[e.block.type].isFileBlock && (e.block.props.url ? o["data-url"] = "true" : o["data-url"] = "false"), o;
  }, [e.block, e.editor.schema.blockSchema]);
  return (0, import_jsx_runtime.jsx)(t.SideMenu.Root, { className: "bn-side-menu", ...n, children: e.children || (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(dr2, { ...e }),
    (0, import_jsx_runtime.jsx)(Cr, { ...e })
  ] }) });
};
var kr = (e) => {
  const t = b(), n = {
    blockDragStart: t.sideMenu.blockDragStart,
    blockDragEnd: t.sideMenu.blockDragEnd,
    freezeMenu: t.sideMenu.freezeMenu,
    unfreezeMenu: t.sideMenu.unfreezeMenu
  }, o = O(
    t.sideMenu.onUpdate.bind(t.sideMenu)
  ), { isMounted: r, ref: l, style: c, getFloatingProps: d } = G2(
    (o == null ? void 0 : o.show) || false,
    (o == null ? void 0 : o.referencePos) || null,
    1e3,
    {
      placement: "left-start",
      ...e.floatingOptions
    }
  );
  if (!r || !o)
    return null;
  const { show: s, referencePos: a, ...u } = o, m = e.sideMenu || pr;
  return (0, import_jsx_runtime.jsx)("div", { ref: l, style: c, ...d(), children: (0, import_jsx_runtime.jsx)(m, { ...u, ...n, editor: t }) });
};
async function wr(e, t) {
  return (await Vc(e, t)).map(
    ({ id: n, onItemClick: o }) => ({
      id: n,
      onItemClick: o,
      icon: n
    })
  );
}
function vr(e) {
  const t = C(), n = M(), { items: o, loadingState: r, selectedIndex: l, onItemClick: c, columns: d } = e, s = r === "loading-initial" || r === "loading" ? (0, import_jsx_runtime.jsx)(
    t.GridSuggestionMenu.Loader,
    {
      className: "bn-grid-suggestion-menu-loader",
      columns: d,
      children: n.suggestion_menu.loading
    }
  ) : null, a = (0, import_react3.useMemo)(() => {
    const u = [];
    for (let m = 0; m < o.length; m++) {
      const h = o[m];
      u.push(
        (0, import_jsx_runtime.jsx)(
          t.GridSuggestionMenu.Item,
          {
            className: "bn-grid-suggestion-menu-item",
            item: h,
            id: `bn-grid-suggestion-menu-item-${m}`,
            isSelected: m === l,
            onClick: () => c == null ? void 0 : c(h)
          },
          h.id
        )
      );
    }
    return u;
  }, [t, o, c, l]);
  return (0, import_jsx_runtime.jsxs)(
    t.GridSuggestionMenu.Root,
    {
      id: "bn-grid-suggestion-menu",
      columns: d,
      className: "bn-grid-suggestion-menu",
      children: [
        s,
        a,
        a.length === 0 && e.loadingState === "loaded" && (0, import_jsx_runtime.jsx)(
          t.GridSuggestionMenu.EmptyItem,
          {
            className: "bn-grid-suggestion-menu-empty-item",
            columns: d,
            children: n.suggestion_menu.no_items_title
          }
        )
      ]
    }
  );
}
function Lt(e, t, n, o = 3) {
  const r = (0, import_react3.useRef)(0);
  (0, import_react3.useEffect)(() => {
    t !== void 0 && (e.length > 0 ? r.current = t.length : t.length - r.current > o && n());
  }, [n, o, e.length, t]);
}
function Et(e, t) {
  const [n, o] = (0, import_react3.useState)([]), [r, l] = (0, import_react3.useState)(false), c = (0, import_react3.useRef)(), d = (0, import_react3.useRef)();
  return (0, import_react3.useEffect)(() => {
    const s = e;
    c.current = e, l(true), t(e).then((a) => {
      c.current === s && (o(a), l(false), d.current = s);
    });
  }, [e, t]), {
    items: n || [],
    // The query that was used to retrieve the last set of items may not be the
    // same as the current query as the items from the current query may not
    // have been retrieved yet. This is useful when using the returns of this
    // hook in other hooks.
    usedQuery: d.current,
    loadingState: d.current === void 0 ? "loading-initial" : r ? "loading" : "loaded"
  };
}
function Hr(e, t, n, o, r) {
  const [l, c] = (0, import_react3.useState)(0), d = o !== void 0 && o > 1;
  return (0, import_react3.useEffect)(() => {
    var a;
    const s = (u) => (u.key === "ArrowLeft" && (u.preventDefault(), n.length && c((l - 1 + n.length) % n.length)), u.key === "ArrowRight" && (u.preventDefault(), n.length && c((l + 1 + n.length) % n.length)), u.key === "ArrowUp" ? (u.preventDefault(), n.length && c(
      (l - o + n.length) % n.length
    ), true) : u.key === "ArrowDown" ? (u.preventDefault(), n.length && c((l + o) % n.length), true) : u.key === "Enter" && !u.isComposing ? (u.preventDefault(), n.length && (r == null || r(n[l])), true) : false);
    return (a = e.domElement) == null || a.addEventListener(
      "keydown",
      s,
      true
    ), () => {
      var u;
      (u = e.domElement) == null || u.removeEventListener(
        "keydown",
        s,
        true
      );
    };
  }, [e.domElement, n, l, r, o, d]), (0, import_react3.useEffect)(() => {
    c(0);
  }, [t]), {
    selectedIndex: n.length === 0 ? void 0 : l
  };
}
function Mr(e) {
  const n = D().setContentEditableProps, o = b(), {
    getItems: r,
    gridSuggestionMenuComponent: l,
    query: c,
    clearQuery: d,
    closeMenu: s,
    onItemClick: a,
    columns: u
  } = e, m = (0, import_react3.useCallback)(
    (B) => {
      s(), d(), a == null || a(B);
    },
    [a, s, d]
  ), { items: h, usedQuery: f, loadingState: H } = Et(
    c,
    r
  );
  Lt(h, f, s);
  const { selectedIndex: p } = Hr(
    o,
    c,
    h,
    u,
    m
  );
  return (0, import_react3.useEffect)(() => (n((B) => ({
    ...B,
    "aria-expanded": true,
    "aria-controls": "bn-suggestion-menu"
  })), () => {
    n((B) => ({
      ...B,
      "aria-expanded": false,
      "aria-controls": void 0
    }));
  }), [n]), (0, import_react3.useEffect)(() => (n((B) => ({
    ...B,
    "aria-activedescendant": p ? "bn-suggestion-menu-item-" + p : void 0
  })), () => {
    n((B) => ({
      ...B,
      "aria-activedescendant": void 0
    }));
  }), [n, p]), (0, import_jsx_runtime.jsx)(
    l,
    {
      items: h,
      onItemClick: m,
      loadingState: H,
      selectedIndex: p,
      columns: u
    }
  );
}
function xr(e) {
  const t = b(), {
    triggerCharacter: n,
    gridSuggestionMenuComponent: o,
    columns: r,
    minQueryLength: l,
    onItemClick: c,
    getItems: d,
    floatingOptions: s
  } = e, a = (0, import_react3.useMemo)(() => c || ((S) => {
    S.onItemClick(t);
  }), [t, c]), u = (0, import_react3.useMemo)(() => d || (async (S) => await wr(
    t,
    S
  )), [t, d]), m = {
    closeMenu: t.suggestionMenus.closeMenu,
    clearQuery: t.suggestionMenus.clearQuery
  }, h = (0, import_react3.useCallback)(
    (S) => t.suggestionMenus.onUpdate(n, S),
    [t.suggestionMenus, n]
  ), f = O(h), { isMounted: H, ref: p, style: V, getFloatingProps: B } = G2(
    (f == null ? void 0 : f.show) || false,
    (f == null ? void 0 : f.referencePos) || null,
    2e3,
    {
      placement: "bottom-start",
      middleware: [
        offset(10),
        // Flips the menu placement to maximize the space available, and prevents
        // the menu from being cut off by the confines of the screen.
        flip(),
        size({
          apply({ availableHeight: S, elements: I }) {
            Object.assign(I.floating.style, {
              maxHeight: `${S - 10}px`
            });
          }
        })
      ],
      onOpenChange(S) {
        S || t.suggestionMenus.closeMenu();
      },
      ...s
    }
  );
  return !H || !f || !(f != null && f.ignoreQueryLength) && l && (f.query.startsWith(" ") || f.query.length < l) ? null : (0, import_jsx_runtime.jsx)("div", { ref: p, style: V, ...B(), children: (0, import_jsx_runtime.jsx)(
    Mr,
    {
      query: f.query,
      closeMenu: m.closeMenu,
      clearQuery: m.clearQuery,
      getItems: u,
      columns: r,
      gridSuggestionMenuComponent: o || vr,
      onItemClick: a
    }
  ) });
}
function yr(e) {
  const t = C(), n = M(), { items: o, loadingState: r, selectedIndex: l, onItemClick: c } = e, d = r === "loading-initial" || r === "loading" ? (0, import_jsx_runtime.jsx)(t.SuggestionMenu.Loader, { className: "bn-suggestion-menu-loader", children: n.suggestion_menu.loading }) : null, s = (0, import_react3.useMemo)(() => {
    let a;
    const u = [];
    for (let m = 0; m < o.length; m++) {
      const h = o[m];
      h.group !== a && (a = h.group, u.push(
        (0, import_jsx_runtime.jsx)(
          t.SuggestionMenu.Label,
          {
            className: "bn-suggestion-menu-label",
            children: a
          },
          a
        )
      )), u.push(
        (0, import_jsx_runtime.jsx)(
          t.SuggestionMenu.Item,
          {
            className: "bn-suggestion-menu-item",
            item: h,
            id: `bn-suggestion-menu-item-${m}`,
            isSelected: m === l,
            onClick: () => c == null ? void 0 : c(h)
          },
          h.title
        )
      );
    }
    return u;
  }, [t, o, c, l]);
  return (0, import_jsx_runtime.jsxs)(
    t.SuggestionMenu.Root,
    {
      id: "bn-suggestion-menu",
      className: "bn-suggestion-menu",
      children: [
        s,
        s.length === 0 && (e.loadingState === "loading" || e.loadingState === "loaded") && (0, import_jsx_runtime.jsx)(
          t.SuggestionMenu.EmptyItem,
          {
            className: "bn-suggestion-menu-item",
            children: n.suggestion_menu.no_items_title
          }
        ),
        d
      ]
    }
  );
}
function Br(e, t, n, o) {
  const [r, l] = (0, import_react3.useState)(0);
  return (0, import_react3.useEffect)(() => {
    var d;
    const c = (s) => s.key === "ArrowUp" ? (s.preventDefault(), n.length && l((r - 1 + n.length) % n.length), true) : s.key === "ArrowDown" ? (s.preventDefault(), n.length && l((r + 1) % n.length), true) : s.key === "Enter" && !s.isComposing ? (s.preventDefault(), s.stopPropagation(), n.length && (o == null || o(n[r])), true) : false;
    return (d = e.domElement) == null || d.addEventListener(
      "keydown",
      c,
      true
    ), () => {
      var s;
      (s = e.domElement) == null || s.removeEventListener(
        "keydown",
        c,
        true
      );
    };
  }, [e.domElement, n, r, o]), (0, import_react3.useEffect)(() => {
    l(0);
  }, [t]), {
    selectedIndex: n.length === 0 ? void 0 : r
  };
}
function Vr(e) {
  const n = D().setContentEditableProps, o = b(), {
    getItems: r,
    suggestionMenuComponent: l,
    query: c,
    clearQuery: d,
    closeMenu: s,
    onItemClick: a
  } = e, u = (0, import_react3.useCallback)(
    (V) => {
      s(), d(), a == null || a(V);
    },
    [a, s, d]
  ), { items: m, usedQuery: h, loadingState: f } = Et(
    c,
    r
  );
  Lt(m, h, s);
  const { selectedIndex: H } = Br(
    o,
    c,
    m,
    u
  );
  return (0, import_react3.useEffect)(() => (n((V) => ({
    ...V,
    "aria-expanded": true,
    "aria-controls": "bn-suggestion-menu"
  })), () => {
    n((V) => ({
      ...V,
      "aria-expanded": false,
      "aria-controls": void 0
    }));
  }), [n]), (0, import_react3.useEffect)(() => (n((V) => ({
    ...V,
    "aria-activedescendant": H ? "bn-suggestion-menu-item-" + H : void 0
  })), () => {
    n((V) => ({
      ...V,
      "aria-activedescendant": void 0
    }));
  }), [n, H]), (0, import_jsx_runtime.jsx)(
    l,
    {
      items: m,
      onItemClick: u,
      loadingState: f,
      selectedIndex: H
    }
  );
}
var Sr = {
  heading: ft2,
  heading_2: gt,
  heading_3: bt,
  quote: vt,
  numbered_list: kt,
  bullet_list: wt,
  check_list: pt,
  paragraph: _e,
  table: mo,
  image: Ht,
  video: fo,
  audio: Mt,
  file: Re,
  emoji: yo,
  code_block: oo
};
function Tr(e) {
  return Pc(e).map((t) => {
    const n = Sr[t.key];
    return {
      ...t,
      icon: (0, import_jsx_runtime.jsx)(n, { size: 18 })
    };
  });
}
function Lr2(e) {
  const t = b(), {
    triggerCharacter: n,
    suggestionMenuComponent: o,
    minQueryLength: r,
    onItemClick: l,
    getItems: c,
    floatingOptions: d
  } = e, s = (0, import_react3.useMemo)(() => l || ((B) => {
    B.onItemClick(t);
  }), [t, l]), a = (0, import_react3.useMemo)(() => c || (async (B) => Ic(
    Tr(t),
    B
  )), [t, c]), u = {
    closeMenu: t.suggestionMenus.closeMenu,
    clearQuery: t.suggestionMenus.clearQuery
  }, m = (0, import_react3.useCallback)(
    (B) => t.suggestionMenus.onUpdate(n, B),
    [t.suggestionMenus, n]
  ), h = O(m), { isMounted: f, ref: H, style: p, getFloatingProps: V } = G2(
    (h == null ? void 0 : h.show) || false,
    (h == null ? void 0 : h.referencePos) || null,
    2e3,
    {
      placement: "bottom-start",
      middleware: [
        offset(10),
        // Flips the menu placement to maximize the space available, and prevents
        // the menu from being cut off by the confines of the screen.
        flip({
          mainAxis: true,
          crossAxis: false
        }),
        shift(),
        size({
          apply({ availableHeight: B, elements: S }) {
            Object.assign(S.floating.style, {
              maxHeight: `${B - 10}px`
            });
          }
        })
      ],
      onOpenChange(B) {
        B || t.suggestionMenus.closeMenu();
      },
      ...d
    }
  );
  return !f || !h || !(h != null && h.ignoreQueryLength) && r && (h.query.startsWith(" ") || h.query.length < r) ? null : (0, import_jsx_runtime.jsx)("div", { ref: H, style: p, ...V(), children: (0, import_jsx_runtime.jsx)(
    Vr,
    {
      query: h.query,
      closeMenu: u.closeMenu,
      clearQuery: u.clearQuery,
      getItems: a,
      suggestionMenuComponent: o || yr,
      onItemClick: s
    }
  ) });
}
var Er = (e, t = 0.3) => {
  const n = Math.floor(e) + t, o = Math.ceil(e) - t;
  return e >= n && e <= o ? Math.round(e) : e < n ? Math.floor(e) : Math.ceil(e);
};
var Rr = (e) => {
  const t = C(), n = (0, import_react3.useRef)(false), [o, r] = (0, import_react3.useState)(), l = (0, import_react3.useCallback)(
    (d) => {
      e.onMouseDown(), r({
        originalContent: e.block.content,
        originalCroppedContent: {
          rows: e.editor.tableHandles.cropEmptyRowsOrColumns(
            e.block,
            e.orientation === "addOrRemoveColumns" ? "columns" : "rows"
          )
        },
        startPos: e.orientation === "addOrRemoveColumns" ? d.clientX : d.clientY
      }), n.current = false, d.preventDefault();
    },
    [e]
  ), c = (0, import_react3.useCallback)(() => {
    n.current || e.editor.updateBlock(e.block, {
      type: "table",
      content: {
        ...e.block.content,
        rows: e.orientation === "addOrRemoveColumns" ? e.editor.tableHandles.addRowsOrColumns(
          e.block,
          "columns",
          1
        ) : e.editor.tableHandles.addRowsOrColumns(
          e.block,
          "rows",
          1
        )
      }
    });
  }, [e.block, e.orientation, e.editor]);
  return (0, import_react3.useEffect)(() => {
    const d = (s) => {
      var H, p;
      if (!o)
        throw new Error("editingState is undefined");
      n.current = true;
      const a = (e.orientation === "addOrRemoveColumns" ? s.clientX : s.clientY) - o.startPos, u = e.orientation === "addOrRemoveColumns" ? ((H = o.originalCroppedContent.rows[0]) == null ? void 0 : H.cells.length) ?? 0 : o.originalCroppedContent.rows.length, m = e.orientation === "addOrRemoveColumns" ? ((p = o.originalContent.rows[0]) == null ? void 0 : p.cells.length) ?? 0 : o.originalContent.rows.length, h = e.orientation === "addOrRemoveColumns" ? e.block.content.rows[0].cells.length : e.block.content.rows.length, f = m + Er(
        a / (e.orientation === "addOrRemoveColumns" ? Pn : Ec),
        0.3
      );
      f >= u && f > 0 && f !== h && (e.editor.updateBlock(e.block, {
        type: "table",
        content: {
          ...e.block.content,
          rows: e.orientation === "addOrRemoveColumns" ? e.editor.tableHandles.addRowsOrColumns(
            {
              type: "table",
              content: o.originalCroppedContent
            },
            "columns",
            f - u
          ) : e.editor.tableHandles.addRowsOrColumns(
            {
              type: "table",
              content: o.originalCroppedContent
            },
            "rows",
            f - u
          )
        }
      }), e.block.content && e.editor.setTextCursorPosition(e.block));
    };
    return o && window.addEventListener("mousemove", d), () => {
      window.removeEventListener("mousemove", d);
    };
  }, [o, e.block, e.editor, e.orientation]), (0, import_react3.useEffect)(() => {
    const d = e.onMouseUp, s = () => {
      r(void 0), d();
    };
    return o && window.addEventListener("mouseup", s), () => {
      window.removeEventListener("mouseup", s);
    };
  }, [o, e.onMouseUp]), (0, import_jsx_runtime.jsx)(
    t.TableHandle.ExtendButton,
    {
      className: Q(
        "bn-extend-button",
        e.orientation === "addOrRemoveColumns" ? "bn-extend-button-add-remove-columns" : "bn-extend-button-add-remove-rows",
        o !== null ? "bn-extend-button-editing" : ""
      ),
      onClick: c,
      onMouseDown: l,
      children: e.children || (0, import_jsx_runtime.jsx)(po, { size: 18, "data-test": "extendButton" })
    }
  );
};
var Je = (e) => {
  const t = C(), n = M(), r = b().tableHandles;
  return r ? (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      onClick: () => {
        r.addRowOrColumn(
          e.index,
          e.orientation === "row" ? { orientation: "row", side: e.side } : { orientation: "column", side: e.side }
        );
      },
      children: n.table_handle[`add_${e.side}_menuitem`]
    }
  ) : null;
};
var _r2 = (e) => {
  const t = C(), n = M(), r = b().tableHandles;
  return r ? (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      onClick: () => {
        r.removeRowOrColumn(e.index, e.orientation);
      },
      children: e.orientation === "row" ? n.table_handle.delete_row_menuitem : n.table_handle.delete_column_menuitem
    }
  ) : null;
};
var Ir = (e) => {
  const t = C(), n = M(), o = b(), r = o.tableHandles, l = (0, import_react3.useMemo)(() => !r || !e.block ? [] : e.orientation === "row" ? r.getCellsAtRowHandle(e.block, e.index) : r.getCellsAtColumnHandle(e.block, e.index), [e.block, e.index, e.orientation, r]), c = (s, a) => {
    const u = e.block.content.rows.map((m) => ({
      ...m,
      cells: m.cells.map((h) => nt(h))
    }));
    l.forEach(({ row: m, col: h }) => {
      a === "text" ? u[m].cells[h].props.textColor = s : u[m].cells[h].props.backgroundColor = s;
    }), o.updateBlock(e.block, {
      type: "table",
      content: {
        ...e.block.content,
        rows: u
      }
    }), o.setTextCursorPosition(e.block);
  };
  if (!l || !l[0] || !r || o.settings.tables.cellTextColor === false && o.settings.tables.cellBackgroundColor === false)
    return null;
  const d = nt(l[0].cell);
  return (0, import_jsx_runtime.jsxs)(t.Generic.Menu.Root, { position: "right", sub: true, children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { sub: true, children: (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Item,
      {
        className: "bn-menu-item",
        subTrigger: true,
        children: e.children || n.drag_handle.colors_menuitem
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Dropdown,
      {
        sub: true,
        className: "bn-menu-dropdown bn-color-picker-dropdown",
        children: (0, import_jsx_runtime.jsx)(
          me,
          {
            iconSize: 18,
            text: o.settings.tables.cellTextColor ? {
              // All cells have the same text color
              color: l.every(
                ({ cell: s }) => ft(s) && s.props.textColor === d.props.textColor
              ) ? d.props.textColor : "default",
              setColor: (s) => {
                c(s, "text");
              }
            } : void 0,
            background: o.settings.tables.cellBackgroundColor ? {
              color: l.every(
                ({ cell: s }) => ft(s) && s.props.backgroundColor === d.props.backgroundColor
              ) ? d.props.backgroundColor : "default",
              setColor: (s) => c(s, "background")
            } : void 0
          }
        )
      }
    )
  ] });
};
var Nr2 = (e) => {
  const t = C(), n = M(), o = b();
  if (!o.tableHandles || e.index !== 0 || e.orientation !== "row" || !o.settings.tables.headers)
    return null;
  const l = !!e.block.content.headerRows;
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      className: "bn-menu-item",
      checked: l,
      onClick: () => {
        const c = o.getBlock(e.block.id);
        c && o.updateBlock(c, {
          ...c,
          content: {
            ...c.content,
            headerRows: l ? void 0 : 1
          }
        });
      },
      children: n.drag_handle.header_row_menuitem
    }
  );
};
var Pr = (e) => {
  const t = C(), n = M(), o = b();
  if (!o.tableHandles || e.index !== 0 || e.orientation !== "column" || !o.settings.tables.headers)
    return null;
  const l = !!e.block.content.headerCols;
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      className: "bn-menu-item",
      checked: l,
      onClick: () => {
        const c = o.getBlock(e.block.id);
        c && o.updateBlock(c, {
          ...c,
          content: {
            ...c.content,
            headerCols: l ? void 0 : 1
          }
        });
      },
      children: n.drag_handle.header_column_menuitem
    }
  );
};
var Or = (e) => {
  const t = C();
  return (0, import_jsx_runtime.jsx)(t.Generic.Menu.Dropdown, { className: "bn-table-handle-menu", children: e.children || (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(
      _r2,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index
      }
    ),
    (0, import_jsx_runtime.jsx)(
      Je,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index,
        side: e.orientation === "row" ? "above" : "left"
      }
    ),
    (0, import_jsx_runtime.jsx)(
      Je,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index,
        side: e.orientation === "row" ? "below" : "right"
      }
    ),
    (0, import_jsx_runtime.jsx)(
      Nr2,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index
      }
    ),
    (0, import_jsx_runtime.jsx)(
      Pr,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index
      }
    ),
    (0, import_jsx_runtime.jsx)(
      Ir,
      {
        orientation: e.orientation,
        block: e.block,
        index: e.index
      }
    )
  ] }) });
};
var Dr = (e) => {
  const t = C(), [n, o] = (0, import_react3.useState)(false), r = e.tableHandleMenu || Or, l = (0, import_react3.useMemo)(() => {
    const c = e.editor.tableHandles;
    return !c || !e.block ? false : e.orientation === "column" ? c.getCellsAtColumnHandle(e.block, e.index).every(({ cell: d }) => ke(d) === 1) : c.getCellsAtRowHandle(e.block, e.index).every(({ cell: d }) => ot(d) === 1);
  }, [e.block, e.editor.tableHandles, e.index, e.orientation]);
  return (0, import_jsx_runtime.jsxs)(
    t.Generic.Menu.Root,
    {
      onOpenChange: (c) => {
        c ? (e.freezeHandles(), e.hideOtherSide()) : (e.unfreezeHandles(), e.showOtherSide(), e.editor.focus());
      },
      position: "right",
      children: [
        (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { children: (0, import_jsx_runtime.jsx)(
          t.TableHandle.Root,
          {
            className: Q(
              "bn-table-handle",
              n ? "bn-table-handle-dragging" : "",
              l ? "" : "bn-table-handle-not-draggable"
            ),
            draggable: l,
            onDragStart: (c) => {
              o(true), e.dragStart(c);
            },
            onDragEnd: () => {
              e.dragEnd(), o(false);
            },
            style: e.orientation === "column" ? { transform: "rotate(0.25turn)" } : void 0,
            children: e.children || (0, import_jsx_runtime.jsx)(Tt, { size: 24, "data-test": "tableHandle" })
          }
        ) }),
        (0, import_react_dom4.createPortal)(
          (0, import_jsx_runtime.jsx)(
            r,
            {
              orientation: e.orientation,
              block: e.block,
              index: e.index
            }
          ),
          e.menuContainer
        )
      ]
    }
  );
};
function Qe(e, t, n) {
  const { refs: o, update: r, context: l, floatingStyles: c } = useFloating2({
    open: t,
    placement: e === "addOrRemoveColumns" ? "right" : "bottom",
    middleware: [
      size({
        apply({ rects: a, elements: u }) {
          Object.assign(
            u.floating.style,
            e === "addOrRemoveColumns" ? {
              height: `${a.reference.height}px`
            } : {
              width: `${a.reference.width}px`
            }
          );
        }
      })
    ]
  }), { isMounted: d, styles: s } = useTransitionStyles(l);
  return (0, import_react3.useEffect)(() => {
    r();
  }, [n, r]), (0, import_react3.useEffect)(() => {
    n !== null && o.setReference({
      getBoundingClientRect: () => n
    });
  }, [e, n, o]), (0, import_react3.useMemo)(
    () => ({
      isMounted: d,
      ref: o.setFloating,
      style: {
        display: "flex",
        ...s,
        ...c
      }
    }),
    [c, d, o.setFloating, s]
  );
}
function Zr(e, t, n) {
  const o = Qe(
    "addOrRemoveRows",
    t,
    n
  ), r = Qe(
    "addOrRemoveColumns",
    e,
    n
  );
  return (0, import_react3.useMemo)(
    () => ({
      addOrRemoveRowsButton: o,
      addOrRemoveColumnsButton: r
    }),
    [r, o]
  );
}
function Fr2(e, t, n) {
  return n && n.draggedCellOrientation === "row" ? new DOMRect(
    t.x,
    n.mousePos,
    t.width,
    0
  ) : new DOMRect(
    t.x,
    e.y,
    t.width,
    e.height
  );
}
function Ar(e, t, n) {
  return n && n.draggedCellOrientation === "col" ? new DOMRect(
    n.mousePos,
    t.y,
    0,
    t.height
  ) : new DOMRect(
    e.x,
    t.y,
    e.width,
    t.height
  );
}
function Gr(e) {
  return new DOMRect(
    e.x,
    e.y,
    e.width,
    0
  );
}
function Ce(e, t, n, o, r) {
  const { refs: l, update: c, context: d, floatingStyles: s } = useFloating2({
    open: t,
    placement: e === "row" ? "left" : e === "col" ? "top" : "bottom-end",
    middleware: [
      offset(
        e === "row" ? -10 : e === "col" ? -12 : { mainAxis: 1, crossAxis: -1 }
      )
    ]
  }), { isMounted: a, styles: u } = useTransitionStyles(d);
  return (0, import_react3.useEffect)(() => {
    c();
  }, [n, o, c]), (0, import_react3.useEffect)(() => {
    n === null || o === null || // Ignore cell handle when dragging
    r && e === "cell" || l.setReference({
      getBoundingClientRect: () => (e === "row" ? Fr2 : e === "col" ? Ar : Gr)(n, o, r)
    });
  }, [r, e, n, o, l]), (0, import_react3.useMemo)(
    () => ({
      isMounted: a,
      ref: l.setFloating,
      style: {
        display: "flex",
        ...u,
        ...s
      }
    }),
    [s, a, l.setFloating, u]
  );
}
function Ur(e, t, n, o) {
  const r = Ce(
    "row",
    e,
    t,
    n,
    o
  ), l = Ce(
    "col",
    e,
    t,
    n,
    o
  ), c = Ce(
    "cell",
    e,
    t,
    n,
    o
  );
  return (0, import_react3.useMemo)(
    () => ({
      rowHandle: r,
      colHandle: l,
      cellHandle: c
    }),
    [l, r, c]
  );
}
var zr = (e) => {
  var c, d;
  const t = C(), n = M(), o = b(), r = (s, a) => {
    const u = e.block.content.rows.map((m) => ({
      ...m,
      cells: m.cells.map((h) => nt(h))
    }));
    a === "text" ? u[e.rowIndex].cells[e.colIndex].props.textColor = s : u[e.rowIndex].cells[e.colIndex].props.backgroundColor = s, o.updateBlock(e.block, {
      type: "table",
      content: {
        ...e.block.content,
        rows: u
      }
    }), o.setTextCursorPosition(e.block);
  }, l = (d = (c = e.block.content.rows[e.rowIndex]) == null ? void 0 : c.cells) == null ? void 0 : d[e.colIndex];
  return !l || o.settings.tables.cellTextColor === false && o.settings.tables.cellBackgroundColor === false ? null : (0, import_jsx_runtime.jsxs)(t.Generic.Menu.Root, { position: "right", sub: true, children: [
    (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { sub: true, children: (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Item,
      {
        className: "bn-menu-item",
        subTrigger: true,
        children: e.children || n.drag_handle.colors_menuitem
      }
    ) }),
    (0, import_jsx_runtime.jsx)(
      t.Generic.Menu.Dropdown,
      {
        sub: true,
        className: "bn-menu-dropdown bn-color-picker-dropdown",
        children: (0, import_jsx_runtime.jsx)(
          me,
          {
            iconSize: 18,
            text: o.settings.tables.cellTextColor ? {
              color: ft(l) ? l.props.textColor : "default",
              setColor: (s) => r(s, "text")
            } : void 0,
            background: o.settings.tables.cellBackgroundColor ? {
              color: ft(l) ? l.props.backgroundColor : "default",
              setColor: (s) => r(s, "background")
            } : void 0
          }
        )
      }
    )
  ] });
};
var jr = (e) => {
  var l, c;
  const t = C(), n = M(), o = b(), r = (c = (l = e.block.content.rows[e.rowIndex]) == null ? void 0 : l.cells) == null ? void 0 : c[e.colIndex];
  return !r || !ft(r) || ot(r) === 1 && ke(r) === 1 || !o.settings.tables.splitCells ? null : (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Item,
    {
      onClick: () => {
        var d;
        (d = o.tableHandles) == null || d.splitCell({
          row: e.rowIndex,
          col: e.colIndex
        });
      },
      children: n.table_handle.split_cell_menuitem
    }
  );
};
var Wr = (e) => {
  const t = C();
  return (0, import_jsx_runtime.jsx)(
    t.Generic.Menu.Dropdown,
    {
      className: "bn-menu-dropdown bn-drag-handle-menu",
      children: e.children || (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        (0, import_jsx_runtime.jsx)(
          jr,
          {
            block: e.block,
            rowIndex: e.rowIndex,
            colIndex: e.colIndex
          }
        ),
        (0, import_jsx_runtime.jsx)(
          zr,
          {
            block: e.block,
            rowIndex: e.rowIndex,
            colIndex: e.colIndex
          }
        )
      ] })
    }
  );
};
var $r = (e) => {
  const t = C(), n = e.tableCellMenu || Wr;
  return !e.editor.settings.tables.splitCells && !e.editor.settings.tables.cellBackgroundColor && !e.editor.settings.tables.cellTextColor ? null : (0, import_jsx_runtime.jsxs)(
    t.Generic.Menu.Root,
    {
      onOpenChange: (o) => {
        o ? e.freezeHandles() : (e.unfreezeHandles(), e.editor.focus());
      },
      position: "right",
      children: [
        (0, import_jsx_runtime.jsx)(t.Generic.Menu.Trigger, { children: (0, import_jsx_runtime.jsx)(t.Generic.Menu.Button, { className: "bn-table-cell-handle", children: e.children || (0, import_jsx_runtime.jsx)(ur, { size: 12, "data-test": "tableCellHandle" }) }) }),
        (0, import_react_dom4.createPortal)(
          (0, import_jsx_runtime.jsx)(
            n,
            {
              block: e.block,
              rowIndex: e.rowIndex,
              colIndex: e.colIndex
            }
          ),
          e.menuContainer
        )
      ]
    }
  );
};
var qr2 = (e) => {
  var $, E;
  const t = b(), [n, o] = (0, import_react3.useState)(null);
  if (!t.tableHandles)
    throw new Error(
      "TableHandlesController can only be used when BlockNote editor schema contains table block"
    );
  const r = {
    rowDragStart: t.tableHandles.rowDragStart,
    colDragStart: t.tableHandles.colDragStart,
    dragEnd: t.tableHandles.dragEnd,
    freezeHandles: t.tableHandles.freezeHandles,
    unfreezeHandles: t.tableHandles.unfreezeHandles
  }, { freezeHandles: l, unfreezeHandles: c } = r, d = (0, import_react3.useCallback)(() => {
    l(), I(true), B(true);
  }, [l]), s = (0, import_react3.useCallback)(() => {
    c(), I(false), B(false);
  }, [c]), a = O(
    t.tableHandles.onUpdate.bind(t.tableHandles)
  ), u = (0, import_react3.useMemo)(() => {
    var F, ee2;
    return a != null && a.draggingState ? {
      draggedCellOrientation: (F = a == null ? void 0 : a.draggingState) == null ? void 0 : F.draggedCellOrientation,
      mousePos: (ee2 = a == null ? void 0 : a.draggingState) == null ? void 0 : ee2.mousePos
    } : void 0;
  }, [
    a == null ? void 0 : a.draggingState,
    ($ = a == null ? void 0 : a.draggingState) == null ? void 0 : $.draggedCellOrientation,
    (E = a == null ? void 0 : a.draggingState) == null ? void 0 : E.mousePos
  ]), { rowHandle: m, colHandle: h, cellHandle: f } = Ur(
    (a == null ? void 0 : a.show) || false,
    (a == null ? void 0 : a.referencePosCell) || null,
    (a == null ? void 0 : a.referencePosTable) || null,
    u
  ), { addOrRemoveColumnsButton: H, addOrRemoveRowsButton: p } = Zr(
    (a == null ? void 0 : a.showAddOrRemoveColumnsButton) || false,
    (a == null ? void 0 : a.showAddOrRemoveRowsButton) || false,
    (a == null ? void 0 : a.referencePosTable) || null
  ), [V, B] = (0, import_react3.useState)(false), [S, I] = (0, import_react3.useState)(false);
  if (!a)
    return null;
  const z2 = e.tableHandle || Dr, j = e.extendButton || Rr, Z = e.tableCellHandle || $r;
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)("div", { ref: o }),
    (0, import_jsx_runtime.jsxs)(FloatingPortal, { root: a.widgetContainer, children: [
      !V && n && m.isMounted && a.rowIndex !== void 0 && (0, import_jsx_runtime.jsx)("div", { ref: m.ref, style: m.style, children: (0, import_jsx_runtime.jsx)(
        z2,
        {
          editor: t,
          orientation: "row",
          showOtherSide: () => I(false),
          hideOtherSide: () => I(true),
          index: a.rowIndex,
          block: a.block,
          dragStart: r.rowDragStart,
          dragEnd: r.dragEnd,
          freezeHandles: r.freezeHandles,
          unfreezeHandles: r.unfreezeHandles,
          menuContainer: n
        }
      ) }),
      !S && n && h.isMounted && a.colIndex !== void 0 && (0, import_jsx_runtime.jsx)("div", { ref: h.ref, style: h.style, children: (0, import_jsx_runtime.jsx)(
        z2,
        {
          editor: t,
          orientation: "column",
          showOtherSide: () => B(false),
          hideOtherSide: () => B(true),
          index: a.colIndex,
          block: a.block,
          dragStart: r.colDragStart,
          dragEnd: r.dragEnd,
          freezeHandles: r.freezeHandles,
          unfreezeHandles: r.unfreezeHandles,
          menuContainer: n
        }
      ) }),
      n && f.isMounted && a.colIndex !== void 0 && a.rowIndex !== void 0 && (0, import_jsx_runtime.jsx)("div", { ref: f.ref, style: f.style, children: (0, import_jsx_runtime.jsx)(
        Z,
        {
          editor: t,
          block: a.block,
          rowIndex: a.rowIndex,
          colIndex: a.colIndex,
          menuContainer: n,
          freezeHandles: r.freezeHandles,
          unfreezeHandles: r.unfreezeHandles
        }
      ) }),
      (0, import_jsx_runtime.jsx)(
        "div",
        {
          ref: p.ref,
          style: p.style,
          children: (0, import_jsx_runtime.jsx)(
            j,
            {
              editor: t,
              orientation: "addOrRemoveRows",
              block: a.block,
              onMouseDown: d,
              onMouseUp: s
            }
          )
        }
      ),
      (0, import_jsx_runtime.jsx)(
        "div",
        {
          ref: H.ref,
          style: H.style,
          children: (0, import_jsx_runtime.jsx)(
            j,
            {
              editor: t,
              orientation: "addOrRemoveColumns",
              block: a.block,
              onMouseDown: d,
              onMouseUp: s
            }
          )
        }
      )
    ] })
  ] });
};
function Kr(e) {
  const t = b();
  if (!t)
    throw new Error(
      "BlockNoteDefaultUI must be used within a BlockNoteContext.Provider"
    );
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    e.formattingToolbar !== false && (0, import_jsx_runtime.jsx)(or, {}),
    e.linkToolbar !== false && (0, import_jsx_runtime.jsx)(ar2, {}),
    e.slashMenu !== false && (0, import_jsx_runtime.jsx)(Lr2, { triggerCharacter: "/" }),
    e.emojiPicker !== false && (0, import_jsx_runtime.jsx)(
      xr,
      {
        triggerCharacter: ":",
        columns: 10,
        minQueryLength: 2
      }
    ),
    e.sideMenu !== false && (0, import_jsx_runtime.jsx)(kr, {}),
    t.filePanel && e.filePanel !== false && (0, import_jsx_runtime.jsx)(No, {}),
    t.tableHandles && e.tableHandles !== false && (0, import_jsx_runtime.jsx)(qr2, {}),
    t.comments && e.comments !== false && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      (0, import_jsx_runtime.jsx)(An, {}),
      (0, import_jsx_runtime.jsx)(Ro, {})
    ] })
  ] });
}
var Xr2 = () => {
  const e = (0, import_react3.useMemo)(
    () => {
      var c;
      return (c = window.matchMedia) == null ? void 0 : c.call(window, "(prefers-color-scheme: dark)");
    },
    []
  ), t = (0, import_react3.useMemo)(
    () => {
      var c;
      return (c = window.matchMedia) == null ? void 0 : c.call(window, "(prefers-color-scheme: light)");
    },
    []
  ), n = e == null ? void 0 : e.matches, o = t == null ? void 0 : t.matches, [r, l] = (0, import_react3.useState)(n ? "dark" : o ? "light" : "no-preference");
  return (0, import_react3.useEffect)(() => {
    l(n ? "dark" : o ? "light" : "no-preference");
  }, [n, o]), (0, import_react3.useEffect)(() => {
    if (typeof (e == null ? void 0 : e.addEventListener) == "function") {
      const c = ({ matches: s }) => s && l("dark"), d = ({ matches: s }) => s && l("light");
      return e == null || e.addEventListener("change", c), t == null || t.addEventListener("change", d), () => {
        e == null || e.removeEventListener("change", c), t == null || t.removeEventListener("change", d);
      };
    } else {
      const c = () => l(
        e.matches ? "dark" : t.matches ? "light" : "no-preference"
      );
      return e == null || e.addEventListener("change", c), t == null || t.addEventListener("change", c), () => {
        e == null || e.removeEventListener("change", c), t == null || t.removeEventListener("change", c);
      };
    }
  }, [e, t]), typeof window.matchMedia != "function", r;
};
var Rt = (0, import_react3.createContext)(void 0);
function Yr() {
  return (0, import_react3.useContext)(Rt);
}
function Jr() {
  const e = /* @__PURE__ */ new Set();
  let t = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(n) {
      return e.add(n), () => {
        e.delete(n);
      };
    },
    getSnapshot() {
      return t;
    },
    getServerSnapshot() {
      return t;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(n, o) {
      t = {
        ...t,
        [n]: (0, import_react_dom4.createPortal)(o.reactElement, o.element, n)
      }, e.forEach((r) => r());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(n) {
      const o = { ...t };
      delete o[n], t = o, e.forEach((r) => r());
    }
  };
}
var Qr = ({
  contentComponent: e
}) => {
  const t = (0, import_react3.useSyncExternalStore)(
    e.subscribe,
    e.getSnapshot,
    e.getServerSnapshot
  );
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: Object.values(t) });
};
var ei = (0, import_react3.forwardRef)((e, t) => {
  const [n, o] = (0, import_react3.useState)();
  return (0, import_react3.useImperativeHandle)(
    t,
    () => (r, l) => {
      (0, import_react_dom4.flushSync)(() => {
        o({ node: r, container: l });
      }), o(void 0);
    },
    []
  ), (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: n && (0, import_react_dom4.createPortal)(n.node, n.container) });
});
var et = () => {
};
function ti(e, t) {
  const {
    editor: n,
    className: o,
    theme: r,
    children: l,
    editable: c,
    onSelectionChange: d,
    onChange: s,
    formattingToolbar: a,
    linkToolbar: u,
    slashMenu: m,
    emojiPicker: h,
    sideMenu: f,
    filePanel: H,
    tableHandles: p,
    comments: V,
    autoFocus: B,
    renderEditor: S = !n.headless,
    ...I
  } = e, [z2, j] = (0, import_react3.useState)(), Z = D(), $ = Xr2(), E = (Z == null ? void 0 : Z.colorSchemePreference) || $, F = r || (E === "dark" ? "dark" : "light");
  ue(s || et, n), se(d || et, n), (0, import_react3.useEffect)(() => {
    n.isEditable = c !== false;
  }, [c, n]);
  const ee2 = (0, import_react3.useCallback)(
    (Dt) => {
      n.elementRenderer = Dt;
    },
    [n]
  ), Nt = (0, import_react3.useMemo)(() => ({
    ...Z,
    editor: n,
    setContentEditableProps: j
  }), [Z, n]), Pt2 = {
    formattingToolbar: a,
    linkToolbar: u,
    slashMenu: m,
    emojiPicker: h,
    sideMenu: f,
    filePanel: H,
    tableHandles: p,
    comments: V
  }, Ot = {
    autoFocus: B,
    contentEditableProps: z2
  };
  return (0, import_jsx_runtime.jsx)(dt.Provider, { value: Nt, children: (0, import_jsx_runtime.jsxs)(
    Rt.Provider,
    {
      value: {
        editorProps: Ot,
        defaultUIProps: Pt2
      },
      children: [
        (0, import_jsx_runtime.jsx)(ei, { ref: ee2 }),
        (0, import_jsx_runtime.jsx)(
          ni,
          {
            className: o,
            renderEditor: S,
            editorColorScheme: F,
            ref: t,
            ...I,
            children: l
          }
        )
      ]
    }
  ) });
}
var ni = import_react3.default.forwardRef(({ className: e, renderEditor: t, editorColorScheme: n, children: o, ...r }, l) => (0, import_jsx_runtime.jsx)(
  "div",
  {
    className: Q("bn-container", n, e),
    "data-color-scheme": n,
    ...r,
    ref: l,
    children: t ? (0, import_jsx_runtime.jsx)(oi, { children: o }) : o
  }
));
var Fi = import_react3.default.forwardRef(ti);
var oi = (e) => {
  const t = Yr(), n = b(), o = (0, import_react3.useMemo)(() => Jr(), []), r = (0, import_react3.useCallback)(
    (l) => {
      n.mount(l, o);
    },
    [n, o]
  );
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(Qr, { contentComponent: o }),
    (0, import_jsx_runtime.jsx)(ri, { ...t.editorProps, ...e, mount: r }),
    (0, import_jsx_runtime.jsx)(Kr, { ...t.defaultUIProps }),
    e.children
  ] });
};
var ri = (e) => {
  const { autoFocus: t, mount: n, contentEditableProps: o } = e;
  return (0, import_jsx_runtime.jsx)(
    "div",
    {
      "aria-autocomplete": "list",
      "aria-haspopup": "listbox",
      "data-bn-autofocus": t,
      ref: n,
      ...o
    }
  );
};
function ie(e, t) {
  let n;
  const o = document.createElement("div");
  let r;
  if (t != null && t.elementRenderer)
    t.elementRenderer(
      e((s) => n = s || void 0),
      o
    );
  else {
    if (!(t != null && t.headless))
      throw new Error(
        "elementRenderer not available, expected headless editor"
      );
    r = (0, import_client.createRoot)(o), (0, import_react_dom4.flushSync)(() => {
      r.render(e((s) => n = s || void 0));
    });
  }
  if (!o.childElementCount)
    return console.warn("ReactInlineContentSpec: renderHTML() failed"), {
      dom: document.createElement("span")
    };
  n == null || n.setAttribute("data-tmp-find", "true");
  const l = o.cloneNode(true), c = l.firstElementChild, d = l.querySelector(
    "[data-tmp-find]"
  );
  return d == null || d.removeAttribute("data-tmp-find"), r == null || r.unmount(), {
    dom: c,
    contentDOM: d || void 0
  };
}
function pe(e) {
  var t;
  return (
    // Creates `blockContent` element
    (0, import_jsx_runtime.jsx)(
      NodeViewWrapper,
      {
        onDragOver: (n) => n.preventDefault(),
        ...Object.fromEntries(
          Object.entries(e.domAttributes || {}).filter(
            ([n]) => n !== "class"
          )
        ),
        className: Q(
          "bn-block-content",
          ((t = e.domAttributes) == null ? void 0 : t.class) || ""
        ),
        "data-content-type": e.blockType,
        ...Object.fromEntries(
          Object.entries(e.blockProps).filter(([n, o]) => {
            const r = e.propSchema[n];
            return !sn.includes(n) && o !== r.default;
          }).map(([n, o]) => [De(n), o])
        ),
        "data-file-block": e.isFileBlock === true || void 0,
        children: e.children
      }
    )
  );
}
function he(e, t) {
  const n = G({
    name: e.type,
    content: e.content === "inline" ? "inline*" : "",
    group: "blockContent",
    selectable: e.isSelectable ?? true,
    isolating: true,
    addAttributes() {
      return Ee(e.propSchema);
    },
    parseHTML() {
      return er(e, t.parse);
    },
    renderHTML({ HTMLAttributes: o }) {
      const r = document.createElement("div");
      return xe(
        {
          dom: r,
          contentDOM: e.content === "inline" ? r : void 0
        },
        e.type,
        {},
        e.propSchema,
        e.isFileBlock,
        o
      );
    },
    addNodeView() {
      return (o) => {
        const r = ReactNodeViewRenderer(
          (l) => {
            var m;
            const c = this.options.editor, d = Zo(
              l.getPos,
              c,
              this.editor,
              e.type
            ), s = ((m = this.options.domAttributes) == null ? void 0 : m.blockContent) || {}, a = useReactNodeView().nodeViewContentRef;
            if (!a)
              throw new Error("nodeViewContentRef is not set");
            const u = t.render;
            return (0, import_jsx_runtime.jsx)(
              pe,
              {
                blockType: d.type,
                blockProps: d.props,
                propSchema: e.propSchema,
                isFileBlock: e.isFileBlock,
                domAttributes: s,
                children: (0, import_jsx_runtime.jsx)(
                  u,
                  {
                    block: d,
                    editor: c,
                    contentRef: (h) => {
                      a(h), h && (h.className = Q(
                        "bn-inline-content",
                        h.className
                      ));
                    }
                  }
                )
              }
            );
          },
          {
            className: "bn-react-node-view-renderer"
          }
        )(o);
        return e.isSelectable === false && Qo(r, this.editor), r;
      };
    }
  });
  return an(e, {
    node: n,
    toInternalHTML: (o, r) => {
      var s;
      const l = ((s = n.options.domAttributes) == null ? void 0 : s.blockContent) || {}, c = t.render;
      return ie(
        (a) => (0, import_jsx_runtime.jsx)(
          pe,
          {
            blockType: o.type,
            blockProps: o.props,
            propSchema: e.propSchema,
            domAttributes: l,
            children: (0, import_jsx_runtime.jsx)(
              c,
              {
                block: o,
                editor: r,
                contentRef: (u) => {
                  a(u), u && (u.className = Q(
                    "bn-inline-content",
                    u.className
                  ));
                }
              }
            )
          }
        ),
        r
      );
    },
    toExternalHTML: (o, r) => {
      var s;
      const l = ((s = n.options.domAttributes) == null ? void 0 : s.blockContent) || {}, c = t.toExternalHTML || t.render;
      return ie((a) => (0, import_jsx_runtime.jsx)(
        pe,
        {
          blockType: o.type,
          blockProps: o.props,
          propSchema: e.propSchema,
          domAttributes: l,
          children: (0, import_jsx_runtime.jsx)(
            c,
            {
              block: o,
              editor: r,
              contentRef: (u) => {
                a(u), u && (u.className = Q(
                  "bn-inline-content",
                  u.className
                ));
              }
            }
          )
        }
      ), r);
    }
  });
}
function Ne(e) {
  const t = b(), [n, o] = (0, import_react3.useState)("loading"), [r, l] = (0, import_react3.useState)();
  if ((0, import_react3.useEffect)(() => {
    let c = true;
    return (async () => {
      let d = "";
      o("loading");
      try {
        d = t.resolveFileUrl ? await t.resolveFileUrl(e) : e;
      } catch {
        o("error");
        return;
      }
      c && (o("loaded"), l(d));
    })(), () => {
      c = false;
    };
  }, [t, e]), n !== "loaded")
    return {
      loadingState: n
    };
  if (!r)
    throw new Error("Finished fetching file but did not get download URL.");
  return {
    loadingState: n,
    downloadUrl: r
  };
}
var Pe = (e) => (0, import_jsx_runtime.jsxs)("figure", { children: [
  e.children,
  (0, import_jsx_runtime.jsx)("figcaption", { children: e.caption })
] });
function ii(e) {
  const t = b();
  (0, import_react3.useEffect)(() => t.onUploadEnd(e), [e, t]);
}
function li(e) {
  const t = b();
  (0, import_react3.useEffect)(() => t.onUploadStart(e), [e, t]);
}
function _t(e) {
  const [t, n] = (0, import_react3.useState)(false);
  return li((o) => {
    o === e && n(true);
  }), ii((o) => {
    o === e && n(false);
  }), t;
}
var ci = (e) => {
  const t = M(), n = (0, import_react3.useCallback)(
    (r) => {
      r.preventDefault();
    },
    []
  ), o = (0, import_react3.useCallback)(() => {
    e.editor.transact(
      (r) => r.setMeta(e.editor.filePanel.plugin, {
        block: e.block
      })
    );
  }, [e.block, e.editor]);
  return (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "bn-add-file-button",
      onMouseDown: n,
      onClick: o,
      children: [
        (0, import_jsx_runtime.jsx)("div", { className: "bn-add-file-button-icon", children: e.buttonIcon || (0, import_jsx_runtime.jsx)(Re, { size: 24 }) }),
        (0, import_jsx_runtime.jsx)("div", { className: "bn-add-file-button-text", children: e.buttonText || t.file_blocks.file.add_button_text })
      ]
    }
  );
};
var ai = (e) => (0, import_jsx_runtime.jsxs)(
  "div",
  {
    className: "bn-file-name-with-icon",
    contentEditable: false,
    draggable: false,
    children: [
      (0, import_jsx_runtime.jsx)("div", { className: "bn-file-icon", children: (0, import_jsx_runtime.jsx)(Re, { size: 24 }) }),
      (0, import_jsx_runtime.jsx)("p", { className: "bn-file-name", children: e.block.props.name })
    ]
  }
);
var Oe = (e) => {
  const t = _t(e.block.id);
  return (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "bn-file-block-content-wrapper",
      onMouseEnter: e.onMouseEnter,
      onMouseLeave: e.onMouseLeave,
      style: e.style,
      children: t ? (
        // Show loader while a file is being uploaded.
        (0, import_jsx_runtime.jsx)("div", { className: "bn-file-loading-preview", children: "Loading..." })
      ) : e.block.props.url === "" ? (
        // Show the add file button if the file has not been uploaded yet.
        (0, import_jsx_runtime.jsx)(ci, { ...e })
      ) : (
        // Show the file preview, or the file name and icon.
        (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          e.block.props.showPreview === false || !e.children ? (
            // Show file name and icon.
            (0, import_jsx_runtime.jsx)(ai, { ...e })
          ) : (
            // Show preview.
            e.children
          ),
          e.block.props.caption && // Show the caption if there is one.
          (0, import_jsx_runtime.jsx)("p", { className: "bn-file-caption", children: e.block.props.caption })
        ] })
      )
    }
  );
};
var fe = (e) => (0, import_jsx_runtime.jsxs)("div", { children: [
  e.children,
  (0, import_jsx_runtime.jsx)("p", { children: e.caption })
] });
var si = (e) => {
  const t = Ne(e.block.props.url);
  return (0, import_jsx_runtime.jsx)(
    "audio",
    {
      className: "bn-audio",
      src: t.loadingState === "loading" ? e.block.props.url : t.downloadUrl,
      controls: true,
      contentEditable: false,
      draggable: false
    }
  );
};
var di = (e) => {
  if (!e.block.props.url)
    return (0, import_jsx_runtime.jsx)("p", { children: "Add audio" });
  const t = e.block.props.showPreview ? (0, import_jsx_runtime.jsx)("audio", { src: e.block.props.url }) : (0, import_jsx_runtime.jsx)("a", { href: e.block.props.url, children: e.block.props.name || e.block.props.url });
  return e.block.props.caption ? e.block.props.showPreview ? (0, import_jsx_runtime.jsx)(Pe, { caption: e.block.props.caption, children: t }) : (0, import_jsx_runtime.jsx)(fe, { caption: e.block.props.caption, children: t }) : t;
};
var ui = (e) => (0, import_jsx_runtime.jsx)(
  Oe,
  {
    ...e,
    buttonText: e.editor.dictionary.file_blocks.audio.add_button_text,
    buttonIcon: (0, import_jsx_runtime.jsx)(Mt, { size: 24 }),
    children: (0, import_jsx_runtime.jsx)(si, { ...e })
  }
);
var Ai = he(Lr, {
  render: ui,
  parse: Nr,
  toExternalHTML: di
});
var mi = (e) => {
  if (!e.block.props.url)
    return (0, import_jsx_runtime.jsx)("p", { children: "Add file" });
  const t = (0, import_jsx_runtime.jsx)("a", { href: e.block.props.url, children: e.block.props.name || e.block.props.url });
  return e.block.props.caption ? (0, import_jsx_runtime.jsx)(fe, { caption: e.block.props.caption, children: t }) : t;
};
var hi = (e) => (0, import_jsx_runtime.jsx)(Oe, { ...e });
var Gi = he(_r, {
  render: hi,
  parse: Fr,
  toExternalHTML: mi
});
var It = (e) => {
  const [t, n] = (0, import_react3.useState)(void 0), [o, r] = (0, import_react3.useState)(
    e.block.props.previewWidth
  ), [l, c] = (0, import_react3.useState)(false), d = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const f = (p) => {
      var S, I;
      let V;
      e.block.props.textAlignment === "center" ? t.handleUsed === "left" ? V = t.initialWidth + (t.initialClientX - p.clientX) * 2 : V = t.initialWidth + (p.clientX - t.initialClientX) * 2 : t.handleUsed === "left" ? V = t.initialWidth + t.initialClientX - p.clientX : V = t.initialWidth + p.clientX - t.initialClientX, r(
        Math.min(
          Math.max(V, 64),
          ((I = (S = e.editor.domElement) == null ? void 0 : S.firstElementChild) == null ? void 0 : I.clientWidth) || Number.MAX_VALUE
        )
      );
    }, H = () => {
      n(void 0), e.editor.updateBlock(e.block, {
        props: {
          previewWidth: o
        }
      });
    };
    return t && (window.addEventListener("mousemove", f), window.addEventListener("mouseup", H)), () => {
      window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", H);
    };
  }, [e, t, o]);
  const s = (0, import_react3.useCallback)(() => {
    e.editor.isEditable && c(true);
  }, [e.editor.isEditable]), a = (0, import_react3.useCallback)(() => {
    c(false);
  }, []), u = (0, import_react3.useCallback)(
    (f) => {
      f.preventDefault(), n({
        handleUsed: "left",
        initialWidth: d.current.clientWidth,
        initialClientX: f.clientX
      });
    },
    []
  ), m = (0, import_react3.useCallback)(
    (f) => {
      f.preventDefault(), n({
        handleUsed: "right",
        initialWidth: d.current.clientWidth,
        initialClientX: f.clientX
      });
    },
    []
  ), h = _t(e.block.id);
  return (0, import_jsx_runtime.jsx)(
    Oe,
    {
      ...e,
      onMouseEnter: s,
      onMouseLeave: a,
      style: e.block.props.url && !h && e.block.props.showPreview ? {
        width: o ? `${o}px` : "fit-content"
      } : void 0,
      children: (0, import_jsx_runtime.jsxs)("div", { className: "bn-visual-media-wrapper", ref: d, children: [
        e.children,
        (l || t) && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "bn-resize-handle",
              style: { left: "4px" },
              onMouseDown: u
            }
          ),
          (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "bn-resize-handle",
              style: { right: "4px" },
              onMouseDown: m
            }
          )
        ] })
      ] })
    }
  );
};
var fi = (e) => {
  const t = Ne(e.block.props.url);
  return (0, import_jsx_runtime.jsx)(
    "img",
    {
      className: "bn-visual-media",
      src: t.loadingState === "loading" ? e.block.props.url : t.downloadUrl,
      alt: e.block.props.caption || "BlockNote image",
      contentEditable: false,
      draggable: false
    }
  );
};
var gi = (e) => {
  if (!e.block.props.url)
    return (0, import_jsx_runtime.jsx)("p", { children: "Add image" });
  const t = e.block.props.showPreview ? (0, import_jsx_runtime.jsx)(
    "img",
    {
      src: e.block.props.url,
      alt: e.block.props.name || e.block.props.caption || "BlockNote image",
      width: e.block.props.previewWidth
    }
  ) : (0, import_jsx_runtime.jsx)("a", { href: e.block.props.url, children: e.block.props.name || e.block.props.url });
  return e.block.props.caption ? e.block.props.showPreview ? (0, import_jsx_runtime.jsx)(Pe, { caption: e.block.props.caption, children: t }) : (0, import_jsx_runtime.jsx)(fe, { caption: e.block.props.caption, children: t }) : t;
};
var bi = (e) => (0, import_jsx_runtime.jsx)(
  It,
  {
    ...e,
    buttonText: e.editor.dictionary.file_blocks.image.add_button_text,
    buttonIcon: (0, import_jsx_runtime.jsx)(Ht, { size: 24 }),
    children: (0, import_jsx_runtime.jsx)(fi, { ...e })
  }
);
var Ui = he(qr, {
  render: bi,
  parse: Xr,
  toExternalHTML: gi
});
function Ci(e) {
  return k({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M14 3v4a1 1 0 0 0 1 1h4" }, child: [] }, { tag: "path", attr: { d: "M19 18v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1" }, child: [] }, { tag: "path", attr: { d: "M3 14h3m4.5 0h3m4.5 0h3" }, child: [] }, { tag: "path", attr: { d: "M5 10v-5a2 2 0 0 1 2 -2h7l5 5v2" }, child: [] }] })(e);
}
var pi = {
  page_break: Ci
};
function zi(e) {
  return Ac(e).map((t) => {
    const n = pi[t.key];
    return {
      ...t,
      icon: (0, import_jsx_runtime.jsx)(n, { size: 18 })
    };
  });
}
var ki = (e) => {
  const t = Ne(e.block.props.url);
  return (0, import_jsx_runtime.jsx)(
    "video",
    {
      className: "bn-visual-media",
      src: t.loadingState === "loading" ? e.block.props.url : t.downloadUrl,
      controls: true,
      contentEditable: false,
      draggable: false
    }
  );
};
var wi = (e) => {
  if (!e.block.props.url)
    return (0, import_jsx_runtime.jsx)("p", { children: "Add video" });
  const t = e.block.props.showPreview ? (0, import_jsx_runtime.jsx)("video", { src: e.block.props.url }) : (0, import_jsx_runtime.jsx)("a", { href: e.block.props.url, children: e.block.props.name || e.block.props.url });
  return e.block.props.caption ? e.block.props.showPreview ? (0, import_jsx_runtime.jsx)(Pe, { caption: e.block.props.caption, children: t }) : (0, import_jsx_runtime.jsx)(fe, { caption: e.block.props.caption, children: t }) : t;
};
var vi = (e) => (0, import_jsx_runtime.jsx)(
  It,
  {
    ...e,
    buttonText: e.editor.dictionary.file_blocks.video.add_button_text,
    buttonIcon: (0, import_jsx_runtime.jsx)(Co, { size: 24 }),
    children: (0, import_jsx_runtime.jsx)(ki, { ...e })
  }
);
var ji = he(As, {
  render: vi,
  parse: Hs,
  toExternalHTML: wi
});
var Wi = (e) => {
  const [t, n] = (0, import_react3.useState)("none"), o = (0, import_react3.useRef)(null), r = b(), l = O(
    r.formattingToolbar.onUpdate.bind(r.formattingToolbar)
  ), c = (0, import_react3.useMemo)(() => ({
    display: "flex",
    position: "fixed",
    bottom: 0,
    zIndex: 3e3,
    transform: t
  }), [t]);
  if ((0, import_react3.useEffect)(() => {
    const s = window.visualViewport;
    function a() {
      const u = document.body, m = s.offsetLeft, h = s.height - u.getBoundingClientRect().height + s.offsetTop;
      n(
        `translate(${m}px, ${h}px) scale(${1 / s.scale})`
      );
    }
    return window.visualViewport.addEventListener("scroll", a), window.visualViewport.addEventListener("resize", a), a(), () => {
      window.visualViewport.removeEventListener("scroll", a), window.visualViewport.removeEventListener("resize", a);
    };
  }, []), !l)
    return null;
  if (!l.show && o.current)
    return (0, import_jsx_runtime.jsx)(
      "div",
      {
        ref: o,
        style: c,
        dangerouslySetInnerHTML: { __html: o.current.innerHTML }
      }
    );
  const d = e.formattingToolbar || St;
  return (0, import_jsx_runtime.jsx)("div", { ref: o, style: c, children: (0, import_jsx_runtime.jsx)(d, {}) });
};
var Hi = import_react3.default.memo(
  ({
    thread: e,
    selectedThreadId: t,
    editor: n,
    maxCommentsBeforeCollapse: o,
    referenceText: r
  }) => {
    const l = (0, import_react3.useCallback)(
      (d) => {
        var s;
        d.target.closest(".bn-action-toolbar") || (s = n.comments) == null || s.selectThread(e.id);
      },
      [n.comments, e.id]
    ), c = (0, import_react3.useCallback)(
      (d) => {
        var u;
        if (!d.relatedTarget || d.relatedTarget.closest(".bn-action-toolbar"))
          return;
        const s = d.target instanceof Node ? d.target : null, a = d.relatedTarget instanceof Node ? d.relatedTarget.closest(".bn-thread") : null;
        (!s || !a || !a.contains(s)) && ((u = n.comments) == null || u.selectThread(void 0));
      },
      [n.comments]
    );
    return (0, import_jsx_runtime.jsx)(
      xt,
      {
        thread: e,
        selected: e.id === t,
        referenceText: r,
        maxCommentsBeforeCollapse: o,
        onFocus: l,
        onBlur: c,
        tabIndex: 0
      }
    );
  }
);
function Mi(e, t, n) {
  if (t === "recent-activity")
    return e.sort(
      (o, r) => r.comments[r.comments.length - 1].createdAt.getTime() - o.comments[o.comments.length - 1].createdAt.getTime()
    );
  if (t === "oldest")
    return e.sort(
      (o, r) => o.createdAt.getTime() - r.createdAt.getTime()
    );
  if (t === "position")
    return e.sort((o, r) => {
      var d, s;
      const l = ((d = n == null ? void 0 : n.get(o.id)) == null ? void 0 : d.from) || Number.MAX_VALUE, c = ((s = n == null ? void 0 : n.get(r.id)) == null ? void 0 : s.from) || Number.MAX_VALUE;
      return l - c;
    });
  throw new z(t);
}
function tt(e, t) {
  return e.transact((n) => {
    if (!t)
      return "Original content deleted";
    if (n.doc.nodeSize < t.to)
      return "";
    const o = n.doc.textBetween(
      t.from,
      t.to
    );
    return o.length > 15 ? `${o.slice(0, 15)}…` : o;
  });
}
function $i(e) {
  const t = b();
  if (!t.comments)
    throw new Error("Comments plugin not found");
  const n = O(
    t.comments.onUpdate.bind(t.comments)
  ), o = n == null ? void 0 : n.selectedThreadId, r = yt(t), l = (0, import_react3.useMemo)(() => {
    const c = Array.from(r.values()), d = Mi(
      c,
      e.sort || "position",
      n == null ? void 0 : n.threadPositions
    ), s = [];
    for (const a of d)
      a.resolved ? (e.filter === "resolved" || e.filter === "all") && s.push({
        thread: a,
        referenceText: tt(
          t,
          n == null ? void 0 : n.threadPositions.get(a.id)
        )
      }) : (e.filter === "open" || e.filter === "all") && s.push({
        thread: a,
        referenceText: tt(
          t,
          n == null ? void 0 : n.threadPositions.get(a.id)
        )
      });
    return s;
  }, [r, n == null ? void 0 : n.threadPositions, e.filter, e.sort, t]);
  return (0, import_jsx_runtime.jsx)("div", { className: "bn-threads-sidebar", children: l.map((c) => (0, import_jsx_runtime.jsx)(
    Hi,
    {
      thread: c.thread,
      selectedThreadId: o,
      editor: t,
      referenceText: c.referenceText,
      maxCommentsBeforeCollapse: e.maxCommentsBeforeCollapse
    },
    c.thread.id
  )) });
}
function qi(e) {
  const t = D();
  if (e || (e = t == null ? void 0 : t.editor), !e)
    throw new Error(
      "'editor' is required, either from BlockNoteContext or as a function argument"
    );
  const n = e, [o, r] = (0, import_react3.useState)(() => n.getActiveStyles());
  return ue(() => {
    r(n.getActiveStyles());
  }, n), se(() => {
    r(n.getActiveStyles());
  }, n), o;
}
function xi() {
  const [, e] = (0, import_react3.useState)(0);
  return () => e((t) => t + 1);
}
var Ki = (e) => {
  const t = xi();
  (0, import_react3.useEffect)(() => {
    const n = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          t();
        });
      });
    };
    return e.on("transaction", n), () => {
      e.off("transaction", n);
    };
  }, [e]);
};
function yi(e) {
  return e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof HTMLElement ? e.currentTarget.contains(e.relatedTarget) : false;
}
function Xi({
  onBlur: e,
  onFocus: t
} = {}) {
  const n = (0, import_react3.useRef)(null), [o, r] = (0, import_react3.useState)(false), l = (0, import_react3.useRef)(false), c = (a) => {
    r(a), l.current = a;
  }, d = (a) => {
    l.current || (c(true), t == null || t(a));
  }, s = (a) => {
    l.current && !yi(a) && (c(false), e == null || e(a));
  };
  return (0, import_react3.useEffect)(() => {
    const a = n.current;
    if (a)
      return a.addEventListener("focusin", d), a.addEventListener("focusout", s), () => {
        a == null || a.removeEventListener("focusin", d), a == null || a.removeEventListener("focusout", s);
      };
  }, [d, s]), { ref: n, focused: o };
}
function Bi(e) {
  return (
    // Creates inline content section element
    (0, import_jsx_runtime.jsx)(
      NodeViewWrapper,
      {
        as: "span",
        className: "bn-inline-content-section",
        "data-inline-content-type": e.inlineContentType,
        ...Object.fromEntries(
          Object.entries(e.inlineContentProps).filter(([t, n]) => {
            const o = e.propSchema[t];
            return n !== o.default;
          }).map(([t, n]) => [De(t), n])
        ),
        children: e.children
      }
    )
  );
}
function Yi(e, t) {
  const n = G({
    name: e.type,
    inline: true,
    group: "inline",
    selectable: e.content === "styled",
    atom: e.content === "none",
    content: e.content === "styled" ? "inline*" : "",
    addAttributes() {
      return Ee(e.propSchema);
    },
    addKeyboardShortcuts() {
      return rr(e);
    },
    parseHTML() {
      return ar(e);
    },
    renderHTML({ node: o }) {
      const r = this.options.editor, l = rt(
        o,
        r.schema.inlineContentSchema,
        r.schema.styleSchema
      ), c = t.render, d = ie(
        (s) => (0, import_jsx_runtime.jsx)(
          c,
          {
            inlineContent: l,
            updateInlineContent: () => {
            },
            contentRef: s
          }
        ),
        r
      );
      return Pt(
        d,
        e.type,
        o.attrs,
        e.propSchema
      );
    },
    // TODO: needed?
    addNodeView() {
      const o = this.options.editor;
      return (r) => ReactNodeViewRenderer(
        (l) => {
          const c = useReactNodeView().nodeViewContentRef;
          if (!c)
            throw new Error("nodeViewContentRef is not set");
          const d = t.render;
          return (0, import_jsx_runtime.jsx)(
            Bi,
            {
              inlineContentProps: l.node.attrs,
              inlineContentType: e.type,
              propSchema: e.propSchema,
              children: (0, import_jsx_runtime.jsx)(
                d,
                {
                  contentRef: c,
                  inlineContent: rt(
                    l.node,
                    o.schema.inlineContentSchema,
                    o.schema.styleSchema
                  ),
                  updateInlineContent: (s) => {
                    const a = _(
                      [s],
                      o.pmSchema
                    );
                    o.transact(
                      (u) => u.replaceWith(
                        l.getPos(),
                        l.getPos() + l.node.nodeSize,
                        a
                      )
                    );
                  }
                }
              )
            }
          );
        },
        {
          className: "bn-ic-react-node-view-renderer",
          as: "span"
          // contentDOMElementTag: "span", (requires tt upgrade)
        }
      )(r);
    }
  });
  return sr(e, {
    node: n
  });
}
var Y;
var He;
var Vi = class {
  constructor({
    mark: t,
    view: n,
    inline: o,
    options: r,
    editor: l
    // BlockNote specific
  }) {
    Ze(this, Y);
    L(this, "dom");
    L(this, "contentDOM");
    L(this, "mark");
    L(this, "view");
    L(this, "inline");
    L(this, "options");
    L(this, "editor");
    L(this, "shouldIgnoreMutation", (t2) => !this.dom || !this.contentDOM ? true : t2.type === "selection" ? false : this.contentDOM === t2.target && t2.type === "attributes" ? true : !this.contentDOM.contains(t2.target));
    L(this, "ignoreMutation", (t2) => {
      if (!this.dom || !this.contentDOM) return true;
      let n2;
      const o2 = this.options.ignoreMutation;
      return o2 && (n2 = o2(t2)), typeof n2 != "boolean" && (n2 = this.shouldIgnoreMutation(t2)), n2;
    });
    this.mark = t, this.view = n, this.inline = o, this.options = r, this.editor = l, this.dom = this.createDOM(r.as), this.contentDOM = r.contentAs ? this.createContentDOM(r.contentAs) : void 0, this.dom.setAttribute("data-mark-view-root", "true"), this.contentDOM && (this.contentDOM.setAttribute("data-mark-view-content", "true"), this.contentDOM.style.whiteSpace = "inherit");
  }
  createDOM(t) {
    return ge(this, Y, He).call(this, t);
  }
  createContentDOM(t) {
    return ge(this, Y, He).call(this, t);
  }
  get component() {
    return this.options.component;
  }
  destroy() {
    var t, n, o;
    (n = (t = this.options).destroy) == null || n.call(t), this.dom.remove(), (o = this.contentDOM) == null || o.remove();
  }
};
Y = /* @__PURE__ */ new WeakSet(), He = function(t) {
  const { inline: n, mark: o } = this;
  return t == null ? document.createElement(n ? "span" : "div") : t instanceof HTMLElement ? t : t instanceof Function ? t(o) : document.createElement(t);
};
var Si = class extends Vi {
  constructor() {
    super(...arguments);
    L(this, "id", Math.floor(Math.random() * 4294967295).toString());
    L(this, "context", {
      contentRef: (n) => {
        n && this.contentDOM && n.firstChild !== this.contentDOM && n.appendChild(this.contentDOM);
      },
      view: this.view,
      mark: this.mark
    });
    L(this, "updateContext", () => {
      Object.assign(this.context, {
        mark: this.mark
      });
    });
    L(this, "render", () => {
      this.editor._tiptapEditor.contentComponent.setRenderer(
        this.id,
        this.renderer()
      );
    });
    L(this, "destroy", () => {
      super.destroy(), this.editor._tiptapEditor.contentComponent.removeRenderer(this.id);
    });
    L(this, "renderer", () => {
      const n = this.component, o = {};
      return this.mark.attrs.stringValue && (o.value = this.mark.attrs.stringValue), {
        reactElement: (
          // <markViewContext.Provider value={this.context}>
          (0, import_jsx_runtime.jsx)(n, { contentRef: this.context.contentRef, ...o })
        ),
        element: this.dom
      };
    });
  }
};
function Ji(e, t) {
  const n = Mark.create({
    name: e.type,
    addAttributes() {
      return cr(e.propSchema);
    },
    parseHTML() {
      return dr(e);
    },
    renderHTML({ mark: o }) {
      const r = {};
      e.propSchema === "string" && (r.value = o.attrs.stringValue);
      const l = t.render, c = ie(
        (d) => (0, import_jsx_runtime.jsx)(l, { ...r, contentRef: d }),
        this.options.editor
      );
      return lr(
        c,
        e.type,
        o.attrs.stringValue,
        e.propSchema
      );
    }
  });
  return n.config.addMarkView = (o) => (r, l) => {
    const c = new Si({
      editor: o,
      inline: true,
      mark: r,
      options: {
        component: t.render,
        contentAs: "span"
      },
      view: l
    });
    return c.render(), c;
  }, pn(e, {
    mark: n
  });
}
function Qi(e, t) {
  const n = e.getBoundingClientRect(), o = t.getBoundingClientRect(), r = n.top < o.top, l = n.bottom > o.bottom;
  return r && l ? "both" : r ? "top" : l ? "bottom" : "none";
}

export {
  useMergeRefs,
  useHover,
  FloatingDelayGroup,
  useDelayGroup,
  useDismiss,
  useFloating2 as useFloating,
  useFocus,
  useInteractions,
  useRole,
  dt,
  D,
  b,
  se,
  On,
  C,
  de,
  Oi,
  M,
  ue,
  Fn,
  An,
  So,
  Ie,
  Lo,
  Eo,
  xt,
  yt,
  Ro,
  _o,
  Io,
  Bt,
  No,
  U,
  Po,
  _2 as _,
  ne,
  Zo2 as Zo,
  Vt2 as Vt,
  Ao,
  Go,
  Uo,
  zo,
  jo,
  Wo,
  $o,
  qo,
  Ko,
  Xo,
  Yo,
  Jo,
  Qo2 as Qo,
  er2 as er,
  be,
  nr,
  St,
  or,
  rr2 as rr,
  ir,
  lr2 as lr,
  cr2 as cr,
  ar2 as ar,
  dr2 as dr,
  mr,
  hr,
  fr,
  gr,
  br,
  Cr,
  pr,
  kr,
  wr,
  Lt,
  Et,
  Hr,
  Mr,
  xr,
  Br,
  Vr,
  Tr,
  Lr2 as Lr,
  Rr,
  Je,
  _r2 as _r,
  Or,
  Dr,
  Zr,
  Ur,
  zr,
  jr,
  Wr,
  $r,
  qr2 as qr,
  Kr,
  Xr2 as Xr,
  Fi,
  oi,
  pe,
  he,
  Ne,
  Pe,
  ci,
  ai,
  Oe,
  fe,
  si,
  di,
  ui,
  Ai,
  mi,
  hi,
  Gi,
  It,
  fi,
  gi,
  bi,
  Ui,
  zi,
  ki,
  wi,
  vi,
  ji,
  Wi,
  tt,
  $i,
  qi,
  Ki,
  Xi,
  Bi,
  Yi,
  Ji,
  Qi
};
/*! Bundled license information:

@tiptap/react/dist/index.js:
  (**
   * @license React
   * use-sync-external-store-shim.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@tiptap/react/dist/index.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@tiptap/react/dist/index.js:
  (**
   * @license React
   * use-sync-external-store-shim/with-selector.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@tiptap/react/dist/index.js:
  (**
   * @license React
   * use-sync-external-store-shim/with-selector.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=chunk-IRX7NKVQ.js.map
