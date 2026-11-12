<script>
    import Numbers, { Levels } from "#lib/classes/Numbers.js";
    import Numpad from "./Numpad.svelte";
    import Player from "./Player.svelte";
    import Roomcode from "./Roomcode.svelte";

    /** @type {number | null} */
    let seed = $state(null);

    /** @type {number | null} */
    let player = $state(null);

    /** @type {number} */
    let levelIndex = $state(0);

    /** @type {import("#lib/classes/Numbers.js").Level} */
    let level = $derived(Levels[levelIndex]);

    /** @type {number} total numbers */
    let total = $derived(
        (() => {
            const { limit, min, max } = level;
            if (limit) return limit;
            return max - min;
        })(),
    );

    /** @type {number} complete total numbers */
    let completeTotal = $state(0);

    /** @type {number} complete numbers */
    let complete = $state(0);

    /** @type {string | number} */
    let pronounce = $state("");

    /** @type {string | number} */
    let guess = $state("");

    /** @type {string} */
    let number = $state("");

    /** @type {boolean} */
    let bad = $state(false);

    /** @type {Numbers | null} */
    let Controller = $state(null);

    $effect(() => {
        if (!seed || !player || Controller) return;

        Controller = new Numbers(seed);

        levelIndex = 0;
        complete = 0;

        if (player === 1) {
            pronounce = Controller.next(level);
            guess = Controller.next(level);
        } else if (player === 2) {
            guess = Controller.next(level);
        }

        // console.warn("$effect()", "player", player, "pronounce", pronounce, "guess", guess, "seed", seed);
    });

    $effect(() => {
        if (number.length > 11) {
            number = number.slice(0, 11);
        }
    });

    function onOkClick() {
        if (Controller && number.length > 0) {
            if (number === guess.toString()) {
                if (complete + 1 === total) {
                    if (player === 1) {
                        pronounce = "";
                        guess = "";
                    } else if (player === 2) {
                        pronounce = Controller.next(level);
                        guess = "";
                    }
                } else {
                    pronounce = Controller.next(level);
                    guess = Controller.next(level);
                }

                complete++;
                completeTotal++;

                // console.warn("onOkClick()", "player", player, "pronounce", pronounce, "guess", guess);
            } else {
                bad = true;
                setTimeout(() => (bad = false), 500);
            }

            number = "";
        }
    }

    function onNewRound() {
        seed = parseInt((seed || 0).toString()) + 4096;
        Controller = null;
        levelIndex = 0;
        complete = 0;
        pronounce = "";
        guess = "";
    }

    function onContinueClick() {
        if (!Controller) return;

        if (!Levels[levelIndex + 1]) {
            alert("DONE!");
            return;
        }

        complete = 0;
        levelIndex++;
        level = Levels[levelIndex];
        pronounce = guess = "";

        if (player === 1) {
            pronounce = Controller.next(level);
            guess = Controller.next(level);
        } else if (player === 2) {
            guess = Controller.next(level);
        }

        // console.warn("onContinueClick()", "player", player, "pronounce", pronounce, "guess", guess);
    }
</script>

<div class="numbers" class:bad>
    <div class="title">
        <h4>
            {#if !player}
                <a href="/">&larr; {"TIL STARTSIDEN"}</a>
            {:else}
                <a href="/numbers" onclick={() => (player = null)}>&larr; {"TIL START"}</a>
            {/if}
        </h4>

        <h1>Si og Skriv!</h1>
    </div>

    <div class="content">
        {#if !player}
            <Player bind:player />
        {:else if !seed}
            <Roomcode bind:seed {player} />
        {:else}
            <div class="game">
                <div>
                    <p>
                        Tall: {complete} av {total}<br />
                        Nivå: <span class="level-current">{levelIndex + 1}</span> av
                        <span class="level-total">{Levels.length}</span>
                    </p>

                    <h1 class="number">
                        {#if player === 1 && complete === total}
                            <div>Ferdig...</div>
                        {:else if (player === 1 && complete < total) || player === 2}
                            <div>{pronounce !== "" ? `Uttale: ${pronounce}` : "Hør..."}</div>
                        {/if}

                        {#if complete === total}
                            <div>Totalt: {completeTotal} tall</div>
                        {/if}
                    </h1>
                </div>

                <div class="line"></div>

                <div>
                    {#if complete < total}
                        <input type="text" bind:value={number} disabled />
                    {/if}
                </div>

                <div style="align-content: center;">
                    {#if complete < total}
                        <Numpad bind:code={number} allow={number.length > 0} {onOkClick} />
                    {:else if !Levels[levelIndex + 1]}
                        <button class="green" type="button" onclick={onNewRound}>
                            <h2>NY RUNDE</h2>
                        </button>
                    {:else}
                        <button class="green" type="button" onclick={onContinueClick}>
                            <h2>FORTSETT</h2>
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .numbers {
        display: grid;
        grid-gap: 16px;

        width: 320px;
        text-align: center;
    }

    .content {
        padding: 20px;
        border-radius: 20px;
        background-color: var(--background-transparent-color);

        display: grid;
        grid-gap: 16px;

        aspect-ratio: 320 / 590;
    }

    .game {
        display: grid;
        grid-gap: 8px;
        grid-template-rows: repeat(3, max-content) 1fr;
    }

    .game input {
        text-align: center;
        letter-spacing: 8px;
        font-size: xx-large;
    }

    .level-current {
        color: var(--color-green);
    }

    .level-total {
        color: var(--color-pink);
    }

    .numbers.bad {
        animation: Error 500ms ease-out 1 forwards;
    }

    @media (max-width: 1000px) {
        .numbers {
            width: calc(100dvw - 40px);
        }
    }

    /* prettier-ignore */
    @keyframes Error {
        0% { transform: translateX(1dvw); filter: drop-shadow(0 0 0px var(--color-red)); }
        10% { transform: translateX(-1dvw); filter: drop-shadow(0 0 2px var(--color-red)); }
        20% { transform: translateX(1dvw); filter: drop-shadow(0 0 0px var(--color-red)); }
        30% { transform: translateX(-1dvw); filter: drop-shadow(0 0 2px var(--color-red)); }
        40% { transform: translateX(1dvw); filter: drop-shadow(0 0 0px var(--color-red)); }
        50% { transform: translateX(-1dvw); filter: drop-shadow(0 0 2px var(--color-red)); }
        60% { transform: translateX(1dvw); filter: drop-shadow(0 0 0px var(--color-red)); }
        70% { transform: translateX(-1dvw); filter: drop-shadow(0 0 2px var(--color-red)); }
        80% { transform: translateX(1dvw); filter: drop-shadow(0 0 0px var(--color-red)); }
        90% { transform: translateX(-1dvw); filter: drop-shadow(0 0 2px var(--color-red)); }
        100% { transform: translateX(0); filter: drop-shadow(0 0 0px var(--color-red)); }
    }
</style>
