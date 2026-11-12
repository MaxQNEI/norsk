<script>
    import { rand } from "#lib/rand.js";

    /** @type {{ text: string, show: boolean, duration?: number, delay?: number }} */
    let { text, show, duration = 500, delay = 0 } = $props();

    /** @type {string[]} */
    let letters = $derived(text.split(""));

    function randTransfrom() {
        return rand(-40, 40);
    }
</script>

<span class="animated-letters" class:show>
    {#each letters as letter, index}
        <span
            class="letter"
            style="
                    transition-delay: {index * 150 + delay}ms;
                    --duration: {duration}ms;
                    --ttx: {randTransfrom()}px;
                    --tty: {randTransfrom()}px;
                "
        >
            {letter}
        </span>
    {/each}
</span>

<style>
    .animated-letters {
        letter-spacing: 0;
    }

    .letter {
        display: inline-block;
        opacity: 0;
        transform: translateX(var(--ttx)) translateY(var(--tty));
        transition:
            all var(--duration) ease-out,
            transform var(--duration) cubic-bezier(0.175, 0.885, 0.32, 1.275) var(--duration);
    }

    .animated-letters.show .letter {
        opacity: 1;
        transform: translateX(0) translateY(0);
    }
</style>
