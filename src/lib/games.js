import { LinkNumbers } from "./links.js";

/** @type {Array<import("#lib/types.js").Game>} */
export const Games = [
    {
        key: "numbers",

        title: {
            en: "Which number?",
            no: "Hvilket tall?",
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
        href: LinkNumbers(),
        available: ["desktop", "mobile"],
        players: { required: 2 },
        disabled: false,
    },

    {
        key: "image",

        title: {
            en: "I see...",
            no: "Jeg ser...",
        },
        stimulus: {
            en: "Spot it, type it, beat the clock!",
            no: "Finn det, skriv det, slå klokken!",
        },
        description: {
            en: "Identify what's on the screen and type the Norwegian word before time runs out. Speed triggers bonus points!",
            no: "Finn ut hva som er på skjermen og skriv det norske ordet før tiden renner ut. Raskere svar gir bonuspoeng!",
        },
        image: "game-image-320.png",
        href: "/image",
        available: ["desktop"],
        disabled: {
            reason: {
                en: "Coming soon",
                no: "Kommer snart",
            },
        },
        players: { required: 1 },
    },
];

/**
 * @param {string} key
 * @returns {import("#lib/types.js").Game}
 */
export const GameInfoByKey = (key) => Games.filter((game) => game.key === key)[0];
