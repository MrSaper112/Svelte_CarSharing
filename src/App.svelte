<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./home.svelte";
	import Login from "./accountsOperations/Login.svelte";
	import Register from "./accountsOperations/Register.svelte";
	import { address } from "./config";
	import MyReservations from "./structure/MyReservations.svelte";
	import UserManagement from "./structure/UserManagement.svelte";

	export let url = "";
</script>

<Router {url}>
	<div>
		<Route path={address}><Login /></Route>
		<Route path="{address}register"><Register /></Route>
		<Route path="{address}home" let:params><Home /></Route>
		<Route path="{address}myReservations"><MyReservations /></Route>
		<Route path="{address}userManagement"><UserManagement /></Route>
	</div>
</Router>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	body {
		margin: 0;
		padding: 0;
		-ms-overflow-style: none; /* for Internet Explorer, Edge */
		scrollbar-width: none; /* for Firefox */
		overflow-y: scroll;
	}

	body::-webkit-scrollbar {
		display: none; /* for Chrome, Safari, and Opera */
	}
</style>
