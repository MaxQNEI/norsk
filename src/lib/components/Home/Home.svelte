<script>
    import { Games } from "#lib/games.js";
    import { welcomeDisplayed } from "#lib/stores/app.js";
    import { onMount } from "svelte";
    import AnimatedTitle from "./AnimatedTitle.svelte";
    import GameCard from "./GameCard.svelte";

    const DesktopCardsPerRow = 3;

    /** @type {boolean} */
    let ready = $state(false);

    /** @type {boolean} */
    let show = $derived($welcomeDisplayed);

    onMount(() => setTimeout(() => (ready = true), 100));

    /**
     * @param {any[]} array
     * @param {number} count
     */
    function ceil(array, count) {
        if (array.length < count) return array;

        if (array.length % count === 0) return array;
        const newArray = [...array];
        const upto = Math.ceil(array.length / count) * count;
        while (newArray.length < upto) newArray.push({ disabled: true, hide: true });
        return newArray;
    }
</script>

<div class="home fx" class:show={ready && show}>
    <h1 class="logotype" class:show={ready && show}>
        <img class="logotype-image" src="/images/logotype-256.png" alt="Logotype" />

        <span class="logotype-text">
            <AnimatedTitle text="NORSK" show={ready && show} duration={150} delay={250} />
        </span>
    </h1>

    <div class="games" style="--gtc: repeat({Math.min(Games.length, DesktopCardsPerRow)}, 1fr)">
        {#each ceil(Games, 3) as game, index}
            <GameCard {...game} {index} />
        {/each}
    </div>
</div>

<style>
    .home {
        display: grid;
        grid-gap: 20px;
        justify-content: center;
        padding: 20px;
    }

    .logotype {
        display: grid;
        grid-auto-flow: column;
        justify-items: center;
        justify-content: center;
        align-items: center;
        grid-gap: 10px;
    }

    .logotype-image {
        height: 80px;

        transition: all 250ms ease-in-out;
    }

    .logotype:hover .logotype-image {
        transform: scale(1.1);
    }

    .games {
        display: grid;
        grid-gap: 20px;
        /* grid-template-columns: repeat(3, 1fr); */
        grid-template-columns: var(--gtc);
        align-content: flex-start;

        padding: 20px;
        border-radius: 20px;
        background-color: var(--background-transparent-color);
    }

    .home.fx,
    .home :global(.fx) {
        transition: all 500ms ease-out;
    }

    /* FX */
    .home:not(.show),
    .home:not(.show) :global(.fx) {
        opacity: 0;
        transform: translateY(-1dvh);
    }

    .home.show,
    .home.show :global(.fx) {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 840px) {
        .home {
            width: calc(100dvw);
            padding: 20px;
        }

        .games {
            grid-template-columns: 1fr;
            /* width: max-content; */
        }
    }
</style>
