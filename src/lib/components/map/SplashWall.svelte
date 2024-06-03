<script lang="ts">
    import { T } from '@threlte/core'
    import { HTML } from '@threlte/extras'
    import { pixels } from '$lib/store/wall'
    import { onMount } from 'svelte';
    import { generateRandomPixels } from '$lib/handler';


    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;

    const width = 1000;
    const height = 1000;

    onMount(() => {
        context = canvas.getContext('2d');

        const unsubscribe = pixels.subscribe(value => {
            if (context) {
                context.clearRect(0, 0, width, height);
                for (const [key, color] of Object.entries(value)) {
                    const [x, y] = key.split(',').map(Number);
                    context.fillStyle = color as string;
                    context.fillRect(x, y, 1, 1);
                }
            }
        });

        generateRandomPixels(width, height, 5000);

        return () => {
        unsubscribe();
        };
    });
</script>

<T.Mesh
    position.y={0.5}
>
    <HTML
        position.y={1.25}
        position.z={-10}
        transform
    >
        <canvas bind:this={canvas} width={width} height={height} class="bg-white"></canvas>
    </HTML>
</T.Mesh>