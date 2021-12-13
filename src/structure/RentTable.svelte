<script>
    import Calendar from "./Calendar.svelte";
    import { onMount, createEventDispatcher } from "svelte";
    import { sortCars } from "../config";
    import TdCell from "./table/TdCell.svelte";
    import App from "../App.svelte";
    export let all = [];

    let sortBy = "";
    let change = () => {
        let sorted = sortCars(all, sortBy);
        console.log(sorted);
        all = [...sorted];
    };
</script>

<main>
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
                                    Price for one day
                                </th>
                                <th
                                    scope="col"
                                    class=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider insideJoke"
                                >
                                    Calendary
                                    <div>
                                        Sort option:
                                        <select
                                            bind:value={sortBy}
                                            on:change={change}
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
                                            <option value="byPrice"
                                                >By Price</option
                                            >
                                        </select>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#if all.length != 0}
                                {#each all as item, i (item)}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div
                                                    class="flex-shrink-0 h-20 w-20"
                                                >
                                                    <img
                                                        class="h-20 w-50 rounded-full"
                                                        src="img/{item.brand}_{item.model}_{item.year}.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <TdCell name={item.brand} />
                                        <TdCell name={item.model} />
                                        <TdCell name={item.year} />

                                        <TdCell name={item.price + "zł"} />
                                        <td class="calendar">
                                            <Calendar
                                                carsList={item.all}
                                                car={{
                                                    brand: item.brand,
                                                    model: item.model,
                                                    year: item.year,
                                                    price: item.price,
                                                }}
                                                dateUnable={[...all[i].busy]}
                                            />
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
    .concon {
        margin-right: 0px;
    }
    .concon2 {
        padding-right: 0px;
    }
    .calendar {
        display: flex;
        padding-bottom: 10px;
        width: 30vw;
    }
    .insideJoke {
        display: flex;
        /* flex-direction: row; */
        /* flex-wrap: nowrap; */
        justify-content: space-around;
    }
</style>
