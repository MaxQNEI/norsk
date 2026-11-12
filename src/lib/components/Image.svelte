<script>
    import { onDestroy, onMount } from "svelte";
    import { locale, t } from "../i18n/i18n.js";
    import { Images } from "../Images.js";
    import WordT from "./WordT.svelte";
    import Word from "./Word.svelte";

    const TimePerImage = 5 * 60 * 1000;
    const TimePerWord = 30 * 1000;
    const PointsPerWord = 15;

    /** @type {HTMLInputElement} */
    let domInput = null;

    /** @type {boolean} */
    let show = $state(false);
    /** @type {number} */
    let index = $state(0);
    /** @type {string} */
    // let key = $state(rkey());
    /** @type {object | null} */
    let image = $state(null);
    /** @type {string | null} */
    let imageUrl = $state("unset");
    /** @type {Array} */
    let found = $state([]);
    /** @type {string} */
    let value = $state("");
    /** @type {boolean} */
    let error = $state(false);

    /** @type {boolean} */
    let playing = $state(false);
    /** @type {boolean} */
    let done = $state(false);
    /** @type {{ current: number, word: number }} */
    let points = $state({ current: 0, word: PointsPerWord });
    /** @type {number | 0} */
    let timer = $state({});

    onMount(() => {
        update();

        // ! debug
        false &&
            setTimeout(() => {
                start();

                let i = 0;
                for (const word of image.elements) {
                    setTimeout(() => {
                        value = word.no;
                        check();
                    }, 500 * i);
                    i++;
                }
            }, 500);
    });

    onDestroy(() => {
        timer?.intervalId && clearInterval(timer.intervalId);
    });

    function update() {
        image = Images[index];
        imageUrl = `url("/images/${image.image}")`;
        show = true;
    }

    /** @type {KeyboardEvent} */
    function onkeyup(event) {
        if (event.key !== "Enter") return;
        check();
    }

    /** @type {MouseEventHandler} */
    function onCheckClick(event) {
        check();
    }

    /** @type {MouseEventHandler} */
    function onStartClick() {
        start();
    }

    function start() {
        const now = Date.now();

        playing = true;

        points = { current: 0, word: 0 };

        timer = {};

        timer.start = now;
        timer.left = "00:00";

        timer.wordStart = now;

        // const total = image.elements.length * TimePerWord; // 30 seconds - per word
        const total = TimePerImage; // 30 seconds - per word

        timer.update = () => {
            if (found.length === image.elements.length) {
                done = true;
                timer?.intervalId && clearInterval(timer.intervalId);
                points.word = 0;
                // timer.left = "00:00";
                return;
            }

            const now = Date.now();

            let h = 0;
            let m = 0;
            let s = 0;
            let ms = total - (now - timer.start);

            let out = [];

            ms -= Math.round((h = Math.floor(ms / 3600000))) * 3600000;
            ms -= Math.round((m = Math.floor(ms / 60000))) * 60000;
            ms -= Math.round((s = Math.floor(ms / 1000))) * 1000;

            if (h > 0) out.push(h.toString().padStart(2, "0"));
            out.push(m.toString().padStart(2, "0"));
            out.push(s.toString().padStart(2, "0"));
            timer.left = out.join(":");

            {
                points.word = 1 - (now - timer.wordStart) / TimePerWord;
                points.word = Math.max(1, points.word * PointsPerWord);
            }
        };

        timer.update();

        timer.intervalId = setInterval(() => timer.update(), 1000 / 30);

        setTimeout(() => {
            domInput.focus();
            // domInput.select();
        });
    }

    function check() {
        if (value.trim().length === 0) return;

        const _value = value.trim().toLowerCase();

        const result = image.elements.filter(({ no }) => no.toLowerCase() === _value)[0];

        if (result) {
            const exists = found.some(({ word }) => word.toLowerCase() === result.no.toLowerCase());

            if (exists) return;

            found.push({ word: result.no, hint: result[$locale], points: points.word });
            points.current = found.reduce((pv, cv) => (pv || 0) + cv.points || 0, 0);
            value = "";
            domInput.focus();
            domInput.select();

            timer.wordStart = Date.now();

            if (found.length === image.elements.length) {
                done = true;
            }

            return;
        }

        error = true;

        domInput.focus();
        domInput.select();

        domInput.addEventListener("animationend", onanimationend);
        function onanimationend() {
            domInput.removeEventListener("animationend", onanimationend);
            error = false;
        }
    }
</script>

