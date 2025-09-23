import {
  _isNativeReflectConstruct,
  init_isNativeReflectConstruct
} from "./chunk-UID3PQOG.js";
import {
  _getPrototypeOf,
  _possibleConstructorReturn,
  init_getPrototypeOf,
  init_possibleConstructorReturn
} from "./chunk-GBTMEJPM.js";
import {
  __esm
} from "./chunk-LK32TJAX.js";

// node_modules/@babel/runtime/helpers/esm/createSuper.js
function _createSuper(t) {
  var r = _isNativeReflectConstruct();
  return function() {
    var e, o = _getPrototypeOf(t);
    if (r) {
      var s = _getPrototypeOf(this).constructor;
      e = Reflect.construct(o, arguments, s);
    } else e = o.apply(this, arguments);
    return _possibleConstructorReturn(this, e);
  };
}
var init_createSuper = __esm({
  "node_modules/@babel/runtime/helpers/esm/createSuper.js"() {
    init_getPrototypeOf();
    init_isNativeReflectConstruct();
    init_possibleConstructorReturn();
  }
});

export {
  _createSuper,
  init_createSuper
};
//# sourceMappingURL=chunk-D425S4AF.js.map
