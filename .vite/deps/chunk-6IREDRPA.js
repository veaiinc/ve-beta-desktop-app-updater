import {
  convertElement,
  isElement
} from "./chunk-LDIYPDOD.js";
import {
  whitespace
} from "./chunk-SKNEHNFT.js";
import {
  convert
} from "./chunk-OVENAMZE.js";

// node_modules/hast-util-embedded/lib/index.js
var embedded = convertElement(
  /**
   * @param element
   * @returns {element is {tagName: 'audio' | 'canvas' | 'embed' | 'iframe' | 'img' | 'math' | 'object' | 'picture' | 'svg' | 'video'}}
   */
  function(element) {
    return element.tagName === "audio" || element.tagName === "canvas" || element.tagName === "embed" || element.tagName === "iframe" || element.tagName === "img" || element.tagName === "math" || element.tagName === "object" || element.tagName === "picture" || element.tagName === "svg" || element.tagName === "video";
  }
);

// node_modules/hast-util-minify-whitespace/lib/block.js
var blocks = [
  "address",
  // Flow content.
  "article",
  // Sections and headings.
  "aside",
  // Sections and headings.
  "blockquote",
  // Flow content.
  "body",
  // Page.
  "br",
  // Contribute whitespace intrinsically.
  "caption",
  // Similar to block.
  "center",
  // Flow content, legacy.
  "col",
  // Similar to block.
  "colgroup",
  // Similar to block.
  "dd",
  // Lists.
  "dialog",
  // Flow content.
  "dir",
  // Lists, legacy.
  "div",
  // Flow content.
  "dl",
  // Lists.
  "dt",
  // Lists.
  "figcaption",
  // Flow content.
  "figure",
  // Flow content.
  "footer",
  // Flow content.
  "form",
  // Flow content.
  "h1",
  // Sections and headings.
  "h2",
  // Sections and headings.
  "h3",
  // Sections and headings.
  "h4",
  // Sections and headings.
  "h5",
  // Sections and headings.
  "h6",
  // Sections and headings.
  "head",
  // Page.
  "header",
  // Flow content.
  "hgroup",
  // Sections and headings.
  "hr",
  // Flow content.
  "html",
  // Page.
  "legend",
  // Flow content.
  "li",
  // Block-like.
  "li",
  // Similar to block.
  "listing",
  // Flow content, legacy
  "main",
  // Flow content.
  "menu",
  // Lists.
  "nav",
  // Sections and headings.
  "ol",
  // Lists.
  "optgroup",
  // Similar to block.
  "option",
  // Similar to block.
  "p",
  // Flow content.
  "plaintext",
  // Flow content, legacy
  "pre",
  // Flow content.
  "section",
  // Sections and headings.
  "summary",
  // Similar to block.
  "table",
  // Similar to block.
  "tbody",
  // Similar to block.
  "td",
  // Block-like.
  "td",
  // Similar to block.
  "tfoot",
  // Similar to block.
  "th",
  // Block-like.
  "th",
  // Similar to block.
  "thead",
  // Similar to block.
  "tr",
  // Similar to block.
  "ul",
  // Lists.
  "wbr",
  // Contribute whitespace intrinsically.
  "xmp"
  // Flow content, legacy
];

// node_modules/hast-util-minify-whitespace/lib/content.js
var content = [
  // Form.
  "button",
  "input",
  "select",
  "textarea"
];

// node_modules/hast-util-minify-whitespace/lib/skippable.js
var skippable = [
  "area",
  "base",
  "basefont",
  "dialog",
  "datalist",
  "head",
  "link",
  "meta",
  "noembed",
  "noframes",
  "param",
  "rp",
  "script",
  "source",
  "style",
  "template",
  "track",
  "title"
];

