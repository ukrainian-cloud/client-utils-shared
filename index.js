// src/@utility.ts
var utility = Symbol();
var utilityStore = /* @__PURE__ */ new WeakMap();
var isLoaded = false;
function isUtility(obj) {
  return Boolean(obj == null ? void 0 : obj[utility]);
}
function createUtility(implementsClass, implementationClass) {
  return {
    [utility]: true,
    implements: implementsClass,
    implementation: implementationClass
  };
}
async function loadUtilities(...utilities) {
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
async function getUtility(target) {
  return await Promise.resolve(utilityStore.get(target));
}
function useUtil(target) {
  if (!isLoaded)
    throw new Error("Can't call useUtil hook before utilities fully loaded");
  return utilityStore.get(target);
}

// src/@initializable.ts
var Initializable = class {
};

// src/utils/local-db.ts
var Theme = /* @__PURE__ */ ((Theme2) => {
  Theme2["dark"] = "dark";
  Theme2["light"] = "light";
  return Theme2;
})(Theme || {});
var LocalDB = class extends Initializable {
  constructor() {
    super(...arguments);
    this.changeListeners = {};
    this.options = {};
    this.enums = {
      Theme
    };
  }
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
    var _a, _b;
    (_a = this.changeListeners)[name] ?? (_a[name] = /* @__PURE__ */ new Set());
    (_b = this.options)[name] ?? (_b[name] = /* @__PURE__ */ new WeakMap());
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
export {
  ColorScheme,
  LocalDB,
  createUtility,
  getUtility,
  isUtility,
  loadUtilities,
  useUtil
};
//# sourceMappingURL=index.js.map