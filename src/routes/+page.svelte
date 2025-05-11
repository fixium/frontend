<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/dashboard');
	});

</script>

<div>
	<h1>hola</h1>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
</style>