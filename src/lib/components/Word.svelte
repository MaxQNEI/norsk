<script>
    import { onMount } from "svelte";

    let { word, hint } = $props();

    /** @type {HTMLButtonElement} */
    let domRoot = null;
    /** @type {boolean} */
    let show = $state(false);

    onMount(() => {
        position();
    });

    function position() {
        /** @type {HTMLSpanElement} */
        const domHint = domRoot.querySelector(".hint");
        /** @type {HTMLSpanElement} */
        const domText = domRoot.querySelector(".text");

        const { width: hintWidth, height: hintHeight } = domHint.getBoundingClientRect();
        const { width: textWidth, height: textHeight } = domText.getBoundingClientRect();

        let left = (textWidth - hintWidth) / 2;

        domHint.style.setProperty("left", `${left} px`);
        domHint.style.setProperty("bottom", `${textHeight + 8}px`);

        if (domHint.getBoundingClientRect().top <= 0) {
            let top = (textHeight - hintHeight) / 2;
            let left = textWidth + 8;

            domHint.style.setProperty("left", `${left}px`);
            domHint.style.setProperty("top", `${top}px`);
            domHint.style.removeProperty("bottom");
        }
    }

    function onpointerover(event) {
        show = true;

        position();
    }

    function onpointerleave(event) {
        show = false;
    }
</script>

<span bind:this={domRoot} role="application" class="word" {onpointerover} {onpointerleave}>
    <span class="hint" class:show>{hint.toUpperCase()}</span>
    <span class="text">{word.toUpperCase()}</span>
</span>

<style>
    .word {
        margin: unset;
        padding: unset;
        border: unset;
        background: unset;
        color: inherit;

        position: relative;

        cursor: default;
    }

    .hint {
        position: absolute;
        z-index: 1;

        padding: 4px 8px;
        border: 1px solid #444444;
        background-color: #111111;
        color: #ffffff;
        box-shadow: 0 0 4px var(--shadow-color);

        white-space: pre;

        pointer-events: none;
        opacity: 0;

        transition: all 500ms ease;
    }

    .hint.show {
        opacity: 1;
    }

    .text {
        text-decoration: 1px underline dashed;
    }

    .word:hover .text {
        color: dodgerblue;
        text-decoration-color: dodgerblue;
    }
</style>
