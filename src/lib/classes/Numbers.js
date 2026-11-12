/** @typedef {{ limit?: number, min: number, max: number }} Level */

export const Levels = [
    {
        min: 0,
        max: 10,
    },

    {
        min: 0,
        max: 20,
    },

    {
        limit: 20,
        min: 0,
        max: 100,
    },

    {
        limit: 20,
        min: 100,
        max: 9999,
    },

    {
        limit: 20,
        min: 1000,
        max: 9999,
    },

    {
        limit: 20,
        min: 10000000,
        max: 99999999,
    },
];

/** @typedef {number} Seed  */

export default class Numbers {
    /** @type {Seed} */
    #seed = Date.now();

    /** @type {function} */
    #rngRandom;

    /** @type {function} */
    #rngSort;

    /**
     * @param {Seed} seed
     */
    constructor(seed) {
        this.#seed = seed;
        this.#rngRandom = this.#createPNG();
        this.#rngSort = this.#createPNG();
    }

    /**
     * @param {Level} level
     * @returns {number}
     */
    next(level) {
        return this.#getRandomInt(this.#rngRandom, level.min, level.max);
    }

    #createPNG() {
        let s = this.#seed | 0;

        return function () {
            s += 0x6d2b79f5;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /**
     * @param {function} rng
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    #getRandomInt(rng, min, max) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }
}
