# svelte-tools

This project contains some store that you may find usefull

## Install

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
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
store$.value = "JavaScript is the best"
```

## Colorable store

a colorable store generates colors as you provide values, there are two colorable store: `rgbColorable` & `hslColorable`

```js
import {rgbColorable, hslColorable} from 'svelte-tools'

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
