import "./chunk-LK32TJAX.js";

// node_modules/image-focus/dist/image-focus.esm.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var noop = function noop2() {
};
function assign(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }
  sources.forEach(function(source) {
    return Object.keys(source).forEach(function(key) {
      return target[key] = source[key];
    });
  });
  return target;
}
var CONTAINER_STYLES = {
  position: "relative",
  overflow: "hidden"
};
var ABSOLUTE_STYLES = {
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0"
};
var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e %3cg fill='none' fill-rule='evenodd'%3e %3ccircle id='a' cx='10' cy='10' r='10' fill='black' fill-opacity='.3' /%3e %3ccircle cx='10' cy='10' r='9' stroke='white' stroke-opacity='.8' stroke-width='2'/%3e %3c/g%3e%3c/svg%3e";
var IMAGE_STYLES = {
  // Get rid of bottom padding from default display
  display: "block",
  // Make image fill container
  maxWidth: "100%",
  // Prevent Android refresh on pull down
  touchAction: "none"
};
var RETINA_STYLES = {
  position: "absolute",
  cursor: "move",
  // Center the retina
  transform: "translate(-50%, -50%)"
};
var DEFAULT_OPTIONS = {
  onChange: noop,
  retina: img
};
var FocusPicker = function() {
  function FocusPicker2(imageNode, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    this._enabled = false;
    this.startDragging = function(e) {
      e.preventDefault();
      _this.isDragging = true;
      e instanceof MouseEvent ? _this.updateCoordinates(e.clientX, e.clientY) : _this.updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    };
    this.handleMove = function(e) {
      e.preventDefault();
      if (e instanceof MouseEvent) {
        _this.updateCoordinates(e.clientX, e.clientY);
      } else {
        var touch = e.touches[0];
        var touchedEl = document.elementFromPoint(touch.pageX, touch.pageY);
        touchedEl !== _this.retina && touchedEl !== _this.img ? _this.stopDragging() : _this.updateCoordinates(touch.clientX, touch.clientY);
      }
    };
    this.stopDragging = function() {
      _this.isDragging = false;
    };
    this.updateRetinaPositionFromFocus = function() {
      _this.updateRetinaPosition(_this.calculateOffsetFromFocus());
    };
    this.updateRetinaPosition = function(offsets) {
      _this.retina.style.top = offsets.offsetY + "px";
      _this.retina.style.left = offsets.offsetX + "px";
    };
    this.options = assign({}, DEFAULT_OPTIONS, options);
    this.img = imageNode;
    this.container = imageNode.parentElement;
    this.img.draggable = false;
    assign(this.img.style, IMAGE_STYLES);
    assign(this.container.style, CONTAINER_STYLES);
    this.focus = this.getFocus();
    this.enable();
  }
  var _proto = FocusPicker2.prototype;
  _proto.getFocus = function getFocus() {
    return this.options.focus ? this.options.focus : {
      x: parseFloat(this.img.getAttribute("data-focus-x")) || 0,
      y: parseFloat(this.img.getAttribute("data-focus-y")) || 0
    };
  };
  _proto.enable = function enable() {
    if (!this._enabled) {
      this.retina = document.createElement("img");
      this.retina.src = this.options.retina;
      this.retina.draggable = false;
      this.container.appendChild(this.retina);
      assign(this.retina.style, RETINA_STYLES);
      this.startListening();
      this.setFocus(this.focus);
      this._enabled = true;
    }
  };
  _proto.disable = function disable() {
    if (this._enabled && this.retina) {
      this.stopListening();
      this.container.removeChild(this.retina);
      this._enabled = false;
    }
  };
  _proto.startListening = function startListening() {
    this.container.addEventListener("mousedown", this.startDragging);
    this.container.addEventListener("mousemove", this.handleMove);
    this.container.addEventListener("mouseup", this.stopDragging);
    this.container.addEventListener("mouseleave", this.stopDragging);
    this.container.addEventListener("touchend", this.stopDragging);
    this.container.addEventListener("touchstart", this.startDragging, {
      passive: true
    });
    this.container.addEventListener("touchmove", this.handleMove, {
      passive: true
    });
    this.img.addEventListener("load", this.updateRetinaPositionFromFocus);
  };
  _proto.stopListening = function stopListening() {
    this.container.removeEventListener("mousedown", this.startDragging);
    this.container.removeEventListener("mousemove", this.handleMove);
    this.container.removeEventListener("mouseup", this.stopDragging);
    this.container.removeEventListener("mouseleave", this.stopDragging);
    this.container.removeEventListener("touchend", this.stopDragging);
    this.container.removeEventListener("touchstart", this.startDragging);
    this.container.removeEventListener("touchmove", this.handleMove);
    this.img.removeEventListener("load", this.updateRetinaPositionFromFocus);
  };
  _proto.setFocus = function setFocus(focus) {
    this.focus = focus;
    this.img.setAttribute("data-focus-x", focus.x.toString());
    this.img.setAttribute("data-focus-y", focus.y.toString());
    this.updateRetinaPositionFromFocus();
    this.options.onChange(focus);
  };
  _proto.calculateOffsetFromFocus = function calculateOffsetFromFocus() {
    var _this$img$getBounding = this.img.getBoundingClientRect(), width = _this$img$getBounding.width, height = _this$img$getBounding.height;
    var offsetX = width * (this.focus.x / 2 + 0.5);
    var offsetY = height * (this.focus.y / -2 + 0.5);
    return {
      offsetX,
      offsetY
    };
  };
  _proto.updateCoordinates = function updateCoordinates(clientX, clientY) {
    if (!this.isDragging) return;
    var _this$img$getBounding2 = this.img.getBoundingClientRect(), width = _this$img$getBounding2.width, height = _this$img$getBounding2.height, left = _this$img$getBounding2.left, top = _this$img$getBounding2.top;
    var offsetX = clientX - left;
    var offsetY = clientY - top;
    var x = (offsetX / width - 0.5) * 2;
    var y = (offsetY / height - 0.5) * -2;
    this.setFocus({
      x,
      y
    });
  };
  _createClass(FocusPicker2, [{
    key: "enabled",
    get: function get() {
      return this._enabled;
    }
  }]);
  return FocusPicker2;
}();
function debounce(func, debounceTime) {
  var timeout;
  return function debouncedFunction() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      return func.apply(void 0, args);
    }, debounceTime);
  };
}
var IMG_STYLES = {
  // Set these styles in case the image dimensions
  // are smaller than the container's
  minHeight: "100%",
  minWidth: "100%"
};
var RESIZE_LISTENER_OBJECT_STYLES = {
  height: "100%",
  width: "100%",
  border: "none",
  // set these styles to emulate "visibility: hidden"
  // can't use visibility because it breaks the object
  // events in Firefox
  opacity: 0,
  zIndex: -1,
  pointerEvents: "none"
};
var DEFAULT_OPTIONS$1 = {
  debounceTime: 17,
  updateOnWindowResize: true,
  updateOnContainerResize: false,
  containerPosition: "relative"
};
var FocusedImage = function() {
  function FocusedImage2(imageNode, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    this.imageNode = imageNode;
    this.listening = false;
    this.setFocus = function(focus) {
      _this.focus = focus;
      _this.img.setAttribute("data-focus-x", focus.x.toString());
      _this.img.setAttribute("data-focus-y", focus.y.toString());
      _this.applyShift();
    };
    this.applyShift = function() {
      var _this$img = _this.img, imageW = _this$img.naturalWidth, imageH = _this$img.naturalHeight;
      var _this$container$getBo = _this.container.getBoundingClientRect(), containerW = _this$container$getBo.width, containerH = _this$container$getBo.height;
      var hShift = "0";
      var vShift = "0";
      if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
        return false;
      }
      var wR = imageW / containerW;
      var hR = imageH / containerH;
      _this.img.style.maxHeight = null;
      _this.img.style.maxWidth = null;
      if (imageW > containerW && imageH > containerH) {
        _this.img.style[wR > hR ? "maxHeight" : "maxWidth"] = "100%";
      }
      if (wR > hR) {
        hShift = _this.calcShift(hR, containerW, imageW, _this.focus.x) + "%";
      } else if (wR < hR) {
        vShift = _this.calcShift(wR, containerH, imageH, _this.focus.y, true) + "%";
      }
      _this.img.style.top = vShift;
      _this.img.style.left = hShift;
    };
    this.options = assign(DEFAULT_OPTIONS$1, options);
    this.img = imageNode;
    this.container = imageNode.parentElement;
    if (this.img["__focused_image_instance__"]) {
      this.img["__focused_image_instance__"].stopListening();
      this.img.removeEventListener("load", this.applyShift);
    }
    this.img["__focused_image_instance__"] = this;
    this.img.addEventListener("load", this.applyShift);
    assign(this.container.style, CONTAINER_STYLES);
    this.container.style.position = this.options.containerPosition;
    assign(this.img.style, IMG_STYLES, ABSOLUTE_STYLES);
    this.debounceApplyShift = debounce(this.applyShift, this.options.debounceTime);
    this.focus = this.options.focus ? this.options.focus : {
      x: parseFloat(this.img.getAttribute("data-focus-x")) || 0,
      y: parseFloat(this.img.getAttribute("data-focus-y")) || 0
    };
    this.startListening();
    this.setFocus(this.focus);
  }
  var _proto = FocusedImage2.prototype;
  _proto.startListening = function startListening() {
    var _this2 = this;
    if (this.listening) {
      return;
    }
    this.listening = true;
    if (this.options.updateOnWindowResize) {
      window.addEventListener("resize", this.debounceApplyShift);
    }
    if (this.options.updateOnContainerResize) {
      var object = document.createElement("object");
      assign(object.style, RESIZE_LISTENER_OBJECT_STYLES, ABSOLUTE_STYLES);
      object.addEventListener("load", function(e) {
        return object.contentDocument.defaultView.addEventListener("resize", function() {
          return _this2.debounceApplyShift();
        });
      });
      object.type = "text/html";
      object.setAttribute("aria-hidden", "true");
      object.tabIndex = -1;
      this.container.appendChild(object);
      object.data = "about:blank";
      this.resizeListenerObject = object;
    }
  };
  _proto.stopListening = function stopListening() {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    window.removeEventListener("resize", this.debounceApplyShift);
    if (this.resizeListenerObject && this.resizeListenerObject.contentDocument) {
      this.resizeListenerObject.contentDocument.defaultView.removeEventListener("resize", this.debounceApplyShift);
      this.container.removeChild(this.resizeListenerObject);
      this.resizeListenerObject = null;
    }
  };
  _proto.calcShift = function calcShift(conToImageRatio, containerSize, imageSize, focusSize, toMinus) {
    var containerCenter = Math.floor(containerSize / 2);
    var focusFactor = (focusSize + 1) / 2;
    var scaledImage = Math.floor(imageSize / conToImageRatio);
    var focus = Math.floor(focusFactor * scaledImage);
    if (toMinus) focus = scaledImage - focus;
    var focusOffset = focus - containerCenter;
    var remainder = scaledImage - focus;
    var containerRemainder = containerSize - containerCenter;
    if (remainder < containerRemainder) focusOffset -= containerRemainder - remainder;
    if (focusOffset < 0) focusOffset = 0;
    return focusOffset * -100 / containerSize;
  };
  return FocusedImage2;
}();
export {
  FocusPicker,
  FocusedImage
};
//# sourceMappingURL=image-focus.js.map
