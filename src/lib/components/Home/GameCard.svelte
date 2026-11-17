<script>
    import { locale } from "#lib/i18n/i18n.js";
    import { goto } from "$app/navigation";

    const delay = 200;

    /** @type {import("#lib/types.js").Game & { hide?: boolean, index?: number, onFlip?: function }} */
    let { title, stimulus, description, image, href, available, players, disabled, hide, index, onFlip } = $props();

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
        onFlip && onFlip();
    }

    /**
     * @param {MouseEvent} event
     */
    function play(event) {
        event.preventDefault();
        href && goto(href);
    }
</script>

<div class="game" class:flipped class:hide>
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

        <div class="text">
            {#if stimulus}
                <h3 style="font-weight: normal;">{stimulus[$locale]}</h3>
            {/if}

            {#if description}
                <h4 style="font-weight: normal;">{description[$locale]}</h4>
            {/if}
        </div>

        <div class="info">
            {#if players}
                <div class="players">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                        <path
                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                        />
                    </svg>

                    <span>
                        {#if players.required}
                            Spillere: {players.required}
                        {:else if players.max}
                            Spillere: {players.min} &ndash; {players.max}
                        {/if}
                    </span>
                </div>
            {/if}

            <div class="available">
                {#if available.includes("mobile")}
                    <div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                            <path
                                d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
                            />
                        </svg>

                        <span>Mobil</span>
                    </div>
                {/if}

                {#if available.includes("desktop")}
                    <div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                            <path
                                d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5z"
                            />
                        </svg>

                        <span>Datamaskin</span>
                    </div>
                {/if}
            </div>
        </div>

        <div class="play">
            <button type="button" class="green zi2" onclick={play} style="width: 100%" disabled={!!disabled}>
                <span class="h1">
                    {#if disabled && disabled.reason}
                        {disabled.reason[$locale]}
                    {:else}
                        SPILL!
                    {/if}
                </span>
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

        display: grid;
        grid-template-rows: 1fr max-content;

        pointer-events: none;
    }

    .text {
        display: grid;
        align-content: flex-start;
        grid-gap: 8px;
    }

    .info {
        display: grid;
        align-content: flex-start;
        grid-gap: 8px;
    }

    .players {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 8px;
        align-items: center;
        padding: 8px;
        border-radius: 4px;
        background-color: #000000;
        filter: invert(1);
    }

    .available {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 8px;
    }

    .available > div {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 8px;
        align-items: center;
        padding: 8px;
        border-radius: 4px;
        background-color: #000000;
        filter: invert(1);
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

    .play button {
        text-transform: uppercase;
    }

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
