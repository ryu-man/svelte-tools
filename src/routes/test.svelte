<script>
	import { writable } from '$lib';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	const store1$ = writable(...Array(100_000).keys());
	onMount(() => {});

	const iterations = 10_000_000;
</script>

<h1>TEST</h1>

<button
	on:click={() => {
		console.time('native');
		for (let i = 0; i < iterations; i++) {
			$store1$;
		}
		for (let i = 0; i < iterations; i++) {
			$store1$;
		}
		console.timeEnd('native');

		console.time('accessor');
		for (let i = 0; i < iterations; i++) {
			store1$.value;
		}
		for (let i = 0; i < iterations; i++) {
			store1$.value;
		}
		console.timeEnd('accessor');

		// console.time('get');
		// for (let i = 0; i < iterations; i++) {
		// 	get(store1$);
		// }
		// for (let i = 0; i < 1000000; i++) {
		// 	get(store1$);
		// }
		// console.timeEnd('get');
	}}>Run</button
>
