<script>
    let { player = $bindable(null) } = $props();
</script>

<div class="player">
    <button class="green" type="button" onclick={() => (player = 1)}>Spiller 1</button>
    <button class="blue" type="button" onclick={() => (player = 2)}>Spiller 2</button>
</div>

<style>
    .player {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-gap: 8px;
    }

    button {
        font-size: x-large;
    }
</style>
