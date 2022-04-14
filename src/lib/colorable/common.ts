export function fromHex(value: string) {
    return parseInt(value, 16)
}
export function toHex(value = 0) {
    return Math.trunc(value).toString(16).padStart(2, '0')
}

export function hexToRGB(hex: string): RGBData {
    const hexRegex = /(#){0,1}([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{0,2})/g;
    const regexArray = hexRegex.exec(hex);
    if (regexArray.length) {
        const [, , red, green, blue, alpha = 'ff'] = regexArray;

        return {
            red: fromHex(red),
            green: fromHex(green),
            blue: fromHex(blue),
            alpha: fromHex(alpha || 'ff')
        };
    }

    throw new Error('The hex color is not correct');
}

export declare type Data = {
    alpha?: number
}

export declare type HSLData = Data & {
    hue?: number
    saturation?: number
    lightness?: number
}

export declare type RGBData = Data & {
    red?: number;
    green?: number;
    blue?: number;
}

export declare type Color<T> = {
    hex(): string;
    toString(): string;
    clone(): Color<T>;
    update(data: T): Color<T>;
    data(): T
}
