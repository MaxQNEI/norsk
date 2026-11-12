<script>
    import "#lib/app.css";
    import Welcome from "#lib/components/Home/Welcome.svelte";
    import { welcomeDisplayed } from "#lib/stores/app.js";
    import { onDestroy, onMount } from "svelte";

    let { children } = $props();

    /** @type {boolean} */
    let ready = $state(false);

    onMount(async () => {
        try {
            await document.fonts.ready;
            ready = true;
        } catch (e) {
            ready = true;
        }

        window.addEventListener("dragstart", onWindowDragStart);
        window.addEventListener("selectstart", onWindowSelectStart);
    });

    onDestroy(() => {
        window.removeEventListener("dragstart", onWindowDragStart);
        window.removeEventListener("selectstart", onWindowSelectStart);
    });

    /**
     * @param {DragEvent} event
     */
    function onWindowDragStart(event) {
        // @ts-ignore
        const is = event.target.getAttribute("draggable");
        if (is === null || is === "false") event.preventDefault();
    }

    /**
     * @param {Event } event
     */
    function onWindowSelectStart(event) {
        try {
            // @ts-ignore
            const target = event.target.nodeType === 3 ? event.target.parentElement : event.target;
            // @ts-ignore
            const is = target.getAttribute("selectable");
            if (is === null || is === "false") event.preventDefault();
        } catch (e) {
            console.log(event.target);
            throw e;
        }
    }
</script>

<svelte:head>
    <!-- Title -->
    <title>Norsk</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Underdog&display=swap" rel="stylesheet" />
    <!-- Favicons -->
    <!-- <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{#if ready}
    <Welcome />

    <!-- <button type="button" class="share-qr">
        <img src="/share-qr.svg" alt="QRShare" width="64" />
    </button> -->

    <div class="root" class:show={$welcomeDisplayed}>
        <div class="content">
            {#if $welcomeDisplayed}
                {@render children()}
            {/if}
        </div>

        <div class="footer">
            <span>&copy; {new Date().getFullYear()} Maksym Radul.</span>
            <br />
            <span>All rights reserved.</span>
        </div>
    </div>
{/if}

<style>
    .root {
        display: grid;
        justify-items: center;
        align-content: center;

        min-height: 100dvh;
    }

    .footer {
        padding: 20px;
        max-width: calc(100dvw - 40px);
        text-align: center;
        font-size: small;

        pointer-events: none;
    }

    .footer > span {
        white-space: nowrap;
    }

    .content,
    .footer {
        transition: all 500ms ease-in-out;
    }

    .root:not(.show) .content,
    .root:not(.show) .footer {
        opacity: 0;
        pointer-events: none;
    }

    .root:not(.show) .content {
        transform: translateY(-1dvh);
    }

    .root:not(.show) .footer {
        transform: translateY(2dvh);
    }
</style>
