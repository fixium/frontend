<script lang="ts">
	import { onMount } from 'svelte';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
	//‑‑‑ Props que el padre puede bindear
	export let value = '';
	export let placeholder = '';
	export let required = false;

	let input: HTMLInputElement;
	let toggleBtn: HTMLButtonElement;

	const chars =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';

	onMount(() => {
		gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);

		const EYE = toggleBtn.querySelector('.eye')!;
		const PROXY = document.createElement('div');

		let busy = false;
		let blinkTl: gsap.core.Timeline;

		const BLINK_SPEED = 0.075;
		const TOGGLE_SPEED = 0.1;
		const ENCRYPT_SPEED = 1;

		function blink() {
			const delay = gsap.utils.random(2, 8);
			const duration = BLINK_SPEED;
			const repeat = Math.random() > 0.5 ? 3 : 1;
			blinkTl = gsap
				.timeline({ delay, onComplete: blink, repeat, yoyo: true })
				.to('.lid--upper', { morphSVG: '.lid--lower', duration })
				.to('#eye-open path', { morphSVG: '#eye-closed path', duration }, 0);
		}
		blink();

		// mueve pupila
		window.addEventListener('pointermove', ({ x, y }) => {
			const BOUNDS = EYE.getBoundingClientRect();
			const map = gsap.utils.mapRange(-100, 100, 30, -30);
			gsap.set('.eye', {
				xPercent: gsap.utils.clamp(-30, 30, map(BOUNDS.x - x)),
				yPercent: gsap.utils.clamp(-30, 30, map(BOUNDS.y - y))
			});
		});

		// toggle texto/••••
		toggleBtn.addEventListener('click', () => {
			if (busy) return;
			const isPassword = input.type === 'password';
			const original = input.value;
			busy = true;
			toggleBtn.setAttribute('aria-pressed', String(isPassword));

			const tl = gsap.timeline({
				onComplete() {
					if (!isPassword) blink();
					busy = false;
				}
			});

			// parpadeo
			tl.to('.lid--upper', {
				morphSVG: isPassword ? '.lid--lower' : '.lid--upper',
				duration: TOGGLE_SPEED
			})
				.to(
					'#eye-open path',
					{
						morphSVG: isPassword ? '#eye-closed path' : '#eye-open path',
						duration: TOGGLE_SPEED
					},
					0
				)
				.to(
					PROXY,
					{
						duration: ENCRYPT_SPEED,
						onStart() {
							input.type = isPassword ? 'text' : 'password';
						},
						onComplete() {
							PROXY.innerHTML = '';
							input.value = original;
						},
						scrambleText: {
							chars,
							text: isPassword
								? original.charAt(original.length - 1) === ' '
									? `${original.slice(0, -1)}${chars[Math.floor(Math.random() * chars.length)]}`
									: original
								: new Array(original.length).fill('•').join('')
						},
						onUpdate() {
							if (isPassword)
								input.value = `${PROXY.textContent}${new Array(
									original.length - PROXY.textContent!.length
								).fill('•').join('')}`;
							else input.value = `${PROXY.textContent}${original.slice(PROXY.textContent!.length)}`;
						}
					},
					0
				);
		});
	});
</script>

<div class="form-group">
	<input
		bind:this={input}
		bind:value
		id="password"
		{required}
		type="password"
		placeholder={placeholder}
	/>
	<label for="password">{placeholder}</label>

	<button bind:this={toggleBtn} type="button" aria-pressed="false" title="Mostrar / ocultar contraseña">
		<!-- svg completo copiado de tu demo -->
		<svg viewBox="0 0 24 24" fill="none">
			<defs>
				<mask id="eye-open">
					<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12V20H12H1V12Z" fill="#fff" stroke="#000"
						stroke-width="1.5" stroke-linejoin="round" />
				</mask>
				<mask id="eye-closed">
					<path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12V20H12H1V12Z" fill="#fff" />
				</mask>
			</defs>
			<path class="lid lid--upper" d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor"
				stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			<path class="lid lid--lower" d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor"
				stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			<g mask="url(#eye-open)">
				<g class="eye">
					<circle cy="12" cx="12" r="4" fill="currentColor" />
					<circle cy="11" cx="13" r="1" fill="black" />
				</g>
			</g>
		</svg>
		<span class="sr-only">Reveal</span>
	</button>
</div>

<style>
	/* Copia solo lo esencial de tu demo ‑‑ recortado para Brevedad */
	.form-group {
		position: relative;
	}

	input {
		font-family: "Geist Mono", monospace;
		font-size: 1.1rem;
		padding: 0.8rem 1.2rem 0.8rem 1.2rem;
		padding-right: 3.2rem;
		border-radius: 0.5rem;
		border: 2px solid var(--color-alpha);
		width: 100%;
		background: var(--input-bg);
		color: var(--color);
	}

	label {
		position: absolute;
		left: 1.2rem;
		top: -0.75rem;
		font-size: 0.7rem;
		color: var(--color-alpha);
		background: transparent;
	}

	button {
		position: absolute;
		right: 0.4rem;
		top: 50%;
		translate: 0 -50%;
		border: 0;
		background: transparent;
		width: 2.2rem;
		height: 2.2rem;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: var(--color-alpha);
	}

	button:is(:hover, :focus-visible) {
		color: var(--color);
	}

	button svg {
		width: 100%;
	}

	.sr-only {
		position: absolute;
		left: -9999px;
		top: -9999px;
	}
</style>