<div class="block" class:show class:playing class:done>
    <div class="image-found">
        <div class="image">
            <div>
                <h4 class="header">
                    <WordT key="word.image-definite" />
                </h4>
            </div>

            <div class="picture-container">
                <div class="picture" style="background-image: {imageUrl}"></div>

                <button type="button" class="start-button" onclick={onStartClick} disabled={playing}>
                    {$t("word.start", {}, "no").toUpperCase()}
                </button>
            </div>
        </div>

        <div class="found">
            <h4 style="text-align: center;">
                <WordT key={"word.guessed"} />
                <WordT key={"word.word-plural"} />:
            </h4>

            <div class="words-container">
                {#if image}
                    <p style="text-align: center;">
                        (<WordT
                            key={"game.progress-score"}
                            vars={{ current: found.length, total: image.elements.length }}
                        />)
                    </p>
                {/if}

                <div class="words-list">
                    <div class="words">
                        {#each found as { word, hint, points }, index}
                            <h4>
                                {index + 1}. <Word {word} {hint} />
                                <span class="points-tobe-received">
                                    &plus;{points.toFixed(1)}
                                </span>
                            </h4>
                        {/each}

                        {#if found.length === 0}
                            <p style="text-align: center; color: gray">
                                <WordT key={"word.no-ingen"} />
                                <WordT key={"word.word-plural"} />
                                <WordT key={"word.guessed"} />
                            </p>
                        {/if}
                    </div>
                </div>

                <div class="points">
                    {#if found.length > 0}
                        <h3 class:points-tobe-received={points.current > 0} style="text-align: right;">
                            &plus;{points.current.toFixed(1)}
                        </h3>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div class="input">
        <h4>
            <WordT key={"word.write"} />
            <WordT key={"word.word-plural"} />
            <WordT key={"word.that"} />
            <WordT key={"word.you"} />
            <WordT key={"word.see-present"} />
            <WordT key={"word.on-image-definite"} />
            (<WordT key={"word.on"} />
            <WordT key={"word.image-indefinite"} />)
        </h4>

        <div class="input-field">
            <input
                type="text"
                bind:this={domInput}
                bind:value
                class:error
                placeholder={$t("word.word", {}, "no")}
                {onkeyup}
                disabled={!playing}
            />

            <button type="button" onclick={onCheckClick} disabled={value.trim().length === 0}>
                {$t("word.check", {}, "no")} (Enter)
            </button>
        </div>

        <div class="timer">
            <h4 class="points-tobe-received" style="text-align: center;">
                &plus;{(playing ? points.word : 0).toFixed(1)}
            </h4>

            <div class="points-tobe-received-bar">
                <div style="width: {(points.word / PointsPerWord) * 100}%"></div>
            </div>

            <div class="timer-left">
                {timer?.left || "--:--"}
            </div>
        </div>
    </div>
</div>

<style>
    .block {
        display: grid;
        grid-gap: 20px;
    }

    .image-found {
        display: grid;
        grid-gap: 20px;
        grid-template-columns: 640px 300px;
    }

    .image,
    .found {
        display: grid;
        grid-gap: 8px;
    }

    .header {
        text-align: center;
    }

    .picture-container {
        position: relative;

        width: 100%;
        aspect-ratio: 16 / 9;

        display: grid;
    }

    .start-button {
        position: absolute;
        justify-self: center;
        align-self: center;

        transition: 200ms ease-in-out;
    }

    .picture {
        width: 100%;
        aspect-ratio: 16 / 9;

        border-radius: 32px;
        background: center / contain no-repeat;

        transition: 200ms ease-in-out;
    }

    .block:not(.playing) .picture {
        filter: blur(64px);
    }

    .block.playing .start-button {
        opacity: 0;
        filter: grayscale(1);
        transform: scale(1.5);
        pointer-events: none;
    }

    .found,
    .words-container,
    .words-list {
        display: grid;
        grid-gap: 8px;
        align-content: flex-start;
    }

    .found,
    .words-container,
    .words-list {
        grid-template-rows: max-content 1fr;
    }

    .words-list {
        position: relative;
    }

    .words {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .input {
        display: grid;
        grid-gap: 8px;
    }

    .input-field {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: 1fr max-content;

        font-size: larger;
    }

    .input-field input {
        text-transform: uppercase;
    }

    .input-field input.error {
        animation: InputError 500ms ease-in-out 0ms 1 forwards normal;
    }

    @keyframes InputError {
        0% {
            transform: translateX(4px);
        }
        20% {
            transform: translateX(-4px);
        }
        40% {
            transform: translateX(4px);
        }
        60% {
            transform: translateX(-4px);
        }
        80% {
            transform: translateX(4px);
        }
        100% {
            transform: translateX(-4px);
        }
    }

    /* Points / Timer ------------------------------------------------------- */
    .timer {
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        grid-gap: 12px;
        align-items: center;
    }

    .points-tobe-received {
        /* width: 54px; */
        color: green;
    }

    .points-tobe-received-bar {
        position: relative;
        width: 100%;
        height: 16px;
        border: 2px solid #9acd32;
        border-radius: 16px;
    }

    .points-tobe-received-bar > div {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #9acd32;
        transition: all 50ms ease-out;
    }

    .timer-left {
        display: grid;
        justify-content: center;
        align-content: center;

        width: 116px;
        height: 32px;
        padding: 0 16px;
        border-radius: 32px;
        background-color: #ffffff;
        color: #222222;
    }

    /* Playing! */
    .block:not(.playing) .points-tobe-received {
        color: #808080;
    }

    /* Done! */
    .block.playing.done .timer .points-tobe-received {
        color: #808080;
    }

    .block.playing.done .timer .points-tobe-received-bar {
        border-color: #808080;
    }

    .block.playing.done .timer-left {
        background-color: #808080;
    }
</style>
