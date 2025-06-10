<script lang="ts">
	import { step } from '$lib/stores/stepStore'; // step actual
	import ClienteStep from './steps/ClienteStep.svelte';
	import DispositivoStep from './steps/DispositivoStep.svelte';
	import TicketStep from './steps/TicketStep.svelte';
	import ImagenesStep from './steps/ImagenesStep.svelte';
	import SummaryStep from './steps/SummaryStep.svelte';
</script>

{#if $step === 1}
	<ClienteStep />
{:else if $step === 2}
	<DispositivoStep />
{:else if $step === 3}
	<TicketStep />
{:else if $step === 4}
	<ImagenesStep />
{:else if $step === 5}
	<SummaryStep />
{/if}
