import { writable as svelteWritable, readable as svelteReadable, derived as svelteDerived, type Subscriber, type Unsubscriber, type Updater, type Readable, type Writable } from "svelte/store"

export type Invalidator<T> = (value?: T) => void;

export type Accessible<T> = Writable<T> & { value: T }

export function accessible<T>(value: T): Accessible<T> {
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
export declare type WritableAccess<T> = Writable<T> & { readonly value: T }
export function writable<T>(value?: T): WritableAccess<T> {

    const { set, update, subscribe } = svelteWritable<T>(value)

    const store = {
        subscribe,
        update: (updater: Updater<T>) => update(old => store.value = updater(old)),
        set: (val: T) => set(store.value = val),
        value
    }

    return store
}

export declare type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;
export declare type ReadableAccess<T> = Readable<T> & { readonly value: T }
export function readable<T>(value?: T, start?: StartStopNotifier<T>): ReadableAccess<T> {
    const { subscribe } = svelteReadable<T>(value, (set) => {
        return start((value: T) => set(store.value = value))
    })

    const store = {
        subscribe,
        value
    }

    return store
}



declare type Stores = ReadableAccess<any> | [ReadableAccess<any>, ...Array<ReadableAccess<any>>] | Array<ReadableAccess<any>>;
/** One or more values from `Readable` stores. */
declare type StoresValues<T> = T extends ReadableAccess<infer U> ? U : {
    [K in keyof T]: T[K] extends ReadableAccess<infer U> ? U : never;
};
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - when used asynchronously
 */
export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void, initial_value?: T): ReadableAccess<T>;
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - initial value
 */
export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>) => T, initial_value?: T): ReadableAccess<T>;
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 */

export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>) => T): ReadableAccess<T>;

export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set?: (value: T) => void) => T, initial_value?: T): ReadableAccess<T> {

    //@ts-ignore
    const { subscribe } = svelteDerived(stores, (values, ...args) => (store.value = fn(values, ...args)), ...[initial_value].filter(Boolean))

    let initialValue
    if (stores instanceof Array) {
        initialValue = fn(stores.map(store => store.value))
    } else {
        initialValue = fn(stores.value)
    }

    const store = {
        subscribe,
        value: initialValue
    }

    return store
}
