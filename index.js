var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

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
var globalStorageName = "__uc_globals";
if (!globalThis[globalStorageName]) {
  Object.defineProperty(globalThis, globalStorageName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: /* @__PURE__ */ Object.create(null)
  });
}
function getGlobal(name, factory) {
  const storage = globalThis[globalStorageName];
  if (name in storage)
    return storage[name];
  return storage[name] = factory();
}
var utility = getGlobal("utility", () => Symbol());
var utilityStore = getGlobal("utilityStore", () => /* @__PURE__ */ new WeakMap());
var utilityState = getGlobal("utilityState", () => ({ isLoaded: false }));
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
    utilityState.isLoaded = true;
  }
);
var getUtility = withName(
  "getUtility",
  (target) => Promise.resolve(utilityStore.get(target))
);
var useUtil = withName(
  "useUtil",
  (target) => {
    if (!utilityState.isLoaded)
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
var enums = {
  Theme
};
var LocalDB = class extends Initializable {
  changeListeners = {};
  options = {};
  enums = enums;
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
export {
  ColorScheme,
  ComponentNamed as Component,
  LocalDB,
  Name,
  createUtility,
  getUtility,
  isUtility,
  loadUtilities,
  useUtil,
  withName
};
//# sourceMappingURL=index.js.map