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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ColorScheme: () => ColorScheme,
  LocalDB: () => LocalDB,
  createUtility: () => createUtility,
  getUtility: () => getUtility,
  isUtility: () => isUtility,
  loadUtilities: () => loadUtilities,
  useUtil: () => useUtil
});
module.exports = __toCommonJS(src_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorScheme,
  LocalDB,
  createUtility,
  getUtility,
  isUtility,
  loadUtilities,
  useUtil
});
//# sourceMappingURL=index.cjs.map