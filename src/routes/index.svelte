<script>
	import { colorable, accessible  } from '$lib';

	const colorable$ = colorable();
	const red$ = colorable$.red$;
	const green$ = colorable$.green$;
	const blue$ = colorable$.blue$;
	const alpha$ = colorable$.alpha$;

	const store = accessible($colorable$)

	$: store.value = $colorable$

	let color = store.value
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<h3>Accesible <span>{color}</span></h3>
<div class="flex col items-center">
	<div class="colorable" style:background-color={$colorable$} />
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
			style:background-color={`rgba(0, 0, 0, ${$alpha$ / 255})`}
		>
			<span>{($alpha$ / 255).toFixed(2)}</span>
		</div>
	</div>

	<div class="flex col">
		<input type="range" min="0" max="255" bind:value={colorable$.red} />
		<input type="range" min="0" max="255" bind:value={colorable$.green} />
		<input type="range" min="0" max="255" bind:value={colorable$.blue} />
		<input type="range" min="0" max="255" bind:value={colorable$.alpha} />
	</div>
</div>

<button
	on:click={() => {
		color= store.value
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
