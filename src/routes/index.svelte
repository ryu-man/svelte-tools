<script>
	import { readable, writable, derived } from '$lib';
	import { colorable as RGBColorable } from '$lib/colorable/rgb';
	import { colorable as HSLColorable } from '$lib/colorable/hsl';

	const { rgb$, red$, green$, blue$, alpha$: rgbAlpha$, data: rgb } = RGBColorable();

	const {
		hsl$,
		hue$,
		saturation$,
		lightness$,
		alpha$: hslAlpha$,
		data: hsl
	} = HSLColorable();

	const store = writable($rgb$);

	const time$ = readable(new Date(), (set) => {
		const interval = setInterval(() => set(new Date()), 1000);

		return () => clearInterval(interval);
	});

	const utc$ = derived(time$, (d) => d.toUTCString());

	$: store.value = $rgb$;

	let color = store.value;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div>{$time$.toISOString()}</div>
<div>{$utc$}</div>
<button on:click={(e) => (e.currentTarget.textContent = utc$.value)}>click me</button>
<h3>Accesible <span>{color}</span></h3>

<div style="display:flex; justify-content: space-around;">
	<div class="flex col items-center rgb">
		<div class="colorable" style:background-color={$rgb$} />
		<div class="flex">
			<div
				class="flex items-center justify-center colorable red"
				style:background-color={`rgb(${$red$}, 0, 0)`}
			>
				<span>{$red$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable green"
				style:background-color={`rgb(0, ${$green$}, 0)`}
			>
				<span>{$green$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable blue"
				style:background-color={`rgb(0, 0, ${$blue$})`}
			>
				<span>{$blue$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable alpha"
				style:background-color={`rgba(0, 0, 0, ${$rgbAlpha$})`}
			>
				<span>{$rgbAlpha$.toFixed(2)}</span>
			</div>
		</div>

		<div class="flex col">
			<input type="range" min="0" max="255" bind:value={rgb.red} />
			<input type="range" min="0" max="255" bind:value={rgb.green} />
			<input type="range" min="0" max="255" bind:value={rgb.blue} />
			<input type="range" min="0" max="1" step="0.01" bind:value={rgb.alpha} />
		</div>
	</div>

	<div class="flex col items-center hsl">
		<div class="colorable" style:background-color={$hsl$} />
		<div class="flex">
			<div
				class="flex items-center justify-center colorable red"
				style:background-color={`hsl(${$hue$}, 50%, 50%)`}
			>
				<span>{$hue$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable green"
				style:background-color={`hsl(${$hue$}, ${$saturation$}%, 50%)`}
			>
				<span>{$saturation$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable blue"
				style:background-color={`hsl(${$hue$}, 50%, ${$lightness$}%)`}
			>
				<span>{$lightness$.toFixed(0)}</span>
			</div>
			<div
				class="flex items-center justify-center colorable alpha"
				style:background-color={`hsla(0, 0%, 0%, ${$hslAlpha$})`}
			>
				<span>{$hslAlpha$.toFixed(2)}</span>
			</div>
		</div>

		<div class="flex col">
			<input type="range" min="0" max="360" bind:value={hsl.hue} />
			<input type="range" min="0" max="100" bind:value={hsl.saturation} />
			<input type="range" min="0" max="100" bind:value={hsl.lightness} />
			<input type="range" min="0" max="1" step="0.01" bind:value={hsl.alpha} />
		</div>
	</div>
</div>

<button
	on:click={() => {
		color = store.value;
	}}>Exec</button
>

<style>
	.colorable {
		width: 96px;
		height: 96px;
		margin: 4px;
	}
	.colorable > span {
		color: #adadad;
		mix-blend-mode: hard-light;
		font-size: 24pt;
	}
	.flex {
		display: flex;
	}
	.col {
		flex-direction: column;
	}
	.items-center {
		align-items: center;
	}
	.justify-center {
		justify-content: center;
	}
</style>
