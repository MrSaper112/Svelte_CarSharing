<script>
    import { accountType, fetchBase, address, sortCars } from "../config.js";
    import { onMount, createEventDispatcher } from "svelte";
    import QrCode from "svelte-qrcode";
    import TdCell from "./table/TdCell.svelte";
    import Header from "./Header.svelte";
    let myReservations = [];
    let archives = [];
    let acType;
    accountType.subscribe((val) => (acType = val));

    onMount(async () => {
        console.log(acType);
        if (acType == "user") {
            let myRes = await fetchBase("carListReservation.php", {
                getMyReservations: true,
            });
            myReservations = myRes.myReservations;
            console.log(myReservations);
        } else if (acType == "moderator" || acType == "admin") {
            let myRes = await fetchBase("carListReservation.php", {
                getAllreservations: true,
            });
            myReservations = myRes.myReservations;
            archives = myRes.archives;
            console.log(myReservations);
        }
    });
    let sortBy = "";
    let sortByArchives = "";

    let sort = () => {
        let sorted = sortCars(myReservations, sortBy);
        myReservations = [...sorted];
    };
    let sortArchives = () => {
        let sorted = sortCars(archives, sortByArchives);
        archives = [...sorted];
    };

    let handleReservation = async (
        brand,
        model,
        year,
        startDay,
        endDay,
        status
    ) => {
        console.log(brand, model, year, startDay, endDay);
        let params = {
            brand: brand,
            model: model,
            year: year,
            startDay: startDay,
            endDay: endDay,
        };
        let index = myReservations.indexOf(
            myReservations.filter((a) => {
                return (
                    a.brand == brand &&
                    a.model == model &&
                    a.year == year &&
                    a.startDay == startDay &&
                    a.endDay == endDay
                );
            })[0]
        );
        let res = await fetchBase("carListReservation.php", {
            car: params,
            status: status,
        });
        if ("query" in res && res.query) {
            if (status == "accept") {
                myReservations[index].status = "confirmed";
                myReservations[index].hashCode = res.hash;
            }
            if (status == "refuse") {
                myReservations[index].status = "unconfirmed";
            }
            if (status == "cancel") {
                myReservations[index].status = "canceled";
            }
        } else {
            console.warn(query);
        }
        console.log(myReservations);
    };
    let hidden = true;
    let qrCode = "";
    let showQRCode = (brand, model, year, startDay, endDay) => {
        let index = myReservations.indexOf(
            myReservations.filter((a) => {
                return (
                    a.brand == brand &&
                    a.model == model &&
                    a.year == year &&
                    a.startDay == startDay &&
                    a.endDay == endDay
                );
            })[0]
        );
        if (qrCode !== myReservations[index].hashCode) {
            qrCode = myReservations[index].hashCode;
            hidden = false;
        } else {
            hidden = !hidden;
        }
    };
</script>

