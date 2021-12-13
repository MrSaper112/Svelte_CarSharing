<script>
    import DatePicker from "praecox-datepicker";
    import { onMount, createEventDispatcher } from "svelte";
    import { fetchBase, address, syncHeight } from "../config.js";
    import { spring } from "svelte/motion";

    export let car;
    export let dateUnable;
    export let carsList;
    let selected = [];
    let pickerDone = false;
    let marked = [];
    let el;

    let acceptShow = false;
    let price = 0;

    const heightSpring = spring(0, { stiffness: 0.1, damping: 0.8 });
    $: heightStore = syncHeight(el);
    $: heightSpring.set(open ? $heightStore || 0 : 0);

    var getDaysArray = function (s, e) {
        for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            a.push(new Date(d));
        }
        return a;
    };

    //     var daylist = getDaysArray(new Date("2018-05-01"),new Date("2018-07-01"));
    // daylist.map((v)=>v.toISOString().slice(0,10))
    let showDatePicker = false;
    let disabled = [];

    onMount(() => {
        let day1 = new Date();
        day1.setTime(day1.getTime() - 48 * 30 * 60 * 60 * 1000);
        let threeDaysAgo =
            day1.getFullYear() +
            "-" +
            (day1.getMonth() + 1) +
            "-" +
            day1.getDate();
        var daylist = getDaysArray(new Date(threeDaysAgo), new Date());
        daylist = daylist.map((v) => v.toISOString().slice(0, 10));

        disabled = [...daylist];
        selected = [];
        if (dateUnable.length > 0) {
            dateUnable.forEach((item) => {
                let distance = getDaysArray(
                    new Date(item.startDay),
                    new Date(item.endDay)
                );
                distance = distance.map((v) => v.toISOString().slice(0, 10));
                distance.forEach((item2) => disabled.push(item2));
                distance.forEach((item2) => marked.push(item2));
            });
        }

        // console.log(disabled);
    });
    function findCommonElement(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                if (array1[i] === array2[j]) {
                    return true;
                }
            }
        }

        // Return if no common element exist
        return false;
    }
    function constructDay(day) {
        return (
            day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate()
        );
    }
    function hanldBtnClick() {
        showDatePicker = !showDatePicker;
    }
    function getResult() {
        acceptShow = false;
        price = 0;
        if (selected[0] !== selected[1]) {
            let day = constructDay(new Date(selected[0]));
            let day1 = constructDay(new Date(selected[1]));
            if (
                !(
                    selected[0] < new Date().getTime() ||
                    selected[1] < new Date().getTime()
                )
            ) {
                console.log(day, day1);
                let distance = getDaysArray(new Date(day), new Date(day1));
                distance = distance.map((v) => v.toISOString().slice(0, 10));
                let bool = findCommonElement(distance, disabled);
                if (bool) {
                    alert("The days you have chosen are already ready!");
                    selected[0] = selected[1];
                    console.log(selected);
                } else {
                    price = distance.length * car.price;
                    acceptShow = true;
                }
            } else {
                alert("Unable to select a date in the past");
                selected[0] = new Date().getTime();
                selected[1] = new Date().getTime();
            }
        } else if (selected[0] === selected[1]) {
            if (!(selected[0] < new Date().getTime())) {
                console.log(disabled);
                if (!disabled.includes(constructDay(new Date(selected[0])))) {
                    acceptShow = true;
                    price = car.price;
                }
            }
        }

        if (selected.length == 0) {
            return;
        }
        if (pickerDone) {
            showDatePicker = false;
        }
    }
    async function sendRequest() {
        let dataToPost = {
            car: car,
            dateRequest: {
                start: constructDay(new Date(selected[0])),
                end: constructDay(new Date(selected[1])),
            },
        };

        let request = await fetchBase("carListReservation.php", dataToPost);
        if (typeof request.query == "boolean" && request.query) {
            console.log(carsList);
            carsList = await request.allcars;
            console.log(carsList);
            window.location.href = `${window.location.origin}/${address}`;
        } else {
            console.warn(request.query);
        }
        selected[0] = new Date().getTime();
        selected[1] = new Date().getTime();
    }
</script>

<div class="box">
    <div class="inner">
        Price: {price}zł <br />
        {#if selected[0] !== selected[1] && selected.length > 0}
            <span
                >You have selected a date: {constructDay(new Date(selected[0]))}
                -- {constructDay(new Date(selected[1]))}</span
            >
        {:else if selected[0] == selected[1] && selected.length > 0}
            <span
                >You have selected a date: {constructDay(
                    new Date(selected[0])
                )}</span
            >
        {:else}
            <span>You have selected a date: </span>
        {/if}
        {#if selected.length > 0 && acceptShow && !showDatePicker}
            <button on:click={sendRequest}>Send Request For Car</button>
        {/if}
        <button on:click={hanldBtnClick}>Open Calendar</button>
        <div class="view">
            <div
                class="view"
                style="overflow: hidden; height: {$heightSpring}px"
                on:click={getResult}
            >
                {#if showDatePicker}
                    <div bind:this={el}>
                        <DatePicker
                            theme="dark"
                            pickerRule="range"
                            viewDate={selected[0]}
                            reSelected={true}
                            bind:selected
                            {disabled}
                            {marked}
                            bind:pickerDone
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    button {
        border: 0;
        background-color: transparent;
        outline: none;
    }
    button {
        height: 5vh;
        margin-right: 10px;
        display: flex;
        align-items: center;
        outline: none;
        cursor: pointer;
        position: relative;
        border: 0;
        padding: 8px 36px;
        line-height: 26px;
        font-family: inherit;
        font-weight: 600;
        font-size: 14px;
        background: #1d3abd;
        color: rgba(255, 225, 255, 0.9);
        margin-bottom: 10px;
    }
    button:hover {
        background: #304ed4;
    }
    button:active {
        background: #19319e;
    }
    .view {
        max-height: 300px;
        transition: max-height 0.25s ease-in;
    }
</style>
