<script>
    import { onDestroy, onMount } from "svelte";

    /** @type {{
     *      origin?: number | string | null,
     *      code: number | string | null,
     *      allow: boolean,
     *      onOkClick?: function
     * }}
     */
    let { origin = $bindable(null), code = $bindable(null), allow, onOkClick } = $props();

    /**
     * @param {number} num
     */
    function number(num) {
        code = `${code}${num}`;
    }
</script>

<div class="numpad">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
        <button class="number" type="button" onclick={() => number(n)}>{n}</button>
    {/each}

    <button
        class="number"
        type="button"
        onclick={() => number(0)}
        style="
            grid-column-start: 1;
            grid-column-end: 4;
            aspect-ratio: unset;
        "
    >
        0
    </button>

    <button
        class="red"
        type="button"
        onclick={() => (code = "")}
        style="grid-column-start: 1; grid-column-end: 3; aspect-ratio: unset;"
        disabled={code?.toString()?.length === 0}
    >
        &olarr;
    </button>

    <button
        class="green"
        type="button"
        onclick={() => onOkClick?.() || (origin = code || "")}
        style="grid-column-start: 3; grid-column-end: 4; aspect-ratio: unset;"
        disabled={!allow}
    >
        &check;
    </button>
</div>

<style>
    button {
        font-size: xx-large;
    }

    .numpad {
        display: grid;
        grid-gap: 4px;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(5, 1fr);
        justify-content: stretch;
        width: 100%;
        height: 100%;
    }

    .numpad button.number {
        background-color: var(--background-transparent-color);
    }
</style>
