import {
  __commonJS
} from "./chunk-LK32TJAX.js";

// node_modules/@intercom/messenger-js-sdk/dist/constants.js
var require_constants = __commonJS({
  "node_modules/@intercom/messenger-js-sdk/dist/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regionAPIs = void 0;
    exports.regionAPIs = /* @__PURE__ */ new Map([
      ["us", "https://api-iam.intercom.io"],
      ["eu", "https://api-iam.eu.intercom.io"],
      ["ap", "https://api-iam.au.intercom.io"]
    ]);
  }
});

// node_modules/@intercom/messenger-js-sdk/dist/instance-manager.js
var require_instance_manager = __commonJS({
  "node_modules/@intercom/messenger-js-sdk/dist/instance-manager.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ref = exports.init = void 0;
    var scriptElementId = "_intercom_npm_loader";
    var queueHolder = function() {
      queueHolder.loaderQueue(arguments);
    };
    queueHolder.q = [];
    queueHolder.loaderQueue = function(args) {
      queueHolder.q.push(args);
    };
    var addWidgetToPage = function() {
      var _a, _b;
      var d = document;
      if (d.getElementById(scriptElementId)) {
        return;
      }
      var s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.id = scriptElementId;
      s.src = "https://widget.intercom.io/widget/" + ((_a = window.intercomSettings) === null || _a === void 0 ? void 0 : _a.app_id);
      var x = d.getElementsByTagName("script")[0];
      (_b = x.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(s, x);
    };
    var isDocumentReady = () => document.readyState === "complete" || document.readyState === "interactive";
    var init = () => __awaiter(void 0, void 0, void 0, function* () {
      var w = window;
      var ic = w.Intercom;
      if (w.intercomSettings) {
        w.intercomSettings.installation_type = "npm-package";
      }
      if (typeof ic === "function") {
        ic("reattach_activator");
        ic("update", w.intercomSettings);
      } else {
        w.Intercom = queueHolder;
        if (isDocumentReady()) {
          addWidgetToPage();
        } else {
          document.addEventListener("readystatechange", function() {
            if (isDocumentReady()) {
              addWidgetToPage();
            }
          });
          if (w.attachEvent) {
            w.attachEvent("onload", addWidgetToPage);
          } else {
            w.addEventListener("load", addWidgetToPage, false);
          }
        }
      }
    });
    exports.init = init;
    exports.ref = void 0;
  }
});

// node_modules/@intercom/messenger-js-sdk/dist/index.js
var require_dist = __commonJS({
  "node_modules/@intercom/messenger-js-sdk/dist/index.js"(exports) {
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onUserEmailSupplied = exports.showConversation = exports.showTicket = exports.startChecklist = exports.startSurvey = exports.showNews = exports.showArticle = exports.startTour = exports.getVisitorId = exports.trackEvent = exports.onUnreadCountChange = exports.onShow = exports.onHide = exports.showNewMessage = exports.showMessages = exports.showSpace = exports.show = exports.hide = exports.update = exports.shutdown = exports.boot = exports.Intercom = void 0;
    var constants_1 = require_constants();
    var instance_manager_1 = require_instance_manager();
    var callIntercomMethod = (method, ...args) => {
      if (typeof window !== void 0 && window.Intercom) {
        window.Intercom(method, ...args);
      } else {
        console.warn("Please ensure Intercom is setup and running on client-side!");
      }
    };
    var Intercom = (props) => {
      if (typeof props !== "object") {
        console.warn("Intercom initialiser called with invalid parameters.");
        return;
      }
      const { region = "us" } = props, args = __rest(props, ["region"]);
      if (typeof window !== "undefined" && !instance_manager_1.ref) {
        window.intercomSettings = Object.assign(Object.assign({}, args), { api_base: constants_1.regionAPIs.get(region) });
        (0, instance_manager_1.init)();
      }
    };
    exports.Intercom = Intercom;
    exports.default = exports.Intercom;
    var boot = (arg) => callIntercomMethod("boot", arg);
    exports.boot = boot;
    var shutdown = () => callIntercomMethod("shutdown");
    exports.shutdown = shutdown;
    var update = (arg) => callIntercomMethod("update", arg);
    exports.update = update;
    var hide = () => callIntercomMethod("hide");
    exports.hide = hide;
    var show = () => callIntercomMethod("show");
    exports.show = show;
    var showSpace = (spaceName) => callIntercomMethod("showSpace", spaceName);
    exports.showSpace = showSpace;
    var showMessages = () => callIntercomMethod("showMessages");
    exports.showMessages = showMessages;
    var showNewMessage = (prePopulatedContent) => callIntercomMethod("showNewMessage", prePopulatedContent);
    exports.showNewMessage = showNewMessage;
    var onHide = (callback) => callIntercomMethod("onHide", callback);
    exports.onHide = onHide;
    var onShow = (callback) => callIntercomMethod("onShow", callback);
    exports.onShow = onShow;
    var onUnreadCountChange = (callback) => callIntercomMethod("onUnreadCountChange", callback);
    exports.onUnreadCountChange = onUnreadCountChange;
    var trackEvent = (...args) => callIntercomMethod("trackEvent", ...args);
    exports.trackEvent = trackEvent;
    var getVisitorId = () => callIntercomMethod("getVisitorId");
    exports.getVisitorId = getVisitorId;
    var startTour = (tourId) => callIntercomMethod("startTour", tourId);
    exports.startTour = startTour;
    var showArticle = (articleId) => callIntercomMethod("showArticle", articleId);
    exports.showArticle = showArticle;
    var showNews = (newsItemId) => callIntercomMethod("showNews", newsItemId);
    exports.showNews = showNews;
    var startSurvey = (surveyId) => callIntercomMethod("startSurvey", surveyId);
    exports.startSurvey = startSurvey;
    var startChecklist = (checklistId) => callIntercomMethod("startChecklist", checklistId);
    exports.startChecklist = startChecklist;
    var showTicket = (ticketId) => callIntercomMethod("showTicket", ticketId);
    exports.showTicket = showTicket;
    var showConversation = (conversationId) => callIntercomMethod("showConversation", conversationId);
    exports.showConversation = showConversation;
    var onUserEmailSupplied = (callback) => callIntercomMethod("onUserEmailSupplied", callback);
    exports.onUserEmailSupplied = onUserEmailSupplied;
  }
});
export default require_dist();
//# sourceMappingURL=@intercom_messenger-js-sdk.js.map
