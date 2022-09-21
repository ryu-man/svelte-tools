import type { Updater, Writable } from "svelte/store"
import { writable, derived, type WritableAccess, type ReadableAccess } from '../accessible'

export type Memorable<T> = [current: WritableAccess<T>, ...memories: ReadableAccess<T>[]] & Writable<T>

export function memorable<T>(value: T, capacity = 1): Memorable<T> {

    const store = writable([value, ...Array(capacity).fill(value)])

    const memorize = (oldMemories, newMemory, max = capacity) => {
        if(oldMemories[0] !== newMemory){
            return [newMemory, ...oldMemories].slice(0, max + 1)
        } 

        return oldMemories
    }

    const current = {
        set: (val: T) => store.update((values) => memorize(values, val)),
        update: (fn: Updater<T>) => store.update(values => memorize(values, fn(values[0]))),
        subscribe: derived(store, values => values[0]).subscribe
    }

    Object.defineProperty(current, 'value', {
        get: () => store.value[0]
    })

    const values: Memorable<T> = [
        //@ts-ignore
        current,
        ...[...Array(capacity)].map((_, i) => derived(store, values => values[i + 1]))
    ]
    values.set = current.set
    values.subscribe = current.subscribe
    values.update = current.update
 
    return values
}
