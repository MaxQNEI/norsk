<script>
    import { locale } from "#lib/i18n/i18n.js";
    import { isMobileDevice } from "#lib/is-mobile-device.js";
    import { welcomeDisplayed } from "#lib/stores/app.js";
    import { onMount } from "svelte";
    import GameCard from "./GameCard.svelte";
    import AnimatedTitle from "./AnimatedTitle.svelte";

    const DesktopCardsPerRow = 3;

    /** @type {Array<import("#lib/types.js").Game>} */
    const Games = [
        /* {
            title: {
                en: "Look and Write!",
                no: "Se og Skriv!",
            },
            stimulus: {
                en: "Look at the picture and write the word in Norwegian",
                no: "Se på bildet og skriv ordet på norsk",
            },
            description: {
                en: "Look at the picture. Write the words in Norwegian as fast as you can. You get more points when you are fast.",
                no: "Se på bildet. Skriv ordene på norsk så fort du kan. Du får flere poeng når du er rask.",
            },
            image: "",
            href: "/image",
            available: ["desktop"],
            disabled: true,
            players: { required: 1 },
        }, */

        {
            title: {
                en: "41!",
                no: "41!",
            },
            stimulus: {
                en: "Say the number to your friend, take turns, and reach the end together!",
                no: "Si tallet til din venn, ta tur, og nå slutten sammen!",
            },
            description: {
                en: "Two players. Work together as a team! Pass the numbers to each other one by one until you reach the end.",
                no: "To spillere. Jobb sammen som et lag! Gi tallene til hverandre ett etter ett til dere når slutten.",
            },
            image: "game-numbers-320.png",
            href: "/numbers",
            available: ["desktop", "mobile"],
            players: { required: 2 },
            disabled: false,
        },
    ];

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
