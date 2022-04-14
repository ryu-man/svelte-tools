import { spring, type Spring, tweened, type Tweened } from 'svelte/motion';
import { derived, type Readable, type Subscriber, type Unsubscriber, type Writable } from 'svelte/store';
import { toHex, type Color, type Data } from './common';

export declare type RGBData = Data & {
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
};

export declare type RGB = Color<RGBData> & {
    red(): number
    red(val: number): RGB

    green(): number
    green(val: number): RGB

    blue(): number
    blue(val: number): RGB

    alpha(): number
    alpha(val: number): RGB

    clone(): RGB;
    update(data: RGBData): RGB;
}

export function rgb({ red = 0, green = 0, blue = 0, alpha = 1 }: RGBData): RGB {
    let r = Math.max(0, Math.min(255, Math.trunc(red)));
    let g = Math.max(0, Math.min(255, Math.trunc(green)));
    let b = Math.max(0, Math.min(255, Math.trunc(blue)));
    let a = Math.max(0, Math.min(1, Math.trunc(alpha)));

    return {
        red(val?: number) {
            if (val) {
                r = Math.max(0, Math.min(255, Math.trunc(val)));
                return this
            }
            return r;
        },
        green(val?: number) {
            if (val) {
                g = Math.max(0, Math.min(255, Math.trunc(val)));
                return this
            }
            return g;
        },

        blue(val?: number) {
            if (val) {
                b = Math.max(0, Math.min(255, Math.trunc(val)));
                return this
            }
            return b;
        },

        alpha(val?: number) {
            if (val) {
                a = Math.max(0, Math.min(1, val));
                return this
            }
            return a;
        },

        data() {
            return { red: r, green: g, blue: b, alpha: a }
        },

        hex() {
            return `#${toHex(red) + toHex(green) + toHex(blue) + toHex(alpha * 255)}`
        },
        toString() {
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        },
        clone() {
            return rgb(this.data());
        },
        update(data) {
            for (const key in data) {
                this[key] = data[key];
            }
            return this;
        }
    };
}

export declare type RGBColorable = {
    subscribe: Readable<string>['subscribe']

    red(): number;
    red(val: number): RGB;

    green(): number;
    green(val: number): RGB;

    blue(): number;
    blue(val: number): RGB;

    alpha(): number;
    alpha(val: number): RGB;

    red$: Readable<number>
    green$: Readable<number>
    blue$: Readable<number>
    alpha$: Readable<number>

    readonly color: RGB;
};

type SpringOpts = {
    stiffness?: number;
    damping?: number;
    precision?: number;
}
type Options<T> = {
    delay?: number;
    duration?: number | ((from: T, to: T) => number);
    easing?: (t: number) => number;
    interpolate?: (a: T, b: T) => (t: number) => T;
}

type ColorableTweened = Options<number> & {
    engine: ((...args) => Tweened<number>)
}

export function colorable(data?: RGBData | undefined, options?: SpringOpts): RGBColorable
export function colorable(data?: RGBData | undefined, options?: ColorableTweened): RGBColorable

export function colorable(
    data: RGBData | undefined = {},
    options: SpringOpts | ColorableTweened
): RGBColorable {
    const color = rgb(data ?? {});

    const { engine, ...opt } = { engine: spring, ...options } ?? {}

    const red$ = engine(color.red(), opt);
    const green$ = engine(color.green(), opt);
    const blue$ = engine(color.blue(), opt);
    const alpha$ = engine(color.alpha(), opt);

    const { subscribe } = derived([red$, green$, blue$, alpha$], ([red, green, blue, alpha]) => `rgba(${red}, ${green}, ${blue}, ${alpha})`);

    return {
        subscribe,
        red(val?: number, ...args) {
            if (val) {
                red$.set(color.red(val).red());
                return this;
            }

            return color.red()
        },
        green(val?: number, ...args) {
            if (val) {
                green$.set(color.green(val).green());
                return this;
            }

            return color.green()
        },
        blue(val?: number, ...args) {
            if (val) {
                blue$.set(color.blue(val).blue());
                return this;
            }

            return color.blue()
        },
        alpha(val?: number, ...args) {
            if (val) {
                alpha$.set(color.alpha(val).alpha());
                return this;
            }

            return color.alpha()
        },
        get color() {
            return color;
        },
        red$: derived(red$, d => d),
        green$: derived(green$, d => d),
        blue$: derived(blue$, d => d),
        alpha$: derived(alpha$, d => d)
    };
}

export const binding = (colorable: RGBColorable) => ({
    get red() {
        return colorable.red();
    },
    set red(val) {
        colorable.red(val);
    },
    get green() {
        return colorable.green();
    },
    set green(val) {
        colorable.green(val);
    },
    get blue() {
        return colorable.blue();
    },
    set blue(val) {
        colorable.blue(val);
    },
    get alpha() {
        return colorable.alpha();
    },
    set alpha(val) {
        colorable.alpha(val);
    }
})
