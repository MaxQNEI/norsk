<script>
    import { locale } from "#lib/i18n/i18n.js";
    import { goto } from "$app/navigation";

    const delay = 200;

    /** @type {import("#lib/types.js").Game & { hide?: boolean, index?: number }} */
    let { title, stimulus, description, image, href, available, players, disabled, hide, index } = $props();

    /** @type {number} */
    let number = $derived((index ?? 0) + 1);

    /** @type {boolean} */
    let flipped = $state(false);

    let fxIndex = 0;
    function fxDelay() {
        const d = number * delay + fxIndex * delay;
        fxIndex++;
        return d;
    }

    function flip() {
        flipped = !flipped;
    }

    /**
     * @param {MouseEvent} event
     */
    function play(event) {
        event.preventDefault();
        href && goto(href);
    }
</script>

<div class="game" class:flipped class:disabled class:hide>
    <div class="front">
        <button class="flip" onclick={flip} title="Flip"></button>

        {#if title}
            <div class="header fx" style="transition-delay: {fxDelay()}ms;">
                <h2>
                    {title[$locale]}
                </h2>
            </div>
        {/if}

        {#if image}
            <div
                class="game-image fx"
                style="
                    background-image: url('/images/{image}');
                    transition-delay: {fxDelay()}ms;
                "
            ></div>
        {/if}

        <div class="game-details">
            {#if description}
                <div class="game-description fx" style="transition-delay: {fxDelay()}ms;">
                    {(description && (description[$locale] || description["no"])) || null}
                </div>
            {/if}
        </div>
    </div>

    <div class="back">
        <button class="flip" onclick={flip} title="Flip"></button>

        {#if stimulus}
            <h4>{stimulus[$locale]}</h4>
        {/if}

        <!-- {#if players}
            <div class="game-info">
                {#if players.required}
                    Players: {players.required}
                {:else if players.max}
                    Players: {players.min} &ndash; {players.max}
                {/if}
            </div>
        {/if} -->

        <div>
            <button type="button" class="green zi2" onclick={play} style="width: 100%">
                <h1 class="h3">SPILL!</h1>
            </button>
        </div>
    </div>
</div>

<style>
    .zi2 {
        position: relative;
        z-index: 2;
    }

    .game {
        position: relative;

        padding: 0;
        border-radius: 10px;
        background-color: var(--background-transparent-color);

        max-width: 360px;
        text-align: left;
    }

    button.flip {
        position: absolute;
        inset: 0;
        z-index: 1;
        opacity: 0;
    }

    .front,
    .back {
        display: grid;
        grid-gap: 10px;
        align-content: flex-start;
        padding: 20px;

        transition:
            transform 250ms linear,
            opacity 0ms linear 125ms;
    }

    /* .front {} */

    .back {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: rotateY(-180deg);

        pointer-events: none;
    }

    .game.flipped .front {
        opacity: 0;
        transform: rotateY(180deg);
        pointer-events: none;
    }

    .game.flipped .back {
        opacity: 1;
        transform: rotateY(0deg);
        pointer-events: all;
    }

    .game.disabled {
        filter: brightness(5) brightness(0.1);
    }

    .header {
        text-align: center;
    }

    .game-image {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 5px;
        background: center / contain no-repeat;
    }

    .game-details {
        display: grid;
        grid-gap: 10px;
        align-content: flex-start;
        padding: 8px;
    }

    /* .game-info { font-size: small; } */

    .fx {
        transition: all 500ms ease-out;
    }

    @media (max-width: 840px) {
        .game {
            grid-template-columns: none;
        }

        .game.hide {
            display: none;
        }

        .game-image {
            width: 100%;
        }
    }
</style>
