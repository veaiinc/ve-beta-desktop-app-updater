import {
  fromDom
} from "./chunk-AROZCQJN.js";
import {
  toText
} from "./chunk-TRNZY2J4.js";
import "./chunk-LDIYPDOD.js";
import {
  katex
} from "./chunk-AUIMHLKI.js";
import "./chunk-UFFYVJKJ.js";
import "./chunk-RD5NBWLL.js";
import {
  SKIP,
  visitParents
} from "./chunk-OVENAMZE.js";
import "./chunk-LK32TJAX.js";

// node_modules/hast-util-from-html-isomorphic/lib/browser.js
var parser = new DOMParser();
function fromHtmlIsomorphic(value, options) {
  const node = (options == null ? void 0 : options.fragment) ? parseFragment(value) : parser.parseFromString(value, "text/html");
  return (
    /** @type {Root} */
    fromDom(node)
  );
}
function parseFragment(value) {
  const template = document.createElement("template");
  template.innerHTML = value;
  return template.content;
}

// node_modules/rehype-katex/lib/index.js
var emptyOptions = {};
var emptyClasses = [];
function rehypeKatex(options) {
  const settings = options || emptyOptions;
  return function(tree, file) {
    visitParents(tree, "element", function(element, parents) {
      const classes = Array.isArray(element.properties.className) ? element.properties.className : emptyClasses;
      const languageMath = classes.includes("language-math");
      const mathDisplay = classes.includes("math-display");
      const mathInline = classes.includes("math-inline");
      let displayMode = mathDisplay;
      if (!languageMath && !mathDisplay && !mathInline) {
        return;
      }
      let parent = parents[parents.length - 1];
      let scope = element;
      if (element.tagName === "code" && languageMath && parent && parent.type === "element" && parent.tagName === "pre") {
        scope = parent;
        parent = parents[parents.length - 2];
        displayMode = true;
      }
      if (!parent) return;
      const value = toText(scope, { whitespace: "pre" });
      let result;
      try {
        result = katex.renderToString(value, {
          ...settings,
          displayMode,
          throwOnError: true
        });
      } catch (error) {
        const cause = (
          /** @type {Error} */
          error
        );
        const ruleId = cause.name.toLowerCase();
        file.message("Could not render math with KaTeX", {
          ancestors: [...parents, element],
          cause,
          place: element.position,
          ruleId,
          source: "rehype-katex"
        });
        try {
          result = katex.renderToString(value, {
            ...settings,
            displayMode,
            strict: "ignore",
            throwOnError: false
          });
        } catch {
          result = [
            {
              type: "element",
              tagName: "span",
              properties: {
                className: ["katex-error"],
                style: "color:" + (settings.errorColor || "#cc0000"),
                title: String(error)
              },
              children: [{ type: "text", value }]
            }
          ];
        }
      }
      if (typeof result === "string") {
        const root = fromHtmlIsomorphic(result, { fragment: true });
        result = /** @type {Array<ElementContent>} */
        root.children;
      }
      const index = parent.children.indexOf(scope);
      parent.children.splice(index, 1, ...result);
      return SKIP;
    });
  };
}
export {
  rehypeKatex as default
};
//# sourceMappingURL=rehype-katex.js.map
