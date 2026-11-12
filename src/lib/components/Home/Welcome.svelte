<script>
    import { onDestroy, onMount } from "svelte";
    import { welcomeDisplayed } from "#lib/stores/app.js";
    import { rand } from "#lib/rand.js";
    import Logotype from "#lib/components/Logotype.svelte";

    const Letters = "NORSK".split("");

    /** @type {boolean} */
    let show = $state(false);

    /** @type {boolean} */
    let hide = $state(false);

    onMount(() => {
        if ($welcomeDisplayed) return;

        window.addEventListener("pointerup", onWindowPointerUp);
        window.addEventListener("touchcancel", onWindowPointerUp);
        window.addEventListener("touchend", onWindowPointerUp);

        setTimeout(() => {
            show = true;

            setTimeout(() => {
                hide = true;
                $welcomeDisplayed = true;
            }, 4000);
        }, 100);
    });

    onDestroy(() => {
        window.removeEventListener("pointerup", onWindowPointerUp);
        window.removeEventListener("touchcancel", onWindowPointerUp);
        window.removeEventListener("touchend", onWindowPointerUp);
    });

    function onWindowPointerUp() {
        window.removeEventListener("pointerup", onWindowPointerUp);
        window.removeEventListener("touchcancel", onWindowPointerUp);
        window.removeEventListener("touchend", onWindowPointerUp);

        hide = true;
        $welcomeDisplayed = true;
    }

    function randTransfrom() {
        return rand(-40, 40);
    }
</script>

<div class="welcome" class:show class:hide>
    <div class="logotype">
        <div class="ripple"></div>
        <div class="image">
            <Logotype />
        </div>
    </div>

    <h1>
        {#each Letters as letter, index}
            <span
                style="
                    transition-delay: {index * 150 + 1000}ms;
                    --ttx: {randTransfrom()}px;
                    --tty: {randTransfrom()}px;
                "
            >
                {letter}
            </span>
        {/each}
    </h1>
</div>

<style>
    .welcome {
        position: fixed;
        z-index: 4096;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100dvw;
        height: 100dvh;

        display: grid;
        justify-items: center;
        align-content: center;
        grid-gap: 12px;

        transition: all 500ms ease-in-out;
    }

    .logotype {
        position: relative;
        z-index: 64;
        width: 128px;
    }

    .ripple {
        --scale-end: max(100dvw, 100dvh);

        position: absolute;
        z-index: 32;
        width: 100%;
        height: 100%;
        border: 0 solid #fefefe;
        border-radius: var(--scale-end);
        filter: drop-shadow(0 0 16px #fefefe) opacity(0.5);

        transform: scale(0);

        transition:
            all 5000ms ease-out,
            opacity 2000ms ease-out 1000ms;
    }

    .image {
        opacity: 0;
        transform: scale(1.5);
        transition:
            all 500ms ease-out 100ms,
            transform 1000ms ease-out 250ms,
            filter 1000ms ease-out 1000ms;
    }

    .welcome.show .ripple {
        border: 64px solid #fefefe;
        transform: scale(32);
        opacity: 0;
    }

    .welcome.show .image {
        opacity: 1;
        transform: scale(1);
        filter: drop-shadow(0 0 16 #fefefe);
    }

    h1 > span {
        display: inline-block;
        opacity: 0;
        transform: translateX(var(--ttx)) translateY(var(--tty));
        transition:
            all 500ms ease-out,
            transform 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 500ms;
    }

    .welcome.show h1 > span {
        opacity: 1;
        transform: translateX(0) translateY(0);
    }

    .welcome.show.hide {
        opacity: 0;
        pointer-events: none;
    }
</style>
