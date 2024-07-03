<script lang="ts">
    import { playerPosition } from '$lib/store/player'

    $: console.log($playerPosition)
</script>