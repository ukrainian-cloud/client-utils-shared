export function Name(name: string) {
	return <T>(Class: T, _context: ClassDecoratorContext) => {
		Object.defineProperty(Class, 'name', {
			value: name,
		});
	};
}

export function withName<T extends Function>(name: string, func: T) {
	Object.defineProperty(func, 'name', {
		value: name,
	});
	return func;
}
