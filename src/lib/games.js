/** @type {Array<import("#lib/types.js").Game>} */
export const Games = [
    /* {
        key: "image",

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
        key: "numbers",

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

/**
 * @param {string} key
 * @returns {import("#lib/types.js").Game}
 */
export const GameInfoByKey = (key) => Games.filter((game) => game.key === key)[0];
