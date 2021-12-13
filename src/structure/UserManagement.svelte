<script>
    import { accountType, fetchBase, address } from "../config.js";
    import { onMount, createEventDispatcher } from "svelte";
    import Header from "./Header.svelte";
    let acType;
    accountType.subscribe((val) => (acType = val));
    let accounts = [];
    onMount(async () => {
        if (acType == "admin") {
            let myRes = await fetchBase("main.php", {
                getUsers: true,
            });
            accounts = myRes.users;
        }
    });
    let sortBy = "";

    let change = () => {
        console.log(sortBy);
        let sorted;
        if (sortBy == "byUsername") {
            sorted = accounts.sort((a, b) => {
                if (a.username < b.username) {
                    return -1;
                }
                if (a.username > b.username) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byEmail") {
            sorted = accounts.sort((a, b) => {
                if (a.email < b.email) {
                    return -1;
                }
                if (a.email > b.email) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byAcceptation") {
            sorted = accounts.sort((a, b) => {
                if (a.accepted < b.accepted) {
                    return -1;
                }
                if (a.accepted > b.accepted) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy == "byType") {
            sorted = accounts.sort((a, b) => {
                if (a.type < b.type) {
                    return -1;
                }
                if (a.type > b.type) {
                    return 1;
                }
                return 0;
            });
        }
        accounts = [...sorted];
    };
    let selected = { username: "", email: "" };
    let handleAcceptation = async (username, email, type, status) => {
        let res = await fetchBase("main.php", {
            accountOperations: true,
            operation: "acceptUser",

            username: username,
            email: email,
            type: type,
            status: status,
        });

        let index = accounts.indexOf(
            accounts.filter((a) => {
                return (
                    a.username == username && a.email == email && a.type == type
                );
            })[0]
        );
        if ("query" in res && res.query) {
            let x = 0;
            if (status == "accepted") x = 1;
            accounts[index].accepted = x;
            alert("Users Updated");
        } else {
            alert("Update didn't completed");
        }
    };

    let select = async (e) => {
        let paramToChange = {
            accountOperations: true,
            operation: "changeType",

            username: selected.username,
            email: selected.email,
            type: e.target.value,
        };
        let res = await fetchBase("main.php", paramToChange);
        if ("query" in res && res.query) {
            let index = accounts.indexOf(
                accounts.filter((a) => {
                    return (
                        a.username == selected.username &&
                        a.email == selected.email
                    );
                })[0]
            );
            accounts[index].type = e.target.value;
            alert("Users Updated");
        } else {
            alert("Update didn't completed");
        }
    };
</script>

<main>
    <Header acc={acType} />

    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 concon">
            <div
                class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 concon2"
            >
                <div
                    class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                >
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Nr.
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Username
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Account type
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Is Accepted?
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Sort option:
                                    <select
                                        bind:value={sortBy}
                                        on:change={change}
                                    >
                                        <option value="" disabled />
                                        <option value="byUsername"
                                            >By username</option
                                        >
                                        <option value="byEmail">By Email</option
                                        >
                                        <option value="byAcceptation"
                                            >By Acceptation</option
                                        >
                                        <option value="byType">By Type</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#if accounts.length != 0}
                                {#each accounts as { username, type, email, accepted }, i}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {i}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {username}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {email}
                                            </div>
                                        </td>
                                        <td class="px-2 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {#if type == "admin"}
                                                    <select disabled>
                                                        <option value="admin"
                                                            >Admin</option
                                                        >
                                                    </select>
                                                {:else if type != "admin" && accepted == 1}
                                                    <select
                                                        on:change={(e) => {
                                                            selected = {
                                                                username:
                                                                    username,
                                                                email: email,
                                                            };
                                                            select(e);
                                                        }}
                                                    >
                                                        {#if type == "user"}
                                                            <option value="user"
                                                                >User</option
                                                            >
                                                            <option
                                                                value="moderator"
                                                                >Moderator</option
                                                            >
                                                        {:else if type == "moderator"}
                                                            <option
                                                                value="moderator"
                                                                >Moderator</option
                                                            >
                                                            <option value="user"
                                                                >user</option
                                                            >
                                                        {/if}
                                                    </select>
                                                {/if}
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            <div class="text-sm text-gray-900">
                                                {#if accepted != 0}
                                                    Accepted
                                                {:else}
                                                    Not Accepted
                                                {/if}
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            <div class="text-sm text-gray-900">
                                                {#if type != "admin"}
                                                    {#if accepted == 0}
                                                        <button
                                                            class="text-gray-900"
                                                            on:click={handleAcceptation(
                                                                username,
                                                                email,
                                                                type,
                                                                "accepted"
                                                            )}>Accept</button
                                                        >
                                                    {:else if accepted == 1}
                                                        <button
                                                            class="text-gray-900"
                                                            on:click={handleAcceptation(
                                                                username,
                                                                email,
                                                                type,
                                                                "notAccepted"
                                                            )}>Disaccept</button
                                                        >
                                                    {/if}
                                                {/if}
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    button {
        width: 10vw;
    }
</style>
