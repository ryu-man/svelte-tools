# svelte-tools

**svelte-tools** is a collection of utilities that helps developers writing better cleaner codes

## Install

```bash
npm i svelte-tools
```

## Accessible stores (writable / readable / derived)

an accessible writable / readable / derived is a svelte store designed to let the user access the data without subscribing

```js
import { writable, readable, derived } from 'svelte-tools'

// create an accessible store
const store$ = writable("Hello world!")

// can access the data on demamnde
console.log(store$.value)

// set the data will trigger the store to react
store.set("JavaScript is the best")
```

## Memorable store

memorable store lets you access old memories of the current value

```js
import { memorable } from 'svelte-tools'

// create an accessible store
const [current, old, older, oldest] = memorable(new Date().getSeconds(), 3)

setInterval(()=> current.set(new Date().getSeconds()), 1000)

// can access the data on demamnde
$: console.log($current, $old, $older, $oldest)
```

## Colorable store

a colorable store generates colors as you provide values, there are two colorable store: `rgbColorable` & `hslColorable`

```js
import { rgbColorable, hslColorable } from 'svelte-tools'

// create an accessible store
// can subscribe to individuel stores
// rgb$ is the color store
// red$, green$, blue$, alpha$ are stores of what color is made of
const { rgb$, red$, green$, blue$, alpha$} = rgbColorable();

const { hsl$, hue$, saturation$, lightness$, alpha$} = hslColorable();

// Note: stores will have a trailing '$' ex: hsl$
```

By default colorable stores will use `spring` to animate changes, but it can be configurable to use `tweened` store instead, for that you need to specify tweened options , see the example below

```js
import { rgbColorable } from 'svelte-tools'

# create colorable rgb store
const { rgb$ } = rgbColorable({}, {duration:400});
```

you can use a simple object for data binding

```js
<script>
    import { rgbColorable } from 'svelte-tools'

    # create colorable rgb store
    const { rgb$, data } = rgbColorable();

    // data.red
    // data.green
    // data.blue
    // data.alpha
</script>

<input type="number" bind:value={data.red} min="0" max="255">
```
