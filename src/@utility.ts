import { Initializable } from './@initializable';
import { withName } from './helpers/name';

const utility = Symbol();

const utilityStore = new WeakMap<any, any>();

let isLoaded = false;

interface Utility<T extends Initializable, U extends Initializable> {
	implements: abstract new (...args: any[]) => T;
	implementation: new (...args: any[]) => U;
}

export const isUtility = withName(
	'isUtility',
	(obj: any): obj is Utility<Initializable, Initializable> => Boolean(obj?.[utility]),
);

export const createUtility = withName(
	'createUtility',
	<T extends Initializable, U extends Initializable>(
		implementsClass: abstract new (...args: any[]) => T,
		implementationClass: new (...args: any[]) => U,
	) => ({
		[utility]: true,
		implements: implementsClass,
		implementation: implementationClass,
	} as Utility<T, U>),
);

export const loadUtilities = withName(
	'loadUtilities',
	async (...utilities: Utility<Initializable, Initializable>[]) => {
		const promises: Promise<Initializable>[] = [];
		for (const utility of utilities) {
			const util = new utility.implementation();
			const promise = util.init().then(() => {
				utilityStore.set(utility.implements, util);
				return util;
			});
			promises.push(promise);
			utilityStore.set(utility.implements, promise);
		}
		await Promise.all(promises);
		isLoaded = true;
	},
);

export const getUtility = withName(
	'getUtility',
	<T>(target: abstract new (...args: any[]) => T) => Promise.resolve<T>(utilityStore.get(target)),
);

export const useUtil = withName(
	'useUtil',
	<T>(target: abstract new (...args: any[]) => T): T => {
		if (!isLoaded) throw new Error("Can't call useUtil hook before utilities fully loaded");
		return utilityStore.get(target);
	},
);
