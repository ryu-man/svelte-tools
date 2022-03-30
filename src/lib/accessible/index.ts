import { writable, type Updater } from "svelte/store"

export const accessible = <T>(value: T) => {
    let _value = value

    const { set, update, subscribe } = writable<T>(_value)

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
