import { writable } from 'svelte/store';

export const address = 'svelte2/public/'
export var accountType = writable('')

export const fetchBase = async (url, params) => {
    let dat
    await fetch("http://localhost/svelte2/public/backend/" + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
        .then((data) => data.json())
        .then((data) => {
            dat = data
            // console.log(data);
        });
    return dat
}
export const sortCars = (array, sortBy) => {
    console.log(sortBy);
    let sorted;
    if (sortBy == "byBrand") {
        sorted = array.sort((a, b) => {
            if (a.brand < b.brand) {
                return -1;
            }
            if (a.brand > b.brand) {
                return 1;
            }
            return 0;
        });
    } else if (sortBy == "byModel") {
        sorted = array.sort((a, b) => {
            if (a.model < b.model) {
                return -1;
            }
            if (a.model > b.model) {
                return 1;
            }
            return 0;
        });
    } else if (sortBy == "byYear") {
        sorted = array.sort((a, b) => {
            if (a.year < b.year) {
                return -1;
            }
            if (a.year > b.year) {
                return 1;
            }
            return 0;
        });
    } else if (sortBy == "byStatus") {
        sorted = array.sort((a, b) => {
            if (a.status < b.status) {
                return -1;
            }
            if (a.status > b.status) {
                return 1;
            }
            return 0;
        });
    }
    else if (sortBy == "byPrice") {
        sorted = array.sort((a, b) => {
            if (a.price < b.price) {
                return -1;
            }
            if (a.price > b.price) {
                return 1;
            }
            return 0;
        });
    }
    return sorted
};
export function syncHeight(el) {
    return writable(null, (set) => {
        if (!el) {
            return;
        }
        let ro = new ResizeObserver(() => el && set(el.offsetHeight));
        ro.observe(el);
        return () => ro.disconnect();
    });
}