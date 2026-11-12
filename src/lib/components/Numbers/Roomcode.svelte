<script>
    import { rand } from "#lib/rand.js";
    import Numpad from "./Numpad.svelte";

    /** @type {{ seed: number | null, player: number }} */
    let { seed = $bindable(null), player } = $props();

    /** @type {string} */
    // svelte-ignore state_referenced_locally
    let roomcode = $state(player === 1 ? generate().toString() || "" : "");

    /** @type {boolean} */
    let allow = $derived(
        roomcode.split("").filter((s, i, a) => a.indexOf(s) === i).length === 4 && roomcode[0] !== "0",
    );

    $effect(() => {
        if (roomcode.length > 4) {
            roomcode = roomcode.slice(1);
        }
    });

    function generate() {
        /** @type {number[]} */
        let ns = [];

        for (let i = 0; i < 4; i++) {
            let n;
            do n = rand(i === 0 ? 1 : 0, 9);
            while (ns.includes(n));
            ns.push(n);
        }

        return parseInt(ns.join(""));
    }

    function newseed() {
        roomcode = generate().toString();
    }
</script>

<div class="roomcode" class:player-1={player === 1} class:player-2={player === 2}>
    <h1>ROMKODE</h1>

    {#if player === 1}
        <!-- <input type="text" bind:value={roomcode} disabled /> -->
        <div class="input-text">{@html roomcode || "&nbsp;"}</div>

        <div class="buttons" class:allow>
            <button class="blue" type="button" onclick={newseed}>&olarr;</button>
            <button class="green" type="button" onclick={() => (seed = parseInt(roomcode))} disabled={!allow}>
                &check;
            </button>
        </div>
    {:else if player === 2}
        <input type="text" bind:value={roomcode} disabled />
        <Numpad bind:origin={seed} bind:code={roomcode} {allow} />
    {/if}
</div>

<style>
    .roomcode {
        display: grid;
        grid-gap: 8px;
    }

    .roomcode.player-1 {
        align-content: center;
        align-items: center;
    }

    .roomcode.player-2 {
        grid-template-rows: max-content max-content 1fr;
    }

    input,
    button {
        font-size: xx-large;
    }

    input {
        text-align: center;
        letter-spacing: 16px;
    }

    button {
        background: none;
    }

    .buttons {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 4px;

        transition: all 200ms ease-in-out;
    }
    .buttons.allow {
        grid-template-columns: 1fr 2fr;
    }
</style>
