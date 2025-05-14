<script>
	import { onMount } from 'svelte';

	let vantaEffect;

	onMount(() => {
		if (typeof VANTA !== 'undefined') {
			vandaEffect = VANTA.GLOBE({
				el: '#vanta-bg',
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				minHeight: 200.0,
				minWidth: 200.0,
				scale: 1.0,
				scaleMobile: 1.0,
				color: 0xc0708,
				color2: 0x70202,
				backgroundColor: 0xcfcfcf
			});
		}
	});
</script>

<svelte:head>
	<!-- Bootstrap + Arvo font -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
	/>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Arvo" />

	<!-- Vanta.js + Three.js -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
</svelte:head>

<!-- Aislamos visualmente usando position fixed y z-index -->
<div id="vanta-bg" class="page_404_wrapper">
	<section class="page_404 container">
		<div class="row">
			<div class="col-sm-12">
				<div class="col-sm-10 col-sm-offset-1 text-center">
					<div class="four_zero_four_bg">
						<div class="image_blur"></div>
						<h1 class="overlay_text">404</h1>
					</div>

					<div class="contant_box_404">
						<h3 class="h2">Look like you're lost</h3>
						<p>The page you are looking for is not available!</p>
						<button class="link_404" on:click={() => history.back()}>Go Back</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* Fondo aislado que cubre toda la pantalla */
	.page_404_wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		overflow-y: auto;
		color: white;
	}

	.page_404 {
		padding-top: 100px;
		min-height: 100vh;
		font-family: 'Arvo', serif;
		position: relative;
		z-index: 1;
	}

	.four_zero_four_bg {
		background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
		height: 450px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
		margin-bottom: 40px;
	}

	.four_zero_four_bg h1 {
		font-size: 80px;
		color: #fff;
	}

	/* Texto centrado por encima */
	.overlay_text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 80px;
		color: white;
		z-index: 2;
		text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
	}

	.contant_box_404 h3 {
		font-size: 32px;
		color: #fff;
	}

	.contant_box_404 p {
		color: #ddd;
	}

	.link_404 {
		color: #fff !important;
		padding: 10px 20px;
		background: #39ac31;
		margin: 20px 0;
		display: inline-block;
		text-decoration: none;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.four_zero_four_bg {
			height: 200px;
		}
		.overlay_text {
			font-size: 48px;
		}
		.contant_box_404 h3 {
			font-size: 24px;
		}
	}
</style>
