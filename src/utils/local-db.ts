import { Initializable } from "../@initializable";

enum Theme {
	dark = "dark",
	light = "light",
}

interface Mappings {
	theme: Theme;
}

export abstract class LocalDB extends Initializable {
	private changeListeners: Record<string, Set<(value: any) => void>> = {};
	private options: Record<string, WeakMap<(value: any) => void, { once?: boolean }>> = {};

	enums = {
		Theme,
	};

	abstract get<T extends keyof Mappings>(name: T): Promise<Mappings[T]>;

	abstract set<T extends keyof Mappings>(name: T, value: Mappings[T]): Promise<void>;

	abstract delete<T extends keyof Mappings>(name: T): Promise<void>;

	protected emitChange(name: string, value: any) {
		if (!this.changeListeners[name]) return;
		this.changeListeners[name].forEach((callback) => {
			const { once } = this.options[name].get(callback)!;
			if (once) {
				this.changeListeners[name].delete(callback);
				this.options[name].delete(callback);
			}
			try {
				callback(value);
			} catch(e) {
				console.error(e);
			}
		});
	}

	onChange<T extends keyof Mappings>(name: T, callback: (value: Mappings[T]) => void, options?: { once?: boolean }) {
		this.changeListeners[name] ??= new Set();
		this.options[name] ??= new WeakMap();
		this.changeListeners[name].add(callback);
		this.options[name].set(callback, options || {});
	};

	offChange<T extends keyof Mappings>(name: T, callback: (value: Mappings[T]) => void) {
		if (!this.changeListeners[name]) return;
		this.changeListeners[name].delete(callback);
		this.options[name].delete(callback);
	};
}
