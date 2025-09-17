import {
  h,
  s,
  webNamespaces
} from "./chunk-UFFYVJKJ.js";

// node_modules/hast-util-from-dom/lib/index.js
function fromDom(tree, options) {
  return transform(tree, options || {}) || { type: "root", children: [] };
}
function transform(node, options) {
  const transformed = one(node, options);
  if (transformed && options.afterTransform)
    options.afterTransform(node, transformed);
  return transformed;
}
function one(node, options) {
  switch (node.nodeType) {
    case 1: {
      const domNode = (
        /** @type {Element} */
        node
      );
      return element(domNode, options);
    }
    // Ignore: Attr (2).
    case 3: {
      const domNode = (
        /** @type {Text} */
        node
      );
      return text(domNode);
    }
    // Ignore: CDATA (4).
    // Removed: Entity reference (5)
    // Removed: Entity (6)
    // Ignore: Processing instruction (7).
    case 8: {
      const domNode = (
        /** @type {Comment} */
        node
      );
      return comment(domNode);
    }
    case 9: {
      const domNode = (
        /** @type {Document} */
        node
      );
      return root(domNode, options);
    }
    case 10: {
      return doctype();
    }
    case 11: {
      const domNode = (
        /** @type {DocumentFragment} */
        node
      );
      return root(domNode, options);
    }
    default: {
      return void 0;
    }
  }
}
function root(node, options) {
  return { type: "root", children: all(node, options) };
}
function doctype() {
  return { type: "doctype" };
}
function text(node) {
  return { type: "text", value: node.nodeValue || "" };
}
function comment(node) {
  return { type: "comment", value: node.nodeValue || "" };
}
function element(node, options) {
  const space = node.namespaceURI;
  const x = space === webNamespaces.svg ? s : h;
  const tagName = space === webNamespaces.html ? node.tagName.toLowerCase() : node.tagName;
  const content = (
    // @ts-expect-error: DOM types are wrong, content can exist.
    space === webNamespaces.html && tagName === "template" ? node.content : node
  );
  const attributes = node.getAttributeNames();
  const properties = {};
  let index = -1;
  while (++index < attributes.length) {
    properties[attributes[index]] = node.getAttribute(attributes[index]) || "";
  }
  return x(tagName, properties, all(content, options));
}
function all(node, options) {
  const nodes = node.childNodes;
  const children = [];
  let index = -1;
  while (++index < nodes.length) {
    const child = transform(nodes[index], options);
    if (child !== void 0) {
      children.push(child);
    }
  }
  return children;
}

export {
  fromDom
};
//# sourceMappingURL=chunk-AROZCQJN.js.map
