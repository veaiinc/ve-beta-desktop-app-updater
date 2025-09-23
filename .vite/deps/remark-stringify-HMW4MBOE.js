import {
  toMarkdown
} from "./chunk-QQ7CMB2E.js";
import "./chunk-STW544GQ.js";
import "./chunk-O7RNMSX7.js";
import "./chunk-KHEGHKHT.js";
import "./chunk-XDFOY3CK.js";
import "./chunk-7RAZHLRA.js";
import "./chunk-ZEVC2AKJ.js";
import "./chunk-AZUNA3UN.js";
import "./chunk-OVENAMZE.js";
import "./chunk-LK32TJAX.js";

// node_modules/remark-stringify/lib/index.js
function remarkStringify(options) {
  const self = this;
  self.compiler = compiler;
  function compiler(tree) {
    return toMarkdown(tree, {
      ...self.data("settings"),
      ...options,
      // Note: this option is not in the readme.
      // The goal is for it to be set by plugins on `data` instead of being
      // passed by users.
      extensions: self.data("toMarkdownExtensions") || []
    });
  }
}
export {
  remarkStringify as default
};
//# sourceMappingURL=remark-stringify-HMW4MBOE.js.map
