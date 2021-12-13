import { spring } from "svelte/motion";

const OPEN_SPRING = { stiffness: 0.1, damping: 0.3 };
const CLOSE_SPRING = { stiffness: 0.1, damping: 0.5 };

function getHeightSpring() {
    const heightSpring = spring(0);
    let shown = false;

    const getConfig = (open, val) => {
        let active = typeof val === "number";
        let immediate = open && !shown && active;
        //once we've had a proper height registered, we can animate in the future
        shown = shown || active;
        return immediate ? { hard: true } : {};
    };

    const sync = (open, height) => {
        heightSpring.set(open ? height || 0 : 0, getConfig(open, height));
        Object.assign(heightSpring, open ? OPEN_SPRING : CLOSE_SPRING);
    };

    return { sync, heightSpring };
}

export default function slideAnimate(el, open) {
    el.parentNode.style.overflow = "hidden";

    const { heightSpring, sync } = getHeightSpring();
    const doUpdate = () => sync(open, el.offsetHeight);
    const ro = new ResizeObserver(doUpdate);

    const springCleanup = heightSpring.subscribe((height) => {
        el.parentNode.style.height = `${height}px`;
    });

    ro.observe(el);

    return {
        update(isOpen) {
            open = isOpen;
            doUpdate();
        },
        destroy() {
            ro.disconnect();
            springCleanup();
        }
    };
}
