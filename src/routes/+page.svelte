<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Navegar a /home al hacer Log In
	function handleLogin() {
		goto('/home');
	}

	onMount(() => {
		const $ = window.jQuery;
		// Toggle Sign Up → Login
		$('#goRight').on('click', () => {
			$('#slideBox').animate({ marginLeft: '0' });
			$('.topLayer').animate({ marginLeft: '100%' });
		});
		// Toggle Login → Sign Up
		$('#goLeft').on('click', () => {
			const ml = window.innerWidth > 769 ? '50%' : '20%';
			$('#slideBox').animate({ marginLeft: ml });
			$('.topLayer').animate({ marginLeft: '0' });
		});
	});
</script>

<svelte:head>
  <!-- Three.js y Vanta.NET desde CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
</svelte:head>


<div id="slideBox">
	<div class="topLayer">
		<!-- Sign Up -->
		<div class="left" style="scrollbar-width: none;">
			<div class="content">
				<h2>Sign Up</h2>
				<form on:submit|preventDefault>
					<div class="form-element form-stack">
						<label for="email">Email</label>
						<input id="email" type="email" name="email" />
					</div>
					<div class="form-element form-stack">
						<label for="username-signup">Username</label>
						<input id="username-signup" type="text" name="username" />
					</div>
					<div class="form-element form-stack">
						<label for="password-signup">Password</label>
						<input id="password-signup" type="password" name="password" />
					</div>
					<div class="form-element form-checkbox">
						<input id="confirm-terms" type="checkbox" class="checkbox" />
						<label for="confirm-terms">
							I agree to the
							<button type="button" class="link-button">Terms of Service</button>
							<button type="button" class="link-button">Privacy Policy</button>
						</label>
					</div>
					<div class="form-element form-submit">
						<button class="signup" type="submit">Sign up</button>
						<button id="goLeft" class="signup off" type="button"> Log In </button>
					</div>
				</form>
			</div>
		</div>

		<!-- Login -->
		<div class="right" style="scrollbar-width: none;">
			<div class="content">
				<h2>Login</h2>
				<form on:submit|preventDefault>
					<div class="form-element form-stack">
						<label for="username-login">Username</label>
						<input id="username-login" type="text" name="username" />
					</div>
					<div class="form-element form-stack">
						<label for="password-login">Password</label>
						<input id="password-login" type="password" name="password" />
					</div>
					<div class="form-element form-submit">
						<button class="login" type="button" on:click={handleLogin}> Log In </button>
						<button id="goRight" class="login off" type="button"> Sign Up </button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style global>
	:global(body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		width: 100% !important;
		box-sizing: border-box;
		font-family: 'Roboto', sans-serif;
	}
	.link-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		color: #03a9f4;
		text-decoration: underline;
		cursor: pointer;
		font: inherit;
	}
	.link-button:focus {
		outline: 2px solid #0288d1;
	}

	/* #back {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -999;
	}
	.canvas-back {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	.backRight {
		position: absolute;
		right: 0;
		width: 50%;
		height: 100%;
		background: #03a9f4;
	}
	.backLeft {
		position: absolute;
		left: 0;
		width: 50%;
		height: 100%;
		background: #673ab7;
	}

	#back {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -999;
	}
	.canvas-back {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	} */
	#slideBox {
		width: 50%;
		max-height: 100%;
		height: 100%;
		overflow: hidden;
		margin-left: 50%;
		position: absolute;
		box-shadow:
			0 14px 28px rgba(0, 0, 0, 0.25),
			0 10px 10px rgba(0, 0, 0, 0.22);
	}
	.topLayer {
		width: 200%;
		height: 100%;
		position: relative;
		left: -100%;
	}
	label {
		font-size: 0.8em;
		text-transform: uppercase;
	}
	input {
		background-color: transparent;
		border: 0;
		outline: 0;
		font-size: 1em;
		padding: 8px 1px;
		margin-top: 0.1em;
	}
	.left {
		width: 50%;
		height: 100%;
		overflow: scroll;
		background: #2c3034;
		position: absolute;
		left: 0;
	}
	.left label {
		color: #e3e3e3;
	}
	.left input {
		border-bottom: 1px solid #e3e3e3;
		color: #e3e3e3;
	}
	.left input:focus,
	.left input:active {
		border-color: #03a9f4;
		color: #03a9f4;
	}
	.left input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 30px #2c3034 inset;
		-webkit-text-fill-color: #e3e3e3;
	}
	/* .left a {
		color: #03a9f4;
	} */
	.right {
		width: 50%;
		height: 100%;
		overflow: scroll;
		background: #f9f9f9;
		position: absolute;
		right: 0;
	}
	.right label {
		color: #212121;
	}
	.right input {
		border-bottom: 1px solid #212121;
	}
	.right input:focus,
	.right input:active {
		border-color: #673ab7;
	}
	.right input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 30px #f9f9f9 inset;
		-webkit-text-fill-color: #212121;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 100%;
		width: 80%;
		margin: 0 auto;
		position: relative;
	}
	.content h2 {
		font-weight: 300;
		font-size: 2.6em;
		margin: 0.2em 0 0.1em;
	}
	.left .content h2 {
		color: #03a9f4;
	}
	.right .content h2 {
		color: #673ab7;
	}
	.form-element {
		margin: 1.6em 0;
	}
	.form-element.form-submit {
		margin: 1.6em 0 0;
	}
	.form-stack {
		display: flex;
		flex-direction: column;
	}
	.checkbox {
		appearance: none;
		-webkit-appearance: none;
		outline: none;
		background-color: #e3e3e3;
		border: 1px solid #e3e3e3;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.05),
			inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
		padding: 12px;
		border-radius: 4px;
		display: inline-block;
		position: relative;
	}
	.checkbox:focus,
	.checkbox:checked:focus,
	.checkbox:active,
	.checkbox:checked:active {
		border-color: #03a9f4;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.05),
			inset 0px 1px 3px rgba(0, 0, 0, 0.1);
	}
	.checkbox:checked {
		outline: none;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.05),
			inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
			inset 15px 10px -12px rgba(255, 255, 255, 0.1);
	}
	.checkbox:checked:after {
		outline: none;
		content: '✓';
		color: #03a9f4;
		font-size: 1.4em;
		font-weight: 900;
		position: absolute;
		top: -4px;
		left: 4px;
	}
	.form-checkbox {
		display: flex;
		align-items: center;
	}
	.form-checkbox label {
		margin: 0 6px 0;
		font-size: 0.72em;
	}
	button {
		padding: 0.8em 1.2em;
		margin: 0 10px 0 0;
		width: auto;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 1em;
		color: #fff;
		line-height: 1em;
		letter-spacing: 0.6px;
		border-radius: 3px;
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.1),
			0 3px 6px rgba(0, 0, 0, 0.1);
		border: 0;
		outline: 0;
		transition: all 0.25s;
	}
	button.signup {
		background: #03a9f4;
	}
	button.login {
		background: #673ab7;
	}
	button.off {
		background: none;
		box-shadow: none;
		margin: 0;
	}
	button.off.signup {
		color: #03a9f4;
	}
	button.off.login {
		color: #673ab7;
	}
	button:focus,
	button:active,
	button:hover {
		box-shadow:
			0 4px 7px rgba(0, 0, 0, 0.1),
			0 3px 6px rgba(0, 0, 0, 0.1);
	}
	button:focus.signup,
	button:active.signup,
	button:hover.signup {
		background: #0288d1;
	}
	button:focus.login,
	button:active.login,
	button:hover.login {
		background: #512da8;
	}
	button:focus.off,
	button:active.off,
	button:hover.off {
		box-shadow: none;
	}
	button:focus.off.signup,
	button:active.off.signup,
	button:hover.off.signup {
		color: #03a9f4;
		background: #212121;
	}
	button:focus.off.login,
	button:active.off.login,
	button:hover.off.login {
		color: #512da8;
		background: #e3e3e3;
	}

	@media only screen and (max-width: 768px) {
		#slideBox {
			width: 80%;
			margin-left: 20%;
		}
		/* .signup-info,
		.login-info {
			display: none;
		} */
	}
</style>
