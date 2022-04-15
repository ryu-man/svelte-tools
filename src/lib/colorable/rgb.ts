import { spring, tweened } from 'svelte/motion';
import { derived, type Readable } from 'svelte/store';
import { isItSpringOptions, toHex, type Color, type Data, type Options, type SpringOpts } from './common';

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

export declare type RGB$ = {
    subscribe: Readable<string>['subscribe']

    red(): number;
    red(val: number): RGB;

    green(): number;
    green(val: number): RGB;

    blue(): number;
    blue(val: number): RGB;

    alpha(): number;
    alpha(val: number): RGB;

    readonly color: RGB;

}

export declare type RGBColorable = {
    rgb$: RGB$
    red$: Readable<number>
    green$: Readable<number>
    blue$: Readable<number>
    alpha$: Readable<number>
    data: RGBData
};


export function colorable(data?: RGBData | undefined, options?: SpringOpts): RGBColorable
export function colorable(data?: RGBData | undefined, options?: Options<number>): RGBColorable

export function colorable(
    data: RGBData | undefined = {},
    options: SpringOpts | Options<number> = {}
): RGBColorable {
    const color = rgb(data ?? {});

    const engine = isItSpringOptions(options) ? spring : tweened

    const red$ = engine(color.red(), options);
    const green$ = engine(color.green(), options);
    const blue$ = engine(color.blue(), options);
    const alpha$ = engine(color.alpha(), options);

    const { subscribe } = derived([red$, green$, blue$, alpha$], ([red, green, blue, alpha]) => `rgba(${red}, ${green}, ${blue}, ${alpha})`);

    const rgb$ = {
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
    }

    return {
        rgb$,
        red$: derived(red$, d => d),
        green$: derived(green$, d => d),
        blue$: derived(blue$, d => d),
        alpha$: derived(alpha$, d => d),
        data: bridge(rgb$)
    };
}

export const bridge = (rgb$: RGB$) => ({
    get red() {
        return rgb$.red();
    },
    set red(val) {
        rgb$.red(val);
    },
    get green() {
        return rgb$.green();
    },
    set green(val) {
        rgb$.green(val);
    },
    get blue() {
        return rgb$.blue();
    },
    set blue(val) {
        rgb$.blue(val);
    },
    get alpha() {
        return rgb$.alpha();
    },
    set alpha(val) {
        rgb$.alpha(val);
    }
})
