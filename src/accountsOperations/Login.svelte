<script>
    import { Router, Route, Link, navigate } from "svelte-routing";
    import { address, accountType, fetchBase } from "../config";
    export const newAddress = address + "register";
    window.addEventListener("DOMContentLoaded", async (event) => {
        console.log("DOM fully loaded and parsed");
        await loadPage();
    });
    let email;
    let password;

    let validate = async () => {
        let data = await fetchBase("login.php", {
            email: email,
            passwd: password,
        });
        console.log(data);
        if ("logged" in data && data.logged) loadPage();
        else if ("logged" in data && data.logged) alert("Login failed!");

        if ("emailInBase" in data && !data.emailInBase)
            alert("Email address doesn't exist in base");

        if ("message" in data && data.message) alert(data.message);
    };

    let loadPage = async () => {
        let data = await fetchBase("main.php", {
            openPage: true,
        });
        if ("exist" in data && data.exist) {
            accountType.set(data.accountType);
            navigate("home");
        }
    };
</script>

<main>
    <div
        class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <img
                    class="mx-auto h-12 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                />
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Sign in to your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Or
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <Link
                        to={newAddress}
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Register
                    </Link>
                </p>
            </div>
            <form class="mt-8 space-y-6" on:submit|preventDefault={validate}>
                <input type="hidden" name="remember" value="true" />
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email-address" class="sr-only"
                            >Email address</label
                        >
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            bind:value={email}
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            bind:value={password}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span
                            class="absolute left-0 inset-y-0 flex items-center pl-3"
                        >
                            <!-- Heroicon name: solid/lock-closed -->
                            <svg
                                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>
