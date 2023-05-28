"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ColorScheme: () => ColorScheme,
  Component: () => ComponentNamed,
  LocalDB: () => LocalDB,
  Name: () => Name,
  createUtility: () => createUtility,
  getUtility: () => getUtility,
  isUtility: () => isUtility,
  loadUtilities: () => loadUtilities,
  useUtil: () => useUtil,
  withName: () => withName
});
module.exports = __toCommonJS(src_exports);

// src/helpers/name.ts
function Name(name) {
  return (Class, _context) => {
    Object.defineProperty(Class, "name", {
      value: name
    });
  };
}
function withName(name, func) {
  Object.defineProperty(func, "name", {
    value: name
  });
  return func;
}

// src/@utility.ts
var utility = Symbol();
var utilityStore = /* @__PURE__ */ new WeakMap();
var isLoaded = false;
var isUtility = withName(
  "isUtility",
  (obj) => Boolean(obj?.[utility])
);
var createUtility = withName(
  "createUtility",
  (implementsClass, implementationClass) => ({
    [utility]: true,
    implements: implementsClass,
    implementation: implementationClass
  })
);
var loadUtilities = withName(
  "loadUtilities",
  async (...utilities) => {
    const promises = [];
    for (const utility2 of utilities) {
      const util = new utility2.implementation();
      const promise = util.init().then(() => {
        utilityStore.set(utility2.implements, util);
        return util;
      });
      promises.push(promise);
      utilityStore.set(utility2.implements, promise);
    }
    await Promise.all(promises);
    isLoaded = true;
  }
);
var getUtility = withName(
  "getUtility",
  (target) => Promise.resolve(utilityStore.get(target))
);
var useUtil = withName(
  "useUtil",
  (target) => {
    if (!isLoaded)
      throw new Error("Can't call useUtil hook before utilities fully loaded");
    return utilityStore.get(target);
  }
);

// src/@initializable.ts
var Initializable = class {
};
Initializable = __decorateClass([
  Name("Initializable")
], Initializable);

// src/utils/local-db.ts
var Theme = /* @__PURE__ */ ((Theme2) => {
  Theme2["dark"] = "dark";
  Theme2["light"] = "light";
  return Theme2;
})(Theme || {});
var LocalDB = class extends Initializable {
  changeListeners = {};
  options = {};
  enums = {
    Theme
  };
  emitChange(name, value) {
    if (!this.changeListeners[name])
      return;
    this.changeListeners[name].forEach((callback) => {
      const { once } = this.options[name].get(callback);
      if (once) {
        this.changeListeners[name].delete(callback);
        this.options[name].delete(callback);
      }
      try {
        callback(value);
      } catch (e) {
        console.error(e);
      }
    });
  }
  onChange(name, callback, options) {
    this.changeListeners[name] ??= /* @__PURE__ */ new Set();
    this.options[name] ??= /* @__PURE__ */ new WeakMap();
    this.changeListeners[name].add(callback);
    this.options[name].set(callback, options || {});
  }
  offChange(name, callback) {
    if (!this.changeListeners[name])
      return;
    this.changeListeners[name].delete(callback);
    this.options[name].delete(callback);
  }
};
LocalDB = __decorateClass([
  Name("LocalDB")
], LocalDB);

// src/utils/color-scheme.ts
var ColorScheme = class extends Initializable {
  async init() {
    const db = await getUtility(LocalDB);
    try {
      await db.get("theme");
    } catch (e) {
      await db.set("theme", await this.getDefault());
    }
  }
};
ColorScheme = __decorateClass([
  Name("ColorScheme")
], ColorScheme);

// src/helpers/component.ts
function Component(name, Component2, ...additionalComponentExports) {
  return Object.assign(Object.defineProperty(Component2, "name", { value: name }), ...additionalComponentExports);
}
var ComponentNamed = withName("Component", Component);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorScheme,
  Component,
  LocalDB,
  Name,
  createUtility,
  getUtility,
  isUtility,
  loadUtilities,
  useUtil,
  withName
});
//# sourceMappingURL=index.cjs.map