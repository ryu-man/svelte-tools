import { writable as svelteWritable, readable as svelteReadable, type Subscriber, type Unsubscriber, type Updater, type Readable, type Writable } from "svelte/store"

export type Invalidator<T> = (value?: T) => void;

export type Accessible<T> = Writable<T> & { value: T }

export const accessible = <T>(value: T): Accessible<T> => {
    let _value = value

    const { set, update, subscribe } = svelteWritable<T>(_value)

    return {
        subscribe,
        update: (updater: Updater<T>) => {
            _value = updater(_value)
            return update(updater)
        },
        set: (val: T) => {
            _value = val
            set(_value)
        },
        get value() {
            return _value
        },
        set value(val) {
            _value = val
            set(_value)
        }
    }
}
export declare type WritableAccess<T> = Writable<T> & { value: T }
export const writable = <T>(value?: T): WritableAccess<T> => {
    let _value = value

    const { set, update, subscribe } = svelteWritable<T>(_value)

    return {
        subscribe,
        update: (updater: Updater<T>) => {
            return update(old => (_value = updater(old)))
        },
        set: (val: T) => {
            _value = val
            set(_value)
        },
        get value() {
            return _value
        },
        set value(val) {
            this.set(val)
        }
    }
}

export declare type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;
export declare type ReadableAccess<T> = Readable<T> & { readonly value: T }
export const readable = <T>(value?: T, start?: StartStopNotifier<T>): ReadableAccess<T> => {
    let _value = value

    const { subscribe } = svelteReadable<T>(_value, (set) => {
        return start((value: T) => set(_value = value))
    })

    return {
        subscribe,
        get value() {
            return _value
        },
    }
}
