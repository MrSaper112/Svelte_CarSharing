<script>
    import { Router, Route, Link, navigate } from "svelte-routing";

    import Header from "./structure/Header.svelte";
    import { accountType, fetchBase, address } from "./config.js";
    import RentTable from "./structure/RentTable.svelte";
    import { onMount } from "svelte";

    let carList = {
        all: [],
    };

    onMount(async () => {
        let request = await fetchBase("carListReservation.php", {
            allCarList: true,
        });
        carList.all = await request.allcars;
        console.log(carList);
    });

    let acType;
    accountType.subscribe((val) => (acType = val));
</script>

<main>
    <Header acc={acType} />
    <RentTable {...carList} />
</main>