<main>
    <Header acc={acType} />
    {#if !hidden}
        <div id="qrCode"><QrCode bind:value={qrCode} size="1000" /></div>
    {/if}
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
                                    Car
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Brand
                                </th>
                                <th
                                    scope="col"
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Model
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Year
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Price for days
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Rent Time
                                </th>
                                {#if acType != "user"}
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Username - Email
                                    </th>
                                {/if}
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status of application
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Sort option:
                                    <select
                                        bind:value={sortBy}
                                        on:change={sort}
                                    >
                                        <option value="" disabled />
                                        <option value="byBrand">By Brand</option
                                        >
                                        <option value="byModel">By Model</option
                                        >
                                        <option value="byYear">By Year</option>
                                        <option value="byStatus"
                                            >By Status</option
                                        >
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#if myReservations.length != 0}
                                {#each myReservations as { brand, model, year, price, startDay, endDay, status, username, email }, i}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div
                                                    class="flex-shrink-0 h-20 w-20"
                                                >
                                                    <img
                                                        class="h-20 w-50 rounded-full"
                                                        src="img/{brand}_{model}_{year}.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <TdCell name={brand} />
                                        <TdCell name={model} />
                                        <TdCell name={year} />

                                        <TdCell name={price + "zł"} />
                                        <TdCell
                                            name={startDay + " ---- " + endDay}
                                        />

                                        {#if acType != "user"}
                                            <th
                                                scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {username} - {email}
                                            </th>
                                        {/if}
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            <div class="text-sm text-gray-900">
                                                {status}
                                            </div>
                                        </td>
                                        {#if status != "canceled"}
                                            <td class="px-6 py-4 text-gray-500">
                                                {#if acType != "user"}
                                                    {#if status != "confirmed"}
                                                        <button
                                                            class="text-gray-900"
                                                            on:click={handleReservation(
                                                                brand,
                                                                model,
                                                                year,
                                                                startDay,
                                                                endDay,
                                                                "accept"
                                                            )}
                                                        >
                                                            Accept Reservation
                                                        </button>
                                                    {/if}

                                                    {#if status != "unconfirmed"}
                                                        <button
                                                            class="text-gray-900"
                                                            on:click={handleReservation(
                                                                brand,
                                                                model,
                                                                year,
                                                                startDay,
                                                                endDay,
                                                                "refuse"
                                                            )}
                                                        >
                                                            Refuse Reservation
                                                        </button>
                                                    {/if}
                                                {/if}
                                                {#if status == "confirmed"}
                                                    <button
                                                        on:click={showQRCode(
                                                            brand,
                                                            model,
                                                            year,
                                                            startDay,
                                                            endDay
                                                        )}>showQRCode</button
                                                    >
                                                {/if}
                                                {#if acType == "user"}
                                                    <button
                                                        class="text-gray-900"
                                                        on:click={handleReservation(
                                                            brand,
                                                            model,
                                                            year,
                                                            startDay,
                                                            endDay,
                                                            "cancel"
                                                        )}
                                                    >
                                                        Cancel Reservation
                                                    </button>
                                                {/if}
                                            </td>
                                        {/if}
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>

                        {#if archives.length != 0}
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div
                                                class="flex-shrink-0 h-20 w-20 hei"
                                            >
                                                <h1>Archives</h1>
                                            </div>
                                        </div>
                                    </td>
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Sort option:
                                        <select
                                            bind:value={sortByArchives}
                                            on:change={sortArchives}
                                        >
                                            <option value="" disabled />
                                            <option value="byBrand"
                                                >By Brand</option
                                            >
                                            <option value="byModel"
                                                >By Model</option
                                            >
                                            <option value="byYear"
                                                >By Year</option
                                            >
                                            <option value="byStatus"
                                                >By Status</option
                                            >
                                        </select>
                                    </th></tr
                                >
                                {#each archives as { brand, model, year, price, startDay, endDay, status, username, email }, i}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div
                                                    class="flex-shrink-0 h-20 w-20"
                                                >
                                                    <img
                                                        class="h-20 w-50 rounded-full"
                                                        src="img/{brand}_{model}_{year}.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <TdCell name={brand} />
                                        <TdCell name={model} />
                                        <TdCell name={year} />

                                        <TdCell name={price + "zł"} />
                                        <TdCell
                                            name={startDay + " ---- " + endDay}
                                        />
                                        <th
                                            scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {username} - {email}
                                        </th>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            <div class="text-sm text-gray-900">
                                                {status}
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        {/if}
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- {#if acType == "moderator"}
        <h1>Konto moderatora</h1>
    {:else if acType == "user"}
        <h1>Konto Usera</h1>
    {/if} -->
</main>

<style>
    .concon {
        margin-right: 0px;
    }
    .concon2 {
        padding-right: 0px;
    }
    .hei {
        height: 50%;
    }
    #qrCode {
        position: fixed;
        z-index: 1000;
        background-color: rgba(192, 192, 192, 0.8);
        width: 40vw;
        height: 60vh;
        margin-left: 30%;
        margin-top: 4rem;
    }
</style>