// node_modules/hast-util-minify-whitespace/lib/index.js
var emptyOptions = {};
var ignorableNode = convert(["comment", "doctype"]);
function minifyWhitespace(tree, options) {
  const settings = options || emptyOptions;
  minify(tree, {
    collapse: collapseFactory(
      settings.newlines ? replaceNewlines : replaceWhitespace
    ),
    whitespace: "normal"
  });
}
function minify(node, state) {
  if ("children" in node) {
    const settings = { ...state };
    if (node.type === "root" || blocklike(node)) {
      settings.before = true;
      settings.after = true;
    }
    settings.whitespace = inferWhiteSpace(node, state);
    return all(node, settings);
  }
  if (node.type === "text") {
    if (state.whitespace === "normal") {
      return minifyText(node, state);
    }
    if (state.whitespace === "nowrap") {
      node.value = state.collapse(node.value);
    }
  }
  return { ignore: ignorableNode(node), stripAtStart: false, remove: false };
}
function minifyText(node, state) {
  const value = state.collapse(node.value);
  const result = { ignore: false, stripAtStart: false, remove: false };
  let start = 0;
  let end = value.length;
  if (state.before && removable(value.charAt(0))) {
    start++;
  }
  if (start !== end && removable(value.charAt(end - 1))) {
    if (state.after) {
      end--;
    } else {
      result.stripAtStart = true;
    }
  }
  if (start === end) {
    result.remove = true;
  } else {
    node.value = value.slice(start, end);
  }
  return result;
}
function all(parent, state) {
  let before = state.before;
  const after = state.after;
  const children = parent.children;
  let length = children.length;
  let index = -1;
  while (++index < length) {
    const result = minify(children[index], {
      ...state,
      after: collapsableAfter(children, index, after),
      before
    });
    if (result.remove) {
      children.splice(index, 1);
      index--;
      length--;
    } else if (!result.ignore) {
      before = result.stripAtStart;
    }
    if (content2(children[index])) {
      before = false;
    }
  }
  return { ignore: false, stripAtStart: Boolean(before || after), remove: false };
}
function collapsableAfter(nodes, index, after) {
  while (++index < nodes.length) {
    const node = nodes[index];
    let result = inferBoundary(node);
    if (result === void 0 && "children" in node && !skippable2(node)) {
      result = collapsableAfter(node.children, -1);
    }
    if (typeof result === "boolean") {
      return result;
    }
  }
  return after;
}
function inferBoundary(node) {
  if (node.type === "element") {
    if (content2(node)) {
      return false;
    }
    if (blocklike(node)) {
      return true;
    }
  } else if (node.type === "text") {
    if (!whitespace(node)) {
      return false;
    }
  } else if (!ignorableNode(node)) {
    return false;
  }
}
function content2(node) {
  return embedded(node) || isElement(node, content);
}
function blocklike(node) {
  return isElement(node, blocks);
}
function skippable2(node) {
  return Boolean(node.type === "element" && node.properties.hidden) || ignorableNode(node) || isElement(node, skippable);
}
function removable(character) {
  return character === " " || character === "\n";
}
function replaceNewlines(value) {
  const match = /\r?\n|\r/.exec(value);
  return match ? match[0] : " ";
}
function replaceWhitespace() {
  return " ";
}
function collapseFactory(replace) {
  return collapse;
  function collapse(value) {
    return String(value).replace(/[\t\n\v\f\r ]+/g, replace);
  }
}
function inferWhiteSpace(node, state) {
  if ("tagName" in node && node.properties) {
    switch (node.tagName) {
      // Whitespace in script/style, while not displayed by CSS as significant,
      // could have some meaning in JS/CSS, so we can’t touch them.
      case "listing":
      case "plaintext":
      case "script":
      case "style":
      case "xmp": {
        return "pre";
      }
      case "nobr": {
        return "nowrap";
      }
      case "pre": {
        return node.properties.wrap ? "pre-wrap" : "pre";
      }
      case "td":
      case "th": {
        return node.properties.noWrap ? "nowrap" : state.whitespace;
      }
      case "textarea": {
        return "pre-wrap";
      }
      default:
    }
  }
  return state.whitespace;
}

// node_modules/hast-util-has-property/lib/index.js
var own = {}.hasOwnProperty;
function hasProperty(node, name) {
  const value = node.type === "element" && own.call(node.properties, name) && node.properties[name];
  return value !== null && value !== void 0 && value !== false;
}

// node_modules/hast-util-is-body-ok-link/lib/index.js
var list = /* @__PURE__ */ new Set(["pingback", "prefetch", "stylesheet"]);
function isBodyOkLink(node) {
  if (node.type !== "element" || node.tagName !== "link") {
    return false;
  }
  if (node.properties.itemProp) {
    return true;
  }
  const value = node.properties.rel;
  let index = -1;
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }
  while (++index < value.length) {
    if (!list.has(String(value[index]))) {
      return false;
    }
  }
  return true;
}

// node_modules/hast-util-phrasing/lib/index.js
var basic = convertElement([
  "a",
  "abbr",
  // `area` is in fact only phrasing if it is inside a `map` element.
  // However, since `area`s are required to be inside a `map` element, and it’s
  // a rather involved check, it’s ignored here for now.
  "area",
  "b",
  "bdi",
  "bdo",
  "br",
  "button",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "i",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "map",
  "mark",
  "meter",
  "noscript",
  "output",
  "progress",
  "q",
  "ruby",
  "s",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "template",
  "textarea",
  "time",
  "u",
  "var",
  "wbr"
]);
var meta = convertElement("meta");
function phrasing(value) {
  return Boolean(
    value.type === "text" || basic(value) || embedded(value) || isBodyOkLink(value) || meta(value) && hasProperty(value, "itemProp")
  );
}

export {
  embedded,
  minifyWhitespace,
  phrasing
};
//# sourceMappingURL=chunk-6IREDRPA.js.map
