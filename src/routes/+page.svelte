<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let show = true;

	onMount(() => {
		// setTimeout(() => {
		//     show = false;
		//     goto('/dashboard');
		// }, 1000);
		goto('/dashboard');
	});
</script>

<!-- {#if show}
    <div class="welcome-container">
        <h1 class="welcome-title">¡Bienvenido a Fixium!</h1>
        <div class="welcome-bar"></div>
    </div>
{/if} -->

<style>
	.welcome-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
		background: transparent;
		animation: fadeIn 0.7s;
	}
	.welcome-title {
		font-size: 5.5rem;
		font-weight: bold;
		color: #2563eb;
		letter-spacing: 2px;
		animation: bounceIn 1s;
	}
	.welcome-bar {
		width: 120px;
		height: 6px;
		background: linear-gradient(90deg, #2563eb 0%, #22d3ee 100%);
		border-radius: 3px;
		margin-top: 1.5rem;
		animation: barGrow 1.2s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes bounceIn {
		0% {
			transform: scale(0.7);
			opacity: 0;
		}
		60% {
			transform: scale(1.1);
			opacity: 1;
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes barGrow {
		0% {
			width: 0;
			opacity: 0;
		}
		60% {
			width: 120px;
			opacity: 1;
		}
		100% {
			width: 120px;
		}
	}
	:global(.dark) .welcome-title {
		color: #60a5fa;
	}
	:global(.dark) .welcome-bar {
		background: linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%);
	}
</style>
