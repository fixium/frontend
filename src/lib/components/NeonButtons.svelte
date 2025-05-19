<script lang="ts">
	/*  
	   ──────────────────────────────────────────────
	   Cada acción será un objeto:
	     { label: string, color: string, onClick?: () => void }
	   Así evitamos hard‑codear textos y colores en la plantilla.
	*/
	export let actions: {
		label: string;
		color: string;
		onClick?: () => void;
	}[] = [];
</script>

<div class="neon‑container">
	{#each actions as action, i}
		<a
			href="javascript:void(0)"
			on:click|preventDefault={action.onClick}
			style="--clr:{action.color}; --i:{i}"
		>
			<span>{action.label}</span>
		</a>
	{/each}
</div>

<style>
	/*  🔒  Nada global: todo comienza en .neon‑container …   */
	.neon‑container {
		/* flex + centrado parecido al original */
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		gap: 2rem;
		padding: 2rem 0;
	}

	.neon‑container a {
		position: relative;
		padding: 20px 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
		transition: 1s;
		overflow: hidden;
		text-decoration: none;
        border-radius: 1.5rem; /* o el valor que prefieras */

	}

	.neon‑container a:hover {
		background: var(--clr);
		box-shadow: 0 0 1px var(--clr), 0 0 2px var(--clr), 0 0 2px var(--clr),
			0 0 10px var(--clr);
	}

	.neon‑container a::before {
		content: '';
		position: absolute;
		width: 40px;
		height: 400%;
		background: var(--clr);
		transition: 1s;
		animation: neonRotate 2s linear infinite;
		animation-delay: calc(0.33s * var(--i));
	}

	.neon‑container a:hover::before {
		width: 120%;
	}

	@keyframes neonRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.neon‑container a::after {
		content: '';
		position: absolute;
		background: #0e1538;
		inset: 4px;
		transition: 0.5s;
        	border-radius: 1.5rem; /* <-- también aquí */

	}

	.neon‑container a:hover::after {
		background: var(--clr);
	}

	.neon‑container a span {
		position: relative;
		z-index: 1;
		font-size: 0.7rem; /* 2 em era muy grande junto a Tailwind */
		color: #fff;
		opacity: 0.85;
		letter-spacing: 2px;
		text-transform: uppercase;
		transition: 0.5s;
        
	}

	.neon‑container a:hover span {
		opacity: 1;
		color: #0e1538;
	}
</style>
