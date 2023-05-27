declare abstract class Initializable {
    abstract init(): Promise<void>;
}

interface Utility<T extends Initializable, U extends Initializable> {
    implements: abstract new (...args: any[]) => T;
    implementation: new (...args: any[]) => U;
}
declare function isUtility(obj: any): obj is Utility<Initializable, Initializable>;
declare function createUtility<T extends Initializable, U extends Initializable>(implementsClass: abstract new (...args: any[]) => T, implementationClass: new (...args: any[]) => U): Utility<T, U>;
declare function loadUtilities(...utilities: Utility<Initializable, Initializable>[]): Promise<void>;
declare function getUtility<T>(target: abstract new (...args: any[]) => T): Promise<T>;
declare function useUtil<T>(target: abstract new (...args: any[]) => T): T;

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

export { ColorScheme, LocalDB, createUtility, getUtility, isUtility, loadUtilities, useUtil };
