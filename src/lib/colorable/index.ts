import { spring, type Spring } from 'svelte/motion';
import { derived, type Subscriber, type Unsubscriber } from 'svelte/store';

export type ColorData = {
	red?: number;
	green?: number;
	blue?: number;
	alpha?: number;
};

export function colorData(hex: string): ColorData {
	const hexRegex = /(#){0,1}([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{0,2})/g;
	const regexArray = hexRegex.exec(hex);
	if (regexArray.length) {
		const [, , red, green, blue, alpha = 'ff'] = regexArray;

		return {
			red: fromHex(red),
			green: fromHex(green),
			blue: fromHex(blue),
			alpha: fromHex(alpha||'ff')
		};
	}

	throw new Error('The hex color is not correct');
}


export function fromHex(value: string) {
	return parseInt(value, 16)
}
export function toHex(value = 0) {
	return Math.trunc(value).toString(16).padStart(2, '0')
}

export type Color = ColorData & {
	readonly hex: string;
	toString(): string;
	clone(): Color;
	update(data: ColorData): Color;
};

export function color({ red = 0, green = 0, blue = 0, alpha = 0 }: ColorData): Color {
	let r = red;
	let g = green;
	let b = blue;
	let a = alpha;

	return {
		get red() {
			return r;
		},
		set red(val) {
			r = Math.max(0, Math.min(255, Math.trunc(val)));
		},
		get green() {
			return g;
		},
		set green(val) {
			g = Math.max(0, Math.min(255, Math.trunc(val)));
		},
		get blue() {
			return b;
		},
		set blue(val) {
			b = Math.max(0, Math.min(255, Math.trunc(val)));
		},
		get alpha() {
			return a;
		},
		set alpha(val) {
			a = Math.max(0, Math.min(255, Math.trunc(val)));
		},
		get hex() {
			return `#${toHex(red) + toHex(green) + toHex(blue) + toHex(alpha)}`
		},
		toString() {
			return `rgba(${r}, ${g}, ${b}, ${a})`;
		},
		clone() {
			return color({ red: r, green: g, blue: b, alpha: a });
		},
		update(data) {
			for (const key in data) {
				this[key] = data[key];
			}
			return this;
		}
	};
}

export type Colorable = {
	subscribe: (
		this: void,
		run: Subscriber<string>,
		invalidate?: (value?: string) => void
	) => Unsubscriber;
	set: (value: string, opts?: SpringUpdateOpts) => void;
	setRed: (val: number) => Colorable;
	setGreen: (val: number) => Colorable;
	setBlue: (val: number) => Colorable;
	setAlpha: (val: number) => Colorable;
	red: number;
	green: number;
	blue: number;
	alpha: number;
	red$: Spring<number>
	green$: Spring<number>
	blue$: Spring<number>
	alpha$: Spring<number>
	readonly color: Color;
};

interface SpringUpdateOpts {
	hard?: any;
	soft?: string | number | boolean;
}

export function colorable(
	value = '#000000',
	options = { stiffness: 0.15, damping: 0.8, precision: 0.01 }
): Colorable {
	const _color = color(colorData(value));//

	const red$ = spring(_color.red, options);
	const green$ = spring(_color.green, options);
	const blue$ = spring(_color.blue, options);
	const alpha$ = spring(_color.alpha, options);

	const { subscribe } = derived([red$, green$, blue$, alpha$], ([red, green, blue, alpha]) =>
		`#${toHex(red) + toHex(green) + toHex(blue) + toHex(alpha)}`
	);

	return {
		subscribe,
		set(value: string, opts?: SpringUpdateOpts) {
			const data = colorData(value);//

			_color.update(data);

			red$.set(_color.red, opts);
			green$.set(_color.green, opts);
			blue$.set(_color.blue, opts);
			alpha$.set(_color.alpha, opts);
		},
		setRed(val: number, opts?: SpringUpdateOpts) {
			_color.red = val;
			red$.set(_color.red, opts);
			return this;
		},
		setGreen(val: number, opts?: SpringUpdateOpts) {
			_color.green = val;
			green$.set(_color.green, opts);
			return this;
		},
		setBlue(val: number, opts?: SpringUpdateOpts) {
			_color.blue = val;
			blue$.set(_color.blue, opts);
			return this;
		},
		setAlpha(val: number, opts?: SpringUpdateOpts) {
			_color.alpha = val;
			alpha$.set(_color.alpha, opts);
			return this;
		},

		get red() {
			return _color.red;
		},
		set red(val) {
			_color.red = val;
			red$.set(_color.red);
		},
		get green() {
			return _color.green;
		},
		set green(val) {
			_color.green = val;
			green$.set(_color.green);
		},
		get blue() {
			return _color.blue;
		},
		set blue(val) {
			_color.blue = val;
			blue$.set(_color.blue);
		},
		get alpha() {
			return _color.alpha;
		},
		set alpha(val) {
			_color.alpha = val;
			alpha$.set(_color.alpha);
		},
		get color() {
			return _color;
		},
		red$,
		green$,
		blue$,
		alpha$
	};
}
