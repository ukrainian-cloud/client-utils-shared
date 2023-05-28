import type { FunctionalComponent, Component as ClassComponent} from 'preact';
import { withName } from './name';

type UnionToIntersection<U> = (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;

function Component<Props, Exp extends Record<string, any>[]>(
	name: string,
	Component: FunctionalComponent<Props>,
	...additionalComponentExports: Exp
): FunctionalComponent<Props> & UnionToIntersection<Exp[number]>
function Component<Props, Exp extends Record<string, any>[]>(
	name: string,
	Component: ClassComponent<Props>,
	...additionalComponentExports: Exp
): ClassComponent<Props> & UnionToIntersection<Exp[number]>


function Component(name: string, Component: any, ...additionalComponentExports: any[]) {
	return Object.assign(Object.defineProperty(Component, 'name', { value: name }), ...additionalComponentExports);
}

const ComponentNamed = withName('Component', Component);

export { ComponentNamed as Component }
