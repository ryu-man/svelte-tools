import { spring, tweened } from "svelte/motion";
import { derived, type Readable } from "svelte/store";
import { isItSpringOptions, toHex, type HSLData, type Options, type SpringOpts } from "./common";

export declare type HSL = {
    hue(val: number): HSL
    hue(): number

    saturation(val: number): HSL
    saturation(): number

    lightness(val: number): HSL
    lightness(): number

    alpha(val: number): HSL
    alpha(): number

    hex(): string
    toString(): string
    clone(): HSL
    update(data: HSLData): HSL
}


export function hsl({ hue = 0, saturation = 0, lightness = 0, alpha = 1 }: HSLData): HSL {
    let h = Math.max(0, Math.min(hue, 360));
    let s = Math.max(0, Math.min(saturation, 255));;
    let l = Math.max(0, Math.min(lightness, 255));;
    let a = Math.max(0, Math.min(alpha, 1));;

    return {
        hue(val?: number) {
            if (val) {
                h = Math.max(0, Math.min(360, Math.trunc(val)));
                return this
            }
            return h;
        },
        saturation(val?: number) {
            if (val) {
                s = Math.max(0, Math.min(100, Math.trunc(val)));
                return this
            }
            return s;
        },

        lightness(val?: number) {
            if (val) {
                l = Math.max(0, Math.min(100, Math.trunc(val)));
                return this
            }
            return l;
        },
        alpha(val?: number) {
            if (val) {
                a = Math.max(0, Math.min(1, val));
                return this
            }
            return a;
        },
        hex() {
            return `#${toHex(hue * 255 / 360) + toHex(saturation * 255 / 100) + toHex(lightness * 255 / 100) + toHex(alpha * 255)}`
        },
        toString() {
            return `hsla(${h}, ${s}%, ${l}%, ${a})`;
        },
        clone() {
            return hsl({ hue: h, saturation: s, lightness: l, alpha: a });
        },
        update(data) {
            for (const key in data) {
                this[key] = data[key];
            }
            return this;
        }
    };
}

export declare type HSL$ = {
    subscribe: Readable<string>['subscribe']

    hue(): number;
    hue(val: number): HSLColorable;

    saturation(): number;
    saturation(val: number): HSLColorable;

    lightness(): number;
    lightness(val: number): HSLColorable;

    alpha(): number;
    alpha(val: number): HSLColorable;

    readonly color: HSL;
}

export declare type HSLColorable = {
    hsl$: HSL$,
    hue$: Readable<number>,
    saturation$: Readable<number>,
    lightness$: Readable<number>,
    alpha$: Readable<number>,
    data: HSLData
};

export function colorable(data?: {}, options?: SpringOpts): HSLColorable
export function colorable(data?: {}, options?: Options<number>): HSLColorable

export function colorable(data?: {}, options: SpringOpts | Options<number> = {}): HSLColorable {
    const color = hsl(data ?? {});

    const engine = isItSpringOptions(options) ? spring : tweened

    const hue$ = engine(color.hue(), options);
    const saturation$ = engine(color.saturation(), options);
    const lightness$ = engine(color.lightness(), options);
    const alpha$ = engine(color.alpha(), options);

    const { subscribe } = derived([hue$, saturation$, lightness$, alpha$], ([hue, saturation, lightness, alpha]) => `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);

    const hsl$ = {
        subscribe,
        hue(val?: number, ...args) {
            if (val) {
                hue$.set(color.hue(val).hue());
                return this;
            }

            return color.hue()
        },
        saturation(val?: number, ...args) {
            if (val) {
                saturation$.set(color.saturation(val).saturation());
                return this;
            }

            return color.saturation()
        },
        lightness(val?: number, ...args) {
            if (val) {
                lightness$.set(color.lightness(val).lightness());
                return this;
            }

            return color.lightness()
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
        }
    }

    return {
        hsl$,
        hue$: derived(hue$, d => d),
        saturation$: derived(saturation$, d => d),
        lightness$: derived(lightness$, d => d),
        alpha$: derived(alpha$, d => d),
        data: bridge(hsl$)
    };

}

export const bridge = (hsl$: HSL$) => ({
    get hue() {
        return hsl$.hue();
    },
    set hue(val) {
        hsl$.hue(val);
    },
    get saturation() {
        return hsl$.saturation();
    },
    set saturation(val) {
        hsl$.saturation(val);
    },
    get lightness() {
        return hsl$.lightness();
    },
    set lightness(val) {
        hsl$.lightness(val);
    },
    get alpha() {
        return hsl$.alpha();
    },
    set alpha(val) {
        hsl$.alpha(val);
    }
})
