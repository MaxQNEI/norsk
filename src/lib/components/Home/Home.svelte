<script>
    import { onMount } from "svelte";
    import Logotype from "#lib/components/Logotype.svelte";
    import { locale } from "#lib/i18n/i18n.js";
    import { isMobileDevice } from "#lib/is-mobile-device.js";
    import { welcomeDisplayed } from "#lib/stores/app.js";

    /**
     * @type {Array<{
     *      title: Record<string, string>,
     *      stimulus: Record<string, string>,
     *      description: Record<string, string>,
     *      href: string,
     *      available: string[],
     *      disabled?: boolean
     * }>} */
    const Links = [
        {
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
            href: "/image",
            available: ["desktop"],
            disabled: true,
        },

        {
            title: {
                en: "Say and Write!",
                no: "Si og Skriv!",
            },
            stimulus: {
                en: "Say the number out loud to your friend, and your friend types it",
                no: "Si tallet høyt til din venn, og venn din skriver det",
            },
            description: {
                en: "Two players. Player 1 sees a number and says it out loud. Player 2 types the number. Take turns! Who can do it?",
                no: "To spillere. Spiller 1 ser et tall og sier det høyt. Spiller 2 skriver tallene. Bytt tur! Hvem klarer det?",
            },
            href: "/numbers",
            available: ["desktop", "mobile"],
        },
    ];

    /** @type {boolean} */
    let ready = $state(false);

    /** @type {boolean} */
    let show = $derived($welcomeDisplayed);

    /** @type {string | null} */
    let prevLocale = null;

    onMount(() => setTimeout(() => (ready = true), 100));

    /**
     * @param {string} word
     */
    function ucFirst(word) {
        return `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`;
    }

    /**
     * @param {string} device
     */
    function isAvailable(device) {
        return (device === "desktop" && !isMobileDevice) || (device === "mobile" && isMobileDevice) || false;
    }

    function onswapdown() {
        if (!prevLocale) prevLocale = $locale;

        window.addEventListener("pointerup", onswapup);
        window.addEventListener("touchcancel", onswapup);
        window.addEventListener("touchend", onswapup);

        function onswapup() {
            window.removeEventListener("pointerup", onswapup);
            window.removeEventListener("touchcancel", onswapup);
            window.removeEventListener("touchend", onswapup);

            if (prevLocale) {
                $locale = prevLocale;
                prevLocale = null;
            }
        }

        $locale = "en";
    }

    /**
     * @param {MouseEvent} event
     */
    function onswapcontextmenu(event) {
        event.preventDefault();
    }
</script>

<button
    class="swap-locale"
    class:ready={ready && show}
    type="button"
    onpointerdown={onswapdown}
    ontouchstart={onswapdown}
    oncontextmenu={onswapcontextmenu}
>
    <Logotype />
</button>

<div class="home fx" class:ready={ready && show}>
    <div class="games">
        {#each Links as { title, stimulus, description, href, available, disabled }, index}
            <div class="game fx" class:disabled style="transition-delay: {(index + 1) * 200}ms;">
                <div class="header fx" style="transition-delay: {(index + 1) * 200 + 200}ms;">
                    <h2>
                        <a {href} style="pointer-events: {disabled ? 'none' : 'all'}">
                            {title[$locale]}
                        </a>
                    </h2>
                </div>

                <!-- <div class="stimulus" style="transition-delay: {(index + 1) * 200 + 400}ms;">
                    <p>
                        <i>
                            {stimulus[$locale] || stimulus["no"]}
                        </i>
                    </p>
                </div> -->

                <div class="description fx" style="transition-delay: {(index + 1) * 200 + 600}ms;">
                    {description[$locale] || description["no"]}
                </div>

                <div class="info fx" style="transition-delay: {(index + 1) * 200 + 800}ms;">
                    Available:
                    {#each available as device, index}
                        <span class="device" class:available={isAvailable(device)}>
                            {ucFirst(device)}
                        </span>
                        {available.length - 1 !== index ? " & " : ""}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .swap-locale {
        --swap-locale-padding: 32px;
        --swap-locale-size: 128px;

        position: fixed;
        z-index: 1024;
        right: var(--swap-locale-padding);
        bottom: var(--swap-locale-padding);

        width: var(--swap-locale-size);
        aspect-ratio: 1;
        padding: 0;
        border: unset;
        background: unset;

        white-space: wrap;

        opacity: 0;
        transition: all 500ms ease-in-out;
    }

    .swap-locale.ready {
        opacity: 1;
        transition-delay: 500ms;
    }

    .home {
        width: 100%;
        max-width: 1000px;

        user-select: none;
    }

    .games {
        display: grid;
        grid-gap: 20px;
        align-content: flex-start;

        padding: 20px;
        border-radius: 20px;
        background-color: var(--background-transparent-color);
    }

    .game {
        display: grid;
        grid-gap: 8px;

        border-radius: 10px;
        padding: 20px;
        background-color: var(--background-transparent-color);
    }

    .game.disabled {
        /* opacity: 0.2 !important; */
        filter: brightness(5) brightness(0.1);
    }

    a {
        font-variant: petite-caps;
        color: inherit;
    }

    .info {
        font-size: small;
    }

    .available {
        text-decoration: underline;
    }

    .fx {
        transition: all 500ms ease-out;
    }

    /* FX */
    .home:not(.ready),
    .home:not(.ready) .fx {
        opacity: 0;
        transform: translateY(-2dvh);
    }

    .home.ready,
    .home.ready .fx {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        .swap-locale {
            --swap-locale-padding: 8px;
            --swap-locale-size: 96px;
        }

        .home {
            padding: 20px;
        }
    }
</style>
