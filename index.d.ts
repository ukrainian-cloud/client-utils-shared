import { FunctionalComponent, Component as Component$1 } from 'preact';

declare abstract class Initializable {
    abstract init(): Promise<void>;
}

interface Utility<T extends Initializable, U extends Initializable> {
    implements: abstract new (...args: any[]) => T;
    implementation: new (...args: any[]) => U;
}
declare const isUtility: (obj: any) => obj is Utility<Initializable, Initializable>;
declare const createUtility: <T extends Initializable, U extends Initializable>(implementsClass: abstract new (...args: any[]) => T, implementationClass: new (...args: any[]) => U) => Utility<T, U>;
declare const loadUtilities: (...utilities: Utility<Initializable, Initializable>[]) => Promise<void>;
declare const getUtility: <T>(target: abstract new (...args: any[]) => T) => Promise<Awaited<T>>;
declare const useUtil: <T>(target: abstract new (...args: any[]) => T) => T;

declare enum Theme$1 {
    dark = "dark",
    light = "light"
}
interface Mappings {
    theme: Theme$1;
}
declare abstract class LocalDB extends Initializable {
    private changeListeners;
    private options;
    enums: {
        Theme: typeof Theme$1;
    };
    abstract get<T extends keyof Mappings>(name: T): Promise<Mappings[T]>;
    abstract set<T extends keyof Mappings>(name: T, value: Mappings[T]): Promise<void>;
    abstract delete<T extends keyof Mappings>(name: T): Promise<void>;
    protected emitChange(name: string, value: any): void;
    onChange<T extends keyof Mappings>(name: T, callback: (value: Mappings[T]) => void, options?: {
        once?: boolean;
    }): void;
    offChange<T extends keyof Mappings>(name: T, callback: (value: Mappings[T]) => void): void;
}

type Theme = LocalDB['enums']['Theme'][keyof LocalDB['enums']['Theme']];
declare abstract class ColorScheme extends Initializable {
    abstract getDefault(): Promise<Theme>;
    init(): Promise<void>;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare function Component<Props, Exp extends Record<string, any>[]>(name: string, Component: FunctionalComponent<Props>, ...additionalComponentExports: Exp): FunctionalComponent<Props> & UnionToIntersection<Exp[number]>;
declare function Component<Props, Exp extends Record<string, any>[]>(name: string, Component: Component$1<Props>, ...additionalComponentExports: Exp): Component$1<Props> & UnionToIntersection<Exp[number]>;
declare const ComponentNamed: typeof Component;

declare function Name(name: string): <T>(Class: T, _context: ClassDecoratorContext) => void;
declare function withName<T extends Function>(name: string, func: T): T;

export { ColorScheme, ComponentNamed as Component, LocalDB, Name, createUtility, getUtility, isUtility, loadUtilities, useUtil, withName };
