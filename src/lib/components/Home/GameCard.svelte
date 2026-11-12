<script>
    import { locale } from "#lib/i18n/i18n.js";
    import { goto } from "$app/navigation";

    const delay = 200;

    /** @type {import("#lib/types.js").Game & { hide?: boolean, index?: number }} */
    let { title, stimulus, description, image, href, available, players, disabled, hide, index } = $props();

    /** @type {number} */
    let number = $derived((index ?? 0) + 1);

    let fxIndex = 0;
    function fxDelay() {
        const d = number * delay + fxIndex * delay;
        fxIndex++;
        return d;
    }

    function onclick() {
        href && goto(href);
    }
</script>

<button class="game" class:disabled class:hide {disabled} {onclick}>
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

        <!-- {#if players}
            <div class="game-info">
                {#if players.required}
                    Players: {players.required}
                {:else if players.max}
                    Players: {players.min} &ndash; {players.max}
                {/if}
            </div>
        {/if} -->
    </div>
</button>

<style>
    .game {
        display: grid;
        grid-gap: 10px;

        border-radius: 10px;
        padding: 20px;
        background-color: var(--background-transparent-color);

        max-width: 240px;
        text-align: left;
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

    /* .game-info {
        font-size: small;
    } */

    .fx {
        transition: all 500ms ease-out;
    }

    @media (max-width: 840px) {
        .game {
            grid-template-columns: none;
            max-width: 320px;
        }

        .game.hide {
            display: none;
        }

        .game-image {
            width: 100%;
        }
    }
</style>
